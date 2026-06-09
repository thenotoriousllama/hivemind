/**
 * Referral nudge — a one-time SessionStart banner telling signed-in users they
 * earn credit for inviting teammates. Pairs with the deeplake-api referral
 * program (inviter's org gets credit when an invited friend signs up).
 *
 * Cadence: skips the first two sessions and fires on the 3rd (MIN_SESSIONS),
 * so brand-new users aren't nudged before they've used the product. The stable
 * dedupKey makes it show exactly once ever; bump the version to re-nudge.
 *
 * Suppression: silent when not signed in (no org to invite into). To dark-ship
 * or kill the nudge, stop registering it in the SessionStart hook entry — the
 * rule only runs when registered.
 *
 * Client-only by design: it does not check the per-org referral cap (that's
 * server state). Worst case it nudges an already-capped referrer once — fine
 * for a single banner, and "referral enabled" is a global flag anyway.
 */

import type { Rule } from "../types.js";

/** Fire on the 3rd session onward — not the first two. */
const MIN_SESSIONS = 3;

export const referralInviteRule: Rule = {
  id: "referral-invite",
  trigger: "session_start",
  evaluate({ creds, sessionCount }) {
    if (!creds?.token) return null; // need an org to invite into
    if ((sessionCount ?? 0) < MIN_SESSIONS) return null;
    return {
      id: "referral-invite",
      severity: "info",
      title: "💸 Invite a teammate — your org earns $20",
      body: "Run `hivemind invite <email> <ADMIN|WRITE|READ>` — your org gets $20 in credit when they sign up (up to $100).",
      // Stable key → shown once, ever. Bump to {v:2} to re-nudge everyone.
      dedupKey: { v: 1 },
    };
  },
};
