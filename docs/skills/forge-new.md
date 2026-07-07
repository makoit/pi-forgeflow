# forge-new

Handles cycle transitions: archives the current workflow cycle to `forge/archive/` — or discards it — and resets `forge/current/` for a new idea. Can be invoked at any point, mid-process or after a completed chain.

## Invoke

Say `forge new`, `start fresh`, `neue idee`, or `new feature`.

You usually don't need to invoke it manually: [grill-me](grill-me.md), [to-prd](to-prd.md), [to-issue](to-issue.md), and [forge-chain](forge-chain.md) all detect a conflicting cycle in `forge/current/` and offer to run forge-new inline.

## What it does

1. **Inspects `forge/current/`** — which artifacts exist (`chain.md`, `decisions.md`, `prd.md`, issues) and how many issues are done vs. pending. If the directory is already clean, it says so and you can start immediately.
2. **Shows a summary** — topic, start date, last completed phase, artifact checklist.
3. **Asks what to do:**
   - **[1] Archive & start new** — current work is saved to `forge/archive/` for future reference
   - **[2] Discard & start new** — current work is permanently deleted
   - **[3] Cancel** — keep working on the current cycle

### Archive

The cycle is moved to `forge/archive/YYYY-MM-DD-<slug>/` (slug derived from the topic, lowercase kebab-case), `forge/current/issues/` is re-created empty, and a row is added to the Cycle History table in `forge/README.md`.

### Discard

All contents of `forge/current/` are deleted and the directory re-created empty. Discarded cycles leave **no** history entry in `forge/README.md`.

## Example

```
You: forge new
Pi:  Active cycle found: Auth System (started: 2026-07-03, Phase 3 done)
     Artifacts: decisions.md ✓ | prd.md ✓ | issues: 4 (4 done)
     [1] Archive & start new  [2] Discard & start new  [3] Cancel
You: 1
Pi:  ✅ Archived to forge/archive/2026-07-03-auth-system/
     forge/current/ is clean. Start your new idea.
```

Archived cycles remain readable — agents can reference prior decisions, naming conventions, and architectural patterns when starting something new.

## Known limitations

- **One active cycle at a time.** For parallel features, use separate Git branches — each has its own `forge/current/`.
- **No restore.** Archived cycles can be read for reference but cannot be reactivated through this skill.
- **Git is the real archive.** If you commit `forge/current/` to a feature branch, Git history already serves as a versioned record; `forge/archive/` is for teams that prefer everything in the working tree.
