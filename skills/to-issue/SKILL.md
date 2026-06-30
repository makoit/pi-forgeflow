---
name: to-issue
description: >
  Convert conversation context (or an existing forge/prd.md) into a tracker issue and publish it
  to the project issue tracker. Saves a local copy at forge/issues/<slug>.md with status: todo
  for use with ralph. Use when user wants to publish work to the tracker, create a
  ready-for-implementation issue, or says "use to-issue".
---

This skill takes the current conversation context and codebase understanding and produces a ready-for-implementation tracker issue. Do NOT interview the user — just synthesize what you already know.

Before publishing, ask the user which issue tracker they use (GitHub Issues, GitLab Issues, Jira, Linear, etc.) and what triage label (if any) should be applied — unless this has already been established in the conversation.

## Input artifact

Before writing, check whether `forge/prd.md` exists. If it does, read it and use it as the primary source. Merge with the current conversation context. Do not re-derive information already captured there.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. If the codebase is empty or does not yet exist, skip this step and base the issue on the conversation context alone. Use the project's domain glossary vocabulary throughout the PRD, and respect any ADRs in the area you're touching.

2. Sketch out the major modules you will need to build or modify to complete the implementation. Actively look for opportunities to extract deep modules that can be tested in isolation.

A deep module (as opposed to a shallow module) is one which encapsulates a lot of functionality in a simple, testable interface which rarely changes.

Check with the user that these modules match their expectations. Check with the user which modules they want tests written for.

3. Write the PRD using the template below, then publish it to the project issue tracker. Apply the team's agreed triage label if one was provided (e.g., `ready-for-agent`, `ready-for-review`); skip the label if unknown.

## Output artifact

After publishing to the tracker, also save the issue as a local Markdown file at `forge/issues/<kebab-case-title>.md`. Create `forge/issues/` if it does not exist. This file is the direct input for `ralph`.

Use this frontmatter in the local issue file:

```markdown
---
title: <issue title>
status: todo
tracker-url: <link to the published tracker issue>
---
```

followed by the full PRD body.

<prd-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this PRD.

## Further Notes

Any further notes about the feature.

</prd-template>
