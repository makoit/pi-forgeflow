# ForgeFlow

[![version](https://img.shields.io/badge/version-0.3.0-blue)](https://github.com/makoit/pi-forgeflow/releases/tag/v0.3.0)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/makoit/pi-forgeflow/blob/main/LICENSE)

**ForgeFlow** is a Pi package for professional software engineering workflows.

It helps Pi coding agents support disciplined software delivery across the full engineering lifecycle: requirements, specification, architecture, implementation, testing, review, documentation, and release readiness.

## Current Release

**v0.3.0** — adds `forge-chain` skill: a one-command orchestrator that runs the full pipeline (`grill-me` → `to-prd` → `to-issue` → `ralph`), detects the current phase from `forge/` artifacts, and resumes automatically across sessions.

Ships seven skills covering the full engineering lifecycle: a one-command chain, compressed communication, teaching mode, design review, PRD authoring, issue tracking, and automated issue implementation.

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

## Skills

Once installed, ForgeFlow's skills are available in every Pi conversation. Invoke them by describing what you want — Pi matches the description automatically — or call them explicitly by name.

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

### learn

Activates teaching mode. Solves the task completely while also explaining how the solution works, why that approach was chosen, relevant tradeoffs, and key takeaways the developer can reuse. Works standalone or as a post-workflow explainer after a ralph loop.

**Invoke:** say `learn`, `explain this`, `teach me`, `walk me through`, or `/learn`

```
You: /learn explain what ralph just implemented
Pi:  [reads the codebase changes, explains each part — mechanics, design decisions, tradeoffs, and reusable patterns]

You: /learn add a test for this function and explain each assertion
Pi:  [writes the test, then walks through what each assertion checks and why it matters]
```

### grill-me

Interviews you relentlessly about a plan or design, walking down every branch of the decision tree. Each question comes with a recommended answer. Useful for stress-testing an idea before committing to it.

When the interview is complete, Pi writes **`forge/decisions.md`** — a structured table of every question, chosen answer, and rationale. This file is the input for `to-prd`.

**Invoke:** say `grill me on this`, `stress-test this plan`, or `use grill-me`

```
You: grill me on my decision to use a monorepo
Pi:  Q1: How many teams will commit to this repo simultaneously?
     Recommended: ≤3 for low coordination overhead.
...
[all branches resolved]
Pi:  Writing forge/decisions.md...
```

### to-prd

Reads `forge/decisions.md` as primary input and synthesises everything into a structured PRD. Explores the codebase, identifies test seams, and checks them with you before finalising. Saves the result as **`forge/prd.md`** and publishes it to the issue tracker.

**Invoke:** say `write a PRD for this`, `turn this into a PRD`, or `use to-prd`

```
You: use to-prd
Pi:  [reads forge/decisions.md, explores repo, drafts PRD]
     [checks proposed test seams with you]
     [writes forge/prd.md, publishes tracker issue]
```

### to-issue

Reads `forge/prd.md` and breaks the plan into independently-grabbable vertical slice issues. Presents the proposed breakdown, quizzes you on granularity and dependencies, then publishes each approved issue to the tracker and saves a local copy under **`forge/issues/<slug>.md`** — the exact format ralph expects.

**Invoke:** say `create issues from this`, `break this into issues`, or `use to-issue`

```
You: use to-issue
Pi:  [reads forge/prd.md, proposes vertical slices]
     [quiz: "Does the granularity feel right?"]
     [on approval: publishes issues, writes forge/issues/*.md]
```

### ralph

Runs an automated agent loop over every `.md` file in a directory. For each issue it calls the Pi CLI to implement the described work, runs tests, and marks the issue `done` when verified. Produces an **`forge/issues/agent.<slug>.md`** audit file per issue.

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

---

## Manual Pipeline

The four workflow skills form a natural end-to-end sequence. Each step produces a Markdown artifact in `forge/` that becomes the structured input for the next — so you can close a session at any point and resume without losing context.

```
idea
  │
  ▼
① grill-me ──────────────────────── produces → forge/decisions.md
  │                                              │
  ▼                                              ▼
② to-prd ──── reads forge/decisions.md ── produces → forge/prd.md
  │                                              │
  ▼                                              ▼
③ to-issue ── reads forge/prd.md ────────── produces → forge/issues/<slug>.md
  │                                                      + tracker issue
  ▼
④ ralph ───── reads forge/issues/*.md ───── produces → forge/issues/agent.<slug>.md
  │
  ▼
finished implementation
```

Run each skill when the previous one has written its artifact. You control the pace and can intervene between steps.

> **Tip:** Activate `caveman` at any point to cut token usage by ~75%. Use `learn` after any step — or after a full ralph loop — for a teaching-mode walkthrough of what was built and why.

---

## Chain: Full Pipeline in One Command

Once you understand the individual skills, `forge-chain` runs the entire pipeline for you. It detects which artifacts already exist in `forge/` and resumes from the correct phase automatically — no need to remember the sequence or which skill feeds which.

**Phases:**

| # | Phase | Skill | Type | Artifact |
|---|-------|-------|------|----------|
| 1 | Intake | grill-me | interactive | `forge/decisions.md` |
| 2 | Specification | to-prd | automated | `forge/prd.md` |
| 3 | Issue breakdown | to-issue | interactive | `forge/issues/*.md` |
| 4 | Implementation | ralph | automated (opt-in) | `forge/issues/agent.*.md` |

Interactive phases (1 and 3) pause after writing their artifact and prompt you to re-invoke. Phase 4 asks for explicit confirmation before writing code. Progress is tracked in `forge/chain.md` — the filesystem is the source of truth, so the chain can be resumed in a new session.

On first run, the chain offers **caveman mode** and explains the benefit before the interview begins.

**Invoke:** say `forge chain`, `run the chain`, `full workflow`, or `/forge-chain`

```
You: /forge-chain
Pi:  Caveman mode cuts token usage ~75% for long sessions. Enable it?
You: yes
Pi:  Mode active. Phase 1 — Intake. [grill-me interview begins, one question at a time]
     ...all decisions resolved, forge/decisions.md written...
     Phase 1 complete. Invoke the chain again to continue.

You: /forge-chain
Pi:  [Phase 2 — to-prd runs automatically → forge/prd.md written]
     Phase 2 complete. Invoke the chain again to continue.

You: /forge-chain
Pi:  [Phase 3 — to-issue quiz, approve breakdown → forge/issues/*.md written]
     Phase 3 complete. Invoke the chain again to start implementation.

You: /forge-chain
Pi:  Ready to start automated implementation. Ralph will process all issues. Continue?
You: yes
Pi:  [Phase 4 — ralph implements all issues]
```



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
│   ├── chain.md          # ← written by forge-chain (progress tracker)
│   ├── decisions.md      # ← written by grill-me
│   ├── prd.md            # ← written by to-prd
│   └── issues/           # ← written by to-issue, read by ralph
├── skills/               # Pi skills (each with a SKILL.md)
│   ├── caveman/
│   ├── forge-chain/
│   ├── grill-me/
│   ├── learn/
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
