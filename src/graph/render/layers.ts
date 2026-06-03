import type { GraphSnapshot } from "../types.js";

interface LayerRule {
  test: (path: string) => boolean;
  layer: string;
}

// Ordered: first match wins.
const LAYER_RULES: LayerRule[] = [
  { layer: "Tests",      test: (p) => p.includes("/tests/") || p.includes(".test.") || p.includes("/__tests__/") },
  { layer: "Hooks",      test: (p) => p.includes("/hooks/") },
  { layer: "CLI",        test: (p) => p.includes("/cli/") || p.includes("/commands/") },
  { layer: "Graph",      test: (p) => p.includes("/graph/") },
  { layer: "Shell/VFS",  test: (p) => p.includes("/shell/") },
  { layer: "Embeddings", test: (p) => p.includes("/embeddings/") },
  { layer: "Skillify",   test: (p) => p.includes("/skillify/") },
  { layer: "Config",     test: (p) => /(?:^|\/)config\.[^/]+$/.test(p) || /\.config\.[^/]+$/.test(p) },
  { layer: "Utils",      test: (p) => p.includes("/utils/") },
];

export function layerOf(sourceFile: string): string {
  // Normalize with a leading slash so a root-level folder (e.g. "tests/foo.ts"
  // or "graph/render/path.ts") matches the same "/tests/", "/graph/" rules as
  // a nested one (codex review).
  const p = sourceFile.startsWith("/") ? sourceFile : `/${sourceFile}`;
  for (const rule of LAYER_RULES) {
    if (rule.test(p)) return rule.layer;
  }
  return "Core";
}

export function renderLayers(snap: GraphSnapshot): string {
  try {
    // Bucket nodes by layer, and collect per-file counts within each layer.
    const layerNodes: Map<string, number> = new Map();
    const layerFiles: Map<string, Map<string, number>> = new Map();

    for (const node of snap.nodes) {
      const layer = layerOf(node.source_file);

      layerNodes.set(layer, (layerNodes.get(layer) ?? 0) + 1);

      let fileMap = layerFiles.get(layer);
      if (!fileMap) { fileMap = new Map(); layerFiles.set(layer, fileMap); }
      fileMap.set(node.source_file, (fileMap.get(node.source_file) ?? 0) + 1);
    }

    if (layerNodes.size === 0) {
      return "No nodes in snapshot — nothing to layer.";
    }

    // Sort layers by node count descending.
    const sorted = [...layerNodes.entries()].sort(([, a], [, b]) => b - a);

    const lines: string[] = [];
    lines.push("## Architectural Layers");
    lines.push("");

    for (const [layer, count] of sorted) {
      lines.push(`${layer.padEnd(14)} ${String(count).padStart(4)} node${count === 1 ? "" : "s"}`);

      const fileMap = layerFiles.get(layer)!;
      const topFiles = [...fileMap.entries()]
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      for (const [file, n] of topFiles) {
        lines.push(`  ${String(n).padStart(3)}  ${file}`);
      }
      if (fileMap.size > 5) {
        lines.push(`       ... and ${fileMap.size - 5} more file${fileMap.size - 5 === 1 ? "" : "s"}`);
      }
    }

    lines.push("");
    lines.push(`Total: ${snap.nodes.length} node${snap.nodes.length === 1 ? "" : "s"} across ${sorted.length} layer${sorted.length === 1 ? "" : "s"}`);

    return lines.join("\n");
  } catch {
    return "Failed to render layer view.";
  }
}
