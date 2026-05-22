/**
 * Unit tests for src/skillify/local-mined-banner.ts — the pure renderer
 * the Claude Code SessionStart hook calls when the user hasn't signed in
 * but has run `hivemind skillify mine-local`. Both branches (concrete
 * insight present vs. count-only fallback) must be exercised because
 * they're the only conditional copy in the hook's user-visible surface.
 */

import { describe, it, expect } from "vitest";
import { renderLocalMinedNote } from "../../src/skillify/local-mined-banner.js";
import type { LocalManifestEntry } from "../../src/skillify/local-manifest.js";

function makeEntry(over: Partial<LocalManifestEntry> = {}): LocalManifestEntry {
  return {
    skill_name: "verify-before-done",
    canonical_path: "/home/x/.claude/skills/verify-before-done/SKILL.md",
    symlinks: [],
    source_session_ids: ["sid"],
    source_session_paths: ["/x/sid.jsonl"],
    source_agent: "claude_code",
    gate_agent: "claude_code",
    created_at: "2026-05-22T00:00:00.000Z",
    uploaded: false,
    ...over,
  };
}

describe("renderLocalMinedNote", () => {
  it("returns empty string when no entries exist", () => {
    // No banner at all when nothing's been mined — the surrounding hook
    // would otherwise emit an unhelpful "0 skills" line.
    expect(renderLocalMinedNote({ insightEntry: null, totalCount: 0 })).toBe("");
  });

  describe("concrete-insight branch", () => {
    const insightEntry = makeEntry({
      skill_name: "verify-before-done",
      insight: "You revisited 4 merged PRs in the last month because tests weren't run before merge.",
    });

    it("renders the insight, skill name, and sign-in CTA", () => {
      const out = renderLocalMinedNote({ insightEntry, totalCount: 3 });
      // Concrete + quantified line surfaced verbatim
      expect(out).toContain(
        "Hivemind found a pattern in your past sessions: You revisited 4 merged PRs",
      );
      // Skill name surfaced + actionable claude -p invocation
      expect(out).toContain("`verify-before-done`");
      expect(out).toContain("claude -p '/verify-before-done");
      // Sign-in CTA — the whole reason this surface exists pre-auth
      expect(out).toContain("hivemind login");
      // Negative pattern: the legacy count line MUST NOT appear when an
      // insight is present (we replaced it, not appended to it)
      expect(out).not.toMatch(/\d+ local skill/);
    });

    it("starts with a blank-line separator so it appends cleanly to the warning block", () => {
      // The hook appends this to a "Not logged in" line — without the
      // leading "\n\n" the banner glues onto the warning sentence and
      // becomes unreadable.
      const out = renderLocalMinedNote({ insightEntry, totalCount: 1 });
      expect(out.startsWith("\n\n")).toBe(true);
    });

    it("trims surrounding whitespace from the insight before rendering", () => {
      // The accessor (getLatestInsightEntry) returns the entry as-stored;
      // the renderer is the last guard before user-visible copy. If a
      // future code path lets a padded insight through, we still render
      // a clean line.
      const padded = makeEntry({
        insight: "   You hit the same env-mismatch twice this week.   \n",
      });
      const out = renderLocalMinedNote({ insightEntry: padded, totalCount: 1 });
      expect(out).toContain(": You hit the same env-mismatch twice this week.");
      expect(out).not.toContain(":    You hit");
    });
  });

  describe("count-only fallback branch", () => {
    it("renders the legacy count surface when no insight-bearing entry is present", () => {
      // Mirrors what existing pre-insight users see today — must keep
      // working byte-for-byte for entries written before the field landed.
      const out = renderLocalMinedNote({ insightEntry: null, totalCount: 5 });
      expect(out).toContain("5 local skills from past 'hivemind skillify mine-local'");
      expect(out).toContain("hivemind login");
      // Negative pattern: must NOT mention "found a pattern" / a skill
      // name / a `claude -p` invocation — those belong only to the
      // insight branch and would be hallucinated copy in the fallback.
      expect(out).not.toContain("found a pattern");
      expect(out).not.toContain("claude -p");
    });

    it("uses singular noun for exactly one entry", () => {
      const out = renderLocalMinedNote({ insightEntry: null, totalCount: 1 });
      expect(out).toContain("1 local skill from past");
      expect(out).not.toContain("1 local skills");
    });

    it("falls back to count surface when the insight string is empty / whitespace", () => {
      // Defense-in-depth: getLatestInsightEntry already filters these,
      // but if a caller ever passes a malformed entry directly we must
      // not render `: ` with nothing after it.
      const empty = makeEntry({ insight: "   " });
      const out = renderLocalMinedNote({ insightEntry: empty, totalCount: 2 });
      expect(out).toContain("2 local skills from past");
      expect(out).not.toContain("found a pattern");
    });
  });
});
