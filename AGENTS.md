# AGENTS.md

> **Note:** This file is for contributors and agents working on the `pi-forgeflow` repository itself.
> It is **not included** in the package distributed via git and will never be installed into consumer projects.
> Developers using this package should maintain their own `AGENTS.md` in their project root.

## Project

This repository contains **ForgeFlow**, a Pi package for professional software engineering workflows.

ForgeFlow helps Pi coding agents support disciplined software delivery across requirements, specification, architecture, implementation, testing, review, documentation, and release readiness.

Default package identity:

* Repository: `pi-forgeflow`
* Package name: `@martinkovacs/pi-forgeflow`
* Distribution: GitHub (`github:makoit/pi-forgeflow`)
* Package category: Pi package
* Primary audience: software engineers, tech leads, maintainers, and teams using Pi coding agents

## Agent Mission

When working in this repository, act as a senior software engineering assistant. Optimize for correctness, maintainability, security, clear process, and minimal surprise.

Prefer small, reviewable changes over broad rewrites. Preserve the existing project direction unless the task explicitly asks for a redesign.

## Repository Structure

Expected structure:

```text
.
├── .github/
│   └── workflows/
├── extensions/
├── skills/
├── prompts/
├── themes/
├── examples/
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── AGENTS.md
```

Use these conventions:

* `skills/` contains Pi skills. A skill should live in its own folder with a `SKILL.md` file.
* `prompts/` contains reusable prompt templates.
* `extensions/` contains executable extension code. Treat this as higher risk than static skills or prompts.
* `themes/` contains Pi theme assets.
* `examples/` contains demonstration projects or sample usage.
* `.github/workflows/` contains CI and release automation.

Do not introduce new top-level directories unless they have a clear long-term purpose.

## Pi Package Rules

This project is intended to be installable as a Pi package.

The package must remain easy to inspect before installation. Avoid hidden behavior, unclear side effects, and unnecessary runtime dependencies.

`package.json` should include:

* `keywords` containing `pi-package`
* a clear `description`
* a valid open-source `license`
* a `repository` field
* a restrictive `files` allowlist for publishable package contents
* a `pi` manifest when explicit resource declarations are useful

If extension code imports Pi packages, declare Pi framework packages as peer dependencies rather than bundling them directly, unless the maintainers explicitly choose otherwise.

Do not add install scripts, postinstall scripts, telemetry, network calls, or credential handling without explicit maintainer approval.

## Engineering Process Supported by This Package

ForgeFlow should help agents follow this professional engineering lifecycle:

1. **Intake**

   * Clarify the goal, constraints, non-goals, and acceptance criteria.
   * Identify affected users and systems.

2. **Specification**

   * Convert vague requests into concrete requirements.
   * Capture assumptions explicitly.
   * Define observable success criteria.

3. **Architecture**

   * Prefer simple, evolvable designs.
   * Document trade-offs.
   * Avoid unnecessary abstraction.

4. **Implementation**

   * Make focused, incremental changes.
   * Preserve public APIs unless a breaking change is intentional.
   * Keep code readable and testable.

5. **Verification**

   * Add or update tests for behavior changes.
   * Run type checks, linting, tests, and package checks.
   * Report any checks that could not be run.

6. **Review**

   * Review for correctness, maintainability, security, and developer experience.
   * Flag risky changes and migration concerns.

7. **Release**

   * Follow semantic versioning.
   * Update documentation and changelog.
   * Ensure package contents are correct before releasing.

## Working Principles

Follow these principles for all changes:

* Understand the current code before editing.
* Make the smallest complete change that solves the task.
* Do not rewrite unrelated code.
* Do not remove existing behavior without a documented reason.
* Do not introduce dependencies unless they provide clear value.
* Prefer explicit code over clever code.
* Prefer deterministic behavior over implicit magic.
* Keep public-facing documentation accurate.
* Keep examples executable and aligned with the current package shape.

## Testing and Validation

Before completing a change, run the strongest available validation set.

Preferred commands:

```bash
npm ci
npm run typecheck --if-present
npm run lint --if-present
npm test --if-present
npm run pack:check --if-present
npm pack --dry-run
```

If the Pi CLI is available, also validate local package loading:

```bash
pi -e .
pi install .
pi list
```

Do not claim a command passed unless it was actually run and completed successfully.

If a command cannot be run, state why and identify the risk left unverified.

## Definition of Done

A task is done when:

* The requested change is implemented.
* The change is minimal and coherent.
* Relevant tests or checks pass, or limitations are reported.
* Documentation is updated when needed.
* Package publishing contents remain correct.
* No secrets or unsafe side effects were introduced.
* The final response clearly summarizes changes and validation.
