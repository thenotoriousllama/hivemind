import { describe, expect, it } from "vitest";

import { extractTypeScript } from "../../../src/graph/extract/typescript.js";

// ── Helpers ────────────────────────────────────────────────────────────────

function nodeIds(result: ReturnType<typeof extractTypeScript>): string[] {
  return result.nodes.map((n) => n.id);
}

function edgeTuples(
  result: ReturnType<typeof extractTypeScript>,
): Array<[string, string, string]> {
  return result.edges.map((e) => [e.source, e.target, e.relation]);
}

function findNode(
  result: ReturnType<typeof extractTypeScript>,
  predicate: (n: { id: string; label: string; kind: string }) => boolean,
) {
  return result.nodes.find(predicate);
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("extractTypeScript — module node", () => {
  it("always emits a synthetic module node for the file", () => {
    const r = extractTypeScript("// empty file\n", "src/empty.ts");
    expect(nodeIds(r)).toContain("src/empty.ts::module");
    const mod = findNode(r, (n) => n.kind === "module");
    expect(mod?.source_file).toBe("src/empty.ts");
    expect(mod?.exported).toBe(false);
  });

  it("empty file yields only the module node and no edges", () => {
    const r = extractTypeScript("", "src/empty.ts");
    expect(r.nodes).toHaveLength(1);
    expect(r.edges).toHaveLength(0);
    expect(r.parse_errors).toHaveLength(0);
  });
});

describe("extractTypeScript — top-level declarations", () => {
  it("emits function, interface, type_alias, enum, const nodes", () => {
    const src = `
function plain() {}
interface IFoo { run(): void }
type Alias = string;
enum Color { RED }
const X = 1;
`;
    const r = extractTypeScript(src, "f.ts");
    const ids = nodeIds(r);
    expect(ids).toContain("f.ts:plain:function");
    expect(ids).toContain("f.ts:IFoo:interface");
    expect(ids).toContain("f.ts:Alias:type_alias");
    expect(ids).toContain("f.ts:Color:enum");
    expect(ids).toContain("f.ts:X:const");
  });

  it("marks top-level decls as exported when wrapped in export_statement", () => {
    const src = `
export function pub() {}
function priv() {}
export const Y = 2;
const Z = 3;
`;
    const r = extractTypeScript(src, "f.ts");
    expect(findNode(r, (n) => n.label === "pub")?.exported).toBe(true);
    expect(findNode(r, (n) => n.label === "priv")?.exported).toBe(false);
    expect(findNode(r, (n) => n.label === "Y")?.exported).toBe(true);
    expect(findNode(r, (n) => n.label === "Z")?.exported).toBe(false);
  });

  it("skips destructured const bindings in Phase 1", () => {
    const src = `const { a, b } = obj; const [c] = arr; const ok = 1;`;
    const r = extractTypeScript(src, "f.ts");
    expect(nodeIds(r).filter((id) => id.endsWith(":const"))).toEqual(["f.ts:ok:const"]);
  });
});

describe("extractTypeScript — classes and methods", () => {
  it("emits class + method nodes + method_of edges", () => {
    const src = `
class C {
  m1() {}
  m2() {}
}
`;
    const r = extractTypeScript(src, "c.ts");
    const ids = nodeIds(r);
    expect(ids).toContain("c.ts:C:class");
    expect(ids).toContain("c.ts:C.m1:method");
    expect(ids).toContain("c.ts:C.m2:method");
    const methodOfs = r.edges.filter((e) => e.relation === "method_of");
    expect(methodOfs).toHaveLength(2);
    for (const e of methodOfs) {
      expect(e.source).toBe("c.ts:C:class");
      expect(e.target).toMatch(/^c\.ts:C\.m[12]:method$/);
    }
  });

  it("emits extends + implements edges with file-scoped unresolved targets", () => {
    const src = `class C extends Base implements IFoo {}`;
    const r = extractTypeScript(src, "c.ts");
    const tuples = edgeTuples(r);
    expect(tuples).toContainEqual([
      "c.ts:C:class",
      "unresolved:c.ts:Base:class",
      "extends",
    ]);
    expect(tuples).toContainEqual([
      "c.ts:C:class",
      "unresolved:c.ts:IFoo:interface",
      "implements",
    ]);
  });

  it("two files extending the same Base do NOT collide on unresolved id", () => {
    const a = extractTypeScript(`class A extends Base {}`, "src/a.ts");
    const b = extractTypeScript(`class B extends Base {}`, "src/b.ts");
    const aTarget = a.edges.find((e) => e.relation === "extends")?.target;
    const bTarget = b.edges.find((e) => e.relation === "extends")?.target;
    expect(aTarget).toBe("unresolved:src/a.ts:Base:class");
    expect(bTarget).toBe("unresolved:src/b.ts:Base:class");
    expect(aTarget).not.toBe(bTarget);
  });

  describe("method visibility (codex P1 fix)", () => {
    it("public method on exported class is exported", () => {
      const r = extractTypeScript(`export class C { pub() {} }`, "f.ts");
      expect(findNode(r, (n) => n.label === "pub")?.exported).toBe(true);
    });
    it("private method on exported class is NOT exported", () => {
      const r = extractTypeScript(`export class C { private h() {} }`, "f.ts");
      expect(findNode(r, (n) => n.label === "h")?.exported).toBe(false);
    });
    it("protected method on exported class is NOT exported", () => {
      const r = extractTypeScript(`export class C { protected h() {} }`, "f.ts");
      expect(findNode(r, (n) => n.label === "h")?.exported).toBe(false);
    });
    it("methods on non-exported class are all non-exported", () => {
      const r = extractTypeScript(`class C { pub() {} private h() {} }`, "f.ts");
      expect(findNode(r, (n) => n.label === "pub")?.exported).toBe(false);
      expect(findNode(r, (n) => n.label === "h")?.exported).toBe(false);
    });
    it("ECMAScript #private method on exported class is NOT exported (codex P1 fix)", () => {
      // tree-sitter represents `#h()` as a method_definition whose name field
      // is a private_property_identifier (no accessibility_modifier child).
      // The visibility detection must treat the hash-prefixed identifier as
      // always-private, otherwise it leaks past the accessibility check.
      const r = extractTypeScript(`export class C { #h() {} }`, "f.ts");
      expect(findNode(r, (n) => n.label === "#h")?.exported).toBe(false);
    });
  });
});

describe("extractTypeScript — imports", () => {
  it("emits an imports edge per import_statement keyed by module specifier", () => {
    const src = `
import { x } from "./a";
import y from "./b";
import "./side-effect";
import * as z from "z-pkg";
`;
    const r = extractTypeScript(src, "src/main.ts");
    const importTargets = r.edges
      .filter((e) => e.relation === "imports")
      .map((e) => e.target)
      .sort();
    expect(importTargets).toEqual([
      "external:./a",
      "external:./b",
      "external:./side-effect",
      "external:z-pkg",
    ]);
    // source is always the module node
    for (const e of r.edges.filter((x) => x.relation === "imports")) {
      expect(e.source).toBe("src/main.ts::module");
    }
  });
});

describe("extractTypeScript — intra-file call resolution", () => {
  it("resolves free function calls within the same file", () => {
    const src = `
function a() { b(); }
function b() {}
`;
    const r = extractTypeScript(src, "f.ts");
    expect(edgeTuples(r)).toContainEqual([
      "f.ts:a:function",
      "f.ts:b:function",
      "calls",
    ]);
  });

  it("emits self-recursion as a valid calls edge", () => {
    const src = `function r() { return r(); }`;
    const r = extractTypeScript(src, "f.ts");
    const calls = r.edges.filter((e) => e.relation === "calls");
    expect(calls).toHaveLength(1);
    expect(calls[0]).toMatchObject({
      source: "f.ts:r:function",
      target: "f.ts:r:function",
    });
  });

  it("resolves this.method() to <EnclosingClass>.method on the same class", () => {
    const src = `
class C {
  outer() { this.inner(); }
  inner() {}
}
`;
    const r = extractTypeScript(src, "c.ts");
    expect(edgeTuples(r)).toContainEqual([
      "c.ts:C.outer:method",
      "c.ts:C.inner:method",
      "calls",
    ]);
  });

  it("multi-declarator const: each declarator owns its own call edges (codex P1 fix)", () => {
    const src = `
function x() {}
function y() {}
const a = () => x(), b = () => y();
`;
    const r = extractTypeScript(src, "f.ts");
    const calls = edgeTuples(r).filter(([, , rel]) => rel === "calls");
    // Critical assertion: BOTH declarators have distinct callers; the bug was
    // both calls being attributed to the first declarator ("a").
    expect(calls).toContainEqual(["f.ts:a:const", "f.ts:x:function", "calls"]);
    expect(calls).toContainEqual(["f.ts:b:const", "f.ts:y:function", "calls"]);
    expect(calls).not.toContainEqual(["f.ts:a:const", "f.ts:y:function", "calls"]);
  });

  it("does not emit calls for unresolved callees (imported symbols)", () => {
    const src = `
import { ext } from "./elsewhere";
function caller() { ext(); }
`;
    const r = extractTypeScript(src, "f.ts");
    expect(r.edges.filter((e) => e.relation === "calls")).toHaveLength(0);
  });

  it("does not resolve obj.method() across instances in Phase 1", () => {
    const src = `
class C { m() {} }
function f(c: C) { c.m(); }
`;
    const r = extractTypeScript(src, "f.ts");
    expect(r.edges.filter((e) => e.relation === "calls")).toHaveLength(0);
  });
});

describe("extractTypeScript — determinism", () => {
  it("re-running the extractor on the same source produces identical nodes + edges", () => {
    const src = `
import { a } from "./a";
export class C extends Base { m() { this.m(); } }
function f() { return f(); }
const x = () => f();
`;
    const r1 = extractTypeScript(src, "f.ts");
    const r2 = extractTypeScript(src, "f.ts");
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });
});

describe("extractTypeScript — parse errors", () => {
  it("reports an error and recovers around it", () => {
    const src = `
function ok() {}
function broken( {
  // missing close paren above
function alsoOk() {}
`;
    const r = extractTypeScript(src, "f.ts");
    expect(r.parse_errors.length).toBeGreaterThan(0);
    // ok() should still extract even though the file has a parse error elsewhere
    expect(nodeIds(r)).toContain("f.ts:ok:function");
  });
});
