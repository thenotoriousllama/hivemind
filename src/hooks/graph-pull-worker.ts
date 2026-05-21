#!/usr/bin/env node

/**
 * Detached background worker for auto-pull on SessionStart.
 *
 * Invoked via `nohup node graph-pull-worker.js --cwd <cwd>` from each
 * agent's SessionStart hook (claude-code / codex / cursor / hermes). The
 * parent hook calls `.unref()` and exits immediately — this worker keeps
 * running, calls pullSnapshot(cwd), writes the snapshot if cloud is
 * fresher than local, and exits.
 *
 * Async-on-SessionStart tradeoff (deliberate, per design discussion):
 *   - Pro: SessionStart returns instantly. No multi-hundred-ms tax on
 *     every session open.
 *   - Con: the CURRENT session sees the PRE-pull state in graphContextLine
 *     and in any `~/.deeplake/graph/` reads. The next SessionStart picks
 *     up the freshly-pulled state.
 *   In practice the freshness gap is one session boundary (typically
 *   minutes), which is fine. Users who need an immediate pull can run
 *   `hivemind graph pull` manually.
 *
 * The worker is intentionally detached + silent to the user: stdio is
 * ignored, output goes to a per-repo log file
 * (~/.hivemind/graphs/<key>/.graph-pull.log) only when DEBUG is wanted.
 * Never writes to stdout/stderr — the spawning parent has detached and
 * any output would go nowhere useful.
 *
 * Disable via HIVEMIND_GRAPH_PULL=0 (read by pullSnapshot itself; the
 * worker still spawns but exits in the skipped-disabled branch).
 */

import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { pullSnapshot } from "../graph/deeplake-pull.js";
import { deriveProjectKey } from "../utils/repo-identity.js";
import { repoDir } from "../graph/snapshot.js";

function getArg(name: string): string | null {
  const idx = process.argv.indexOf(name);
  if (idx === -1 || idx + 1 >= process.argv.length) return null;
  return process.argv[idx + 1]!;
}

/**
 * Hard wall-clock timeout for the worker. The DeeplakeApi fetch() path
 * does NOT install an AbortSignal on its HTTP requests (codex P1 in this
 * commit: graph-pull-worker.ts citing src/deeplake-api.ts:413), so a
 * network stall, blackholed connection, or stuck proxy could leave this
 * worker waiting indefinitely. With repeated SessionStart events (think
 * `claude -p` in a tight scripted loop), detached workers would
 * accumulate. We bound the lifetime here so the worst case is N
 * concurrent workers, each capped at WORKER_TIMEOUT_MS.
 *
 * 30 seconds is generous for a pull: SELECT ~300-500ms + ~1 MB download
 * over a slow link still fits well under it, and a real network failure
 * shows up well before. Tuneable via HIVEMIND_GRAPH_PULL_TIMEOUT_MS.
 */
function workerTimeoutMs(): number {
  const raw = process.env.HIVEMIND_GRAPH_PULL_TIMEOUT_MS;
  if (raw === undefined) return 30_000;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 30_000;
}

async function main(): Promise<void> {
  const cwd = getArg("--cwd") ?? process.cwd();
  const t0 = Date.now();

  // Top-level timeout: race pullSnapshot against a deadline. If
  // pullSnapshot doesn't complete in time, log + exit forcibly. The
  // dangling promise stays unresolved until the process exits (which
  // happens right after), so no leak — just a forced shutdown.
  const timeoutPromise = new Promise<"timeout">((resolve) => {
    setTimeout(() => resolve("timeout"), workerTimeoutMs()).unref();
  });

  let logLine: string;
  try {
    const outcome = await Promise.race([pullSnapshot(cwd), timeoutPromise]);
    if (outcome === "timeout") {
      const dur = Date.now() - t0;
      logLine = `[${new Date().toISOString()}] timeout (${dur}ms) — pullSnapshot did not return within ${workerTimeoutMs()}ms; forcing exit\n`;
      // Write the log line synchronously then exit, bypassing the
      // unreachable `outcome` branches below.
      try {
        const { key } = deriveProjectKey(cwd);
        const dir = repoDir(key);
        mkdirSync(dir, { recursive: true });
        appendFileSync(join(dir, ".graph-pull.log"), logLine);
      } catch {
        // best-effort
      }
      process.exit(0);
    }
    // TS narrows `outcome` to PullOutcome after the early return above.
    const dur = Date.now() - t0;
    const extras: string[] = [];
    if (outcome.kind === "pulled") {
      extras.push(`commit=${outcome.commitSha.slice(0, 7)}`);
      extras.push(`bytes=${outcome.bytes}`);
      extras.push(`sha256=${outcome.snapshotSha256.slice(0, 12)}`);
    } else if (outcome.kind === "up-to-date") {
      extras.push(`commit=${outcome.commitSha.slice(0, 7)}`);
    } else if (outcome.kind === "local-newer") {
      extras.push(`commit=${outcome.commitSha.slice(0, 7)}`);
      extras.push(`localTs=${outcome.localTs}`);
      extras.push(`cloudTs=${outcome.cloudTs}`);
    } else if (outcome.kind === "no-cloud-row") {
      extras.push(`commit=${outcome.commitSha.slice(0, 7)}`);
    } else if (outcome.kind === "error") {
      extras.push(outcome.message);
    }
    logLine = `[${new Date().toISOString()}] ${outcome.kind} (${dur}ms)` +
      (extras.length ? ` — ${extras.join(" ")}` : "") + "\n";
  } catch (err) {
    const dur = Date.now() - t0;
    logLine = `[${new Date().toISOString()}] threw ${err instanceof Error ? err.message : String(err)} (${dur}ms)\n`;
  }

  // Best-effort write to per-repo log. Silently swallow any errors —
  // the worker is detached and there's no one to report to.
  try {
    const { key } = deriveProjectKey(cwd);
    const dir = repoDir(key);
    mkdirSync(dir, { recursive: true });
    appendFileSync(join(dir, ".graph-pull.log"), logLine);
  } catch {
    // best-effort
  }
}

// Top-level catch so an unhandled rejection can't escape — the parent
// is detached, an uncaught throw would just produce a zombie log line.
main().catch(() => { process.exit(0); });
