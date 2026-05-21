import { describe, expect, it, vi } from "vitest";
import { renderContextBlock } from "../../src/hooks/shared/context-renderer.js";

/**
 * Tests for the shared SessionStart context renderer.
 *
 * The renderer composes listRules + listTasks + computeAllForTasks
 * behind a single QueryFn. We mock the QueryFn at the network
 * boundary (same pattern as the other module tests). Each test
 * scripts the SELECTs in their expected order:
 *
 *   1. listRules    → SELECT id, rule_id, ... FROM "hivemind_rules" ORDER BY ...
 *   2. listTasks    → SELECT id, task_id, ... FROM "hivemind_tasks" ORDER BY ...
 *   3. computeAllForTasks → SELECT task_id, kpi_id, SUM(value) ... (skipped if no tasks)
 */
function mockQuery(script: Array<(sql: string) => unknown>) {
  const calls: string[] = [];
  let step = 0;
  const query = vi.fn(async (sql: string) => {
    calls.push(sql);
    if (step < script.length) {
      const out = script[step++](sql);
      return Array.isArray(out) ? (out as Array<Record<string, unknown>>) : [];
    }
    return [];
  });
  return { calls, query };
}

const TABLES = {
  rulesTable: "hivemind_rules",
  tasksTable: "hivemind_tasks",
  taskEventsTable: "hivemind_task_events",
};

function fakeRule(overrides: Record<string, unknown> = {}) {
  return {
    id: "row-r", rule_id: "rule-1", text: "no DROP TABLE",
    scope: "team", status: "active", assigned_by: "alice@activeloop.ai",
    version: 1, created_at: "2026-05-20T10:00:00Z",
    agent: "manual", plugin_version: "0.7.99",
    ...overrides,
  };
}

const SAMPLE_KPI = {
  kpi_id: "k_pr",
  name: "PRs merged",
  target: 5,
  unit: "count",
  generated_by: "manual",
  generated_at: "2026-05-20T10:00:00Z",
};

function fakeTask(overrides: Record<string, unknown> = {}) {
  return {
    id: "row-t", task_id: "task-1", text: "ship feature X",
    scope: "team", status: "active",
    assigned_to: "alice@activeloop.ai", assigned_by: "alice@activeloop.ai",
    kpis: JSON.stringify([SAMPLE_KPI]),
    version: 1, created_at: "2026-05-20T10:00:00Z",
    agent: "manual", plugin_version: "0.7.99",
    ...overrides,
  };
}

// ── empty / graceful-degradation paths ─────────────────────────────────────

describe("renderContextBlock — empty + degradation", () => {
  it("returns '' when no rules and no tasks exist (nothing to inject)", async () => {
    const { calls, query } = mockQuery([
      () => [],   // listRules
      () => [],   // listTasks (team)
      () => [],   // listTasks (mine)
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toBe("");
    // 3 queries total: rules + team-tasks + mine-tasks. No computeAllForTasks
    // because tasksShown.length === 0 (taskIds=[], early-return in batch helper).
    expect(calls).toHaveLength(3);
  });

  it("missing-table on computeAllForTasks does NOT drop the rules+tasks block (codex P2 pass 1)", async () => {
    // Fresh org: rules + tasks tables exist (CLIs ran), task_events
    // does NOT yet (no `tasks progress` / auto-extract has fired).
    // The aggregate SELECT throws — before the fix, this dropped the
    // whole block. Now the renderer catches at sub-try, sets totals
    // to {}, and the block still renders with 0/target on the KPI.
    const { query } = mockQuery([
      () => [fakeRule()],                  // listRules
      () => [fakeTask()],                  // listTasks team
      () => [],                            // listTasks mine
      () => { throw new Error(`relation "hivemind_task_events" does not exist`); },
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("HIVEMIND RULES");
    expect(out).toContain("HIVEMIND TASKS");
    expect(out).toContain("PRs merged: 0/5 count");
  });

  it("missing rules table does NOT drop the tasks section (codex P2 pass 3)", async () => {
    // Workspace has only used `hivemind tasks` so far — the rules
    // table was never created. Prior to the pass-3 fix, the rules
    // SELECT threw inside the outer try and the WHOLE block was
    // dropped before listTasks even ran. Now rules failures are
    // localized to the rules section; tasks still inject.
    const { query } = mockQuery([
      () => { throw new Error(`relation "hivemind_rules" does not exist`); },
      () => [fakeTask()],          // listTasks team
      () => [],                    // listTasks mine
      () => [],                    // computeAllForTasks (no events)
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).not.toContain("HIVEMIND RULES");
    expect(out).toContain("HIVEMIND TASKS");
    expect(out).toContain("task-1");
  });

  it("missing tasks table does NOT drop the rules section (codex P2 pass 3, symmetric)", async () => {
    // Symmetric of the above: rules table is present, tasks table
    // missing. The rules section should still render.
    const { query } = mockQuery([
      () => [fakeRule({ text: "no DROP TABLE on prod" })], // listRules ok
      () => { throw new Error(`relation "hivemind_tasks" does not exist`); }, // team query throws
      // mine query is not reached because the team query already failed
      // inside the shared tasks sub-try; both teamTasks and myTasks stay [].
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("HIVEMIND RULES");
    expect(out).toContain("no DROP TABLE on prod");
    expect(out).not.toContain("HIVEMIND TASKS");
  });

  it("swallows missing-table errors and returns '' (SessionStart MUST NOT fail)", async () => {
    const { query } = mockQuery([
      () => { throw new Error(`relation "hivemind_rules" does not exist`); },
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toBe("");
  });

  it("swallows any error (network, parse, etc.) and returns ''", async () => {
    const { query } = mockQuery([
      () => { throw new Error("network timeout"); },
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toBe("");
  });

  it("invokes the optional log callback on error", async () => {
    const log = vi.fn();
    const { query } = mockQuery([
      () => { throw new Error("network timeout"); },
    ]);
    await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" }, { log });
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0][0]).toContain("network timeout");
  });
});

// ── rules section ──────────────────────────────────────────────────────────

describe("renderContextBlock — rules section", () => {
  it("renders rules section with full rule_id and text (no truncation regression)", async () => {
    const { query } = mockQuery([
      () => [fakeRule({ rule_id: "rule-aaaa-bbbb-cccc", text: "never DROP TABLE on prod" })],
      () => [],   // listTasks team
      () => [],   // listTasks mine
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("=== HIVEMIND RULES (1 active) ===");
    expect(out).toContain("- rule-aaaa-bbbb-cccc: never DROP TABLE on prod");
  });

  it("caps to maxRules and shows 'X more' truncation hint", async () => {
    const rules = Array.from({ length: 15 }, (_, i) =>
      fakeRule({ rule_id: `rule-${i}`, text: `rule ${i}`, created_at: `2026-05-20T10:${String(i).padStart(2, "0")}:00Z` }),
    );
    const { query } = mockQuery([
      () => rules,
      () => [],   // team
      () => [],   // mine
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("(5 more — run 'hivemind rules list' to see all)");
    // Header shows the COUNT SHOWN, not the total — keeps the header
    // honest about what's in the block right now.
    expect(out).toContain("=== HIVEMIND RULES (10 active) ===");
  });

  it("respects the maxRules option override", async () => {
    const rules = [fakeRule({ rule_id: "r1" }), fakeRule({ rule_id: "r2" }), fakeRule({ rule_id: "r3" })];
    const { query } = mockQuery([
      () => rules,
      () => [],   // team
      () => [],   // mine
    ]);
    const out = await renderContextBlock(
      query,
      { ...TABLES, currentUser: "alice@activeloop.ai" },
      { maxRules: 2 },
    );
    expect(out).toContain("=== HIVEMIND RULES (2 active) ===");
    expect(out).toContain("(1 more");
  });

  it("does NOT emit the rules section when zero active rules exist (tasks still render)", async () => {
    const { query } = mockQuery([
      () => [],                                                // listRules
      () => [fakeTask()],                                      // listTasks team
      () => [],                                                // listTasks mine
      () => [{ task_id: "task-1", kpi_id: "k_pr", total: 2 }], // computeAllForTasks
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).not.toContain("HIVEMIND RULES");
    expect(out).toContain("HIVEMIND TASKS");
  });
});

// ── tasks section ──────────────────────────────────────────────────────────

describe("renderContextBlock — tasks section + visibility filter", () => {
  it("renders team tasks (any assignee) AND me-tasks (assigned to current user only)", async () => {
    // Two separate listTasks queries now (codex P2 pass 1 fix):
    //   - team query → all scope='team' tasks
    //   - mine query → scope='me' tasks WHERE assigned_to=current_user (filter at the DB layer)
    const { query } = mockQuery([
      () => [],
      // team query: every team-scope task, regardless of assignee
      () => [
        fakeTask({ task_id: "team-a", scope: "team", assigned_to: "alice@activeloop.ai" }),
        fakeTask({ task_id: "team-b", scope: "team", assigned_to: "bob@activeloop.ai" }),
      ],
      // mine query: only alice's me-scope task (listTasks scope='mine' already filters by current_user)
      () => [
        fakeTask({ task_id: "me-a", scope: "me", assigned_to: "alice@activeloop.ai" }),
      ],
      () => [], // no events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("team-a");
    expect(out).toContain("team-b"); // team task assigned to bob — alice still sees it (visibility)
    expect(out).toContain("me-a");
    // me-b (bob's personal task) was never returned by the mine query because
    // listTasks scope='mine' filters by assigned_to at the DB; nothing for
    // alice to filter out in JS.
    expect(out).not.toContain("me-b");
  });

  it("highlights team tasks assigned to the current user with ★YOU", async () => {
    const { query } = mockQuery([
      () => [],
      () => [
        fakeTask({ task_id: "yours",  scope: "team", assigned_to: "alice@activeloop.ai" }),
        fakeTask({ task_id: "theirs", scope: "team", assigned_to: "bob@activeloop.ai" }),
      ],
      () => [],   // mine
      () => [],   // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toMatch(/team\] yours:.*★YOU/);
    expect(out).not.toMatch(/team\] theirs:.*★YOU/);
  });

  it("renders KPI lines with computed current/target/unit", async () => {
    const { query } = mockQuery([
      () => [],
      () => [
        fakeTask({ task_id: "T1", kpis: JSON.stringify([SAMPLE_KPI, {
          kpi_id: "k_lines", name: "Lines reviewed", target: 200, unit: "lines",
          generated_by: "manual", generated_at: "2026-05-20T10:00:00Z",
        }]) }),
      ],
      () => [],   // mine
      () => [
        { task_id: "T1", kpi_id: "k_pr",    total: 3 },
        { task_id: "T1", kpi_id: "k_lines", total: 75 },
      ],
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("PRs merged: 3/5 count");
    expect(out).toContain("Lines reviewed: 75/200 lines");
  });

  it("KPI with no events shows 0/target (not '?/target' — events stream is authoritative)", async () => {
    const { query } = mockQuery([
      () => [],
      () => [fakeTask()],
      () => [],   // mine
      () => [],   // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("PRs merged: 0/5 count");
  });

  it("task with no KPIs emits no '|' separator on the line", async () => {
    // Use a different assigned_to so the ★YOU highlight doesn't
    // appear (would change the line ending and the line-anchored
    // regex below would need extra slack). The KPI-line presence/
    // absence test is what this case is actually pinning.
    const { query } = mockQuery([
      () => [],
      () => [fakeTask({ kpis: "[]", assigned_to: "bob@activeloop.ai" })],
      () => [],   // mine
      () => [],   // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    // No KPIs → no " | ..." suffix on the task line.
    expect(out).toMatch(/team\] task-1: ship feature X$/m);
  });

  it("caps tasks to maxTasks and shows 'X more' truncation hint", async () => {
    const visibleTasks = Array.from({ length: 13 }, (_, i) =>
      fakeTask({
        task_id: `t${i}`,
        scope: "team",
        kpis: "[]",
        created_at: `2026-05-20T10:${String(i).padStart(2, "0")}:00Z`,
      }),
    );
    const { query } = mockQuery([
      () => [],
      () => visibleTasks,
      () => [],   // mine
      () => [],   // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("=== HIVEMIND TASKS (10 active) ===");
    expect(out).toContain("(3 more — run 'hivemind tasks list' to see all)");
  });

  it("computeAllForTasks is called with the SHOWN task ids only (not the over-fetched set)", async () => {
    const visibleTasks = Array.from({ length: 12 }, (_, i) =>
      fakeTask({
        task_id: `t${i}`,
        scope: "team",
        created_at: `2026-05-20T10:${String(i).padStart(2, "0")}:00Z`,
      }),
    );
    const { calls, query } = mockQuery([
      () => [],
      () => visibleTasks,
      () => [],   // mine
      () => [],   // events
    ]);
    await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" }, { maxTasks: 5 });
    // 4th call is the events aggregate — it should target exactly the
    // 5 displayed task ids, not the 12 fetched.
    const eventsSql = calls[3];
    expect(eventsSql).toContain("task_id IN (");
    // 5 ids → 4 commas
    const inListMatch = eventsSql.match(/task_id IN \(([^)]+)\)/);
    expect(inListMatch?.[1].split(",")).toHaveLength(5);
  });

  it("merges team + mine results and dedups when the same task_id appears in both — codex P2 pass 1 regression guard", async () => {
    // The mine query is scoped to scope='me' tasks; the team query is
    // scoped to scope='team'. They cannot return the same row, but a
    // future widening of mine's behavior could. The dedup keeps the
    // contract stable: a task_id appears at most once in the rendered
    // block regardless of how many lists found it.
    const sharedTask = fakeTask({ task_id: "shared-id", scope: "team", assigned_to: "alice@activeloop.ai" });
    const { query } = mockQuery([
      () => [],
      () => [sharedTask],     // team result
      () => [sharedTask],     // mine result (hypothetical overlap)
      () => [],               // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    // "shared-id" should appear EXACTLY once
    const occurrences = (out.match(/shared-id/g) ?? []).length;
    expect(occurrences).toBe(1);
  });

  it("preserves visible tasks even when many private OTHER-user tasks would push them out of a global cap — codex P2 pass 1 regression guard", async () => {
    // Scenario codex described: 41 newer scope=me tasks for bob plus
    // one older scope=team task assigned to alice. Under the prior
    // "listTasks scope='all'" approach, the 41 newer rows would fill
    // the cap window before the filter ran and alice's team task
    // would silently disappear. With the new two-query approach,
    // bob's me-tasks are filtered at the DB (mine query scopes to
    // current_user), so alice's team task is always preserved.
    const aliceTeamTask = fakeTask({
      task_id: "alice-team", scope: "team", assigned_to: "alice@activeloop.ai",
      created_at: "2026-05-01T00:00:00Z",
    });
    const { query } = mockQuery([
      () => [],
      () => [aliceTeamTask],   // team query: alice's team task
      () => [],                // mine query: empty (alice has no me-tasks here)
      () => [],                // events
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("alice-team");
  });
});

// ── HOW-TO footer ──────────────────────────────────────────────────────────

describe("renderContextBlock — HOW-TO footer", () => {
  it("emits the HOW-TO block when there's anything to show", async () => {
    const { query } = mockQuery([
      () => [fakeRule()],
      () => [],   // team
      () => [],   // mine
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toContain("=== HIVEMIND HOW-TO ===");
    expect(out).toContain("'hivemind tasks progress");
    expect(out).toContain("'hivemind rules list'");
  });

  it("omits the HOW-TO block when there's nothing to show (no banner without content)", async () => {
    const { query } = mockQuery([
      () => [],
      () => [],   // team
      () => [],   // mine
    ]);
    const out = await renderContextBlock(query, { ...TABLES, currentUser: "alice@activeloop.ai" });
    expect(out).toBe("");
  });
});