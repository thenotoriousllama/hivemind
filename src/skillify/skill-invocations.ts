/**
 * Read side of skill *invocation* attribution — the basis for deficiency detection.
 *
 * A skill can only help or hurt if the agent actually INVOKED it. Claude Code
 * records each invocation as a `Skill` tool_use, which capture.ts persists as a
 * tool_call row: `message.tool_name === "Skill"`, `message.tool_input` a JSON
 * string `{ skill: "<name>--<author>", args? }`. We key on these real invocations
 * rather than availability (the dropped skills_active) because:
 *   - it's accurate — availability-without-invocation is pure noise, and
 *   - it pins the exact turn, so we can window the judge tightly around it.
 *
 * Org skills only: the invoked `skill` is `<name>--<author>`. Plugin-namespaced
 * (`hivemind:...`) and bare skills are not org-mined skills and are skipped.
 *
 * Every query is injected (QueryFn), so this is unit-testable with no live Deeplake.
 */
import { sqlStr } from "../utils/sql.js";

export type QueryFn = (sql: string) => Promise<Array<Record<string, unknown>>>;

export interface SkillInvocation {
  sessionId: string;
  name: string;
  author: string;
  ts: string; // invocation timestamp (message.timestamp, else the row's last_update_date)
}

export interface ParsedMsg {
  type?: string;
  tool_name?: string;
  tool_input?: unknown;
  tool_use_id?: unknown;
  content?: unknown;
  session_id?: unknown;
  timestamp?: unknown;
}

export function parseMessage(m: unknown): ParsedMsg | null {
  if (m == null) return null;
  if (typeof m === "string") {
    try { return JSON.parse(m) as ParsedMsg; } catch { return null; }
  }
  if (typeof m === "object") return m as ParsedMsg;
  return null;
}

/** The skill ref invoked by a tool_call message (e.g. "name--author"), else null. */
export function invokedSkillRef(msg: ParsedMsg): string | null {
  if (msg.type !== "tool_call" || msg.tool_name !== "Skill") return null;
  let input: unknown = msg.tool_input;
  if (typeof input === "string") { try { input = JSON.parse(input); } catch { return null; } }
  const skill = (input as { skill?: unknown })?.skill;
  return typeof skill === "string" && skill.length > 0 ? skill : null;
}

/** Split "<name>--<author>" → parts. null for plugin-namespaced / bare / malformed refs. */
export function splitOrgSkill(skill: string): { name: string; author: string } | null {
  if (skill.includes(":")) return null; // plugin-namespaced (e.g. hivemind:hivemind-memory)
  // name/author are used to build filesystem paths (skills dir, proposals dir), so a
  // captured tool_input must not smuggle path separators / traversal — same untrusted
  // treatment the pull path applies to these segments.
  if (skill.includes("/") || skill.includes("\\") || skill.includes("..")) return null;
  const i = skill.lastIndexOf("--");
  if (i <= 0 || i + 2 >= skill.length) return null; // bare or malformed
  return { name: skill.slice(0, i), author: skill.slice(i + 2) };
}

/**
 * Org-skill invocations across captured sessions, newest first. Coarse prefilter
 * on `"Skill"` (robust to JSONB colon-spacing) then a precise in-code check, so a
 * stray "Skill" in prose can't slip through as a real invocation.
 */
export async function listSkillInvocations(
  query: QueryFn,
  sessionsTable: string,
  opts: { sinceIso?: string; untilIso?: string; limit?: number } = {},
): Promise<SkillInvocation[]> {
  const where = [`CAST(message AS TEXT) LIKE '%"Skill"%'`];
  if (opts.sinceIso) where.push(`last_update_date >= '${sqlStr(opts.sinceIso)}'`);
  if (opts.untilIso) where.push(`last_update_date < '${sqlStr(opts.untilIso)}'`);
  const limit = opts.limit && opts.limit > 0 ? ` LIMIT ${Math.floor(opts.limit)}` : "";
  const rows = await query(
    `SELECT message, last_update_date FROM "${sessionsTable}" WHERE ${where.join(" AND ")} ORDER BY last_update_date DESC${limit}`,
  );
  const out: SkillInvocation[] = [];
  for (const r of rows) {
    const m = parseMessage(r.message);
    if (!m) continue;
    const ref = invokedSkillRef(m);
    if (!ref) continue;
    const parts = splitOrgSkill(ref);
    if (!parts) continue;
    const sessionId = typeof m.session_id === "string" ? m.session_id : "";
    if (!sessionId) continue;
    out.push({
      sessionId,
      name: parts.name,
      author: parts.author,
      ts: typeof m.timestamp === "string" ? m.timestamp
        : (typeof r.last_update_date === "string" ? r.last_update_date : ""),
    });
  }
  return out;
}

export interface Turn { role: "USER" | "ASSISTANT"; text: string }

/**
 * Reconstruct the transcript turns of a session, and mark where (between which two
 * turns) the given invocation happened — so callers can window around it.
 */
/** Escape SQL LIKE wildcards (% _ \) so a session id with those chars matches literally. */
function likeEscape(s: string): string {
  return s.replace(/([\\%_])/g, "\\$1");
}

async function sessionTurns(
  query: QueryFn, sessionsTable: string, inv: SkillInvocation,
): Promise<{ turns: Turn[]; invIndex: number }> {
  const sid = sqlStr(likeEscape(inv.sessionId));
  const rows = await query(
    `SELECT message FROM "${sessionsTable}" WHERE path LIKE '/sessions/%${sid}%' ESCAPE '\\' ORDER BY creation_date ASC`,
  );
  const turns: Turn[] = [];
  let invIndex = -1;
  for (const r of rows) {
    const j = parseMessage(r.message);
    if (!j) continue;
    // Exact session match: `path LIKE %sid%` can match a substring/wildcard collision,
    // so drop any row whose recorded session_id isn't this exact session.
    if (typeof j.session_id === "string" && j.session_id !== inv.sessionId) continue;
    // The invocation itself is a tool_call (not a turn): mark its position then skip.
    const ref = invokedSkillRef(j);
    if (ref) {
      const p = splitOrgSkill(ref);
      if (invIndex < 0 && p && p.name === inv.name && p.author === inv.author
        && (typeof j.timestamp !== "string" || !inv.ts || j.timestamp === inv.ts)) {
        invIndex = turns.length;
      }
      continue;
    }
    const text = typeof j.content === "string" ? j.content.trim() : "";
    if (!text) continue;
    if (j.type === "user_message") turns.push({ role: "USER", text });
    else if (j.type === "assistant_message") turns.push({ role: "ASSISTANT", text });
  }
  if (invIndex < 0) invIndex = turns.length; // invocation not located → treat as session end
  return { turns, invIndex };
}

/**
 * The transcript window around an invocation: `before` turns before it and `after`
 * turns after — where the help-or-harm signal lives — head+tail elided to maxChars.
 * `before`/`after` are tunable; defaults chosen as a small starting point.
 */
/** A windowed slice plus `pivot` = the index in `turns` of the first POST-invocation
 * turn (turns before it are the pre-invocation context — kept for the judge, but the
 * anchor must not scan them, or a prior correction gets misattributed to this skill). */
export interface WindowSlice {
  turns: Turn[];
  pivot: number;
}

export async function windowedTurns(
  query: QueryFn,
  sessionsTable: string,
  inv: SkillInvocation,
  opts: { before?: number; after?: number } = {},
): Promise<WindowSlice> {
  const before = opts.before ?? 3;
  const after = opts.after ?? 6;
  const { turns, invIndex } = await sessionTurns(query, sessionsTable, inv);
  const start = Math.max(0, invIndex - before);
  return { turns: turns.slice(start, invIndex + after), pivot: invIndex - start };
}

/** Head+tail elide a string to maxChars (so a pasted log/diff can't blow a prompt). */
export function elide(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  const head = text.slice(0, Math.floor(maxChars * 0.55));
  const tail = text.slice(text.length - Math.floor(maxChars * 0.45));
  return `${head}\n\n…[${text.length - maxChars} chars elided]…\n\n${tail}`;
}

export async function windowAroundInvocation(
  query: QueryFn,
  sessionsTable: string,
  inv: SkillInvocation,
  opts: { before?: number; after?: number; maxChars?: number } = {},
): Promise<string> {
  const { turns } = await windowedTurns(query, sessionsTable, inv, opts);
  return elide(turns.map((t) => `${t.role}: ${t.text}`).join("\n\n"), opts.maxChars ?? 4000);
}
