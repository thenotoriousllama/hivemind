import { describe, it, expect, vi } from "vitest";
import type { spawn as nodeSpawn, ChildProcess } from "node:child_process";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnDetachedNodeWorker } from "../../src/utils/spawn-detached.js";

/**
 * Unit guard for the cross-platform detached-worker spawn helper.
 *
 * This helper exists to fix the Codex/Windows-PowerShell crash (2026-05-29):
 * the old `spawn("nohup", ["node", ...])` form ENOENT-crashed the hook on
 * Windows (no `nohup`) because the async 'error' event had no listener. The
 * tests below are the failure cases that form:
 *   - did NOT use `nohup` (regression guard — the literal bug),
 *   - did NOT install an 'error' listener (the crash mechanism).
 *
 * Test seam: spawn + execPath are injected, so no real child process runs and
 * the assertions are stable across CI environments regardless of PATH.
 */
function fakeSpawn(): {
  calls: { cmd: string; args: string[]; opts: unknown }[];
  onCalls: { event: string; cb: (...a: unknown[]) => void }[];
  unref: ReturnType<typeof vi.fn>;
  spy: typeof nodeSpawn;
} {
  const calls: { cmd: string; args: string[]; opts: unknown }[] = [];
  const onCalls: { event: string; cb: (...a: unknown[]) => void }[] = [];
  const unref = vi.fn();
  const impl = (cmd: string, args: readonly string[], opts: unknown) => {
    calls.push({ cmd, args: [...args], opts });
    const child: { on: (e: string, cb: (...a: unknown[]) => void) => unknown; unref: typeof unref } = {
      on: (event, cb) => { onCalls.push({ event, cb }); return child; },
      unref,
    };
    return child as unknown as ChildProcess;
  };
  return { calls, onCalls, unref, spy: impl as unknown as typeof nodeSpawn };
}

describe("spawnDetachedNodeWorker", () => {
  it("invokes the node binary (execPath) directly with [workerPath, ...args] — NOT nohup", () => {
    const { calls, spy } = fakeSpawn();
    spawnDetachedNodeWorker("/bundle/wiki-worker.js", ["/tmp/config.json"], {
      spawn: spy,
      execPath: "/usr/bin/node",
    });
    expect(calls).toHaveLength(1);
    const { cmd, args, opts } = calls[0]!;
    // The literal Windows bug was spawn("nohup", ...). Guard against its return.
    expect(cmd).not.toBe("nohup");
    expect(cmd).toBe("/usr/bin/node");
    expect(args).toEqual(["/bundle/wiki-worker.js", "/tmp/config.json"]);
    // detached + fully-ignored stdio are what let the worker outlive the hook
    // on BOTH POSIX and Windows (nohup was redundant with these).
    expect(opts).toMatchObject({
      detached: true,
      stdio: ["ignore", "ignore", "ignore"],
      // windowsHide suppresses the console-window flash on Windows (no-op on POSIX).
      windowsHide: true,
    });
  });

  it("registers an 'error' listener BEFORE unref (Windows ENOENT is async; no listener = crash)", () => {
    const { onCalls, unref, spy } = fakeSpawn();
    spawnDetachedNodeWorker("/bundle/w.js", ["/cfg"], { spawn: spy, execPath: "node" });

    const errorListeners = onCalls.filter(c => c.event === "error");
    expect(errorListeners).toHaveLength(1);
    // Triggering the listener (what Node does when nohup/node is missing) must
    // be silent — this is the degradation that replaces the hook crash.
    expect(() => errorListeners[0]!.cb(new Error("spawn ENOENT"))).not.toThrow();
    expect(unref).toHaveBeenCalledTimes(1);
  });

  it("defaults to process.execPath when execPath is not injected", () => {
    const { calls, spy } = fakeSpawn();
    spawnDetachedNodeWorker("/bundle/w.js", [], { spawn: spy });
    expect(calls[0]!.cmd).toBe(process.execPath);
  });

  it("a synchronous throw from spawn does NOT propagate (best-effort: must never crash the hook)", () => {
    const impl = (() => { throw new Error("spawn ENOENT nohup"); }) as unknown as typeof nodeSpawn;
    expect(() => spawnDetachedNodeWorker("/bundle/w.js", ["/cfg"], { spawn: impl })).not.toThrow();
  });

  it("composes args after the worker path (worker is always argv[0] to node)", () => {
    const { calls, spy } = fakeSpawn();
    spawnDetachedNodeWorker("/b/skillify-worker.js", ["a", "b"], { spawn: spy, execPath: "node" });
    expect(calls[0]!.args).toEqual(["/b/skillify-worker.js", "a", "b"]);
  });
});

/**
 * REAL-PROCESS tests (no spawn mock). These are the failure-before-fix /
 * success-path guards that the mocked unit tests above CANNOT provide — the
 * mock proves we don't *call* nohup; these prove the hook doesn't *die* and
 * that the worker actually *runs*.
 *
 * Cross-platform without needing Windows: the Windows crash was "spawn a
 * binary that isn't on PATH → async ENOENT → no listener → process exits 1."
 * On Linux a missing `nohup` is indistinguishable from any other missing
 * binary, so spawning a deliberately-absent binary reproduces the EXACT
 * mechanism here. (A windows-latest CI leg exercises the real win32 path
 * separators + detach semantics on top of this — see .github/workflows/ci.yaml.)
 */
describe("spawnDetachedNodeWorker — real process (no mock)", () => {
  const MISSING = "hivemind-definitely-not-a-real-binary-xyz";

  // The literal bug: the OLD code shape, run in a child node process, must
  // crash with a non-zero exit. If this ever starts exiting 0, the runtime no
  // longer surfaces unhandled spawn errors and the rest of this fix is moot.
  it("OLD shape (spawn missing binary, NO error listener) crashes a child node proc", () => {
    const script =
      `const {spawn}=require('child_process');` +
      `spawn(${JSON.stringify(MISSING)},['node','x'],{detached:true,stdio:['ignore','ignore','ignore']}).unref();`;
    const res = spawnSync(process.execPath, ["-e", script], { encoding: "utf-8" });
    expect(res.status).not.toBe(0); // unhandled 'error' event → exit 1
    expect(res.stderr).toContain("ENOENT");
  });

  // The fix, in a child node proc: same missing binary, WITH the error
  // listener → clean exit 0. Mirrors spawnDetachedNodeWorker's exact shape.
  it("NEW shape (same spawn + error listener + unref) exits cleanly", () => {
    const script =
      `const {spawn}=require('child_process');` +
      `const c=spawn(${JSON.stringify(MISSING)},['node','x'],{detached:true,stdio:['ignore','ignore','ignore']});` +
      `c.on('error',()=>{});c.unref();`;
    const res = spawnSync(process.execPath, ["-e", script], { encoding: "utf-8" });
    expect(res.status).toBe(0);
  });

  // Ties the above to the REAL helper (not a hand-copied shape): calling it
  // in-process with a missing execPath and the REAL node spawn must not crash
  // this test process — the async ENOENT is absorbed. Reaching the assertion
  // after two macrotasks (long enough for the 'error' event to fire) IS the
  // proof of survival.
  it("real helper absorbs a missing-binary ENOENT in-process (parent survives)", async () => {
    spawnDetachedNodeWorker("/bundle/whatever.js", ["/cfg"], { execPath: MISSING });
    await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, 50));
    expect(true).toBe(true); // we got here → no unhandled crash
  });

  // Success path with a REAL detached worker: point the helper at the real
  // node (process.execPath) and a tiny worker that writes its argv to a
  // sentinel file. Proves detached + execPath actually launches a working
  // child on the host OS, and that the helper returns immediately (the call
  // does not block on the child).
  it("launches a real detached node worker that runs and receives its config arg", async () => {
    const dir = mkdtempSync(join(tmpdir(), "hm-spawn-real-"));
    try {
      const sentinel = join(dir, "ran.json");
      const worker = join(dir, "worker.js");
      // Worker writes [its own argv tail] so we can assert it got the config.
      const { writeFileSync } = await import("node:fs");
      writeFileSync(
        worker,
        `require('fs').writeFileSync(${JSON.stringify(sentinel)}, JSON.stringify(process.argv.slice(2)));`,
      );

      const t0 = process.hrtime.bigint();
      spawnDetachedNodeWorker(worker, [join(dir, "config.json")], { execPath: process.execPath });
      const elapsedMs = Number(process.hrtime.bigint() - t0) / 1e6;
      // The call must return ~immediately (fire-and-forget), not await the child.
      expect(elapsedMs).toBeLessThan(1000);

      // Poll for the sentinel — the detached child runs on its own schedule.
      let ran = false;
      for (let i = 0; i < 60 && !ran; i++) {
        if (existsSync(sentinel)) { ran = true; break; }
        await new Promise(r => setTimeout(r, 50));
      }
      expect(ran).toBe(true);
      const argv = JSON.parse(readFileSync(sentinel, "utf-8")) as string[];
      expect(argv).toEqual([join(dir, "config.json")]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
