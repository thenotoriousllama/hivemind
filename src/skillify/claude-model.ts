/**
 * Shared `claude -p` backend for the engine's LLM steps (success-judge, proposer).
 * All tools denied → pure-text generation. Runs on the USER's own agent, so cost
 * lands on the user. Returned as an injectable ModelCall so every LLM step is
 * unit-testable with zero real calls.
 */
import { spawn } from "node:child_process";
import { findAgentBin } from "./gate-runner.js";

/** (systemPrompt, userPrompt) -> raw model text. */
export type ModelCall = (systemPrompt: string, userPrompt: string) => Promise<string>;

export function claudeModel(model: string, opts: { timeoutMs?: number } = {}): ModelCall {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  return (system, user) => new Promise<string>((resolve, reject) => {
    const args = [
      "-p", user, "--model", model, "--no-session-persistence",
      "--output-format", "json", "--system-prompt", system,
      // Empty allow-list = NO tools available. Authoritative: it covers built-ins AND
      // any MCP/configured tools (a deny-list can't enumerate those), so prompt-injected
      // transcript text in the judge/proposer prompt can never trigger tool use.
      "--tools", "",
      // --strict-mcp-config ignores the user's MCP config entirely (--tools only denies
      // USE, not LOADING) — a broken/oversized user MCP schema would otherwise fail every
      // judge/proposer call before it returns JSON, silently stopping proposals.
      "--strict-mcp-config",
    ];
    // HIVEMIND_CAPTURE=false so these calls aren't captured as real sessions, AND
    // HIVEMIND_WIKI_WORKER=1 so the spawned claude -p skips this package's SessionStart
    // hook entirely (no Deeplake-context injection into the prompt, no auto-pull/graph
    // work) — one child per anchored invocation would otherwise contaminate the judge
    // prompt and pile up background work. Same guard the other internal runners use.
    // Resolve the claude binary the same way the rest of skillify does — a detached
    // hook worker may not have it on PATH (e.g. ~/.claude/local/claude), and a bare
    // "claude" would ENOENT and the callers would swallow it as no-change.
    const child = spawn(findAgentBin("claude_code"), args, {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, HIVEMIND_CAPTURE: "false", HIVEMIND_WIKI_WORKER: "1" },
    });
    let out = "";
    let err = "";
    const timer = setTimeout(() => { child.kill("SIGKILL"); reject(new Error("claude timed out")); }, timeoutMs);
    child.stdout.on("data", (d) => { out += String(d); });
    child.stderr.on("data", (d) => { err += String(d); });
    child.on("error", (e) => { clearTimeout(timer); reject(e); });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(`claude exit ${code}: ${err.slice(0, 200)}`));
      try { resolve(String((JSON.parse(out) as { result?: unknown }).result ?? "")); }
      catch { resolve(out); }
    });
  });
}
