# The Rubric — 10 dimensions with 1–5 anchors

The default rubric is the ten dimensions below. Use them as-is, or add / drop / reweight for the
product — but **whatever set you agree, apply it identically to every product.** The anchors exist
so that a "5" means the same thing for Product A and Product E. Score against the anchor, not
against your impression.

**How to score:** pick the anchor the product's *observed* behaviour actually matches. If you only
have evidence for part of a dimension, score what you saw and mark the rest `NOT VERIFIED` — do not
average a guess into the number. One-line rationale + the evidence behind it, every time.

**Weighting (optional):** by default all ten weigh equally. If the persona makes some dimensions
matter more (a nervous first-timer weights Onboarding and Trust heavily; a returning power user
weights Task efficiency and Findability), agree weights in Phase 2 and show both the raw and the
weighted average on the scorecard.

---

## Contents

- 1. Features / capability coverage
- 2. Task flows & efficiency (steps, friction, dead-ends)
- 3. Information architecture (structure, grouping, labels)
- 4. Navigation & findability (nav patterns, wayfinding)
- 5. Layout & visual hierarchy
- 6. UX / interaction patterns (forms, feedback, empty & error states)
- 7. Onboarding & first-run
- 8. Content & microcopy clarity
- 9. Accessibility (WCAG signals)
- 10. Trust & credibility (pricing, security, social proof)
- Enterprise / captive-audience note

## 1. Features / capability coverage
*Does the product actually do what the task needs?*

- **1** — Core capability for the task is missing or broken.
- **2** — Partial coverage; obvious gaps force workarounds or abandonment.
- **3** — Covers the task, but misses capabilities competitors treat as standard.
- **4** — Full coverage of the task plus one or two genuinely useful extras.
- **5** — Complete coverage and a capability that meaningfully exceeds the market.

## 2. Task flows & efficiency (steps, friction, dead-ends)
*How directly can the user get the task done?*

- **1** — Task cannot be completed, or ends in a dead-end / error loop.
- **2** — Completable but with heavy friction: many redundant steps, backtracking, confusion.
- **3** — Works, with noticeable friction or a few unnecessary steps.
- **4** — Efficient: few steps, no dead-ends, friction only at genuinely necessary decisions.
- **5** — Minimal steps, no wasted moves, friction actively designed out (smart defaults, skip-ahead).

*Anchor in metrics where you have them:* task success rate (industry average ≈78%; >90% is
well-optimised; <70% signals a real bottleneck), time-on-task, and step count. See `metrics.md`.

## 3. Information architecture (structure, grouping, labels)
*Is content organised the way the user expects?*

- **1** — Structure is arbitrary; labels mislead; user cannot predict where things live.
- **2** — Some logic, but grouping and labels frequently surprise the user.
- **3** — Reasonable structure; a few labels or groupings are ambiguous.
- **4** — Clear, predictable structure; labels match the user's mental model.
- **5** — Structure so intuitive the user never has to think about where something is.

## 4. Navigation & findability (nav patterns, wayfinding)
*Can the user get anywhere and always know where they are?*

- **1** — Easy to get lost; no clear way back; key destinations effectively hidden.
- **2** — Navigation exists but wayfinding is weak; search missing or poor.
- **3** — Standard nav; findability is fine for common paths, weak for the rest.
- **4** — Persistent, clear nav; search present and useful; current location always obvious.
- **5** — Every destination reachable in a tap or two; search excellent; wayfinding effortless.

## 5. Layout & visual hierarchy
*Does the eye land on the right thing first?*

- **1** — Cluttered or flat; nothing is prioritised; primary action hard to spot.
- **2** — Some hierarchy, but competing elements dilute the primary action.
- **3** — Adequate hierarchy; the main action is findable with a little scanning.
- **4** — Clear hierarchy; primary action is obvious; secondary content recedes appropriately.
- **5** — Hierarchy guides the user through the task without conscious effort; nothing competes.

## 6. UX / interaction patterns (forms, feedback, empty & error states)
*How well does the product behave at the edges?*

- **1** — No feedback; errors are dead-ends; empty states are blank walls.
- **2** — Minimal feedback; error messages unhelpful; empty states missing guidance.
- **3** — Basic feedback and error handling; empty states present but generic.
- **4** — Responsive feedback; errors explain the fix; empty states guide the next action.
- **5** — Every state considered — loading, empty, error, success — each moves the user forward.

## 7. Onboarding & first-run
*Can a brand-new user reach first value quickly?*

- **1** — No onboarding; the user is dropped in with no orientation.
- **2** — Onboarding exists but is long, skippable-only, or fails to reach first value.
- **3** — Functional onboarding; gets the user started but doesn't reduce time-to-value much.
- **4** — Guided first-run that reaches a first success quickly and can be resumed.
- **5** — First-run gets the user to real value fast, teaches by doing, respects returning users.

*For a captive-audience / enterprise tool, weight learnability heavily — see CASTLE in `metrics.md`.*

## 8. Content & microcopy clarity
*Does the writing help or hinder?*

- **1** — Jargon, ambiguity, or dark-pattern wording; copy actively confuses.
- **2** — Understandable but wordy, generic, or inconsistent in voice.
- **3** — Clear enough; occasional ambiguity or unhelpful labels.
- **4** — Clear, concise, consistent; microcopy answers the question at the point of doubt.
- **5** — Copy is invisible in the best way — it removes hesitation before it forms.

## 9. Accessibility (WCAG signals)
*Can everyone use it?* Judge only what you can observe; deep audits need real testing —
mark those `NOT VERIFIED`. Run `audit`'s `a11y` mode on your own product to go deeper.

- **1** — Visible failures: poor contrast, no focus states, images without alt, keyboard traps.
- **2** — Some consideration but multiple visible WCAG issues.
- **3** — Meets basic contrast and focus expectations; gaps likely below the surface.
- **4** — Strong visible signals: contrast, focus order, labels, targets; a stated a11y commitment.
- **5** — Demonstrable accessibility: published statement, visible AA/AAA signals, tested patterns.

## 10. Trust & credibility (pricing, security, social proof)
*Does the user believe this product?*

- **1** — Hidden pricing, no security signals, no social proof; feels risky.
- **2** — Weak or inconsistent trust signals; key reassurance missing at the decision point.
- **3** — Standard trust signals present but unremarkable.
- **4** — Clear pricing, visible security, credible social proof placed where doubt occurs.
- **5** — Trust is designed into the flow — transparency, guarantees and proof exactly when needed.

---

## Enterprise / captive-audience note

When users **have no choice** but to use the product (internal tools, admin consoles, back-office
systems), several consumer-oriented instincts mislead. Adoption and retention aren't voluntary, so
they don't signal quality. Add the **CASTLE** lens from `metrics.md` — Cognitive load, Advanced-feature
usage, Satisfaction, Task efficiency, Learnability, Errors — and weight Learnability, Cognitive load
and Task efficiency above the rest.
