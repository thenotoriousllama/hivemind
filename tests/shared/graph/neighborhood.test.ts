import { describe, it, expect } from "vitest";
import { renderNeighborhood } from "../../../src/graph/render/neighborhood.js";
import type { GraphSnapshot } from "../../../src/graph/types.js";

// Inline fixture: 3 files, 9 nodes, 6 edges.
//   src/a.ts  — Alpha (function, exported, L1), Beta (class, internal, L10-20)
//   src/b.ts  — Gamma (function, exported, L5), Delta (interface, exported, L15)
//   src/c.ts  — Epsilon (const, internal, L3), Zeta (function, exported, L7), Eta (method, internal, L12)
//
// Edges:
//   src/a.ts → src/b.ts  imports  (Alpha → Gamma)
//   src/a.ts → src/b.ts  imports  (Beta  → Delta)
//   src/b.ts → src/a.ts  imports  (Gamma → Alpha)   — circular import
//   src/c.ts → src/a.ts  imports  (Epsilon → Alpha)
//   src/b.ts → src/b.ts  calls    (Gamma → Delta)   — intra-file, should NOT appear in cross-file
//   src/a.ts → src/a.ts  calls    (Alpha → Beta)    — intra-file, should NOT appear in cross-file

const fixture: GraphSnapshot = {
  directed: true,
  multigraph: true,
  graph: {
    schema_version: 1,
    generator: "hivemind-graph",
    commit_sha: "abc1234",
    repo_key: "test-repo",
  },
  observation: {
    ts: "2026-06-03T00:00:00Z",
    branch: "main",
    worktree_path: "/tmp/test",
    repo_project: "test",
    generator_version: "0.0.1",
    source_files_extracted: 3,
    source_files_skipped: 0,
  },
  nodes: [
    { id: "src/a.ts:Alpha:function",   label: "Alpha",   kind: "function",  source_file: "src/a.ts", source_location: "L1",     language: "typescript", exported: true  },
    { id: "src/a.ts:Beta:class",       label: "Beta",    kind: "class",     source_file: "src/a.ts", source_location: "L10-20", language: "typescript", exported: false },
    { id: "src/b.ts:Gamma:function",   label: "Gamma",   kind: "function",  source_file: "src/b.ts", source_location: "L5",     language: "typescript", exported: true  },
    { id: "src/b.ts:Delta:interface",  label: "Delta",   kind: "interface", source_file: "src/b.ts", source_location: "L15",    language: "typescript", exported: true  },
    { id: "src/c.ts:Epsilon:const",    label: "Epsilon", kind: "const",     source_file: "src/c.ts", source_location: "L3",     language: "typescript", exported: false },
    { id: "src/c.ts:Zeta:function",    label: "Zeta",    kind: "function",  source_file: "src/c.ts", source_location: "L7",     language: "typescript", exported: true  },
    { id: "src/c.ts:Eta:method",       label: "Eta",     kind: "method",    source_file: "src/c.ts", source_location: "L12",    language: "typescript", exported: false },
  ],
  links: [
    // cross-file: a → b
    { source: "src/a.ts:Alpha:function",  target: "src/b.ts:Gamma:function",  relation: "imports", confidence: "EXTRACTED" },
    { source: "src/a.ts:Beta:class",      target: "src/b.ts:Delta:interface", relation: "imports", confidence: "EXTRACTED" },
    // cross-file: b → a (circular)
    { source: "src/b.ts:Gamma:function",  target: "src/a.ts:Alpha:function",  relation: "imports", confidence: "EXTRACTED" },
    // cross-file: c → a
    { source: "src/c.ts:Epsilon:const",   target: "src/a.ts:Alpha:function",  relation: "imports", confidence: "EXTRACTED" },
    // intra-file: b → b (should NOT appear in cross-file section)
    { source: "src/b.ts:Gamma:function",  target: "src/b.ts:Delta:interface", relation: "calls",   confidence: "EXTRACTED" },
    // intra-file: a → a
    { source: "src/a.ts:Alpha:function",  target: "src/a.ts:Beta:class",      relation: "calls",   confidence: "EXTRACTED" },
  ],
};

describe("renderNeighborhood", () => {
  it("lists symbols in the resolved file, sorted by line then label", () => {
    const out = renderNeighborhood(fixture, "src/a.ts");
    expect(out).toContain("## Symbols in src/a.ts");
    // Alpha at L1 should come before Beta at L10
    const alphaPos = out.indexOf("Alpha");
    const betaPos  = out.indexOf("Beta");
    expect(alphaPos).toBeGreaterThan(-1);
    expect(betaPos).toBeGreaterThan(-1);
    expect(alphaPos).toBeLessThan(betaPos);
    // exported / internal flags
    expect(out).toMatch(/Alpha\s+function\s+exported/);
    expect(out).toMatch(/Beta\s+class\s+internal/);
  });

  it("shows cross-file outgoing import edges for src/a.ts", () => {
    const out = renderNeighborhood(fixture, "src/a.ts");
    expect(out).toContain("## Cross-file neighbors");
    // a.ts imports two nodes in b.ts → Outgoing
    expect(out).toContain("Outgoing:");
    expect(out).toContain("src/b.ts:Gamma:function");
    expect(out).toContain("src/b.ts:Delta:interface");
  });

  it("shows cross-file incoming import edges for src/a.ts", () => {
    const out = renderNeighborhood(fixture, "src/a.ts");
    // b.ts and c.ts both import from a.ts → Incoming
    expect(out).toContain("Incoming:");
    expect(out).toContain("src/b.ts:Gamma:function");
    expect(out).toContain("src/c.ts:Epsilon:const");
  });

  it("does NOT include intra-file edges in the cross-file section", () => {
    const out = renderNeighborhood(fixture, "src/a.ts");
    // The intra-file calls edge (Alpha→Beta) must not appear in cross-file neighbors.
    // The cross-file section starts after the symbols section — check after that marker.
    const crossIdx = out.indexOf("## Cross-file neighbors");
    const crossSection = out.slice(crossIdx);
    // Beta is only a target via an intra-file calls edge; it must not appear in cross-file
    expect(crossSection).not.toContain("src/a.ts:Beta:class");
  });

  it("accepts a unique suffix match", () => {
    // "a.ts" uniquely resolves to "src/a.ts"
    const out = renderNeighborhood(fixture, "a.ts");
    expect(out).toContain("## Symbols in src/a.ts");
  });

  it("returns ambiguous message when the suffix matches multiple files", () => {
    // ".ts" matches all three files
    const out = renderNeighborhood(fixture, ".ts");
    expect(out).toContain("matches multiple files");
    expect(out).toContain("src/a.ts");
    expect(out).toContain("src/b.ts");
    expect(out).toContain("src/c.ts");
  });

  it("returns no-match message for an unknown file", () => {
    const out = renderNeighborhood(fixture, "src/nonexistent.ts");
    expect(out).toContain('No nodes for "src/nonexistent.ts"');
  });

  it("handles an empty snapshot gracefully", () => {
    const empty: GraphSnapshot = {
      ...fixture,
      nodes: [],
      links: [],
    };
    const out = renderNeighborhood(empty, "src/a.ts");
    expect(out).toContain('No nodes for "src/a.ts"');
  });

  it("handles a file with nodes but no cross-file edges", () => {
    // src/b.ts only has intra-file calls; its only cross-file edges are from the fixture
    // Let's use a snapshot with b.ts nodes but strip all cross-file edges involving b.ts
    const noEdges: GraphSnapshot = {
      ...fixture,
      links: [
        // keep only intra-file b→b
        { source: "src/b.ts:Gamma:function", target: "src/b.ts:Delta:interface", relation: "calls", confidence: "EXTRACTED" },
      ],
    };
    const out = renderNeighborhood(noEdges, "src/b.ts");
    expect(out).toContain("Outgoing: (none)");
    expect(out).toContain("Incoming: (none)");
  });

  it("includes caveat about calls edges being intra-file only", () => {
    const out = renderNeighborhood(fixture, "src/a.ts");
    expect(out).toContain("'calls' edges are intra-file only");
  });
});
