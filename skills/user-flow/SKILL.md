---
name: user-flow
description: >-
  Design a complete, evidence-grounded end-to-end user flow — entry points, decisions, error/empty states,
  recovery paths, exit points — structured so it translates directly into wireframes. Trigger on "design the
  user flow", "map this task flow", "what screens do we need for X", "build a flow for [feature]", "flow
  diagram before we wireframe", or before wireframing/prototyping/UI design/usability testing/developer
  handoff/writing UI user stories.
---

# User Flow (Advanced)

Transform a problem statement, persona and journey-map context into one complete, screen-by-screen user flow
that gets someone from entry to goal — covering the happy path, every decision point, and every place it can
break. Reads existing IA/journey-map artifacts before inventing structure from scratch.

Estimated time: **20–30 minutes** for one flow.

**Not this skill:**
- Deciding the site's overall navigation structure → [`information-architecture`](../information-architecture/SKILL.md).
  Screen names in this flow must match that skill's labels exactly, or the mismatch must be stated and
  resolved, not silently left to drift.
- Mapping the full emotional experience across a persona's scenario →
  [`customer-journey`](../customer-journey/SKILL.md), or a current-state process →
  [`journey`](../journey/SKILL.md). This skill reads their stage boundaries and pain points as input; it
  doesn't build them.
- Building the actual screens → `scaffold`. A flow is the sequence and logic, not the visual layout.

---

## 0. Non-negotiable principles (read first)

1. **One flow = one goal.** A flow that tries to cover two unrelated goals is two flows. Split them.
2. **Usability over implementation.** Never bend the flow to fit an internal system's shape or an org
   boundary — the user's mental model wins, same discipline as Information Architecture's own rule.
3. **Never invent screens, business rules or API behaviour.** If a dependency or constraint isn't given,
   mark it `ASSUMPTION` and name what it's inferred from.
4. **Every flow accounts for failure, not just success.** A flow with no error states, empty states or
   recovery paths is not finished — it is the happy path pretending to be the whole flow.
5. **Structure for translation, not decoration.** The output must be directly usable by whoever wireframes
   next — screen name, user goal, primary action, system response, dependencies, every step, no exceptions.
6. **The output is a first draft, not a final user flow.** Always hand back the Human Review checklist.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

---

## 1. When to use this

Use **before**: wireframing · prototyping · UI design · usability testing · developer handoff · creating user
stories for UI.

Downstream, the output feeds directly into wireframes — a flow with unresolved edge cases produces a
wireframe with the same unresolved edge cases, just harder to see.

---

## 2. What you'll need (inputs)

**Required**
- Problem statement or feature brief + success criteria
- Primary persona
- User goal
- Existing journey map or information architecture (if available from earlier work)

**Optional**
- Current user flow (to run "as is" → "to be")
- Wireframes
- Business rules
- API documentation
- Technical constraints
- Competitor examples

If any *required* input is missing, ask **up to five** clarifying questions before designing (see §5, Step
0). Do not silently assume the missing pieces.

---

## 3. Reading existing context first

A user flow invented from nothing repeats work the project has already done. Before designing, check for and
read whichever of these already exist:

| Source | What it gives the flow |
|---|---|
| [`customer-journey`](../customer-journey/SKILL.md) or [`journey`](../journey/SKILL.md) output | Stage boundaries, emotional low points, pain points already evidenced per stage |
| [`information-architecture`](../information-architecture/SKILL.md) output | The page/nav structure the flow must move through — screen names should match its labels, not invent new ones |
| [`problem-statement`](../problem-statement/SKILL.md) output | The specific goal and acceptance criteria the flow must satisfy |
| [`competitor-analysis`](../competitor-analysis/SKILL.md) or [`ux-benchmark`](../ux-benchmark/SKILL.md) output | Real precedent for how this task is solved elsewhere — a pattern to adopt/adapt/avoid, not a pain claim |
| An existing user flow | The "as is" baseline, if redesigning rather than designing fresh |

If a required source doesn't exist yet in the project, say so and ask whether to proceed on stated
assumptions or wait for it — do not quietly fabricate the missing IA or persona.

---

## 4. Output surface — this release is document-only

**Deliver as Markdown, an HTML diagram, or a table.** Figma/FigJam production is documented below for when
Figma scope is revisited, but is **not available this release** — do not attempt it.

<details>
<summary>Deferred: Figma / FigJam production (not available this release)</summary>

Load the mandatory `figma-use` skill **before** any `use_figma` write call. NodeIds are session-specific —
re-search at the start of a session; never reuse IDs from a past session.

**READ:** Figma MCP `get_design_context` / `get_screenshot` / `get_metadata`; FigJam via `get_figjam` or
`figjam_get_board_contents` / `figjam_get_connections`.

**ANALYSE:** check an existing flow against §6 (required components) and §7 (per-screen schema) — does every
decision point have both branches drawn? Does every terminal state resolve? Is there a screen with no way
back and no stated reason?

**CREATE — FigJam** (fast, workshop-friendly): one shape per screen/state (diamond for decisions, rounded
rect for screens, coral-bordered rect for error/empty states), connectors labelled at decision points
(Yes/No, Success/Fail), sections by flow phase if long, sticky notes for assumptions, then auto-arrange.
**CREATE — Figma:** `generate_diagram` for a quick version, or frames bound to design-system tokens.

Always validate visually after building: screenshot → check every arrow lands on target, no orphans, no
overlapping labels → iterate (max ~3 passes) → final screenshot to confirm.

</details>

---

## 5. The workflow

```
Review user flow → Define screens → Design user flow → Identify edge cases → Optimise experience → Review & Export
```

### Step 0 — Clarify (only if required inputs are missing)
Ask up to five questions covering: product, feature, business objective, persona, primary user goal, success
criteria, and what context (journey map/IA/business rules/API docs/constraints) already exists. Then stop and
wait. Skip if inputs are already sufficient.

### Step 1 — Review user flow
If an "as is" flow exists, walk it first — note where it already breaks before redesigning anything.

### Step 2 — Define screens
List every screen/modal/decision point the goal requires, grounded in the IA if one exists. Don't invent a
screen name the IA doesn't already use.

### Step 3 — Design user flow
Sequence entry point → actions → decisions → success path, screen by screen, filling the per-screen schema
(§7) for each.

### Step 4 — Identify edge cases
For every decision point and every system response, ask "what else can happen here?" — error states, empty
states, timeouts, permission failures, offline, back-navigation. Give each a recovery path or an explicit
exit, never a dead end.

### Step 5 — Optimise experience
Pass over the whole flow looking to: remove unnecessary steps, reduce cognitive load, improve clarity,
prevent user errors, reduce abandonment. Note what changed and why.

### Step 6 — Review & Export
Produce the deliverables (§8), attach the Human Review checklist (§10), export to the chosen document
format.

**Completion criterion:** every screen has a filled §7 schema, every decision point has both branches drawn,
and every terminal state resolves to success, an explicit error, or a stated exit.

---

## 6. Required flow components (every flow must have these)

- **Entry points** — every way a user can arrive at step 1, not just the primary one
- **User actions** — what they do at each step
- **System responses** — what the system does back
- **Decision points** — every branch, both directions drawn
- **Success paths** — the happy path to the stated goal
- **Error states** — what happens when something fails, and how the user recovers
- **Empty states** — what a screen shows with nothing in it yet
- **Recovery paths** — the way back from any failure or dead end
- **Exit points** — every place a user can leave the flow, intentionally or not

---

## 7. Per-screen schema (fill for every screen/step)

- **Screen name** — matching the IA's own label where one exists, never a new invented name
- **User goal** — what they're trying to do on this specific screen
- **Primary action** — the one thing that moves them forward
- **System response** — what happens after the action
- **Dependencies** — data, permissions, or prior steps this screen requires (if applicable)

---

## 8. Deliverables

Produce all seven, in this order:

1. **Executive Summary** — the flow in brief: goal, entry points, the headline optimisation, top risk.
2. **User Flow** — the complete end-to-end flow, screen by screen, per §7.
3. **Screen Inventory** — every screen, modal and decision point required, in one list.
4. **Edge Cases & Error States** — every alternative path, failure scenario and recovery route.
5. **UX Rationale** — the reasoning behind key decisions, simplifications and interaction patterns chosen.
6. **Optimisation Opportunities** — what was removed/simplified and why, mapped to §5 Step 5's five levers.
7. **Validation Checklist** — usability risks, assumptions, and what still needs validating before
   wireframing.

---

## 9. Output format (text version)

```
EXECUTIVE SUMMARY
[Persona] · [Goal] · [Entry points] — headline simplification, top risk.

SCREEN INVENTORY
1. [Screen] — [purpose]
2. …

USER FLOW
[Entry] → [Screen 1: action → response] → [Decision] ─Yes→ [Screen 2] ─No→ [Error/Recovery] → … → [Exit/Success]

EDGE CASES & ERROR STATES
| Trigger | State shown | Recovery path |
|---|---|---|
|         |             |               |

UX RATIONALE
- [decision] — why, and what alternative was rejected

OPTIMISATION OPPORTUNITIES
- Removed: [step] — [why]
- Reduced: [friction] — [how]

VALIDATION CHECKLIST
- [ ] [assumption or path to verify with real users]
```

Adapt to the medium — diagram, table, written narrative — based on what the user needs.

---

## 10. Human review required (attach to every output)

Before moving into wireframes:
- Confirm every input you fed in was correctly read — the sources listed in §3 were actually consulted, not
  assumed.
- Run this skill's own plan/clarify step first so every input is accounted for before designing starts.
- Verify the flow supports the user's primary goal.
- Ensure edge cases and error states have been considered.
- Remove unnecessary steps and decision points.
- Validate the flow with stakeholders and representative users where possible.
- Save the approved plan.

**Treat the output as a first draft, not a final user flow.**

---

## 11. The master prompt (system framing)

Use this framing when generating the flow:

> You are a Senior UX Designer responsible for designing simple, intuitive and efficient user flows.
>
> Your objective is to create the simplest possible journey that enables users to complete their goal while
> accounting for edge cases, errors and business constraints.
>
> Always prioritise usability over implementation.
>
> Do not optimise for internal systems or organisational structure, but always consider potential technical
> constraints.
>
> Before you begin: ask up to five clarifying questions if important information is missing.
>
> Design one complete user flow. The flow should include: entry points · user actions · system responses ·
> decision points · success paths · error states · empty states · recovery paths · exit points.
>
> For each step include: screen name · user goal · primary action · system response · dependencies (if
> applicable).
>
> Identify opportunities to: remove unnecessary steps · reduce cognitive load · improve clarity · prevent
> user errors · reduce abandonment.
>
> Highlight: edge cases · failure scenarios · validation requirements · technical assumptions.
>
> Finally produce: (1) Executive Summary, (2) User Flow, (3) Screen Inventory, (4) Edge Cases & Error States,
> (5) UX Rationale, (6) Optimisation Opportunities, (7) Validation Checklist. Ensure the flow is structured so
> it can be directly translated into wireframes.

Structured intake to fill before generating:
`PROJECT`: product · feature · business objective.
`USER`: persona · primary user goal · success criteria.
`CONTEXT`: problem statement + success metrics · journey map · information architecture · existing user
flow(s) · business rules · API documentation · technical constraints · wireframes · competitor examples &
benchmarks.

---

## 12. Related methods (know the difference)

| Method | Scope | Perspective | Purpose |
|---|---|---|---|
| **Information Architecture** | Whole product's content + navigation | User's mental model | Where things live and how they're labelled |
| **User Flow** (this skill) | One goal, screen-by-screen | User completing a task | How someone actually moves through the product to finish it |
| **Journey Map** | One persona's whole experience, incl. off-product moments and emotion | User | Understand the broader experience, not just in-product steps |
| **Wireframe** | One screen at a time, visual/structural | Designer/dev | What each screen in the flow actually looks like |

Common sequence: Journey Map → Information Architecture → **User Flow** → Wireframe → Hi-fi UI.

---

## 13. Facilitation tips

- One flow, one goal — resist scope-creeping a second goal into the same diagram.
- Draw both branches of every decision point, even the boring one — an undrawn "No" branch is a dead end
  nobody designed.
- If a screen name doesn't match the IA, that's a signal to fix the IA or the flow, not to let them drift.
- The flow is a working document, not a deliverable to defend — the point is catching gaps before code does.

---

## 14. Common mistakes to avoid

- Happy-path-only flows with no error/empty states.
- Screen names invented fresh instead of reused from the IA.
- Decision points with only one branch drawn.
- Optimising for how the backend/org is structured instead of the user's goal.
- Treating the flow as final instead of a first draft that needs stakeholder and user validation.
- Skipping the clarifying questions and guessing at the persona or business objective.

---

## 15. What's next

- Feed the approved flow into the stage-related folder of the project.
- Keep prompts / `.md` files / chat-history context / tooling in the same task-stage folder.
- Use this output directly as the input to wireframing (`scaffold`) — it should read the flow, not re-derive
  one from raw research.
