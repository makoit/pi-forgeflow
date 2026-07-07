---
name: forge-chain
description: Run the full ForgeFlow pipeline in sequence — grill-me → to-prd → to-issue → ralph. Automatically resumes from the last completed artifact. Use when the user wants to run the full workflow without manually invoking each skill, or mentions "forge chain", "run the chain", or "full workflow".
---

# ForgeFlow Chain

You are orchestrating the full ForgeFlow engineering workflow. The chain is artifact-driven: each phase writes files to `forge/current/`. When invoked, detect what already exists and resume from the correct phase.

## Step 0: First-time setup (run once per chain)

Before starting Phase 1, check whether `forge/current/chain.md` exists.

**If it does not exist**, this is a fresh chain. But first, check whether `forge/current/` contains any artifacts from a previous cycle (e.g., `decisions.md`, `prd.md`, or `issues/*.md`):

- If artifacts are found, invoke the `forge-new` skill inline to let the user archive or discard the old cycle before continuing.

Once `forge/current/` is clean, proceed with first-time setup:

1. Explain caveman mode and offer it to the user:

   > **Caveman mode** strips filler, articles, and pleasantries from responses while keeping full technical accuracy. It cuts token usage ~75% and makes long workflows faster to read. Recommended for the ForgeFlow chain since it spans many turns.
   >
   > Would you like to enable caveman mode for this session?

2. If the user agrees, activate caveman mode now (apply it to all subsequent responses in this session).

3. Write `forge/current/chain.md` with the initial state (see State file section below). Create `forge/current/` if it does not exist.

**If `forge/current/chain.md` already exists**, skip this setup — caveman preference was already set in the previous session. Read `forge/current/chain.md` to orient yourself, then proceed directly to phase detection.

---

## Phase detection

Check the filesystem to determine the current phase:

| Condition | Phase to run |
|---|---|
| No `forge/current/decisions.md` | **Phase 1** — grill-me |
| `forge/current/decisions.md` exists, no `forge/current/prd.md` | **Phase 2** — to-prd |
| `forge/current/prd.md` exists, no `forge/current/issues/*.md` (excluding `.gitkeep`) | **Phase 3** — to-issue |
| `forge/current/issues/*.md` with `status: todo` or `status: in-progress` | **Phase 4** — ralph |
| All issues have `status: done` | ✅ Chain complete — offer new cycle |

---

## Phase 1 — Intake & Decisions (interactive)

Run the `grill-me` skill inline: interview the user relentlessly about their plan, one question at a time, resolving every decision branch.

When the interview is complete:
- Write `forge/current/decisions.md` as specified in the grill-me skill.
- Update Phase 1 status to `done` in `forge/current/chain.md`.
- Tell the user:

  > Phase 1 complete. Invoke the chain again to continue to Phase 2 (Specification).

Then stop. Do not proceed to Phase 2 automatically.

---

## Phase 2 — Specification (automated)

Run the `to-prd` skill inline. Read `forge/current/decisions.md` as primary input. Synthesize the PRD, check test seams with the user, then write `forge/current/prd.md` and publish to the issue tracker.

When done:
- Update Phase 2 status to `done` in `forge/current/chain.md`.
- Tell the user:

  > Phase 2 complete. Invoke the chain again to continue to Phase 3 (Issue Breakdown).

Then stop.

---

## Phase 3 — Issue Breakdown (interactive)

Run the `to-issue` skill inline. Read `forge/current/prd.md` as primary input. Present the proposed vertical slice breakdown, quiz the user, iterate until approved, then publish issues and write `forge/current/issues/*.md`.

When done:
- Update Phase 3 status to `done` in `forge/current/chain.md`.
- Tell the user:

  > Phase 3 complete. Invoke the chain again to start Phase 4 (Implementation via ralph).

Then stop.

---

## Phase 4 — Implementation (automated)

Before launching ralph, confirm with the user:

> Ready to start automated implementation. Ralph will process all issues in `forge/current/issues/`. This will write code. Continue?

If confirmed, run ralph by invoking:

```bash
node skills/ralph/ralph.mjs --directory ./forge/current/issues
```

When complete:
- Update Phase 4 status to `done` in `forge/current/chain.md`.
- Tell the user the chain is complete and summarize what was delivered.

---

## Chain complete — new cycle

When all issues have `status: done`, present:

> ✅ Chain complete. All issues implemented.
>
> Would you like to start a new cycle for a new idea?
> **[1] Yes** — invoke `forge-new` to archive this cycle and start fresh
> **[2] No** — stay here

If the user confirms, invoke the `forge-new` skill inline.

---

## State file

Maintain `forge/current/chain.md` throughout:

```markdown
# ForgeFlow Chain

_Started: YYYY-MM-DD_
_Topic: <topic from user input or decisions.md>_
_Caveman mode: yes/no_

## Phases

| Phase | Description | Status | Completed |
|-------|-------------|--------|-----------|
| 1 | Intake — grill-me | pending/in-progress/done | — |
| 2 | Specification — to-prd | pending/in-progress/done | — |
| 3 | Issue Breakdown — to-issue | pending/in-progress/done | — |
| 4 | Implementation — ralph | pending/in-progress/done | — |

## Notes

- <deviations, skipped phases, or user decisions recorded here>
```

Update this file at the start and end of each phase.

---

## Skipping phases

If the user says they already have an artifact (e.g., "I already have decisions"), accept it and advance:

- `forge/current/decisions.md` already written → skip Phase 1, start from Phase 2
- `forge/current/prd.md` already written → skip to Phase 3
- Issues already created → skip to Phase 4

Record the skip in the Notes section of `forge/current/chain.md`.

---

## Error handling

If a phase fails (artifact not written, error encountered):
- Do not advance to the next phase.
- Update the phase status to `blocked` in `forge/current/chain.md`.
- Report clearly what failed and what the user needs to do to recover.
