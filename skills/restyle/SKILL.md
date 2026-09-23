---
name: restyle
description: >-
  Generate 2-3 candidate visual directions for the app from reference
  screenshots/URLs (or an existing `moodboard` VISUAL_LANGUAGE.md) — full token set:
  color, typography, spacing/radius, elevation — live-applied to the running
  prototype via a temporary switcher so the designer compares their real screens in
  each direction, not isolated swatches. Hands the chosen direction to `styleguide`'s
  `forge` mode to actually commit it. Use when the user shares reference
  screenshots/URLs of styles they like (e.g. Dribbble shots) and wants a few
  restyled variations of their own app to pick from.
---

# Restyle

Generates real, comparable options — not a written description of three
directions, but the designer's actual running app wearing each one, toggled
live. The deliverable is a decision made with eyes on the real thing, handed
to [`styleguide`](../styleguide/SKILL.md) to make permanent.

**Not this skill:**
- Maintaining an ongoing reference library that compounds over sessions →
  [`moodboard`](../moodboard/SKILL.md). This skill *reads* `VISUAL_LANGUAGE.md`
  when one exists; it doesn't maintain it.
- Actually writing `index.css`/`DESIGN.md` for real → [`styleguide`](../styleguide/SKILL.md)'s
  `forge` mode, always the last step here (see AGENTS.md §6, "Living docs" —
  `DESIGN.md` is owned by `styleguide` alone, never written by another skill).
- One targeted edit to one element → [`redline`](../redline/SKILL.md).

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Step 1: Gather the input

If `<docs>/VISUAL_LANGUAGE.md` exists ([`moodboard`](../moodboard/SKILL.md)'s
output), use it as the primary input. Whether or not it exists, also read any
screenshots/URLs shared directly this session against
[`moodboard`'s visual-language checklist](../moodboard/references/visual-language-checklist.md) —
color relationships, typography personality, spacing density, shape language,
elevation, overall character. Don't require a moodboard to exist; this skill
works standalone from references given right now.

## Step 2: Generate candidate directions

Default to **3** candidates unless told otherwise. Each is a full
token-architecture-shaped set — Layer 1 raw palette, typography (family,
weight defaults, scale), spacing/radius scale, elevation style — genuinely
distinct from the others, not minor tweaks of one direction. Each candidate
states which reference(s) it draws from and why, and which of Step 1's
dimensions it leans into hardest (a reference read as "bold, saturated,
heavy shadows" shouldn't produce a candidate that's actually closest to
"minimal, muted, flat").

## Step 3: Live-preview switcher

Wire a **temporary** mechanism into the running prototype so the designer
sees their real screens in each candidate, not a swatch page:

- Scope each candidate's Layer 1 + Layer 2 token overrides under
  `[data-style-preview="a"]` / `="b"` / `="c"` selectors (or the project's
  equivalent), layered on top of the existing token architecture without
  touching the real `index.css` values — this must not conflict with the
  existing `.dark` class toggle, both need to work together.
- Add a small, clearly-temporary switcher UI (a floating corner control is
  fine) that sets the attribute — labeled obviously as a preview tool, not
  styled to look like a permanent feature.
- The designer clicks through the app itself while toggling, not a
  side-by-side isolated preview.

## Step 4: Hand off the winner

Once a candidate is chosen, **strip every part of the temporary switcher**
(the attribute-scoped overrides, the switcher UI, any preview-only code) —
nothing from this step should linger in the codebase. Hand the winning
candidate's values to [`styleguide`](../styleguide/SKILL.md)'s `forge` mode as
its confirmed source, the same way any other brand source would be provided,
so `index.css` and `DESIGN.md` get written for real through that skill's own
pipeline rather than duplicated here.

**Completion criterion:** every candidate traces to specific reference(s), the
designer made the pick against their own running app rather than a
description, every trace of the temporary switcher is gone from the codebase
after handoff, and `styleguide` forge mode ran to actually commit the result
— this skill's job ends at a confirmed pick, not a written recommendation.
