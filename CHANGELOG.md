# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/makoit/pi-forgeflow/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/makoit/pi-forgeflow/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/makoit/pi-forgeflow/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/makoit/pi-forgeflow/releases/tag/v0.1.0
