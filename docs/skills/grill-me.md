# grill-me

Interviews you relentlessly about a plan or design, walking down every branch of the decision tree until a shared understanding is reached. Each question comes with a recommended answer. Useful for stress-testing an idea before committing to it.

Questions are asked one at a time. If a question can be answered by exploring the codebase, the skill explores the codebase instead of asking you.

## Invoke

Say `grill me on this`, `stress-test this plan`, or `use grill-me`.

## Guard: active session check

Before starting, the skill checks whether `forge/current/decisions.md` already exists. If it does, you are offered three options: continue the existing interview, archive the old cycle and start fresh, or discard it and start fresh. The archive/discard paths run [forge-new](forge-new.md) inline.

## Output artifact

When the interview is complete (all branches resolved, no open decisions remaining), the skill writes **`forge/current/decisions.md`**:

```markdown
# Decisions: <topic>

_Date: YYYY-MM-DD_

## Resolved Decisions

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | <question asked> | <chosen answer> | <brief reason> |

## Constraints and Non-Goals

- <constraint or non-goal captured during the interview>

## Open Items

- <anything deferred or flagged for later — empty if none>
```

This file is the primary input for [to-prd](to-prd.md), the next step in the [pipeline](../workflow.md).

## Example

```
You: grill me on my decision to use a monorepo
Pi:  Q1: How many teams will commit to this repo simultaneously?
     Recommended: ≤3 for low coordination overhead.
...
[all branches resolved]
Pi:  Writing forge/current/decisions.md...
```
