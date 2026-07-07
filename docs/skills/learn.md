# learn

Activates teaching mode. Solves the task completely while also explaining how the solution works, why that approach was chosen, relevant tradeoffs, and key takeaways you can reuse. Explanations stay grounded in the actual code and patterns of the task — no generic textbook theory.

Works standalone or as a post-workflow explainer, e.g. after a [ralph](ralph.md) loop.

## Invoke

Say `learn`, `explain this`, `teach me`, `walk me through`, or `/learn <task>`.

## Response shape

When it fits, responses follow this structure (merged for small tasks):

1. **Solution** — what was changed or recommended
2. **How it works** — the mechanics of the implementation
3. **Why this approach** — the design reasoning and patterns used
4. **Benefits and tradeoffs** — what this improves and what to watch out for
5. **Key takeaways** — short lessons to reuse later

The task is always solved completely — teaching mode never replaces implementation with theory.

## Examples

```
You: /learn explain what ralph just implemented
Pi:  [reads the codebase changes, explains each part — mechanics, design decisions, tradeoffs, and reusable patterns]

You: /learn add a test for this function and explain each assertion
Pi:  [writes the test, then walks through what each assertion checks and why it matters]
```
