---
name: guide
description: Write end-user documentation for a prototype: a Getting Started section plus a phase-by-phase walkthrough of the actual product experience, with diagrams via map's flow mode. Markdown first, with an optional PDF export. Use when the user wants documentation that teaches someone how to use the app and solve problems, not internal UX/design docs.
disable-model-invocation: true
---

# User Guide

Writes documentation for the people who will actually *use* the prototype. This is distinct from every other doc this suite produces, which is for the team *building* it (`docs/PERSONA_WALKTHROUGH.md`, `docs/OOUX_OBJECT_MAP.md`, `DESIGN.md` are all internal). Modeled on a real, previously-shipped user guide shape: a short orientation section, then a phase-by-phase walkthrough of one complete journey through the product.

## Step 1: Write the orientation section

- **What [Product] is.** One paragraph, plain language, no jargon.
- **Roles.** If the app has more than one user role/persona, describe each briefly (pull from `persona` if documented).
- **Logging in / getting started.** The actual first steps, however lightweight in a prototype.
- **The interface at a glance.** A labeled overview of the main navigation/shell.
- **Core principles.** Anything a user needs to understand up front to not get confused later (e.g. "changes save automatically," "X requires approval before it takes effect").

## Step 2: Write the phase-by-phase walkthrough

Structure as **Phases**, each with numbered sub-steps, e.g. "Phase A, Accessioning" → "A.1 Open the Accession modal," "A.2 Enter details." This should trace one complete, realistic journey end to end (not every possible path, see Step 3 for branches), written as direct instruction ("Click X to do Y"), not narrative prose like `persona`'s scenes.

For each phase, note explicitly:
- What the user can/can't do at this point (gates, locks, prerequisites).
- What happens automatically vs. what requires user action.
- Common mistakes or points of confusion, if known (pull from `audit` findings or `interrogate`/`decisions` if a related decision surfaced one).

## Step 3: Diagram phases and branches

For any phase with a real decision point or branching path, call [`map`](../map/SKILL.md)'s `flow` mode to draw it as a flowchart and embed it inline. Don't describe a branch in prose alone when a 5-node diagram would be clearer. A single linear phase doesn't need a diagram; reserve them for where they earn their place.

## Step 4: Write the troubleshooting section

A short section addressing the most likely points of confusion or failure, sourced from real gaps found during `audit` or `audit`, or documented `docs/UNKNOWNS.md` resolutions, not invented generically. Format as **Problem → Why it happens → What to do**.

## Step 5: Export

The primary artifact is `docs/USER_GUIDE.md`. If a PDF is needed (for offline distribution or a more polished handoff), reuse [`showcase`](../showcase/SKILL.md)'s export path rather than building a separate PDF pipeline. The guide's phases translate directly into that skill's slide/section structure.

**Completion criterion:** every phase traces to a real, verifiable path through the actual prototype (not an aspirational one), every branch/decision point has a diagram rather than prose-only description, and the troubleshooting section only contains issues that were actually found, not generic filler.
