#!/usr/bin/env node

/**
 * CLI surface for the codebase-graph feature (Phase 1).
 *
 * Phase 1 ships ONE subcommand:
 *   hivemind graph build [--cwd <path>]
 *     Walk the project for TypeScript source files, run the tree-sitter
 *     extractor on each, write a snapshot to ~/.hivemind/graphs/<repo-key>/.
 *
 * Later phases add: daemon, diff, history, search, latest, push, pull, init,
 * uninstall, prune. None of those exist yet.
 */

import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { getVersion } from "../cli/version.js";
import { extractTypeScript } from "../graph/extract/typescript.js";
import { buildSnapshot, repoDir, writeSnapshot } from "../graph/snapshot.js";
import type {
  FileExtraction,
  GraphMetadata,
  GraphObservation,
} from "../graph/types.js";
import { deriveProjectKey } from "../utils/repo-identity.js";

const USAGE = `hivemind graph — codebase-graph commands (Phase 1 — TypeScript only)

Usage:
  hivemind graph build [--cwd <path>]
      Walk the project for TypeScript source files, extract symbols + edges,
      and write a snapshot to ~/.hivemind/graphs/<repo-key>/snapshots/<commit-sha>.json.
      Also updates ~/.hivemind/graphs/<repo-key>/latest-commit.txt.

  hivemind graph --help
      Show this message.

  Future subcommands (not in Phase 1): daemon, diff, history, search, latest,
  push, pull, init, uninstall, prune.
`;

/**
 * Directories never walked by the source-file discovery. Conservative defaults
 * for v1; per-project ignore rules land later via a .hivemindignore or config.
 */
const DEFAULT_IGNORES = new Set<string>([
  "node_modules",
  ".git",
  "bundle",
  "dist",
  "coverage",
  ".cache",
  ".nyc_output",
]);

/** Top-level dispatcher: invoked from src/cli/index.ts on `hivemind graph ...`. */
export function runGraphCommand(args: string[]): void {
  const sub = args[0];
  if (sub === undefined || sub === "--help" || sub === "-h" || sub === "help") {
    console.log(USAGE);
    return;
  }
  if (sub === "build") {
    runBuildCommand(args.slice(1));
    return;
  }
  console.error(`hivemind graph: unknown subcommand '${sub}'`);
  console.error(USAGE);
  process.exit(2);
}

interface BuildOptions {
  cwd: string;
}

function parseBuildArgs(args: string[]): BuildOptions {
  let cwd = process.cwd();
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--cwd" && i + 1 < args.length) {
      cwd = args[i + 1]!;
      i += 1;
    } else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`hivemind graph build: unknown argument '${a}'`);
      console.error(USAGE);
      process.exit(2);
    }
  }
  return { cwd };
}

function runBuildCommand(args: string[]): void {
  const opts = parseBuildArgs(args);

  const { key: repoKey, project } = deriveProjectKey(opts.cwd);
  const baseDir = repoDir(repoKey);
  const commitSha = readGitCommit(opts.cwd);
  const branch = readGitBranch(opts.cwd);
  const version = getVersion();

  console.log(`Building codebase graph for ${project}`);
  console.log(`  repo_key:   ${repoKey}`);
  console.log(`  commit_sha: ${commitSha ?? "(not in a git repo)"}`);
  console.log(`  branch:     ${branch ?? "(none / detached)"}`);
  console.log(`  output:     ${baseDir}`);
  console.log("");

  const sourceFiles = discoverSourceFiles(opts.cwd);
  console.log(`Discovered ${sourceFiles.length} TypeScript source files. Extracting...`);

  const extractions: FileExtraction[] = [];
  let skipped = 0;
  let totalParseErrors = 0;
  for (const abs of sourceFiles) {
    const rel = toForwardSlash(relative(opts.cwd, abs));
    try {
      const content = readFileSync(abs, "utf8");
      const extraction = extractTypeScript(content, rel);
      if (extraction.parse_errors.length > 0) {
        totalParseErrors += extraction.parse_errors.length;
        for (const err of extraction.parse_errors) {
          console.warn(`  warn: parse issue in ${err.source_file} ${err.location ?? ""}: ${err.message}`);
        }
      }
      extractions.push(extraction);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`  warn: skipping ${rel}: ${msg}`);
      skipped += 1;
    }
  }

  const metadata: GraphMetadata = {
    schema_version: 1,
    generator: "hivemind-graph",
    commit_sha: commitSha,
    repo_key: repoKey,
  };
  const observation: GraphObservation = {
    ts: new Date().toISOString(),
    branch,
    worktree_path: opts.cwd,
    repo_project: project,
    generator_version: version,
    source_files_extracted: extractions.length,
    source_files_skipped: skipped,
  };

  const snapshot = buildSnapshot(extractions, metadata, observation);
  const result = writeSnapshot(snapshot, baseDir);

  console.log("");
  console.log(`Snapshot:      ${result.snapshotPath}`);
  console.log(`Latest:        ${result.latestCommitPath ?? "(no commit context — latest-commit.txt not updated)"}`);
  console.log(`SHA-256:       ${result.snapshotSha256}`);
  console.log(`Nodes:         ${snapshot.nodes.length}`);
  console.log(`Edges:         ${snapshot.links.length}`);
  console.log(`Files extracted: ${extractions.length} (skipped: ${skipped}, parse warnings: ${totalParseErrors})`);
}

// ─── Source-file discovery ─────────────────────────────────────────────────

function discoverSourceFiles(rootDir: string): string[] {
  const out: string[] = [];
  walk(rootDir, out);
  out.sort(); // deterministic order across runs (FS readdir order isn't guaranteed)
  return out;
}

function walk(dir: string, out: string[]): void {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // unreadable dirs (permissions, races) are skipped silently
  }
  for (const entry of entries) {
    if (DEFAULT_IGNORES.has(entry.name)) continue;
    // Skip dotfiles/dotdirs except the dir itself (rare edge — we entered via name, not '.')
    if (entry.name.startsWith(".")) continue;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(abs, out);
    } else if (entry.isFile() && isSourceFile(entry.name)) {
      out.push(abs);
    }
  }
}

function isSourceFile(name: string): boolean {
  if (name.endsWith(".d.ts")) return false; // declarations only, no implementation
  return name.endsWith(".ts") || name.endsWith(".tsx");
}

function toForwardSlash(p: string): string {
  return sep === "\\" ? p.replace(/\\/g, "/") : p;
}

// ─── Git context ───────────────────────────────────────────────────────────

function readGitCommit(cwd: string): string | null {
  try {
    return execSync("git rev-parse HEAD", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function readGitBranch(cwd: string): string | null {
  try {
    const out = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    // Detached HEAD prints literally "HEAD" — surface as null so consumers
    // (and the observation field) clearly distinguish "no current branch"
    // from any real branch name.
    return out === "" || out === "HEAD" ? null : out;
  } catch {
    return null;
  }
}
