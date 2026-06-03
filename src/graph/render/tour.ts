/**
 * Deterministic, dependency-ordered walkthrough renderer.
 *
 * Convention: an edge source→target means "source depends on target"
 * (source imports/calls/extends/implements target, or is a method_of target's class).
 * Kahn's algorithm runs on the REVERSED graph so dependencies (targets) appear
 * before their dependents (sources) — a bottom-up traversal.
 */

import type { GraphSnapshot, GraphNode } from "../types.js";

/** Line budget before emitting "... and N more". */
const LINE_CAP = 60;

export function renderTour(snap: GraphSnapshot): string {
  if (snap.nodes.length === 0) {
    return "Graph is empty — no nodes to tour.";
  }

  const nodeMap = new Map<string, GraphNode>();
  for (const n of snap.nodes) nodeMap.set(n.id, n);

  // ── Original in-degree (for entry point detection) ─────────────────────
  // inDegOrig[X] = number of graph nodes that point at X (i.e. depend on X).
  const inDegOrig = new Map<string, number>();
  for (const n of snap.nodes) inDegOrig.set(n.id, 0);
  for (const e of snap.links) {
    // Only count incoming edges whose SOURCE is a real node — an edge from an
    // unresolved id (not in nodes[]) means nothing in THIS graph depends on
    // the target, so it must not suppress the target's entry-point status.
    // This also keeps inDegOrig consistent with the Kahn graph below, which
    // skips edges with an unresolved endpoint (codex review).
    if (nodeMap.has(e.source) && nodeMap.has(e.target)) {
      inDegOrig.set(e.target, (inDegOrig.get(e.target) ?? 0) + 1);
    }
  }

  // ── Entry points ────────────────────────────────────────────────────────
  // Exported nodes with no incoming edges: nothing else in this graph depends
  // on them from the "outside" — they are the public API / program roots.
  const entryPoints = snap.nodes
    .filter((n) => n.exported && inDegOrig.get(n.id) === 0)
    .sort((a, b) => a.id.localeCompare(b.id));
  const entrySet = new Set(entryPoints.map((n) => n.id));

  // ── Reversed adjacency for Kahn's ──────────────────────────────────────
  // For each original edge source→target, add reversed edge target→source.
  // inDegRev[node] = number of original outgoing edges from node
  //                = how many things node itself depends on.
  // Nodes with inDegRev=0 have no outgoing original edges (pure dependencies
  // that nothing needs resolved before them) and are processed first.
  const revAdj = new Map<string, string[]>();
  const inDegRev = new Map<string, number>();
  for (const n of snap.nodes) {
    revAdj.set(n.id, []);
    inDegRev.set(n.id, 0);
  }
  for (const e of snap.links) {
    if (!nodeMap.has(e.source) || !nodeMap.has(e.target)) continue;
    revAdj.get(e.target)!.push(e.source);
    inDegRev.set(e.source, (inDegRev.get(e.source) ?? 0) + 1);
  }

  // ── Kahn's algorithm (stable: ties broken by node id) ──────────────────
  const queue: string[] = [];
  for (const n of snap.nodes) {
    if (inDegRev.get(n.id) === 0) queue.push(n.id);
  }
  queue.sort();

  const topoOrder: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    topoOrder.push(id);
    const newReady: string[] = [];
    for (const dep of revAdj.get(id) ?? []) {
      const d = (inDegRev.get(dep) ?? 0) - 1;
      inDegRev.set(dep, d);
      if (d === 0) newReady.push(dep);
    }
    if (newReady.length > 0) {
      for (const x of newReady) queue.push(x);
      queue.sort();
    }
  }

  // ── Cyclic / remaining ─────────────────────────────────────────────────
  const topoSet = new Set(topoOrder);
  const cyclic = snap.nodes
    .filter((n) => !topoSet.has(n.id))
    .sort((a, b) => a.id.localeCompare(b.id));

  // Walkthrough = topo-ordered nodes that are not entry points
  const walkthrough = topoOrder.filter((id) => !entrySet.has(id));

  // ── Render ─────────────────────────────────────────────────────────────
  const totalNodes = snap.nodes.length;
  const lines: string[] = [];

  lines.push(`# Code Graph Tour — ${totalNodes} node${totalNodes !== 1 ? "s" : ""}`);
  lines.push("");

  // Section 1: Entry points
  lines.push(`## Entry points (${entryPoints.length})`);
  if (entryPoints.length === 0) {
    lines.push("  (none — all exported nodes have at least one incoming edge)");
  } else {
    lines.push("  Exported symbols with no incoming edges — likely top-level public API.");
    lines.push("");
    for (let i = 0; i < entryPoints.length; i++) {
      if (lines.length >= LINE_CAP) {
        lines.push(`  ... and ${entryPoints.length - i} more`);
        break;
      }
      lines.push(`  ${i + 1}. ${entryPoints[i]!.id}  [${entryPoints[i]!.kind}]`);
    }
  }
  lines.push("");

  // Section 2: Walkthrough in dependency order
  lines.push(`## Walkthrough — dependency order (${walkthrough.length})`);
  if (walkthrough.length === 0) {
    lines.push("  (all non-entry nodes are cyclic)");
  } else {
    lines.push("  Dependencies before dependents (bottom-up).");
    lines.push("");
    for (let i = 0; i < walkthrough.length; i++) {
      if (lines.length >= LINE_CAP) {
        lines.push(`  ... and ${walkthrough.length - i} more`);
        break;
      }
      const n = nodeMap.get(walkthrough[i]!)!;
      lines.push(`  ${i + 1}. ${n.id}  [${n.kind}]`);
    }
  }
  lines.push("");

  // Section 3: Cyclic / remaining (always shown if non-empty so no nodes are lost)
  if (cyclic.length > 0) {
    lines.push(`## Cyclic / remaining (${cyclic.length})`);
    lines.push("  These nodes form cycles and were not reached by topological sort.");
    lines.push("");
    for (let i = 0; i < cyclic.length; i++) {
      if (lines.length >= LINE_CAP) {
        lines.push(`  ... and ${cyclic.length - i} more`);
        break;
      }
      lines.push(`  ${i + 1}. ${cyclic[i]!.id}  [${cyclic[i]!.kind}]`);
    }
    lines.push("");
  }

  // Summary — true totals regardless of any line-cap truncation above
  lines.push(
    `Total: ${entryPoints.length} entry + ${walkthrough.length} walkthrough` +
      (cyclic.length > 0 ? ` + ${cyclic.length} cyclic` : "") +
      ` = ${totalNodes} nodes`,
  );

  return lines.join("\n");
}
