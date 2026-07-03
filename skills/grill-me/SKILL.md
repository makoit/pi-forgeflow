---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

## Guard: check for active session

Before starting the interview, check whether `forge/current/decisions.md` exists.

**If it does exist**, read it and extract the topic and date. Then pause and inform the user:

> ⚠️ An active session was found: **<topic>** (started: <date>).
>
> What would you like to do?
> **[1] Continue** — resume the existing interview and update `forge/current/decisions.md`
> **[2] Archive & start new** — save current work to `forge/archive/` and start fresh (runs `forge-new`)
> **[3] Discard & start new** — delete current work and start fresh (runs `forge-new`)

Wait for the user's choice before proceeding. If the user chooses [2] or [3], invoke the `forge-new` skill inline, then continue with the interview once the reset is complete.

---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Output artifact

When the interview is complete (all branches resolved, no open decisions remaining), write `forge/current/decisions.md` using the template below. This file is the input for the next step (`to-prd`). Create `forge/current/` if it does not exist.

```markdown
# Decisions: <topic>

_Date: YYYY-MM-DD_

## Resolved Decisions

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | <question asked> | <chosen answer> | <brief reason> |
| 2 | ... | ... | ... |

## Constraints and Non-Goals

- <constraint or non-goal captured during the interview>

## Open Items

- <anything deferred or flagged for later — empty if none>
```

Fill every row with real content from the interview. No placeholders. If the user explicitly declines to save the file, skip this step.
