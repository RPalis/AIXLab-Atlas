# Audit: heuristic mode

Part of the [`audit`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Run a structured, evidence-based UX audit of an existing product — heuristic by heuristic — to surface
usability problems, rank them by severity, and turn each into a specific fix. **Scope is the experience**:
flows, navigation, information architecture, interaction, content and accessibility signals — **not visual
design.** A colour, typography, or spacing observation belongs in `craft` mode or `spec` mode, not here.

**Not this mode:** a quick in-progress read (`craft` is lighter and faster for that) or a visual-fidelity
check against a spec (`spec`).

## Contents

  - Step 1: Gather inputs
  - Step 2: Walk each key flow against every heuristic in scope
  - Step 3: Rate severity and write fixes
  - Step 4: Review pass — GATE
  - Step 5: Report
  - Human review required

### Step 1: Gather inputs

Required: the product or key flows to audit (links or a walkthrough, using real screen names), what the
product is for plus the primary user goals/tasks, a target persona (or the `persona` `card`-mode output),
and the heuristics/scope to evaluate against (or use the default 12 below).

Optional: analytics, heatmaps or session recordings as evidence; prior research or support tickets; an
accessibility target (e.g. WCAG 2.2 AA); known problem areas or hypotheses;
[`competitors`](../../competitors/SKILL.md) `analysis` or `benchmark` output.

Ask up to five clarifying questions if anything required is missing. **Do not start until the flows, goals
and scope are clear.** If you cannot see a flow, say so rather than guessing.

### Step 2: Walk each key flow against every heuristic in scope

Default 12-point UX lens (add or drop for the product, and say why):

1. Visibility of system status / feedback
2. Match with the real world (language, mental model)
3. User control & freedom (undo, exits, back)
4. Consistency & standards (behaviour, not visuals)
5. Error prevention
6. Recognition rather than recall (findability, memory load)
7. Flexibility & efficiency (shortcuts, expert paths)
8. Recognise, diagnose & recover from errors
9. Help & documentation
10. Information architecture & navigation clarity
11. Content & microcopy clarity
12. Accessibility (WCAG signals: keyboard, screen reader, structure)

Go step by step through each flow from the persona's goal. At each screen/step, check against every heuristic
in scope. Log every issue found, with the evidence behind it — **every issue needs evidence: the screen/step
plus the heuristic it violates**, and analytics or a recording where available. No evidence, don't raise it.
Label anything you cannot verify directly `NOT VERIFIED`. Never invent a screen or behaviour — if you can't
see a flow, say so and ask.

### Step 3: Rate severity and write fixes

Rate each issue's severity **0-4**:

| Score | Meaning |
|---|---|
| 0 | Not a usability problem |
| 1 | Cosmetic |
| 2 | Minor |
| 3 | Major — fix soon |
| 4 | Catastrophe — blocks the task |

For every issue include: the heuristic broken and where it happens, what happens (the evidence), the
severity and why it matters (user impact), a specific actionable recommendation, and effort (quick win /
project).

Example — *NAVIGATION · Checkout step 3 · no way back to edit the cart without losing entered details ·
Severity 3 · users abandon rather than re-enter · Fix: add a non-destructive "Edit cart" link that preserves
form state · quick win.*

### Step 4: Review pass — GATE

Before finalising, check your own work and flag:
- Any issue without evidence
- Any visual/UI observation scored as a UX issue — move it to Out of scope (UI)
- Any vague recommendation
- Any severity without a user-impact justification

Rewrite anything flagged.

### Step 5: Report

```markdown
# Heuristic Audit — [target]

## Executive Summary
[Top usability problems, ranked by severity and business impact]

## Findings Matrix
| Heuristic | Where | Evidence | Severity (0-4) | Fix | Effort |
|---|---|---|---|---|---|

## Quick Wins
[Low-effort, high-impact fixes to ship now]

## Prioritised UX Backlog
[Issues ordered by user impact × effort]

## Out-of-Scope (UI) Notes
[Visual observations kept separate, unscored]

## Validation Checklist
[Findings needing evidence or a user to confirm]
```

**Completion criterion:** every finding cites its heuristic and evidence, no visual-only observation is
scored as a UX issue, and the review pass in Step 4 has been run.

### Human review required

- Verify every issue against the real product — an issue without evidence is an opinion.
- Confirm severity reflects real user impact, not reviewer preference.
- Keep UI/visual observations out of the UX scores — check nothing crept in.
- Validate the worst issues with real users where possible — expert review isn't user testing.
- Remove anything marked Not Verified.

**Treat the output as a first draft, not final research.**

---
