import { describe, it, expect } from "vitest";
import { renderTour } from "../../../src/graph/render/tour.js";
import type { GraphSnapshot } from "../../../src/graph/types.js";

function makeSnap(overrides?: Partial<GraphSnapshot>): GraphSnapshot {
  return {
    directed: true,
    multigraph: true,
    graph: { schema_version: 1, generator: "hivemind-graph", commit_sha: "abc1234", repo_key: "test-key" },
    observation: {
      ts: "2026-06-03T00:00:00Z",
      branch: "main",
      worktree_path: "/test",
      repo_project: "test",
      generator_version: "0.0.0",
      source_files_extracted: 3,
      source_files_skipped: 0,
    },
    nodes: [],
    links: [],
    ...overrides,
  };
}

// ── Fixture (8 nodes) ───────────────────────────────────────────────────────
//
// Entry points (exported, no incoming):
//   a.ts:init:function — isolated, no edges
//   a.ts:main:function — imports b.ts:parse (but nobody imports main)
//
// Dependency chain (bottom-up order expected):
//   b.ts:utils ← b.ts:format ← b.ts:parse ← a.ts:main
//   (a.ts:main imports b.ts:parse; parse calls format; format calls utils)
//
// Cycle: c.ts:alpha ↔ c.ts:beta (mutual calls)
//
// Isolated non-exported: d.ts:standalone (no edges, not exported → walkthrough)

const NODES: GraphSnapshot["nodes"] = [
  { id: "a.ts:init:function",     label: "init",       kind: "function", source_file: "a.ts", source_location: "L1",  language: "typescript", exported: true  },
  { id: "a.ts:main:function",     label: "main",       kind: "function", source_file: "a.ts", source_location: "L10", language: "typescript", exported: true  },
  { id: "b.ts:parse:function",    label: "parse",      kind: "function", source_file: "b.ts", source_location: "L1",  language: "typescript", exported: false },
  { id: "b.ts:format:function",   label: "format",     kind: "function", source_file: "b.ts", source_location: "L10", language: "typescript", exported: false },
  { id: "b.ts:utils:function",    label: "utils",      kind: "function", source_file: "b.ts", source_location: "L20", language: "typescript", exported: false },
  { id: "c.ts:alpha:function",    label: "alpha",      kind: "function", source_file: "c.ts", source_location: "L1",  language: "typescript", exported: false },
  { id: "c.ts:beta:function",     label: "beta",       kind: "function", source_file: "c.ts", source_location: "L10", language: "typescript", exported: false },
  { id: "d.ts:standalone:function", label: "standalone", kind: "function", source_file: "d.ts", source_location: "L1", language: "typescript", exported: false },
];

const LINKS: GraphSnapshot["links"] = [
  // dependency chain: main → parse → format → utils
  { source: "a.ts:main:function",   target: "b.ts:parse:function",  relation: "imports", confidence: "EXTRACTED" },
  { source: "b.ts:parse:function",  target: "b.ts:format:function", relation: "calls",   confidence: "EXTRACTED" },
  { source: "b.ts:format:function", target: "b.ts:utils:function",  relation: "calls",   confidence: "EXTRACTED" },
  // 2-node cycle
  { source: "c.ts:alpha:function",  target: "c.ts:beta:function",   relation: "calls",   confidence: "EXTRACTED" },
  { source: "c.ts:beta:function",   target: "c.ts:alpha:function",  relation: "calls",   confidence: "EXTRACTED" },
];

describe("renderTour", () => {
  it("returns a friendly message for an empty snapshot", () => {
    const out = renderTour(makeSnap());
    expect(out.toLowerCase()).toContain("empty");
  });

  it("happy path: all three sections present with correct counts in header and summary", () => {
    const out = renderTour(makeSnap({ nodes: NODES, links: LINKS }));

    expect(out).toContain("8 nodes");
    expect(out).toContain("Entry points (2)");
    expect(out).toContain("a.ts:init:function");
    expect(out).toContain("a.ts:main:function");

    expect(out).toContain("Walkthrough");
    expect(out).toContain("b.ts:utils:function");
    expect(out).toContain("b.ts:parse:function");

    expect(out).toContain("Cyclic");
    expect(out).toContain("c.ts:alpha:function");
    expect(out).toContain("c.ts:beta:function");

    // True totals always reported in summary line
    expect(out).toContain("Total: 2 entry + 4 walkthrough + 2 cyclic = 8 nodes");
  });

  it("dependency order: utils before format before parse in walkthrough", () => {
    const out = renderTour(makeSnap({ nodes: NODES, links: LINKS }));
    const lines = out.split("\n");

    const idxUtils   = lines.findIndex((l) => l.includes("b.ts:utils:function"));
    const idxFormat  = lines.findIndex((l) => l.includes("b.ts:format:function"));
    const idxParse   = lines.findIndex((l) => l.includes("b.ts:parse:function"));

    expect(idxUtils).toBeGreaterThan(-1);
    expect(idxFormat).toBeGreaterThan(-1);
    expect(idxParse).toBeGreaterThan(-1);

    // dependencies (utils) appear before their dependents (format, parse)
    expect(idxUtils).toBeLessThan(idxFormat);
    expect(idxFormat).toBeLessThan(idxParse);
  });

  it("2-node cycle: both nodes land in the Cyclic section and nothing is dropped", () => {
    const out = renderTour(makeSnap({ nodes: NODES, links: LINKS }));
    const lines = out.split("\n");

    const cyclicHeaderIdx = lines.findIndex((l) => l.includes("Cyclic"));
    expect(cyclicHeaderIdx).toBeGreaterThan(-1);

    // Both cycle nodes appear AFTER the cyclic header
    const afterCyclic = lines.slice(cyclicHeaderIdx).join("\n");
    expect(afterCyclic).toContain("c.ts:alpha:function");
    expect(afterCyclic).toContain("c.ts:beta:function");

    // cycle nodes must NOT appear in the entry or walkthrough sections
    const beforeCyclic = lines.slice(0, cyclicHeaderIdx).join("\n");
    expect(beforeCyclic).not.toContain("c.ts:alpha:function");
    expect(beforeCyclic).not.toContain("c.ts:beta:function");

    // Total node count preserved across all three sections
    expect(out).toContain("= 8 nodes");
  });

  it("isolated exported node is an entry point; isolated non-exported is in walkthrough", () => {
    const out = renderTour(
      makeSnap({
        nodes: [
          { id: "x.ts:Pub:function", label: "Pub", kind: "function", source_file: "x.ts", source_location: "L1", language: "typescript", exported: true  },
          { id: "x.ts:Priv:function", label: "Priv", kind: "function", source_file: "x.ts", source_location: "L5", language: "typescript", exported: false },
        ],
        links: [],
      }),
    );

    expect(out).toContain("Entry points (1)");
    expect(out).toContain("x.ts:Pub:function");

    // Priv ends up in the walkthrough (inDegRev=0 so Kahn picks it up)
    expect(out).toContain("Walkthrough");
    expect(out).toContain("x.ts:Priv:function");

    // No cycles
    expect(out).not.toContain("Cyclic");

    expect(out).toContain("= 2 nodes");
  });
});
