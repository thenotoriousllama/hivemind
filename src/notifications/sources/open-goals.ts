/**
 * Open-goals SessionStart summary.
 *
 * Reads the user's goal JSON files from the memory table
 * (path LIKE 'goals/%.json'), filters to those owned by current_user
 * with status='active', and produces a short one-line summary the
 * primary banner appends to its body.
 *
 * Returns null when:
 *   - creds are missing
 *   - the memory table is unreachable (network / auth / missing)
 *   - no open goals match
 *
 * The query is intentionally permissive (LIKE on JSON substrings) so
 * we don't depend on JSONB query support — the memory table column is
 * just TEXT. False positives are harmless (we re-parse each row in JS
 * and drop anything that doesn't pass JSON validation).
 *
 * Hard timeout: caller's responsibility — `pickPrimaryBanner` already
 * runs under the SessionStart hook's overall budget.
 */

import type { Credentials } from "../../commands/auth-creds.js";
import { DeeplakeApi } from "../../deeplake-api.js";
import { sqlIdent, sqlStr } from "../../utils/sql.js";
import { log as _log } from "../../utils/debug.js";

const log = (msg: string) => _log("notifications-open-goals", msg);

export interface OpenGoalsSummary {
  /** Total count of open goals owned by current_user. */
  count: number;
  /** Up to 3 short labels in newest-first order — used for the body line. */
  sample: string[];
}

interface GoalShape {
  goal_id?: unknown;
  text?: unknown;
  scope?: unknown;
  status?: unknown;
  assigned_to?: unknown;
  kpis?: unknown;
}

/**
 * Fetch and summarize the current user's open goals.
 * Resolves to `null` on any error or when there is nothing to show.
 */
export async function fetchOpenGoals(
  creds: Credentials,
  tableName: string,
): Promise<OpenGoalsSummary | null> {
  if (!creds.token || !creds.userName) return null;
  try {
    if (!creds.orgId) return null;
    const api = new DeeplakeApi(
      creds.token,
      creds.apiUrl ?? "https://api.deeplake.ai",
      creds.orgId,
      creds.workspaceId ?? "default",
      tableName,
    );
    const safe = sqlIdent(tableName);
    // Two LIKE filters narrow the scan to plausibly-active goals
    // for current_user. The path filter accepts both '/goals/...'
    // (VFS canonical form, leading slash) and 'goals/...' (relative)
    // because different writers may have used either. Final JSON
    // parse re-validates each row.
    const sql =
      `SELECT path, summary FROM "${safe}" ` +
      `WHERE path LIKE '%goals/%.json' ` +
      `  AND summary LIKE '%${sqlStr(creds.userName)}%' ` +
      `  AND summary LIKE '%"status":%active%' ` +
      `ORDER BY last_update_date DESC LIMIT 25`;
    const rows = (await api.query(sql)) as Array<{ path?: string; summary?: string }>;
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const goals: Array<{ text: string }> = [];
    for (const r of rows) {
      const goal = parseGoal(r.summary);
      if (!goal) continue;
      if (goal.status !== "active") continue;
      // Tolerate both forms: bare userName ("emanuele.fenocchi") and
      // full email ("emanuele.fenocchi@activeloop.ai"). The skill
      // teaches the agent to use the full email when available, but
      // creds.userName is just the local-part for some orgs. Match
      // either by substring containment, both directions.
      const a = goal.assigned_to;
      const u = creds.userName;
      if (a !== u && !a.includes(u) && !u.includes(a)) continue;
      goals.push({ text: goal.text });
    }
    if (goals.length === 0) return null;
    return {
      count: goals.length,
      sample: goals.slice(0, 3).map(g => truncate(g.text, 60)),
    };
  } catch (e: unknown) {
    log(`fetchOpenGoals: ${(e as Error).message}`);
    return null;
  }
}

interface ValidGoal {
  text: string;
  status: string;
  assigned_to: string;
}

function parseGoal(summary: string | undefined): ValidGoal | null {
  if (typeof summary !== "string" || summary.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(summary);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed == null) return null;
  const g = parsed as GoalShape;
  if (typeof g.text !== "string" || g.text.length === 0) return null;
  if (typeof g.status !== "string") return null;
  if (typeof g.assigned_to !== "string") return null;
  return { text: g.text, status: g.status, assigned_to: g.assigned_to };
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

/**
 * Format the goals summary into ONE body line suitable for the
 * primary banner. Returns the empty string when there is nothing
 * worth showing.
 */
export function formatOpenGoalsLine(summary: OpenGoalsSummary | null): string {
  if (!summary || summary.count === 0) return "";
  const head = summary.count === 1
    ? "1 goal open"
    : `${summary.count} goals open`;
  if (summary.sample.length === 0) return head;
  return `${head} · ${summary.sample.join(" · ")}`;
}
