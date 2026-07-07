# to-prd

Turns the current conversation and prior decisions into a structured PRD — no interview, just synthesis of what has already been discussed. Explores the codebase, identifies test seams, checks them with you, then saves the PRD and publishes it to the issue tracker.

## Invoke

Say `write a PRD for this`, `turn this into a PRD`, or `use to-prd`.

This skill is explicit-invocation only (`disable-model-invocation: true`) — Pi will not trigger it on its own.

## Input artifact

If `forge/current/decisions.md` exists (written by [grill-me](grill-me.md)), the skill reads it and uses the resolved decisions, constraints, and non-goals as primary input, merged with the current conversation. Questions already answered there are not re-asked.

## Guard: conflicting artifact check

If `forge/current/prd.md` already exists and appears to belong to a different feature, the skill pauses and offers to overwrite it, run [forge-new](forge-new.md) first, or cancel. A clear continuation of the same feature skips this guard.

## Process

1. **Explore the repo** to understand the current state of the codebase, using the project's domain glossary vocabulary and respecting any ADRs in the touched area.
2. **Sketch test seams.** Existing seams are preferred over new ones, at the highest point possible — the ideal number of seams is one. The proposed seams are checked with you before the PRD is finalized.
3. **Write and publish.** The PRD is written from a fixed template and published to the issue tracker with the `ready-for-agent` triage label.

## Output artifact

**`forge/current/prd.md`** with these sections:

- **Problem Statement** — the problem from the user's perspective
- **Solution** — the solution from the user's perspective
- **User Stories** — an extensive numbered list (`As an <actor>, I want <feature>, so that <benefit>`)
- **Implementation Decisions** — modules, interfaces, architecture, schemas, API contracts (no file paths or code snippets, which go stale — except decision-rich prototype snippets)
- **Testing Decisions** — what makes a good test, which modules are tested, prior art
- **Out of Scope**
- **Further Notes**

This file is the primary input for [to-issue](to-issue.md), the next step in the [pipeline](../workflow.md).

## Example

```
You: use to-prd
Pi:  [reads forge/current/decisions.md, explores repo, drafts PRD]
     [checks proposed test seams with you]
     [writes forge/current/prd.md, publishes tracker issue]
```
