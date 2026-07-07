# The ForgeFlow Workflow

ForgeFlow is **artifact-driven**: every step writes a Markdown file into `forge/current/`, and the next step reads it. The filesystem — not the session — is the source of truth, so you can stop at any point and resume later without losing context.

## The pipeline

The four workflow skills form a natural end-to-end sequence:

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

## The chain: full pipeline in one command

[forge-chain](skills/forge-chain.md) runs the entire pipeline for you. It detects which artifacts already exist in `forge/` and resumes from the correct phase automatically.

| # | Phase | Skill | Type | Artifact |
|---|-------|-------|------|----------|
| 1 | Intake | grill-me | interactive | `forge/current/decisions.md` |
| 2 | Specification | to-prd | automated | `forge/current/prd.md` |
| 3 | Issue breakdown | to-issue | interactive | `forge/current/issues/*.md` |
| 4 | Implementation | ralph | automated (opt-in) | `forge/current/issues/agent.*.md` |

Interactive phases (1 and 3) pause after writing their artifact and prompt you to re-invoke. Phase 4 asks for explicit confirmation before writing code. Progress is tracked in `forge/current/chain.md`. On first run, the chain offers [caveman mode](skills/caveman.md) before the interview begins.

## The `forge/` directory

```text
forge/
├── README.md         # auto-maintained cycle index
├── current/          # active cycle (all skills read/write here)
│   ├── chain.md      # written by forge-chain (progress tracker)
│   ├── decisions.md  # written by grill-me
│   ├── prd.md        # written by to-prd
│   └── issues/       # written by to-issue, read by ralph
└── archive/          # completed cycles (YYYY-MM-DD-<slug>/)
```

Whether to commit `forge/` or gitignore it is a team preference. Committing it to a feature branch gives you free versioning of workflow artifacts through Git history.

## Sessions, interruptions, and resume

You can close a session at any point in the pipeline. When you come back, invoke the skill or chain again — it reads what exists and picks up where you left off:

| What's in `forge/current/` | Where you resume |
|---|---|
| Nothing | Phase 1 — fresh start |
| `decisions.md` only | Phase 2 — to-prd reads it |
| `decisions.md` + `prd.md` | Phase 3 — to-issue reads prd.md |
| Issues exist, some `todo` | Phase 4 — ralph skips `done`, retries the rest |
| All issues `done` | Cycle complete — offered a new cycle |

Ralph is safe to re-run at any time: issues already marked `status: done` are skipped, and its own `agent.*` audit files are ignored when scanning for issues.

## Starting a new idea

When you have a new idea — whether the current cycle is finished or you want to abandon it — use [forge-new](skills/forge-new.md):

```
You: forge new
Pi:  Active cycle found: Auth System (started: 2026-07-03, Phase 3 done)
     Artifacts: decisions.md ✓ | prd.md ✓ | issues: 4 (4 done)
     [1] Archive & start new  [2] Discard & start new  [3] Cancel
You: 1
Pi:  ✅ Archived to forge/archive/2026-07-03-auth-system/
     forge/current/ is clean. Start your new idea.
```

Archived cycles remain readable in `forge/archive/`. Agents can reference prior decisions, naming conventions, and architectural patterns from old cycles when starting something new.

If you start `grill-me` or `forge-chain` while something is in `forge/current/`, the skill detects the conflict and offers the same archive/discard choice automatically — no need to run `forge-new` first.

### Cycle history

`forge/README.md` is maintained automatically and shows a table of all cycles:

```
| # | Topic          | Started    | Completed  | Path                                    |
|---|----------------|------------|------------|-----------------------------------------|
| 1 | Auth System    | 2026-07-03 | 2026-07-10 | archive/2026-07-03-auth-system/         |
| 2 | Payment Flow   | 2026-07-15 | —          | current/                                |
```

## Engineering lifecycle

ForgeFlow supports seven phases of disciplined delivery:

1. **Intake** — clarify goals, constraints, non-goals, and acceptance criteria
2. **Specification** — convert requests into concrete, observable requirements
3. **Architecture** — prefer simple, evolvable designs with documented trade-offs
4. **Implementation** — focused, incremental changes that keep code readable and testable
5. **Verification** — tests, type checks, linting, and package checks
6. **Review** — correctness, maintainability, security, and developer experience
7. **Release** — semantic versioning, updated docs and changelog, correct package contents

## Known limitations

- **One active cycle at a time.** ForgeFlow does not support parallel workstreams in the same repo. To work on two features concurrently, use separate Git branches — each has its own `forge/current/`.
- **No restore.** Archived cycles are read-only reference material. There is no command to reactivate an archived cycle as the current one.
- **Git as archive.** If you commit `forge/current/` to a feature branch, Git history already gives you free versioning. The `forge/archive/` mechanism is an alternative for teams that prefer everything in the working tree.
