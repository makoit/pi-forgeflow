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
# Default (uses co CLI)
python skills/ralph/ralph.py --directory ./forge/current/issues

# With a specific model
python skills/ralph/ralph.py --directory ./forge/current/issues --model gpt-5.4:medium

# With a different agent CLI
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "pi"
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "co --provider github-copilot"

# For CLIs that do not support --print (e.g. claude), add --no-print
python skills/ralph/ralph.py --directory ./forge/current/issues --cli "claude" --no-print
```

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-d`, `--directory` | required | Directory containing issue `.md` files |
| `-c`, `--cli` | `co` | Agent CLI command to invoke (can include flags) |
| `-m`, `--model` | _(omitted)_ | Model flag passed to the agent CLI |
| `-p`, `--prompt` | see below | Custom implementation prompt |
| `--no-print` | false | Omit `--print` from the CLI invocation (use for CLIs that do not support it) |

Default prompt:

> Implement the issue described in the given issues-file. Rebuild the project and run newly implemented unit tests. Iterate until build and tests succeed. Modify the issue status to 'done' when the issue is resolved.

The prompt is followed by the issue file's full path and content, so the agent can locate the file and update its frontmatter regardless of its working directory.

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
