import { describe, it, expect } from "vitest";
import { layerOf, renderLayers } from "../../../src/graph/render/layers.js";
import type { GraphSnapshot } from "../../../src/graph/types.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeSnap(nodes: Array<{ id: string; sourceFile: string }>): GraphSnapshot {
  return {
    directed: true,
    multigraph: true,
    graph: { schema_version: 1, generator: "hivemind-graph", commit_sha: "abc1234", repo_key: "test" },
    observation: {
      ts: "2026-06-03T00:00:00Z",
      branch: "main",
      worktree_path: "/test",
      repo_project: "test-repo",
      generator_version: "0.0.0",
      source_files_extracted: nodes.length,
      source_files_skipped: 0,
    },
    nodes: nodes.map(({ id, sourceFile }) => ({
      id,
      label: id.split(":")[1] ?? id,
      kind: "function" as const,
      source_file: sourceFile,
      source_location: "L1",
      language: "typescript" as const,
      exported: true,
    })),
    links: [],
  };
}

// ── layerOf unit tests ─────────────────────────────────────────────────────

describe("layerOf", () => {
  it("classifies a hooks file", () => {
    expect(layerOf("src/hooks/graph-pull-worker.ts")).toBe("Hooks");
  });

  it("classifies a test file (path segment)", () => {
    expect(layerOf("tests/shared/graph/snapshot.test.ts")).toBe("Tests");
  });

  it("classifies a .test. file not under /tests/", () => {
    expect(layerOf("src/graph/snapshot.test.ts")).toBe("Tests");
  });

  // codex review: a ROOT-LEVEL folder must match the same rules as a nested
  // one (leading-slash normalization). These have no ".test." / no leading
  // slash, so they exercise the folder rule specifically.
  it("classifies root-level folders (no leading slash)", () => {
    expect(layerOf("tests/fixtures/data.ts")).toBe("Tests");
    expect(layerOf("graph/render/path.ts")).toBe("Graph");
    expect(layerOf("hooks/on-stop.ts")).toBe("Hooks");
  });

  it("classifies a graph file", () => {
    expect(layerOf("src/graph/vfs-handler.ts")).toBe("Graph");
  });

  it("classifies a cli/commands file", () => {
    expect(layerOf("src/commands/build.ts")).toBe("CLI");
  });

  it("classifies an embeddings file", () => {
    expect(layerOf("src/embeddings/index.ts")).toBe("Embeddings");
  });

  it("classifies a skillify file", () => {
    expect(layerOf("src/skillify/mine.ts")).toBe("Skillify");
  });

  it("classifies a utils file", () => {
    expect(layerOf("src/utils/repo-identity.ts")).toBe("Utils");
  });

  it("classifies a config file", () => {
    expect(layerOf("esbuild.config.mjs")).toBe("Config");
  });

  it("falls back to Core for an unknown path", () => {
    expect(layerOf("src/main.ts")).toBe("Core");
    expect(layerOf("index.ts")).toBe("Core");
  });

  // Hooks takes priority over Graph for a hooks file that happens to live
  // under a graph-adjacent path — first rule wins.
  it("prefers Hooks over Graph when both signals match", () => {
    expect(layerOf("src/hooks/graph-builder.ts")).toBe("Hooks");
  });
});

// ── renderLayers unit tests ────────────────────────────────────────────────

describe("renderLayers", () => {
  it("renders empty snapshot without throwing", () => {
    const snap = makeSnap([]);
    const out = renderLayers(snap);
    expect(out).toContain("nothing to layer");
  });

  it("shows layer names and counts, sorted by count desc", () => {
    const snap = makeSnap([
      // 3 Graph nodes
      { id: "src/graph/snapshot.ts:a:function",    sourceFile: "src/graph/snapshot.ts" },
      { id: "src/graph/snapshot.ts:b:function",    sourceFile: "src/graph/snapshot.ts" },
      { id: "src/graph/vfs-handler.ts:c:function", sourceFile: "src/graph/vfs-handler.ts" },
      // 2 Hooks nodes
      { id: "src/hooks/worker.ts:d:function", sourceFile: "src/hooks/worker.ts" },
      { id: "src/hooks/worker.ts:e:function", sourceFile: "src/hooks/worker.ts" },
      // 1 Core node
      { id: "src/main.ts:f:function", sourceFile: "src/main.ts" },
    ]);

    const out = renderLayers(snap);

    // All three layer names must appear.
    expect(out).toContain("Graph");
    expect(out).toContain("Hooks");
    expect(out).toContain("Core");

    // Graph (3 nodes) must appear before Hooks (2 nodes).
    expect(out.indexOf("Graph")).toBeLessThan(out.indexOf("Hooks"));
    // Hooks (2 nodes) must appear before Core (1 node).
    expect(out.indexOf("Hooks")).toBeLessThan(out.indexOf("Core"));

    // Totals line.
    expect(out).toContain("6 nodes");
    expect(out).toContain("3 layers");
  });

  it("shows top-5 files per layer and truncates when there are more", () => {
    // 7 distinct files in Graph → should show 5 and say "and 2 more"
    const nodes = Array.from({ length: 7 }, (_, i) => ({
      id: `src/graph/file${i}.ts:fn:function`,
      sourceFile: `src/graph/file${i}.ts`,
    }));
    const snap = makeSnap(nodes);
    const out = renderLayers(snap);

    expect(out).toContain("src/graph/file");
    expect(out).toContain("and 2 more file");
  });

  it("handles a snapshot with a single node", () => {
    const snap = makeSnap([{ id: "src/main.ts:run:function", sourceFile: "src/main.ts" }]);
    const out = renderLayers(snap);
    expect(out).toContain("Core");
    expect(out).toContain("1 node");
    expect(out).toContain("1 layer");
  });
});
