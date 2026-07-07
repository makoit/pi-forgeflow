# ralph

Runs an automated agent loop over every `.md` file in a directory. For each issue it calls an agent CLI to implement the described work, runs tests, and marks the issue `done` when verified.

For each issue file, ralph:

1. Reads the issue description
2. Calls the agent CLI to implement the described work
3. Rebuilds the project and runs the newly implemented tests
4. Iterates until build and tests succeed
5. Sets `status: done` in the issue file's frontmatter when resolved
6. Writes an `agent.<filename>.md` result file alongside the issue

## Invoke

Say `use ralph`, or run the script directly:

```bash
# Default (uses the pi CLI)
node skills/ralph/ralph.mjs --directory ./forge/current/issues

# With a specific model (Pi model pattern, optionally with thinking level)
node skills/ralph/ralph.mjs --directory ./forge/current/issues --model anthropic/claude-sonnet-5
node skills/ralph/ralph.mjs --directory ./forge/current/issues --model gpt-5.4:medium

# Define the model (and CLI) once via environment variables
export RALPH_MODEL="anthropic/claude-sonnet-5"
node skills/ralph/ralph.mjs --directory ./forge/current/issues

# With a different agent CLI
node skills/ralph/ralph.mjs --directory ./forge/current/issues --cli "co --provider github-copilot"

# For CLIs that do not support --print (e.g. claude), add --no-print
node skills/ralph/ralph.mjs --directory ./forge/current/issues --cli "claude" --no-print
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-d`, `--directory` | required | Directory containing issue `.md` files |
| `-c`, `--cli` | `pi` (or `$RALPH_CLI`) | Agent CLI command to invoke (can include flags) |
| `-m`, `--model` | `$RALPH_MODEL` or omitted | Model flag passed to the agent CLI |
| `-p`, `--prompt` | see below | Custom implementation prompt |
| `--no-print` | false | Omit `--print` from the CLI invocation (use for CLIs that do not support it) |
| `-v`, `--verbose` | false | Stream the agent's full output live instead of the one-line status |

Precedence for CLI and model: an explicit flag beats the environment variable (`RALPH_CLI`, `RALPH_MODEL`), which beats the built-in default (`pi`, no model). Since ralph is a Pi package, the `pi` CLI is the default agent; the model value is passed through to `pi --model`, so any Pi model pattern works (e.g. `anthropic/claude-sonnet-5`, `gpt-5.4:medium`).

Default prompt:

> Implement the issue described in the given issues-file. Rebuild the project and run newly implemented unit tests. Iterate until build and tests succeed. Modify the issue status to 'done' when the issue is resolved.

The prompt is followed by the issue file's full path and content, so the agent can locate the file and update its frontmatter regardless of its working directory.

## Progress feedback

Agent runs can take minutes per issue, so ralph reports progress continuously instead of going silent:

```
Ralph loop: 4 pending issues in forge/current/issues (2 already done)
Agent CLI: pi

[████████████░░░░░░░░░░░░]  50% (2/4)
[3/4] Processing issue: forge/current/issues/003-add-auth.md
        Title: Add authentication middleware
  ⠹ [3/4] 003-add-auth.md │ 2m14s │ Running tests: 12 passed, 1 failed
```

- The bar shows overall completion across pending issues, with percent
- The current issue's file name and frontmatter title are printed when it starts
- A spinner line (TTY only) shows elapsed time and the agent's latest output line; pass `-v` to stream the agent's full output instead

After each issue ralph re-reads the frontmatter and reports the outcome:

- `✓ Done` — the agent set `status: done`
- `⚠ incomplete` — the agent finished but the status is still not `done`; the issue will be retried on the next run
- `✗ failed` — the agent CLI exited non-zero; the last stderr lines are printed and the partial transcript is still saved

The run ends with a summary (`Summary: 3 done, 1 incomplete, 0 failed of 4 pending (total 18m42s)`). Ralph exits `0` only when every pending issue ended up done, `1` otherwise, so it can gate follow-up steps in scripts or CI.

## Input artifact

Point ralph at the `forge/current/issues/` directory produced by [to-issue](to-issue.md). Each file should have this frontmatter:

```markdown
---
title: <issue title>
status: todo
tracker-url: <link to tracker issue>
---
```

Ralph skips files with `status: done` and its own `agent.*` output files; everything else (`todo`, `in-progress`, or no status) is processed.

## Output artifact

For each processed issue `<name>.md`, ralph writes `agent.<name>.md` containing the full agent response. These files form an audit trail of what was implemented and how.

## Re-run safety

Ralph is safe to re-run against the same directory:

- Issues marked `status: done` are skipped — only pending or in-progress work is retried
- `agent.*` audit files are ignored when scanning for issues, so prior agent transcripts are never fed back in as new issues
