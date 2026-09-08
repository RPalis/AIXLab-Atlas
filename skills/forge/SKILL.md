---
name: forge
description: Cast a new brand's colors, fonts, and spacing into this suite's fixed two-layer token architecture for the current prototype. Use when casting a new brand, rebranding an existing prototype, or given a live site, brand guide, or verified hex values to apply.
disable-model-invocation: true
---

# Brand Forge

`styleguide` defines this suite's two-layer architecture; [`references/semantic-role-mold.md`](references/semantic-role-mold.md) is the fixed list of semantic roles every prototype in this suite binds. `forge` casts a specific brand's raw values into that exact mold for the current prototype: Layer 1 (the brand's own palette) is new every time, Layer 2 (the role names) never changes shape. Component code never sees the difference — it only ever references the semantic roles.

Run `forge` before or instead of `styleguide`'s own Step 1 whenever a real brand (not a placeholder palette) needs to go in. `styleguide` still owns Steps 2-3 (Tailwind config wiring, `DESIGN.md` generation) once Layer 1 and Layer 2 are cast.

## Step 1: Find the brand's real sources

1. Ask what's available: a live site to pull CSS from, a brand guide (PDF/Figma/doc), or hex codes/font names typed directly.
2. **Verified beats provided.** If a live site is available, prefer grepping its actual CSS for real class-based color/spacing values over trusting a brand guide's stated values blindly — a guide can be stale or aspirational relative to what's actually shipped.
3. **If sources conflict** (a brand guide states one hex, the live site renders another), don't silently pick one — ask the user which is authoritative. Guessing here corrupts the one thing this exercise exists to get right.
4. If tints/shades (lighter/light/dark/foundational) aren't supplied for a color and can't be found in a live source, either ask for them or derive them via consistent HSL-lightness steps, and if derived, label them "computed, not brand-verified" in `DESIGN.md`. Don't present a guess as a fact.

**Completion criterion:** every hex value about to be written into `index.css` traces to either a verified source or an explicitly labeled computation. None are silently invented.

## Step 2: Cast Layer 1, the raw palette

Build a color matrix with at minimum: a primary hue family (with tiers), a secondary/neutral corporate color, a gray scale, and four status colors (error/success/warning/info). Add `pending`/`neutral` status variants too if the app has workflow-state badges beyond those four. Also capture the brand's font stack and, if a live site is available, its real spacing rhythm (grep actual padding/margin/gap values; don't assume a generic 8px scale applies without checking).

**Completion criterion:** every role the semantic mold requires a raw value for (primary + tiers, secondary, gray scale, status set) has a same-shaped brand value. No role silently dropped.

## Step 3: Rebind Layer 2, the roles

Open [`references/semantic-role-mold.md`](references/semantic-role-mold.md) and rebind every semantic variable listed there to the new Layer 1 values, using the *same role each one already plays*, in `index.css`'s `:root` (light) and `.dark` (dark) blocks. Do not rename, add, or drop a role — that shape is what `audit` and `storybook` assume across every prototype in this suite:

- `bg-page`, `surface`, `surface-hover`, `surface-border` → the new gray scale
- `text-primary`, `text-secondary`, `text-muted`, `text-brand` → the new grays + secondary accent
- `action-primary` (+`-hover`/`-active`), `action-secondary`, `action-accent` (+`-foreground`), `focus-ring` → the new primary/secondary/accent hues
- `border-input`, `border-emphasis` → the new gray scale
- `status-error`/`-success`/`-warning`/`-info` (+`-pending`/`-neutral` if added) and their `-text` pairs, **as RGB triplets, not hex**, this is what lets Tailwind opacity modifiers (`bg-status-success/15`) work

**Completion criterion:** `index.css` has one CSS variable for every role in `semantic-role-mold.md`, in both `:root` and `.dark`, new brand values, same names. A renamed or missing role breaks every component that references it.

## Step 4: Hand off to `styleguide`

Run [`styleguide`](../styleguide/SKILL.md)'s Step 2 (Tailwind config wiring) and Step 3 (`DESIGN.md` generation) against the now-rebranded `index.css`. `DESIGN.md` regenerates from the live token file; it's never hand-edited to match a brand that hasn't actually landed in `index.css` yet.

## Step 5: Verify the cast

1. `grep -rn "#[0-9a-fA-F]\{3,6\}\b" src/` (or the prototype's component source root) for hardcoded hex outside `index.css`. Any hit bypassed the semantic layer and needs fixing before this counts as done.
2. Cross-check every role in `semantic-role-mold.md` resolves to a CSS var in `index.css` and a Tailwind key in `tailwind.config.js`.
3. Spot-check a handful of components in both light and dark mode; a role that's present but wired to the wrong tier (e.g. `text-muted` reading as illegible on `surface` in dark mode) won't show up in a grep.

**Completion criterion:** both checks in this step return clean, and the prototype renders correctly in both themes with the new brand, no leftover reference to the previous palette anywhere in component code.
