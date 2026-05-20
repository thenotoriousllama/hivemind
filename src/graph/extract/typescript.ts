/**
 * TypeScript / TSX extractor for Phase 1 of the codebase-graph feature.
 *
 * Walks a tree-sitter AST and emits:
 *   - Declaration nodes: function, class, method, interface, type_alias, enum, const, module
 *   - Edges: imports (file → external), method_of (class → method), extends, implements,
 *           calls (intra-file: function/method → function/method in the same file)
 *
 * Out of scope for Phase 1 (deferred to Phase 1.5):
 *   - Cross-file call resolution (we know an `imports` edge exists but don't follow it
 *     to resolve a `call_expression` to a node in another file)
 *   - Dynamic / reflective dispatch
 *   - JSX element references in TSX (we parse TSX but only extract the TS-shaped subset)
 *
 * Determinism: emits nodes/edges in source order. Global sorting for canonical
 * SHA256 hashing happens in snapshot.ts so per-file output stays cheap to diff.
 */

import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

import type {
  FileExtraction,
  GraphEdge,
  GraphNode,
  NodeKind,
  ParseError,
} from "../types.js";

/**
 * Minimal subset of the tree-sitter Node interface we rely on. The npm package
 * doesn't ship robust TypeScript types, so we declare what we need rather than
 * importing `any`.
 */
interface TSNode {
  type: string;
  text: string;
  startPosition: { row: number; column: number };
  endPosition: { row: number; column: number };
  isError: boolean;
  isMissing: boolean;
  hasError: boolean;
  namedChildCount: number;
  parent: TSNode | null;
  namedChild(index: number): TSNode | null;
  namedChildren: TSNode[];
  childForFieldName(name: string): TSNode | null;
}

// Singleton parser per language. tree-sitter Parser is stateless across .parse() calls
// once the language is set, so reusing it is safe and saves the language-load cost.
//
// Native memory: in tree-sitter 0.21+, Tree objects do NOT expose a `.delete()` method;
// native memory is reclaimed when the JS Tree wrapper is garbage-collected. We never
// retain the Tree past the extractTypeScript() return, and FileExtraction holds only
// plain strings (no Node references), so GC reclaims after each call without help.
let _typescriptParser: Parser | null = null;

function getTypescriptParser(): Parser {
  if (_typescriptParser === null) {
    _typescriptParser = new Parser();
    _typescriptParser.setLanguage(TypeScript.typescript);
  }
  return _typescriptParser;
}

/**
 * Extract a single TypeScript file into its FileExtraction.
 *
 * @param sourceCode  raw file contents (UTF-8)
 * @param relativePath  path relative to the repo root, forward slashes, no leading slash
 */
export function extractTypeScript(
  sourceCode: string,
  relativePath: string,
): FileExtraction {
  const parser = getTypescriptParser();
  const tree = parser.parse(sourceCode) as { rootNode: TSNode };
  const root = tree.rootNode;

  const result: FileExtraction = {
    source_file: relativePath,
    language: "typescript",
    nodes: [],
    edges: [],
    parse_errors: [],
  };

  collectParseErrors(root, relativePath, result.parse_errors);

  // Synthetic per-file module node — the "container" for top-level declarations
  // and the source of all `imports` edges. Useful so consumers can ask "which
  // module does this symbol live in" without re-parsing the source_file path.
  const moduleNode = makeModuleNode(relativePath);
  result.nodes.push(moduleNode);

  // Pass 1: collect declarations (top-level + class members). The map lets
  // pass 3 (calls) resolve callees to declarations in the same file.
  const declByName = new Map<string, GraphNode>();
  extractDeclarations(root, relativePath, result, declByName, moduleNode);

  // Pass 2: imports — single statement per `import_statement` regardless of
  // how many specifiers it brings in. Specifier-level edges are Phase 1.5.
  extractImports(root, relativePath, result, moduleNode);

  // Pass 3: intra-file calls. Walks every call_expression, looks up the
  // enclosing function/method, looks up the callee by simple-identifier name
  // in declByName. Skips when caller or callee is unresolved (Phase 1.5).
  extractCalls(root, relativePath, result, declByName);

  return result;
}

// ─── Parse errors ──────────────────────────────────────────────────────────

function collectParseErrors(
  node: TSNode,
  relativePath: string,
  out: ParseError[],
): void {
  if (node.isError || node.isMissing) {
    out.push({
      source_file: relativePath,
      message: node.isMissing
        ? `missing node: ${node.type}`
        : `parse error at ${locationStr(node)}`,
      location: locationStr(node),
    });
    return; // Don't recurse into a broken subtree; its children are unreliable.
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null) collectParseErrors(child, relativePath, out);
  }
}

// ─── Pass 1: Declarations ──────────────────────────────────────────────────

function extractDeclarations(
  node: TSNode,
  relativePath: string,
  result: FileExtraction,
  declByName: Map<string, GraphNode>,
  moduleNode: GraphNode,
): void {
  // Walk recursively; recognize specific declaration types.
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child === null) continue;

    // Some declarations wrap in `export_statement` — unwrap to find the real
    // declaration and remember exported=true. Other places (interface members,
    // class methods) are reached by recursing into bodies.
    const { decl, exported } = unwrapExport(child);
    if (decl !== null) {
      handleDeclaration(decl, exported, relativePath, result, declByName, moduleNode);
    }

    // Recurse into namespaces/modules/blocks that may contain more declarations.
    // class_body is handled inside handleDeclaration for class declarations.
    if (child.type === "internal_module" || child.type === "module") {
      extractDeclarations(child, relativePath, result, declByName, moduleNode);
    }
  }
}

function unwrapExport(node: TSNode): { decl: TSNode | null; exported: boolean } {
  if (node.type === "export_statement") {
    // export_statement → declaration
    const decl = node.childForFieldName("declaration") ?? firstNamedChildOfTypes(node, [
      "function_declaration",
      "class_declaration",
      "interface_declaration",
      "type_alias_declaration",
      "enum_declaration",
      "lexical_declaration",
    ]);
    return { decl, exported: true };
  }
  return { decl: node, exported: false };
}

function handleDeclaration(
  node: TSNode,
  exported: boolean,
  relativePath: string,
  result: FileExtraction,
  declByName: Map<string, GraphNode>,
  moduleNode: GraphNode,
): void {
  switch (node.type) {
    case "function_declaration": {
      const name = textOfField(node, "name");
      if (name === null) return;
      const decl = makeNode(relativePath, name, "function", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "class_declaration": {
      const name = textOfField(node, "name");
      if (name === null) return;
      const classNode = makeNode(relativePath, name, "class", node, exported);
      pushNode(result, declByName, classNode);

      // Heritage: extends + implements
      const heritage = firstNamedChildOfTypes(node, ["class_heritage"]);
      if (heritage !== null) {
        for (let i = 0; i < heritage.namedChildCount; i++) {
          const clause = heritage.namedChild(i);
          if (clause === null) continue;
          const relation = clause.type === "extends_clause"
            ? "extends"
            : clause.type === "implements_clause"
              ? "implements"
              : null;
          if (relation === null) continue;
          for (let j = 0; j < clause.namedChildCount; j++) {
            const base = clause.namedChild(j);
            if (base === null) continue;
            // type_identifier for `extends Base`, identifier for `extends Base.Inner`
            // For Phase 1, only single-identifier base classes get resolved edges
            const baseName = base.text;
            if (baseName.length === 0) continue;
            result.edges.push({
              source: classNode.id,
              target: nodeIdUnresolved(relativePath, baseName, relation === "extends" ? "class" : "interface"),
              relation,
              confidence: "EXTRACTED",
            });
          }
        }
      }

      // Methods: walk class_body
      const body = firstNamedChildOfTypes(node, ["class_body"]);
      if (body !== null) {
        for (let i = 0; i < body.namedChildCount; i++) {
          const member = body.namedChild(i);
          if (member === null) continue;
          if (member.type === "method_definition") {
            const methodName = textOfField(member, "name");
            if (methodName === null) continue;
            // Exported reachability: only public methods of an exported class are
            // truly externally reachable. Private/protected methods may exist on an
            // exported class but are not part of its external API. TS default is
            // public when no modifier is present. ECMAScript hard-private methods
            // (`#name`) carry no accessibility_modifier but ARE always private —
            // tree-sitter reports them as a `private_property_identifier` name child.
            const accessibility = firstNamedChildOfTypes(member, ["accessibility_modifier"]);
            const isHardPrivate = firstNamedChildOfTypes(member, ["private_property_identifier"]) !== null;
            const isPublic = !isHardPrivate && (accessibility === null || accessibility.text === "public");
            const methodExported = exported && isPublic;
            const methodKey = `${classNode.label}.${methodName}`;
            const methodNode = makeNodeWithExplicitLabel(
              relativePath,
              methodKey,
              methodName,
              "method",
              member,
              methodExported,
            );
            pushNode(result, declByName, methodNode, methodKey);
            result.edges.push({
              source: classNode.id,
              target: methodNode.id,
              relation: "method_of",
              confidence: "EXTRACTED",
            });
          }
        }
      }
      return;
    }
    case "interface_declaration": {
      const name = textOfField(node, "name");
      if (name === null) return;
      const decl = makeNode(relativePath, name, "interface", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "type_alias_declaration": {
      const name = textOfField(node, "name");
      if (name === null) return;
      const decl = makeNode(relativePath, name, "type_alias", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "enum_declaration": {
      const name = textOfField(node, "name");
      if (name === null) return;
      const decl = makeNode(relativePath, name, "enum", node, exported);
      pushNode(result, declByName, decl);
      return;
    }
    case "lexical_declaration": {
      // const / let — one declarator per binding. We emit each declarator as a
      // separate const node (Phase 1 doesn't distinguish const vs let).
      for (let i = 0; i < node.namedChildCount; i++) {
        const declarator = node.namedChild(i);
        if (declarator === null || declarator.type !== "variable_declarator") continue;
        const ident = declarator.childForFieldName("name");
        if (ident === null || ident.type !== "identifier") continue; // skip destructured bindings in Phase 1
        const decl = makeNode(relativePath, ident.text, "const", declarator, exported);
        pushNode(result, declByName, decl);
      }
      return;
    }
    // Other declaration shapes (variable_statement, namespace, ambient declare …) are
    // not emitted in Phase 1. Add them in 1.5+ as needed.
  }
}

// ─── Pass 2: Imports ───────────────────────────────────────────────────────

function extractImports(
  node: TSNode,
  relativePath: string,
  result: FileExtraction,
  moduleNode: GraphNode,
): void {
  if (node.type === "import_statement") {
    const src = firstNamedChildOfTypes(node, ["string"]);
    if (src !== null) {
      const frag = firstNamedChildOfTypes(src, ["string_fragment"]);
      const specifier = (frag !== null ? frag.text : src.text).replace(/^['"]|['"]$/g, "");
      if (specifier.length > 0) {
        result.edges.push({
          source: moduleNode.id,
          target: `external:${specifier}`,
          relation: "imports",
          confidence: "EXTRACTED",
        });
      }
    }
    return; // import_statement has no nested declarations we care about
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null) extractImports(child, relativePath, result, moduleNode);
  }
}

// ─── Pass 3: Intra-file calls ──────────────────────────────────────────────

function extractCalls(
  node: TSNode,
  relativePath: string,
  result: FileExtraction,
  declByName: Map<string, GraphNode>,
): void {
  if (node.type === "call_expression") {
    const callee = node.childForFieldName("function");
    if (callee !== null) {
      const calleeKey = resolveCalleeKey(callee, declByName);
      if (calleeKey !== null) {
        const targetNode = declByName.get(calleeKey);
        if (targetNode !== undefined) {
          const callerNode = findEnclosingDeclaration(node, declByName);
          if (callerNode !== null) {
            // Self-recursion is a valid edge: `function topLevel(a) { return topLevel(a-1); }`
            // emits topLevel --calls--> topLevel. The graph is a multigraph so even repeated
            // calls between the same caller/callee remain distinct via `ord` if we ever need it.
            result.edges.push({
              source: callerNode.id,
              target: targetNode.id,
              relation: "calls",
              confidence: "EXTRACTED",
            });
          }
        }
      }
    }
  }
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null) extractCalls(child, relativePath, result, declByName);
  }
}

/**
 * Resolves the callee of a call_expression to the declByName key (if any) where
 * Pass 1 stored the matching declaration. Returns null when the callee is not a
 * simple identifier or `this.X` we can resolve in this file.
 *
 * Resolution rules (Phase 1):
 *   foo(...)        → "foo"            (top-level function or const)
 *   this.foo(...)   → "<EnclosingClass>.foo" (method on the same class)
 *   obj.foo(...)    → null                   (cross-instance dispatch; Phase 1.5)
 *   x.y.foo(...)    → null                   (chained access; Phase 1.5)
 */
function resolveCalleeKey(callee: TSNode, declByName: Map<string, GraphNode>): string | null {
  if (callee.type === "identifier") return callee.text;
  if (callee.type === "member_expression") {
    const object = callee.childForFieldName("object");
    const property = callee.childForFieldName("property");
    if (object !== null && object.type === "this" && property !== null && property.type === "property_identifier") {
      const className = findEnclosingClassName(callee);
      if (className !== null) return `${className}.${property.text}`;
    }
  }
  return null;
}

/** Walks up the AST from `node` until it hits a declaration we recognize, then returns that declaration's GraphNode. */
function findEnclosingDeclaration(
  node: TSNode,
  declByName: Map<string, GraphNode>,
): GraphNode | null {
  let cur: TSNode | null = node.parent;
  while (cur !== null) {
    if (cur.type === "function_declaration") {
      const name = textOfField(cur, "name");
      if (name !== null) {
        const n = declByName.get(name);
        if (n !== undefined) return n;
      }
    } else if (cur.type === "method_definition") {
      const methodName = textOfField(cur, "name");
      const className = findEnclosingClassName(cur);
      if (methodName !== null && className !== null) {
        const n = declByName.get(`${className}.${methodName}`);
        if (n !== undefined) return n;
      }
    } else if (cur.type === "variable_declarator") {
      // const foo = () => { ... } or `const a = () => x(), b = () => y();`
      // We walk to the NEAREST declarator (not the lexical_declaration that
      // contains multiple declarators) so calls inside `b` resolve to `b`,
      // not the first declarator.
      const ident = cur.childForFieldName("name");
      if (ident !== null && ident.type === "identifier") {
        const n = declByName.get(ident.text);
        if (n !== undefined) return n;
      }
    }
    cur = cur.parent;
  }
  return null;
}

function findEnclosingClassName(node: TSNode): string | null {
  let cur: TSNode | null = node.parent;
  while (cur !== null) {
    if (cur.type === "class_declaration") {
      return textOfField(cur, "name");
    }
    cur = cur.parent;
  }
  return null;
}

// ─── Helpers: node construction, location, ID composition ──────────────────

function makeModuleNode(relativePath: string): GraphNode {
  return {
    id: `${relativePath}::module`,
    label: relativePath,
    kind: "module",
    source_file: relativePath,
    source_location: "L1",
    language: "typescript",
    exported: false,
  };
}

function makeNode(
  relativePath: string,
  name: string,
  kind: NodeKind,
  node: TSNode,
  exported: boolean,
): GraphNode {
  return {
    id: nodeId(relativePath, name, kind),
    label: name,
    kind,
    source_file: relativePath,
    source_location: locationStr(node),
    language: "typescript",
    exported,
  };
}

function makeNodeWithExplicitLabel(
  relativePath: string,
  idName: string,
  label: string,
  kind: NodeKind,
  node: TSNode,
  exported: boolean,
): GraphNode {
  return {
    id: nodeId(relativePath, idName, kind),
    label,
    kind,
    source_file: relativePath,
    source_location: locationStr(node),
    language: "typescript",
    exported,
  };
}

/**
 * Add `node` to the FileExtraction and register it in `declByName` under
 * `lookupKey` so Pass 3 (calls) can resolve callees to it.
 *
 * Caller passes the exact key the resolver will use:
 *   - top-level functions/classes/etc.: pass `node.label` (the symbol name)
 *   - methods: pass `<ClassName>.<methodName>` so `this.foo` lookup hits
 * Passing the key explicitly avoids re-parsing the node ID with split().
 */
function pushNode(
  result: FileExtraction,
  declByName: Map<string, GraphNode>,
  node: GraphNode,
  lookupKey?: string,
): void {
  result.nodes.push(node);
  declByName.set(lookupKey ?? node.label, node);
}

function nodeId(relativePath: string, name: string, kind: NodeKind): string {
  return `${relativePath}:${name}:${kind}`;
}

function nodeIdUnresolved(relativePath: string, name: string, kind: NodeKind): string {
  // Scoped to the referring file: two files extending different `Base` classes
  // must NOT collapse to the same target string during snapshot aggregation
  // (NetworkX consumers would materialize one shared phantom node). Including
  // relativePath makes the unresolved target per-file; Phase 1.5 resolves them
  // and replaces with real cross-file IDs.
  return `unresolved:${relativePath}:${name}:${kind}`;
}

function locationStr(node: TSNode): string {
  const start = node.startPosition.row + 1;
  const end = node.endPosition.row + 1;
  return start === end ? `L${start}` : `L${start}-${end}`;
}

function textOfField(node: TSNode, fieldName: string): string | null {
  const child = node.childForFieldName(fieldName);
  if (child === null) return null;
  const text = child.text;
  return text.length > 0 ? text : null;
}

function firstNamedChildOfTypes(node: TSNode, types: string[]): TSNode | null {
  for (let i = 0; i < node.namedChildCount; i++) {
    const child = node.namedChild(i);
    if (child !== null && types.includes(child.type)) return child;
  }
  return null;
}
