# Showcase: doc mode

Part of the [`showcase`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

A faithful conversion: every heading, paragraph, list, table, quote, code block and image in the Markdown appears in the document, in order, with nothing condensed, reworded, or added. Use it when the reader needs the full record (a stakeholder circulating the evidence, a client deliverable, an audit trail).

### Step 1: Read the source and pre-flight it

Resolve the path (as given, or under the project's docs folder via [`tools/find-docs-folder`](../../../tools/find-docs-folder/find-docs-folder.sh)). Read the whole file. Before converting, report anything in it that a reader would trip on, **without changing it**: unfilled template placeholders (`<...>`), unresolved ⚠️ flags, anything marked `Not Verified` or `ASSUMPTION`, a missing evidence warning on desk research. The conversion keeps all of it; a stakeholder reading a polished document will assume it was checked, so say what wasn't.

### Step 2: Theme

If the project has a `DESIGN.md` / `index.css` raw palette, write a small `theme.json` from it: `dark` (headings, table headers), `accent` (the rule under the title), `body`, `muted`, `canvas`, `font`, hex without `#`. Otherwise take the neutral default. Confidence labels (Verified, Likely, Weak Signal, Inferred, Not Verified, Proposed, ASSUMPTION) get fixed green/amber/red/blue tints regardless of theme, because the colors carry meaning.

### Step 3: Build

```bash
npm i docx            # once, in the scratchpad
node ../../../tools/markdown-to-docx/md-to-docx.mjs <source.md> <docs>/exports/<name>.docx [--theme theme.json]
```

The first `# H1` becomes the cover title and a plain paragraph under it the subtitle; `##`–`####` become Heading 1–3. Tables of six or more columns get their own landscape pages, with the heading that introduces them kept alongside. A `>` quote starting "Evidence warning" or "Warning" becomes an amber callout. Local images embed at page width.

### Step 4: Review

Open the file and page through it. Check: wide tables are readable, every table's confidence cells carry their tint, the evidence warning and the verification checklist are present, images landed, and the headers and page numbers are right. Fix the Markdown (not the Word file) and re-run if anything is off.

**Completion criterion:** every block of the source appears in the document in order, confidence tags, interview numbers and source references are intact, and nothing was added.
