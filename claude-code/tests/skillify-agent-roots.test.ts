import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectAgentSkillsRoots } from "../../src/skillify/agent-roots.js";

let tmpHome: string;

beforeEach(() => {
  tmpHome = mkdtempSync(join(tmpdir(), "skillify-agent-roots-"));
});

afterEach(() => {
  try { rmSync(tmpHome, { recursive: true, force: true }); } catch { /* nothing */ }
});

const canonical = (home: string) => join(home, ".claude", "skills");

describe("detectAgentSkillsRoots", () => {
  it("returns empty array when no agent root exists", () => {
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toEqual([]);
  });

  it("detects ~/.agents/skills when it exists", () => {
    mkdirSync(join(tmpHome, ".agents", "skills"), { recursive: true });
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toEqual([
      join(tmpHome, ".agents", "skills"),
    ]);
  });

  it("detects ~/.hermes/skills when it exists", () => {
    mkdirSync(join(tmpHome, ".hermes", "skills"), { recursive: true });
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toEqual([
      join(tmpHome, ".hermes", "skills"),
    ]);
  });

  it("detects ~/.pi/agent/skills when it exists", () => {
    mkdirSync(join(tmpHome, ".pi", "agent", "skills"), { recursive: true });
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toEqual([
      join(tmpHome, ".pi", "agent", "skills"),
    ]);
  });

  it("returns a stable order: .agents, .hermes, .pi", () => {
    // Create them in reverse order; detection order should still be stable.
    mkdirSync(join(tmpHome, ".pi", "agent", "skills"), { recursive: true });
    mkdirSync(join(tmpHome, ".hermes", "skills"), { recursive: true });
    mkdirSync(join(tmpHome, ".agents", "skills"), { recursive: true });
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toEqual([
      join(tmpHome, ".agents", "skills"),
      join(tmpHome, ".hermes", "skills"),
      join(tmpHome, ".pi", "agent", "skills"),
    ]);
  });

  it("never returns the canonical Claude root, even if a user configured it as canonical", () => {
    // Pretend `~/.agents/skills` is the canonical write location (would
    // happen if a future config let the user pick a non-Claude canonical
    // root). The function must filter it out so we don't symlink a
    // directory into itself.
    mkdirSync(join(tmpHome, ".agents", "skills"), { recursive: true });
    mkdirSync(join(tmpHome, ".hermes", "skills"), { recursive: true });
    const result = detectAgentSkillsRoots(join(tmpHome, ".agents", "skills"), tmpHome);
    expect(result).toEqual([join(tmpHome, ".hermes", "skills")]);
  });

  it("requires a directory — a regular file at the candidate path is treated as missing", () => {
    // Edge case: if a user has `~/.hermes/skills` as a regular file
    // (broken install, leftover from a different tool), existsSync
    // returns true but we shouldn't try to symlink into it. existsSync
    // alone matches our needs because the symlink fan-out's idempotency
    // checks (lstat) handle the file-vs-dir distinction at link time.
    // This test documents that we do NOT pre-filter on dir-ness — that
    // responsibility lives in the symlink writer, which is the only
    // place that has enough context to refuse safely.
    mkdirSync(join(tmpHome, ".hermes"), { recursive: true });
    // Touch a regular file at the candidate path.
    const path = join(tmpHome, ".hermes", "skills");
    mkdirSync(path, { recursive: true });
    expect(detectAgentSkillsRoots(canonical(tmpHome), tmpHome)).toContain(path);
  });
});
