/**
 * Shared SessionStart context renderer.
 *
 * Produces the "HIVEMIND RULES" + "HIVEMIND TASKS" + "HOW-TO" block
 * that every agent's SessionStart hook (claude-code, codex, cursor,
 * hermes) appends to its own DEEPLAKE MEMORY context. One source of
 * truth lives here so a wording fix lands in one place; the per-agent
 * forks just import and concatenate.
 *
 * Why a renderer (vs. per-agent inline string):
 *
 *   - The block content is dynamic — it reads from three tables
 *     (hivemind_rules, hivemind_tasks, hivemind_task_events) on every
 *     SessionStart. Inlining the SQL into each fork would copy-paste
 *     >100 lines and drift over time.
 *   - Per-agent forks differ only in how they wrap the surrounding
 *     context (stdin shape, output envelope, agent-specific log lines).
 *     The KPI rendering is invariant.
 *   - Future T7 (`hivemind context` CLI for pi/openclaw) calls the
 *     same renderer to print the block on demand — same output as
 *     SessionStart, deterministically.
 *
 * Failure mode: any caught error → return empty string. SessionStart
 * MUST NOT fail because of a bad rules/tasks read; the agent has to
 * start regardless. Missing-table errors are silently absorbed (the
 * tables get created lazily by the CLI write path).
 *
 * Filtering rule (per the plan, A3b): all active org rules + all
 * active team tasks + active me-tasks where assigned_to = current
 * user. Tasks where someone else is assigned but scope=team still
 * appear (so the agent knows what the team is working on); the
 * assignee gets a "★YOU" highlight when it's the current user.
 */

import { listRules, type RuleRow } from "../../rules/index.js";
import { listTasks, type TaskRow, type Kpi } from "../../tasks/index.js";
import { computeAllForTasks } from "../../events/index.js";

export type QueryFn = (sql: string) => Promise<Array<Record<string, unknown>>>;

export interface RenderInput {
  rulesTable: string;
  tasksTable: string;
  taskEventsTable: string;
  /** cfg.userName — used for "★YOU" highlighting and me-task filter. */
  currentUser: string;
}

export interface RenderOptions {
  /** Max rules shown in the block. Default 10. Cap matches A4 in the plan. */
  maxRules?: number;
  /** Max tasks shown in the block. Default 10. */
  maxTasks?: number;
  /** Optional logger for debugging — receives line-by-line trace events. */
  log?: (msg: string) => void;
}

/**
 * Build the SessionStart context block. Returns the rendered text on
 * success or "" when there is nothing to display (zero rules + zero
 * tasks) OR when an underlying query fails (graceful degradation:
 * a broken renderer must never block session startup).
 */
export async function renderContextBlock(
  query: QueryFn,
  input: RenderInput,
  opts: RenderOptions = {},
): Promise<string> {
  const maxRules = opts.maxRules ?? 10;
  const maxTasks = opts.maxTasks ?? 10;
  const log = opts.log ?? (() => { /* nothing */ });

  try {
    // Per-section sub-tries so a missing/inaccessible rules table
    // doesn't drop the tasks block (and vice versa). Codex review
    // pass 3 surfaced this: in workspaces that have used `hivemind
    // tasks` but not `hivemind rules`, the rules table doesn't
    // exist yet, and the prior single outer try-catch would return
    // "" before listTasks even ran. Each fetch now degrades to []
    // on failure — log + continue with what we have.

    // Over-fetch rules so the "X more" truncation hint can give a
    // useful count (not just "more"). 4× the display cap is a
    // reasonable balance — surfaces "this team has lots of rules"
    // without unbounded reads on a giant org. The reported count is
    // approximate beyond the over-fetch window; documented as a v1
    // limitation.
    let rules: import("../../rules/index.js").RuleRow[] = [];
    try {
      rules = await listRules(query, input.rulesTable, {
        status: "active",
        limit: Math.max(maxRules * 4, maxRules + 1),
      });
    } catch (rulesErr: unknown) {
      const rmsg = rulesErr instanceof Error ? rulesErr.message : String(rulesErr);
      log(`render-context-block: rules unavailable (continuing): ${rmsg}`);
    }

    // Two SEPARATE listTasks queries — one for team-scope (any
    // assignee) and one for me-scope (current user only) — then
    // merge + dedup. The earlier "scope=all then filter in JS"
    // approach silently dropped a user's visible tasks when there
    // were enough newer private tasks assigned to OTHER users to
    // push the visible one out of the cap window. Codex review on
    // T6 surfaced this.
    //
    // The cost is one extra SELECT round-trip per SessionStart; the
    // correctness gain (no silently-missing tasks) is worth it.
    // The pair shares one sub-try because both queries hit the same
    // table — if it's missing, both fail; if it exists, both succeed.
    let teamTasks: import("../../tasks/index.js").TaskRow[] = [];
    let myTasks: import("../../tasks/index.js").TaskRow[] = [];
    try {
      teamTasks = await listTasks(query, input.tasksTable, {
        scope: "team",
        status: "active",
        limit: Math.max(maxTasks * 4, maxTasks + 1),
      });
      myTasks = await listTasks(query, input.tasksTable, {
        scope: "mine",
        status: "active",
        current_user: input.currentUser,
        limit: Math.max(maxTasks * 4, maxTasks + 1),
      });
    } catch (tasksErr: unknown) {
      const tmsg = tasksErr instanceof Error ? tasksErr.message : String(tasksErr);
      log(`render-context-block: tasks unavailable (continuing): ${tmsg}`);
      // teamTasks / myTasks stay [] — block still renders any rules.
    }
    const visibleTasks = mergeAndDedupTasks(teamTasks, myTasks);

    const rulesShown = rules.slice(0, maxRules);
    const rulesHidden = Math.max(0, rules.length - maxRules);
    const tasksShown = visibleTasks.slice(0, maxTasks);
    const tasksHidden = Math.max(0, visibleTasks.length - maxTasks);

    // KPI totals: one round-trip for all displayed tasks (avoids the
    // N+1 per-task computeAllForTask loop). The aggregate query is
    // wrapped in its OWN try so a missing hivemind_task_events table
    // (common on a fresh org — events table is lazy-created by
    // `tasks progress` / capture's auto-extract, neither of which
    // may have run yet) doesn't drop the WHOLE rules+tasks block.
    // On aggregate failure we proceed with empty totals; KPIs render
    // as 0/target which is the truthful state when no events exist.
    const taskIds = tasksShown.map(t => t.task_id);
    let totals: Record<string, Record<string, number>> = {};
    try {
      totals = await computeAllForTasks(query, input.taskEventsTable, taskIds);
    } catch (aggErr: unknown) {
      const aggMsg = aggErr instanceof Error ? aggErr.message : String(aggErr);
      log(`render-context-block: aggregate failed (continuing with 0/target): ${aggMsg}`);
      // totals stays {} — every KPI renders as 0/target.
    }

    return formatBlock({
      rules: rulesShown,
      rulesHidden,
      tasks: tasksShown,
      tasksHidden,
      totals,
      currentUser: input.currentUser,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    log(`render-context-block: ${msg}`);
    // Missing-table is the most common "nothing to render" scenario
    // on a fresh org (rules / tasks tables never created yet). Any
    // other failure also returns "" so SessionStart keeps working.
    return "";
  }
}

/**
 * Merge team-scope and me-scope task results into a single deduped
 * list sorted newest-first by created_at. The two listTasks calls
 * may return the same task_id (a team task assigned to current user
 * shows up in both); the first occurrence wins.
 */
function mergeAndDedupTasks(
  teamTasks: import("../../tasks/index.js").TaskRow[],
  myTasks: import("../../tasks/index.js").TaskRow[],
): import("../../tasks/index.js").TaskRow[] {
  const seen = new Set<string>();
  const merged: import("../../tasks/index.js").TaskRow[] = [];
  for (const t of [...teamTasks, ...myTasks]) {
    if (seen.has(t.task_id)) continue;
    seen.add(t.task_id);
    merged.push(t);
  }
  merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return merged;
}

interface FormatInput {
  rules: RuleRow[];
  rulesHidden: number;
  tasks: TaskRow[];
  tasksHidden: number;
  totals: Record<string, Record<string, number>>;
  currentUser: string;
}

function formatBlock(input: FormatInput): string {
  if (input.rules.length === 0 && input.tasks.length === 0) {
    return "";
  }

  const lines: string[] = [];

  if (input.rules.length > 0) {
    lines.push(`=== HIVEMIND RULES (${input.rules.length} active) ===`);
    for (const r of input.rules) {
      lines.push(`- ${r.rule_id}: ${r.text}`);
    }
    if (input.rulesHidden > 0) {
      lines.push(`(${input.rulesHidden} more — run 'hivemind rules list' to see all)`);
    }
    lines.push("");
  }

  if (input.tasks.length > 0) {
    lines.push(`=== HIVEMIND TASKS (${input.tasks.length} active) ===`);
    for (const t of input.tasks) {
      lines.push(formatTaskLine(t, input.totals[t.task_id] ?? {}, input.currentUser));
    }
    if (input.tasksHidden > 0) {
      lines.push(`(${input.tasksHidden} more — run 'hivemind tasks list' to see all)`);
    }
    lines.push("");
  }

  lines.push("=== HIVEMIND HOW-TO ===");
  lines.push("- Rules above are team principles. Treat any action that would violate one as a critical error and surface it to the user before proceeding.");
  lines.push("- Tasks above are your current work. Use 'hivemind tasks progress <task-id> <kpi-id> --value N' to record progress on a KPI.");
  lines.push("- Run 'hivemind rules list' / 'hivemind tasks list' for the full inventories beyond what's shown here.");

  return lines.join("\n");
}

function formatTaskLine(
  task: TaskRow,
  kpiTotals: Record<string, number>,
  currentUser: string,
): string {
  const tag = task.scope === "team" ? "[team]" : "[me]";
  // "★YOU" highlight when a team-scope task is assigned to the
  // current user — this is the cue Davit asked for (team-wide
  // visibility + personal salience).
  const highlight = task.scope === "team" && task.assigned_to === currentUser
    ? " ★YOU"
    : "";
  const kpiSummary = formatKpiSummary(task.kpis, kpiTotals);
  return `${tag} ${task.task_id}: ${task.text}${highlight}${kpiSummary}`;
}

function formatKpiSummary(
  kpis: Kpi[],
  totals: Record<string, number>,
): string {
  if (kpis.length === 0) return "";
  const parts = kpis.map(k => {
    const current = totals[k.kpi_id] ?? 0;
    return `${k.name}: ${current}/${k.target} ${k.unit}`;
  });
  return ` | ${parts.join(", ")}`;
}
