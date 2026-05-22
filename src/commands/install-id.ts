/**
 * Machine-stable install ID for hivemind CLI device flow.
 *
 * Persisted to ~/.deeplake/install-id on first use. Sent as the
 * X-Hivemind-Install-Id header on /auth/device/code and /auth/device/token
 * so the deeplake-api backend uses it as the anonymous PostHog distinct_id
 * (instead of hashing the per-attempt OAuth device_code).
 *
 * Why this exists: without a stable ID, every `hivemind install` retry from
 * the same machine creates a new anonymous Person in PostHog. One real user
 * × N retries = N orphan Persons, only one of which gets aliased to their
 * Auth0 identity at completion. The other N-1 inflate funnel denominators
 * forever.
 *
 * Best-effort by design: if reading or writing the file fails, the helper
 * returns an empty string and the network code omits the header — the
 * backend then falls back to its pre-install-id behavior (hashing the
 * device_code). No CLI flow ever breaks because of install-id issues.
 *
 * No imports from any module that touches `fetch` belong here — same
 * static-analysis split as auth-creds.ts.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";

// Lazy paths so HOME overrides in tests take effect per-call. Same pattern
// as auth-creds.ts; see that file for the rationale (CI branch-coverage
// flake from vi.resetModules + dynamic re-import).
function configDir(): string {
  return join(homedir(), ".deeplake");
}
function installIDPath(): string {
  return join(configDir(), "install-id");
}

// Loose validity check: only accept content that looks like a UUID
// (8-4-4-4-12 hex). Anything else is treated as corrupt and rotated. This
// catches truncated/garbled files without trying to be cryptographic.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Read the install ID from disk, or generate and persist a new one.
 *
 * Returns an empty string if both read AND write fail (e.g. read-only
 * filesystem). Never throws — callers omit the header on empty result.
 */
export function getOrCreateInstallID(): string {
  // Read first — happy path is one fs call.
  try {
    const value = readFileSync(installIDPath(), "utf-8").trim();
    if (UUID_RE.test(value)) return value;
    // Fall through to regenerate on invalid contents.
  } catch {
    // Missing file (ENOENT) or unreadable — fall through to generate.
  }

  const id = randomUUID();
  try {
    mkdirSync(configDir(), { recursive: true, mode: 0o700 });
    writeFileSync(installIDPath(), id, { mode: 0o600 });
    return id;
  } catch {
    // Can't persist — return empty so the caller skips the header. The
    // alternative (returning the in-memory id) would create a new orphan
    // anon Person per process, defeating the whole point.
    return "";
  }
}

/**
 * Returns `{ "X-Hivemind-Install-Id": "<uuid>" }` for spreading into a
 * headers object, or `{}` when the install ID can't be obtained. Callers
 * use it the same way as `deeplakeClientHeader()`.
 */
export function hivemindInstallIDHeader(): Record<string, string> {
  const id = getOrCreateInstallID();
  if (!id) return {};
  return { "X-Hivemind-Install-Id": id };
}
