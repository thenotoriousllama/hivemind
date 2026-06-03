import type { GraphSnapshot, GraphEdge } from "../types.js";

interface Hop {
  edge: GraphEdge;
  reversed: boolean;
}

function resolvePattern(snap: GraphSnapshot, pattern: string): string[] {
  const needle = pattern.toLowerCase();
  return snap.nodes
    .filter((n) => n.id.toLowerCase().includes(needle) || n.label.toLowerCase().includes(needle))
    .map((n) => n.id)
    .sort();
}

function buildAdjacency(
  snap: GraphSnapshot,
  undirected: boolean,
): Map<string, Array<{ neighborId: string; edge: GraphEdge; reversed: boolean }>> {
  const adj = new Map<string, Array<{ neighborId: string; edge: GraphEdge; reversed: boolean }>>();
  const nodeIds = new Set<string>();
  for (const n of snap.nodes) { adj.set(n.id, []); nodeIds.add(n.id); }

  for (const edge of snap.links) {
    // Skip edges with an unresolved endpoint: from/to resolve only to real
    // nodes, so a path must never route THROUGH a phantom id that isn't a
    // graph node (codex review).
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue;
    adj.get(edge.source)!.push({ neighborId: edge.target, edge, reversed: false });
    if (undirected) {
      adj.get(edge.target)!.push({ neighborId: edge.source, edge, reversed: true });
    }
  }

  // Sort neighbors by id, then relation, then direction for reproducible BFS
  // order even when parallel edges connect the same pair (determinism).
  for (const neighbors of adj.values()) {
    neighbors.sort((a, b) =>
      a.neighborId.localeCompare(b.neighborId) ||
      a.edge.relation.localeCompare(b.edge.relation) ||
      (a.reversed === b.reversed ? 0 : a.reversed ? 1 : -1),
    );
  }
  return adj;
}

function bfs(
  adj: Map<string, Array<{ neighborId: string; edge: GraphEdge; reversed: boolean }>>,
  fromId: string,
  toId: string,
): Hop[] | null {
  if (fromId === toId) return [];
  const parent = new Map<string, { parentId: string; hop: Hop }>();
  const visited = new Set<string>([fromId]);
  const queue: string[] = [fromId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const { neighborId, edge, reversed } of adj.get(current) ?? []) {
      if (visited.has(neighborId)) continue;
      visited.add(neighborId);
      parent.set(neighborId, { parentId: current, hop: { edge, reversed } });
      if (neighborId === toId) {
        const hops: Hop[] = [];
        let cur = toId;
        while (cur !== fromId) {
          const p = parent.get(cur)!;
          hops.unshift(p.hop);
          cur = p.parentId;
        }
        return hops;
      }
      queue.push(neighborId);
    }
  }
  return null;
}

function renderHops(fromId: string, hops: Hop[], undirected: boolean): string {
  const lines: string[] = [];
  lines.push(`${undirected ? "Undirected path" : "Directed path"}  (${hops.length} hop${hops.length === 1 ? "" : "s"}):`);
  lines.push("");
  lines.push(`  ${fromId}`);

  for (const { edge, reversed } of hops) {
    if (reversed) {
      lines.push(`    <--${edge.relation}--  ${edge.source}  [real edge: ${edge.source} → ${edge.target}]`);
    } else {
      lines.push(`    --${edge.relation}-->  ${edge.target}`);
    }
  }

  if (undirected) {
    lines.push("");
    lines.push("Note: no directed path exists. Arrows with <-- are traversed against their declared direction.");
  }

  return lines.join("\n");
}

function candidateList(pattern: string, ids: string[]): string {
  const lines = [`"${pattern}" matches ${ids.length} nodes — be more specific:`];
  lines.push("");
  const shown = ids.slice(0, 20);
  for (let i = 0; i < shown.length; i++) lines.push(`  [${i + 1}]  ${shown[i]}`);
  if (ids.length > 20) lines.push(`  ... and ${ids.length - 20} more`);
  return lines.join("\n");
}

export function renderPath(snap: GraphSnapshot, fromPattern: string, toPattern: string): string {
  const fromIds = resolvePattern(snap, fromPattern);
  const toIds = resolvePattern(snap, toPattern);

  if (fromIds.length === 0) {
    return `No node matches "${fromPattern}". Try cat memory/graph/find/<pattern> to explore.`;
  }
  if (toIds.length === 0) {
    return `No node matches "${toPattern}". Try cat memory/graph/find/<pattern> to explore.`;
  }
  if (fromIds.length > 1) return candidateList(fromPattern, fromIds);
  if (toIds.length > 1) return candidateList(toPattern, toIds);

  const fromId = fromIds[0]!;
  const toId = toIds[0]!;

  if (fromId === toId) {
    return `"${fromId}" is the same node on both ends — path length 0.`;
  }

  const dirPath = bfs(buildAdjacency(snap, false), fromId, toId);
  if (dirPath !== null) return renderHops(fromId, dirPath, false);

  const undirPath = bfs(buildAdjacency(snap, true), fromId, toId);
  if (undirPath !== null) return renderHops(fromId, undirPath, true);

  const fromNode = snap.nodes.find((n) => n.id === fromId);
  const toNode = snap.nodes.find((n) => n.id === toId);
  const sameFile = fromNode && toNode && fromNode.source_file === toNode.source_file;
  const context = sameFile
    ? `Both are in ${fromNode!.source_file} — same file but no connecting edges.`
    : `Sources: ${fromNode?.source_file ?? "?"} vs ${toNode?.source_file ?? "?"} — they appear disconnected.`;

  return [`No path found between:`, `  from: ${fromId}`, `  to:   ${toId}`, ``, context].join("\n");
}
