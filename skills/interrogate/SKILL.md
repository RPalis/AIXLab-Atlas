---
name: interrogate
description: >-
  Questions a UX or product decision one question at a time until the team shares one understanding,
  then records it through decisions. Use when someone is unsure between design directions or asks to
  be grilled on a design choice.
---

# Feature Grill

Interview the user relentlessly about a design decision (feature scope, UX tradeoff, or state-model choice) until reaching shared understanding. Same interrogation discipline as a general planning grill, aimed specifically at design/product decisions rather than implementation plans.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Process

1. **Walk the decision tree one branch at a time.** Ask one question, wait for the answer, then ask the next, never a batch of questions at once. Each question should resolve a real dependency the next question needs (don't ask about visual polish before scope is settled, don't ask about scope before you know who the user even is).
2. **Always offer a recommended answer.** State your recommendation and the reasoning behind it before waiting for their response. This isn't a neutral survey, it's a collaborator with a point of view that can be overridden.
3. **Look up facts, ask about decisions.** If something is discoverable from the codebase, existing docs (`docs/PERSONA_WALKTHROUGH.md`, `docs/OOUX_OBJECT_MAP.md`, `DESIGN.md`), or prior `docs/adr/` records, go find it. Don't make the user repeat what's already written down. Only ask about things that are genuinely theirs to decide.
4. **Surface rejected alternatives explicitly.** When a question resolves toward one option over another, say why the alternative doesn't work. This is the material that makes the eventual record actually useful, not just the final answer.
5. **Sharpen terms as you go.** When the user calls one thing by two names, or one name covers two things, stop and settle it. Record the settled term in `<docs>/GLOSSARY.md` (create it if absent): the term, a one-sentence definition, and the words to avoid. Use the settled word in every later question.
6. **Don't act until confirmed.** State the full shared understanding back before touching any code or docs, and wait for explicit confirmation.

## Step: Offer the handoff

Once you've reached shared understanding and the user has confirmed it, ask whether this decision is worth a permanent record via [`decisions`](../decisions/SKILL.md). Most design-crit sessions that reached a non-obvious call (rejected an option someone will likely propose again, traded off two real concerns) are worth it. If yes, write the ADR in the same turn, while the rejected alternatives are still fresh: follow `decisions` Step 1 using what this session already surfaced in step 4, and do not re-derive or re-ask it. One yes covers the whole path from agreed decision to saved record.

`decisions` also works completely standalone. This handoff is a convenience for decisions made *during* a grill, not a requirement. A decision made outside a grill session gets written up directly with `decisions`.

## What this replaces vs. adds

For implementation/plan-level stress-testing (not a design decision), use a general planning interrogation instead, same mechanics, different subject matter. This skill exists so a design or product call gets the same rigor without confusing "should we build this" with "how should we build this."
