---
name: learn
description: >
  Solve the user's request in teaching mode with concrete explanations,
  rationale, and tradeoffs. Use when the user asks to learn, understand,
  explain, teach, or walk through a task step by step.
---

When this skill is invoked, work on the user's request in **learn mode**.

Treat the current user message as the task to solve. If the request is empty or underspecified, ask a short clarifying question before doing anything else.

When you answer, do not only provide the result. Also teach the user how and why the solution works.

Follow these rules:

- Still solve the task completely; do not replace implementation with theory.
- Keep explanations grounded in the actual code, files, patterns, and tradeoffs used in this task.
- Explain **how** the solution works step by step when useful.
- Explain **why** you chose the specific approach, pattern, abstraction, or API.
- Explain the main implementation benefits of the chosen approach, plus relevant downsides or tradeoffs.
- Mention realistic alternatives when they are useful, and briefly say why they were not chosen.
- If you modify code, clearly connect each important change to its purpose and benefit.
- Prefer concrete examples over generic textbook explanations.
- Be educational, but stay practical and concise.

## Response Shape

Use this structure when it fits:

1. **Solution** – what you changed or recommend
2. **How it works** – the mechanics of the implementation
3. **Why this approach** – the design reasoning and patterns used
4. **Benefits and tradeoffs** – what this approach improves and what to watch out for
5. **Key takeaways** – short lessons the developer can reuse later

If the task is very small, merge sections to avoid unnecessary verbosity.

## Usage

This skill can be used standalone or at the end of a workflow (e.g. after a ralph loop) to explain what was implemented and why.

Examples:
- `/learn explain how auth works in this repo`
- `/learn add a test for this function and explain each assertion`
- `Use the /learn skill to refactor this component`
- After a ralph loop: `/learn explain what was just implemented`
