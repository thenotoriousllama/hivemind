import { describe, it, expect, vi } from "vitest";
import { markSkillPending, runEventTrigger, judgeWindow, DEFAULT_JUDGE_WINDOW, type PendingSkill, type PendingStore } from "../../src/skillify/skillopt-trigger.js";

/** In-memory per-session store standing in for the per-session files. */
function memStore(initial: Record<string, PendingSkill> = {}) {
  const m = new Map<string, PendingSkill>(Object.entries(initial));
  const store: PendingStore = {
    load: (sid) => m.get(sid) ?? null,
    save: (sid, p) => { if (p === null) m.delete(sid); else m.set(sid, p); },
  };
  return { store, get: (sid: string) => m.get(sid) ?? null };
}

describe("markSkillPending (shape gate + manifest gate + K-window + tool_use_id)", () => {
  const ORG = () => true; // isOrgSkill: in unit tests, treat refs as pulled org skills

  it("opens a K-message window for a PULLED org skill, storing the tool_use_id", () => {
    const s = memStore();
    expect(markSkillPending("s1", "posthog--kamo", "tu1", { store: s.store, env: {} as NodeJS.ProcessEnv, isOrgSkill: ORG })).toBe(true);
    expect(s.get("s1")).toEqual({ skill: "posthog--kamo", budget: DEFAULT_JUDGE_WINDOW, toolUseId: "tu1" });
  });

  it("ignores bare local and plugin skills (wrong shape → not org)", () => {
    const s = memStore();
    expect(markSkillPending("s1", "bareskill", "tu", { store: s.store, isOrgSkill: ORG })).toBe(false);
    expect(markSkillPending("s1", "hivemind:memory", "tu", { store: s.store, isOrgSkill: ORG })).toBe(false);
    expect(s.get("s1")).toBeNull();
  });

  it("ignores a LOCAL skill that looks like name--author but isn't in the pull manifest", () => {
    const s = memStore();
    expect(markSkillPending("s1", "myskill--alice", "tu", { store: s.store, isOrgSkill: () => false })).toBe(false);
    expect(s.get("s1")).toBeNull(); // must not arm → can't edit the shared org row of that name
  });

  it("the newest org-skill call supersedes the pending one and resets the budget", () => {
    const s = memStore({ s1: { skill: "a--u", budget: 1 } });
    markSkillPending("s1", "b--u", "tu2", { store: s.store, env: {} as NodeJS.ProcessEnv, isOrgSkill: ORG });
    expect(s.get("s1")).toEqual({ skill: "b--u", budget: DEFAULT_JUDGE_WINDOW, toolUseId: "tu2" });
  });

  it("does not touch a DIFFERENT session's entry (no cross-session clobber)", () => {
    const s = memStore({ other: { skill: "x--u", budget: 2 } });
    markSkillPending("s1", "b--u", "tu", { store: s.store, env: {} as NodeJS.ProcessEnv, isOrgSkill: ORG });
    expect(s.get("other")).toEqual({ skill: "x--u", budget: 2 }); // untouched
    expect(s.get("s1")).toMatchObject({ skill: "b--u" });
  });

  it("returns false for empty session/skill", () => {
    expect(markSkillPending("", "x--a")).toBe(false);
    expect(markSkillPending("s1", "")).toBe(false);
  });
});

describe("runEventTrigger", () => {
  function harness(over: { initial?: Record<string, PendingSkill>; env?: NodeJS.ProcessEnv; canFire?: () => boolean } = {}) {
    const s = memStore(over.initial ?? { s1: { skill: "posthog--kamo", budget: 3 } });
    const spawnWorker = vi.fn();
    const run = (sessionId: string, reaction: string, opts: { agent?: string } = {}) =>
      runEventTrigger(sessionId, reaction, {
        ...opts,
        deps: {
          env: over.env ?? ({} as NodeJS.ProcessEnv),
          store: s.store,
          spawnWorker,
          canFire: over.canFire ?? (() => true),
        },
      });
    return { run, spawnWorker, get: s.get };
  }

  it("spawns the worker with session+skill+reaction+toolUseId+agent, decrements the budget", () => {
    const { run, spawnWorker, get } = harness({ initial: { s1: { skill: "posthog--kamo", budget: 3, toolUseId: "tu9" } } });
    const r = run("s1", "no you fucked up, mocking hides the bug", { agent: "codex" });
    expect(r).toEqual({ fired: true, reason: "spawned" });
    expect(spawnWorker).toHaveBeenCalledWith("s1", "posthog--kamo", "no you fucked up, mocking hides the bug", "tu9", "codex");
    expect(get("s1")?.budget).toBe(2); // 3 → 2
  });

  it("closes the window (clears the session) when the budget is exhausted", () => {
    const { run, get } = harness({ initial: { s1: { skill: "x--a", budget: 1 } } });
    run("s1", "still broken");
    expect(get("s1")).toBeNull();
  });

  it("does NOTHING when no skill is pending for the session", () => {
    const { run, spawnWorker } = harness({ initial: {} });
    expect(run("s1", "anything")).toEqual({ fired: false, reason: "no-skill" });
    expect(spawnWorker).not.toHaveBeenCalled();
  });

  it("respects the kill switch, recursion guard, and logged-out state", () => {
    expect(harness({ env: { HIVEMIND_SKILLOPT_DISABLED: "1" } as never }).run("s1", "x").reason).toBe("disabled");
    expect(harness({ env: { HIVEMIND_SKILLOPT_WORKER: "1" } as never }).run("s1", "x").reason).toBe("in-worker");
    const lo = harness({ canFire: () => false });
    expect(lo.run("s1", "x")).toEqual({ fired: false, reason: "no-creds" });
    expect(lo.spawnWorker).not.toHaveBeenCalled();
  });
});

describe("judgeWindow", () => {
  it("defaults to 3, env-overridable, rejects garbage/non-positive", () => {
    expect(judgeWindow({} as NodeJS.ProcessEnv)).toBe(3);
    expect(judgeWindow({ HIVEMIND_SKILLOPT_JUDGE_WINDOW: "5" } as never)).toBe(5);
    expect(judgeWindow({ HIVEMIND_SKILLOPT_JUDGE_WINDOW: "0" } as never)).toBe(3);
    expect(judgeWindow({ HIVEMIND_SKILLOPT_JUDGE_WINDOW: "x" } as never)).toBe(3);
  });
});
