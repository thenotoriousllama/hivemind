import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { pullSnapshot } from "../../../src/graph/deeplake-pull.js";
import type { Config } from "../../../src/config.js";
import type { DeeplakeApi } from "../../../src/deeplake-api.js";
import { writeLastBuild, readLastBuild } from "../../../src/graph/last-build.js";
import { repoDir } from "../../../src/graph/snapshot.js";
import { deriveProjectKey } from "../../../src/utils/repo-identity.js";

/** Mirror of workTreeIdFor in src/commands/graph.ts and elsewhere. */
function worktreeIdFromCwd(cwd: string): string {
  return createHash("sha256").update(cwd).digest("hex").slice(0, 16);
}

function makeConfig(): Config {
  return {
    token: "tok",
    orgId: "test-org",
    orgName: "test",
    userName: "alice",
    workspaceId: "default",
    apiUrl: "https://api.example",
    tableName: "memory",
    sessionsTableName: "sessions",
    skillsTableName: "skills",
    codebaseTableName: "codebase_test",
    memoryPath: "/tmp/mem",
  };
}

/**
 * A canonical-looking payload — the actual content is opaque to pullSnapshot
 * (it writes the bytes verbatim) so we just need *something* parseable that
 * looks like the writer's output.
 */
const CLOUD_PAYLOAD = JSON.stringify({
  directed: true,
  multigraph: true,
  graph: { schema_version: 1, generator: "hivemind-graph", commit_sha: "head1234abcd", repo_key: "k" },
  nodes: [{ id: "a.ts:foo:function", label: "foo", kind: "function", source_file: "a.ts" }],
  links: [],
});

/**
 * Mock DeeplakeApi: captures every SQL string and returns a configured row
 * (or empty / throws) for SELECT, no-op for everything else.
 */
function makeMockApi(plan: {
  selectReturns?: Record<string, unknown>[];
  selectThrows?: Error;
  ensureThrows?: Error;
}): { api: DeeplakeApi; calls: { ensure: string[]; queries: string[] } } {
  const calls = { ensure: [] as string[], queries: [] as string[] };
  const api = {
    ensureCodebaseTable: vi.fn(async (name: string) => {
      calls.ensure.push(name);
      if (plan.ensureThrows) throw plan.ensureThrows;
    }),
    query: vi.fn(async (sql: string) => {
      calls.queries.push(sql);
      if (sql.startsWith("SELECT")) {
        if (plan.selectThrows) throw plan.selectThrows;
        return plan.selectReturns ?? [];
      }
      return [];
    }),
  } as unknown as DeeplakeApi;
  return { api, calls };
}

describe("pullSnapshot — gating", () => {
  let tmpCwd: string;

  beforeEach(() => {
    tmpCwd = mkdtempSync(join(tmpdir(), "pull-gating-"));
  });
  afterEach(() => {
    try { rmSync(tmpCwd, { recursive: true, force: true }); } catch {}
  });

  it("HIVEMIND_GRAPH_PULL=0 → skipped-disabled (no auth call, no api call)", async () => {
    const prev = process.env.HIVEMIND_GRAPH_PULL;
    process.env.HIVEMIND_GRAPH_PULL = "0";
    try {
      const result = await pullSnapshot(tmpCwd, {
        loadConfig: () => { throw new Error("must not be called"); },
        makeApi: () => { throw new Error("must not be called"); },
        readHead: () => { throw new Error("must not be called"); },
      });
      expect(result.kind).toBe("skipped-disabled");
    } finally {
      if (prev === undefined) delete process.env.HIVEMIND_GRAPH_PULL;
      else process.env.HIVEMIND_GRAPH_PULL = prev;
    }
  });

  it("no auth → skipped-no-auth", async () => {
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: () => null,
      makeApi: () => { throw new Error("must not be called"); },
      readHead: () => { throw new Error("must not be called"); },
    });
    expect(result.kind).toBe("skipped-no-auth");
  });

  it("git rev-parse HEAD fails → skipped-no-head", async () => {
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => null, // simulates "not in a git repo"
      makeApi: () => { throw new Error("must not be called"); },
    });
    expect(result.kind).toBe("skipped-no-head");
  });
});

describe("pullSnapshot — SELECT shape (cross-worktree pull identity)", () => {
  let tmpCwd: string;
  beforeEach(() => { tmpCwd = mkdtempSync(join(tmpdir(), "pull-where-")); });
  afterEach(() => { try { rmSync(tmpCwd, { recursive: true, force: true }); } catch {} });

  it("SELECT has 5-key WHERE — NO worktree_id (codex P0: cross-worktree pull)", async () => {
    const { api, calls } = makeMockApi({ selectReturns: [] });
    await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    const select = calls.queries.find((q) => q.startsWith("SELECT"))!;
    expect(select).toContain("org_id = 'test-org'");
    expect(select).toContain("workspace_id = 'default'");
    expect(select).toContain("user_id = 'alice'");
    expect(select).toContain("commit_sha = 'head1234abcd'");
    expect(select).toContain("ORDER BY ts DESC LIMIT 1");
    // Critical: NO worktree_id in WHERE — otherwise pull can't find rows
    // written by other worktrees of the same project.
    expect(select).not.toMatch(/worktree_id\s*=/);
  });

  it("targets the configured table name (codebase_test in this fixture)", async () => {
    const { api, calls } = makeMockApi({ selectReturns: [] });
    await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(calls.queries[0]).toContain('"codebase_test"');
    expect(calls.ensure).toEqual(["codebase_test"]);
  });
});

describe("pullSnapshot — outcome resolution", () => {
  let tmpCwd: string;
  let baseDir: string;

  beforeEach(() => {
    tmpCwd = mkdtempSync(join(tmpdir(), "pull-outcome-"));
    const { key } = deriveProjectKey(tmpCwd);
    baseDir = repoDir(key);
    try { rmSync(baseDir, { recursive: true, force: true }); } catch {}
  });
  afterEach(() => {
    try { rmSync(tmpCwd, { recursive: true, force: true }); } catch {}
    try { rmSync(baseDir, { recursive: true, force: true }); } catch {}
  });

  it("no rows in cloud → no-cloud-row", async () => {
    const { api } = makeMockApi({ selectReturns: [] });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("no-cloud-row");
    if (result.kind === "no-cloud-row") expect(result.commitSha).toBe("head1234abcd");
  });

  it("local sha256 matches cloud sha256 → up-to-date (NO files written)", async () => {
    mkdirSync(baseDir, { recursive: true });
    writeLastBuild(baseDir, {
      ts: 1_000_000,
      commit_sha: "head1234abcd",
      snapshot_sha256: "a".repeat(64),
      node_count: 1,
      edge_count: 0,
    });
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "a".repeat(64),
        ts: "2026-05-21T00:00:00Z",
        node_count: 1, edge_count: 0,
        worktree_id: "remote-wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("up-to-date");
    // No snapshot file created (we didn't write anything)
    expect(existsSync(join(baseDir, "snapshots", "head1234abcd.json"))).toBe(false);
  });

  it("local ts > cloud ts → local-newer (NO overwrite)", async () => {
    mkdirSync(baseDir, { recursive: true });
    writeLastBuild(baseDir, {
      ts: 2_000_000_000_000,  // year 2033 in epoch ms
      commit_sha: "head1234abcd",
      snapshot_sha256: "different-local-sha",
      node_count: 1,
      edge_count: 0,
    });
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "different-cloud-sha",
        ts: "2026-01-01T00:00:00Z",  // older than local
        node_count: 1, edge_count: 0,
        worktree_id: "remote-wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("local-newer");
    if (result.kind === "local-newer") {
      expect(result.commitSha).toBe("head1234abcd");
      expect(result.localTs).toBe(2_000_000_000_000);
      expect(result.cloudTs).toBeLessThan(result.localTs);
    }
    // No file written
    expect(existsSync(join(baseDir, "snapshots", "head1234abcd.json"))).toBe(false);
  });

  it("local missing → pulls (creates snapshot file + sidecars + history entry)", async () => {
    const cloudSha = "f".repeat(64);
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: cloudSha,
        ts: 1_700_000_000_000,
        node_count: 1, edge_count: 0,
        branch: "main",
        generator_version: "0.0.0-test",
        worktree_id: "remote-wt-abcdef",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
    if (result.kind === "pulled") {
      expect(result.commitSha).toBe("head1234abcd");
      expect(result.snapshotSha256).toBe(cloudSha);
      expect(result.bytes).toBeGreaterThan(0);
      expect(result.cloudTs).toBe(1_700_000_000_000);
    }
    // Snapshot file IS the cloud payload, byte-identical
    const snapshotPath = join(baseDir, "snapshots", "head1234abcd.json");
    expect(existsSync(snapshotPath)).toBe(true);
    expect(readFileSync(snapshotPath, "utf8")).toBe(CLOUD_PAYLOAD);
    // latest-commit.txt updated (now per-worktree, under worktrees/<id>/)
    const wt = worktreeIdFromCwd(tmpCwd);
    expect(readFileSync(join(baseDir, "worktrees", wt, "latest-commit.txt"), "utf8").trim()).toBe("head1234abcd");
    // .last-build.json mirrors cloud metadata (per-worktree)
    const lb = readLastBuild(baseDir, wt);
    expect(lb).not.toBeNull();
    expect(lb!.commit_sha).toBe("head1234abcd");
    expect(lb!.snapshot_sha256).toBe(cloudSha);
    expect(lb!.ts).toBe(1_700_000_000_000);
    expect(lb!.node_count).toBe(1);
    expect(lb!.edge_count).toBe(0);
    // history.jsonl has a "pull" trigger entry
    const historyText = readFileSync(join(baseDir, "history.jsonl"), "utf8");
    const lastLine = historyText.trim().split("\n").pop()!;
    const parsed = JSON.parse(lastLine);
    expect(parsed.trigger).toBe("pull");
    expect(parsed.commit_sha).toBe("head1234abcd");
  });

  it("codex P1 regression: local sidecar points at a DIFFERENT commit → ignored, pull proceeds", async () => {
    // Scenario from codex review:
    //   1. User built commit B locally (ts=2_000_000_000_000)
    //   2. User checked out commit A (older)
    //   3. HEAD = A. snapshots/A.json doesn't exist locally.
    //   4. Cloud has commit A at ts=1_000_000_000_000 (older than local's
    //      record for B, but A is what we're asking about)
    // Buggy old behavior: local.ts > cloud.ts → "local-newer", refuse to
    // pull, leave A unavailable.
    // Fixed behavior: local.commit_sha (B) != head (A) → ignore the local
    // sidecar's ts entirely, fall through to pull.
    mkdirSync(baseDir, { recursive: true });
    writeLastBuild(baseDir, {
      ts: 2_000_000_000_000,
      commit_sha: "different-commit-B",
      snapshot_sha256: "sha-for-B",
      node_count: 1,
      edge_count: 0,
    });
    const cloudSha = "f".repeat(64);
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: cloudSha,
        ts: 1_000_000_000_000,
        node_count: 7, edge_count: 3,
        worktree_id: "remote-wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd", // HEAD = A, NOT B
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
    // After pull: snapshot file for A exists, last-build now points at A
    expect(existsSync(join(baseDir, "snapshots", "head1234abcd.json"))).toBe(true);
    const lb = readLastBuild(baseDir, worktreeIdFromCwd(tmpCwd));
    expect(lb!.commit_sha).toBe("head1234abcd");
    expect(lb!.snapshot_sha256).toBe(cloudSha);
  });

  it("local sha256 matches cloud sha256 but for a DIFFERENT commit → pull anyway", async () => {
    // Defensive: sha collisions across different commits would be astronomic
    // but the gate must be commit-keyed, not sha-keyed. If local says "I have
    // sha X for commit B" and cloud says "commit A has sha X" — those are
    // unrelated facts; we should still pull A.
    mkdirSync(baseDir, { recursive: true });
    writeLastBuild(baseDir, {
      ts: 1_000_000,
      commit_sha: "commit-B",
      snapshot_sha256: "a".repeat(64),
      node_count: 1,
      edge_count: 0,
    });
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "a".repeat(64), // same sha string, but cloud row is for commit A
        ts: 2_000_000,
        node_count: 7, edge_count: 3,
        worktree_id: "remote-wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "commit-A", // != local.commit_sha
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
  });

  it("local present but cloud has newer ts → pulls (overwrites local)", async () => {
    mkdirSync(baseDir, { recursive: true });
    writeLastBuild(baseDir, {
      ts: 1_000_000_000_000,
      commit_sha: "head1234abcd",
      snapshot_sha256: "old-local-sha",
      node_count: 99,
      edge_count: 99,
    });
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "new-cloud-sha",
        ts: 2_000_000_000_000, // newer
        node_count: 5, edge_count: 7,
        worktree_id: "remote-wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
    // .last-build.json now reflects cloud state (per-worktree path)
    const lb = readLastBuild(baseDir, worktreeIdFromCwd(tmpCwd));
    expect(lb!.ts).toBe(2_000_000_000_000);
    expect(lb!.snapshot_sha256).toBe("new-cloud-sha");
    expect(lb!.node_count).toBe(5);
  });
});

describe("pullSnapshot — error paths", () => {
  let tmpCwd: string;
  let baseDir: string;
  beforeEach(() => {
    tmpCwd = mkdtempSync(join(tmpdir(), "pull-errors-"));
    const { key } = deriveProjectKey(tmpCwd);
    baseDir = repoDir(key);
    try { rmSync(baseDir, { recursive: true, force: true }); } catch {}
  });
  afterEach(() => {
    try { rmSync(tmpCwd, { recursive: true, force: true }); } catch {}
    try { rmSync(baseDir, { recursive: true, force: true }); } catch {}
  });

  it("ensureCodebaseTable throws → error outcome (no files written)", async () => {
    const { api } = makeMockApi({ ensureThrows: new Error("table create failed") });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("error");
    if (result.kind === "error") {
      expect(result.message).toContain("ensureCodebaseTable");
      expect(result.message).toContain("table create failed");
    }
    expect(existsSync(join(baseDir, "snapshots", "head1234abcd.json"))).toBe(false);
  });

  it("SELECT throws → error outcome (no files written)", async () => {
    const { api } = makeMockApi({ selectThrows: new Error("network 503") });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("error");
    expect(existsSync(join(baseDir, "snapshots", "head1234abcd.json"))).toBe(false);
  });
});

describe("pullSnapshot — ts coercion", () => {
  let tmpCwd: string;
  beforeEach(() => { tmpCwd = mkdtempSync(join(tmpdir(), "pull-ts-")); });
  afterEach(() => { try { rmSync(tmpCwd, { recursive: true, force: true }); } catch {} });

  it("ISO string ts → parsed as epoch ms", async () => {
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "x".repeat(64),
        ts: "2026-05-21T00:00:00.000Z",
        node_count: 0, edge_count: 0,
        worktree_id: "wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
    if (result.kind === "pulled") {
      // Date.parse("2026-05-21T00:00:00.000Z") === 1779408000000
      expect(result.cloudTs).toBe(Date.parse("2026-05-21T00:00:00.000Z"));
    }
  });

  it("epoch ms number ts → kept as-is", async () => {
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "x".repeat(64),
        ts: 1_700_000_000_000,
        node_count: 0, edge_count: 0,
        worktree_id: "wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    if (result.kind === "pulled") expect(result.cloudTs).toBe(1_700_000_000_000);
  });

  it("epoch seconds number → coerced to ms (× 1000)", async () => {
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "x".repeat(64),
        ts: 1_700_000_000, // 10-digit = seconds
        node_count: 0, edge_count: 0,
        worktree_id: "wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    if (result.kind === "pulled") expect(result.cloudTs).toBe(1_700_000_000_000);
  });

  it("unparseable ts → treated as 0, still pulls", async () => {
    const { api } = makeMockApi({
      selectReturns: [{
        snapshot_jsonb: CLOUD_PAYLOAD,
        snapshot_sha256: "x".repeat(64),
        ts: "not-a-date",
        node_count: 0, edge_count: 0,
        worktree_id: "wt",
      }],
    });
    const result = await pullSnapshot(tmpCwd, {
      loadConfig: makeConfig,
      readHead: () => "head1234abcd",
      makeApi: () => api,
    });
    expect(result.kind).toBe("pulled");
    if (result.kind === "pulled") expect(result.cloudTs).toBe(0);
  });
});
