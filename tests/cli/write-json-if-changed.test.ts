import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, readFileSync, existsSync, statSync, utimesSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeJsonIfChanged } from "../../src/cli/util.js";

/**
 * writeJsonIfChanged underpins the "don't re-trigger Codex's hook-trust
 * prompt" fix: it must NOT touch the file when the serialized JSON already
 * matches on disk (a no-op write changes the file Codex fingerprints).
 *
 * Failure-before-fix framing (CLAUDE.md rule 12): the old code called
 * writeJson unconditionally, so the file was always rewritten. These assert
 * the file is left untouched when unchanged.
 */
describe("writeJsonIfChanged", () => {
  let dir: string;
  let path: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "wjic-"));
    path = join(dir, "hooks.json");
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("writes (returns true) when the file does not exist", () => {
    expect(writeJsonIfChanged(path, { a: 1 })).toBe(true);
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, "utf-8")).toBe(JSON.stringify({ a: 1 }, null, 2) + "\n");
  });

  it("does NOT write (returns false) when the serialized result already matches", () => {
    writeJsonIfChanged(path, { a: 1, b: [2, 3] });
    // Pin mtime to the past; a real rewrite would bump it to ~now.
    const past = new Date("2020-01-01T00:00:00Z");
    utimesSync(path, past, past);

    expect(writeJsonIfChanged(path, { a: 1, b: [2, 3] })).toBe(false);
    expect(statSync(path).mtimeMs).toBe(past.getTime()); // file untouched
  });

  it("writes (returns true) when the content differs", () => {
    writeJsonIfChanged(path, { a: 1 });
    const past = new Date("2020-01-01T00:00:00Z");
    utimesSync(path, past, past);

    expect(writeJsonIfChanged(path, { a: 2 })).toBe(true);
    expect(statSync(path).mtimeMs).not.toBe(past.getTime());
    expect(JSON.parse(readFileSync(path, "utf-8"))).toEqual({ a: 2 });
  });

  it("uses the same 2-space + trailing-newline format as writeJson (so a writeJson'd file is seen as unchanged)", () => {
    // Simulate a file written by the legacy writeJson, then confirm
    // writeJsonIfChanged treats identical content as a no-op.
    const obj = { hooks: { PostToolUse: [{ command: "x" }] } };
    writeFileSync(path, JSON.stringify(obj, null, 2) + "\n");
    expect(writeJsonIfChanged(path, obj)).toBe(false);
  });
});
