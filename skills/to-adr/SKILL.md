---
name: to-adr
description: Generate or update Architecture Decision Records (ADRs) based on specific context, constraints, trade-offs, and rollout details. Use when user asks to create an ADR, document an architecture decision, or capture trade-offs for a system, technology, or process choice.
---

You are an expert architecture decision author. Your job is to turn provided context into a complete, professional ADR document.

This skill is repository-agnostic. It produces a standalone Markdown file that any team can place in their docs.

## Input artifacts

Before writing the ADR, check for the following files and read any that exist:

- `forge/decisions.md` — resolved design decisions from `grill-me`; use the relevant row(s) as the primary source for Context and Decision sections
- `forge/prd.md` — use Implementation Decisions and Out of Scope sections to inform Consequences and Rationale

Do not re-ask questions already answered in these files.

## When to use this skill

Use when the request includes any of:

- "create ADR"
- "architecture decision record"
- "document this decision"
- "capture trade-offs"
- "write decision proposal for platform/system/technology/process"

## Output location

1. Ask the user (or infer from context) where ADR files live in their project.
2. If unknown, default to `forge/adrs/` in the current working directory (create the directory if it does not exist).
3. Name files in `kebab-case` using the decision subject, e.g. `use-react-for-frontend.md` or `apigee-as-api-gateway.md`.
4. Use `.md` unless the project uses `.mdx` (check existing files in the ADR folder first).

## ADR template

Generate every ADR using this exact structure and section order. Fill every section with real content — no placeholders. For status and author, ask the user if not provided.

```markdown
# <Short decision title>

- **Date:** <YYYY-MM-DD>
- **Status:** <proposed | accepted | deprecated | superseded | rejected | accepted with minor changes>
- **Author(s):** <name(s)>
- **Related ADRs:** <links or "none">

## Context

Describe the architectural context and the problem that requires a decision. Include:

- Background information and constraints
- System goals and non-functional requirements impacted (e.g. scalability, maintainability, security)
- Relevant current architecture, technologies, or organizational factors
- Any stakeholder concerns or compliance needs

## Decision

State the decision clearly and unambiguously. Provide:

- What is being decided (technology, pattern, interface, process)
- A concise one-sentence summary of the chosen option
- Scope and boundaries (what is included/excluded)

## Rationale

Explain why this decision was made. Cover:

- Pros and cons of the chosen option vs. alternatives
- Trade-offs with respect to the stated constraints and non-functional requirements
- Cost, effort, risk and timeline implications
- Results of experiments, benchmarks, prototypes or spike outcomes (if applicable)

## Options Considered

List and briefly evaluate the alternatives considered (including rejected ones).

1. **Option A — <name>**
   - Description: ...
   - Pros: ...
   - Cons: ...
   - Outcome: selected / rejected / fallback

2. **Option B — <name>**
   - Description: ...
   - Pros: ...
   - Cons: ...
   - Outcome: selected / rejected / fallback

## Consequences

Describe expected consequences (positive and negative):

- Operational and maintenance impacts
- Migration or rollout plan and required steps
- Backward-compatibility considerations and data migration needs
- Monitoring, testing, and verification approach
- Ownership and responsibilities

## Implementation

Actionable guidance for implementing the decision:

- Specific tasks, code repos, infra changes, configuration, or API changes
- Links to relevant design docs, prototypes, tickets, or PRs
- Migration plan or timelines if non-trivial
- Rollout and rollback strategy

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| <Risk 1> | Low/Medium/High | Low/Medium/High | <mitigation action + owner> |
| <Risk 2> | Low/Medium/High | Low/Medium/High | <mitigation action + owner> |


## References

- <Relevant RFCs, standards, benchmarks, vendor docs, or internal policies>
- <Experimental data, test results, or decision-support artifacts>
- <Links to related architecture documentation>
```

## Content quality rules

- **No placeholder text** in the final ADR. Replace every `<...>` with real content derived from the provided context.
- Decision statement must be explicit, testable, and scoped — avoid vague language like "we will consider" or "we might use".
- **Options considered** must include at least 2 concrete alternatives with pros/cons and a clear selected/rejected/fallback outcome for each.
- **Consequences** and **Implementation** must be actionable and specific to the impacted systems, repos, services, config, or APIs.
- **Risks** must include a mitigation owner or mechanism where possible.
- **References** should include concrete links if available from context; skip the section if truly none exist.

## Missing information handling

- If critical information is missing (e.g. no decision stated, no options provided), ask focused follow-up questions before writing.
- If only minor details are missing, write the ADR with explicit assumptions and mark them in **Context** or **Revisions**.
- Assumptions format: `> **Assumption:** <description>`

## Status values

Use only these values for Status:

- `proposed` — decision is under review
- `accepted` — decision is approved and active
- `deprecated` — superseded by newer practice, but not formally replaced
- `superseded` — replaced by another ADR (link it)
- `rejected` — considered and not adopted
- `accepted with minor changes` — accepted with noted modifications

## Final behavior

- Write the ADR file directly into the repository at the agreed path.
- Keep wording concise, architectural, and decision-focused.
- If the project uses `.mdx` and custom components (e.g. `<DocHeader />`), adapt the output to match those conventions after inspecting existing ADR files in the project.
