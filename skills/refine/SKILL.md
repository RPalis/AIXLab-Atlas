---
name: refine
description: >-
  Fixes and unifies UI craft in a prototype: spacing, hierarchy, motion, UX copy, empty and error
  states, responsive and mobile layouts. Acts on audit findings. Use when asked to polish, redesign
  or raise the visual quality of screens.
---

# Design Refinement & Aesthetic Craft

Elevates prototype UI from basic wireframe quality to extraordinary, presentation-ready product craft. It's the *fix* step — [`audit`](../audit/SKILL.md) is the *find* step.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Step 0: Confirm there's a findings list to act on

This skill narrows `audit`'s `craft`-mode findings into concrete design decisions and a unified visual look — it doesn't go looking for problems itself. Before touching any component:

- If the user just handed over a specific list of what to fix (their own notes, or a findings list from earlier in this conversation), proceed straight to Step 1.
- Otherwise, check for a recent `audit` `craft`-mode pass (a findings list already in the conversation, or referenced in project docs/notes). If none exists, or the one that does predates the components in scope, say so and suggest running `audit`'s `craft` mode first rather than guessing at what's wrong — refining without a findings list risks polishing the wrong things or missing what actually reads as broken.
- If the user explicitly wants freeform polish with no findings list (e.g. "just make this screen feel nicer"), that's a legitimate ask; proceed, but call out that this is undirected refinement, not findings-driven.

---

## Step 1: Pick the lens

Match the findings to a lens, then open only that reference. A pass can use more than one lens. Always apply the craft floor.

| If the findings are about | Open |
|---|---|
| Any screen (always) | [`references/craft-floor.md`](references/craft-floor.md) |
| Animation, transitions, feedback, reduced motion | [`references/motion.md`](references/motion.md) |
| Labels, buttons, errors, empty states, tone | [`references/ux-copy.md`](references/ux-copy.md) |
| Real data, failures, forms, long text, other languages, right-to-left | [`references/harden.md`](references/harden.md) |
| New-user experience, onboarding, blank screens | [`references/first-run.md`](references/first-run.md) |
| Slow load, jank, heavy bundles, images, fonts | [`references/performance.md`](references/performance.md) |
| Phone or tablet layout, touch, safe areas, platform feel | [`references/mobile.md`](references/mobile.md) |

**Completion criterion:** every finding in scope maps to a lens, and the reference for each lens was opened.

## Step 2: Fix in one batch

1. Read the target components and their tokens before editing.
2. Make every fix for this pass in one batch. Use semantic token classes. Do not add raw hex, raw palette classes or `dark:` variants.
3. Run `node ../../tools/design-check/design-check.mjs <src>` and `node ../../tools/check-token-contrast/check-token-contrast.mjs <src/index.css>`. Both must be clean.
4. Check the result once in light and dark, and at phone and desktop width. Fix what that single round shows.

## Step 3: Stop

Verify in bounded passes. Build fully, check once across themes and widths, fix everything in one batch, confirm with at most one more round, then stop. Open-ended polishing costs more than it gains. Report what changed, grouped by finding, and say what the remaining findings need (usually another `audit` run).

**Completion criterion:** each fixed finding is listed with the file changed, both checks are clean, and the pass ended after at most two check rounds.
