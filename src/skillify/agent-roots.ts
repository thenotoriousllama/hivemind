/**
 * Detect skill discovery roots for non-Claude agents installed on this
 * machine. Used by the pull fan-out to symlink each pulled skill into
 * every agent's native skills directory so the same canonical SKILL.md
 * (under ~/.claude/skills/) is discoverable by Codex, Hermes, and pi.
 *
 * Existence-based detection: each agent's hivemind installer creates its
 * skills root the first time it runs (see src/cli/install-codex.ts:191
 * for `~/.agents/skills`, src/cli/install-hermes.ts:177 for
 * `~/.hermes/skills`, src/cli/install-pi.ts for the pi paths). Treating
 * "directory exists" as "agent installed" avoids coupling auto-pull to
 * the installer modules and keeps the detector hermetic — tests stub
 * HOME and `mkdirSync` only the roots they want to simulate.
 *
 * The Claude Code root (`~/.claude/skills/`) is excluded because the
 * canonical write location IS that path; symlinking a skill into itself
 * would be a no-op at best and a self-referential loop at worst.
 *
 * Cursor has no native skill discovery (only hooks/rules), so it is not
 * a candidate.
 */

import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * Candidate skill roots, in stable order. The order is the order in
 * which symlinks are created, and the order in which roots are listed
 * in any user-facing summary — hold it stable for predictable test
 * assertions and for deterministic manifest output.
 */
function candidates(home: string): string[] {
  return [
    // agentskills.io shared root — codex installer always creates it,
    // pi reads from it as one of two paths.
    join(home, ".agents", "skills"),
    // hermes-specific root, agentskills.io-compatible layout.
    join(home, ".hermes", "skills"),
    // pi's primary root (pi reads from this AND ~/.agents/skills/).
    join(home, ".pi", "agent", "skills"),
  ];
}

/**
 * Return absolute paths of installed non-Claude agent skill roots.
 * Filters out the canonical Claude root (caller's `canonicalRoot`) so
 * we never try to symlink a directory into itself when the user
 * happens to have configured `canonicalRoot` to one of the candidates.
 *
 * Pure: zero side effects, two existsSync calls per candidate. Safe to
 * call from any hot path (auto-pull runs it on every successful pull).
 */
export function detectAgentSkillsRoots(
  canonicalRoot: string,
  home: string = homedir(),
): string[] {
  return candidates(home).filter(p => p !== canonicalRoot && existsSync(p));
}
