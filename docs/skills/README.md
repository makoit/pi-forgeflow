# Skills Overview

ForgeFlow ships nine skills. Invoke them by describing what you want — Pi matches the description automatically — or call them explicitly by name.

| Skill | Type | Invoke with | Reads | Writes |
|---|---|---|---|---|
| [grill-me](grill-me.md) | workflow (interactive) | `grill me on this` | conversation, codebase | `forge/current/decisions.md` |
| [to-prd](to-prd.md) | workflow (automated) | `use to-prd` | `decisions.md`, codebase | `forge/current/prd.md` + tracker issue |
| [to-issue](to-issue.md) | workflow (interactive) | `use to-issue` | `prd.md`, codebase | `forge/current/issues/*.md` + tracker issues |
| [ralph](ralph.md) | workflow (automated) | `use ralph` / `ralph.py` | `forge/current/issues/*.md` | code + `agent.*.md` audit files |
| [forge-chain](forge-chain.md) | orchestration | `/forge-chain` | all `forge/current/` artifacts | `forge/current/chain.md` |
| [forge-new](forge-new.md) | cycle management | `forge new` | `forge/current/` | `forge/archive/`, `forge/README.md` |
| [caveman](caveman.md) | utility | `/caveman` | — | — |
| [learn](learn.md) | utility | `/learn <task>` | — | — |
| [create-agents-md](create-agents-md.md) | utility | `/create-agents-md` | repo config files | `AGENTS.md` |

The four workflow skills form a pipeline — see [The ForgeFlow Workflow](../workflow.md) for how their artifacts connect.
