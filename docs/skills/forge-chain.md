# forge-chain

Runs the entire ForgeFlow pipeline — [grill-me](grill-me.md) → [to-prd](to-prd.md) → [to-issue](to-issue.md) → [ralph](ralph.md) — in one command. The chain is artifact-driven: it detects which artifacts already exist in `forge/current/` and resumes from the correct phase automatically, so you never need to remember the sequence or which skill feeds which.

## Invoke

Say `forge chain`, `run the chain`, `full workflow`, or `/forge-chain`.

## Phases

| # | Phase | Skill | Type | Artifact |
|---|-------|-------|------|----------|
| 1 | Intake | grill-me | interactive | `forge/current/decisions.md` |
| 2 | Specification | to-prd | automated | `forge/current/prd.md` |
| 3 | Issue breakdown | to-issue | interactive | `forge/current/issues/*.md` |
| 4 | Implementation | ralph | automated (opt-in) | `forge/current/issues/agent.*.md` |

Interactive phases (1 and 3) pause after writing their artifact and prompt you to re-invoke the chain. Phase 4 asks for explicit confirmation before writing any code.

## Phase detection

The filesystem determines where the chain resumes:

| Condition | Phase to run |
|---|---|
| No `forge/current/decisions.md` | Phase 1 — grill-me |
| `decisions.md` exists, no `prd.md` | Phase 2 — to-prd |
| `prd.md` exists, no issues | Phase 3 — to-issue |
| Issues with `status: todo` or `in-progress` | Phase 4 — ralph |
| All issues `status: done` | ✅ Chain complete — offers a new cycle |

## First-time setup

On a fresh chain (no `forge/current/chain.md`):

- If `forge/current/` still contains artifacts from a previous cycle, [forge-new](forge-new.md) is invoked inline so you can archive or discard them first.
- The chain explains [caveman mode](caveman.md) and offers to enable it — recommended, since the chain spans many turns.
- `forge/current/chain.md` is written with the initial state.

## State file

Progress is tracked in `forge/current/chain.md` — topic, caveman preference, a phase status table (`pending` / `in-progress` / `done` / `blocked`), and notes about deviations or skipped phases. Because state lives in the filesystem, the chain can be resumed in a completely new session.

## Skipping phases

If you already have an artifact ("I already have decisions"), the chain accepts it and advances to the next phase, recording the skip in the state file's notes.

## Error handling

If a phase fails, the chain does not advance. The phase is marked `blocked` in `chain.md` and the chain reports what failed and what you need to do to recover.

## Example session

```
You: /forge-chain
Pi:  Caveman mode cuts token usage ~75% for long sessions. Enable it?
You: yes
Pi:  Mode active. Phase 1 — Intake. [grill-me interview begins, one question at a time]
     ...all decisions resolved, forge/current/decisions.md written...
     Phase 1 complete. Invoke the chain again to continue.

You: /forge-chain
Pi:  [Phase 2 — to-prd runs automatically → forge/current/prd.md written]
     Phase 2 complete. Invoke the chain again to continue.

You: /forge-chain
Pi:  [Phase 3 — to-issue quiz, approve breakdown → forge/current/issues/*.md written]
     Phase 3 complete. Invoke the chain again to start implementation.

You: /forge-chain
Pi:  Ready to start automated implementation. Ralph will process all issues. Continue?
You: yes
Pi:  [Phase 4 — ralph implements all issues]
     ✅ Chain complete. Would you like to start a new cycle?
```
