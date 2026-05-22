/**
 * Pure renderer for the SessionStart "local mined" surface — the text the
 * Claude Code hook appends to its additionalContext when the user hasn't
 * signed in but `hivemind skillify mine-local` has produced at least one
 * skill.
 *
 * Two branches:
 *   1. We have a recent manifest entry carrying a `insight` string — render
 *      the concrete-insight surface (the pattern hivemind found, the skill
 *      minted to catch it, the sign-in CTA).
 *   2. We don't — fall back to the legacy count-only surface so users on
 *      pre-insight manifests (or whose gate skipped the insight field) still
 *      get a useful "N skills exist" hint.
 *
 * Both branches end with the same sign-in CTA so unauthenticated users see a
 * concrete reason to run `hivemind login`. The string is appended to the
 * "Not logged in" warning block, so it must lead with a newline gap.
 *
 * Kept as a pure function (no fs reads, no env, no defaults) so unit tests
 * can drive both branches with synthetic inputs and assert on the rendered
 * text without standing up a tmp HOME.
 */

import type { LocalManifestEntry } from "./local-manifest.js";

export interface LocalMinedBannerInput {
  /** Most recent manifest entry whose `insight` is non-empty, or null. */
  insightEntry: LocalManifestEntry | null;
  /** Total entries in the manifest (insight-bearing or not). */
  totalCount: number;
}

/**
 * Render the SessionStart "local mined" note. Returns an empty string when
 * there are no entries at all — the hook then emits no extra block.
 */
export function renderLocalMinedNote(input: LocalMinedBannerInput): string {
  const { insightEntry, totalCount } = input;
  if (totalCount <= 0) return "";

  if (insightEntry && insightEntry.insight && insightEntry.insight.trim().length > 0) {
    const insight = insightEntry.insight.trim();
    const name = insightEntry.skill_name;
    // Three lines: the finding (congratulatory), the actionable next step,
    // and the sign-in CTA. Matches the gamification north star (always a
    // congratulatory verb + call-to-action) while keeping the existing
    // emoji-light style of the file.
    return (
      `\n\nHivemind found a pattern in your past sessions: ${insight}\n` +
      `Minted skill \`${name}\` to catch it next time — try \`claude -p '/${name} <your prompt>'\`.\n` +
      `Run 'hivemind login' to keep these skills across machines and share with your team.`
    );
  }

  // Fallback: same shape as the pre-insight banner so behavior on legacy
  // manifests is unchanged. We do NOT silently drop the surface when an
  // entry exists without an insight — users still get the "you have N
  // skills, sign in to share" prompt.
  const plural = totalCount === 1 ? "" : "s";
  return (
    `\n\n${totalCount} local skill${plural} from past 'hivemind skillify mine-local' run(s) live in ~/.claude/skills/. ` +
    `Run 'hivemind login' to start sharing new mining results with your team.`
  );
}
