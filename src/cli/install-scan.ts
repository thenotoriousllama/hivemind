/**
 * Install-time value-show: scan the user's recent local agent sessions for
 * repeatable mistakes and surface a concrete insight inline in the
 * `hivemind install` output, BEFORE the auth prompt.
 *
 * Captures the conversion moment: a fresh installer who declines sign-in
 * usually never returns. By showing a real finding from THEIR own work
 * up-front, the sign-in CTA becomes "keep this skill across machines"
 * instead of the abstract "shared memory" pitch.
 *
 * Guarded — only runs when:
 *   1. Claude Code CLI is on disk (the gate runner needs it).
 *   2. The user has at least one .jsonl session under ~/.claude/projects/
 *      (cold-install users have nothing to mine; we fall through silently).
 *   3. No mine-local manifest exists yet (re-installers already mined; the
 *      sentinel blocks duplicate runs and we don't want to nag them).
 *   4. TTY is attached (we need to prompt y/n).
 *
 * Failure modes (user declined, timed out, gate returned no insight, child
 * crashed) all return null — caller falls through to the existing
 * "🐝 One more step to unlock Hivemind" copy without surfacing an error.
 */

import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { findAgentBin } from "../skillify/gate-runner.js";
import {
  getLatestInsightEntry,
  type LocalManifestEntry,
} from "../skillify/local-manifest.js";

/**
 * Path roots are resolved at CALL time, not module-load time, so the
 * guards honor a HOME override applied after import (the unit tests
 * rely on this; production HOME never changes mid-process so the
 * runtime cost is irrelevant).
 */
function claudeProjectsDir(): string {
  return join(homedir(), ".claude", "projects");
}
function manifestPath(): string {
  return join(homedir(), ".claude", "hivemind", "local-mined.json");
}

/**
 * Hard cap on the synchronous scan during install. Haiku on ~3 sessions
 * typically returns in 30-60s; 90s is the generous ceiling before we
 * give up and fall through. Don't bump higher without UX consideration —
 * a 90s wait already pushes the install latency well past the user's
 * normal "what's happening?" patience.
 */
const SCAN_TIMEOUT_MS = 90_000;

/**
 * Sessions to mine on the install-time pass. Tighter than the default
 * (8) because we're trading insight quality for install latency. Three
 * is empirically enough to surface a pattern for users with active
 * coding history; for users with very few sessions, the gate returns
 * empty and we fall through.
 */
const INSTALL_SCAN_SESSION_COUNT = 3;

/**
 * Cheap top-level scan: does any `~/.claude/projects/*` subdir contain
 * at least one `.jsonl`? We don't recurse into subagent dirs — the
 * mine-local worker has its own session picker, this guard only needs
 * to answer "is there anything to mine?".
 */
function hasLocalClaudeSessions(): boolean {
  const projectsDir = claudeProjectsDir();
  if (!existsSync(projectsDir)) return false;
  let subdirs: string[];
  try {
    subdirs = readdirSync(projectsDir);
  } catch {
    return false;
  }
  for (const sub of subdirs) {
    let files: string[];
    try {
      files = readdirSync(join(projectsDir, sub));
    } catch {
      continue;
    }
    if (files.some(f => f.endsWith(".jsonl"))) return true;
  }
  return false;
}

/**
 * Guards: every condition that must hold before we even prompt the user
 * for a scan. Returning false means "skip the offer entirely, fall
 * through to the standard auth copy" — no banner, no half-state.
 */
export function canOfferInstallScan(): boolean {
  const bin = findAgentBin("claude_code");
  if (!bin || !existsSync(bin)) return false;
  if (!hasLocalClaudeSessions()) return false;
  if (existsSync(manifestPath())) return false;
  return true;
}

/**
 * Spawn the worktree's own `hivemind skillify mine-local` as a detached-
 * style child, but await its exit synchronously (with timeout). Using
 * `process.execPath` + `process.argv[1]` guarantees we run the SAME CLI
 * bundle the user is currently inside — no version skew between the
 * install flow and the worker that does the mining.
 *
 * stdio is silenced so the install UX stays clean. mine-local's own
 * logs land in `~/.claude/hooks/mine-local.log` for postmortems.
 *
 * Returns the latest insight-bearing manifest entry if mining produced
 * one, or null for every failure path (timeout, non-zero exit, no
 * insight in the manifest).
 */
export function runInstallScan(): Promise<LocalManifestEntry | null> {
  return new Promise((resolve) => {
    const cliPath = process.argv[1];
    if (!cliPath || !existsSync(cliPath)) {
      resolve(null);
      return;
    }
    const child = spawn(
      process.execPath,
      [cliPath, "skillify", "mine-local", "--n", String(INSTALL_SCAN_SESSION_COUNT)],
      {
        stdio: ["ignore", "ignore", "ignore"],
        // HIVEMIND_CAPTURE=false: the spawned mine-local would otherwise
        // try to capture its own activity, which is a no-op without
        // credentials but spams the log. Keep it quiet.
        env: { ...process.env, HIVEMIND_CAPTURE: "false" },
      },
    );

    let settled = false;
    const finish = (result: LocalManifestEntry | null): void => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch { /* best-effort */ }
      finish(null);
    }, SCAN_TIMEOUT_MS);

    child.on("close", (code: number | null) => {
      clearTimeout(timer);
      if (code !== 0) { finish(null); return; }
      // After mine-local exits cleanly, the manifest is written. Read
      // the latest insight-bearing entry; null if the gate produced no
      // insights (rare but expected for sparse session sets).
      try {
        finish(getLatestInsightEntry());
      } catch {
        finish(null);
      }
    });

    child.on("error", () => {
      clearTimeout(timer);
      finish(null);
    });
  });
}

/**
 * Pure renderer for the post-scan banner. Returns the multi-line block
 * the install flow prints when an insight was found. Kept pure so the
 * unit test can assert on the rendered output without standing up a
 * real mine-local run.
 *
 * The skill name is rendered as a backticked code span — same as the
 * SessionStart banner — and the insight is truncated to 200 chars so
 * a verbose haiku output stays readable inline in the terminal.
 */
export function formatScanResult(entry: LocalManifestEntry): string {
  const rawInsight = (entry.insight ?? "").replace(/\s+/g, " ").trim();
  const insight = rawInsight.length > 200
    ? rawInsight.slice(0, 197).replace(/\s\S*$/, "") + "…"
    : rawInsight;
  return (
    `✓ Found a pattern in your past sessions:\n` +
    `   📌 ${insight}\n` +
    `   ✨ Skill \`${entry.skill_name}\` ready to catch it next time`
  );
}
