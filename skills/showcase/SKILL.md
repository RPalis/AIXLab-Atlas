---
name: showcase
description: Build a shareable presentation from a prototype: either a static PDF/PowerPoint deck or a reveal.js web-based deck. Narrative sourced from persona's scenes, screenshots via real capture tooling where available. Use when the user wants to present the prototype to stakeholders, share a feature overview, or build a demo deck.
disable-model-invocation: true
---

# Feature Showcase

Builds a presentation *about* a prototype, not a UI pattern to scaffold within one. Two output modes share the same underlying work (deciding what to show, pulling narrative, sequencing scenes); only the final render step differs.

## Step 1: Choose the output mode

- **Static deck (PDF/PowerPoint)**: for email, offline sharing, or a stakeholder who wants to flip through it themselves.
- **reveal.js web deck**: for a live-presented, in-browser deck with real transitions. Appropriate when the presenter is driving it live or wants a shareable link rather than a file.

Ask if not specified; don't guess.

## Step 2: Source the narrative

Pull scenes directly from [`persona`](../persona/SKILL.md)'s existing walkthrough (`docs/PERSONA_WALKTHROUGH.md`) if it exists — its scene format (title, screenshot, narrative, "what's on screen" bullets) maps almost directly onto a slide. Only ask the user for new copy on features/scenes the walkthrough doesn't cover; don't rewrite narrative that's already written.

## Step 3: Capture screenshots

If real screenshot/browser tooling is available, use it directly against the running prototype (real screens, current state) rather than static mockups. If not available, tell the user explicitly and ask them to supply screenshots. Don't fabricate placeholder imagery and present it as real UI.

## Step 4: Assemble

### Static deck (PDF/PowerPoint)
Use [`templates/deck-outline-template.md`](templates/deck-outline-template.md) as the slide-by-slide outline before generating the final file: title slide, one slide per scene/feature (screenshot + 1-2 sentence narrative, not a wall of text), a closing slide with next steps/ask. Keep each slide to one idea.

### reveal.js web deck
Use [`templates/reveal-template.html`](templates/reveal-template.html) as the starting structure: one `<section>` per scene, screenshots as background or inline images, minimal transition config (`slide` is safer than heavy 3D transitions for a professional audience). This produces a single self-contained HTML file, with no build step and no server required to view it.

## Step 5: Review before sharing

Walk through the assembled deck end-to-end. Check: does the narrative order make sense as a sequence (not just per scene), does every screenshot match the feature it's next to, and is the closing slide's ask/next-step clear.

**Completion criterion:** every slide's narrative traces back to a real `persona` scene or explicit user-supplied copy, with no invented feature descriptions, and every screenshot is real (captured or user-supplied), never a placeholder presented as real UI.
