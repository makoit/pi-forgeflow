# Getting Started

## Installation

Install ForgeFlow into your Pi environment directly from GitHub:

```bash
pi install git:github.com/makoit/pi-forgeflow
```

Or using an HTTPS URL:

```bash
pi install https://github.com/makoit/pi-forgeflow
```

To pin to a specific release:

```bash
pi install git:github.com/makoit/pi-forgeflow@v0.5.1
```

To install from a local clone (development):

```bash
pi install .
```

## Verify the installation

```bash
pi list
```

You should see `@martinkovacs/pi-forgeflow` in the output.

## Using skills

Once installed, ForgeFlow's skills are available in every Pi conversation. Invoke them by describing what you want — Pi matches the skill description automatically — or call them explicitly by name (e.g. `/caveman`, `/forge-chain`).

## Your first workflow

The fastest way to experience ForgeFlow end-to-end is the chain:

```
You: /forge-chain
```

The chain walks you through four phases — intake interview, PRD, issue breakdown, and automated implementation — pausing at interactive steps and asking for confirmation before any code is written. See [The ForgeFlow Workflow](workflow.md) for how the phases connect, and the [skills reference](skills/README.md) for each skill in detail.

If you prefer to drive each step yourself, run the skills individually in this order:

1. [grill-me](skills/grill-me.md) — resolve every design decision
2. [to-prd](skills/to-prd.md) — write the PRD
3. [to-issue](skills/to-issue.md) — break it into issues
4. [ralph](skills/ralph.md) — implement the issues automatically

> **Tip:** Activate [caveman](skills/caveman.md) at any point to cut token usage by ~75%. Use [learn](skills/learn.md) after any step for a teaching-mode walkthrough of what was built and why.
