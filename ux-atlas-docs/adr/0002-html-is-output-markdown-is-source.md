# 0002: HTML is an output. Markdown is the source people edit.

Date: 2026-10-12. Settled in a design discussion that followed [0001](0001-wiki-librarian-sources-artifacts.md).

## Decision
Notes, the wiki and artifacts stay plain Markdown in the project's docs folder. `wiki publish` builds a read-only static site from them. The site shows pages, links `reveal` decks directly (a link, not an embed), and offers `.pptx`, `.docx`, `.pdf` and `.svg` files as downloads. It can be built into the prototype's `public/wiki/` to ship alongside it. The team is pointed at Markdown editors (Obsidian, Plainva, VS Code) in the docs-root README. There are no per-tool import profiles for Notion, OneNote, Apple Notes or Confluence.

## Why
The goal is a back-and-forth: anyone edits a note and it reaches the wiki. That only works if the folder is the one place people edit. A Markdown editor writes straight into that folder. Notion, OneNote and Apple Notes keep their own copy, so an edit there never returns.

## Rejected alternatives
- **HTML as the source.** Rich, but Obsidian and Plainva edit it poorly, diffs are unreadable, and the footer and one-writer rules rely on plain text.
- **Per-tool export profiles (Notion, OneNote, Apple Notes).** They are one-way. OneNote has no Markdown or HTML import. Apple Notes handles only common Markdown, so tables and diagrams fail. Notion's handling of relative links is unconfirmed. A profile would invite edits that never come back.
- **Embedding the decks in the site.** Linking keeps each deck a standalone page that works on its own.
- **Always one HTML artifact format for rich content.** A diagram should keep an image (SVG or PNG) beside its source so any viewer can show it. Self-contained `.html` artifacts remain allowed in `artifacts/`.

## Scope
Applies to every project's docs and to `wiki publish`. A one-way push to Confluence or Notion stays optional through MCP, and is a read-only copy.
