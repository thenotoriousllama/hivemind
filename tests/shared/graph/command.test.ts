import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runGraphCommand } from "../../../src/commands/graph.js";

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Run a chunk of work with stdout/stderr/console captured. Restores everything
 * even if the work throws. Used to assert CLI output without polluting the
 * actual test runner output.
 */
function captureOutput<T>(work: () => T): { result: T; out: string; err: string } {
  const out: string[] = [];
  const err: string[] = [];
  const logSpy = vi.spyOn(console, "log").mockImplementation((...args) => {
    out.push(args.map(String).join(" "));
  });
  const warnSpy = vi.spyOn(console, "warn").mockImplementation((...args) => {
    err.push(args.map(String).join(" "));
  });
  const errSpy = vi.spyOn(console, "error").mockImplementation((...args) => {
    err.push(args.map(String).join(" "));
  });
  try {
    const result = work();
    return { result, out: out.join("\n"), err: err.join("\n") };
  } finally {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errSpy.mockRestore();
  }
}

/** Init a real (tiny) git repo with one commit so readGitCommit/Branch return something. */
function initTinyGitRepo(dir: string, files: Record<string, string>): string {
  execSync("git init -q -b main", { cwd: dir });
  execSync('git config user.email "test@example.com"', { cwd: dir });
  execSync('git config user.name "Test"', { cwd: dir });
  // Set a fake origin so deriveProjectKey hashes a stable URL instead of cwd.
  execSync("git remote add origin https://example.com/test-repo.git", { cwd: dir });
  for (const [name, content] of Object.entries(files)) {
    const p = join(dir, name);
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, content);
  }
  execSync("git add .", { cwd: dir });
  execSync('git commit -q -m "init"', { cwd: dir });
  return execSync("git rev-parse HEAD", { cwd: dir, encoding: "utf8" }).trim();
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe("runGraphCommand — help and dispatch", () => {
  it("prints USAGE when called with no args", () => {
    const { out } = captureOutput(() => runGraphCommand([]));
    expect(out).toContain("hivemind graph");
    expect(out).toContain("build");
  });

  it("prints USAGE on --help / -h / help", () => {
    for (const flag of ["--help", "-h", "help"]) {
      const { out } = captureOutput(() => runGraphCommand([flag]));
      expect(out).toContain("hivemind graph");
    }
  });

  it("exits with code 2 on unknown subcommand", () => {
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
      throw new Error(`exit(${code})`);
    }) as never);
    try {
      const { err } = captureOutput(() => {
        try { runGraphCommand(["bogus"]); } catch { /* swallow forced exit */ }
      });
      expect(err).toContain("unknown subcommand 'bogus'");
      expect(exitSpy).toHaveBeenCalledWith(2);
    } finally {
      exitSpy.mockRestore();
    }
  });
});

describe("runGraphCommand build — end-to-end against a tiny git repo", () => {
  let workDir: string;
  let graphsHome: string;
  const prevGraphsHome = process.env.HIVEMIND_GRAPHS_HOME;

  beforeEach(() => {
    workDir = mkdtempSync(join(tmpdir(), "graph-cmd-work-"));
    graphsHome = mkdtempSync(join(tmpdir(), "graph-cmd-home-"));
    process.env.HIVEMIND_GRAPHS_HOME = graphsHome;
  });

  afterEach(() => {
    if (prevGraphsHome === undefined) delete process.env.HIVEMIND_GRAPHS_HOME;
    else process.env.HIVEMIND_GRAPHS_HOME = prevGraphsHome;
    rmSync(workDir, { recursive: true, force: true });
    rmSync(graphsHome, { recursive: true, force: true });
  });

  it("produces a snapshot file + latest-commit.txt for a small repo", () => {
    const commit = initTinyGitRepo(workDir, {
      "src/a.ts": `export function foo() { return bar(); } function bar() { return 1; }`,
      "src/b.ts": `import { foo } from "./a"; export const x = 42;`,
      "src/c.d.ts": `export type X = number;`, // .d.ts should be skipped
      "node_modules/skip-me/index.ts": `export const skipped = 1;`, // node_modules ignored
    });

    captureOutput(() => runGraphCommand(["build", "--cwd", workDir]));

    // The repo key is derived from the fake origin URL, not from workDir.
    // Read the latest-commit.txt to find which repo dir was written.
    const homes = require("node:fs").readdirSync(graphsHome) as string[];
    expect(homes).toHaveLength(1);
    const repoOutDir = join(graphsHome, homes[0]!);

    const snapshotPath = join(repoOutDir, "snapshots", `${commit}.json`);
    // latest-commit.txt now lives under worktrees/<worktree_id>/ so two
    // checkouts of the same project don't overwrite each other.
    // worktree_id = sha256(cwd).slice(0,16) — see workTreeIdFor in
    // src/commands/graph.ts.
    const worktreeId = require("node:crypto").createHash("sha256").update(workDir).digest("hex").slice(0, 16);
    const latestPath = join(repoOutDir, "worktrees", worktreeId, "latest-commit.txt");
    expect(existsSync(snapshotPath)).toBe(true);
    expect(readFileSync(latestPath, "utf8").trim()).toBe(commit);

    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8"));
    // Nodes from a.ts and b.ts present; c.d.ts and node_modules excluded.
    const ids = new Set(snapshot.nodes.map((n: { id: string }) => n.id));
    expect(ids.has("src/a.ts:foo:function")).toBe(true);
    expect(ids.has("src/a.ts:bar:function")).toBe(true);
    expect(ids.has("src/b.ts:x:const")).toBe(true);
    for (const id of ids) {
      expect(id).not.toMatch(/c\.d\.ts/);
      expect(id).not.toMatch(/node_modules/);
    }

    // observation should reflect the build context
    expect(snapshot.observation.branch).toBe("main");
    expect(snapshot.observation.worktree_path).toBe(workDir);
    expect(snapshot.observation.source_files_extracted).toBeGreaterThan(0);
  });

  it("re-running build on unchanged code produces a bit-identical snapshot", () => {
    initTinyGitRepo(workDir, {
      "src/a.ts": `export function foo() {}`,
    });

    captureOutput(() => runGraphCommand(["build", "--cwd", workDir]));
    const homes = require("node:fs").readdirSync(graphsHome) as string[];
    const repoOutDir = join(graphsHome, homes[0]!);
    const snapshots1 = require("node:fs").readdirSync(join(repoOutDir, "snapshots")) as string[];
    const file = join(repoOutDir, "snapshots", snapshots1[0]!);
    const bytes1 = readFileSync(file, "utf8");

    captureOutput(() => runGraphCommand(["build", "--cwd", workDir]));
    const bytes2 = readFileSync(file, "utf8");

    // The `observation.ts` field differs across runs and IS in the on-disk
    // bytes (only the content-hash excludes it), so the full file differs.
    // What we want is the STABLE part (nodes + links + graph metadata) to
    // match. Easiest assertion: parse both, compare nodes + links + graph.
    const s1 = JSON.parse(bytes1);
    const s2 = JSON.parse(bytes2);
    expect(s2.nodes).toEqual(s1.nodes);
    expect(s2.links).toEqual(s1.links);
    expect(s2.graph).toEqual(s1.graph);
  });
});
