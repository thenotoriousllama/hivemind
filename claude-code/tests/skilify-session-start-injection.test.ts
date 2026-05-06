import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Bundle-level guard: every agent's session-start.js bundle must inject the
 * SKILLS (skilify) section into the agent's developer context. Skilify
 * commands are part of the same hivemind family as the auth-login subcommands
 * — without this injection, agents have no way to discover that
 * `hivemind skilify pull --user X`, `--to global`, `--dry-run`, etc. exist.
 *
 * Each session-start.ts source file embeds the SKILLS section as a literal
 * string and resolves the HIVEMIND_CLI placeholder to the absolute path of
 * `bundle/cli.js` at runtime. These assertions catch any future refactor
 * that drops the injection or breaks the placeholder substitution.
 */

const BUNDLE_ROOT = resolve(__dirname, "..", "..");

const SESSION_START_BUNDLES: Array<[string, string]> = [
  ["claude-code", resolve(BUNDLE_ROOT, "claude-code", "bundle", "session-start.js")],
  ["codex",       resolve(BUNDLE_ROOT, "codex",       "bundle", "session-start.js")],
  ["cursor",      resolve(BUNDLE_ROOT, "cursor",      "bundle", "session-start.js")],
  ["hermes",      resolve(BUNDLE_ROOT, "hermes",      "bundle", "session-start.js")],
];

// Pi and OpenClaw don't go through the same esbuild bundle pipeline:
//   - Pi ships pi/extension-source/hivemind.ts as raw .ts (pi compiles it)
//   - OpenClaw exposes its surface via openclaw/skills/SKILL.md (loaded by
//     the openclaw runtime's skill index, not bundled JS)
// Both are still part of the discoverability matrix and must advertise the
// skilify family alongside the four hook-driven agents.
const NON_BUNDLE_SURFACES: Array<[string, string]> = [
  ["pi-extension-source", resolve(BUNDLE_ROOT, "pi", "extension-source", "hivemind.ts")],
  ["openclaw-skill",      resolve(BUNDLE_ROOT, "openclaw", "skills", "SKILL.md")],
];

describe("skilify SessionStart injection (per-agent bundles)", () => {
  it.each(SESSION_START_BUNDLES)("%s bundle exists", (_label, p) => {
    expect(existsSync(p)).toBe(true);
  });

  it.each(SESSION_START_BUNDLES)(
    "%s bundle includes the SKILLS / Skill management section",
    (_label, p) => {
      const text = readFileSync(p, "utf-8");
      // Claude Code uses the long header "Skill management"; the others use
      // the short "SKILLS (skilify)" header. Either is acceptable.
      const hasHeader =
        text.includes("Skill management") || text.includes("SKILLS (skilify)");
      expect(hasHeader).toBe(true);
    }
  );

  it.each(SESSION_START_BUNDLES)(
    "%s bundle advertises the high-value skilify pull invocations",
    (_label, p) => {
      const text = readFileSync(p, "utf-8");
      // The exact subcommands every agent must surface to be useful.
      expect(text).toMatch(/skilify pull/);
      expect(text).toMatch(/skilify pull --user/);
      expect(text).toMatch(/skilify pull --users/);
      expect(text).toMatch(/skilify pull --all-users/);
      expect(text).toMatch(/skilify pull --dry-run/);
      expect(text).toMatch(/skilify scope/);
      expect(text).toMatch(/skilify team/);
    }
  );

  it.each(SESSION_START_BUNDLES)(
    "%s bundle resolves HIVEMIND_CLI placeholder (no literal placeholder leaks at runtime)",
    (_label, p) => {
      const text = readFileSync(p, "utf-8");
      // The bundle must contain the string `HIVEMIND_CLI` ONLY in two contexts:
      //   1. The const declaration (`const HIVEMIND_CLI = join(...)`).
      //   2. The substitution call (`replace(/HIVEMIND_CLI/g, HIVEMIND_CLI)`).
      // It must NOT appear inside a quoted template-string segment that would
      // ship to the agent verbatim. We assert that `replace` is wired up so
      // any literal occurrence in the inject string gets substituted.
      expect(text).toMatch(/replace\(\s*\/HIVEMIND_CLI\/g\s*,\s*HIVEMIND_CLI\s*\)/);
      // esbuild emits `var HIVEMIND_CLI = ...` (it does not preserve const).
      expect(text).toMatch(/(?:var|const|let)\s+HIVEMIND_CLI\s*=/);
      // The const must resolve to the unified hivemind dispatcher one level
      // above each agent's bundle dir: <root>/<agent>/bundle/../../bundle/cli.js
      expect(text).toMatch(/HIVEMIND_CLI\s*=\s*join\d*\(\s*__bundleDir\s*,\s*"\.\.",\s*"\.\.",\s*"bundle",\s*"cli\.js"\s*\)/);
    }
  );
});

describe("skilify discoverability on non-bundle agent surfaces (Pi + OpenClaw)", () => {
  it.each(NON_BUNDLE_SURFACES)("%s file exists", (_label, p) => {
    expect(existsSync(p)).toBe(true);
  });

  it.each(NON_BUNDLE_SURFACES)(
    "%s advertises the skilify family (SKILLS / Skill Management section)",
    (_label, p) => {
      const text = readFileSync(p, "utf-8");
      // Pi uses "SKILLS (skilify)" inline in its CONTEXT_PREAMBLE; OpenClaw's
      // SKILL.md uses a markdown "## Skill Management" header. Either is fine.
      const hasHeader =
        text.includes("SKILLS (skilify)") ||
        text.includes("Skill Management") ||
        text.includes("Skill management");
      expect(hasHeader).toBe(true);
    }
  );

  it.each(NON_BUNDLE_SURFACES)(
    "%s lists the high-value skilify pull invocations",
    (_label, p) => {
      const text = readFileSync(p, "utf-8");
      expect(text).toMatch(/skilify pull/);
      expect(text).toMatch(/skilify pull --user/);
      expect(text).toMatch(/skilify pull --users/);
      expect(text).toMatch(/skilify pull --all-users/);
      expect(text).toMatch(/skilify pull --dry-run/);
      expect(text).toMatch(/skilify scope/);
      expect(text).toMatch(/skilify team/);
    }
  );
});

describe("Pi skilify worker (mining) wiring", () => {
  // Pi mines via a separate bundled worker spawned from session_shutdown,
  // installed alongside wiki-worker.js by `hivemind pi install`. These
  // assertions catch any regression that drops the bundle entry, removes
  // the install copy, or unwires the spawn call.

  it("ships pi/bundle/skilify-worker.js after build", () => {
    const p = resolve(BUNDLE_ROOT, "pi", "bundle", "skilify-worker.js");
    expect(existsSync(p)).toBe(true);
  });

  it("esbuild config registers the pi skilify-worker entry", () => {
    const cfg = readFileSync(resolve(BUNDLE_ROOT, "esbuild.config.mjs"), "utf-8");
    // Inside the piWorker array we must list the skilify-worker entry.
    expect(cfg).toMatch(/dist\/src\/skilify\/skilify-worker\.js[^"]*"\s*,\s*out:\s*"skilify-worker"/);
  });

  it("install-pi.ts copies pi/bundle/skilify-worker.js to ~/.pi/agent/hivemind/", () => {
    const src = readFileSync(resolve(BUNDLE_ROOT, "src", "cli", "install-pi.ts"), "utf-8");
    expect(src).toMatch(/SKILIFY_WORKER_PATH\s*=/);
    // join(pkgRoot(), "pi", "bundle", "skilify-worker.js") — the source path
    expect(src).toMatch(/"pi",\s*"bundle",\s*"skilify-worker\.js"/);
    // copyFileSync(srcSkilifyWorker, SKILIFY_WORKER_PATH) — the install step
    expect(src).toMatch(/copyFileSync\(srcSkilifyWorker,\s*SKILIFY_WORKER_PATH\)/);
  });

  it("pi extension defines spawnPiSkilifyWorker and wires it into session_shutdown", () => {
    const ext = readFileSync(resolve(BUNDLE_ROOT, "pi", "extension-source", "hivemind.ts"), "utf-8");
    // Function exists
    expect(ext).toMatch(/function spawnPiSkilifyWorker\b/);
    // Path const points at the right install location
    expect(ext).toMatch(/PI_SKILIFY_WORKER_PATH\s*=\s*join\(homedir\(\),\s*"\.pi",\s*"agent",\s*"hivemind",\s*"skilify-worker\.js"\)/);
    // Spawned with HIVEMIND_SKILIFY_WORKER=1 + HIVEMIND_CAPTURE=false (recursion guard + no echo)
    expect(ext).toMatch(/HIVEMIND_SKILIFY_WORKER:\s*"1"/);
    // session_shutdown handler invokes it after spawnWikiWorker
    expect(ext).toMatch(/session_shutdown[\s\S]{0,2000}spawnWikiWorker[\s\S]{0,500}spawnPiSkilifyWorker/);
  });

  it("pi skilify worker bundle embeds the same worker code as the other agents", () => {
    // Same shared module — guard against an accidental empty bundle by
    // checking the canonical entry-point + module markers are present.
    const text = readFileSync(resolve(BUNDLE_ROOT, "pi", "bundle", "skilify-worker.js"), "utf-8");
    // The worker reads its config from process.argv[2]
    expect(text).toMatch(/process\.argv\[2\]/);
    // The worker writes to the skills table via INSERT (append-only design)
    expect(text).toMatch(/INSERT INTO/);
    // The worker pulls in the skilify gate-runner module (per-agent CLI dispatch)
    expect(text).toMatch(/gate-runner|runGate/);
    // Worker-specific helper that doesn't appear in unrelated bundles
    expect(text).toMatch(/skilifyLog/);
  });
});

describe("hivemind CLI USAGE help advertises skilify", () => {
  // Source-of-truth scan: USAGE block in src/cli/index.ts must list skilify.
  // Bundle scan would also work but the source is canonical for help text.
  it("`hivemind --help` documents the skilify subcommand family", () => {
    const cli = resolve(BUNDLE_ROOT, "bundle", "cli.js");
    const text = readFileSync(cli, "utf-8");
    expect(text).toMatch(/Skill management/);
    expect(text).toMatch(/hivemind skilify pull/);
    expect(text).toMatch(/hivemind skilify scope/);
    expect(text).toMatch(/hivemind skilify team/);
  });
});
