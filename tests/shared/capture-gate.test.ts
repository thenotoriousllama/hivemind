import { describe, it, expect } from "vitest";
import { entrypointPassesOnlyCliGate } from "../../src/hooks/shared/capture-gate.js";

// The helper takes an explicit env map so each test feeds the exact
// combination it wants to assert on. process.env is read only when the
// caller omits the argument; covered separately below.

describe("entrypointPassesOnlyCliGate", () => {
  it("passes when the gate env var is unset (default behavior)", () => {
    expect(entrypointPassesOnlyCliGate({})).toBe(true);
  });

  it("passes when the gate env var is anything other than 'true'", () => {
    // Defensive: only the exact literal "true" should activate the gate.
    expect(entrypointPassesOnlyCliGate({ HIVEMIND_CAPTURE_ONLY_CLI: "false" })).toBe(true);
    expect(entrypointPassesOnlyCliGate({ HIVEMIND_CAPTURE_ONLY_CLI: "1" })).toBe(true);
    expect(entrypointPassesOnlyCliGate({ HIVEMIND_CAPTURE_ONLY_CLI: "yes" })).toBe(true);
    expect(entrypointPassesOnlyCliGate({ HIVEMIND_CAPTURE_ONLY_CLI: "" })).toBe(true);
  });

  it("passes with gate active and entrypoint='cli'", () => {
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "cli",
    })).toBe(true);
  });

  it("passes with gate active and entrypoint contains 'cli' as substring", () => {
    // Substring match (not equality) is intentional — covers future variants
    // like cli-interactive, claude-cli, etc. without code changes.
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "cli-interactive",
    })).toBe(true);
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "claude-cli",
    })).toBe(true);
  });

  it("blocks with gate active and entrypoint='sdk-py'", () => {
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "sdk-py",
    })).toBe(false);
  });

  it("blocks with gate active and entrypoint='sdk-ts'", () => {
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "sdk-ts",
    })).toBe(false);
  });

  it("blocks with gate active and entrypoint undefined", () => {
    // Strict: missing entrypoint is treated as non-cli. An empty string
    // doesn't contain the "cli" substring so the gate filters it out.
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
    })).toBe(false);
  });

  it("blocks with gate active and entrypoint=''", () => {
    expect(entrypointPassesOnlyCliGate({
      HIVEMIND_CAPTURE_ONLY_CLI: "true",
      CLAUDE_CODE_ENTRYPOINT: "",
    })).toBe(false);
  });

  it("blocks with gate active and any future sdk-* entrypoint", () => {
    // Forward compat: hypothetical sdk-go, sdk-rust, mcp-host, etc.
    for (const ep of ["sdk-go", "sdk-rust", "mcp-host", "vscode", "web"]) {
      expect(entrypointPassesOnlyCliGate({
        HIVEMIND_CAPTURE_ONLY_CLI: "true",
        CLAUDE_CODE_ENTRYPOINT: ep,
      })).toBe(false);
    }
  });

  it("defaults to process.env when no argument is passed", () => {
    // Snapshot + restore to keep the suite hermetic.
    const prev = {
      ONLY_CLI: process.env.HIVEMIND_CAPTURE_ONLY_CLI,
      EP: process.env.CLAUDE_CODE_ENTRYPOINT,
    };
    try {
      process.env.HIVEMIND_CAPTURE_ONLY_CLI = "true";
      process.env.CLAUDE_CODE_ENTRYPOINT = "sdk-py";
      expect(entrypointPassesOnlyCliGate()).toBe(false);

      process.env.CLAUDE_CODE_ENTRYPOINT = "cli";
      expect(entrypointPassesOnlyCliGate()).toBe(true);

      delete process.env.HIVEMIND_CAPTURE_ONLY_CLI;
      process.env.CLAUDE_CODE_ENTRYPOINT = "sdk-py";
      expect(entrypointPassesOnlyCliGate()).toBe(true);
    } finally {
      if (prev.ONLY_CLI === undefined) delete process.env.HIVEMIND_CAPTURE_ONLY_CLI;
      else process.env.HIVEMIND_CAPTURE_ONLY_CLI = prev.ONLY_CLI;
      if (prev.EP === undefined) delete process.env.CLAUDE_CODE_ENTRYPOINT;
      else process.env.CLAUDE_CODE_ENTRYPOINT = prev.EP;
    }
  });
});
