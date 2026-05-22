/**
 * Unit tests for src/cli/install-scan.ts — the install-time value-show
 * scan helpers. The scan itself spawns mine-local, which we mock at
 * the child_process boundary so tests stay fast and deterministic.
 *
 * Coverage targets: canOfferInstallScan guard chain (every false-path,
 * plus the all-conditions-met true-path); runInstallScan timeout +
 * happy path + manifest read; formatScanResult rendering invariants.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventEmitter } from "node:events";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { join } from "node:path";

// child_process.spawn is mocked so the "scan" test doesn't actually
// invoke node — we drive child events from inside the test.
type SpawnCall = { cmd: string; args: string[] };
const spawnCalls: SpawnCall[] = [];
let nextChildBehavior: {
  exitCode?: number;
  emitError?: Error;
  delayMs?: number;
} = { exitCode: 0 };

vi.mock("node:child_process", () => ({
  spawn: vi.fn((cmd: string, args: string[]) => {
    spawnCalls.push({ cmd, args });
    const child = new EventEmitter() as any;
    child.kill = vi.fn();
    const behavior = nextChildBehavior;
    queueMicrotask(() => {
      const delay = behavior.delayMs ?? 0;
      const fire = () => {
        if (behavior.emitError) {
          child.emit("error", behavior.emitError);
        } else {
          child.emit("close", behavior.exitCode ?? 0);
        }
      };
      if (delay > 0) setTimeout(fire, delay);
      else fire();
    });
    return child;
  }),
}));

// findAgentBin returns a path that may or may not exist on disk — we
// drive it directly so tests don't depend on the developer's PATH.
let findAgentBinReturn: string | null = "/tmp/fake-claude-bin";
vi.mock("../../src/skillify/gate-runner.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/skillify/gate-runner.js")>();
  return {
    ...actual,
    findAgentBin: (..._a: unknown[]) => findAgentBinReturn,
  };
});

// getLatestInsightEntry is mocked so the runInstallScan path doesn't
// read the developer's real ~/.claude/hivemind/local-mined.json.
let nextInsightEntry: any = null;
vi.mock("../../src/skillify/local-manifest.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/skillify/local-manifest.js")>();
  return {
    ...actual,
    getLatestInsightEntry: () => nextInsightEntry,
    // canOfferInstallScan reads LOCAL_MANIFEST_PATH existence directly;
    // we keep the real export so tests can choose a tmp manifest path
    // by setting HOME via process.env.HOME below.
  };
});

import {
  canOfferInstallScan,
  formatScanResult,
  runInstallScan,
} from "../../src/cli/install-scan.js";

const TMP_HOME = mkdtempSync(join(tmpdir(), "install-scan-test-"));
const originalHome = process.env.HOME;
const originalArgv1 = process.argv[1];
const FAKE_CLI = join(TMP_HOME, "fake-cli.js");

beforeEach(() => {
  // Reset state between tests.
  spawnCalls.length = 0;
  nextChildBehavior = { exitCode: 0 };
  findAgentBinReturn = "/tmp/fake-claude-bin";
  nextInsightEntry = null;
  // Each test starts with a clean tmp HOME: no sessions, no manifest.
  rmSync(TMP_HOME, { recursive: true, force: true });
  mkdirSync(TMP_HOME, { recursive: true });
  process.env.HOME = TMP_HOME;
  // process.argv[1] is what runInstallScan spawns. Point it at a real
  // file so the existsSync check passes; the actual content doesn't
  // matter because spawn is mocked.
  writeFileSync(FAKE_CLI, "// fake cli", "utf-8");
  process.argv[1] = FAKE_CLI;
  // Also ensure the mocked "claude bin" exists on disk for the guard.
  writeFileSync("/tmp/fake-claude-bin", "// fake claude", "utf-8");
});

afterEach(() => {
  process.env.HOME = originalHome;
  process.argv[1] = originalArgv1;
  try { rmSync("/tmp/fake-claude-bin"); } catch { /* best-effort */ }
});

describe("canOfferInstallScan", () => {
  function seedSession(): void {
    const projectsDir = join(TMP_HOME, ".claude", "projects", "sample-proj");
    mkdirSync(projectsDir, { recursive: true });
    writeFileSync(join(projectsDir, "abc.jsonl"), "{}\n", "utf-8");
  }

  it("returns false when no claude CLI is present (gate runner needs it)", () => {
    findAgentBinReturn = null;
    seedSession();
    expect(canOfferInstallScan()).toBe(false);
  });

  it("returns false when findAgentBin returns a path that doesn't exist", () => {
    findAgentBinReturn = "/nonexistent/claude";
    seedSession();
    expect(canOfferInstallScan()).toBe(false);
  });

  it("returns false when ~/.claude/projects is missing (truly fresh claude install)", () => {
    // No sessions seeded → cold-install path → no scan offer.
    expect(canOfferInstallScan()).toBe(false);
  });

  it("returns false when ~/.claude/projects exists but contains no .jsonl files", () => {
    // Subdir exists but is empty — the recursive scan finds nothing
    // and we don't waste user attention on a doomed offer.
    mkdirSync(join(TMP_HOME, ".claude", "projects", "empty"), { recursive: true });
    expect(canOfferInstallScan()).toBe(false);
  });

  it("returns false when the mine-local manifest already exists (re-installer)", () => {
    seedSession();
    const manifestDir = join(TMP_HOME, ".claude", "hivemind");
    mkdirSync(manifestDir, { recursive: true });
    writeFileSync(join(manifestDir, "local-mined.json"), "{}\n", "utf-8");
    expect(canOfferInstallScan()).toBe(false);
  });

  it("returns true when all guards pass: claude CLI + sessions + no manifest", () => {
    seedSession();
    expect(canOfferInstallScan()).toBe(true);
  });
});

describe("runInstallScan", () => {
  it("spawns `skillify mine-local --n 3` against the same CLI bundle the install ran from", async () => {
    nextChildBehavior = { exitCode: 0 };
    await runInstallScan();
    expect(spawnCalls).toHaveLength(1);
    const { cmd, args } = spawnCalls[0];
    expect(cmd).toBe(process.execPath);
    // Always spawns OUR cli bundle, never `which hivemind`, so the
    // worker is the same version as the parent install process.
    expect(args[0]).toBe(FAKE_CLI);
    expect(args).toContain("skillify");
    expect(args).toContain("mine-local");
    // `--n 3` is the tight install-time session cap (vs default 8).
    expect(args).toContain("--n");
    expect(args[args.indexOf("--n") + 1]).toBe("3");
  });

  it("resolves with the latest insight entry on clean exit when one exists", async () => {
    nextInsightEntry = {
      skill_name: "verify-before-done",
      insight: "You revisited 4 merged PRs in the last month.",
      created_at: "2026-05-22T10:00:00.000Z",
    };
    nextChildBehavior = { exitCode: 0 };
    const result = await runInstallScan();
    expect(result).not.toBeNull();
    expect(result!.skill_name).toBe("verify-before-done");
  });

  it("resolves with null on non-zero exit", async () => {
    nextChildBehavior = { exitCode: 1 };
    nextInsightEntry = { skill_name: "x", insight: "y", created_at: "z" };
    // Even if a manifest exists, a failed mine-local run shouldn't
    // surface its (possibly stale) output. We treat non-zero exit as
    // "scan failed → fall through silently".
    const result = await runInstallScan();
    expect(result).toBeNull();
  });

  it("resolves with null on spawn error", async () => {
    nextChildBehavior = { emitError: new Error("ENOENT") };
    const result = await runInstallScan();
    expect(result).toBeNull();
  });

  it("resolves with null when process.argv[1] points at a missing file (safety guard)", async () => {
    process.argv[1] = "/nonexistent/cli.js";
    const result = await runInstallScan();
    // Spawn should NOT have been called — we bail out at the
    // existsSync check rather than letting node fail mid-spawn.
    expect(result).toBeNull();
    expect(spawnCalls).toHaveLength(0);
  });

  it("resolves with null when getLatestInsightEntry returns null (gate produced no insight)", async () => {
    nextChildBehavior = { exitCode: 0 };
    nextInsightEntry = null;
    const result = await runInstallScan();
    expect(result).toBeNull();
  });
});

describe("formatScanResult", () => {
  function makeEntry(insight: string, name = "verify-before-done"): any {
    return {
      skill_name: name,
      insight,
      created_at: "2026-05-22T00:00:00.000Z",
    };
  }

  it("renders insight, skill name, and emoji markers", () => {
    const out = formatScanResult(makeEntry("You revisited 4 merged PRs."));
    expect(out).toContain("Found a pattern in your past sessions");
    expect(out).toContain("📌 You revisited 4 merged PRs.");
    expect(out).toContain("✨ Skill `verify-before-done` ready");
  });

  it("collapses embedded whitespace (newlines, tabs) to single spaces", () => {
    // Defense-in-depth: parseMultiVerdict already normalizes whitespace
    // before persistence, but this renderer is the last guard before
    // user-visible output and must not blindly trust the input.
    const out = formatScanResult(makeEntry("Line one.\nLine\ttwo.   Three."));
    expect(out).toContain("📌 Line one. Line two. Three.");
    expect(out).not.toContain("\nLine two");
    expect(out).not.toContain("\t");
  });

  it("truncates insight over 200 chars at a word boundary with ellipsis", () => {
    const long = "x ".repeat(200).trim() + " end-marker";
    const out = formatScanResult(makeEntry(long));
    const insightLine = out.split("\n").find(l => l.includes("📌"))!;
    // Allow a few chars of slack for the emoji + leading spaces.
    expect(insightLine.length).toBeLessThanOrEqual(220);
    expect(insightLine.endsWith("…")).toBe(true);
    // end-marker is past the 200-char cap, must be dropped.
    expect(insightLine).not.toContain("end-marker");
  });

  it("passes through short insights without truncation", () => {
    const out = formatScanResult(makeEntry("Short and concrete."));
    expect(out).toContain("Short and concrete.");
    expect(out).not.toContain("…");
  });

  it("handles missing insight gracefully (empty string, not crash)", () => {
    // Should never happen in practice — caller checks for non-empty
    // insight before calling formatScanResult — but defensive coding
    // means a malformed entry doesn't crash the install.
    const out = formatScanResult({
      skill_name: "x",
      insight: undefined as any,
      created_at: "z",
    } as any);
    expect(out).toContain("📌");
    expect(out).toContain("✨ Skill `x`");
  });
});
