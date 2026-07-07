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

Point ralph at the `forge/current/issues/` directory produced by `to-issue`. Each file should have the frontmatter:

```markdown
---
title: <issue title>
status: todo
tracker-url: <link to tracker issue>
---
```

Ralph skips files with `status: done` and its own `agent.*` output files; everything else (`todo`, `in-progress`, or no status) is processed.

## Usage

```bash
# With Pi (default)
node skills/ralph/ralph.mjs --directory ./forge/current/issues

# With a specific model (Pi model pattern, optionally with thinking level)
node skills/ralph/ralph.mjs --directory ./forge/current/issues --model anthropic/claude-sonnet-5
node skills/ralph/ralph.mjs --directory ./forge/current/issues --model gpt-5.4:medium

# Define the model (and CLI) once via environment variables
export RALPH_MODEL="anthropic/claude-sonnet-5"
node skills/ralph/ralph.mjs --directory ./forge/current/issues

# With a different agent CLI
node skills/ralph/ralph.mjs --directory ./forge/current/issues --cli "co --provider github-copilot"
node skills/ralph/ralph.mjs --directory ./forge/current/issues --cli "claude" --no-print
```

Options:

| Flag | Default | Description |
|------|---------|-------------|
| `-d`, `--directory` | required | Directory containing issue `.md` files |
| `-c`, `--cli` | `pi` (or `$RALPH_CLI`) | Agent CLI command to invoke (can include flags) |
| `-m`, `--model` | `$RALPH_MODEL` or omitted | Model flag passed to the agent CLI |
| `-p`, `--prompt` | see below | Custom implementation prompt |
| `--no-print` | false | Omit `--print` from the CLI invocation (use for CLIs that do not support it) |
| `-v`, `--verbose` | false | Stream the agent's full output live instead of the one-line status |

Precedence: an explicit flag beats the environment variable, which beats the built-in default (`pi`, no model).

Default prompt:

> Implement the issue described in the given issues-file. Rebuild the project and run newly implemented unit tests. Iterate until build and tests succeed. Modify the issue status to 'done' when the issue is resolved.

The prompt is followed by the issue file's full path and content, so the agent can locate the file and update its frontmatter.

## Progress feedback

While running, ralph shows an overall progress bar with percent, the issue currently being implemented (`[2/5]`, file name, title), and a live spinner with elapsed time and the agent's latest output line. Use `-v` to stream the agent's full output instead. After each issue ralph verifies the frontmatter and reports one of:

- `✓ Done` — the agent set `status: done`
- `⚠ incomplete` — the agent finished but did not mark the issue done (retried on re-run)
- `✗ failed` — the agent CLI exited non-zero (last stderr lines are printed)

A summary line closes the run (`Summary: 3 done, 1 incomplete, 0 failed of 4 pending`). Ralph exits `0` only if every pending issue ended up done, `1` otherwise — so it can gate scripts and CI steps.

## Output artifact

For each processed issue `<name>.md`, ralph writes `agent.<name>.md` containing the full agent response. These files form an audit trail of what was implemented and how. Ralph ignores `agent.*` files when scanning for issues, so re-running against the same directory is safe.