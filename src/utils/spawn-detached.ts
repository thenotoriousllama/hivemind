/**
 * Cross-platform helper for spawning a detached, fire-and-forget Node worker
 * that must outlive the parent hook process.
 *
 * Why this exists (the Codex/Windows-PowerShell bug, 2026-05-29):
 *   The wiki-summary and skillify workers were spawned as
 *     spawn("nohup", ["node", workerPath, configFile], { detached, stdio })
 *   On Windows `nohup` does not exist, so spawn emits an ASYNC 'error' event
 *   (ENOENT) — NOT a synchronous throw. With no 'error' listener that event
 *   is unhandled and crashes the parent hook with exit 1. The summary worker
 *   fires on a periodic threshold (first at N captured messages, then every
 *   M), so capture.js exited 1 only "sometimes" — exactly the intermittent
 *   PostToolUse failure the user reported.
 *
 * The fix, and why nohup is dropped entirely:
 *   `detached: true` + `stdio: ["ignore","ignore","ignore"]` + `.unref()` is
 *   the canonical Node recipe for a child that survives the parent's exit, on
 *   BOTH POSIX and Windows. `detached` puts the child in its own session /
 *   process group (so a terminal SIGHUP never reaches it) and `unref()` lets
 *   the parent's event loop exit without waiting — `nohup` was always
 *   redundant alongside those. We invoke the Node binary directly via
 *   `process.execPath` (the same node that's running this hook), which is
 *   strictly more robust than relying on a `node` entry on PATH and works
 *   identically on Windows (`node.exe`). The net effect: the workers now
 *   actually RUN on Windows instead of crashing the hook.
 *
 * Best-effort by contract: any spawn failure (missing binary, EPERM, ...) is
 * absorbed silently via the 'error' listener. These workers are convenience
 * side-effects — a failure here must never break the hook that triggered them.
 */

import { spawn as nodeSpawn } from "node:child_process";

export interface SpawnDetachedDeps {
  /** Override for tests; defaults to node:child_process spawn. */
  spawn?: typeof nodeSpawn;
  /** Override for tests; defaults to process.execPath (the running node). */
  execPath?: string;
}

/**
 * Spawn `node <workerPath> <...args>` detached and fire-and-forget.
 *
 * @param workerPath absolute path to the worker .js inside the bundle
 * @param args       extra argv passed to the worker (e.g. the config path)
 */
export function spawnDetachedNodeWorker(
  workerPath: string,
  args: readonly string[] = [],
  deps: SpawnDetachedDeps = {},
): void {
  const spawn = deps.spawn ?? nodeSpawn;
  const execPath = deps.execPath ?? process.execPath;
  try {
    const child = spawn(execPath, [workerPath, ...args], {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"],
      // Suppress the transient console window Windows would otherwise pop for
      // the detached worker. No-op on POSIX.
      windowsHide: true,
    });
    // ENOENT / EPERM arrive as an ASYNC 'error' event, never a sync throw.
    // Without this listener the event is unhandled and crashes the parent.
    // Empty body == silent degradation, which is the intended contract.
    child.on("error", () => {});
    child.unref();
  } catch {
    // Defensive: a rare synchronous throw from spawn (invalid argv types).
    // The async 'error' listener above covers the common ENOENT path.
  }
}
