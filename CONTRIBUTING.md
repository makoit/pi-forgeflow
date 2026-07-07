# Contributing to ForgeFlow

Thank you for your interest in contributing!

## Process

1. **Open an issue** before starting significant work so we can align on direction.
2. **Fork** the repository and create a feature branch from `main`.
3. **Make focused changes** — one logical change per pull request.
4. **Follow the engineering lifecycle** described in [AGENTS.md](AGENTS.md).
5. **Run validation** before submitting:

   ```bash
   npm run pack:check
   npm pack --dry-run
   ```

6. **Open a pull request** against `main` with a clear description of what changed and why.

## Skill Contributions

Each skill lives in its own folder under `skills/` and must contain a `SKILL.md` with a valid frontmatter block:

```yaml
---
name: skill-name
description: One-sentence description of when and how to invoke this skill.
---
```

Extensions (executable code) go under `extensions/` or alongside a skill. They receive additional scrutiny — document behavior, avoid side effects, and declare any peer dependencies.

## Documentation

User-facing documentation lives in [docs/](docs/README.md). When you add or change a skill, update its page under `docs/skills/` (and the overview tables in `docs/README.md` and `docs/skills/README.md`) in the same pull request.

## Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat(skills): add new skill
fix(ralph): handle empty issue directory
docs: update README install instructions
```

## Code of Conduct

Be respectful and constructive. Focus on the work, not the person.
