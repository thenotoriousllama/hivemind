/**
 * Read helpers for `hivemind_tasks`. Mirror of src/rules/read.ts —
 * append-only table with per-task_id version monotone; reads dedup to
 * latest per task_id. Compound ORDER BY (version DESC, created_at DESC)
 * is the deterministic tie-break for the rare race where two concurrent
 * editors both INSERT v=N+1 on the same task_id (see the rules-side
 * codex review on S2 for the rationale).
 *
 * `kpis` is normalized through parseKpis so callers always get a typed
 * Kpi[] — Deeplake hands us back the JSONB column as either an object
 * (already decoded) or a JSON string depending on the API path, and the
 * validator collapses both shapes (plus any garbage) into the canonical
 * array.
 */

import { sqlIdent, sqlStr } from "../utils/sql.js";
import { parseKpis, type Kpi } from "./kpi-validator.js";

export type QueryFn = (sql: string) => Promise<Array<Record<string, unknown>>>;

/** Shape of one row in `hivemind_tasks` — mirrors TASKS_COLUMNS. */
export interface TaskRow {
  id: string;
  task_id: string;
  text: string;
  scope: string;            // 'me' | 'team' — kept as string to tolerate forward-compat values
  status: string;           // 'active' | 'done' — same rationale
  assigned_to: string;
  assigned_by: string;
  kpis: Kpi[];              // normalized — readers never see raw JSONB
  version: number;
  created_at: string;
  agent: string;
  plugin_version: string;
}

export type ScopeFilter = "mine" | "me" | "team" | "all";

export interface ListTasksOpts {
  /**
   * 'mine'  = rows where assigned_to == currentUser (across both scopes)
   * 'me'    = rows where scope == 'me' AND assigned_to == currentUser
   *           (strict personal — the SessionStart renderer's mine bucket
   *            uses this so older personal tasks are never evicted by
   *            newer team-scope tasks assigned to current_user before
   *            the limit slice. Codex legacy audit pass 3 P1.A)
   * 'team'  = rows where scope == 'team' (no assignee filter)
   * 'all'   = no filter (both scopes, every assignee)
   * default = 'all' (caller is expected to pass a value at the CLI layer).
   */
  scope?: ScopeFilter;
  /** Filter by status. Default 'active'. */
  status?: "active" | "done" | "all";
  /** Required when scope='mine' or scope='me'. Ignored otherwise. */
  current_user?: string;
  /** Max rows returned. Default 10 — matches the SessionStart inject cap. */
  limit?: number;
}

const SELECT_COLS =
  "id, task_id, text, scope, status, assigned_to, assigned_by, kpis, version, created_at, agent, plugin_version";

/**
 * Return the latest version row for every distinct `task_id` matching
 * the requested scope and status filter, capped at `limit`. Dedup by
 * latest-version happens in JS (same rationale as src/rules/read.ts —
 * portable across whatever subset of Postgres window functions Deeplake
 * actually exposes; the (task_id, version) lookup index keeps the
 * underlying SELECT cheap).
 */
export async function listTasks(
  query: QueryFn,
  tableName: string,
  opts: ListTasksOpts = {},
): Promise<TaskRow[]> {
  const safe = sqlIdent(tableName);
  // Tertiary `id DESC` covers same-millisecond v=N+1 races so this and
  // getTaskLatest() pick the same winner. CodeRabbit on PR #193.
  const rows = await query(
    `SELECT ${SELECT_COLS} FROM "${safe}" ` +
      `ORDER BY version DESC, created_at DESC, id DESC`,
  );

  const latest = new Map<string, TaskRow>();
  for (const r of rows) {
    const row = normalize(r);
    if (!row) continue;
    if (!latest.has(row.task_id)) latest.set(row.task_id, row);
  }

  const scope = opts.scope ?? "all";
  const status = opts.status ?? "active";
  const current = opts.current_user;

  const filtered = [...latest.values()].filter(row => {
    if (status !== "all" && row.status !== status) return false;
    if (scope === "mine") {
      // current_user must be set when filtering "mine" — if the caller
      // forgot, return nothing rather than secretly broadening to all
      // (silent over-disclosure is worse than an empty list).
      if (!current) return false;
      return row.assigned_to === current;
    }
    if (scope === "me") {
      // Strict personal: row scope must be 'me' AND assigned to current
      // user. Used by the SessionStart renderer's mine bucket so newer
      // team-scope tasks assigned to current_user can never push older
      // personal tasks out of the cap window. Same "no broadening on
      // missing user" rule as 'mine'.
      if (!current) return false;
      return row.scope === "me" && row.assigned_to === current;
    }
    if (scope === "team") return row.scope === "team";
    return true;
  });

  filtered.sort(
    (a, b) => b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id),
  );
  return filtered.slice(0, opts.limit ?? 10);
}

/** Return the latest version row for a single task_id, or null if absent. */
export async function getTaskLatest(
  query: QueryFn,
  tableName: string,
  taskId: string,
): Promise<TaskRow | null> {
  const safe = sqlIdent(tableName);
  // Compound ORDER BY: deterministic tie-break under the concurrent
  // v=N+1 race documented in src/rules/read.ts. Tertiary `id DESC`
  // covers the same-millisecond residual case.
  const rows = await query(
    `SELECT ${SELECT_COLS} FROM "${safe}" ` +
      `WHERE task_id = '${sqlStr(taskId)}' ` +
      `ORDER BY version DESC, created_at DESC, id DESC LIMIT 1`,
  );
  if (rows.length === 0) return null;
  return normalize(rows[0]);
}

/**
 * Coerce a row from the Deeplake API client into a typed TaskRow.
 * Drops malformed rows (NaN version) by returning null — the read path
 * filters them out rather than throwing. KPIs route through parseKpis
 * so a corrupt JSONB cell becomes `[]` instead of crashing the caller.
 */
function normalize(row: Record<string, unknown>): TaskRow | null {
  const vRaw = row.version;
  const version =
    typeof vRaw === "number" ? vRaw : typeof vRaw === "string" ? Number(vRaw) : NaN;
  if (!Number.isFinite(version)) return null;
  return {
    id: String(row.id ?? ""),
    task_id: String(row.task_id ?? ""),
    text: String(row.text ?? ""),
    scope: String(row.scope ?? ""),
    status: String(row.status ?? ""),
    assigned_to: String(row.assigned_to ?? ""),
    assigned_by: String(row.assigned_by ?? ""),
    kpis: parseKpis(row.kpis),
    version,
    created_at: String(row.created_at ?? ""),
    agent: String(row.agent ?? ""),
    plugin_version: String(row.plugin_version ?? ""),
  };
}
