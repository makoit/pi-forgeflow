# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-07-07

### Fixed

- `ralph` — the issue loop now skips its own `agent.*.md` output files when scanning a directory. Previously a second run would pick up prior agent transcripts (which have no frontmatter, so no `done` status) and feed them back to the agent as new issues, producing `agent.agent.*.md` cascades.
- `ralph` — the prompt now embeds the full resolved path of the issue file instead of just its basename, so the agent can reliably locate the file and set `status: done` in its frontmatter. Previously the status could never be updated when the agent ran from a different working directory, causing issues to be reprocessed on every run.
- Published npm package no longer ships Python bytecode (`skills/ralph/__pycache__/*.pyc`) — excluded via `!**/__pycache__` and `!**/*.pyc` negation patterns in the `files` allowlist.

### Added

- `tests/ralph.test.mjs` — end-to-end regression test that runs `ralph.py` against a temp directory with a stub agent CLI and verifies: `todo` issues are processed, `done` issues are skipped, `agent.*` files are ignored, and the prompt contains the full issue path.

[0.5.1]: https://github.com/makoit/pi-forgeflow/compare/v0.5.0...v0.5.1

## [0.5.0] - 2026-07-03

### Added

- `create-agents-md` skill — interactive scaffold for generating a complete, project-specific `AGENTS.md` at the repository root. Auto-detects language, package manager, test framework, linter/formatter, build tool, CI/CD system, and deployment target from files on disk before asking any questions. Conducts a structured 14-question interview (one question at a time) covering: project name & purpose, project type, language, package manager, install/test/lint/build commands, key directories, agent mission, git/commit conventions, special rules, and deployment. Guards against overwriting an existing `AGENTS.md` — offers overwrite or update. Fully technology-agnostic: supports JS/TS, Java, Kotlin, Python, Rust, Go, C#/.NET, Ruby, PHP, Dart/Flutter, Elixir, Swift, C/C++, and any other stack.

[0.5.0]: https://github.com/makoit/pi-forgeflow/compare/v0.4.0...v0.5.0

## [0.4.0] - 2026-07-03

### Added

- `forge-new` skill — cycle management for ForgeFlow. Archives the current `forge/current/` cycle to `forge/archive/YYYY-MM-DD-<slug>/` (or discards it) and resets `forge/current/` for a new idea. Updates `forge/README.md` cycle index on archive. Can be invoked at any time — mid-process or after a completed chain.
- `forge/README.md` — auto-maintained index of all cycles (active + archived).

### Changed

- All workflow artifacts moved from `forge/` root to `forge/current/`: `decisions.md`, `prd.md`, `issues/`, `chain.md`. This isolates the active cycle and enables clean archiving.
- `forge-chain` — updated all paths to `forge/current/`. Extended Step 0: detects leftover artifacts before first run and invokes `forge-new` inline. New "Chain complete" state offers to start a new cycle instead of silently stopping.
- `grill-me` — added guard: detects existing `forge/current/decisions.md` and prompts to continue, archive, or discard before starting a new interview.
- `to-prd` — updated paths. Added guard for conflicting `prd.md` from a different feature.
- `to-issue` — updated paths. Added guard for existing issues in `forge/current/issues/`.
- `ralph` — updated example paths to `forge/current/issues/`.

## [0.3.0] - 2026-07-03

### Added

- `forge-chain` skill — orchestrates the full ForgeFlow pipeline in sequence (`grill-me` → `to-prd` → `to-issue` → `ralph`). Artifact-driven: auto-detects the current phase from `forge/` contents and resumes where the last session left off. Offers caveman mode on first run for leaner multi-turn output.

## [0.2.0] - 2026-07-03

### Added

- `learn` skill — activates teaching mode; solves the task completely while explaining mechanics, design decisions, tradeoffs, and reusable patterns. Works standalone or as a post-workflow explainer after a ralph loop.

### Changed

- `to-issue` — reworked as a tracer-bullet vertical slice issuer. Replaces the single-issue PRD flow with a 5-step process: gather context → explore codebase → draft vertical slice issues → quiz user → publish in dependency order. Each issue is saved to `forge/issues/<slug>.md` for ralph to consume.
- `to-prd` — seam-based testing approach (prefer existing seams, use highest seam, minimise seam count). Added `disable-model-invocation: true`. Tightened description to match the no-interview synthesis intent.

### Removed

- `to-adr` skill — Architecture Decision Records are out of scope for this workflow. The pipeline is now: `grill-me` → `to-prd` → `to-issue` → `ralph` (with optional `caveman` or `learn` at any step).
- `forge/adrs/` workflow directory (no longer needed).

## [0.1.1] - 2026-07-01

### Fixed

- Corrected installation instructions in `README.md` to use valid `pi install` URL formats (`git:github.com/makoit/pi-forgeflow` and `https://github.com/makoit/pi-forgeflow`). The previous `github:` shorthand and `#ref` syntax are not supported by the Pi CLI.

## [0.1.0] - 2026-06-30

Initial public release of **ForgeFlow** — a Pi package for professional software engineering workflows.

### Added

- Package scaffold: `package.json`, `README.md`, `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md`, `.gitignore`
- Six Pi skills covering the full engineering lifecycle:
  - `caveman` — ultra-compressed communication mode
  - `grill-me` — relentless design review interview
  - `ralph` — automated issue-driven implementation loop (`ralph.py` extension)
  - `to-adr` — Architecture Decision Record generator (saves to `forge/adrs/`)
  - `to-issue` — conversation-to-issue converter (tracker-agnostic; saves to `forge/issues/`)
  - `to-prd` — conversation-to-PRD converter (saves to `forge/prd.md`)
- `ralph.py` extension with configurable `-c`/`--cli` flag, optional `--model`, input validation, and `--no-print` support
- `forge/adrs/.gitkeep` and `forge/issues/.gitkeep` placeholder files so git tracks workflow directories
- Test suite using the Node.js built-in `node:test` runner (zero extra dependencies):
  - `tests/package.test.mjs` — validates `package.json` fields, `files` allowlist, and `pi.skills` ↔ disk consistency
  - `tests/skills.test.mjs` — validates every skill has a `SKILL.md` with correct frontmatter and body content
  - `tests/ralph.test.mjs` — validates `ralph.py` exists, passes Python syntax check, and `--help` exits cleanly
- CI workflow (`.github/workflows/ci.yml`) running `npm test` on every push
- Release workflow (`.github/workflows/release.yml`)

[0.4.0]: https://github.com/makoit/pi-forgeflow/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/makoit/pi-forgeflow/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/makoit/pi-forgeflow/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/makoit/pi-forgeflow/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/makoit/pi-forgeflow/releases/tag/v0.1.0
