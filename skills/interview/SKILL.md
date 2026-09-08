---
name: interview
description: Build a phase-aware user research kit (question bank, interview script, and synthesis template) for either discovery (early, open-ended) or validation (later, hypothesis-testing) interviews. Reads docs/UNKNOWNS.md to fold in open questions raised elsewhere in the project. Use when preparing to talk to real users, whether at project start or to validate a working prototype.
disable-model-invocation: true
---

# User Interview Kit

Produces a complete, ready-to-run interview kit, not just a question list. Which mode to use is **context-aware**, not something to ask the user to declare:

- **No `docs/PERSONA_WALKTHROUGH.md` or `docs/OOUX_OBJECT_MAP.md` yet** → **Discovery mode**: open-ended questions to lock in who the users are and what they need, feeding directly into [`persona`](../persona/SKILL.md) and [`map`](../map/SKILL.md)'s `objects` mode.
- **A working prototype already exists** (`frontend/` scaffolded, screens built) → **Validation mode**: targeted, hypothesis-testing questions about specific screens/flows, informed by what's actually been built and any `docs/UNKNOWNS.md` entries.
- **Both signals present** → ask the user which is the goal for this round rather than guessing; a project can legitimately need both at once (validating shipped features while still discovering an adjacent user segment).

## Step 1: Read `docs/UNKNOWNS.md`

If it exists, every open item there is a candidate interview question — these accumulated naturally from work elsewhere in the project (see AGENTS.md §2.6). Fold relevant unknowns into the question bank below rather than starting from a blank page.

## Step 2: Build the question bank

Use [`templates/discovery-questions.md`](templates/discovery-questions.md) or [`templates/validation-questions.md`](templates/validation-questions.md) depending on mode. Discovery questions are open-ended ("walk me through the last time you had to..."); validation questions test a specific hypothesis against a specific screen ("when you saw this state, what did you expect to happen next?"). Don't write validation-style leading questions into a discovery guide or vice versa.

## Step 3: Write the interview script

Use [`templates/interview-script-template.md`](templates/interview-script-template.md). Include a short **target persona blurb**: who this interview is trying to reach, 2-3 sentences, pulled from `docs/PERSONA_WALKTHROUGH.md` if it exists, otherwise a best-guess draft marked unconfirmed. Not a full recruiting/screening flow, just enough for whoever is scheduling interviews to know who to look for.

## Step 4: Prepare the synthesis template

Use [`templates/synthesis-template.md`](templates/synthesis-template.md) to capture what's actually heard, ready to fill in immediately after each interview while it's fresh, not written from memory days later.

## Step 5: Route what you learn

After interviews are synthesized, route each finding to where it belongs; don't leave it stranded in the synthesis doc:
- A confirmed fact about users/workflow → update `docs/PERSONA_WALKTHROUGH.md` via [`persona`](../persona/SKILL.md).
- A confirmed fact about objects/entities/CTAs → update `docs/OOUX_OBJECT_MAP.md` via [`map`](../map/SKILL.md)'s `objects` mode.
- An item that resolved an `docs/UNKNOWNS.md` entry → remove it from `UNKNOWNS.md` and promote the answer to whichever doc owns that domain.
- Something learned that raises a *new* open question → append it to `docs/UNKNOWNS.md` for the next round rather than losing it.

**Completion criterion:** every question in the bank ties to either an unresolved persona/domain gap or a specific `UNKNOWNS.md` entry. No generic filler questions that don't inform a real project decision.
