---
name: create-agents-md
description: >
  Scaffold a complete AGENTS.md for any project by interviewing the developer
  and auto-detecting stack details. Use when the user wants to create, generate,
  or initialise an AGENTS.md, mentions "create agents md", "set up agents file",
  "init agents", "generate agents.md", or "new agents.md".
---

# Create AGENTS.md

This skill interviews the developer and auto-detects project information to produce a complete, project-specific `AGENTS.md` at the repository root. It is fully technology-agnostic — it works equally well for Java, Python, Rust, Go, TypeScript, Ruby, PHP, C#, Swift, C/C++, Elixir, Dart, or any other stack.

## Step 1: Guard — check for existing AGENTS.md

Check whether an `AGENTS.md` file exists at the repository root (case-insensitive).

**If it already exists**, read it and present a short summary:

> ⚠️ An `AGENTS.md` already exists in this repository.
> Sections found: _<list detected headings>_
>
> What would you like to do?
> **[1] Overwrite** — replace it entirely with a freshly generated file
> **[2] Update** — preserve existing content and fill in any missing sections
> **[3] Cancel**

Wait for the user's choice. If the user chooses [3], stop here and take no further action.

## Step 2: Auto-detect stack

Before asking any questions, scan the repository root and first level of subdirectories for the signals below. Capture your best guess for each concern. **Do not ask about anything you can determine unambiguously from the files.**

### Language & ecosystem

| Signal file | Language / ecosystem |
|---|---|
| `package.json` | JavaScript or TypeScript — read `scripts` for commands and `dependencies`/`devDependencies` for framework hints |
| `tsconfig.json` | TypeScript confirmed |
| `pyproject.toml`, `setup.py`, `setup.cfg` | Python |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `pom.xml` | Java (Maven) |
| `build.gradle` or `build.gradle.kts` | Java or Kotlin (Gradle) |
| `*.csproj`, `*.sln`, `global.json` | C# / .NET |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `pubspec.yaml` | Dart or Flutter |
| `mix.exs` | Elixir |
| `Package.swift` | Swift |
| `CMakeLists.txt` or `*.cmake` | C or C++ (CMake) |
| `Makefile` | any language — check targets for build/test/lint hints |

### Package manager / dependency tool

| Signal file | Package manager |
|---|---|
| `yarn.lock` | yarn |
| `pnpm-lock.yaml` | pnpm |
| `package-lock.json` | npm |
| `bun.lockb` | bun |
| `poetry.lock` | poetry (Python) |
| `Pipfile.lock` | pipenv (Python) |
| `requirements.txt` | pip (Python) |
| `Gemfile.lock` | bundler (Ruby) |
| `composer.lock` | composer (PHP) |
| `pubspec.lock` | pub (Dart) |
| `mix.lock` | mix (Elixir) |
| (no extra file needed) | cargo (Rust), go (Go), maven (Java), gradle (Java/Kotlin), dotnet (C#) |

### Test framework

| Signal file | Framework |
|---|---|
| `jest.config.*` | Jest |
| `vitest.config.*` | Vitest |
| `pytest.ini`, `conftest.py`, `[tool.pytest…]` in pyproject.toml | pytest |
| `spec/` directory, `.rspec` | RSpec (Ruby) |
| `phpunit.xml` or `phpunit.xml.dist` | PHPUnit (PHP) |
| JUnit dependency in `pom.xml` / `build.gradle` | JUnit (Java/Kotlin) |
| `*Tests.csproj` or xUnit/NUnit/MSTest in `.csproj` | xUnit / NUnit / MSTest (.NET) |
| `*_test.go` files | Go testing package |
| `#[test]` in `*.rs` files, no extra config needed | Rust built-in tests |
| `test/` or `tests/` directory | generic test dir |

### Linter / formatter

| Signal file | Tool |
|---|---|
| `.eslintrc*`, `eslint.config.*` | ESLint |
| `.prettierrc*`, `prettier.config.*` | Prettier |
| `biome.json`, `biome.jsonc` | Biome |
| `ruff.toml`, `[tool.ruff]` in pyproject.toml | Ruff (Python) |
| `.flake8`, `setup.cfg [flake8]` | Flake8 (Python) |
| `.rubocop.yml` | RuboCop (Ruby) |
| `.php-cs-fixer*`, `phpcs.xml` | PHP-CS-Fixer / PHP_CodeSniffer |
| `golangci-lint` config (`.golangci.yml`) | golangci-lint (Go) |
| `rustfmt.toml`, `clippy.toml` | rustfmt / Clippy (Rust) |
| `checkstyle*.xml`, `.spotbugs*` | Checkstyle / SpotBugs (Java) |
| `.editorconfig` | EditorConfig (any language) |

### Key directories

Detect: `src/`, `lib/`, `app/`, `cmd/` (Go), `internal/` (Go), `pkg/`, `tests/`, `test/`, `spec/`, `docs/`, `config/`, `scripts/`, `.github/workflows/`.

For Java/Maven projects also check `src/main/java/`, `src/test/java/`.

### CI/CD

Check for `.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`. Note which CI system is present.

### Deployment

| Signal file | Inference |
|---|---|
| `Dockerfile` or `Dockerfile.*` | containerized deployment |
| `docker-compose.yml` or `docker-compose*.yml` | multi-container / local orchestration |
| `helm/` or `charts/` directory | Kubernetes (Helm) |
| `k8s/` or `kubernetes/` directory | Kubernetes (raw manifests) |
| `serverless.yml` or `serverless.ts` | Serverless Framework (AWS Lambda etc.) |
| `template.yaml` with `AWSTemplateFormatVersion` | AWS SAM / CloudFormation |
| `cdk.json` or `cdk.ts` | AWS CDK |
| `terraform/` directory or `*.tf` files | Terraform / infrastructure-as-code |
| `fly.toml` | Fly.io |
| `railway.json` | Railway |
| `render.yaml` | Render |
| `vercel.json` or `.vercel/` | Vercel |
| `netlify.toml` | Netlify |
| `app.yaml` (Google App Engine pattern) | Google Cloud App Engine |
| `pubspec.yaml` with flutter dependency | mobile app — deploy via app store |
| `Package.swift` with `.executableTarget` | native binary / homebrew |

---

Present the auto-detected answers as a compact summary before the first interview question:

> **Auto-detected:**
> - Language: _<value or "unknown">_
> - Package manager / build: _<value or "unknown">_
> - Test framework: _<value or "unknown">_
> - Linter / formatter: _<value or "unknown">_
> - CI/CD: _<value or "none detected">_
> - Deployment: _<value or "none detected">_
> - Key dirs: _<comma-separated list>_
>
> I'll confirm each with you as we go. Just correct anything that looks wrong.

## Step 3: Interview

Ask **one question at a time**. Pre-fill any value you already auto-detected with confidence — the user only needs to confirm or correct it. Wait for the response before asking the next question.

Work through the questions below in order. Skip a question only if you are fully certain of the answer from auto-detection.

---

**Q1 — Project name and purpose**
What is the name of this project, what does it do, and who is it for?

---

**Q2 — Project type** _(no pre-fill)_
What kind of project is this? Examples: web API / REST service, web application (frontend), mobile app, CLI tool, library / SDK, background service / worker, data pipeline, monorepo, embedded system, or something else.

This matters because it affects how an agent should reason about changes, stability, and testing.

---

**Q3 — Primary language(s)**
Which programming language(s) does this project use?
_(pre-fill from auto-detection)_

---

**Q4 — Package manager or build tool**
Which tool is used to install dependencies and/or build the project?
_(pre-fill from lockfile / build file detection)_

Examples by ecosystem: npm / yarn / pnpm / bun · pip / poetry / pipenv · cargo · go · maven / gradle · dotnet · bundler · composer · mix · pub

---

**Q5 — Install command**
What is the command to install all dependencies from scratch on a clean checkout?
_(pre-fill where obvious: `npm ci`, `mvn install`, `./gradlew build`, `pip install -r requirements.txt`, `bundle install`, `go mod download`, `cargo fetch`, etc.)_

---

**Q6 — Test framework**
Which test framework is used?
_(pre-fill from config file detection)_

---

**Q7 — Test command**
What is the exact command to run the full test suite?
_(pre-fill from `scripts.test` in package.json, `Makefile` test target, or equivalent)_

---

**Q8 — Linter / formatter** _(optional)_
Is there a linter or formatter, and what command runs it?
_(pre-fill from config detection; the user may say "none")_

---

**Q9 — Build / compile** _(optional)_
Is there a separate build or compile step? What command runs it?
_(pre-fill from `scripts.build`, `Makefile` build target, or equivalent; the user may say "none")_

---

**Q10 — Key directories**
Briefly describe the main directories — where is the source code, tests, configuration, and documentation?
_(pre-fill from detected directories; ask the user to fill in any gaps or correct misidentified roles)_

---

**Q11 — Agent mission** _(no pre-fill — ask every time)_
In one or two sentences: how should a coding agent approach this codebase? What is the top priority?

Examples: _"Optimize for correctness and minimal change. All public APIs must remain backward-compatible."_ / _"Move fast; breaking changes are fine while the project is pre-1.0."_ / _"Security and data integrity are non-negotiable; performance is secondary."_

---

**Q12 — Git or commit conventions** _(optional)_
Does the project follow any specific commit message convention or branching strategy? Examples: Conventional Commits, Gitflow, trunk-based development, squash-and-merge only.
The user may say "none" to skip.

---

**Q13 — Special rules or constraints** _(optional)_
Are there any project-specific rules an agent must always follow? Examples: always update the changelog, never add runtime dependencies without review, follow a specific error-handling pattern, generated files must not be edited manually.
The user may say "none" to skip.

---

**Q14 — Deployment** _(optional)_
How and where is this project deployed or released? Examples: Docker image pushed to a registry, Kubernetes via Helm, serverless function (AWS Lambda, Cloud Functions), static site (Vercel, Netlify), native binary / package registry (npm, crates.io, PyPI, Homebrew), mobile app store, or not deployed externally.

Are there environment variables, secrets, or infrastructure files an agent must be aware of or must never touch?
_(pre-fill from Dockerfile / deployment config detection; the user may say "not applicable")_

---

## Step 4: Write AGENTS.md

Use all collected and confirmed answers to fill the template below. Every section must contain real content — no placeholder text, no `<fill in>` markers. Omit optional subsections only if the user explicitly confirmed they have no content.

Write the file to `AGENTS.md` at the repository root. If Step 1 resolved to **Update**, merge the new content with the existing file rather than discarding sections the user chose to keep.

<agents-md-template>

# AGENTS.md

## Project

**[project name]** — [one or two sentences: what the project does and who it is for].

**Type:** [project type: web API, library, CLI tool, mobile app, etc.]

## Agent Mission

[One to two sentences: how should a coding agent approach this codebase and what is the top priority?]

## Repository Structure

    .
    [key directories and files as a simple tree, based on interview answers]

[One-line description of each listed directory or file.]

## Tech Stack

| Concern            | Choice                              |
|--------------------|-------------------------------------|
| Language           | [language(s)]                       |
| Package manager    | [package manager / build tool]      |
| Test framework     | [test framework]                    |
| Linter / formatter | [linter/formatter, or "none"]       |
| Build tool         | [build tool, or "same as above"]    |
| CI/CD              | [CI system, or "none"]              |
| Deployment         | [deployment target / platform]      |

## Development Commands

    # Install dependencies
    [install command]

    # Run tests
    [test command]

    [if lint command exists:]
    # Lint / format
    [lint command]

    [if build command exists:]
    # Build / compile
    [build command]

## Working Principles

[Bullet list of project-specific rules gathered in the interview. If none were provided by the user, include these sensible defaults — never leave this section empty:]

- Understand the current code before editing.
- Make the smallest complete change that solves the task.
- Do not rewrite unrelated code.
- Do not remove existing behavior without a documented reason.
- Do not introduce dependencies unless they provide clear value.
- Keep public-facing documentation accurate.

[If the user provided a commit convention, add:]
- Follow [convention name] for all commit messages.

## Testing and Validation

Before completing any change, run:

    [install command]
    [lint command — if applicable]
    [test command]
    [build command — if applicable]

Do not claim a check passed unless it was actually run and completed successfully. If a command cannot be run, state why and identify the risk left unverified.

## Deployment

[If deployment info was provided:]
This project is deployed as [deployment target / platform].

[Describe the deployment process briefly — e.g. "Docker image built and pushed via CI on merge to main", "Released to npm with `npm publish`", "Deployed to AWS Lambda via Serverless Framework".]

[If there are protected files or environment variable conventions:]
**Do not modify** [list of infrastructure/config files that agents must not touch, e.g. `terraform/`, `.env.production`].
Environment variables are documented in [location, e.g. `.env.example`].

[Omit this section entirely if the user said "not applicable".]

## Definition of Done

A task is done when:

- The requested change is implemented.
- The change is minimal and coherent.
- All validation commands pass, or limitations are clearly reported.
- Documentation is updated when affected.
- No secrets, credentials, or infrastructure files were modified unintentionally.
- No unsafe side effects were introduced.

</agents-md-template>

## Step 5: Confirm

After writing the file, confirm to the user:

> ✅ `AGENTS.md` written to the repository root.
>
> Sections: Project · Agent Mission · Repository Structure · Tech Stack · Development Commands · Working Principles · Testing and Validation · Definition of Done
>
> Commit this file so every agent working in this repo has consistent context. Update it whenever the stack, key commands, or working principles change.
