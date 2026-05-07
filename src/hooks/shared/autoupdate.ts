/**
 * Shared autoupdate helper for session-start hooks.
 *
 * One source of truth: the npm package `@deeplake/hivemind`.
 * One mechanism: the `hivemind update` CLI, the same command users run
 * manually. Session-start is just the *trigger*.
 *
 * Replaces the divergent legacy paths:
 *   - Claude Code:   `claude plugin update hivemind@hivemind --scope X`
 *                    against marketplace + GitHub raw `package.json`
 *   - Codex:         `git clone --branch v<latest>` + cp into ~/.codex/hivemind
 *                    against GitHub raw `package.json`
 *   - OpenClaw:      ClawHub registry version check + advice text
 *
 * Cursor / Hermes / pi previously had no autoupdate at all; they pick it
 * up for free here.
 *
 * ## Hot-path constraint: NEVER block session-start
 *
 * Real-world testing 2026-05-06 surfaced a destructive bug: an awaited
 * `hivemind update` spawn added 3-5s latency to every session start (the
 * spawned process always fetches the npm registry, ~500ms typical, up to
 * 3s+ on slow links). User flagged "destructive". Hard rule: no awaited
 * spawns, no awaited fetches, on the session-start hot path.
 *
 * Implementation: fire-and-forget detached spawn. The hook returns
 * immediately (sub-50ms). The spawned `hivemind update` process runs
 * fully detached (`child.unref()`) and survives the parent's exit. The
 * upgrade outcome is delivered on the NEXT session start, when
 * `getInstalledVersion()` reads the freshly-upgraded plugin.json.
 *
 * The lock that prevents concurrent `hivemind update` runs no longer
 * lives here (we'd release it instantly after dispatching, defeating
 * its purpose). It lives in `src/cli/update.ts:runUpdate()` — the
 * long-running update process owns the lock for its lifetime.
 *
 * Cache: a single mtime check on `~/.deeplake/.autoupdate-last-check`
 * keeps us from spawning on every session-start. Spawn fires at most
 * once per CACHE_TTL_MS (4h). The spawn itself is cheap (<10ms to
 * dispatch) but firing 100×/day for a typical heavy user adds up; the
 * cache cuts that to ~6×/day.
 */

import { spawn } from "node:child_process";
import { existsSync, statSync, utimesSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import type { Credentials } from "../../commands/auth-creds.js";
import { log as _log } from "../../utils/debug.js";

const log = (msg: string) => _log("autoupdate", msg);

// Lazy: homedir() reads $HOME at call time, but capturing it at module
// load would freeze the path before tests can override process.env.HOME.
function lastCheckPath(): string {
  return join(homedir(), ".deeplake", ".autoupdate-last-check");
}
const CACHE_TTL_MS = 4 * 60 * 60_000;  // 4 hours

export type AgentId = "claude" | "codex" | "cursor" | "hermes" | "pi" | "openclaw";

export interface AutoUpdateOpts {
  agent: AgentId;
  /** Test override: resolved hivemind binary path or null. When provided, skips the `which` lookup. */
  hivemindBinaryPath?: string | null;
  /** Test override: replaces the actual subprocess spawn with a fake. Must return the spawned child's pid (or 0). */
  spawn?: (cmd: string, args: string[]) => { pid?: number };
  /** Test override: skip the 4h-cache check (force the spawn even if recently checked). */
  skipCache?: boolean;
}

/**
 * Default detached spawn — fire-and-forget. The child process inherits no
 * stdio, becomes its own session leader (`detached: true`), and is
 * `unref`-ed so the parent can exit without waiting for it. Real Node
 * semantics: this returns in < 5ms in practice (process fork is the only
 * blocking cost, and it's cheap).
 */
const defaultSpawn = (cmd: string, args: string[]): { pid?: number } => {
  const child = spawn(cmd, args, {
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  // Swallow the unhandled 'error' event that fires synchronously when
  // the binary doesn't exist — without this listener it'd crash the
  // parent process.
  child.on("error", () => {});
  return { pid: child.pid };
};

/** Find the hivemind binary on PATH synchronously. ~5ms; on the hot path. */
function findHivemindOnPath(): string | null {
  // node:os doesn't expose `which`. Walk PATH manually — sync, fast,
  // no subprocess.
  const PATH = process.env.PATH ?? "";
  const dirs = PATH.split(":").filter(Boolean);
  for (const dir of dirs) {
    const candidate = join(dir, "hivemind");
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

/** Return true if we checked recently and should skip this round. */
function recentlyChecked(): boolean {
  try {
    const age = Date.now() - statSync(lastCheckPath()).mtimeMs;
    return age < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

/** Touch the last-check file so the next call respects the TTL. */
function touchLastCheck(): void {
  const path = lastCheckPath();
  try {
    mkdirSync(dirname(path), { recursive: true });
    if (existsSync(path)) {
      const now = Date.now() / 1000;
      utimesSync(path, now, now);
    } else {
      writeFileSync(path, "");
    }
  } catch {
    /* non-fatal — at worst we spawn next session too */
  }
}

/**
 * Trigger an autoupdate check. Best-effort, fire-and-forget. Returns
 * synchronously (sub-50ms) — never blocks the session-start hook on
 * network or subprocess I/O.
 *
 * The actual upgrade work (npm install -g + re-exec install) happens
 * inside the detached `hivemind update` process. If that process
 * upgrades the install, the user sees the new version on the NEXT
 * session start (when `getInstalledVersion()` reads the freshly-
 * upgraded plugin.json).
 *
 * Returns void; declared async so the call sites can `await` it
 * without changing their structure (the await is a no-op functionally
 * but makes the call site uniform with other async hook helpers).
 */
export async function autoUpdate(
  creds: Credentials | null,
  opts: AutoUpdateOpts,
): Promise<void> {
  const t0 = Date.now();
  log(`agent=${opts.agent} entered`);
  if (!creds?.token) { log(`agent=${opts.agent} skip: no creds.token (${Date.now() - t0}ms)`); return; }
  if (creds.autoupdate === false) { log(`agent=${opts.agent} skip: autoupdate=false (${Date.now() - t0}ms)`); return; }

  // Cache: we check at most once per CACHE_TTL_MS to avoid spawning a
  // process on every session-start. Tests can pass `skipCache: true` to
  // force the spawn.
  if (!opts.skipCache && recentlyChecked()) {
    log(`agent=${opts.agent} skip: checked recently (within ${CACHE_TTL_MS / 60_000}min) (${Date.now() - t0}ms)`);
    return;
  }

  const binaryPath = opts.hivemindBinaryPath !== undefined
    ? opts.hivemindBinaryPath
    : findHivemindOnPath();
  if (!binaryPath) { log(`agent=${opts.agent} skip: hivemind binary not on PATH (${Date.now() - t0}ms)`); return; }

  log(`agent=${opts.agent} binary=${binaryPath} → dispatching detached update`);
  const spawnFn = opts.spawn ?? defaultSpawn;
  let pid: number | undefined;
  try {
    pid = spawnFn(binaryPath, ["update"]).pid;
  } catch (e: any) {
    log(`agent=${opts.agent} dispatch threw: ${e?.message ?? e} (${Date.now() - t0}ms)`);
    return;
  }
  // Mark the check timestamp BEFORE we know whether the spawned process
  // succeeds — the goal of the cache is "rate-limit our trigger", not
  // "rate-limit successful updates". Even if the spawned process fails,
  // it'll fail on every session-start within the TTL window without the
  // touch.
  touchLastCheck();
  log(`agent=${opts.agent} dispatched (pid=${pid ?? "?"}) (${Date.now() - t0}ms total)`);
}
