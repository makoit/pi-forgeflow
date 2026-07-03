---
name: forge-new
description: Archive the current ForgeFlow cycle and reset for a new idea. Use when the user wants to start a new feature, mentions "forge new", "neue idee", "neues feature starten", or "reset". Also invoke this when the user wants to discard the current cycle entirely.
---

# ForgeFlow New Cycle

You are handling a cycle transition — either archiving the current work and starting fresh, or discarding it.

## Step 1: Check current state

Inspect `forge/current/`. Determine what exists:

- `chain.md` — chain was used
- `decisions.md` — intake completed
- `prd.md` — specification completed
- `issues/*.md` — issues created (count them, note how many are `status: done` vs pending)

**If `forge/current/` is empty or contains only `.gitkeep`:**
> Nothing to archive — forge/current/ is already clean. Ready to start a new cycle.

Proceed directly and confirm the user can begin.

## Step 2: Show current state

Present a compact summary:

> **Active cycle found**
> Topic: _<from chain.md or decisions.md, or "unknown">_
> Started: _<date>_
> Phase reached: _<last completed phase>_
> Artifacts: decisions.md ✓/✗ | prd.md ✓/✗ | issues: N (X done, Y pending)

## Step 3: Ask what to do

Present three options:

> What would you like to do?
> **[1] Archive & start new** — current work is saved to `forge/archive/` for future reference
> **[2] Discard & start new** — current work is permanently deleted
> **[3] Cancel** — keep working on the current cycle

Wait for the user's response. If the user says anything that maps to cancellation, stop here.

## Step 4a: Archive (if option 1 chosen)

1. Derive a slug from the topic in `decisions.md` or `chain.md`:
   - Convert to lowercase kebab-case, max 40 chars
   - Example: "Auth System" → `auth-system`
   - If no topic found, use `cycle`

2. Create archive directory:
   ```
   forge/archive/YYYY-MM-DD-<slug>/
   ```
   Use today's date.

3. Move all contents of `forge/current/` into the archive directory (preserve subdirectory structure).

4. Re-create `forge/current/issues/` with an empty `.gitkeep`.

5. Update `forge/README.md`:
   - Change "Active Cycle" section to reflect no active cycle
   - Add a row to the Cycle History table:
     ```
     | N | <topic> | <started date> | <today's date> | archive/<folder-name>/ |
     ```

6. Confirm to the user:
   > ✅ Cycle archived to `forge/archive/<folder-name>/`.
   > `forge/current/` is now clean. You can start your new idea.

## Step 4b: Discard (if option 2 chosen)

1. Delete all contents of `forge/current/` (excluding `.gitkeep` files).

2. Re-create `forge/current/issues/` with an empty `.gitkeep`.

3. Update `forge/README.md`: change the "Active Cycle" section to reflect no active cycle (same as archive). Do NOT add a row to the Cycle History table — discarded cycles leave no history entry.

4. Confirm to the user:
   > 🗑️ Current cycle discarded.
   > `forge/current/` is now clean. You can start your new idea.

## Known limitations

- **No multi-workstream support:** Only one active cycle at a time. To work on parallel features, use separate Git branches, each with their own `forge/current/`.
- **No restore:** Archived cycles can be read manually for reference but cannot be reactivated through this skill.
- **Git is the real archive:** If you commit `forge/current/` artifacts to a feature branch, Git history already serves as a versioned record. The `forge/archive/` approach is for teams that prefer everything in the working tree.
