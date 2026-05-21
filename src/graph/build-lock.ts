/**
 * Cross-process build lock for the graph auto-build hook.
 *
 * The hook is registered under BOTH "Stop" (per-turn in interactive Claude
 * sessions) and "SessionEnd" (once at close, also fires in `claude -p`).
 * Without a lock, two async processes can fire near-simultaneously at
 * session close — both read the stale .last-build.json, both decide FIRE,
 * both run the full build in parallel. Codex review caught this; the
 * dropped-Stop workaround lost interactive per-turn rebuilds. This lock
 * lets us register on both events again.
 *
 * Lock file: ~/.hivemind/graphs/<repo-key>/.build.in-flight
 * Format: { pid: number, ts: epoch_ms } (best-effort JSON; format does
 * not affect correctness — the file's EXISTENCE is the lock).
 *
 * Acquire: atomic create via `writeFileSync(path, ..., { flag: 'wx' })`.
 *   - 'wx' = O_CREAT | O_EXCL — fails with EEXIST if the file is already
 *     there. Two simultaneous calls: only one wins.
 *   - On EEXIST, check the file's mtime: if older than STALE_LOCK_MS,
 *     treat as a crashed previous process and take over (overwrite).
 *
 * Release: unlink. Best-effort; if the process crashes before release,
 * the stale-lock recovery on next acquire handles it.
 */

import { mkdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/** How long a lock can exist before we treat it as abandoned. 5 min is
 *  longer than any conceivable build we should support (2.5s warm,
 *  ~3 min on a 50k-file monorepo without cache). */
const STALE_LOCK_MS = 5 * 60 * 1000;

export function lockPath(baseDir: string): string {
  return join(baseDir, ".build.in-flight");
}

export interface LockResult {
  acquired: boolean;
  reason: "acquired" | "held-by-other" | "stale-recovered" | "fs-error";
}

/**
 * Try to acquire the build lock. Atomic on POSIX via O_CREAT|O_EXCL.
 *
 * Returns:
 *   - acquired=true,  reason="acquired"        — fresh lock
 *   - acquired=true,  reason="stale-recovered" — previous holder crashed
 *   - acquired=false, reason="held-by-other"   — another process is building
 *   - acquired=false, reason="fs-error"        — something else went wrong
 */
export function acquireBuildLock(baseDir: string): LockResult {
  const path = lockPath(baseDir);
  // First-ever build: baseDir doesn't exist yet. Create it so the lock
  // can be placed. mkdir is idempotent (recursive); failure here means
  // the lock can't be placed for some other reason (permissions, disk),
  // and we return fs-error.
  try {
    mkdirSync(baseDir, { recursive: true });
  } catch {
    return { acquired: false, reason: "fs-error" };
  }
  try {
    writeFileSync(path, JSON.stringify({ pid: process.pid, ts: Date.now() }), { flag: "wx" });
    return { acquired: true, reason: "acquired" };
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code !== "EEXIST") {
      // Filesystem error (disk full, permission, etc.). Don't take over —
      // we don't know the state. The caller should skip the build.
      return { acquired: false, reason: "fs-error" };
    }
  }
  // Lock exists. Check staleness.
  try {
    const stat = statSync(path);
    const ageMs = Date.now() - stat.mtime.getTime();
    if (ageMs > STALE_LOCK_MS) {
      // Previous holder crashed or hung. Overwrite the lock and take over.
      // This is a benign race with another stale-recoverer: both write the
      // same content style; mtime is what matters next time.
      writeFileSync(path, JSON.stringify({ pid: process.pid, ts: Date.now() }));
      return { acquired: true, reason: "stale-recovered" };
    }
  } catch {
    // statSync failed — the lock might have been released between our wx
    // attempt and the stat. Bail out; the next caller can try again.
    return { acquired: false, reason: "fs-error" };
  }
  return { acquired: false, reason: "held-by-other" };
}

/**
 * Release the build lock. Idempotent; missing file is not an error.
 * Best-effort: if unlink fails for any other reason, the next acquire
 * will fall through to the stale-recovery path after STALE_LOCK_MS.
 */
export function releaseBuildLock(baseDir: string): void {
  try {
    unlinkSync(lockPath(baseDir));
  } catch {
    // best-effort
  }
}
