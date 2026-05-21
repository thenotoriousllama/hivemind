import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync, existsSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  acquireBuildLock,
  lockPath,
  releaseBuildLock,
} from "../../../src/graph/build-lock.js";

describe("build-lock — acquire/release", () => {
  let baseDir: string;
  beforeEach(() => {
    baseDir = mkdtempSync(join(tmpdir(), "build-lock-"));
  });
  afterEach(() => {
    rmSync(baseDir, { recursive: true, force: true });
  });

  it("first acquire returns acquired with reason='acquired' and creates the lock file", () => {
    const r = acquireBuildLock(baseDir);
    expect(r.acquired).toBe(true);
    expect(r.reason).toBe("acquired");
    expect(existsSync(lockPath(baseDir))).toBe(true);
  });

  it("second acquire while lock is fresh returns held-by-other", () => {
    const a = acquireBuildLock(baseDir);
    expect(a.acquired).toBe(true);
    const b = acquireBuildLock(baseDir);
    expect(b.acquired).toBe(false);
    expect(b.reason).toBe("held-by-other");
  });

  it("release removes the lock file (idempotent on missing)", () => {
    acquireBuildLock(baseDir);
    expect(existsSync(lockPath(baseDir))).toBe(true);
    releaseBuildLock(baseDir);
    expect(existsSync(lockPath(baseDir))).toBe(false);
    // calling release again is safe
    releaseBuildLock(baseDir);
    expect(existsSync(lockPath(baseDir))).toBe(false);
  });

  it("after release, next acquire succeeds again", () => {
    acquireBuildLock(baseDir);
    releaseBuildLock(baseDir);
    const r = acquireBuildLock(baseDir);
    expect(r.acquired).toBe(true);
    expect(r.reason).toBe("acquired");
  });

  it("stale lock (mtime > STALE_LOCK_MS) is recovered with reason='stale-recovered'", () => {
    // Plant a stale lock directly (simulating a crashed previous holder).
    writeFileSync(lockPath(baseDir), JSON.stringify({ pid: 99999, ts: 0 }), { flag: "w" });
    // Backdate mtime by 10 minutes (well past 5-min stale threshold).
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    utimesSync(lockPath(baseDir), tenMinAgo, tenMinAgo);

    const r = acquireBuildLock(baseDir);
    expect(r.acquired).toBe(true);
    expect(r.reason).toBe("stale-recovered");
    expect(existsSync(lockPath(baseDir))).toBe(true);
  });

  it("non-stale lock (mtime within STALE_LOCK_MS) is NOT taken over", () => {
    // Plant a lock with current mtime
    writeFileSync(lockPath(baseDir), JSON.stringify({ pid: 99999, ts: Date.now() }), { flag: "w" });
    const r = acquireBuildLock(baseDir);
    expect(r.acquired).toBe(false);
    expect(r.reason).toBe("held-by-other");
  });

  it("lock file lives at <baseDir>/.build.in-flight", () => {
    expect(lockPath(baseDir)).toBe(join(baseDir, ".build.in-flight"));
  });

  it("acquire creates baseDir when missing (first-ever build path)", () => {
    // The first auto-build happens before snapshot.ts has had a chance to
    // mkdir the per-repo dir. acquireBuildLock must create it so the lock
    // can be placed; otherwise no build would ever succeed on a fresh repo.
    rmSync(baseDir, { recursive: true, force: true });
    const r = acquireBuildLock(baseDir);
    expect(r.acquired).toBe(true);
    expect(r.reason).toBe("acquired");
    expect(existsSync(lockPath(baseDir))).toBe(true);
  });
});
