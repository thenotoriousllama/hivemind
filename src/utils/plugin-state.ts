import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const PLUGIN_ID = "hivemind@hivemind";

/**
 * Returns false if the user explicitly disabled the hivemind plugin via
 * `claude plugin disable hivemind` (which writes enabledPlugins[id]=false to
 * ~/.claude/settings.json). Hooks are loaded at SessionStart and remain active
 * for the lifetime of the session even after disable; this check lets each
 * hook invocation respect a mid-session disable without requiring a restart.
 *
 * Fails open: if the file is unreadable or unparseable, returns true so that
 * a corrupt settings.json doesn't silently drop all captures.
 */
export function isHivemindPluginEnabled(): boolean {
  try {
    const settingsPath = join(homedir(), ".claude", "settings.json");
    const settings = JSON.parse(readFileSync(settingsPath, "utf-8"));
    const enabledPlugins = settings?.enabledPlugins;
    if (enabledPlugins && typeof enabledPlugins === "object" && PLUGIN_ID in enabledPlugins) {
      return enabledPlugins[PLUGIN_ID] !== false;
    }
    return true;
  } catch {
    return true;
  }
}
