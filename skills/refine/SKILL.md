---
name: refine
description: >-
  Fix and unify UI craft, micro-interactions, responsive container layouts, optical alignment, and aesthetic delight for prototypes: the build/fix step after audit has identified what's wrong. Use when redesigning, elevating visual quality, or acting on audit findings.
---

# Design Refinement & Aesthetic Craft

Elevates prototype UI from basic wireframe quality to extraordinary, presentation-ready product craft. It's the *fix* step — [`audit`](../audit/SKILL.md) is the *find* step.

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Step 0: Confirm there's a findings list to act on

This skill narrows `audit`'s `craft`-mode findings into concrete design decisions and a unified visual look — it doesn't go looking for problems itself. Before touching any component:

- If the user just handed over a specific list of what to fix (their own notes, or a findings list from earlier in this conversation), proceed straight to Step 1.
- Otherwise, check for a recent `audit` `craft`-mode pass (a findings list already in the conversation, or referenced in project docs/notes). If none exists, or the one that does predates the components in scope, say so and suggest running `audit`'s `craft` mode first rather than guessing at what's wrong — refining without a findings list risks polishing the wrong things or missing what actually reads as broken.
- If the user explicitly wants freeform polish with no findings list (e.g. "just make this screen feel nicer"), that's a legitimate ask; proceed, but call out that this is undirected refinement, not findings-driven.

---

## 6 Craft Heuristics for Prototypes

### 1. Information Density & Scannability
- Avoid endless blank white space or oversized cartoonish cards.
- Format dense financial and tabular data cleanly with `tabular-nums`, consistent column alignments (numbers right-aligned, text left-aligned), and subtle row hover highlights (`hover:bg-surface-hover/60`).

### 2. Layering, Elevation & Subtle Glassmorphism
- Use crisp, multi-layer shadows (`shadow-sm`, `shadow-md`, `shadow-xl`) and subtle border strokes (`border border-surface-border`).
- Apply subtle backdrop blurs (`backdrop-blur-md bg-surface/80`) to floating headers, dialogs, and flyout menus.

### 3. Intentional Micro-Interactions & Transitions
- Add fluid CSS transitions (`transition-all duration-150 ease-out`) to buttons, tab switches, disclosures, and hover cards.
- Provide clear visual feedback on destructive actions (e.g. subtle red glow on danger buttons).

### 4. Typography Hierarchy & Contrast
- Pair high-contrast primary text (`text-primary`) with balanced secondary metadata (`text-secondary text-xs`).
- Ensure all text passes WCAG AA contrast (4.5:1 for body copy).

### 5. Empty States & Loading States
- Design helpful, branded empty states with clear iconography and a direct CTA (never a blank white screen).
- Use subtle animated skeleton loaders rather than generic spinning wheels.

### 6. Dark Mode Fidelity
- Avoid pure black `#000000` for dark mode surfaces. Use rich dark slate/navy tones (`#0B0F19`, `#111827`) with layered border definitions to preserve visual depth.

---

## Process

1. **Inspect component JSX.** Scan target views for visual friction, generic layouts, or missing micro-interactions.
2. **Apply refinement tweaks.** Replace generic styling with semantic design tokens and micro-interactions.
3. **Verify in light and dark modes.** Toggle the theme switcher and check every token pair still holds contrast and legibility in both modes.
