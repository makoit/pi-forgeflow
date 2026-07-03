# ForgeFlow

[![version](https://img.shields.io/badge/version-0.1.1-blue)](https://github.com/makoit/pi-forgeflow/releases/tag/v0.1.1)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/makoit/pi-forgeflow/blob/main/LICENSE)

**ForgeFlow** is a Pi package for professional software engineering workflows.

It helps Pi coding agents support disciplined software delivery across the full engineering lifecycle: requirements, specification, architecture, implementation, testing, review, documentation, and release readiness.

## Current Release

**v0.1.1** — bug fix release.

Ships five skills covering the full engineering lifecycle: compressed communication, design review, PRD authoring, issue tracking, and automated issue implementation.

📋 [Full changelog →](CHANGELOG.md)

## Installation

Install ForgeFlow into your Pi environment directly from GitHub:

```bash
pi install git:github.com/makoit/pi-forgeflow
```

Or using an HTTPS URL:

```bash
pi install https://github.com/makoit/pi-forgeflow
```

To pin to a specific release:

```bash
pi install git:github.com/makoit/pi-forgeflow@v0.1.0
```

Verify the package is loaded:

```bash
pi list
```

You should see `@martinkovacs/pi-forgeflow` in the output.

To install from the local repository (development):

```bash
pi install .
```

## Workflow: From Idea to Implementation

The five skills form a natural end-to-end pipeline. Each step produces a Markdown artifact that becomes the structured input for the next step — so you can close a session at any point and resume without losing context.

```
idea
  │
  ▼
① grill-me ──────────────────────── produces → forge/decisions.md
  │                                              │
  ▼                                              ▼
② to-prd ──── reads forge/decisions.md ── produces → forge/prd.md
  │                                              │
  ▼                                              │
③ to-issue ── reads forge/prd.md ────────── produces → forge/issues/<slug>.md
  │                                                      + tracker issue
  ▼
④ ralph ───── reads forge/issues/*.md ───── produces → forge/issues/agent.<slug>.md
  │
  ▼
finished implementation
```

> **Tip:** activate `caveman` at any point in the pipeline to cut token usage by ~75%.

**① grill-me — stress-test the idea**  
Before writing anything down, let Pi interview you about every aspect of the idea. Each question comes with a recommended answer. Work through all branches until there are no open decisions. When complete, Pi writes **`forge/decisions.md`** — a structured table of every question, chosen answer, and rationale.

**② to-prd — write the PRD**  
`to-prd` reads `forge/decisions.md` as primary input and synthesises the conversation into a structured PRD. The result is saved as **`forge/prd.md`** and published to the issue tracker.

**③ to-issue — publish the work item**  
`to-issue` reads `forge/prd.md` and publishes the issue to the tracker with the `ready-for-agent` label. It also saves a local copy as **`forge/issues/<slug>.md`** with `status: todo` frontmatter — the exact format ralph expects.

**④ ralph — implement**  
`ralph` reads every `forge/issues/*.md` file where `status: todo`, calls the Pi CLI to implement the described work, runs tests, and sets `status: done` when verified. Each processed issue produces a **`forge/issues/agent.<slug>.md`** audit file.

---

## Using ForgeFlow in Pi

Once installed, ForgeFlow's skills are available in every Pi conversation. You invoke them by describing what you want — Pi will match the description and activate the skill automatically — or by calling them explicitly.

### caveman

Reduces token usage by ~75% by stripping filler while keeping full technical accuracy. Useful for long sessions or bandwidth-constrained contexts.

**Invoke:** say `caveman mode`, `less tokens`, `talk like caveman`, or `/caveman`  
**Deactivate:** say `stop caveman` or `normal mode`

```
You: caveman mode
Pi:  Mode active.

You: why is my background job processing orders out of order?
Pi:  Queue lack ordering guarantee. Use priority queue or add sequence field + sort on consume.
```

### grill-me

Interviews you relentlessly about a plan or design, walking down every branch of the decision tree. Each question comes with a recommended answer. Useful for stress-testing an idea before committing to it.

**Invoke:** say `grill me on this`, `stress-test this plan`, or `use grill-me`

```
You: grill me on my decision to use a monorepo
Pi:  Q1: How many teams will commit to this repo simultaneously? (Recommended: ≤3 for low coordination overhead)
...
```

### ralph

Runs an automated agent loop over a directory of Markdown issue files. For each `.md` file it calls the Pi CLI, implements the described issue, runs tests, and marks the issue `done` when verified.

**Invoke:** say `use ralph` or run `ralph.py` directly:

```bash
# Default (uses co CLI)
python skills/ralph/ralph.py --directory ./forge/issues

# With a specific agent CLI
python skills/ralph/ralph.py --directory ./forge/issues --cli "pi"
python skills/ralph/ralph.py --directory ./forge/issues --cli "co" --model gpt-5.4:medium

# For CLIs that do not support --print (e.g. claude), add --no-print
python skills/ralph/ralph.py --directory ./forge/issues --cli "claude" --no-print
```

Issue files are plain Markdown. Ralph iterates until tests pass, then writes an `agent.<filename>.md` result file.

### to-issue

Converts the current conversation context and codebase understanding into a ready-for-implementation tracker issue and publishes it to the project issue tracker. Asks which tracker you use (GitHub Issues, GitLab, Jira, Linear, etc.) and which triage label to apply if not already known.

**Invoke:** say `create issue from this`, `publish PRD`, or `use to-issue`

```
You: use to-issue — we just agreed on the caching layer design
Pi:  [explores repo, drafts issue body, publishes issue #42 with your team's triage label]
```

### to-prd

Same as `to-issue` but focused on producing the PRD document itself rather than publishing a tracker issue. Useful when you want to review the PRD before it becomes a ticket.

**Invoke:** say `write a PRD for this`, `turn this into a PRD`, or `use to-prd`

---

## Engineering Lifecycle

ForgeFlow supports seven phases:

1. **Intake** — clarify goals, constraints, non-goals, and acceptance criteria
2. **Specification** — convert requests into concrete, observable requirements
3. **Architecture** — prefer simple, evolvable designs with documented trade-offs
4. **Implementation** — focused, incremental changes that keep code readable and testable
5. **Verification** — tests, type checks, linting, and package checks
6. **Review** — correctness, maintainability, security, and developer experience
7. **Release** — semantic versioning, updated docs and changelog, correct package contents

## Repository Layout

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml        # Validates package on push/PR
│       └── release.yml   # Creates a GitHub Release on version tags
├── extensions/           # Executable extension code
├── forge/                # Workflow artifacts (commit or gitignore — team preference)
│   ├── decisions.md      # ← written by grill-me
│   ├── prd.md            # ← written by to-prd
│   └── issues/           # ← written by to-issue, read by ralph
├── skills/               # Pi skills (each with a SKILL.md)
│   ├── caveman/
│   ├── grill-me/
│   ├── ralph/
│   ├── to-issue/
│   └── to-prd/
├── prompts/              # Reusable prompt templates
├── themes/               # Pi theme assets
├── examples/             # Demonstration projects and sample usage
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── AGENTS.md
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
