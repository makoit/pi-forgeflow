# caveman

Ultra-compressed communication mode. Cuts token usage by ~75% by stripping filler, articles, and pleasantries while keeping full technical accuracy. Useful for long sessions or bandwidth-constrained contexts — [forge-chain](forge-chain.md) offers it automatically on first run.

## Invoke

Say `caveman mode`, `less tokens`, `talk like caveman`, `be brief`, or `/caveman`.

**Deactivate:** say `stop caveman` or `normal mode`. The mode persists across turns until explicitly turned off.

## What changes

Dropped: articles, filler words, pleasantries, hedging. Sentence fragments and short synonyms are used, common terms abbreviated (DB, auth, config), causality expressed with arrows (`X -> Y`).

Unchanged: technical terms stay exact, code blocks are untouched, error messages are quoted verbatim.

```
Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."
Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"
```

## Auto-clarity exception

Caveman is temporarily dropped for security warnings, confirmations of irreversible actions, multi-step sequences where fragment order risks misreading, and when you ask for clarification. Normal caveman resumes afterwards.

## Example

```
You: caveman mode
Pi:  Mode active.

You: why is my background job processing orders out of order?
Pi:  Queue lack ordering guarantee. Use priority queue or add sequence field + sort on consume.
```
