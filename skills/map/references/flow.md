# Map: flow mode

Part of the [`map`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Design a complete, evidence-grounded end-to-end user flow — entry points, decisions, error/empty states, recovery paths, exit points — for **one goal**, structured so it translates directly into wireframes. Reads existing IA/journey-map artifacts before inventing structure from scratch.

Estimated time: **20-30 minutes** for one flow.

## Contents

  - Non-negotiable principles (read first)
  - When to use this
  - What you'll need
  - Reading existing context first
  - The workflow
  - Required flow components
  - Deliverables
  - Output format (text version)
  - Human review required

### Non-negotiable principles (read first)

1. **One flow = one goal.** A flow that tries to cover two unrelated goals is two flows. Split them.
2. **Usability over implementation.** Never bend the flow to fit an internal system's shape or an org boundary — the user's mental model wins, same discipline as `ia` mode's own rule.
3. **Never invent screens, business rules or API behaviour.** If a dependency or constraint isn't given, mark it `ASSUMPTION` and name what it's inferred from.
4. **Every flow accounts for failure, not just success.** A flow with no error states, empty states or recovery paths is not finished — it is the happy path pretending to be the whole flow.
5. **Structure for translation, not decoration.** The output must be directly usable by whoever wireframes next — screen name, user goal, primary action, system response, dependencies, every step, no exceptions.
6. **The output is a first draft, not a final user flow.** Always hand back the Human Review checklist.

### When to use this

Use **before**: wireframing (`scaffold`) · usability testing · developer handoff · creating user stories for UI. Downstream, the output feeds directly into wireframes — a flow with unresolved edge cases produces a wireframe with the same unresolved edge cases, just harder to see.

### What you'll need

**Required:** problem statement or feature brief + success criteria · primary persona · user goal · an existing `objects`/`site` output or `ia` mode output, if available.
**Optional:** current user flow (to run "as is" → "to be") · wireframes · business rules · API documentation · technical constraints · competitor examples.

If any required input is missing, ask **up to five** clarifying questions before designing. Do not silently assume the missing pieces.

### Reading existing context first

A user flow invented from nothing repeats work the project has already done. Before designing, check for and read whichever of these already exist:

| Source | What it gives the flow |
|---|---|
| [`journey`](../../journey/SKILL.md)'s `experience` or `map`/`blueprint` output | Stage boundaries, emotional low points, pain points already evidenced per stage |
| `ia` mode output | The page/nav structure the flow must move through — screen names should match its labels, not invent new ones |
| [`problems`](../../problems/SKILL.md) output | The specific goal and acceptance criteria the flow must satisfy |
| [`competitors`](../../competitors/SKILL.md) `analysis` or `benchmark` output | Real precedent for how this task is solved elsewhere — a pattern to adopt/adapt/avoid, not a pain claim |
| An existing user flow | The "as is" baseline, if redesigning rather than designing fresh |

If a required source doesn't exist yet in the project, say so and ask whether to proceed on stated assumptions or wait for it — do not quietly fabricate the missing IA or persona.

### The workflow

```
Review flow → Define screens → Design flow → Identify edge cases → Optimise experience → Review & Export
```

**Step 0 — Clarify** (only if required inputs are missing): product, feature, business objective, persona, primary user goal, success criteria, and what context already exists. Then stop and wait.

**Step 1 — Review.** If an "as is" flow exists, walk it first — note where it already breaks before redesigning anything.

**Step 2 — Define screens.** List every screen/modal/decision point the goal requires, grounded in the IA if one exists. Don't invent a screen name the IA doesn't already use.

**Step 3 — Design the flow.** Sequence entry point → actions → decisions → success path, screen by screen. For **every** screen/step capture: screen name (matching the IA's own label where one exists), user goal, primary action, system response, dependencies.

**Step 4 — Identify edge cases.** For every decision point and every system response, ask "what else can happen here?" — error states, empty states, timeouts, permission failures, offline, back-navigation. Give each a recovery path or an explicit exit, never a dead end.

**Step 5 — Optimise.** Pass over the whole flow looking to remove unnecessary steps, reduce cognitive load, improve clarity, prevent user errors, reduce abandonment. Note what changed and why.

**Step 6 — Review & export.** Produce the deliverables below, attach the Human Review checklist, export as Markdown, an HTML diagram, or a table.

**Completion criterion:** every screen has a filled schema, every decision point has both branches drawn, and every terminal state resolves to success, an explicit error, or a stated exit.

### Required flow components

Entry points (every way in, not just the primary one) · user actions · system responses · decision points (both branches drawn) · success paths · error states (with recovery) · empty states · recovery paths · exit points.

### Deliverables

1. **Executive Summary** — goal, entry points, headline optimisation, top risk.
2. **User Flow** — the complete end-to-end flow, screen by screen.
3. **Screen Inventory** — every screen, modal and decision point required.
4. **Edge Cases & Error States** — every alternative path, failure scenario, recovery route.
5. **UX Rationale** — reasoning behind key decisions and simplifications.
6. **Optimisation Opportunities** — what was removed/simplified and why.
7. **Validation Checklist** — usability risks, assumptions, what still needs validating.

### Output format (text version)

```
EXECUTIVE SUMMARY
[Persona] · [Goal] · [Entry points] — headline simplification, top risk.

SCREEN INVENTORY
1. [Screen] — [purpose]

USER FLOW
[Entry] → [Screen 1: action → response] → [Decision] ─Yes→ [Screen 2] ─No→ [Error/Recovery] → … → [Exit/Success]

EDGE CASES & ERROR STATES
| Trigger | State shown | Recovery path |
|---|---|---|

VALIDATION CHECKLIST
- [ ] [assumption or path to verify with real users]
```

Adapt to the medium — diagram, table, written narrative — based on what the user needs. For a state-machine-shaped flow, `stateDiagram-v2` (see `objects` mode Step 3) may fit better than the flowchart above.

### Human review required

Confirm every source in the table above was actually consulted, not assumed. Verify the flow supports the primary goal. Ensure edge cases and error states have been considered. Remove unnecessary steps. Validate with stakeholders and representative users where possible.

**Treat the output as a first draft, not a final user flow.**

---
