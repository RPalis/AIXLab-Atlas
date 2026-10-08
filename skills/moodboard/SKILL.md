---
name: moodboard
description: >-
  Keeps a library of visual inspiration and distills it into VISUAL_LANGUAGE.md: the recurring
  color, type, spacing, shape and elevation patterns. Use when the user collects style references or
  asks what direction they suggest.
disable-model-invocation: true
---

# Moodboard

Compiles scattered visual references into one synthesized read of "the look
we're going for" — the same compounding shape [`wiki`](../wiki/SKILL.md) uses
for text notes, applied to images instead. Raw references get re-looked-at
from scratch every time otherwise; this skill automates keeping one current
synthesis instead.

**Not this skill:**
- Generating actual candidate token sets or live-previewing variations on the
  running app → [`restyle`](../restyle/SKILL.md), which reads this skill's
  `VISUAL_LANGUAGE.md` as its primary input when one exists.
- Casting a *decided* palette into the real token system → [`styleguide`](../styleguide/SKILL.md)'s
  default/`forge` modes — the final commit once a direction is actually chosen.
- A one-off "here are some references, give me options right now" request with
  no ongoing library intent → also [`restyle`](../restyle/SKILL.md) directly;
  moodboard is for when references accumulate over time and should compound,
  not a single-session ask.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Structure

```
<docs>/inspiration/
  README.md              # explains the folder, created on first use — not pre-created
                          # by setup the way notes/ is, since this is opt-in
  <screenshots dropped in directly>
  urls.md                 # one reference URL per line, if any were shared as links
                          # instead of images
<docs>/VISUAL_LANGUAGE.md # the synthesized living doc
```

`<docs>/inspiration/` isn't created until the first reference is actually
added — an empty folder with no content isn't scaffolding worth pre-creating.

## Step 0: Check for unprocessed references

Scan `<docs>/inspiration/` for any image or `urls.md` entry not yet reflected
in `VISUAL_LANGUAGE.md`'s source list — the same check
[`wiki`](../wiki/SKILL.md)'s `compile` mode runs against `docs/notes/` before
every full pass, applied here to images instead of notes.

## Step 1: Ingest a reference

For each new reference, read it against
[references/visual-language-checklist.md](references/visual-language-checklist.md) —
color relationships, typography personality, spacing density, shape language,
elevation/depth, overall character. For a URL that isn't a direct image link
(a Dribbble shot page, a live site), use whatever browser tooling is
available in this environment to load and view it; if none is available or
the URL can't be reached, say so and skip it rather than guessing at what it
shows.

## Step 2: Update the synthesis

Update `VISUAL_LANGUAGE.md`: one section per dimension from the checklist,
naming the **dominant pattern across all references so far**, each
observation citing which specific reference(s) support it. When a new
reference genuinely pulls against the existing pattern (three muted/minimal
references, one bold/saturated new one), **flag the tension explicitly**
rather than silently averaging it into mush — note both readings and that a
call is needed on which one the direction actually follows, don't blend two
distinct characters into a vague middle that resembles neither.

## Step 3: Report

State what changed in the synthesis this pass (new dominant pattern, or a
flagged tension) — not a recap of every reference read, just what moved.

**Completion criterion:** every reference in `<docs>/inspiration/` is
reflected in `VISUAL_LANGUAGE.md`'s source list, every dimension in the doc
cites at least one real reference (never an invented default), and any
genuine tension between references is named, not smoothed over.
