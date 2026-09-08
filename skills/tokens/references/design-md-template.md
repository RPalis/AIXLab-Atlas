# DESIGN.md: Spec-Conformant Format

`DESIGN.md` follows the open [DESIGN.md format spec](https://github.com/google-labs-code/design.md): YAML frontmatter carrying machine-readable tokens, followed by up to eight markdown sections in a **fixed order with exact headings**. Tooling parsing depends on this, don't rename or reorder sections even slightly ("Colors" not "Color Palette"). Omit a section entirely when it doesn't apply; never invent content to fill it.

**Tokens are normative; prose explains how to apply them.** `index.css` (from this skill's Step 1) is the actual source of truth for the running app. `DESIGN.md` is a generated summary + rationale doc built from it, not a second source that can drift.

## Frontmatter schema

```yaml
---
name: [Project Title]
description: [one-line tagline]
colors:
  primary: "#00828A"
  # one entry per Layer 1 + key Layer 2 color; key = descriptive slug, not "blue-800"
typography:
  display:
    fontFamily: "..."
    fontSize: "..."
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "..."
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "8px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
---
```

Rules:
- **Only these five top-level keys**: `colors`, `typography`, `rounded`, `spacing`, `components`. No `motion`, `shadows`, or `breakpoints` at the top level; those aren't part of the schema. Describe them in prose under `## Elevation & Depth` / `## Layout` instead.
- **Token refs** use `{path.to.token}` (e.g. `{colors.primary}`). Components may reference primitives; primitives may not reference each other.
- **Component sub-tokens** are limited to 8 props: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.
- Don't duplicate a token's value between frontmatter and prose with a different value. Frontmatter is normative; prose describes role and placement, not a competing number.
- Don't extract every one-off value. Stop at what's actually reused.

## The eight sections, in this exact order

1. `## Overview`: 2-3 sentence holistic description: personality, density, aesthetic philosophy. End with a short **Key Characteristics:** bullet list.
2. `## Colors`: group by role (Primary / Secondary / Tertiary / Neutral), not hex order. Each entry: `**[Descriptive Name]** (#HEX): [where and why it's used]`.
3. `## Typography`: display/body/label font families, the size/weight hierarchy, and character in 1-2 sentences.
4. `## Layout`: grid/container behavior, density, responsive breakpoints, spacing rhythm.
5. `## Elevation & Depth`: does the system use shadows, flat/tonal layering, or a hybrid? If no shadows, say so explicitly.
6. `## Shapes`: corner/radius strategy, borders, recurring form language.
7. `## Components`: 5-10 components max (buttons, cards, inputs, nav, whatever this project actually has, not an invented list). Lead each with shape/color assignment, then hover/focus states.
8. `## Do's and Don'ts`: concrete guardrails grounded in the actual `index.css`/component code, each starting with **Do** or **Don't**.

Descriptive over technical: "Gently curved edges (8px radius)" beats "rounded-lg". Lead with description, put the exact value in parens. A **Named Rule** (`**The One Voice Rule.** ...`) is a memorable way to state an invariant. Use sparingly, 1-3 per section where a real invariant exists.

## When to (re)generate

- After [`tokens`](../SKILL.md) Step 1 first defines `index.css`.
- Whenever `index.css` changes enough that `DESIGN.md` would describe stale tokens.
- Before a large visual redesign, to capture the current state as a reference point.

If `DESIGN.md` already exists, don't silently overwrite it. Show the user what's there and ask whether to refresh, merge, or leave a section alone.
