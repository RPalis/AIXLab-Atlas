---
name: showcase
description: >-
  Turns work into something shareable. Modes: story (day-in-the-life PowerPoint), reveal (web deck),
  doc (Markdown report to Word), deck (Markdown report to PowerPoint). Use when presenting a
  prototype or handing a stakeholder a polished document.
argument-hint: "[story: day-in-the-life deck | reveal: live web deck | doc: report to Word | deck: report to PowerPoint] or a .md file or adr/ folder"
disable-model-invocation: true
---

# Showcase

Packages work for people who weren't in the room. Two kinds of input, four modes:

- **From a prototype**: `story` (a static PowerPoint day-in-the-life deck with real screenshots) and `reveal` (a reveal.js web deck). Both build a presentation *about* the prototype, and share the same underlying work (deciding what to show, pulling narrative from `persona`'s scenes, sequencing scenes); only the final render step differs.
- **From a Markdown report**: `doc` (a faithful, styled Word document) and `deck` (a condensed PowerPoint). Give it the output of another skill, e.g. `/showcase interview-analysis.md`, and it makes the shareable version. Decisions live one per file, so give it the ADR folder (`/showcase deck adr/`) or a list of ADR files. [`tools/adr-bundle`](../../tools/adr-bundle/adr-bundle.sh) joins them into one Markdown file first, with nothing added or dropped. The Markdown stays the source of truth: change it and re-run, and never edit the Word or PowerPoint file by hand.

**Not this skill:**
- Producing the analysis, benchmark, interview themes or any other content a report contains → the skill that owns it ([`competitors`](../competitors/SKILL.md), [`interview`](../interview/SKILL.md), [`map`](../map/SKILL.md) `ia`, [`journey`](../journey/SKILL.md)). `doc` and `deck` never add a finding, a score, or a claim that isn't in the Markdown.
- A mechanical heading-per-slide split of a short board summary → `workshop`'s `ingest` mode uses [`tools/markdown-to-pptx`](../../tools/markdown-to-pptx/md-to-deck.mjs) directly. `deck` mode is for reports too long and too evidence-heavy for that: it condenses with judgment and you approve the outline.
- A handoff bundle of the prototype itself (site, source, docs) → [`package`](../package/SKILL.md).
- Documentation that teaches someone to use the app → [`guide`](../guide/SKILL.md).

**Picking the mode.** A prototype to present means `story` or `reveal`. A `.md` path, an ADR folder, or "put this analysis in a Word doc / deck", means `doc` or `deck`. Given just a `.md` file with no mode, ask Word or PowerPoint. Don't guess between `story` and `reveal` either: ask. **Autonomous mode** (suite `AGENTS.md` §2.9): a bare `.md` defaults to `doc` (a faithful conversion with nothing condensed or cut, the safer of the two); a prototype with no mode defaults to `story` — it needs no live presenter and opens anywhere. Log the default; the other mode is available on request. `reveal` is the better pick specifically when the deck is meant to be embedded inside the prototype itself (a shareable link or iframe, not a downloadable file).

**External dependencies**, stated up front: the `docx` npm package (`doc`), `pptxgenjs` (`deck`, `story`), and Playwright with Chromium (`story` screenshots and overflow check). Install into a scratch folder (`npm i docx pptxgenjs`) and run the tools from there.

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `story` | day-in-the-life PowerPoint with real screenshots | [references/story-reveal.md](references/story-reveal.md) |
| `reveal` | the same story as a reveal.js web deck | [references/story-reveal.md](references/story-reveal.md) |
| `doc` | Markdown report to a faithful Word document | [references/doc.md](references/doc.md) |
| `deck` | Markdown report to condensed PowerPoint (outline confirmed first) | [references/deck.md](references/deck.md) |
