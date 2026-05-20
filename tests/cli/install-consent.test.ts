import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for the consent + non-TTY auth-gate in src/cli/index.ts.
 *
 * Drives `hivemind install` end-to-end through the CLI dispatcher (rule 4:
 * load through the actual loader) and asserts on count + shape (rule 6) of
 * `ensureLoggedIn` / `loginWithProvidedToken` / `confirm` per path.
 *
 * The seven cases map 1-to-1 to the rows of the decision matrix in the plan:
 *   1. TTY + decline                     → no auth, install continues, hint logged
 *   2. TTY + accept                      → ensureLoggedIn exactly once, install continues
 *   3. Non-TTY + no token                → no readline (would hang), no auth, hint logged
 *   4. Non-TTY + env token + /me 200     → loginWithProvidedToken once, no device flow
 *   5. Non-TTY + --token flag + /me 200  → same as above, log says "--token flag"
 *   6. Non-TTY + invalid token + /me 401 → warning, install continues, exit 0
 *   7. TTY + --token flag                → token honored, consent prompt NOT shown
 *
 * Plus a negative-pattern assertion (rule 8): "Signed in via HIVEMIND_TOKEN"
 * must NOT appear in the --token-flag log line.
 */

const installs = {
  installClaude: vi.fn(), uninstallClaude: vi.fn(),
  installCodex: vi.fn(),  uninstallCodex: vi.fn(),
  installOpenclaw: vi.fn(), uninstallOpenclaw: vi.fn(),
  installCursor: vi.fn(), uninstallCursor: vi.fn(),
  installHermes: vi.fn(), uninstallHermes: vi.fn(),
  installPi: vi.fn(),     uninstallPi: vi.fn(),
};
const ensureLoggedInMock = vi.fn();
const isLoggedInMock = vi.fn();
const loginWithProvidedTokenMock = vi.fn();
const maybeShowOrgChoiceMock = vi.fn();
const runAuthCommandMock = vi.fn();
const detectPlatformsMock = vi.fn();
const allPlatformIdsMock = vi.fn();
const getVersionMock = vi.fn();
const runUpdateMock = vi.fn();
const confirmMock = vi.fn();
const promptLineMock = vi.fn();
const stdoutMock = vi.fn();
const stderrMock = vi.fn();
const exitSpy = vi.fn();

vi.mock("../../src/cli/install-claude.js", () => ({
  installClaude: (...a: unknown[]) => installs.installClaude(...a),
  uninstallClaude: (...a: unknown[]) => installs.uninstallClaude(...a),
}));
vi.mock("../../src/cli/install-codex.js", () => ({
  installCodex: (...a: unknown[]) => installs.installCodex(...a),
  uninstallCodex: (...a: unknown[]) => installs.uninstallCodex(...a),
}));
vi.mock("../../src/cli/install-openclaw.js", () => ({
  installOpenclaw: (...a: unknown[]) => installs.installOpenclaw(...a),
  uninstallOpenclaw: (...a: unknown[]) => installs.uninstallOpenclaw(...a),
}));
vi.mock("../../src/cli/install-cursor.js", () => ({
  installCursor: (...a: unknown[]) => installs.installCursor(...a),
  uninstallCursor: (...a: unknown[]) => installs.uninstallCursor(...a),
}));
vi.mock("../../src/cli/install-hermes.js", () => ({
  installHermes: (...a: unknown[]) => installs.installHermes(...a),
  uninstallHermes: (...a: unknown[]) => installs.uninstallHermes(...a),
}));
vi.mock("../../src/cli/install-pi.js", () => ({
  installPi: (...a: unknown[]) => installs.installPi(...a),
  uninstallPi: (...a: unknown[]) => installs.uninstallPi(...a),
  upsertHivemindBlock: () => "",
  stripHivemindBlock: (s: string) => s,
}));
vi.mock("../../src/cli/auth.js", () => ({
  ensureLoggedIn: (...a: unknown[]) => ensureLoggedInMock(...a),
  isLoggedIn: (...a: unknown[]) => isLoggedInMock(...a),
  loginWithProvidedToken: (...a: unknown[]) => loginWithProvidedTokenMock(...a),
  maybeShowOrgChoice: (...a: unknown[]) => maybeShowOrgChoiceMock(...a),
}));
vi.mock("../../src/commands/auth-login.js", () => ({
  runAuthCommand: (...a: unknown[]) => runAuthCommandMock(...a),
}));
vi.mock("../../src/cli/util.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/cli/util.js")>();
  return {
    ...actual,
    detectPlatforms: (...a: unknown[]) => detectPlatformsMock(...a),
    allPlatformIds: (...a: unknown[]) => allPlatformIdsMock(...a),
    confirm: (...a: unknown[]) => confirmMock(...a),
    promptLine: (...a: unknown[]) => promptLineMock(...a),
  };
});
vi.mock("../../src/cli/version.js", () => ({
  getVersion: (...a: unknown[]) => getVersionMock(...a),
}));
vi.mock("../../src/cli/update.js", () => ({
  runUpdate: (...a: unknown[]) => runUpdateMock(...a),
}));
vi.mock("../../src/cli/embeddings.js", () => ({
  installEmbeddings: vi.fn(),
  enableEmbeddings: vi.fn(),
  disableEmbeddings: vi.fn(),
  uninstallEmbeddings: vi.fn(),
  statusEmbeddings: vi.fn(),
}));
vi.mock("../../src/commands/skillify.js", () => ({
  runSkillifyCommand: vi.fn(),
}));
vi.mock("../../src/cli/skillify-spec.js", () => ({
  renderCliHelpBlock: () => "",
}));

const originalArgv = process.argv;
const originalIsTTY = (process.stdin as { isTTY?: boolean }).isTTY;

function setTTY(value: boolean | undefined): void {
  Object.defineProperty(process.stdin, "isTTY", { value, configurable: true });
}

beforeEach(() => {
  for (const fn of Object.values(installs)) fn.mockReset();
  ensureLoggedInMock.mockReset().mockResolvedValue(true);
  isLoggedInMock.mockReset().mockReturnValue(false); // forces the gate to run
  loginWithProvidedTokenMock.mockReset().mockResolvedValue(false);
  maybeShowOrgChoiceMock.mockReset().mockResolvedValue(undefined);
  runAuthCommandMock.mockReset().mockResolvedValue(undefined);
  detectPlatformsMock.mockReset().mockReturnValue([{ id: "claude", markerDir: "/x/.claude" }]);
  allPlatformIdsMock.mockReset().mockReturnValue(["claude", "codex", "claw", "cursor", "hermes", "pi"]);
  getVersionMock.mockReset().mockReturnValue("1.2.3");
  runUpdateMock.mockReset().mockResolvedValue(0);
  confirmMock.mockReset().mockResolvedValue(true);
  // Default: paste fallback returns empty (user presses Enter → skip).
  promptLineMock.mockReset().mockResolvedValue("");
  stdoutMock.mockReset();
  stderrMock.mockReset();
  exitSpy.mockReset();
  delete process.env.HIVEMIND_TOKEN;
  vi.spyOn(process.stdout, "write").mockImplementation(((...a: unknown[]) => { stdoutMock(...a); return true; }) as any);
  vi.spyOn(process.stderr, "write").mockImplementation(((...a: unknown[]) => { stderrMock(...a); return true; }) as any);
  vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
    exitSpy(code);
    throw Object.assign(new Error("__test_process_exit__"), { __exit: true });
  }) as any);
});

afterEach(() => {
  process.argv = originalArgv;
  setTTY(originalIsTTY);
  vi.restoreAllMocks();
  vi.resetModules();
});

async function runInstall(args: string[]): Promise<void> {
  process.argv = ["node", "/path/to/hivemind-cli", "install", ...args];
  const onUnhandled = (e: unknown) => {
    if (e && typeof e === "object" && "__exit" in (e as Record<string, unknown>)) return;
    throw e;
  };
  process.on("unhandledRejection", onUnhandled);
  try {
    vi.resetModules();
    await import("../../src/cli/index.js");
    await new Promise(r => setImmediate(r));
    await new Promise(r => setImmediate(r));
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
}

const stdoutText = () => stdoutMock.mock.calls.map(c => c[0]).join("");
const stderrText = () => stderrMock.mock.calls.map(c => c[0]).join("");

describe("install consent gate — TTY paths", () => {
  it("TTY + decline + paste fallback empty → no auth, install continues, post-loop hint logged", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(false);
    promptLineMock.mockResolvedValue(""); // user presses Enter at paste prompt

    await runInstall([]);

    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(promptLineMock).toHaveBeenCalledTimes(1); // fallback offered, broke on empty
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(loginWithProvidedTokenMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    expect(stdoutText()).toContain("Continuing install without sign-in.");
    expect(stdoutText()).toContain("hivemind login");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("TTY + decline + paste invalid 3 times → exhausts retries, install continues", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(false);
    // Three pastes, none accepted by the server.
    promptLineMock
      .mockResolvedValueOnce("bad-1")
      .mockResolvedValueOnce("bad-2")
      .mockResolvedValueOnce("bad-3");
    loginWithProvidedTokenMock.mockResolvedValue(false);

    await runInstall([]);

    expect(promptLineMock).toHaveBeenCalledTimes(3); // MAX_PASTE_ATTEMPTS
    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(3);
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    // The user sees retry hints between attempts.
    expect(stdoutText()).toContain("That key wasn't accepted");
    expect(stdoutText()).toContain("2 attempts left");
    expect(stdoutText()).toContain("1 attempt left");
    // And the terminal "continuing install" message after the loop.
    expect(stdoutText()).toContain("Continuing install without sign-in.");
  });

  it("TTY + decline + paste fails then succeeds → loop exits on success, install continues", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(false);
    promptLineMock
      .mockResolvedValueOnce("bad-tok")
      .mockResolvedValueOnce("good-tok");
    loginWithProvidedTokenMock
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true);

    await runInstall([]);

    expect(promptLineMock).toHaveBeenCalledTimes(2);
    expect(loginWithProvidedTokenMock).toHaveBeenNthCalledWith(1, "bad-tok");
    expect(loginWithProvidedTokenMock).toHaveBeenNthCalledWith(2, "good-tok");
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    // Retry hint is shown after the first failure.
    expect(stdoutText()).toContain("That key wasn't accepted");
    // But the final "continuing without sign-in" hint MUST NOT appear since
    // we ultimately did sign in.
    expect(stdoutText()).not.toContain("Continuing install without sign-in.");
  });

  it("TTY + decline + paste fails once then user presses Enter → no further retries, install continues", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(false);
    promptLineMock
      .mockResolvedValueOnce("bad-tok")
      .mockResolvedValueOnce(""); // user gives up
    loginWithProvidedTokenMock.mockResolvedValue(false);

    await runInstall([]);

    expect(promptLineMock).toHaveBeenCalledTimes(2);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1); // empty isn't a paste
    expect(stdoutText()).toContain("That key wasn't accepted");
    expect(stdoutText()).toContain("Continuing install without sign-in.");
  });

  it("TTY + decline + paste valid token → loginWithProvidedToken called with pasted value", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(false);
    promptLineMock.mockResolvedValue("pasted-tok");
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall([]);

    expect(promptLineMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("pasted-tok");
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });

  it("TTY + accept → ensureLoggedIn once; paste fallback NOT triggered when signin succeeded", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(true);
    ensureLoggedInMock.mockResolvedValue(true);

    await runInstall([]);

    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(ensureLoggedInMock).toHaveBeenCalledTimes(1);
    expect(promptLineMock).not.toHaveBeenCalled(); // signed in, no fallback
    expect(loginWithProvidedTokenMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    expect(stdoutText()).toContain("🐝 One more step to unlock Hivemind");
    expect(stdoutText()).toContain("securely stored in");
    expect(stdoutText()).toContain("your private Hivemind");
    expect(stdoutText()).toContain("You can later connect your own cloud storage");
  });

  it("TTY + accept BUT device flow fails → paste fallback fires", async () => {
    setTTY(true);
    confirmMock.mockResolvedValue(true);
    ensureLoggedInMock.mockResolvedValue(false); // device flow didn't complete
    promptLineMock.mockResolvedValue("recovery-tok");
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall([]);

    expect(ensureLoggedInMock).toHaveBeenCalledTimes(1);
    expect(promptLineMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("recovery-tok");
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });

  it("TTY + --token rejected → consent prompt STILL shown (codex review fix)", async () => {
    setTTY(true);
    loginWithProvidedTokenMock.mockResolvedValue(false); // typoed/revoked
    confirmMock.mockResolvedValue(false); // user declines fallback consent
    promptLineMock.mockResolvedValue(""); // skip paste

    await runInstall(["--token", "bad-tok"]);

    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("bad-tok");
    // On rejection, runAuthGate must fall through — the consent prompt
    // fires so the user has a recovery path in the same run.
    expect(confirmMock).toHaveBeenCalledTimes(1);
    expect(promptLineMock).toHaveBeenCalledTimes(1);
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });

  it("TTY + --token <value> → consent prompt NOT shown, token honored, no fallback", async () => {
    setTTY(true);
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall(["--token", "tok-abc"]);

    expect(confirmMock).not.toHaveBeenCalled();
    expect(promptLineMock).not.toHaveBeenCalled();
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("tok-abc");
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });
});

describe("install consent gate — non-TTY paths", () => {
  it("non-TTY + no token → no confirm (would hang), no auth, hint logged, install continues", async () => {
    setTTY(false);

    await runInstall([]);

    expect(confirmMock).not.toHaveBeenCalled();
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(loginWithProvidedTokenMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    expect(stdoutText()).toContain("No TTY detected");
    expect(stdoutText()).toContain("https://app.deeplake.ai/api-keys");
    expect(stdoutText()).toContain("HIVEMIND_TOKEN=<key>");
    expect(stdoutText()).toContain("hivemind login");
    // DEEPLAKE_* env names were dropped per product feedback.
    expect(stdoutText()).not.toContain("DEEPLAKE_API_TOKEN");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("non-TTY + HIVEMIND_TOKEN → loginWithProvidedToken once, no device flow, no confirm", async () => {
    setTTY(false);
    process.env.HIVEMIND_TOKEN = "env-token";
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall([]);

    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith(undefined);
    expect(confirmMock).not.toHaveBeenCalled();
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });

  it("non-TTY + --token flag → loginWithProvidedToken called with flag value (priority over env)", async () => {
    setTTY(false);
    process.env.HIVEMIND_TOKEN = "env-token";
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall(["--token", "flag-token"]);

    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1);
    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("flag-token");
  });

  it("non-TTY + invalid token → falls through to headless hint, install continues exit 0", async () => {
    setTTY(false);
    process.env.HIVEMIND_TOKEN = "bad-token";
    loginWithProvidedTokenMock.mockResolvedValue(false);

    await runInstall([]);

    expect(loginWithProvidedTokenMock).toHaveBeenCalledTimes(1);
    // Codex fix: on token rejection, the non-TTY hint must STILL print so
    // the user has a documented recovery path. Previously runAuthGate
    // returned early and the install finished silently with no auth.
    expect(stdoutText()).toContain("No TTY detected");
    expect(stdoutText()).toContain("https://app.deeplake.ai/api-keys");
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("non-TTY + --token=<value> (= form) → flag value is parsed correctly", async () => {
    setTTY(false);
    loginWithProvidedTokenMock.mockResolvedValue(true);

    await runInstall(["--token=eq-form-token"]);

    expect(loginWithProvidedTokenMock).toHaveBeenCalledWith("eq-form-token");
  });
});

describe("install consent gate — short-circuit cases", () => {
  it("--skip-auth bypasses the entire gate even when no creds and TTY=true", async () => {
    setTTY(true);
    process.env.HIVEMIND_TOKEN = "env-token";

    await runInstall(["--skip-auth"]);

    expect(confirmMock).not.toHaveBeenCalled();
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(loginWithProvidedTokenMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });

  it("already logged in → gate is skipped entirely (no confirm, no token check)", async () => {
    setTTY(true);
    isLoggedInMock.mockReturnValue(true);

    await runInstall([]);

    expect(confirmMock).not.toHaveBeenCalled();
    expect(ensureLoggedInMock).not.toHaveBeenCalled();
    expect(loginWithProvidedTokenMock).not.toHaveBeenCalled();
    expect(installs.installClaude).toHaveBeenCalledTimes(1);
  });
});
