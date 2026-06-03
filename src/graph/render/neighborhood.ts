import type { GraphSnapshot, GraphNode, GraphEdge } from "../types.js";

const CAP = 25;

/**
 * Render a two-section view of a single source file in the graph:
 *   1. Symbols defined in the file (sorted by line then label).
 *   2. Cross-file neighbors — edges that connect a symbol in this file
 *      to a symbol in another file, grouped by direction and relation.
 *
 * Never throws — always returns a string.
 */
export function renderNeighborhood(snap: GraphSnapshot, file: string): string {
  const allFiles = [...new Set(snap.nodes.map((n) => n.source_file))];

  // --- Resolve file ---
  let resolved: string | null = null;

  if (allFiles.includes(file)) {
    resolved = file;
  } else {
    const matches = allFiles.filter((f) => f.endsWith(file) || f.includes(file));
    if (matches.length === 1) {
      resolved = matches[0]!;
    } else if (matches.length > 1) {
      const lines: string[] = [];
      lines.push(`"${file}" matches multiple files — which did you mean?`);
      lines.push("");
      for (const m of matches.slice(0, 10)) lines.push(`  ${m}`);
      if (matches.length > 10) lines.push(`  ... and ${matches.length - 10} more`);
      return lines.join("\n");
    }
  }

  if (resolved === null) {
    const lines: string[] = [];
    lines.push(`No nodes for "${file}".`);
    const parts = file.split("/").filter((p) => p.length > 2);
    const close = allFiles
      .filter((f) => parts.some((p) => f.includes(p)))
      .slice(0, 3);
    if (close.length > 0) {
      lines.push("Did you mean:");
      for (const c of close) lines.push(`  ${c}`);
    }
    return lines.join("\n");
  }

  const fileNodes = snap.nodes.filter((n) => n.source_file === resolved);
  const fileNodeIds = new Set(fileNodes.map((n) => n.id));
  // id -> source_file for ALL nodes, so we can tell a genuine cross-file
  // neighbor (a real node in another file) from an unresolved edge endpoint
  // (an id not present in nodes[], e.g. an external import target). Only the
  // former counts as a cross-file neighbor (codex review).
  const fileOf = new Map<string, string>();
  for (const n of snap.nodes) fileOf.set(n.id, n.source_file);

  // --- Section 1: Symbols in <file> ---
  const sorted = [...fileNodes].sort((a, b) => {
    const la = parseLocation(a.source_location);
    const lb = parseLocation(b.source_location);
    if (la !== lb) return la - lb;
    return a.label.localeCompare(b.label);
  });

  const lines: string[] = [];
  lines.push(`## Symbols in ${resolved}`);
  lines.push("");
  if (sorted.length === 0) {
    lines.push("  (no symbols)");
  } else {
    for (const n of sorted) {
      const exp = n.exported ? "exported" : "internal";
      lines.push(`  ${n.label.padEnd(32)} ${n.kind.padEnd(12)} ${exp.padEnd(10)} ${n.source_location}`);
    }
  }
  lines.push("");

  // --- Section 2: Cross-file neighbors ---
  lines.push("## Cross-file neighbors");
  lines.push("");
  lines.push(
    "Note: 'calls' edges are intra-file only in the current extractor — cross-file",
  );
  lines.push("neighbors here are driven mainly by 'imports' edges.");
  lines.push("");

  const outgoing: GraphEdge[] = [];
  const incoming: GraphEdge[] = [];

  for (const e of snap.links) {
    const srcIn = fileNodeIds.has(e.source);
    const tgtIn = fileNodeIds.has(e.target);
    if (srcIn === tgtIn) continue; // both in this file, or neither — not a cross-file edge
    if (srcIn) {
      // Outgoing: count only when the target is a REAL node in ANOTHER file.
      // An unresolved target (not in nodes[]) or a same-file target is not a
      // cross-file neighbor.
      const tgtFile = fileOf.get(e.target);
      if (tgtFile !== undefined && tgtFile !== resolved) outgoing.push(e);
    } else {
      const srcFile = fileOf.get(e.source);
      if (srcFile !== undefined && srcFile !== resolved) incoming.push(e);
    }
  }

  renderDirectionGroup(lines, outgoing, "Outgoing", "source");
  renderDirectionGroup(lines, incoming, "Incoming", "target");

  return lines.join("\n");
}

function renderDirectionGroup(
  lines: string[],
  edges: GraphEdge[],
  label: "Outgoing" | "Incoming",
  selfField: "source" | "target",
): void {
  const otherField: "source" | "target" = selfField === "source" ? "target" : "source";

  // Group by relation → deduplicate by other_node_id (multigraph counts)
  const byRelation = new Map<string, Map<string, number>>();
  for (const e of edges) {
    const otherId = e[otherField];
    const rel = e.relation;
    let nodeMap = byRelation.get(rel);
    if (!nodeMap) { nodeMap = new Map(); byRelation.set(rel, nodeMap); }
    nodeMap.set(otherId, (nodeMap.get(otherId) ?? 0) + 1);
  }

  if (byRelation.size === 0) {
    lines.push(`${label}: (none)`);
    lines.push("");
    return;
  }

  lines.push(`${label}:`);
  let totalShown = 0;
  const sortedRels = [...byRelation.entries()].sort(([a], [b]) => a.localeCompare(b));

  for (const [rel, nodeMap] of sortedRels) {
    const entries = [...nodeMap.entries()].sort(([a], [b]) => a.localeCompare(b));
    lines.push(`  ${rel} (${entries.length}):`);
    let shownInRel = 0;
    for (const [otherId, cnt] of entries) {
      if (totalShown >= CAP) break;
      const suffix = cnt > 1 ? ` ×${cnt}` : "";
      lines.push(`    ${otherId}${suffix}`);
      shownInRel++;
      totalShown++;
    }
    const remaining = entries.length - shownInRel;
    if (remaining > 0) lines.push(`    ... and ${remaining} more`);
  }
  if (totalShown >= CAP) {
    const total = [...byRelation.values()].reduce((s, m) => s + m.size, 0);
    if (total > CAP) lines.push(`  ... and ${total - CAP} more`);
  }
  lines.push("");
}

function parseLocation(loc: string): number {
  const m = loc.match(/^L(\d+)/);
  return m ? parseInt(m[1]!, 10) : 0;
}
