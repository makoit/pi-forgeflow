# ForgeFlow

[![version](https://img.shields.io/badge/version-0.5.1-blue)](https://github.com/makoit/pi-forgeflow/releases/tag/v0.5.1)
[![license](https://img.shields.io/badge/license-MIT-blue)](https://github.com/makoit/pi-forgeflow/blob/main/LICENSE)

**ForgeFlow** is a Pi package for professional software engineering workflows.

It helps Pi coding agents support disciplined software delivery across the full engineering lifecycle: requirements, specification, architecture, implementation, testing, review, documentation, and release readiness.

📚 **[Full documentation →](docs/README.md)**

## Current Release

**v0.5.1** — ralph bugfix release. The issue loop now ignores its own `agent.*.md` output files, so re-running against the same directory no longer feeds prior agent transcripts back in as new issues. The prompt now carries the full path to the issue file, so the agent can reliably set `status: done` regardless of its working directory. The published npm package no longer ships Python bytecode. Adds an end-to-end regression test for the ralph loop.

📋 [Full changelog →](CHANGELOG.md)

## Installation

```bash
pi install git:github.com/makoit/pi-forgeflow
```

Verify with `pi list` — you should see `@martinkovacs/pi-forgeflow`. More options (HTTPS, version pinning, local install) in the [Getting Started guide](docs/getting-started.md).

## How it works

ForgeFlow is **artifact-driven**: each skill writes a Markdown file into `forge/current/` that becomes the input for the next, so you can stop at any point and resume in a new session.

```
① grill-me → decisions.md → ② to-prd → prd.md → ③ to-issue → issues/*.md → ④ ralph → implementation
```

Run the steps yourself, or let [forge-chain](docs/skills/forge-chain.md) orchestrate the whole pipeline in one command — it detects existing artifacts and resumes from the correct phase automatically. See [The ForgeFlow Workflow](docs/workflow.md) for the full picture.

## Skills

Nine skills covering the full engineering lifecycle. Invoke them by describing what you want — Pi matches the description automatically — or call them explicitly by name.

| Skill | Purpose |
|---|---|
| [grill-me](docs/skills/grill-me.md) | Interview you about a plan until every decision branch is resolved |
| [to-prd](docs/skills/to-prd.md) | Synthesize decisions into a structured PRD and publish it to the tracker |
| [to-issue](docs/skills/to-issue.md) | Break a PRD into vertical-slice issues, published and saved locally |
| [ralph](docs/skills/ralph.md) | Automated agent loop that implements issues, runs tests, marks them done |
| [forge-chain](docs/skills/forge-chain.md) | Run the full pipeline in one command with automatic resume |
| [forge-new](docs/skills/forge-new.md) | Archive or discard the current cycle and start fresh |
| [caveman](docs/skills/caveman.md) | Ultra-compressed communication mode (~75% fewer tokens) |
| [learn](docs/skills/learn.md) | Teaching mode — solve the task and explain how and why |
| [create-agents-md](docs/skills/create-agents-md.md) | Interactive scaffolding of a repository `AGENTS.md` |

## Documentation

- [Getting Started](docs/getting-started.md) — installation and your first workflow
- [The ForgeFlow Workflow](docs/workflow.md) — pipeline, chain, sessions & resume, cycle management
- [Skills Reference](docs/skills/README.md) — one page per skill
- [Development](docs/development.md) — repository layout, tests, releasing

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE)
