# create-agents-md

Scaffolds a complete `AGENTS.md` at the repository root by interviewing you and auto-detecting stack details. Before asking questions, the skill scans for lockfiles, config files, and directory structure to pre-fill answers — you only confirm or correct.

## Invoke

Say `create agents md`, `generate agents.md`, `init agents`, `set up agents file`, or `/create-agents-md`.

## Guard: existing file check

If an `AGENTS.md` already exists at the repository root, the skill detects it and offers to overwrite or update it rather than silently replacing your file.

## Auto-detection

The skill inspects the repository to pre-fill as much as possible:

- **Language & ecosystem** — from source files and manifests
- **Package manager / dependency tool** — from lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `poetry.lock`, …)
- **Test framework** — from dev dependencies and config files
- **Linter / formatter** — from config files
- **Key directories** — from the directory structure
- **CI/CD and deployment** — from workflow files

## Interview

What can't be detected is asked directly: what the project is and who it's for, the kind of project (web API, library, CLI, …), the agent's mission, and project-specific rules. Detected values are presented for confirmation instead of being asked from scratch.

## Output

An `AGENTS.md` at the repository root with these sections:

Project · Agent Mission · Repository Structure · Tech Stack · Development Commands · Working Principles · Testing and Validation · Deployment · Definition of Done

## Example

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
