---
name: audit
description: >-
  Audits a built prototype and reports problems without fixing them. Modes: craft (scored UX
  critique), heuristic (Nielsen heuristics, severity 0-4), code (token and structure standards),
  spec (build against the approved design), a11y (WCAG 2.2 AA), perf (load, render and motion cost).
  Use when asked to review, critique or check a prototype.
argument-hint: "[craft: UX critique | heuristic: Nielsen pass | code: standards check | spec: build vs design spec | a11y: WCAG sweep | perf: load and motion cost]"
---

# Audit

Six audit modes share one skill because they share the same shape of work — find problems, score or rank them, hand off to whoever fixes them — but they check genuinely different things, on different rubrics. **Ask which mode if not specified**; don't guess from a vague "review this" or "audit the app":

- **`craft`**: subjective UX critique on a 5-dimension, 0-20 health score: visual hierarchy, cognitive load, information architecture, consistency/anti-patterns, responsive behavior, delight. Feeds [`refine`](../refine/SKILL.md). Lighter-weight than `heuristic`; use it for an in-progress check.
- **`heuristic`**: a deep, evidence-based pass against 12 named usability heuristics, each issue severity-rated 0-4 and tied to a specific heuristic and screen/step. Heavier than `craft` — use it when the audit needs to stand on its own as evidence (a redesign case, a UX backlog, accessibility remediation prioritisation), not as a quick in-progress read.
- **`code`**: coding-practice audit: design token adherence, structure/style/logic separation, component reuse, semantic HTML5, mechanical focus-state hygiene. Fast and grep-able, not deliberative.
- **`spec`**: compares a built prototype against its **approved design spec** — screen by screen, at every breakpoint — logging every drift as expected-vs-actual, with severity and an owner. Checks visual fidelity and completeness against a specific spec, not coding standards (`code`) and not subjective UX quality independent of a spec (`craft`/`heuristic`). A code bug spotted here routes to `code` mode, unscored — `spec` never reviews source.
- **`a11y`**: deep WCAG 2.2 AA pass, reasoning criterion-by-criterion, with a mobile and screen-reader step. It does not repeat the cheap mechanical checks `code` mode already covers.
- **`perf`**: measures load, interaction and layout-shift numbers on the built app against budgets, then lists causes (bundle, images, fonts, render, lists, motion). It reports numbers or marks them `Not Verified`. It does not review UX quality (`craft`) or code standards (`code`).

All six only identify; none edit code. More than one mode can run back-to-back on the same target when the user wants full coverage; run them independently rather than blending their findings into one report. **`craft` and `heuristic` are not the same audit and don't produce comparable scores** — a 14/20 `craft` score and a `heuristic` pass with three Severity-3 findings are two different instruments; don't average or merge them into one number. **`spec` and `code` are also not interchangeable** — `spec` checks whether the build matches what was *designed*; `code` checks whether the code meets this suite's own coding standards, regardless of what was designed.

**Autonomous mode:** every mode's findings normally exist only as a chat report, which an unattended run has no one to read. Write them to `<docs>/AUDIT_<MODE>_FINDINGS.md` (e.g. `AUDIT_CODE_FINDINGS.md`) instead — same Review Output Format, dated, overwritten each run rather than accumulated. Log a milestone (`../../tools/log-milestone/log-milestone.sh --skill audit --event "<mode> audit: N findings (N P0)"`) only when a P0 turns up; a clean run or routine low-severity findings don't need one.

### Optional: independent second pass for high-stakes audits
A single pass reliably misses things, since the reviewer anchors on whatever it noticed first. For an audit gating a real handoff or ship decision, run a second pass with fresh eyes (a separate `Explore` or `general-purpose` agent given only the target and the mode's checklist, no visibility into the first pass's findings) and reconcile both lists before reporting. Skip this for a routine in-progress check — it roughly doubles the cost and isn't worth it until the finding actually matters.

---

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Read the wiki first
- In `spec` mode, read the wiki's artifacts, decisions and sources before you compare the build with the approved design, and cite their IDs. Read only: the [`wiki`](../wiki/SKILL.md) skill alone writes to it. Rules: [`reading-rule.md`](../wiki/references/reading-rule.md).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `craft` | UX critique | [references/craft.md](references/craft.md) |
| `heuristic` | Nielsen pass | [references/heuristic.md](references/heuristic.md) |
| `code` | standards check | [references/code.md](references/code.md) |
| `spec` | build vs design spec | [references/spec.md](references/spec.md) |
| `a11y` | WCAG sweep | [references/a11y.md](references/a11y.md) |
| `perf` | load and motion cost | [references/perf.md](references/perf.md) |
