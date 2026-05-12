/**
 * Build the "existing skills" block the gate prompt sees, from both the
 * project-local skills root (`<cwd>/.claude/skills`) and the user-global
 * one (`~/.claude/skills`).
 *
 * Why both roots: the autopull lands pulled skills under the global root
 * regardless of scope-config, while the worker used to read only the
 * project root. That asymmetry meant the gate was making KEEP/MERGE
 * decisions blind to skills the user already had globally — the root
 * cause of cross-author duplicates (e.g. two near-identical "standup"
 * skills mined a few days apart because the gate never saw the first).
 *
 * Interim policy on MERGE targets: project-local only. Editing a
 * globally-pulled skill (potentially authored by someone else) without
 * the contributors / scope-promotion plumbing tracked in issue #118 is
 * unsafe — it would silently overwrite a teammate's work or produce
 * ambiguous lineage in the skills table. Global skills are reference
 * only here; they shape the gate's KEEP/SKIP decision but are not valid
 * MERGE targets.
 */

import { listSkills, resolveSkillsRoot } from "./skill-writer.js";

export interface TaggedSkill {
  name: string;
  body: string;
  source: "project" | "global";
}

export interface ExistingSkillsBlock {
  /** Names eligible as MERGE targets — project-local only. */
  mergeTargetNames: string[];
  /** Rendered block of all skills (project + global) for the gate prompt. */
  block: string;
}

/**
 * Collect every existing skill the gate should know about, with its
 * source root tagged. If a name collides across roots, the project copy
 * wins (the user is presumed to be actively editing it locally).
 */
export function listAllExistingSkills(cwd: string): TaggedSkill[] {
  const projectRoot = resolveSkillsRoot("project", cwd);
  const globalRoot = resolveSkillsRoot("global", cwd);
  const tagged: TaggedSkill[] = [
    ...listSkills(projectRoot).map(s => ({ ...s, source: "project" as const })),
    ...listSkills(globalRoot).map(s => ({ ...s, source: "global" as const })),
  ];
  const seen = new Set<string>();
  const out: TaggedSkill[] = [];
  for (const s of tagged) {
    if (seen.has(s.name)) continue;
    seen.add(s.name);
    out.push(s);
  }
  return out;
}

/**
 * Render the gate-prompt block. `charCap` is the soft budget — once we
 * cross it, we emit a "[…N more omitted]" line and stop.
 */
export function renderExistingSkillsBlock(cwd: string, charCap: number): ExistingSkillsBlock {
  const skills = listAllExistingSkills(cwd);
  if (skills.length === 0) {
    return {
      mergeTargetNames: [],
      block: "(no existing skills — MERGE is NOT a valid choice; pick KEEP or SKIP only)",
    };
  }
  const mergeTargetNames = skills.filter(s => s.source === "project").map(s => s.name);
  let total = 0;
  const out: string[] = [];
  for (const s of skills) {
    const tag = s.source === "project" ? "[project]" : "[global, read-only]";
    const block = `--- existing skill ${tag}: ${s.name} ---\n${s.body}\n`;
    if (total + block.length > charCap) {
      out.push(`[…${skills.length - out.length} more existing skills omitted]`);
      break;
    }
    out.push(block);
    total += block.length;
  }
  return { mergeTargetNames, block: out.join("\n") };
}
