---
name: redline
description: >-
  Applies one specific UI change to the running prototype, from an annotated screenshot (markup
  mode) or a picked element plus a note (pick mode). Edits the real source and reports the diff. Use
  when the user pastes a marked-up screenshot or points at one element to change.
argument-hint: "[markup: annotated screenshot edits | pick: point and describe]"
---

# Redline

Named for the real design/dev-handoff term: marking up a screenshot (or
pointing at a live element) with exactly the changes needed, the way a
designer redlines a build before sign-off. One targeted edit per redline, not
a general quality pass.

**Not this skill:**
- A systemic pass across many screens for spacing rhythm, micro-interactions,
  dark mode fidelity, or anything `audit`'s `craft` mode would score broadly →
  [`refine`](../refine/SKILL.md). Redline is for "change this one thing,"
  not "make everything better."
- Finding problems without being told what to fix → [`audit`](../audit/SKILL.md).
  Redline starts from a specific instruction (a mark or a spoken request), it
  doesn't go looking for issues on its own.
- Sending a live screen into Figma as editable layers → [`figma`](../figma/SKILL.md)'s
  `capture` mode. That's prototype → Figma; this is screenshot/pointer →
  code, the other direction, and Figma is never involved.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

Say which mode if it's not obvious from what was shared — an image attached
means `markup`, "let me show you"/pointing at the running app means `pick`.

## Mode: markup

### Step 1: Read the markup

Use [`references/markup-conventions.md`](references/markup-conventions.md) to
interpret each annotation — what's circled, what an arrow means, what's
struck through, what a written callout says. A screenshot commonly carries
**more than one annotation**; treat each as a separate edit, not one combined
instruction, even when several land in the same file.

### Step 2: Locate the real source

Match what's visible in the screenshot — copy text, labels, layout position,
which route/page it looks like — to the actual component file. Grep for the
literal visible text first; it's the most reliable anchor. Cross-reference
against the atomic tier structure ([`storybook`](../storybook/SKILL.md)'s
`atoms`/`molecules`/`organisms`/`widgets` folders) and the architecture map
(`map`'s `document` mode output) if either exists, to disambiguate when
multiple components could plausibly match. If real ambiguity remains even
after that, proceed with the most likely file and flag the assumption
prominently in the final report — don't silently guess and stay quiet about it.

### Step 3: Make the edit

Implement each annotation's change, following this suite's existing
conventions: semantic tokens, never raw hex or Tailwind palette classes
(suite `AGENTS.md` §2.1); stay within the element's existing atomic tier
unless the edit explicitly changes its role; touch only what the markup
actually calls out, not adjacent code that happens to be nearby. A "move
this" arrow may mean a layout change, not just a visual shift — check whether
the surrounding structure (flex/grid order, route params) needs to change too,
not just the element's position on screen.

### Step 4: Report

No confirm-before-edit step — the edit already happened; this is the
after-the-fact record the diff review depends on. For each annotation: what
was read from the mark, which file(s) changed, and one line on what changed.
Call out explicitly any assumption made under real ambiguity (Step 2's
fallback, or Step 1's ambiguous-mark handling) so it's visible without having
to reread the whole diff to find it.

**Completion criterion:** every annotation on the screenshot maps to a
reported edit (or an explicit note on why it didn't apply), and every edit
traces to a real file that was actually changed, not a description of a
change that should happen.

## Mode: pick

For when there's no screenshot — the designer is looking at the running
prototype and wants to point at something directly, the way an in-app "edit
mode" in a design tool would work.

### Step 1: Identify the target live

Use whatever browser tooling is available in this environment (the built-in
browser, Claude in Chrome) to open the running prototype. Resolve exactly
which element the designer means — a click, a description precise enough to
match one node in the page's accessibility tree, or a named component if they
already know it — then trace that DOM node back to its source component the
same way Step 2 of `markup` mode does (visible text, structure, atomic tier).
If nothing running is reachable (no dev server, no browser tooling in this
environment), say so and fall back to `markup` mode instead of guessing at
which element was meant.

### Step 2: Get the instruction

Plain language, not markup interpretation — there's no image to read symbols
from in this mode. If the request is underspecified ("fix this"), ask what
specifically should change before editing; this mode has no markup to infer
intent from, so an unspecified request has nothing to interpret.

### Step 3: Make the edit

Same as `markup` mode's Step 3.

### Step 4: Report

Same as `markup` mode's Step 4 — one entry, since `pick` mode targets a
single element per run rather than a screenshot's worth of annotations.

**Completion criterion:** the identified element and the file actually
touched are the same real component, confirmed by tracing structure, not
assumed from a name that merely sounds right.
