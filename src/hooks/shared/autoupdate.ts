/**
 * Shared autoupdate helper for session-start hooks.
 *
 * One source of truth: the npm package `@deeplake/hivemind`.
 * One mechanism: shell out to the `hivemind update` CLI, the same command
 * users run manually. Session-start is just the *trigger*.
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
 * Behavior:
 *   - No-op if creds.autoupdate === false (user opted out via
 *     `hivemind autoupdate off`)
 *   - No-op if the `hivemind` binary isn't on PATH (user installed via
 *     marketplace / ClawHub only — they stay on the legacy path until they
 *     migrate to npm)
 *   - Otherwise: spawn `hivemind update`, capture output, print a one-line
 *     summary to stderr if anything changed. Failures are silent so a
 *     broken network never blocks session-start.
 *
 * The trigger is per-agent (each agent's session-start), but the action
 * is universal: `hivemind update` runs `npm install -g @latest` then
 * re-execs `hivemind install --skip-auth`, refreshing every detected
 * agent on the machine in one shot. So when Claude opens, Codex /
 * Cursor / Hermes / pi / OpenClaw all get refreshed too.
 */

import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import type { Credentials } from "../../commands/auth-creds.js";
import { log as _log } from "../../utils/debug.js";

const execFileAsync = promisify(execFile);
const log = (msg: string) => _log("autoupdate", msg);

export type AgentId = "claude" | "codex" | "cursor" | "hermes" | "pi" | "openclaw";

const RESTART_HINT: Record<AgentId, string> = {
  claude:   "Run /reload-plugins to apply.",
  codex:    "Restart Codex to apply.",
  cursor:   "Restart Cursor to apply.",
  hermes:   "Restart Hermes to apply.",
  pi:       "Restart pi to apply.",
  openclaw: "Restart OpenClaw to apply.",
};

export interface SpawnResult {
  stdout: string;
  stderr: string;
  code: number;
}

export interface AutoUpdateOpts {
  agent: AgentId;
  /** Per-call timeout for `hivemind update`. Default 90s — npm install -g + re-exec install can take 30-60s on a slow link. */
  timeoutMs?: number;
  /** Test override: resolved hivemind binary path or null. When provided, skips the `which` lookup. */
  hivemindBinaryPath?: string | null;
  /** Test override: replaces the actual subprocess spawn with a fake. */
  spawn?: (cmd: string, args: string[], timeoutMs: number) => Promise<SpawnResult>;
  /** Test override: replaces the stderr writer (so we can assert on the summary line). */
  stderr?: (msg: string) => void;
}

const defaultStderr = (msg: string) => process.stderr.write(msg);

const defaultSpawn = (cmd: string, args: string[], timeoutMs: number): Promise<SpawnResult> =>
  new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], timeout: timeoutMs });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", d => { stdout += d.toString(); });
    child.stderr.on("data", d => { stderr += d.toString(); });
    child.on("close", code => resolve({ stdout, stderr, code: code ?? 1 }));
    child.on("error", () => resolve({ stdout, stderr, code: 1 }));
  });

async function findHivemindOnPath(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync("which", ["hivemind"], { timeout: 2000 });
    const path = stdout.trim();
    return path.length > 0 ? path : null;
  } catch {
    return null;
  }
}

/**
 * Extract the one-line summary that `hivemind update` prints. Looking
 * for (in order of specificity):
 *   - "Updated to X.Y.Z."             — successful upgrade
 *   - "Update available: X → Y"       — couldn't apply (e.g. local-dev)
 *   - "is up to date"                 — no-op
 * Returns null if none of those phrases appear (probably an error).
 */
export function extractUpdateSummary(combined: string): string | null {
  const lines = combined.split(/\r?\n/);
  for (const re of [/Updated to .+\./, /Update available: .+/, /is up to date/]) {
    const hit = lines.map(l => l.trim()).find(l => re.test(l));
    if (hit) return hit;
  }
  return null;
}

/**
 * Run an autoupdate check + apply. Best-effort: never throws, never
 * blocks past `timeoutMs`. Returns nothing — the session-start hook
 * should not branch on the outcome (it's purely a side channel).
 */
export async function autoUpdate(
  creds: Credentials | null,
  opts: AutoUpdateOpts,
): Promise<void> {
  log(`agent=${opts.agent} entered`);
  if (!creds?.token) { log(`agent=${opts.agent} skip: no creds.token`); return; }
  if (creds.autoupdate === false) { log(`agent=${opts.agent} skip: autoupdate=false`); return; }

  const stderr = opts.stderr ?? defaultStderr;
  const timeoutMs = opts.timeoutMs ?? 90_000;

  const binaryPath = opts.hivemindBinaryPath !== undefined
    ? opts.hivemindBinaryPath
    : await findHivemindOnPath();
  if (!binaryPath) { log(`agent=${opts.agent} skip: hivemind binary not on PATH`); return; }
  log(`agent=${opts.agent} binary=${binaryPath} → spawning update`);

  const spawnFn = opts.spawn ?? defaultSpawn;
  let result: SpawnResult;
  try {
    result = await spawnFn(binaryPath, ["update"], timeoutMs);
  } catch (e: any) {
    log(`agent=${opts.agent} spawn threw: ${e?.message ?? e}`);
    return;
  }
  log(`agent=${opts.agent} spawn done: code=${result.code} stdout=${result.stdout.length}B stderr=${result.stderr.length}B`);

  // Treat unrecognized output (e.g. "Unknown command: update" from a
  // pre-PR-#91 binary) as silent — we don't surface command-not-found
  // noise to users who happen to have an older `hivemind` on PATH.
  if (result.code !== 0 && !/Update available/.test(result.stderr + result.stdout)) {
    return;
  }
  const summary = extractUpdateSummary(result.stdout + "\n" + result.stderr);
  if (!summary) return;

  // Surface upgrade outcomes; suppress "is up to date" (common case,
  // would spam stderr on every session-start).
  if (/Updated to/.test(summary)) {
    stderr(`✅ Hivemind ${summary} ${RESTART_HINT[opts.agent]}\n`);
  } else if (/Update available/.test(summary)) {
    stderr(`⬆️ Hivemind: ${summary}\n`);
  }
}
