---
name: ralph
description: Run an automated agent loop over a directory of Markdown issue files. For each issue, call the Pi CLI to implement it, run tests, and mark it done when verified. Use when user wants to automate issue implementation or mentions "ralph".
---

## What ralph does

Ralph iterates over every `.md` file in a given directory. For each file it:

1. Reads the issue description
2. Calls the Pi CLI to implement the described work
3. Rebuilds the project and runs the newly implemented tests
4. Iterates until build and tests succeed
5. Sets `status: done` in the issue file's frontmatter when resolved
6. Writes an `agent.<filename>.md` result file alongside the issue

## Input artifact

Point ralph at the `forge/issues/` directory produced by `to-issue`. Each file should have the frontmatter:

```markdown
---
title: <issue title>
status: todo
tracker-url: <link to tracker issue>
---
```

Ralph only processes files where `status` is `todo` or `in-progress`. Files with `status: done` are skipped.

## Usage

```bash
# With Pi (default)
python skills/ralph/ralph.py --directory ./forge/issues

# With a specific model
python skills/ralph/ralph.py --directory ./forge/issues --model gpt-5.4:medium

# With a different agent CLI
python skills/ralph/ralph.py --directory ./forge/issues --cli "co --provider github-copilot"
python skills/ralph/ralph.py --directory ./forge/issues --cli "claude" --no-print
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `-d`, `--directory` | required | Directory containing issue `.md` files |
| `-c`, `--cli` | `co` | Agent CLI command to invoke (can include flags) |
| `-m`, `--model` | _(omitted)_ | Model flag passed to the agent CLI |
| `-p`, `--prompt` | see below | Custom implementation prompt |
| `--no-print` | false | Omit `--print` from the CLI invocation (use for CLIs that do not support it) |

Default prompt:

> Implement the issue described in the given issue file. Rebuild the project and run newly implemented unit tests. Iterate until build and tests succeed. Set `status` to `done` in the issue frontmatter when resolved.

## Output artifact

For each processed issue `<name>.md`, ralph writes `agent.<name>.md` containing the full agent response. These files form an audit trail of what was implemented and how.