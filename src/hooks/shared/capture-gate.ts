/**
 * Allowlist gate for HIVEMIND_CAPTURE_ONLY_CLI.
 *
 * When the env var is "true", only capture sessions whose
 * CLAUDE_CODE_ENTRYPOINT contains the substring "cli". The Claude Agent SDK
 * (Python / TypeScript) sets the entrypoint to "sdk-py" / "sdk-ts" when it
 * spawns the CLI subprocess, so those sessions fail the check and the hook
 * short-circuits. Interactive terminal sessions keep entrypoint="cli".
 *
 * Returns true when the gate PASSES (capture should proceed), false when
 * the caller should skip. With the gate disabled (env var unset or != "true")
 * this always returns true.
 *
 * Accepts an optional env map to keep the function pure and trivially
 * unit-testable; defaults to process.env.
 */
export function entrypointPassesOnlyCliGate(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const onlyCli = env.HIVEMIND_CAPTURE_ONLY_CLI === "true";
  if (!onlyCli) return true;
  const entrypoint = env.CLAUDE_CODE_ENTRYPOINT ?? "";
  return entrypoint.includes("cli");
}
