import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, homedir } from "node:os";
import {
  buildPullSql,
  resolvePullDestination,
  selectLatestPerName,
  renderSkillFile,
  readLocalVersion,
  decideAction,
  runPull,
  type QueryFn,
} from "../../src/skilify/pull.js";

let projectRoot: string;
let projectSkillsRoot: string;

beforeEach(() => {
  projectRoot = mkdtempSync(join(tmpdir(), "skilify-pull-"));
  projectSkillsRoot = join(projectRoot, ".claude", "skills");
});

afterEach(() => {
  try { rmSync(projectRoot, { recursive: true, force: true }); } catch { /* nothing */ }
});

// ── buildPullSql ────────────────────────────────────────────────────────────

describe("buildPullSql", () => {
  it("emits no WHERE clause when no users / name filter", () => {
    const sql = buildPullSql({ tableName: "skills", users: [] });
    expect(sql).toMatch(/^SELECT /);
    expect(sql).not.toMatch(/WHERE/);
    expect(sql).toContain(`FROM "skills"`);
    expect(sql).toContain("ORDER BY name ASC, version DESC");
  });

  it("filters by single user", () => {
    const sql = buildPullSql({ tableName: "skills", users: ["alice"] });
    expect(sql).toContain(`WHERE author IN ('alice')`);
  });

  it("filters by multiple users", () => {
    const sql = buildPullSql({ tableName: "skills", users: ["alice", "bob", "carol"] });
    expect(sql).toContain(`WHERE author IN ('alice', 'bob', 'carol')`);
  });

  it("filters by skill name positional", () => {
    const sql = buildPullSql({ tableName: "skills", users: [], skillName: "my-skill" });
    expect(sql).toContain(`WHERE name = 'my-skill'`);
  });

  it("AND-combines user and name filters", () => {
    const sql = buildPullSql({ tableName: "skills", users: ["alice"], skillName: "x" });
    expect(sql).toContain(`WHERE author IN ('alice') AND name = 'x'`);
  });

  it("escapes single quotes in user names and skill names", () => {
    const sql = buildPullSql({ tableName: "skills", users: ["o'malley"], skillName: "it's-tricky" });
    expect(sql).toContain(`'o''malley'`);
    expect(sql).toContain(`'it''s-tricky'`);
  });

  it("uses the provided table name (env override case)", () => {
    const sql = buildPullSql({ tableName: "skills_test", users: [] });
    expect(sql).toContain(`FROM "skills_test"`);
  });
});

// ── resolvePullDestination ─────────────────────────────────────────────────

describe("resolvePullDestination", () => {
  it("returns ~/.claude/skills for global", () => {
    expect(resolvePullDestination("global")).toBe(join(homedir(), ".claude", "skills"));
  });

  it("returns <cwd>/.claude/skills for project with cwd", () => {
    expect(resolvePullDestination("project", "/tmp/foo")).toBe("/tmp/foo/.claude/skills");
  });

  it("throws for project without cwd", () => {
    expect(() => resolvePullDestination("project")).toThrow(/requires a cwd/);
  });
});

// ── selectLatestPerName ─────────────────────────────────────────────────────

describe("selectLatestPerName", () => {
  it("keeps the first row per name (rows ordered by version DESC already)", () => {
    const rows = [
      { name: "a", version: 3 },
      { name: "a", version: 2 },
      { name: "a", version: 1 },
      { name: "b", version: 5 },
      { name: "b", version: 4 },
    ];
    const out = selectLatestPerName(rows);
    expect(out).toHaveLength(2);
    expect(out[0]).toEqual({ name: "a", version: 3 });
    expect(out[1]).toEqual({ name: "b", version: 5 });
  });

  it("skips rows with empty / missing name", () => {
    const out = selectLatestPerName([{ name: "", version: 1 }, { version: 1 }, { name: "x", version: 1 }]);
    expect(out).toEqual([{ name: "x", version: 1 }]);
  });

  it("returns [] for empty input", () => {
    expect(selectLatestPerName([])).toEqual([]);
  });
});

// ── decideAction ────────────────────────────────────────────────────────────

describe("decideAction", () => {
  it("writes when local missing", () => {
    expect(decideAction({ remoteVersion: 1, localVersion: null, force: false, dryRun: false })).toBe("wrote");
  });

  it("writes when remote newer", () => {
    expect(decideAction({ remoteVersion: 3, localVersion: 2, force: false, dryRun: false })).toBe("wrote");
  });

  it("skips when local equal", () => {
    expect(decideAction({ remoteVersion: 2, localVersion: 2, force: false, dryRun: false })).toBe("skipped");
  });

  it("skips when local newer", () => {
    expect(decideAction({ remoteVersion: 1, localVersion: 5, force: false, dryRun: false })).toBe("skipped");
  });

  it("force overrides skip", () => {
    expect(decideAction({ remoteVersion: 1, localVersion: 5, force: true, dryRun: false })).toBe("wrote");
  });

  it("dry-run reports as 'dryrun' when would have written", () => {
    expect(decideAction({ remoteVersion: 1, localVersion: null, force: false, dryRun: true })).toBe("dryrun");
  });

  it("dry-run still reports skipped when local is newer", () => {
    expect(decideAction({ remoteVersion: 1, localVersion: 5, force: false, dryRun: true })).toBe("skipped");
  });
});

// ── renderSkillFile ─────────────────────────────────────────────────────────

describe("renderSkillFile", () => {
  it("renders frontmatter + body that round-trips through parseFrontmatter", () => {
    const text = renderSkillFile({
      name: "my-skill",
      description: "Does X",
      trigger_text: "When X",
      source_sessions: '["s1","s2"]',
      version: 2,
      source_agent: "claude_code",
      created_at: "2026-05-06T00:00:00.000Z",
      updated_at: "2026-05-06T01:00:00.000Z",
      body: "## Workflow\n\nDo it.",
    });
    expect(text).toContain("name: my-skill");
    expect(text).toContain(`description: "Does X"`);
    expect(text).toContain(`trigger: "When X"`);
    expect(text).toContain("version: 2");
    expect(text).toContain("created_by_agent: claude_code");
    expect(text).toContain("- s1");
    expect(text).toContain("- s2");
    expect(text).toContain("## Workflow");
  });

  it("handles array source_sessions field (already parsed)", () => {
    const text = renderSkillFile({
      name: "x", description: "", source_sessions: ["a", "b"], version: 1,
      source_agent: "x", created_at: "t", updated_at: "t", body: "b",
    });
    expect(text).toContain("- a");
    expect(text).toContain("- b");
  });

  it("falls back to empty source_sessions when field is malformed JSON", () => {
    const text = renderSkillFile({
      name: "x", description: "", source_sessions: "not json", version: 1,
      source_agent: "x", created_at: "t", updated_at: "t", body: "b",
    });
    // Frontmatter should still render — just with empty list
    expect(text).toContain("source_sessions:\n");
    expect(text).not.toContain("- not json");
  });

  it("omits trigger field when trigger_text is empty", () => {
    const text = renderSkillFile({
      name: "x", description: "", trigger_text: "", source_sessions: [], version: 1,
      source_agent: "x", created_at: "t", updated_at: "t", body: "b",
    });
    expect(text).not.toMatch(/^trigger:/m);
  });
});

// ── readLocalVersion ────────────────────────────────────────────────────────

describe("readLocalVersion", () => {
  it("returns null when file missing", () => {
    expect(readLocalVersion(join(projectRoot, "nope/SKILL.md"))).toBeNull();
  });

  it("reads version from valid frontmatter", () => {
    const dir = join(projectSkillsRoot, "x");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"),
      `---\nname: x\ndescription: "d"\nsource_sessions:\nversion: 7\ncreated_by_agent: cc\ncreated_at: 2026\nupdated_at: 2026\n---\n\nbody`);
    expect(readLocalVersion(join(dir, "SKILL.md"))).toBe(7);
  });

  it("returns null when no frontmatter", () => {
    const dir = join(projectSkillsRoot, "y");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), "no frontmatter here");
    expect(readLocalVersion(join(dir, "SKILL.md"))).toBeNull();
  });
});

// ── runPull (integration with mocked query) ────────────────────────────────

function makeMockQuery(rows: Record<string, unknown>[]): { fn: QueryFn; calls: string[] } {
  const calls: string[] = [];
  const fn: QueryFn = async (sql: string) => { calls.push(sql); return rows; };
  return { fn, calls };
}

describe("runPull", () => {
  const sampleRow = (over: Partial<Record<string, unknown>> = {}) => ({
    name: "vox-cli",
    project: "p",
    project_key: "pk",
    body: "## Workflow\n\nUse vox.",
    version: 2,
    source_agent: "claude_code",
    scope: "me",
    author: "alice",
    description: "Run vox",
    trigger_text: "Using vox",
    source_sessions: '["s1","s2"]',
    install: "global",
    created_at: "2026-05-06T00:00:00.000Z",
    updated_at: "2026-05-06T01:00:00.000Z",
    ...over,
  });

  it("writes a new SKILL.md to project root when local missing", async () => {
    const { fn } = makeMockQuery([sampleRow()]);
    const summary = await runPull({
      query: fn, tableName: "skills", install: "project", cwd: projectRoot,
      users: [], dryRun: false, force: false,
    });
    expect(summary.wrote).toBe(1);
    expect(summary.skipped).toBe(0);
    const path = join(projectSkillsRoot, "vox-cli", "SKILL.md");
    expect(existsSync(path)).toBe(true);
    const text = readFileSync(path, "utf-8");
    expect(text).toContain("version: 2");
    expect(text).toContain("Use vox");
  });

  it("skips when local version >= remote", async () => {
    // Pre-create a local v3
    const dir = join(projectSkillsRoot, "vox-cli");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"),
      `---\nname: vox-cli\ndescription: "old"\nsource_sessions:\nversion: 3\ncreated_by_agent: cc\ncreated_at: t\nupdated_at: t\n---\n\nlocal body`);
    const { fn } = makeMockQuery([sampleRow({ version: 2 })]);
    const summary = await runPull({
      query: fn, tableName: "skills", install: "project", cwd: projectRoot,
      users: [], dryRun: false, force: false,
    });
    expect(summary.wrote).toBe(0);
    expect(summary.skipped).toBe(1);
    expect(readFileSync(join(dir, "SKILL.md"), "utf-8")).toContain("local body");
  });

  it("--force overrides skip and backs up the existing file", async () => {
    const dir = join(projectSkillsRoot, "vox-cli");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"),
      `---\nname: vox-cli\ndescription: "old"\nsource_sessions:\nversion: 5\ncreated_by_agent: cc\ncreated_at: t\nupdated_at: t\n---\n\nlocal v5 body`);
    const { fn } = makeMockQuery([sampleRow({ version: 2 })]);
    const summary = await runPull({
      query: fn, tableName: "skills", install: "project", cwd: projectRoot,
      users: [], dryRun: false, force: true,
    });
    expect(summary.wrote).toBe(1);
    expect(existsSync(join(dir, "SKILL.md.bak"))).toBe(true);
    expect(readFileSync(join(dir, "SKILL.md.bak"), "utf-8")).toContain("local v5 body");
    expect(readFileSync(join(dir, "SKILL.md"), "utf-8")).toContain("Use vox");
  });

  it("--dry-run touches no files, reports counts", async () => {
    const { fn } = makeMockQuery([sampleRow()]);
    const summary = await runPull({
      query: fn, tableName: "skills", install: "project", cwd: projectRoot,
      users: [], dryRun: true, force: false,
    });
    expect(summary.dryrun).toBe(1);
    expect(summary.wrote).toBe(0);
    expect(existsSync(join(projectSkillsRoot, "vox-cli"))).toBe(false);
  });

  it("dedups rows by name keeping latest version", async () => {
    const rows = [
      sampleRow({ name: "a", version: 3 }),
      sampleRow({ name: "a", version: 2 }),
      sampleRow({ name: "b", version: 1 }),
    ];
    const { fn } = makeMockQuery(rows);
    const summary = await runPull({
      query: fn, tableName: "skills", install: "project", cwd: projectRoot,
      users: [], dryRun: false, force: false,
    });
    expect(summary.scanned).toBe(2);
    expect(summary.wrote).toBe(2);
    const aText = readFileSync(join(projectSkillsRoot, "a", "SKILL.md"), "utf-8");
    expect(aText).toContain("version: 3");
  });

  it("emits the right SQL when filtered by users + name", async () => {
    const { fn, calls } = makeMockQuery([]);
    await runPull({
      query: fn, tableName: "skills_test", install: "global",
      users: ["alice", "bob"], skillName: "vox-cli",
      dryRun: true, force: false,
    });
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain(`FROM "skills_test"`);
    expect(calls[0]).toContain(`author IN ('alice', 'bob')`);
    expect(calls[0]).toContain(`name = 'vox-cli'`);
  });
});
