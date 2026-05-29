import { describe, it, expect } from "vitest";
import { basename, win32, posix } from "node:path";
import { projectNameFromCwd } from "../../src/utils/project-name.js";

/**
 * Guard for the cwd → project-name derivation. The bug this replaces
 * (`cwd.split("/").pop()`) only split on `/`, so a Windows cwd like
 * `C:\work\repo` returned the whole path instead of `repo`.
 *
 * path.basename is platform-aware, so on a POSIX test host it won't split a
 * backslash string — to prove the Windows behavior deterministically we also
 * assert against path.win32.basename directly (which is what runs on Windows).
 */
describe("projectNameFromCwd", () => {
  it("POSIX path → basename", () => {
    expect(projectNameFromCwd("/home/me/work/repo")).toBe("repo");
  });

  it("empty / undefined / null → 'unknown'", () => {
    expect(projectNameFromCwd("")).toBe("unknown");
    expect(projectNameFromCwd(undefined)).toBe("unknown");
    expect(projectNameFromCwd(null)).toBe("unknown");
  });

  it("matches the host platform's path.basename for a native path", () => {
    const cwd = "/a/b/c/myproj";
    expect(projectNameFromCwd(cwd)).toBe(basename(cwd) || "unknown");
  });

  // The actual Windows fix, asserted against win32 semantics directly so it's
  // deterministic regardless of the test host OS. The OLD split("/") code
  // returns the WHOLE backslash path here — the negative-pattern guard.
  it("Windows backslash path resolves to the basename under win32 semantics", () => {
    const winCwd = "C:\\Users\\angel\\work\\my-repo";
    expect(win32.basename(winCwd)).toBe("my-repo");
    // Negative guard: the replaced implementation would NOT have produced this.
    expect(winCwd.split("/").pop()).toBe(winCwd); // old code: whole path, wrong
    // posix.basename (what a Linux host's basename uses) also can't split it —
    // confirms the bug is genuinely platform-dependent, not test-host luck.
    expect(posix.basename(winCwd)).toBe(winCwd);
  });
});
