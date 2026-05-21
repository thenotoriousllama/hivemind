/**
 * Last-build state file (Phase 1.5).
 *
 * Written by writeSnapshot after each successful build:
 *   ~/.hivemind/graphs/<repo-key>/.last-build.json
 *     { ts: epoch_ms, commit_sha: string | null, snapshot_sha256: string }
 *
 * Read by the SessionEnd auto-build hook (src/hooks/graph-on-stop.ts) to gate
 * auto-rebuilds on:
 *   - rate limit (now - ts >= TICK_INTERVAL_MS)
 *   - new commit (HEAD != commit_sha)
 *   - source file diff (git diff --name-only ... -- '<src-globs>' | wc -l >= 1)
 *
 * Best-effort I/O: a missing or corrupt file is treated as "never built";
 * write failures are swallowed so a cache problem can't break the build.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface LastBuildState {
  /** Epoch milliseconds. */
  ts: number;
  /** HEAD commit at build time. null when not in a git repo. */
  commit_sha: string | null;
  /** Content fingerprint of the snapshot that was written (NOT including observation). */
  snapshot_sha256: string;
  /**
   * Optional: snapshot.nodes.length captured at write time. Read by
   * src/graph/session-context.ts to compose the SessionStart inject line
   * WITHOUT having to parse the full ~1 MB snapshot on every session. Absent
   * on files written by builds older than this field; readers treat
   * undefined as "unknown".
   */
  node_count?: number;
  /** Optional: snapshot.links.length captured at write time. See node_count. */
  edge_count?: number;
}

/**
 * Returns the per-worktree state path when `worktreeId` is provided, or the
 * legacy root path otherwise.
 *
 * Two worktrees of the same project on the same machine share `baseDir`
 * (repo_key is derived from the git remote URL, not the cwd). Without
 * worktree partitioning, two checkouts at different commits would
 * overwrite each other's `.last-build.json` — the SessionStart inject
 * would then show the *other* worktree's commit/sha as if it were mine,
 * and any code that resolves "snapshot file for last build" would point
 * at the wrong snapshot. Sub-dirring by worktreeId fixes that.
 *
 * The legacy (no-worktreeId) path is kept ONLY for tests that don't
 * exercise the multi-worktree behavior — production callers ALWAYS pass
 * worktreeId.
 */
export function lastBuildPath(baseDir: string, worktreeId?: string): string {
  if (worktreeId !== undefined) {
    return join(baseDir, "worktrees", worktreeId, ".last-build.json");
  }
  return join(baseDir, ".last-build.json");
}

/**
 * Persist last-build state. Atomic via temp+rename in the same directory.
 * Errors are swallowed: a failure to write the state file should NOT roll
 * back a successful snapshot write (the snapshot is the source of truth).
 */
export function writeLastBuild(baseDir: string, state: LastBuildState, worktreeId?: string): void {
  const path = lastBuildPath(baseDir, worktreeId);
  try {
    mkdirSync(dirname(path), { recursive: true });
    const tmp = `${path}.tmp.${process.pid}.${Date.now()}`;
    writeFileSync(tmp, JSON.stringify(state));
    renameSync(tmp, path);
  } catch {
    // best-effort
  }
}

/**
 * Load last-build state. Returns null on missing file, parse failure, or
 * shape mismatch — caller treats null as "never built".
 */
export function readLastBuild(baseDir: string, worktreeId?: string): LastBuildState | null {
  // Migration-friendly read order:
  //   1. New per-worktree path (production callers all pass worktreeId now)
  //   2. Fallback to legacy root path — covers (a) tests that don't pass
  //      worktreeId and (b) users with pre-fix singletons still at root
  //      from builds before this fix landed. The next writeSnapshot /
  //      pullSnapshot will materialize the new path, after which the old
  //      file becomes orphaned cruft.
  let path = lastBuildPath(baseDir, worktreeId);
  if (!existsSync(path)) {
    if (worktreeId === undefined) return null;
    const legacy = lastBuildPath(baseDir, undefined);
    if (!existsSync(legacy)) return null;
    path = legacy;
  }
  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (parsed === null || typeof parsed !== "object") return null;
  const o = parsed as Partial<LastBuildState>;
  if (typeof o.ts !== "number") return null;
  if (o.commit_sha !== null && typeof o.commit_sha !== "string") return null;
  if (typeof o.snapshot_sha256 !== "string") return null;
  // Note: hash *shape* is NOT validated here. The gate hook
  // (src/hooks/graph-on-stop.ts) only compares commit_sha for equality and
  // doesn't care if it's hex. Strict hash validation belongs at the
  // SessionStart inject boundary (src/graph/session-context.ts) where the
  // string actually flows into the model's system prompt.
  const out: LastBuildState = { ts: o.ts, commit_sha: o.commit_sha, snapshot_sha256: o.snapshot_sha256 };
  // Optional counts: accept finite non-negative numbers, drop anything else.
  if (typeof o.node_count === "number" && Number.isFinite(o.node_count) && o.node_count >= 0) {
    out.node_count = o.node_count;
  }
  if (typeof o.edge_count === "number" && Number.isFinite(o.edge_count) && o.edge_count >= 0) {
    out.edge_count = o.edge_count;
  }
  return out;
}
