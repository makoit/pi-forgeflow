# ralph

Ralph is an automated agent loop that works through a directory of Markdown issue files and attempts to implement each one using the Pi CLI.

---

## How it works

### 1. Discovery

Ralph scans the given directory for all `*.md` files and sorts them alphabetically. This gives a consistent, predictable processing order across runs. Files whose name starts with `agent.` — ralph's own output transcripts — are ignored, so re-running against the same directory never feeds prior results back in as issues.

### 2. Status check

Before doing any work, ralph reads each file's YAML frontmatter and checks the `status` field:

```markdown
---
title: Add input validation
status: todo
tracker-url: https://github.com/org/repo/issues/42
---
```

Files with `status: done` are **skipped**. Everything else (`todo`, `in-progress`, or no status) is processed. This makes ralph safe to re-run — already-resolved issues are never re-processed.

### 3. Agent invocation

For each active issue, ralph reads the issue file and embeds both its full resolved path and its content into the prompt, so the agent can locate the file on disk and update its frontmatter. It then invokes the configured agent CLI with:

- `--print` — non-interactive mode; output goes to stdout (omitted when `--no-print` is set)
- `--model <model>` — only added when `-m`/`--model` is provided
- `<prompt + issue path + issue content>` — the implementation instruction with the issue body inline

The default CLI is `pi` (override with `--cli` or the `RALPH_CLI` environment variable; pick a model with `--model` or `RALPH_MODEL`) and the default prompt instructs the agent to:

> Implement the issue described in the given issues-file. Rebuild the project and run newly implemented unit tests. Iterate until build and tests succeed. Modify the issue status to 'done' when the issue is resolved.

The agent is expected to make code changes, run the build and tests, fix failures, and finally update the issue's `status` field to `done` once everything passes.

### 4. Output capture

Ralph captures the full stdout from the agent and writes it to `agent.<filename>.md` in the **same directory** as the issue file. This serves as an audit trail — you can review what each agent did, what commands it ran, and how it reached a resolution.

### 5. Error handling

If the agent CLI exits with a non-zero status for a given issue, ralph logs the error and **continues to the next issue**. A single failure does not abort the whole run.

---

## Input format

Point ralph at a directory of issue files. Each file should contain YAML frontmatter followed by a description of the work:

```markdown
---
title: Validate user email on registration
status: todo
tracker-url: https://github.com/org/repo/issues/7
---

## Goal

Add server-side email validation to the registration endpoint.

## Acceptance criteria

- Returns 400 if the email is missing or malformed
- Unit tests cover valid and invalid inputs
- Existing tests continue to pass
```

Ralph works well with issues produced by the [`to-issue`](../to-issue/) skill.

---

## Usage

```bash
node skills/ralph/ralph.mjs --directory ./forge/current/issues
```

Or using the positional form:

```bash
node skills/ralph/ralph.mjs ./forge/current/issues
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `directory` | required | Directory containing issue `.md` files (positional or `-d`) |
| `-c`, `--cli` | `pi` (or `$RALPH_CLI`) | Agent CLI command to invoke (can include flags) |
| `-m`, `--model` | `$RALPH_MODEL` or omitted | Model flag passed to the agent CLI |
| `-p`, `--prompt` | see above | Override the default implementation prompt |
| `--no-print` | false | Omit `--print` from the CLI invocation (for CLIs that do not support it) |

---

## Output

For each processed issue `<name>.md`, ralph writes `agent.<name>.md` in the same directory:

```
forge/current/issues/
├── 001-add-validation.md        ← issue (status updated to done by agent)
├── agent.001-add-validation.md  ← agent response / audit trail
├── 002-fix-login.md             ← issue (still todo, not yet processed)
```

---

## Re-running

Ralph is safe to re-run at any time. Issues already marked `status: done` are skipped, and the `agent.*` audit files are never treated as issues. Issues that failed or were not yet completed will be retried.

---

## Requirements

- Node.js 18+ (already present wherever the `pi` CLI runs — no separate installation needed)
- An agent CLI (`pi` by default; `co`, `claude`, etc. via `--cli`) available on `PATH`
