/**
 * SessionStart auto-pull of skills from the org's `skills` Deeplake table.
 *
 * Why: teammates mine reusable skills constantly via the skillify worker. Without
 * an auto-pull, every user has to remember to run `hivemind skillify pull
 * --all-users --to global` themselves. This module wires the pull into every
 * agent's SessionStart hook so freshly-mined skills become available without
 * manual intervention.
 *
 * Cadence + safety:
 *   - Throttled by `~/.deeplake/state/skillify/autopull-last-run.json`. Default
 *     window 30 minutes; configurable via `HIVEMIND_AUTOPULL_INTERVAL_MIN`
 *     (0 = run every session, -1 = disable entirely).
 *   - Bounded by a 5-second timeout (overridable in tests via `timeoutMs`).
 *     A slow Deeplake never freezes SessionStart.
 *   - All failures swallowed — SessionStart must succeed regardless. The
 *     last-run timestamp is only updated on a successful pull, so a failed
 *     attempt is naturally retried on the next SessionStart.
 *   - Hard opt-out via `HIVEMIND_AUTOPULL_DISABLED=1`.
 *   - Not-logged-in is a silent skip (no nag).
 *
 * Scope: install=global, users=[] (all-users), force=false. The result is
 * exactly equivalent to `hivemind skillify pull --all-users --to global`.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { loadConfig, type Config } from "../config.js";
import { DeeplakeApi } from "../deeplake-api.js";
import { runPull, type QueryFn } from "./pull.js";
import { migrateLegacyStateDir } from "./legacy-migration.js";
import { log as _log } from "../utils/debug.js";

const log = (msg: string) => _log("skillify-autopull", msg);

// Resolved lazily so tests can pin HOME after import. Mirrors the pattern
// used by src/skillify/pull.ts:resolvePullDestination().
function stateDir(): string {
  return join(homedir(), ".deeplake", "state", "skillify");
}
function timestampFile(): string {
  return join(stateDir(), "autopull-last-run.json");
}

const DEFAULT_INTERVAL_MIN = 30;
const DEFAULT_TIMEOUT_MS = 5_000;

export interface AutoPullResult {
  pulled: number;
  skipped: boolean;
  reason?: string;
}

interface TimestampFile {
  /** epoch ms of the last successful pull */
  lastRunMs: number;
}

export interface AutoPullDeps {
  /** Inject loadConfig (defaults to the real one). Tests pass a fixture/null. */
  loadConfigFn?: () => Config | null;
  /** Inject the SQL query function. Tests skip the network entirely with this. */
  queryFn?: QueryFn;
  /** Override the pull timeout for tests. */
  timeoutMs?: number;
  /** Override "now" (epoch ms). Tests can pin the clock. */
  nowMs?: () => number;
  /** Override the install location. Defaults to "global"; tests use "project". */
  install?: "global" | "project";
  /** Working dir when install=project (tests). Ignored otherwise. */
  cwd?: string;
}

/** Read interval window in ms from the env. -1 disables; 0 runs every session. */
export function readIntervalMs(): number {
  const raw = process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN;
  // Anything we can't parse → default. Negative → disabled signal handled by caller.
  if (raw === undefined || raw === "") return DEFAULT_INTERVAL_MIN * 60_000;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_INTERVAL_MIN * 60_000;
  // Allow integer minutes; coerce to ms. -1 stays -1 so caller can branch.
  return Math.trunc(n) * 60_000;
}

/** Read the persisted last-run timestamp. Missing/malformed → null. */
export function readLastRun(): number | null {
  migrateLegacyStateDir();
  const path = timestampFile();
  if (!existsSync(path)) return null;
  try {
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as Partial<TimestampFile>;
    if (typeof parsed.lastRunMs !== "number" || !Number.isFinite(parsed.lastRunMs)) return null;
    return parsed.lastRunMs;
  } catch {
    return null;
  }
}

/**
 * Atomic-rename write so a crashed/interrupted SessionStart can never
 * leave a half-written timestamp file behind. Mirrors src/skillify/state.ts.
 */
export function writeLastRun(lastRunMs: number): void {
  migrateLegacyStateDir();
  const dir = stateDir();
  const path = timestampFile();
  mkdirSync(dir, { recursive: true });
  const tmp = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify({ lastRunMs } satisfies TimestampFile));
  renameSync(tmp, path);
}

/** Bound a promise by `ms` milliseconds. Reject with a tagged error on timeout. */
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`autopull timeout after ${ms}ms`)), ms);
    // Don't keep the event loop alive solely for this timer.
    if (typeof timer.unref === "function") timer.unref();
  });
  return Promise.race([p, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

/**
 * Top-level entry. Decides whether to skip (env / throttle / not-logged-in)
 * and otherwise runs a bounded, all-failures-swallowed pull.
 *
 * Always resolves; never rejects. The return value is informational only.
 */
export async function maybeAutoPull(deps: AutoPullDeps = {}): Promise<AutoPullResult> {
  const now = (deps.nowMs ?? Date.now)();

  // Hard opt-out: env flag short-circuits before any disk / config read.
  if (process.env.HIVEMIND_AUTOPULL_DISABLED === "1") {
    log("disabled via HIVEMIND_AUTOPULL_DISABLED=1");
    return { pulled: 0, skipped: true, reason: "disabled" };
  }

  const intervalMs = readIntervalMs();
  if (intervalMs < 0) {
    log("disabled via HIVEMIND_AUTOPULL_INTERVAL_MIN=-1");
    return { pulled: 0, skipped: true, reason: "disabled" };
  }

  // Throttle: skip if last run is within the window. intervalMs === 0 always
  // bypasses throttle (force pull every session).
  if (intervalMs > 0) {
    const last = readLastRun();
    if (last !== null && now - last < intervalMs) {
      const remainingMs = intervalMs - (now - last);
      log(`throttled (last run ${now - last}ms ago, window ${intervalMs}ms, ${remainingMs}ms remaining)`);
      return { pulled: 0, skipped: true, reason: "throttled" };
    }
  }

  // Not logged in → silent skip (no nag, no timestamp update).
  const loadFn = deps.loadConfigFn ?? loadConfig;
  const config = loadFn();
  if (!config) {
    log("skipped: not logged in");
    return { pulled: 0, skipped: true, reason: "not-logged-in" };
  }

  // Build the query function. Tests inject one; real callers get the API client.
  let query: QueryFn;
  if (deps.queryFn) {
    query = deps.queryFn;
  } else {
    const api = new DeeplakeApi(
      config.token,
      config.apiUrl,
      config.orgId,
      config.workspaceId,
      config.skillsTableName,
    );
    query = (sql: string) => api.query(sql) as Promise<Record<string, unknown>[]>;
  }

  const install = deps.install ?? "global";
  const timeoutMs = deps.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    const summary = await withTimeout(
      runPull({
        query,
        tableName: config.skillsTableName,
        install,
        cwd: install === "project" ? (deps.cwd ?? process.cwd()) : undefined,
        users: [],
        dryRun: false,
        force: false,
      }),
      timeoutMs,
    );
    // Only update the timestamp on a successful pull. A failed pull stays
    // un-throttled so the next SessionStart retries.
    try { writeLastRun(now); }
    catch (e: any) { log(`writeLastRun failed (non-fatal): ${e?.message ?? e}`); }
    log(`pulled scanned=${summary.scanned} wrote=${summary.wrote} skipped=${summary.skipped}`);
    return { pulled: summary.wrote, skipped: false };
  } catch (e: any) {
    log(`pull failed (swallowed): ${e?.message ?? e}`);
    return { pulled: 0, skipped: true, reason: "error" };
  }
}
