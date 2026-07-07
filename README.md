# ForgeFlow

[![version](https://img.shields.io/badge/version-0.5.1-blue)](https://github.com/makoit/pi-forgeflow/releases/tag/v0.5.1)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/makoit/pi-forgeflow/blob/main/LICENSE)

**ForgeFlow** is a Pi package for professional software engineering workflows.

It helps Pi coding agents support disciplined software delivery across the full engineering lifecycle: requirements, specification, architecture, implementation, testing, review, documentation, and release readiness.

## Current Release

**v0.5.1** — ralph bugfix release. The issue loop now ignores its own `agent.*.md` output files, so re-running against the same directory no longer feeds prior agent transcripts back in as new issues. The prompt now carries the full path to the issue file, so the agent can reliably set `status: done` regardless of its working directory. The published npm package no longer ships Python bytecode. Adds an end-to-end regression test for the ralph loop.

Ships nine skills covering the full engineering lifecycle: a one-command chain, cycle management, compressed communication, teaching mode, design review, PRD authoring, issue tracking, automated issue implementation, and interactive `AGENTS.md` scaffolding.

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

### create-agents-md

Scaffolds a complete `AGENTS.md` at the repository root by interviewing the developer and auto-detecting stack details. Before asking questions, the skill scans for lockfiles, config files, and directory structure to pre-fill answers — the developer only confirms or corrects. A guard detects an existing `AGENTS.md` and offers to overwrite or update it.

**Covers:** project name & purpose, primary language(s), package manager, test framework, linter/formatter, build tool, key directories, agent mission, and project-specific rules.

**Invoke:** say `create agents md`, `generate agents.md`, `init agents`, `set up agents file`, or `/create-agents-md`

```
You: /create-agents-md
Pi:  Auto-detected: Language: Java · Build: Maven · Test framework: JUnit 5 · CI: GitHub Actions

     Q1: What is this project and who is it for?
You: A backend service for processing insurance claims, used by our operations team.
Pi:  Q2: What kind of project is this — web API, library, CLI tool, or something else?
You: REST API, Spring Boot
     ...
Pi:  ✅ AGENTS.md written to the repository root.
     Sections: Project · Agent Mission · Repository Structure · Tech Stack · Development Commands · Working Principles · Testing and Validation · Definition of Done
```

---

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

When the interview is complete, Pi writes **`forge/current/decisions.md`** — a structured table of every question, chosen answer, and rationale. This file is the input for `to-prd`.

**Invoke:** say `grill me on this`, `stress-test this plan`, or `use grill-me`

```
You: grill me on my decision to use a monorepo
Pi:  Q1: How many teams will commit to this repo simultaneously?
     Recommended: ≤3 for low coordination overhead.
...
[all branches resolved]
Pi:  Writing forge/current/decisions.md...
```

### to-prd

Reads `forge/current/decisions.md` as primary input and synthesises everything into a structured PRD. Explores the codebase, identifies test seams, and checks them with you before finalising. Saves the result as **`forge/current/prd.md`** and publishes it to the issue tracker.

**Invoke:** say `write a PRD for this`, `turn this into a PRD`, or `use to-prd`

```
You: use to-prd
Pi:  [reads forge/current/decisions.md, explores repo, drafts PRD]
     [checks proposed test seams with you]
     [writes forge/current/prd.md, publishes tracker issue]
```

### to-issue

Reads `forge/current/prd.md` and breaks the plan into independently-grabbable vertical slice issues. Presents the proposed breakdown, quizzes you on granularity and dependencies, then publishes each approved issue to the tracker and saves a local copy under **`forge/current/issues/<slug>.md`** — the exact format ralph expects.

**Invoke:** say `create issues from this`, `break this into issues`, or `use to-issue`

```
You: use to-issue
Pi:  [reads forge/current/prd.md, proposes vertical slices]
     [quiz: "Does the granularity feel right?"]
     [on approval: publishes issues, writes forge/current/issues/*.md]
```

### ralph

Runs an automated agent loop over every `.md` file in a directory. For each issue it calls the Pi CLI to implement the described work, runs tests, and marks the issue `done` when verified. Produces a **`forge/current/issues/agent.<slug>.md`** audit file per issue. Safe to re-run: issues marked `done` and the `agent.*` audit files are skipped.

**Invoke:** say `use ralph` or run `ralph.py` directly:

```bash
# Default (uses co CLI)
python skills/ralph/ralph.py --directory ./forge/current/issues

# With a specific agent CLI
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "pi"
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "co" --model gpt-5.4:medium

# For CLIs that do not support --print (e.g. claude), add --no-print
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "claude" --no-print
```

### forge-new

Archives the current workflow cycle to `forge/archive/` and resets `forge/current/` for a new idea. Can be invoked at any point — mid-process or after a completed chain. Offers archive (keeps history) or discard (clean delete) options.

**Invoke:** say `forge new`, `start fresh`, `neue idee`, or `new feature`

```
You: forge new
Pi:  Active cycle found: Auth System (started: 2026-07-03, Phase 3 done)
     Artifacts: decisions.md ✓ | prd.md ✓ | issues: 4 (4 done)
     [1] Archive & start new  [2] Discard & start new  [3] Cancel
You: 1
Pi:  ✅ Archived to forge/archive/2026-07-03-auth-system/
     forge/current/ is clean. Start your new idea.
```

---

## Manual Pipeline

The four workflow skills form a natural end-to-end sequence. Each step produces a Markdown artifact in `forge/current/` that becomes the structured input for the next — so you can close a session at any point and resume without losing context.

```
idea
  │
  ▼
① grill-me ──────────────────────── produces → forge/current/decisions.md
  │                                              │
  ▼                                              ▼
② to-prd ──── reads forge/current/decisions.md ── produces → forge/current/prd.md
  │                                              │
  ▼                                              ▼
③ to-issue ── reads forge/current/prd.md ────── produces → forge/current/issues/<slug>.md
  │                                                          + tracker issue
  ▼
④ ralph ───── reads forge/current/issues/*.md ── produces → forge/current/issues/agent.<slug>.md
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
| 1 | Intake | grill-me | interactive | `forge/current/decisions.md` |
| 2 | Specification | to-prd | automated | `forge/current/prd.md` |
| 3 | Issue breakdown | to-issue | interactive | `forge/current/issues/*.md` |
| 4 | Implementation | ralph | automated (opt-in) | `forge/current/issues/agent.*.md` |

Interactive phases (1 and 3) pause after writing their artifact and prompt you to re-invoke. Phase 4 asks for explicit confirmation before writing code. Progress is tracked in `forge/current/chain.md` — the filesystem is the source of truth, so the chain can be resumed in a new session.

On first run, the chain offers **caveman mode** and explains the benefit before the interview begins.

**Invoke:** say `forge chain`, `run the chain`, `full workflow`, or `/forge-chain`

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

## Sessions, Interruptions, and New Ideas

ForgeFlow is designed to survive interruptions and to support multiple ideas over time without losing prior work.

### Stopping mid-process

You can close a session at any point in the pipeline. All progress is stored as files in `forge/current/` — the filesystem is the source of truth, not the session.

When you come back, just invoke the skill or chain again. It reads what exists and picks up where you left off:

| What's in `forge/current/` | Where you resume |
|---|---|
| Nothing | Phase 1 — fresh start |
| `decisions.md` only | Phase 2 — to-prd reads it |
| `decisions.md` + `prd.md` | Phase 3 — to-issue reads prd.md |
| Issues exist, some `todo` | Phase 4 — ralph skips `done`, retries the rest |
| All issues `done` | Cycle complete — offered a new cycle |

Ralph is also safe to re-run at any time. Issues already marked `status: done` are skipped; only pending or in-progress work is retried.

### Starting a new idea

When you have a new idea — whether the current cycle is finished or you simply want to abandon it — use `forge-new` to make a clean start.

**If the previous cycle is finished:**

```
You: forge new
Pi:  Active cycle found: Auth System (started: 2026-07-03, all phases done)
     Artifacts: decisions.md ✓ | prd.md ✓ | issues: 4 (4 done)
     [1] Archive & start new  [2] Discard & start new  [3] Cancel
You: 1
Pi:  ✅ Archived to forge/archive/2026-07-03-auth-system/
     forge/current/ is clean. Start your new idea.
```

**If you want to abandon a cycle mid-process** (e.g., you've done intake and PRD, but the direction changed):

```
You: forge new
Pi:  Active cycle found: Auth System (started: 2026-07-03, Phase 2 done)
     Artifacts: decisions.md ✓ | prd.md ✓ | issues: none
     [1] Archive & start new  [2] Discard & start new  [3] Cancel
You: 1
Pi:  ✅ Archived to forge/archive/2026-07-03-auth-system/
     forge/current/ is clean. Start your new idea.
```

Archived cycles are stored in `forge/archive/` and remain readable. Agents can reference prior decisions, naming conventions, and architectural patterns from old cycles when starting something new.

Alternatively, if you start `grill-me` or `forge-chain` while something is in `forge/current/`, the skill will detect the conflict and offer the same archive/discard choice automatically — no need to remember to run `forge-new` first.

### Cycle history

`forge/README.md` is maintained automatically and shows a table of all cycles:

```
| # | Topic          | Started    | Completed  | Path                                    |
|---|----------------|------------|------------|-----------------------------------------|
| 1 | Auth System    | 2026-07-03 | 2026-07-10 | archive/2026-07-03-auth-system/         |
| 2 | Payment Flow   | 2026-07-15 | —          | current/                                |
```

### Known limitations

- **One active cycle at a time.** ForgeFlow does not support parallel workstreams in the same repo. To work on two features concurrently, use separate Git branches — each has its own `forge/current/`.
- **No restore.** Archived cycles are read-only reference material. There is no command to reactivate an archived cycle as the current one.
- **Git as archive.** If you commit `forge/current/` to a feature branch, Git history already gives you free versioning. The `forge/archive/` mechanism is an alternative for teams that prefer everything in the working tree.

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
│   ├── README.md         # ← auto-maintained cycle index
│   ├── current/          # ← active cycle (all skills read/write here)
│   │   ├── chain.md      # ← written by forge-chain (progress tracker)
│   │   ├── decisions.md  # ← written by grill-me
│   │   ├── prd.md        # ← written by to-prd
│   │   └── issues/       # ← written by to-issue, read by ralph
│   └── archive/          # ← completed cycles (YYYY-MM-DD-<slug>/)
├── skills/               # Pi skills (each with a SKILL.md)
│   ├── caveman/
│   ├── create-agents-md/
│   ├── forge-chain/
│   ├── forge-new/
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
