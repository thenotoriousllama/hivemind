import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  autoUpdate,
  extractUpdateSummary,
  type SpawnResult,
} from "../../src/hooks/shared/autoupdate.js";

/**
 * Tests for src/hooks/shared/autoupdate.ts — the centralized autoupdate
 * helper that every agent's session-start hook calls.
 *
 * Replaced an older `autoupdate.test.ts` that tested an inline copy of
 * the legacy buildUpdateNotice / isNewer logic. That logic is now removed
 * from session-start.ts (it lived in the per-agent legacy paths we just
 * deleted), so the inline-copy tests were testing dead code. The real
 * version compare now lives in `src/cli/update.ts:isNewer` and the
 * notice generation has moved to `extractUpdateSummary` here.
 *
 * The helper has three gates and one "do the thing" path. Tests assert
 * COUNT and SHAPE of the spawn injection (CLAUDE.md rule 6) so a
 * regression that fires the spawn under the wrong gate, or fires twice,
 * cannot slip past.
 *
 * Mocks at the boundary (rule 5): we inject the `spawn` function and the
 * resolved `hivemindBinaryPath`, NOT the path-walk and NOT the underlying
 * `which`. The spawn injection captures the exact command + args; the
 * binary path injection lets us avoid actually shelling out to `which`.
 */

const VALID_CREDS = {
  token: "tok",
  orgId: "org",
  savedAt: "2026-05-05T00:00:00Z",
};

let stderrMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  stderrMock = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("autoUpdate — gating", () => {
  it("no-op when creds are null (not logged in)", async () => {
    const spawnFn = vi.fn();
    await autoUpdate(null, { agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock });
    expect(spawnFn).not.toHaveBeenCalled();
    expect(stderrMock).not.toHaveBeenCalled();
  });

  it("no-op when creds.token is missing", async () => {
    const spawnFn = vi.fn();
    await autoUpdate({ ...VALID_CREDS, token: "" }, { agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock });
    expect(spawnFn).not.toHaveBeenCalled();
  });

  it("no-op when creds.autoupdate === false (user opted out)", async () => {
    const spawnFn = vi.fn();
    await autoUpdate(
      { ...VALID_CREDS, autoupdate: false },
      { agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock },
    );
    expect(spawnFn).not.toHaveBeenCalled();
  });

  it("DOES run when creds.autoupdate is undefined (default true)", async () => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "is up to date", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    expect(spawnFn).toHaveBeenCalledTimes(1);
  });

  it("no-op when hivemindBinaryPath is null (binary not on PATH)", async () => {
    const spawnFn = vi.fn();
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: null, stderr: stderrMock,
    });
    expect(spawnFn).not.toHaveBeenCalled();
  });
});

describe("autoUpdate — spawn invocation", () => {
  it("spawns the resolved binary with args ['update'] (exactly once)", async () => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "is up to date", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/usr/local/bin/hivemind", stderr: stderrMock,
    });
    expect(spawnFn).toHaveBeenCalledTimes(1);
    expect(spawnFn.mock.calls[0][0]).toBe("/usr/local/bin/hivemind");
    expect(spawnFn.mock.calls[0][1]).toEqual(["update"]);
    expect(typeof spawnFn.mock.calls[0][2]).toBe("number");
  });

  it("default timeoutMs is 90000ms (slow links + npm install -g + re-exec install)", async () => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "is up to date", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    expect(spawnFn.mock.calls[0][2]).toBe(90_000);
  });

  it("custom timeoutMs propagates through", async () => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "is up to date", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
      timeoutMs: 30_000,
    });
    expect(spawnFn.mock.calls[0][2]).toBe(30_000);
  });
});

describe("autoUpdate — output handling", () => {
  it("'Updated to X.Y.Z.' result prints upgrade notice with agent-specific restart hint", async () => {
    const spawnFn = vi.fn().mockResolvedValue({
      stdout: "Update available: 0.6.99 → 0.7.4\nUpgrading via npm…\nUpdated to 0.7.4.\n",
      stderr: "",
      code: 0,
    });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    const written = stderrMock.mock.calls.map(c => c[0]).join("");
    expect(written).toContain("✅ Hivemind Updated to 0.7.4.");
    expect(written).toContain("Run /reload-plugins to apply.");
  });

  it.each([
    ["claude",   "Run /reload-plugins to apply."],
    ["codex",    "Restart Codex to apply."],
    ["cursor",   "Restart Cursor to apply."],
    ["hermes",   "Restart Hermes to apply."],
    ["pi",       "Restart pi to apply."],
    ["openclaw", "Restart OpenClaw to apply."],
  ] as const)("%s gets the right restart hint after a successful upgrade", async (agent, hint) => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "Updated to 1.2.3.\n", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent, spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    expect(stderrMock.mock.calls.map(c => c[0]).join("")).toContain(hint);
  });

  it("'is up to date' is silent (common case, no stderr noise on every session-start)", async () => {
    const spawnFn = vi.fn().mockResolvedValue({
      stdout: "hivemind 0.7.4 is up to date (npm latest: 0.7.4).\n",
      stderr: "",
      code: 0,
    });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    expect(stderrMock).not.toHaveBeenCalled();
  });

  it("'Update available: …' (e.g. local-dev refusal) surfaces as ⬆️ notice", async () => {
    const spawnFn = vi.fn().mockResolvedValue({
      stdout: "Update available: 0.6.99 → 0.7.4\n",
      stderr: "hivemind is running from a local development checkout (/repo)\n",
      code: 1,
    });
    await autoUpdate(VALID_CREDS, {
      agent: "codex", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    const written = stderrMock.mock.calls.map(c => c[0]).join("");
    expect(written).toContain("⬆️ Hivemind:");
    expect(written).toContain("Update available: 0.6.99 → 0.7.4");
  });

  it("non-zero exit + no recognized phrase = silent (e.g. 'Unknown command: update' from older binary)", async () => {
    const spawnFn = vi.fn().mockResolvedValue({
      stdout: "",
      stderr: "Unknown command: update\nhivemind --help\n",
      code: 1,
    });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    expect(stderrMock).not.toHaveBeenCalled();
  });

  it("spawn rejecting (network / process error) is swallowed silently", async () => {
    const spawnFn = vi.fn().mockRejectedValue(new Error("ECONNRESET"));
    await expect(autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    })).resolves.toBeUndefined();
    expect(stderrMock).not.toHaveBeenCalled();
  });
});

describe("autoUpdate — negative pattern: legacy paths must NOT fire", () => {
  // After centralization, autoUpdate should NEVER produce output that
  // mentions the legacy commands. Catches a regression where someone
  // re-introduces the marketplace / git-clone / ClawHub advice text.
  it("never references 'claude plugin update' or 'git clone' or 'openclaw plugins update' or 'clawhub' in stderr output", async () => {
    const spawnFn = vi.fn().mockResolvedValue({ stdout: "Updated to 1.2.3.\n", stderr: "", code: 0 });
    await autoUpdate(VALID_CREDS, {
      agent: "claude", spawn: spawnFn, hivemindBinaryPath: "/u/bin/hivemind", stderr: stderrMock,
    });
    const written = stderrMock.mock.calls.map(c => c[0]).join("");
    expect(written).not.toContain("claude plugin update");
    expect(written).not.toContain("git clone");
    expect(written).not.toContain("openclaw plugins update");
    expect(written).not.toContain("clawhub.ai");
  });
});

describe("extractUpdateSummary", () => {
  it("returns the 'Updated to' line on a successful upgrade", () => {
    const out = "Update available: 0.6.99 → 0.7.4\nUpgrading via npm…\nchanged 333 packages\n  Codex installed -> /home/u/.codex/hivemind\nUpdated to 0.7.4.\n";
    expect(extractUpdateSummary(out)).toBe("Updated to 0.7.4.");
  });

  it("returns 'Update available: …' line when no 'Updated to' line is present", () => {
    const out = "Update available: 0.6.99 → 0.7.4\nhivemind is running from a local development checkout\n";
    expect(extractUpdateSummary(out)).toBe("Update available: 0.6.99 → 0.7.4");
  });

  it("returns the 'is up to date' line when nothing newer", () => {
    const out = "hivemind 0.7.4 is up to date (npm latest: 0.7.4).";
    expect(extractUpdateSummary(out)).toBe("hivemind 0.7.4 is up to date (npm latest: 0.7.4).");
  });

  it("returns null when no recognized phrase is present", () => {
    expect(extractUpdateSummary("Unknown command: update")).toBeNull();
    expect(extractUpdateSummary("")).toBeNull();
  });

  it("prefers 'Updated to' over 'Update available' if both appear (specificity)", () => {
    const out = "Update available: 0.6.99 → 0.7.4\nUpgrading…\nUpdated to 0.7.4.";
    expect(extractUpdateSummary(out)).toBe("Updated to 0.7.4.");
  });

  it("handles CRLF line endings", () => {
    const out = "Updated to 0.7.4.\r\n";
    expect(extractUpdateSummary(out)).toBe("Updated to 0.7.4.");
  });
});
