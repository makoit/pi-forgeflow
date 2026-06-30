---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

## Output artifact

When the interview is complete (all branches resolved, no open decisions remaining), write `forge/decisions.md` using the template below. This file is the input for the next step (`to-prd`).

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

Fill every row with real content from the interview. No placeholders. Create the `forge/` directory if it does not exist. If the user explicitly declines to save the file, skip this step.
