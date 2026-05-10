/**
 * One-time migration of the pre-rename state directory.
 *
 * Old: ~/.deeplake/state/skilify/
 * New: ~/.deeplake/state/skillify/
 *
 * If the legacy directory exists and the new one does not, rename in place
 * so installed-skill manifests, throttle files, scope config, and per-project
 * state survive the rename. If renameSync fails (cross-device link, perms),
 * leave the legacy dir alone and start fresh — `pull` repopulates `pulled.json`,
 * but unpull of pre-rename installs may need manual cleanup.
 */

import { existsSync, renameSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { log as _log } from "../utils/debug.js";

const dlog = (msg: string) => _log("skillify-migrate", msg);

let attempted = false;

export function migrateLegacyStateDir(): void {
  if (attempted) return;
  attempted = true;
  const root = join(homedir(), ".deeplake", "state");
  const legacy = join(root, "skilify");
  const current = join(root, "skillify");
  if (!existsSync(legacy)) return;
  if (existsSync(current)) return;
  try {
    renameSync(legacy, current);
    dlog(`migrated ${legacy} -> ${current}`);
  } catch (err) {
    dlog(`migration failed (${(err as NodeJS.ErrnoException).code ?? "unknown"}); leaving legacy dir in place`);
  }
}
