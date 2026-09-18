---
name: audit
description: >-
  Run one of three prototype audits, craft (scored UX critique across hierarchy, IA, consistency, responsive behavior, and delight), code (coding-standards check for token adherence, structure/reuse, and mechanical hygiene), or a11y (deep WCAG 2.1/2.2 AA pass, criterion by criterion). Each mode only identifies problems, none of them fix anything. Use when reviewing a prototype for UX quality, coding practice, or accessibility compliance.
---

# Audit

Three audit modes share one skill because they share the same shape of work — find problems, score or rank them, hand off to whoever fixes them — but they check genuinely different things. **Ask which mode if not specified**; don't guess from a vague "review this" or "audit the app":

- **`craft`**: subjective UX critique: visual hierarchy, cognitive load, information architecture, consistency/anti-patterns, responsive behavior, delight. Feeds [`refine`](../refine/SKILL.md).
- **`code`**: coding-practice audit: design token adherence, structure/style/logic separation, component reuse, semantic HTML5, mechanical focus-state hygiene. Fast and grep-able, not deliberative.
- **`a11y`**: deep WCAG 2.1/2.2 AA pass, reasoning criterion-by-criterion, not the cheap mechanical checks `code` mode already covers.

All three only identify; none edit code. More than one mode can run back-to-back on the same target when the user wants full coverage; run them independently rather than blending their findings into one report.

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

Optionally run the [full Nielsen's 10 Heuristics pass](references/nielsen-heuristics.md) for a deeper, more granular critique than the 5 dimensions above. Useful when the audit needs to justify a bigger investment of follow-up work.

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

## Mode: code

Audits **coding practice**: token adherence, structure/style/logic separation, component reuse, and cheap mechanical hygiene checks. Not for deep accessibility reasoning (`a11y` mode) or subjective visual/UX critique (`craft` mode) — this mode stays fast and grep-able rather than deliberative.

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

## Mode: a11y

A full WCAG 2.1 (and 2.2 where relevant) **Level AA** pass, organized by the four POUR principles. This is the deep audit; `code` mode keeps only cheap mechanical checks (focus-ring class present, Escape closes modals) as a fast hygiene pass, while this mode reasons about success criteria and produces a ranked, criterion-by-criterion report. Like `craft` mode, it only identifies issues; it doesn't fix them.

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
