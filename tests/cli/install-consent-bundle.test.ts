import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { spawn } from "node:child_process";
import { createServer, type Server } from "node:http";
import { mkdtempSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Bundle smoke test for the install consent gate.
 *
 * Per CLAUDE.md testing-rule 4, we MUST exercise the shipped bundle/cli.js
 * with the real subprocess + closed-stdin shape that CI/scripted installs
 * use. Source-level unit tests can't catch a readline hang because they
 * stub out node:readline; only spawning the real bundle proves the non-TTY
 * branch never reaches readline.
 *
 * Two cases:
 *   1. Closed stdin, no token configured → exits within 5s, prints the
 *      headless hint, exit code 0.
 *   2. Closed stdin, HIVEMIND_TOKEN=invalid against a mock /me that
 *      returns 401 → exits within 5s, prints the "Token authentication
 *      failed" warning, exit code 0 (install continues).
 *
 * HOME is redirected to a tmp dir with one fake .codex marker so the
 * platform-install loop has a target to walk but cannot actually write
 * any real files; this lets the auth gate fire before the install bails.
 */

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const cliPath = join(repoRoot, "bundle", "cli.js");

// Mock /me server: returns 401 with a small JSON body. listOrgs is never
// reached because /me throws first; the auth.ts catch turns it into the
// "Token authentication failed" warning.
let mockServer: Server;
let mockUrl = "";
let tempHome = "";

function spawnInstall(env: Record<string, string>): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolveSpawn, reject) => {
    const child = spawn(process.execPath, [cliPath, "install", "--only", "codex"], {
      env: { ...process.env, ...env, HOME: tempHome },
      stdio: ["ignore", "pipe", "pipe"], // closed stdin → non-TTY in child
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => { stdout += d.toString(); });
    child.stderr.on("data", (d) => { stderr += d.toString(); });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`bundle/cli.js install hung past 5s (likely readline on closed stdin). stdout=${stdout} stderr=${stderr}`));
    }, 5000);
    // Use "close" not "exit": close fires after stdio streams flush, so
    // the buffered stdout/stderr we assert on is guaranteed complete.
    child.on("close", (code) => {
      clearTimeout(timer);
      resolveSpawn({ code, stdout, stderr });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

beforeAll(async () => {
  // Stand up a mock /me endpoint that 401s.
  mockServer = createServer((req, res) => {
    if (req.url === "/me") {
      res.statusCode = 401;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ error: "invalid_token" }));
      return;
    }
    res.statusCode = 404;
    res.end();
  });
  await new Promise<void>((r) => mockServer.listen(0, "127.0.0.1", r));
  const addr = mockServer.address();
  if (!addr || typeof addr === "string") throw new Error("mock server failed to bind");
  mockUrl = `http://127.0.0.1:${addr.port}`;

  // Fresh HOME with a fake .codex marker so platform detection has a target.
  tempHome = mkdtempSync(join(tmpdir(), "hivemind-bundle-smoke-"));
  mkdirSync(join(tempHome, ".codex"), { recursive: true });
});

afterAll(async () => {
  await new Promise<void>((r) => mockServer.close(() => r()));
  if (tempHome) rmSync(tempHome, { recursive: true, force: true });
});

describe("bundle/cli.js install — non-TTY smoke", () => {
  it("bundle/cli.js exists (sanity check; build must run before test)", () => {
    expect(existsSync(cliPath), `missing: ${cliPath} — run \`npm run build\` first`).toBe(true);
  });

  it("closed stdin + no token → exits within 5s (no readline hang), prints headless hint, exit 0", async () => {
    const { code, stdout, stderr } = await spawnInstall({});
    expect(code).toBe(0);
    const combined = stdout + stderr;
    expect(combined).toContain("No TTY detected");
    expect(combined).toContain("https://app.deeplake.ai/api-keys");
    expect(combined).toContain("HIVEMIND_TOKEN=<key>");
    expect(combined).toContain("hivemind login");
    // Negative-pattern assertion (rule 8): the consent banner must NOT
    // appear in non-TTY mode — that would mean the gate routed to the
    // TTY branch and would have hung on readline.
    expect(combined).not.toContain("🐝 One more step to unlock Hivemind");
  });

  it("closed stdin + HIVEMIND_TOKEN=invalid + /me 401 → warns, falls through to headless hint, exit 0", async () => {
    const { code, stdout, stderr } = await spawnInstall({
      HIVEMIND_TOKEN: "invalid-token",
      HIVEMIND_API_URL: mockUrl,
    });
    expect(code).toBe(0);
    const combined = stdout + stderr;
    expect(combined).toContain("Token authentication failed");
    // Codex review fix: after a rejected token, the headless hint MUST
    // also fire so the user has a documented recovery path. Previously
    // runAuthGate returned early and the install finished silently.
    expect(combined).toContain("No TTY detected");
    expect(combined).toContain("HIVEMIND_TOKEN=<key>");
  });
});
