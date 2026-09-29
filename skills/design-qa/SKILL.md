---
name: design-qa
description: >-
  Compare a built prototype or shipped product against its approved design spec, screen by screen, at every
  breakpoint — logging every drift as expected (design) vs actual (build), with severity and an owner. You
  check design fidelity, not code. Use before developer handoff, release/sprint sign-off, reducing design
  debt, or after any change that could have drifted the build from the design. Trigger on "design QA", "does
  the build match the design", "check the shipped product against the spec", or "audit visual fidelity".
  This release compares build against a code-based design spec (scaffold output + styleguide tokens/DESIGN.md
  + an approved user-flow); Figma-side design self-QA is deferred with the rest of Figma scope.
---

# Design QA — build vs spec

Checks design **quality and fidelity**: is the built product complete, consistent, and does it match the
approved design intent? **This skill does not review code** — engineering quality, functional bugs,
performance and security stay out of scope and get routed to engineering, not scored here.

**This release is single-lane: build vs. spec.** The pilot this skill is drawn from also has a Figma
self-QA lane (checking a design file's own completeness before anything is built). That lane is deferred with
the rest of Figma scope — don't offer it, and don't invent a Figma-shaped checklist for a project that has no
Figma file.

**Not this skill:**
- Reviewing source code, architecture, or functional correctness → route anything you spot here to
  engineering, unscored, under "Route to Engineering."
- Auditing UX quality (flows, IA, heuristics) independent of a specific design spec → Atlas `audit`'s `craft`
  or `heuristic` mode.
- Building the design spec this compares against → [`user-flow`](../user-flow/SKILL.md), `styleguide`, or
  `scaffold`. This skill reads their output; it doesn't produce it.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if
  asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep
  substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no
  unrequested scaffolding.

## The evidence rule

**Don't invent specs.** If the approved design/flow doesn't define a state or a breakpoint, that's a
**design gap** — flag it, don't guess what it should have been. Every discrepancy is **expected (design) vs
actual (build)**, backed by a screenshot or a measurement — an opinion is not a defect.

## What you'll need

**Required**
- The live build or running prototype to QA
- The design to compare against: the approved [`user-flow`](../user-flow/SKILL.md) output, `scaffold`'s
  output, and `styleguide`'s tokens/`DESIGN.md` — together these are "the design" for this release, in place
  of a Figma file
- The key flows and target breakpoints/viewports

**Optional**
- Acceptance criteria / definition of done for visual fidelity
- Redlines, specs, or annotations
- Previous QA passes or known issues
- Brand and content guidelines

If any required input is missing, ask **up to five** clarifying questions before starting. State which flows
and breakpoints you're checking, and don't start until they're clear.

## The workflow

```
Confirm scope → Walk each screen at each breakpoint → Log discrepancies → Rate & route to owner → Verify fixes
```

### Step 1 — Confirm scope
Name the flows and breakpoints in scope. If the design doesn't define one of them, that's a design gap —
name it now, don't discover it mid-walkthrough.

### Step 2 — Walk each screen/component at each breakpoint
For every screen and every target breakpoint, check: spacing, sizing, type, colour, alignment, radius,
elevation, states (hover/focus/active/disabled/empty/error/loading), responsiveness behaviour, interaction/
motion, content, and whether the rendered UI uses the right design-system tokens and components.

### Step 3 — Log every discrepancy
For each issue, record:

| Field | Content |
|---|---|
| **Area** | layout / type / colour / component / state / responsive / motion / content |
| **Where** | screen / element + breakpoint |
| **Expected vs actual** | the design's spec vs what the build actually shows |
| **Severity** | blocker (breaks design intent) / major (clearly off-spec) / minor (small drift) / nit (polish) |
| **Design-system reference** | the token or component it should use, where relevant |
| **Owner** | a design gap → fix in the spec; a build discrepancy → developer |

Example — *SPACING · Card, mobile · expected 16px padding (`space-200`) vs actual 12px in the build ·
Severity: minor · DS: `space-200` · Owner: developer.*

### Step 4 — Review pass — GATE
Flag:
- Any issue that's really a code or functional bug — route to engineering, don't score it.
- Any "expected" with no actual design source behind it.
- Any vague discrepancy (no expected-vs-actual, or no evidence).
- Any target breakpoint that wasn't actually checked.

Rewrite or resolve anything flagged before finalising.

### Step 5 — Summarise and produce outputs
Summarise by severity. Separate design gaps (the spec itself is incomplete) from build discrepancies (the
build drifted from a complete spec) — they have different owners and different fixes.

**Completion criterion:** every logged issue carries expected-vs-actual evidence, a severity, and an owner;
every target breakpoint was checked; anything that was really a code bug is in the Route-to-Engineering list,
unscored.

## Final outputs

1. **Design QA Checklist** — the checks actually run, and against which flows/breakpoints.
2. **Discrepancy Log** — every issue: area, where, expected vs actual, evidence, severity, owner.
3. **Design Gaps** — where the spec itself doesn't define something the build needed.
4. **Build Discrepancies** — where the build drifts from a complete spec, ready to file as tickets.
5. **Prioritised Fix List** — by severity and impact on the design intent.
6. **Route-to-Engineering Notes** — functional/code issues found in passing, explicitly out of scope here.

## Human review required

Before sign-off:
- This is design QA, not code QA — keep functional/engineering issues in the Route-to-Engineering list,
  don't score them here.
- Every build discrepancy needs expected-vs-actual evidence (screenshot or measurement) — an opinion isn't a
  defect.
- Check every target breakpoint, not just desktop.
- Fix design gaps in the spec before re-checking the build discrepancies that depended on them.
- A designer signs off on fidelity; engineering signs off on function — this skill's output supports the
  former, not the latter.

**Treat the output as a first draft, not final research.**
