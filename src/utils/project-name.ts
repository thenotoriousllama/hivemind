import { basename } from "node:path";

/**
 * Derive a project display name from a working directory.
 *
 * Uses path.basename, which is platform-aware: on Windows it splits on BOTH
 * `\` and `/`, on POSIX on `/`. The previous `cwd.split("/").pop()` form only
 * split on `/`, so on Windows a cwd like `C:\work\repo` (no forward slashes)
 * returned the entire path instead of `repo`, polluting the `project` field
 * threaded into capture rows, session rows, and worker summaries.
 *
 * Returns "unknown" for an empty/undefined cwd (basename("") === "").
 */
export function projectNameFromCwd(cwd: string | undefined | null): string {
  return basename(cwd ?? "") || "unknown";
}
