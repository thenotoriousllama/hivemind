/**
 * Tests for src/skillify/auto-pull.ts.
 *
 * Mocks at the network seam — the real `runPull` runs end-to-end against an
 * injected QueryFn that returns canned rows. Filesystem effects are scoped
 * to a temp dir via HOME override, so tests don't pollute ~/.deeplake or
 * ~/.claude on the developer's machine.
 *
 * Coverage targets ≥80% lines / ≥90% functions / ≥70% branches per the
 * vitest.config.ts threshold for new files.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  maybeAutoPull,
  readIntervalMs,
  readLastRun,
  writeLastRun,
} from "../../src/skillify/auto-pull.js";
import type { QueryFn } from "../../src/skillify/pull.js";
import type { Config } from "../../src/config.js";

// ─── Test harness ──────────────────────────────────────────────────────────────
// We pin HOME to a per-test temp dir so the autopull-last-run.json file lands
// in the sandbox instead of the user's real ~/.deeplake. Same trick the rest
// of the skillify suite uses.

let tmpHome: string;
const realHome = process.env.HOME;

beforeEach(() => {
  tmpHome = mkdtempSync(join(tmpdir(), "autopull-"));
  process.env.HOME = tmpHome;
  // Clear all autopull env vars so each test gets a clean slate.
  delete process.env.HIVEMIND_AUTOPULL_DISABLED;
  delete process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN;
});

afterEach(() => {
  process.env.HOME = realHome;
  delete process.env.HIVEMIND_AUTOPULL_DISABLED;
  delete process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN;
  try { rmSync(tmpHome, { recursive: true, force: true }); } catch { /* nothing */ }
});

// ─── Fixtures ──────────────────────────────────────────────────────────────────

function makeConfig(): Config {
  return {
    token: "tok",
    orgId: "org",
    orgName: "OrgName",
    userName: "user",
    workspaceId: "default",
    apiUrl: "https://api.deeplake.ai",
    tableName: "memory",
    sessionsTableName: "sessions",
    skillsTableName: "skills",
    memoryPath: join(tmpHome, ".deeplake", "memory"),
  };
}

function sampleRow(over: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    name: "shared-skill",
    project: "p",
    project_key: "pk1",
    body: "## Workflow\n\nDo the thing.",
    version: 1,
    source_agent: "claude_code",
    scope: "org",
    author: "alice",
    description: "Shared skill",
    trigger_text: "When sharing",
    source_sessions: '["s1"]',
    install: "global",
    created_at: "2026-05-08T00:00:00.000Z",
    updated_at: "2026-05-08T00:00:00.000Z",
    ...over,
  };
}

function makeMockQuery(rows: Record<string, unknown>[]): { fn: QueryFn; calls: string[] } {
  const calls: string[] = [];
  const fn: QueryFn = async (sql: string) => { calls.push(sql); return rows; };
  return { fn, calls };
}

const TIMESTAMP_REL = ".deeplake/state/skillify/autopull-last-run.json";

// ─── readIntervalMs ────────────────────────────────────────────────────────────

describe("readIntervalMs", () => {
  it("defaults to 30 minutes when env unset", () => {
    delete process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN;
    expect(readIntervalMs()).toBe(30 * 60_000);
  });

  it("respects integer minutes", () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "5";
    expect(readIntervalMs()).toBe(5 * 60_000);
  });

  it("zero means run every session", () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "0";
    expect(readIntervalMs()).toBe(0);
  });

  it("negative is preserved (caller branches on it)", () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "-1";
    expect(readIntervalMs()).toBe(-60_000);
  });

  it("falls back to default on garbage", () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "not-a-number";
    expect(readIntervalMs()).toBe(30 * 60_000);
  });

  it("falls back to default on empty string", () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "";
    expect(readIntervalMs()).toBe(30 * 60_000);
  });
});

// ─── readLastRun / writeLastRun round-trip ─────────────────────────────────────

describe("writeLastRun + readLastRun", () => {
  it("returns null when file missing", () => {
    expect(readLastRun()).toBeNull();
  });

  it("round-trips an epoch timestamp via atomic write", () => {
    const t = 1_700_000_000_000;
    writeLastRun(t);
    expect(readLastRun()).toBe(t);
    // File ends up at ~/.deeplake/state/skillify/autopull-last-run.json
    expect(existsSync(join(tmpHome, TIMESTAMP_REL))).toBe(true);
  });

  it("returns null on malformed JSON", () => {
    // Manually drop garbage at the path
    const path = join(tmpHome, TIMESTAMP_REL);
    mkdirSync(join(tmpHome, ".deeplake/state/skillify"), { recursive: true });
    writeFileSync(path, "not json");
    expect(readLastRun()).toBeNull();
  });

  it("returns null when JSON has no/invalid lastRunMs", () => {
    const path = join(tmpHome, TIMESTAMP_REL);
    mkdirSync(join(tmpHome, ".deeplake/state/skillify"), { recursive: true });
    writeFileSync(path, JSON.stringify({ lastRunMs: "not-a-number" }));
    expect(readLastRun()).toBeNull();
  });
});

// ─── maybeAutoPull — env-based skips ──────────────────────────────────────────

describe("maybeAutoPull — disabled paths", () => {
  it("skips when HIVEMIND_AUTOPULL_DISABLED=1 (no config / query touched)", async () => {
    process.env.HIVEMIND_AUTOPULL_DISABLED = "1";
    const loadConfigFn = vi.fn(() => makeConfig());
    const { fn: queryFn, calls } = makeMockQuery([]);
    const result = await maybeAutoPull({ loadConfigFn, queryFn });
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "disabled" });
    // Short-circuit: env-disabled must not even reach loadConfig.
    expect(loadConfigFn).not.toHaveBeenCalled();
    expect(calls).toHaveLength(0);
    // No timestamp written.
    expect(readLastRun()).toBeNull();
  });

  it("skips when HIVEMIND_AUTOPULL_INTERVAL_MIN=-1", async () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "-1";
    const loadConfigFn = vi.fn(() => makeConfig());
    const { fn: queryFn, calls } = makeMockQuery([]);
    const result = await maybeAutoPull({ loadConfigFn, queryFn });
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "disabled" });
    expect(loadConfigFn).not.toHaveBeenCalled();
    expect(calls).toHaveLength(0);
  });
});

// ─── maybeAutoPull — not-logged-in ────────────────────────────────────────────

describe("maybeAutoPull — not logged in", () => {
  it("returns silently when loadConfig returns null (no nag)", async () => {
    const loadConfigFn = vi.fn(() => null);
    const { fn: queryFn, calls } = makeMockQuery([]);
    const result = await maybeAutoPull({ loadConfigFn, queryFn });
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "not-logged-in" });
    expect(loadConfigFn).toHaveBeenCalledTimes(1);
    expect(calls).toHaveLength(0);
    expect(readLastRun()).toBeNull();
  });
});

// ─── maybeAutoPull — throttle ─────────────────────────────────────────────────

describe("maybeAutoPull — throttle", () => {
  it("first call runs the pull and writes a timestamp", async () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "30";
    const loadConfigFn = () => makeConfig();
    const { fn: queryFn, calls } = makeMockQuery([sampleRow()]);
    const t0 = 1_700_000_000_000;
    const result = await maybeAutoPull({
      loadConfigFn, queryFn, install: "project", cwd: tmpHome, nowMs: () => t0,
    });
    expect(result.skipped).toBe(false);
    expect(result.pulled).toBe(1);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain(`FROM "skills"`);
    expect(calls[0]).not.toMatch(/WHERE/);          // users=[] → no author filter
    expect(readLastRun()).toBe(t0);
    // File written under tmp HOME, not the real one. Pulled skills use the
    // `<name>--<author>/` flat layout (see src/skillify/pull.ts:330).
    expect(existsSync(join(tmpHome, ".claude/skills/shared-skill--alice/SKILL.md"))).toBe(true);
  });

  it("second call within window is throttled (no SQL, no timestamp bump)", async () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "30";
    const loadConfigFn = () => makeConfig();
    const t0 = 1_700_000_000_000;
    // Pre-populate the timestamp via the real writer.
    writeLastRun(t0);

    const { fn: queryFn, calls } = makeMockQuery([sampleRow()]);
    const result = await maybeAutoPull({
      loadConfigFn, queryFn, install: "project", cwd: tmpHome,
      nowMs: () => t0 + 60_000,                      // 1 minute later, well inside 30-min window
    });
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "throttled" });
    expect(calls).toHaveLength(0);
    // Timestamp must NOT be bumped on a throttled run.
    expect(readLastRun()).toBe(t0);
  });

  it("call AFTER the window runs again", async () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "30";
    const loadConfigFn = () => makeConfig();
    const t0 = 1_700_000_000_000;
    writeLastRun(t0);
    const { fn: queryFn, calls } = makeMockQuery([sampleRow()]);
    const result = await maybeAutoPull({
      loadConfigFn, queryFn, install: "project", cwd: tmpHome,
      nowMs: () => t0 + 31 * 60_000,                  // 31 minutes later — past the window
    });
    expect(result.skipped).toBe(false);
    expect(calls).toHaveLength(1);
    expect(readLastRun()).toBe(t0 + 31 * 60_000);
  });

  it("interval=0 forces every call (no throttle)", async () => {
    process.env.HIVEMIND_AUTOPULL_INTERVAL_MIN = "0";
    const loadConfigFn = () => makeConfig();
    const t0 = 1_700_000_000_000;
    writeLastRun(t0);                                  // even with a fresh timestamp
    const { fn: queryFn, calls } = makeMockQuery([sampleRow()]);
    const result = await maybeAutoPull({
      loadConfigFn, queryFn, install: "project", cwd: tmpHome,
      nowMs: () => t0 + 1,                             // 1ms later
    });
    expect(result.skipped).toBe(false);
    expect(calls).toHaveLength(1);
  });
});

// ─── maybeAutoPull — failure handling ─────────────────────────────────────────

describe("maybeAutoPull — failures swallowed", () => {
  it("does NOT throw when query fails, and does NOT update the timestamp", async () => {
    const loadConfigFn = () => makeConfig();
    const failingQuery: QueryFn = async () => { throw new Error("network borked"); };
    const t0 = 1_700_000_000_000;
    const result = await maybeAutoPull({
      loadConfigFn, queryFn: failingQuery, install: "project", cwd: tmpHome,
      nowMs: () => t0,
    });
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "error" });
    // Failed pull stays un-throttled — next session retries.
    expect(readLastRun()).toBeNull();
  });

  it("treats 'table does not exist' as empty result and writes timestamp", async () => {
    // runPull's isMissingTableError swallows this and returns scanned=0.
    // We assert maybeAutoPull then treats it as a successful (zero-write) run
    // and updates the timestamp so we don't keep poking a missing table.
    const loadConfigFn = () => makeConfig();
    const tableMissingQuery: QueryFn = async () => {
      const e = new Error('relation "skills" does not exist');
      throw e;
    };
    const t0 = 1_700_000_000_000;
    const result = await maybeAutoPull({
      loadConfigFn, queryFn: tableMissingQuery, install: "project", cwd: tmpHome,
      nowMs: () => t0,
    });
    expect(result.skipped).toBe(false);
    expect(result.pulled).toBe(0);
    expect(readLastRun()).toBe(t0);
  });

  it("times out a hanging query without freezing", async () => {
    const loadConfigFn = () => makeConfig();
    // Query never resolves — would hang forever without the timeout.
    const hangingQuery: QueryFn = () => new Promise(() => { /* never */ });
    const t0 = 1_700_000_000_000;
    const start = Date.now();
    const result = await maybeAutoPull({
      loadConfigFn, queryFn: hangingQuery, install: "project", cwd: tmpHome,
      nowMs: () => t0,
      timeoutMs: 100,                                  // tiny timeout for the test
    });
    const elapsed = Date.now() - start;
    expect(result).toEqual({ pulled: 0, skipped: true, reason: "error" });
    // Must complete well under 1s — the 100ms timeout is the upper bound.
    expect(elapsed).toBeLessThan(1000);
    // Timed-out pull never writes the timestamp.
    expect(readLastRun()).toBeNull();
  });
});

// ─── maybeAutoPull — install location default ────────────────────────────────

describe("maybeAutoPull — install location", () => {
  it("defaults install to 'global' (writes under ~/.claude/skills)", async () => {
    const loadConfigFn = () => makeConfig();
    const { fn: queryFn } = makeMockQuery([sampleRow()]);
    const t0 = 1_700_000_000_000;
    const result = await maybeAutoPull({
      loadConfigFn, queryFn, nowMs: () => t0,
      // install + cwd intentionally NOT passed — we want the global default.
    });
    expect(result.skipped).toBe(false);
    expect(result.pulled).toBe(1);
    // ~/.claude/skills/<name>--<author>/SKILL.md, with HOME overridden to tmpHome.
    expect(existsSync(join(tmpHome, ".claude/skills/shared-skill--alice/SKILL.md"))).toBe(true);
  });
});
