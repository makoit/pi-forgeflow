# to-issue

Breaks a plan, spec, or PRD into independently-grabbable issues using **tracer-bullet vertical slices**. Presents the proposed breakdown, quizzes you on granularity and dependencies, then publishes each approved issue to the tracker and saves a local copy in the exact format [ralph](ralph.md) expects.

## Invoke

Say `create issues from this`, `break this into issues`, or `use to-issue`. You can also pass an issue reference (number, URL, or path) as an argument — the skill fetches it from the tracker and reads its full body and comments.

This skill is explicit-invocation only (`disable-model-invocation: true`) — Pi will not trigger it on its own.

## Input artifact

If `forge/current/prd.md` exists (written by [to-prd](to-prd.md)), it is used as the primary source, merged with the current conversation.

## Guard: existing issues check

If `forge/current/issues/` already contains `.md` files, the skill pauses and offers to overwrite them, run [forge-new](forge-new.md) first, or cancel.

## Vertical slices

Each issue is a thin vertical slice that cuts through **all** integration layers end-to-end (schema, API, UI, tests) — not a horizontal slice of one layer:

- Each slice delivers a narrow but complete path through every layer
- A completed slice is demoable or verifiable on its own
- Any prefactoring is done first ("make the change easy, then make the easy change")

## The quiz

The proposed breakdown is presented as a numbered list showing each slice's title, blockers, and covered user stories. You are asked whether the granularity feels right, whether the dependencies are correct, and whether slices should be merged or split. The skill iterates until you approve.

## Output artifacts

For each approved slice:

- A tracker issue, published in dependency order (blockers first) with the agent-ready triage label
- A local file **`forge/current/issues/<kebab-case-title>.md`** with this frontmatter:

```markdown
---
title: <issue title>
status: todo
tracker-url: <link to the published tracker issue>
---
```

followed by the issue body (what to build, acceptance criteria, blockers). These files are the direct input for [ralph](ralph.md), the final step in the [pipeline](../workflow.md).

## Example

```
You: use to-issue
Pi:  [reads forge/current/prd.md, proposes vertical slices]
     [quiz: "Does the granularity feel right?"]
     [on approval: publishes issues, writes forge/current/issues/*.md]
```
