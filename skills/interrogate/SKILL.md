---
name: interrogate
description: Interrogate a design decision relentlessly, one question at a time, until reaching shared understanding, then optionally hand off to decisions to write it up. Use when the user wants to stress-test a UX/product decision, is unsure between design directions, or uses a "grill"-style trigger phrase about a design (not code) question.
disable-model-invocation: true
---

# Feature Grill

Interview the user relentlessly about a design decision, whether a feature scope, a UX tradeoff, or a state-model choice, until reaching a shared understanding. This is the same interrogation discipline as a general planning grill, aimed specifically at design/product decisions rather than implementation plans.

## Process

1. **Walk the decision tree one branch at a time.** Ask one question, wait for the answer, then ask the next, never a batch of questions at once. Each question should resolve a real dependency the next question needs (don't ask about visual polish before scope is settled, don't ask about scope before you know who the user even is).
2. **Always offer a recommended answer.** State your recommendation and the reasoning behind it before waiting for their response. This isn't a neutral survey, it's a collaborator with a point of view that can be overridden.
3. **Look up facts, ask about decisions.** If something is discoverable from the codebase, existing docs (`docs/PERSONA_WALKTHROUGH.md`, `docs/OOUX_OBJECT_MAP.md`, `DESIGN.md`), or prior `docs/adr/` records, go find it. Don't make the user repeat what's already written down. Only ask about things that are genuinely theirs to decide.
4. **Surface rejected alternatives explicitly.** When a question resolves toward one option over another, say why the alternative doesn't work. This is the material that makes the eventual record actually useful, not just the final answer.
5. **Don't act until confirmed.** State the full shared understanding back before touching any code or docs, and wait for explicit confirmation.

## Step: Offer the handoff

Once you've reached shared understanding, ask whether this decision is worth a permanent record via [`decisions`](../decisions/SKILL.md). Most design-crit sessions that reached a non-obvious call (rejected an option someone will likely propose again, traded off two real concerns) are worth it. If yes, write the ADR now while the rejected alternatives are still fresh, using what this session already surfaced in step 4; don't re-derive them.

`decisions` also works completely standalone. This handoff is a convenience for decisions made *during* a grill, not a requirement. A decision made outside a grill session gets written up directly with `decisions`.

## What this replaces vs. adds

For implementation/plan-level stress-testing (not a design decision), a design-focused grill isn't the right tool. That's a general planning interrogation, same mechanics, different subject matter. This skill exists specifically so a design or product call gets the same rigor without confusing "should we build this" questions with "how should we build this" ones.
