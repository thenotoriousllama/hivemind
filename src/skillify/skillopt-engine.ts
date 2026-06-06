/**
 * The weekly SkillOpt cycle, wired end to end and fully injectable:
 *
 *   detect deficient skills  →  ≥5 fire gate  →  for each: read body, propose a
 *   bounded edit, write a REVIEW PROPOSAL (not a live publish).
 *
 * Why proposals, not auto-publish: the offline gate isn't trustworthy (spike
 * finding), so we never auto-overwrite a live skill. The engine surfaces concrete,
 * evidence-backed edit proposals; turning one live is gated on the real-usage A/B
 * (deferred) or a human. Everything is injected (query, judge/proposer models, the
 * skill reader, the proposal writer), so this orchestration is unit-tested with no
 * Deeplake / LLM / fs.
 */
import fs from "node:fs";
import path from "node:path";
import { detectDeficientSkills, type DetectorConfig } from "./deficiency-detector.js";
import { proposeSkillEdit, type ProposeConfig } from "./skill-proposer.js";
import { splitFrontmatter } from "./skill-publisher.js";
import type { QueryFn } from "./skill-invocations.js";
import { sqlStr, sqlIdent } from "../utils/sql.js";
import type { Edit } from "./skill-edits.js";
import type { PulledManifest } from "./manifest.js";

export interface ProposalRecord {
  name: string;
  author: string;
  baseVersion: number;   // org-table version this proposal derives from; publish lands as baseVersion+1
  invocations: number;
  confirmedFailures: number;
  failureRate: number;
  examples: string[];
  edits: Edit[];
  report: string[];
  candidateBody: string;
  createdAt: string;
}

export interface CycleDeps {
  query: QueryFn;
  sessionsTable: string;
  readSkillBody: (name: string, author: string) => Promise<{ body: string; version: number } | null>; // org skills table is the source of truth — null when the skill isn't there
  writeProposal: (rec: ProposalRecord) => void;
  detector?: DetectorConfig;
  proposer?: ProposeConfig;
  fireThreshold?: number; // deficient-skill count to fire (default 5)
  maxProposals?: number;  // cap edits proposed per cycle (default 10)
  now: string;            // ISO timestamp (injected — Date is awkward in workers)
  meta?: {                // optimizer cross-run memory (skillopt-meta); optional
    prior: (name: string, author: string) => string[];
    has: (name: string, author: string, edits: Edit[]) => boolean;
    record: (name: string, author: string, edits: Edit[]) => void;
  };
}

export interface CycleResult {
  deficientCount: number;
  fired: boolean;
  proposals: Array<{ name: string; author: string; changed: boolean; failureRate: number }>;
}

export async function runSkillOptCycle(deps: CycleDeps): Promise<CycleResult> {
  const fireThreshold = deps.fireThreshold ?? 5;
  const { skills, deficientCount } = await detectDeficientSkills(deps.query, deps.sessionsTable, deps.detector);

  // The ≥N gate: only act on a real PATTERN of deficiency, not one or two noisy skills.
  if (deficientCount < fireThreshold) {
    return { deficientCount, fired: false, proposals: [] };
  }

  const targets = skills.filter((s) => s.deficient).slice(0, deps.maxProposals ?? 10);
  const proposals: CycleResult["proposals"] = [];
  for (const s of targets) {
    const current = await deps.readSkillBody(s.name, s.author);
    if (!current) continue; // not in the org skills table → nothing to edit
    const { body } = current;
    const priorEdits = deps.meta?.prior(s.name, s.author) ?? [];
    const p = await proposeSkillEdit(body, s.examples, { ...deps.proposer, priorEdits });
    // dedup against the meta memory — don't re-write an edit already tried for this skill.
    const isDup = p.changed && (deps.meta?.has(s.name, s.author, p.edits) ?? false);
    if (p.changed && !isDup) {
      deps.writeProposal({
        name: s.name, author: s.author, baseVersion: current.version,
        invocations: s.invocations, confirmedFailures: s.confirmedFailures, failureRate: s.failureRate,
        examples: s.examples, edits: p.edits, report: p.report,
        candidateBody: p.editedBody, createdAt: deps.now,
      });
      deps.meta?.record(s.name, s.author, p.edits);
    }
    proposals.push({ name: s.name, author: s.author, changed: p.changed && !isDup, failureRate: s.failureRate });
  }
  return { deficientCount, fired: true, proposals };
}

/** Default proposal writer: <proposalsRoot>/<name>--<author>/{proposal.json,candidate.md}. */
export function writeProposalToDisk(proposalsRoot: string, rec: ProposalRecord): string {
  const dir = path.join(proposalsRoot, `${rec.name}--${rec.author}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "candidate.md"), rec.candidateBody.trimEnd() + "\n");
  fs.writeFileSync(path.join(dir, "proposal.json"), JSON.stringify(rec, null, 2) + "\n");
  return dir;
}

/**
 * Read a skill's CURRENT body + version from the Deeplake `skills` table — the
 * ORG-WIDE source of truth. Latest version wins (mirrors pull.ts's `ORDER BY
 * version DESC`). The table's `body` column is already frontmatter-less (pull
 * reconstructs frontmatter from the other columns), which is exactly what the
 * proposer consumes. Unlike readSkillBodyViaManifest (local disk), this works
 * even when the deficient skill ISN'T installed on the machine running the
 * worker — the common case, since detection is org-wide but any one user has
 * only a subset of org skills pulled. null when the skill isn't in the table
 * or carries no body.
 */
export async function readSkillBodyFromOrgTable(
  query: QueryFn,
  skillsTable: string,
  name: string,
  author: string,
): Promise<{ body: string; version: number } | null> {
  const rows = await query(
    `SELECT body, version FROM "${sqlIdent(skillsTable)}" ` +
    `WHERE name = '${sqlStr(name)}' AND author = '${sqlStr(author)}' ` +
    `ORDER BY version DESC LIMIT 1`,
  );
  const row = rows?.[0];
  const body = typeof row?.body === "string" ? row.body.trim() : "";
  if (!body) return null;
  const version = Number(row?.version);
  return { body, version: Number.isFinite(version) && version > 0 ? version : 1 };
}

/** Read a skill's SKILL.md body (frontmatter stripped) from a skills root; null if absent. */
export function readSkillBodyFromDisk(skillsRoot: string, name: string, author: string): string | null {
  try {
    const md = fs.readFileSync(path.join(skillsRoot, `${name}--${author}`, "SKILL.md"), "utf8");
    return splitFrontmatter(md).body.trim();
  } catch {
    return null;
  }
}

/**
 * Resolve a skill's body from its ACTUAL install location via the pull manifest,
 * trying every recorded installRoot, then a fallback root. Authoritative — handles
 * skills pulled with `--to project` into any cwd (invocations come from all
 * projects, so the worker can't assume its own cwd), and avoids editing a
 * same-named skill that happens to sit in the current cwd.
 */
export function readSkillBodyViaManifest(
  name: string,
  author: string,
  manifest: PulledManifest,
  fallbackRoot?: string,
): string | null {
  const dirName = `${name}--${author}`;
  const roots = manifest.entries.filter((e) => e.dirName === dirName).map((e) => e.installRoot);
  if (fallbackRoot) roots.push(fallbackRoot);
  for (const root of roots) {
    const body = readSkillBodyFromDisk(root, name, author);
    if (body) return body;
  }
  return null;
}
