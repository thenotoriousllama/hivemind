---
name: hivemind-goals
description: Create, track and update team goals + KPIs through the Deeplake VFS. Use whenever the user mentions a goal, objective, KPI, target, milestone, or asks to track progress on something measurable.
allowed-tools: Bash
---

# Hivemind Goals

Track goals and KPIs via simple JSON files in the Deeplake VFS at `~/.deeplake/memory/goals/`. Each file is one goal; writes are persisted to the org-shared `hivemind_goals` table automatically (versioned, every write produces v=N+1 — no UPDATEs).

## When to use this skill

Activate when the user expresses any of:
- "I want to track X / aim for X"
- "add a goal", "add a KPI", "track my progress on Y"
- "what are my goals right now?"
- "mark this as done"
- "shipping X by Friday", "5 PRs this week", any measurable target

If the user says something like "list my goals", read the directory `~/.deeplake/memory/goals/` and show what's there. If empty, ask if they want to create one.

## File layout

```
~/.deeplake/memory/goals/<goal-uuid>.json
```

One file per goal. The filename's UUID is the stable identifier across versions.

## JSON schema

```json
{
  "goal_id": "g-aaa-bbb-ccc",
  "text": "ship the goals feature",
  "scope": "me",
  "status": "active",
  "assigned_to": "alice@activeloop.ai",
  "assigned_by": "alice@activeloop.ai",
  "kpis_status": "ready",
  "kpis": [
    {
      "kpi_id": "k-pr",
      "name": "PRs merged",
      "target": 5,
      "current": 2,
      "unit": "count",
      "generated_by": "claude-opus-4-7",
      "generated_at": "2026-05-21T10:00:00Z"
    }
  ]
}
```

Required fields: `goal_id`, `text`, `scope`, `status`, `assigned_to`, `assigned_by`, `kpis_status`, `kpis`.

- `scope`: `"me"` (personal) or `"team"` (visible to everyone in the org at SessionStart)
- `status`: `"active"` or `"done"`
- `kpis_status`: `"pending"` (LLM gen still running), `"ready"` (KPIs populated), or `"manual"` (user-defined, skip LLM)
- `kpis` is an array; each element must include `kpi_id`, `name`, `target` (positive integer), `current`, `unit`. Newlines in any string field are forbidden (sanitized at SessionStart inject — see prompt-injection note below).

## Operations

### 1. Create a new goal

When the user expresses a new goal:

1. Generate a UUIDv4 via `uuidgen` or `node -e 'console.log(crypto.randomUUID())'`.
2. Write the file with `kpis: []`, `kpis_status: "pending"`:
   ```json
   {
     "goal_id": "<uuid>",
     "text": "<user's goal text on ONE line, no newlines>",
     "scope": "me",
     "status": "active",
     "assigned_to": "<current user email — get from hivemind whoami if needed>",
     "assigned_by": "<same>",
     "kpis_status": "pending",
     "kpis": []
   }
   ```
3. Respond to the user that the goal is created and KPI generation is running in background.
4. **AFTER responding**, spawn LLM KPI generation in a separate Bash call, detached, fire-and-forget:
   ```bash
   nohup codex exec --dangerously-bypass-approvals-and-sandbox - "<KPI_GEN_PROMPT goal-id=<id> text='<text>'>" > /dev/null 2>&1 &
   ```
   The LLM prompt instructs the model to read the file, fill `kpis` with 2-4 measurable KPIs, set `kpis_status: "ready"`, and write back. See "KPI generation prompt" below for the exact prompt body.

### 2. List goals

```bash
ls ~/.deeplake/memory/goals/
```
Read each `<id>.json` and present a summary: text, status, KPI progress (`name: current/target unit`).

### 3. Edit goal text

1. Read the file.
2. Modify only the `text` field.
3. Write the entire JSON back.

KPIs and other fields carry over. The VFS produces v=N+1 in the table.

### 4. Add a KPI manually

1. Read the file.
2. Generate a `kpi_id` (e.g. `k-<short-slug>` like `k-prs`, `k-demos`).
3. Append `{kpi_id, name, target, current: 0, unit, generated_by: "manual", generated_at: <ISO>}` to `kpis`.
4. Optionally set `kpis_status: "manual"` if the user is overriding LLM defaults.
5. Write the entire JSON back.

### 5. Record progress on a KPI

When the user reports progress (e.g. "I merged 2 PRs", "demo recorded"):

1. Read the file.
2. Find the matching KPI by name or kpi_id.
3. Increment `current` by the reported delta.
4. Write the entire JSON back.

Auto-progress from commits is handled by the capture hook — you do NOT need to manually count merges; check the file first to see what's already there.

### 6. Reassign

1. Read.
2. Change `assigned_to`.
3. Write.

### 7. Mark done

1. Read.
2. Set `status: "done"`.
3. Write.

Done goals stay in the table for audit but stop appearing in SessionStart injection.

## Read-before-write protocol — CRITICAL

ALWAYS read the file before writing. Other agents, the async KPI worker, or the capture hook may have written a newer version since you last looked. Reading right before write minimizes the last-writer-wins race (acceptable in v1, mitigated by read-before-write).

If you only have part of the data (e.g. just the new KPI value), DO NOT write a partial JSON — that would clobber every other field on the version-bumped row. Always reconstruct the full JSON from the file you just read.

## KPI generation prompt (for the async background call)

When spawning `claude -p` for KPI generation, use this prompt body:

```
Read ~/.deeplake/memory/goals/<goal-id>.json. The "text" field describes a goal. Generate 2-4 measurable KPIs and append them to the "kpis" array. Each KPI must have:
- kpi_id: short slug like "k-prs" or "k-demos"
- name: human-readable label
- target: positive integer
- current: 0
- unit: "count" | "lines" | "hours" | etc.
- generated_by: "<your-model-id>"
- generated_at: <ISO 8601 timestamp>

Output rules:
- Do NOT change "text", "scope", "status", "assigned_to", "assigned_by", or "goal_id"
- Set "kpis_status" to "ready" after appending
- Write the complete JSON back to the same file path
- Do not include any explanation outside the file write

If the goal text is too vague to derive KPIs (e.g. "be happier"), set kpis_status to "manual" and leave kpis empty.
```

## Auto-extract from commits

When the user runs `git commit`, a PostToolUse hook may spawn an async LLM call that analyzes the commit diff against the user's active goals and bumps any KPI it judges relevant. This is fire-and-forget; the user does not block on it. To disable globally: `HIVEMIND_AUTO_KPI_FROM_COMMITS=false`.

Auto-bumps write to the same JSON file with the same protocol. There is no dedup in v1 (acceptable double-count); the user can correct manually.

## Prompt-injection note

The SessionStart context renderer sanitizes line terminators (CR, LF, CRLF, U+2028, U+2029, U+0085) in `text`, KPI `name`, and KPI `unit` before injecting into model context. The VFS write path validators reject these characters up front. Do not include newlines in any string field; keep goal text and KPI labels on one line each.

## What NOT to do

- Do NOT use `hivemind tasks add` / `hivemind tasks edit` / `hivemind tasks progress` — those legacy CLI commands belong to an earlier design and may be removed. Always use the VFS file layout above.
- Do NOT write to `~/.deeplake/memory/goals/` with partial JSON. Always reconstruct the full record.
- Do NOT spawn the KPI gen call BEFORE responding to the user — they should not wait for the LLM.
- Do NOT block on the KPI gen call — it must be detached (`nohup ... &`).
