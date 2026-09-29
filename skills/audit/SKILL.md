---
name: audit
description: >-
  Run one of five prototype audits. craft (scored UX critique across hierarchy, IA, consistency, responsive
  behavior, and delight — a 5-dimension health score). heuristic (a deep, evidence-based Nielsen-heuristic
  pass, heuristic by heuristic, severity-rated 0-4, scoped to UX only — not the same rubric as craft, and not
  interchangeable with it). code (coding-standards check for token adherence, structure/reuse, and mechanical
  hygiene). spec (compares a built prototype against its approved design spec, screen by screen, at every
  breakpoint — logs every drift as expected-vs-actual with severity and an owner; checks fidelity, not code).
  a11y (deep WCAG 2.1/2.2 AA pass, criterion by criterion). Each mode only identifies problems, none of them
  fix anything. Use when reviewing a prototype for UX quality, coding practice, design fidelity against a
  spec, or accessibility compliance.
---

# Audit

Five audit modes share one skill because they share the same shape of work — find problems, score or rank them, hand off to whoever fixes them — but they check genuinely different things, on different rubrics. **Ask which mode if not specified**; don't guess from a vague "review this" or "audit the app":

- **`craft`**: subjective UX critique on a 5-dimension, 0-20 health score: visual hierarchy, cognitive load, information architecture, consistency/anti-patterns, responsive behavior, delight. Feeds [`refine`](../refine/SKILL.md). Lighter-weight than `heuristic`; use it for an in-progress check.
- **`heuristic`**: a deep, evidence-based pass against 12 named usability heuristics, each issue severity-rated 0-4 and tied to a specific heuristic and screen/step. Heavier than `craft` — use it when the audit needs to stand on its own as evidence (a redesign case, a UX backlog, accessibility remediation prioritisation), not as a quick in-progress read.
- **`code`**: coding-practice audit: design token adherence, structure/style/logic separation, component reuse, semantic HTML5, mechanical focus-state hygiene. Fast and grep-able, not deliberative.
- **`spec`**: compares a built prototype against its **approved design spec** — screen by screen, at every breakpoint — logging every drift as expected-vs-actual, with severity and an owner. Checks visual fidelity and completeness against a specific spec, not coding standards (`code`) and not subjective UX quality independent of a spec (`craft`/`heuristic`). A code bug spotted here routes to `code` mode, unscored — `spec` never reviews source.
- **`a11y`**: deep WCAG 2.1/2.2 AA pass, reasoning criterion-by-criterion, not the cheap mechanical checks `code` mode already covers.

All five only identify; none edit code. More than one mode can run back-to-back on the same target when the user wants full coverage; run them independently rather than blending their findings into one report. **`craft` and `heuristic` are not the same audit and don't produce comparable scores** — a 14/20 `craft` score and a `heuristic` pass with three Severity-3 findings are two different instruments; don't average or merge them into one number. **`spec` and `code` are also not interchangeable** — `spec` checks whether the build matches what was *designed*; `code` checks whether the code meets this suite's own coding standards, regardless of what was designed.

### Optional: independent second pass for high-stakes audits
A single pass reliably misses things, since the reviewer anchors on whatever it noticed first. For an audit gating a real handoff or ship decision, run a second pass with fresh eyes (a separate `Explore` or `general-purpose` agent given only the target and the mode's checklist, no visibility into the first pass's findings) and reconcile both lists before reporting. Skip this for a routine in-progress check — it roughly doubles the cost and isn't worth it until the finding actually matters.

---

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Mode: craft

Never edits code. It's the "find what's wrong" half of a loop with [`refine`](../refine/SKILL.md), which fixes and unifies visual craft. Run this on a prototype you didn't necessarily build yourself — a teammate's work, or your own after time away — to get an honest read before touching anything.

### Step 1: Score five dimensions (0-4 each)

Inspect the running prototype (or source, if it can't run) against each dimension below. Be honest: a 4 means genuinely excellent, not "good enough." Most real prototypes score 8-14 out of 20.

**1. Visual Hierarchy & Cognitive Load.** Is it obvious what matters most on each screen? Walk the [cognitive load checklist](references/cognitive-load.md) (8 items): 0-1 failures = 4, 2-3 = 2, 4+ = 0.

**2. Information Architecture & Navigation.** Can a user build a mental map of where things are without help? Breadcrumbs/active-states present where needed, logical grouping, no orphaned or unreachable views, sensible route naming.

**3. Consistency & Anti-Patterns.** Same type of action behaves the same way everywhere. Check for structural drift: components that duplicate what another component already does, copy-pasted views that should be one parameterized component, or a screen that feels interchangeable with an unrelated product (no product-specific character).

**4. Responsive Behavior.** Does layout hold up at mobile/tablet widths? No horizontal scroll on the page itself, touch targets ≥44×44px, text doesn't overflow its container when it grows.

**5. Delight & Craft Heuristics.** Cross-check against [`refine`](../refine/SKILL.md)'s 6 craft heuristics (density/scannability, elevation, micro-interactions, typography, empty/loading states, dark mode fidelity). This dimension scores how close the prototype already is to that skill's bar, not whether it exists as UI at all.

Optionally run `heuristic` mode below for a deeper, more granular critique than the 5 dimensions above. Useful when the audit needs to justify a bigger investment of follow-up work.

### Step 2: Walk it through 2-3 personas

Pick 2-3 relevant personas from [references/personas.md](references/personas.md) (Alex the power user, Jordan the first-timer, Riley the stress-tester, Casey the mobile user) and walk the primary task through each one's eyes. Report specific red flags tied to exact elements — "icon-only nav in the sidebar confuses Jordan," not "navigation could be clearer."

### Step 3: Report and file as tasks

```markdown
# Craft Audit — [target]

## Health Score
| # | Dimension | Score | Key Finding |
|---|---|---|---|
| 1 | Visual Hierarchy & Cognitive Load | ?/4 | |
| 2 | Information Architecture | ?/4 | |
| 3 | Consistency & Anti-Patterns | ?/4 | |
| 4 | Responsive Behavior | ?/4 | |
| 5 | Delight & Craft | ?/4 | |
| **Total** | | **??/20** | **[18-20 Excellent · 14-17 Good · 10-13 Acceptable · 6-9 Poor · 0-5 Critical]** |

## What's Working
[2-3 specific things done well — don't skip this, it tells `refine` what to preserve]

## Findings (task list, most impactful first)
Each finding is a ticket, not prose:
- **[P0/P1/P2/P3] [Short title]** — Location: `Component.tsx`. Impact: [why it hurts the user]. Fix: [concrete, actionable]. Route to: `refine` (visual) or `audit` in `code` mode (structural/reuse).

## Persona Red Flags
[Specific breakage per persona from Step 2]

## Patterns & Systemic Issues
[Recurring problems, e.g. "hardcoded spacing appears in 6+ views, should use the layout rhythm from DESIGN.md"]
```

Severity: **P0** blocks task completion, fix immediately. **P1** major difficulty, fix before next review. **P2** annoyance with a workaround, next pass. **P3** polish, time-permitting.

**Completion criterion:** every P0/P1 finding names a concrete file/component and a concrete fix. No finding that just restates the dimension name without specifics.

---

## Mode: heuristic

Run a structured, evidence-based UX audit of an existing product — heuristic by heuristic — to surface
usability problems, rank them by severity, and turn each into a specific fix. **Scope is the experience**:
flows, navigation, information architecture, interaction, content and accessibility signals — **not visual
design.** A colour, typography, or spacing observation belongs in `craft` mode or `spec` mode, not here.

**Not this mode:** a quick in-progress read (`craft` is lighter and faster for that) or a visual-fidelity
check against a spec (`spec`).

### Step 1: Gather inputs

Required: the product or key flows to audit (links or a walkthrough, using real screen names), what the
product is for plus the primary user goals/tasks, a target persona (or the `persona` `card`-mode output),
and the heuristics/scope to evaluate against (or use the default 12 below).

Optional: analytics, heatmaps or session recordings as evidence; prior research or support tickets; an
accessibility target (e.g. WCAG 2.2 AA); known problem areas or hypotheses;
[`competitor-analysis`](../competitor-analysis/SKILL.md) or [`ux-benchmark`](../ux-benchmark/SKILL.md) output.

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

## Mode: code

Audits **coding practice**: token adherence, structure/style/logic separation, component reuse, and cheap mechanical hygiene checks. Not for deep accessibility reasoning (`a11y` mode), subjective visual/UX critique (`craft`/`heuristic` modes), or fidelity against a design spec (`spec` mode) — this mode stays fast and grep-able rather than deliberative, and it never compares the build against a design; it checks the code against this suite's own standards regardless of what was designed.

### 6 Audit Checkpoints

**1. Design Token Compliance (Strict)**
- **Zero Hardcoded Hex Codes in JSX**: Flag any `text-[#...]`, `bg-[#...]`, or `style={{ color: '...' }}`.
- **Zero Raw Tailwind Palette Colors**: Flag any `text-slate-500`, `bg-emerald-600`, or `border-zinc-300`. All styling must use semantic tokens (`text-primary`, `bg-surface`, `bg-status-success/15`). This includes status/badge colors, which must never fall back to raw palette classes even for a "quick" state.
- **Zero Redundant `dark:` Overrides**: Flag `text-primary dark:text-white` on a token that already auto-flips. A `dark:` override is only legitimate when it pairs two genuinely distinct semantic tokens for a deliberate light/dark divergence, not as a patch on a single token.
- **Consistent Layout Rhythm**: Page containers should align to one shared max-width/padding convention defined once (e.g. in the app shell), not repeated ad hoc per view. Dense data tables should use consistent cell padding across the app.

**2. Semantic HTML5 & Heading Hierarchy**
- Ensure each view has a single top-level `<h1>` tag followed by logical `<h2>`, `<h3>` hierarchy.
- Ensure clickable actions use semantic `<button>` elements (not clickable `<div>`s without ARIA).
- Form inputs must have associated `<label>` tags or `aria-label` attributes.

**3. Keyboard Focus Hygiene** (mechanical only; see `a11y` mode for the real WCAG pass)
- Verify all interactive controls include `:focus-visible` ring styling (`focus:ring-2 focus:ring-focus-ring`).
- Modals must trap keyboard focus and dismiss on `Escape`.

**4. Component & Type Hygiene**
- UI atoms/molecules should extend the native HTML element's attribute interface (`React.ComponentPropsWithoutRef<'button'>`) rather than hand-declaring a parallel prop list. Hand-rolled prop lists drift from native behavior and lose things like `aria-*` passthrough for free.
- Run a type-check (`npx tsc -b --noEmit` or equivalent) as part of verification. This catches drift a visual pass alone won't.

**5. Structure, Style & Logic Separation**
- Flag components that mix data-fetching/state logic, layout markup, and styling decisions inline with no separation. Logic should live in a hook or a clearly-named function, not interleaved line-by-line with JSX.
- Flag duplicated JSX blocks (near-identical markup repeated 3+ times) that should be one parameterized component instead. This is a coding-standards issue distinct from `craft` mode's "does it look consistent" check; here the question is whether the *code* is reused, not whether the *output* looks the same.
- Business/domain logic (state transitions, derived values) belongs in `shared/` or a hook, not duplicated inline in multiple view components.

**6. Prototype Cleanliness & Hygiene**
- Verify no large binary lock files (`~$*.docx`), temporary scratch files, generated `production/` output, data exports, or uncommitted zip archives clutter the repo root.
- Confirm state mutations are centralized in mock store hooks or shared workflow files.
- Before a delivery handoff, confirm the static build being shipped was regenerated from current source. Don't assume a previously-built `dist`/`production` folder is still current.

### Review Output Format

```markdown
# UX Prototype Review Report

## Summary
- Files Reviewed: [Count]
- Token Adherence: [Pass / Fail]
- Accessibility Score: [Good / Needs Remediation]

## Findings & Remediation Steps
- [File Basename:Line]: [Specific Issue & Suggested Token Class Replacement]
```

---

## Mode: spec

Compares a built prototype or shipped product against its **approved design spec**, screen by screen, at
every breakpoint — logging every drift as **expected (design) vs actual (build)**, with severity and an
owner. Checks design **quality and fidelity**: is the built product complete, consistent, and does it match
the approved design intent? **This mode does not review code** — engineering quality, functional bugs,
performance and security stay out of scope and get routed to `code` mode or engineering, not scored here.

**This suite is code-based, not Figma-based:** "the design" for this mode is the approved
[`map`](../map/SKILL.md) `flow`-mode output, `prototype`'s own output, and `styleguide`'s tokens/`DESIGN.md`
— together, in place of a Figma file. Don't invent a Figma-shaped checklist for a project that has none.

**Not this mode:**
- Reviewing source code, architecture, or functional correctness → `code` mode, or route it to engineering,
  unscored, under "Route to Engineering."
- Auditing UX quality independent of a specific spec → `craft` or `heuristic` mode.
- Building the design spec this compares against → `map`'s `flow` mode, `styleguide`, or `prototype`. This
  mode reads their output; it doesn't produce it.

### The evidence rule

**Don't invent specs.** If the approved design/flow doesn't define a state or a breakpoint, that's a
**design gap** — flag it, don't guess what it should have been. Every discrepancy is **expected (design) vs
actual (build)**, backed by a screenshot or a measurement — an opinion is not a defect.

### What you'll need

**Required**
- The live build or running prototype to check
- The design to compare against: the approved `map` `flow`-mode output, `prototype`'s output, and
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

## Mode: a11y

A full WCAG 2.1 (and 2.2 where relevant) **Level AA** pass, organized by the four POUR principles. This is the deep audit; `code` mode keeps only cheap mechanical checks (focus-ring class present, Escape closes modals) as a fast hygiene pass, while this mode reasons about success criteria and produces a ranked, criterion-by-criterion report. Like `craft`/`heuristic`/`spec` modes, it only identifies issues; it doesn't fix them.

### Step 1: Perceivable

- **1.1.1 Non-text Content**: every `<img>` has meaningful `alt` (or `alt=""` if truly decorative); icon-only buttons have `aria-label`.
- **1.3.1 Info and Relationships**: heading hierarchy is a single `<h1>` per view with logical `<h2>`/`<h3>` nesting (no skipped levels); tables use `<th>`/`scope`; form inputs are programmatically associated with a `<label>`.
- **1.4.1 Use of Color**: color is never the *only* signal for status (pair a status badge's color with an icon or text, not color alone).
- **1.4.3 Contrast (Minimum)**: normal text ≥4.5:1, large text (≥18pt or ≥14pt bold) ≥3:1. Check every semantic token pair actually used (`text-primary` on `bg-surface`, `text-secondary` on `bg-page`, status text colors on their badge backgrounds) in both light and dark mode. A token pair that passes in light mode can fail in dark.
- **1.4.11 Non-text Contrast**: UI component boundaries (input borders, focus rings) and graphical objects ≥3:1 against adjacent color.

### Step 2: Operable

- **2.1.1 Keyboard**: every interactive element reachable and operable via keyboard alone; no click-only handlers on non-native elements without a matching `onKeyDown`.
- **2.1.2 No Keyboard Trap**: modals/dialogs release focus on `Escape` or close; nothing traps Tab focus permanently.
- **2.4.3 Focus Order**: tab order matches visual/reading order; no `tabIndex` values that jump illogically.
- **2.4.7 Focus Visible**: every focusable element shows a visible `:focus-visible` indicator; never `outline: none` without a replacement.
- **2.5.5 Target Size (AA in 2.2)**: touch targets ≥24×24px minimum (44×44px is the safer practical bar, matching mobile guidance elsewhere in this suite).

### Step 3: Understandable

- **3.2.1 On Focus / 3.2.2 On Input**: focusing or changing a field never triggers an unexpected context change (navigation, form submission) without warning.
- **3.3.1 Error Identification**: validation errors are identified in text, not color alone, and programmatically associated with their field (`aria-describedby`).
- **3.3.2 Labels or Instructions**: every input has a visible label or clear instructions; placeholder text alone is not a label.

### Step 4: Robust

- **4.1.2 Name, Role, Value**: custom interactive components (not native `<button>`/`<input>`) expose the correct ARIA role, name, and state (`aria-expanded`, `aria-selected`, `aria-checked`) and keep it in sync with visual state.
- **4.1.3 Status Messages**: dynamic status updates (toast, inline validation, loading-to-loaded transitions) use `aria-live` so a screen reader announces them without requiring focus to move.

### Step 5: Report

```markdown
# a11y Audit — [target]

## AA Compliance Summary
| Principle | Criteria Checked | Pass | Fail |
|---|---|---|---|
| Perceivable | 5 | ? | ? |
| Operable | 5 | ? | ? |
| Understandable | 3 | ? | ? |
| Robust | 2 | ? | ? |
| **Overall** | **15** | **?** | **?** |

**Rating**: [Meets AA / Meets AA with minor gaps / Does not meet AA — significant work needed / Fails at A level]

## Failing Criteria
For each failure:
- **[WCAG #] Criterion name** — Location: `Component.tsx`. What fails: [specific]. Fix: [concrete].

## Passing Highlights
[What's genuinely solid — don't skip, it tells reviewers what not to re-check]
```

**Completion criterion:** every failure cites the specific WCAG success criterion number, not just a vague "accessibility issue," and names the exact component/file where it occurs.
