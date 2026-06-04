import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { WIKI_PROMPT_TEMPLATE as CLAUDE_TEMPLATE } from "../../src/hooks/spawn-wiki-worker.js";
import { WIKI_PROMPT_TEMPLATE as CODEX_TEMPLATE } from "../../src/hooks/codex/spawn-wiki-worker.js";
import { WIKI_PROMPT_TEMPLATE as CURSOR_TEMPLATE } from "../../src/hooks/cursor/spawn-wiki-worker.js";
import { WIKI_PROMPT_TEMPLATE as HERMES_TEMPLATE } from "../../src/hooks/hermes/spawn-wiki-worker.js";

/**
 * Contract lock-in for the `## Next Steps` instruction in the wiki-worker
 * prompt. This section is the sole source of the resume "pick up where you
 * left off" pointer, so over-generous wording here is exactly what produces
 * false-positive next steps in the SessionStart brief.
 *
 * The prompt lives in FIVE hand-maintained copies (claude / codex / cursor /
 * hermes, plus the pi extension which ships as raw TypeScript and is read at
 * the source level here). The intros differ slightly per agent, but the
 * `## Next Steps` block must stay byte-identical across all five — a copy
 * drifting back to looser wording (or, as pi originally did, omitting the
 * section entirely) silently reopens the false-positive path for that agent.
 * These tests guard both the contract and the cross-copy sync.
 */

// pi ships its prompt inline in a raw-TS extension that can't be imported and
// executed here, so lift the template literal from source — same approach as
// tests/pi/pi-extension-source.test.ts.
const PI_TEMPLATE = readFileSync(
  join(process.cwd(), "pi", "extension-source", "hivemind.ts"),
  "utf-8",
);

const TEMPLATES = {
  claude: CLAUDE_TEMPLATE,
  codex: CODEX_TEMPLATE,
  cursor: CURSOR_TEMPLATE,
  hermes: HERMES_TEMPLATE,
  pi: PI_TEMPLATE,
} as const;

/** Extract the body of the `## Next Steps` section (up to the next blank-line
 *  paragraph break / next `##` heading). The instruction is a single angle-
 *  bracketed line, so we capture from `## Next Steps` to the first following
 *  blank line. */
function nextStepsSection(template: string): string {
  const marker = "## Next Steps\n";
  const start = template.indexOf(marker);
  if (start === -1) return "";
  const after = start + marker.length;
  const end = template.indexOf("\n\n", after);
  return (end === -1 ? template.slice(after) : template.slice(after, end)).trim();
}

describe("wiki Next Steps prompt contract", () => {
  for (const [agent, template] of Object.entries(TEMPLATES)) {
    describe(`${agent} template`, () => {
      const section = nextStepsSection(template);

      it("has a non-empty ## Next Steps section", () => {
        expect(section.length).toBeGreaterThan(0);
      });

      it("defaults to `none`", () => {
        expect(section).toContain("Default to writing exactly: none");
      });

      it("enforces the substantial-consequence gate", () => {
        expect(section).toContain("MISS SOMETHING IMPORTANT WITH SUBSTANTIAL CONSEQUENCES");
        // The model must name a concrete bad outcome before writing anything
        // other than `none`.
        expect(section).toMatch(/concrete[^.]*bad outcome/i);
      });

      it("drops the base-rate framing that biased the judgment", () => {
        // The old wording asserted a frequency ("most sessions are DONE",
        // "overwhelming majority"); the right frequency is use-case dependent
        // and must not be baked into the prompt.
        expect(section).not.toMatch(/overwhelming majority/i);
        expect(section).not.toMatch(/most sessions are done/i);
        expect(section).toMatch(/do not assume any base rate/i);
      });

      it("treats administrative wrap-up as already done", () => {
        expect(section).toMatch(/administrative wrap-up/i);
        expect(section).toMatch(/already done/i);
      });
    });
  }

  it("keeps the ## Next Steps block byte-identical across all four agent copies", () => {
    const sections = Object.values(TEMPLATES).map(nextStepsSection);
    const [reference, ...rest] = sections;
    for (const s of rest) {
      expect(s).toBe(reference);
    }
  });
});
