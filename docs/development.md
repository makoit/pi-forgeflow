# Development

## Repository layout

```text
.
├── .github/
│   ├── dependabot.yml
│   └── workflows/
│       ├── ci.yml        # Validates package on push/PR
│       └── release.yml   # Creates a GitHub Release on version tags
├── docs/                 # This documentation
├── extensions/           # Executable extension code
├── forge/                # Workflow artifacts (commit or gitignore — team preference)
│   ├── README.md         # auto-maintained cycle index
│   ├── current/          # active cycle (all skills read/write here)
│   └── archive/          # completed cycles (YYYY-MM-DD-<slug>/)
├── skills/               # Pi skills (each with a SKILL.md)
├── prompts/              # Reusable prompt templates
├── themes/               # Pi theme assets
├── examples/             # Demonstration projects and sample usage
├── tests/                # Node test suite
├── package.json
├── tsconfig.json
├── README.md
├── CHANGELOG.md
├── LICENSE
├── CONTRIBUTING.md
├── SECURITY.md
└── AGENTS.md
```

## Local setup

Clone the repository and install it into your Pi environment from the working tree:

```bash
git clone https://github.com/makoit/pi-forgeflow.git
cd pi-forgeflow
pi install .
```

## Running tests and validation

```bash
npm test              # runs tests/*.test.mjs via the Node test runner
npm run pack:check    # npm pack --dry-run — verifies package contents
```

Run both before submitting a pull request.

## Anatomy of a skill

Each skill lives in its own folder under `skills/` and must contain a `SKILL.md` with a valid frontmatter block:

```yaml
---
name: skill-name
description: One-sentence description of when and how to invoke this skill.
---
```

The `description` is what Pi matches against user requests, so it should name the trigger phrases. Skills that must only run when explicitly invoked set `disable-model-invocation: true` (see [to-prd](skills/to-prd.md) and [to-issue](skills/to-issue.md)).

New skills must also be registered in the `pi.skills` array in `package.json`.

Extensions (executable code) go under `extensions/` or alongside a skill (like `skills/ralph/ralph.mjs`). They receive additional scrutiny — document behavior, avoid side effects, and declare any peer dependencies.

## Documentation

User-facing documentation lives in `docs/`. When you add or change a skill, update its page under `docs/skills/` (and the tables in `docs/README.md` and `docs/skills/README.md`) in the same pull request.

## Releasing

1. Bump `version` in `package.json` following [semantic versioning](https://semver.org/)
2. Update `CHANGELOG.md` and the "Current Release" section of the README
3. Verify package contents: `npm run pack:check`
4. Tag the release (`git tag v<version>`) and push the tag — the `release.yml` workflow creates the GitHub Release

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full process: issue-first for significant work, feature branches, focused PRs, and [Conventional Commits](https://www.conventionalcommits.org/) messages.
