import { describe, it, expect } from "vitest";
import type { GraphSnapshot, GraphNode, GraphEdge } from "../../../src/graph/types.js";
import { renderPath } from "../../../src/graph/render/path.js";

// ── Inline fixture ─────────────────────────────────────────────────────────
// Graph structure (directed edges):
//   Alpha --calls--> Bravo
//   Alpha --calls--> Charlie   (shortcut; makes Alpha->Charlie shortest = 1 hop)
//   Alpha --calls--> Delta
//   Bravo --calls--> Charlie
//   Delta --calls--> Foxtrot   (2-hop from Alpha: Alpha->Delta->Foxtrot)
//   Golf  --calls--> Bravo     (undirected only from Charlie: Charlie<-Bravo<-Golf)
//
// NodeOne + NodeTwo both contain "node" in their labels → ambiguous pattern test.
// Echo is isolated (no edges) → no-path test.

function n(id: string, label: string, source_file: string): GraphNode {
  return { id, label, kind: "function", source_file, source_location: "L1", language: "typescript", exported: false };
}

function e(source: string, target: string): GraphEdge {
  return { source, target, relation: "calls", confidence: "EXTRACTED" };
}

const SNAP: GraphSnapshot = {
  directed: true,
  multigraph: true,
  graph: { schema_version: 1, generator: "hivemind-graph", commit_sha: null, repo_key: "test" },
  observation: {
    ts: "2024-01-01T00:00:00Z",
    branch: "main",
    worktree_path: "/test",
    repo_project: "test",
    generator_version: "0.0.0",
    source_files_extracted: 6,
    source_files_skipped: 0,
  },
  nodes: [
    n("src/a.ts:Alpha:function",   "Alpha",   "src/a.ts"),
    n("src/a.ts:Bravo:function",   "Bravo",   "src/a.ts"),
    n("src/b.ts:Charlie:function", "Charlie", "src/b.ts"),
    n("src/b.ts:Delta:function",   "Delta",   "src/b.ts"),
    n("src/c.ts:Foxtrot:function", "Foxtrot", "src/c.ts"),
    n("src/d.ts:Golf:function",    "Golf",    "src/d.ts"),
    n("src/e.ts:Echo:function",    "Echo",    "src/e.ts"),
    n("src/f.ts:NodeOne:function", "NodeOne", "src/f.ts"),
    n("src/f.ts:NodeTwo:function", "NodeTwo", "src/f.ts"),
  ],
  links: [
    e("src/a.ts:Alpha:function",   "src/a.ts:Bravo:function"),
    e("src/a.ts:Alpha:function",   "src/b.ts:Charlie:function"),
    e("src/a.ts:Alpha:function",   "src/b.ts:Delta:function"),
    e("src/a.ts:Bravo:function",   "src/b.ts:Charlie:function"),
    e("src/b.ts:Delta:function",   "src/c.ts:Foxtrot:function"),
    e("src/d.ts:Golf:function",    "src/a.ts:Bravo:function"),
  ],
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe("renderPath", () => {
  it("resolves a direct 1-hop directed path", () => {
    const out = renderPath(SNAP, "alpha", "delta");
    expect(out).toMatch(/Directed path\s+\(1 hop\)/);
    expect(out).toContain("src/a.ts:Alpha:function");
    expect(out).toContain("--calls-->");
    expect(out).toContain("src/b.ts:Delta:function");
    expect(out).not.toContain("Undirected");
  });

  it("resolves a 2-hop directed path", () => {
    const out = renderPath(SNAP, "alpha", "foxtrot");
    expect(out).toMatch(/Directed path\s+\(2 hops\)/);
    expect(out).toContain("src/a.ts:Alpha:function");
    expect(out).toContain("src/b.ts:Delta:function");
    expect(out).toContain("src/c.ts:Foxtrot:function");
    expect(out).not.toContain("Undirected");
  });

  it("picks the shortest path when two directed routes exist", () => {
    // Alpha->Charlie direct (1 hop) vs Alpha->Bravo->Charlie (2 hops)
    const out = renderPath(SNAP, "alpha", "charlie");
    expect(out).toMatch(/Directed path\s+\(1 hop\)/);
    expect(out).toContain("src/a.ts:Alpha:function");
    expect(out).toContain("src/b.ts:Charlie:function");
    // The 2-hop detour via Bravo must NOT appear
    expect(out).not.toContain("src/a.ts:Bravo:function");
  });

  it("returns a candidate list when the from-pattern is ambiguous", () => {
    // "node" matches NodeOne and NodeTwo
    const out = renderPath(SNAP, "node", "alpha");
    expect(out).toContain('"node" matches 2 nodes');
    expect(out).toContain("[1]");
    expect(out).toContain("[2]");
    expect(out).toContain("be more specific");
  });

  it("returns a candidate list when the to-pattern is ambiguous", () => {
    const out = renderPath(SNAP, "alpha", "node");
    expect(out).toContain('"node" matches 2 nodes');
    expect(out).toContain("be more specific");
  });

  it("returns a clear no-match message for an unrecognised pattern", () => {
    const out = renderPath(SNAP, "zzznomatch", "charlie");
    expect(out).toContain('No node matches "zzznomatch"');
    expect(out).not.toContain("hop");
  });

  it("finds an undirected path when no directed path exists", () => {
    // Charlie has no outgoing edges; Golf only has Golf->Bravo->Charlie (reversed).
    // Directed: Charlie cannot reach Golf.
    // Undirected: Charlie <--calls-- Bravo <--calls-- Golf (2 reversed hops).
    const out = renderPath(SNAP, "charlie", "golf");
    expect(out).toMatch(/Undirected path/);
    expect(out).toContain("src/b.ts:Charlie:function");
    expect(out).toContain("src/a.ts:Bravo:function");
    expect(out).toContain("src/d.ts:Golf:function");
    expect(out).toContain("<--calls--");
    expect(out).toContain("no directed path exists");
  });

  it("reports no path when nodes are fully disconnected", () => {
    // Echo has no edges at all — unreachable from Alpha in any direction.
    const out = renderPath(SNAP, "alpha", "echo");
    expect(out).toContain("No path found");
    expect(out).toContain("src/a.ts:Alpha:function");
    expect(out).toContain("src/e.ts:Echo:function");
    expect(out).not.toContain("hop");
  });

  it("notes same-file context when no path exists between same-file nodes", () => {
    // NodeOne and NodeTwo are in src/f.ts but have no edges.
    const out = renderPath(SNAP, "nodeone", "nodetwo");
    expect(out).toContain("No path found");
    expect(out).toContain("src/f.ts");
    expect(out).toMatch(/same file/i);
  });

  it("handles an empty snapshot without throwing", () => {
    const empty: GraphSnapshot = {
      ...SNAP,
      nodes: [],
      links: [],
    };
    const out = renderPath(empty, "anything", "other");
    expect(out).toContain("No node matches");
  });
});
