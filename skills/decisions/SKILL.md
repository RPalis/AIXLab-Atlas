---
name: decisions
description: Capture a UX or architecture decision as a lightweight ADR (Architecture Decision Record) in docs/adr/, documenting the rejected alternatives and why. Use when a prototype makes a non-obvious call (a workaround, a template override, a state-model tradeoff) that a teammate or stakeholder will later ask "why did we do it this way?" about.
disable-model-invocation: true
---

# Decision Records (ADRs)

This skill captures a single non-obvious decision, a UX tradeoff, an architectural workaround, or a state-model choice, as a short, freeform record in `docs/adr/`, so the reasoning survives past the person who made the call.

Not every decision needs one. Write one when a decision:
- Rejected an obvious/simpler alternative for a specific reason, and someone later is likely to propose that alternative again
- Trades off two real UX or engineering concerns against each other (not a pure preference)
- Would be expensive or confusing to reverse without knowing why it was made this way

## Step 1: Write the record

Create `docs/adr/NNNN-short-decision-title.md`, numbered sequentially from whatever the highest existing ADR number is (start at `0001` if none exist). Freeform prose is fine, since this doesn't need a rigid numbered-decision/consequences template to be useful. Cover:

- **What was decided.** State it plainly, in one or two sentences.
- **Why.** The concrete constraint or reason that drove it.
- **What was rejected, and why.** The alternative(s) that seemed obvious but didn't work, and the specific reason each was ruled out. This is the part that actually prevents the decision from being silently re-litigated later.
- **Scope.** What this decision does and doesn't apply to, if it's not universal.

Use [`templates/adr-template.md`](templates/adr-template.md) as a starting shape, not a rigid form to fill in every field of.

**Completion criterion:** a teammate unfamiliar with the discussion could read the record and understand not just what was chosen, but why the obvious alternative was rejected.

## Step 2: Link it where it'll be found

Don't let it go silent in `docs/adr/`. Reference the record from wherever the decision is visible in code, with a one-line comment pointing at the ADR path near the relevant code, or a link from the feature's section in `docs/OOUX_OBJECT_MAP.md` / `docs/PERSONA_WALKTHROUGH.md` if the decision affects one of those.
