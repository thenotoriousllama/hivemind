/**
 * Shared SkillOpt hook wiring, so every agent's PreToolUse / UserPromptSubmit hook
 * (claude + the codex/hermes/cursor forks) wires the event trigger with one call each
 * instead of copy-pasting the logic. Both are fully swallowed — they must NEVER affect
 * whether a tool runs or a prompt is captured.
 */
import { markSkillPending, runEventTrigger } from "../../skillify/skillopt-trigger.js";

/**
 * PreToolUse: if the agent invoked a `Skill` tool on an ORG skill (`name--author`),
 * open its K-message judgment window. Non-org skills (bare / plugin) are ignored.
 */
export function armSkillOptOnSkillUse(sessionId: string, toolName: string, toolInput: unknown, toolUseId?: string): void {
  try {
    if (toolName !== "Skill" || process.env.HIVEMIND_SKILLOPT_DISABLED === "1") return;
    const ref = (toolInput as { skill?: unknown })?.skill;
    if (typeof ref === "string") markSkillPending(sessionId, ref, toolUseId);
  } catch { /* never break PreToolUse */ }
}

/**
 * UserPromptSubmit: the prompt is the user's reaction. If an org skill is awaiting
 * judgment for this session, fire the worker to judge it against this reaction (on the
 * user's own `agent`). No-op unless a window is open. Skips internal worker calls.
 */
export function reactSkillOpt(sessionId: string, prompt: string | undefined, agent: string): void {
  try {
    // Empty/whitespace prompt isn't a reaction — firing on it would spend the judgment
    // budget and spawn a worker with no signal.
    if (prompt === undefined || prompt.trim() === "" || process.env.HIVEMIND_WIKI_WORKER === "1") return;
    runEventTrigger(sessionId, prompt, { agent });
  } catch { /* never break capture */ }
}
