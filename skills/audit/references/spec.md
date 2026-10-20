# Audit: spec mode

Part of the [`audit`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Compares a built prototype or shipped product against its **approved design spec**, screen by screen, at
every breakpoint — logging every drift as **expected (design) vs actual (build)**, with severity and an
owner. Checks design **quality and fidelity**: is the built product complete, consistent, and does it match
the approved design intent? **This mode does not review code** — engineering quality, functional bugs,
performance and security stay out of scope and get routed to `code` mode or engineering, not scored here.

**This suite is code-based, not Figma-based:** "the design" for this mode is the approved
[`map`](../../map/SKILL.md) `flow`-mode output, `scaffold`'s own output, and `styleguide`'s tokens/`DESIGN.md`
— together, in place of a Figma file. Don't invent a Figma-shaped checklist for a project that has none.

**Not this mode:**
- Reviewing source code, architecture, or functional correctness → `code` mode, or route it to engineering,
  unscored, under "Route to Engineering."
- Auditing UX quality independent of a specific spec → `craft` or `heuristic` mode.
- Building the design spec this compares against → `map`'s `flow` mode, `styleguide`, or `scaffold`. This
  mode reads their output; it doesn't produce it.

## Contents

  - The evidence rule
  - What you'll need
  - The workflow
  - Final outputs
  - Human review required

### The evidence rule

**Don't invent specs.** If the approved design/flow doesn't define a state or a breakpoint, that's a
**design gap** — flag it, don't guess what it should have been. Every discrepancy is **expected (design) vs
actual (build)**, backed by a screenshot or a measurement — an opinion is not a defect.

### What you'll need

**Required**
- The live build or running prototype to check
- The design to compare against: the approved `map` `flow`-mode output, `scaffold`'s output, and
  `styleguide`'s tokens/`DESIGN.md`
- The key flows and target breakpoints/viewports

**Optional:** acceptance criteria / definition of done for visual fidelity · redlines, specs, or annotations
· previous QA passes or known issues · brand and content guidelines.

If any required input is missing, ask **up to five** clarifying questions before starting. State which flows
and breakpoints you're checking, and don't start until they're clear.

### The workflow

```
Confirm scope → Walk each screen at each breakpoint → Log discrepancies → Rate & route to owner → Verify fixes
```

**Step 1 — Confirm scope.** Name the flows and breakpoints in scope. If the design doesn't define one of
them, that's a design gap — name it now, don't discover it mid-walkthrough.

**Step 2 — Walk each screen/component at each breakpoint.** Check: spacing, sizing, type, colour, alignment,
radius, elevation, states (hover/focus/active/disabled/empty/error/loading), responsiveness behaviour,
interaction/motion, content, and whether the rendered UI uses the right design-system tokens and components.

**Step 3 — Log every discrepancy.** For each issue, record:

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

**Step 4 — Review pass — GATE.** Flag: any issue that's really a code or functional bug (route to `code`
mode or engineering, don't score it) · any "expected" with no actual design source behind it · any vague
discrepancy (no expected-vs-actual, or no evidence) · any target breakpoint that wasn't actually checked.
Rewrite or resolve anything flagged before finalising.

**Step 5 — Summarise.** By severity. Separate design gaps (the spec itself is incomplete) from build
discrepancies (the build drifted from a complete spec) — they have different owners and different fixes.

**Completion criterion:** every logged issue carries expected-vs-actual evidence, a severity, and an owner;
every target breakpoint was checked; anything that was really a code bug is in the Route-to-Engineering list,
unscored.

### Final outputs

1. **Design QA Checklist** — the checks actually run, and against which flows/breakpoints.
2. **Discrepancy Log** — every issue: area, where, expected vs actual, evidence, severity, owner.
3. **Design Gaps** — where the spec itself doesn't define something the build needed.
4. **Build Discrepancies** — where the build drifts from a complete spec, ready to file as tickets.
5. **Prioritised Fix List** — by severity and impact on the design intent.
6. **Route-to-Engineering Notes** — functional/code issues found in passing, explicitly out of scope here.

### Human review required

- This is `spec` fidelity, not `code` correctness — keep functional/engineering issues in the
  Route-to-Engineering list, don't score them here.
- Every build discrepancy needs expected-vs-actual evidence (screenshot or measurement) — an opinion isn't a
  defect.
- Check every target breakpoint, not just desktop.
- Fix design gaps in the spec before re-checking the build discrepancies that depended on them.
- A designer signs off on fidelity; engineering signs off on function — this mode's output supports the
  former, not the latter.

**Treat the output as a first draft, not final research.**

---
