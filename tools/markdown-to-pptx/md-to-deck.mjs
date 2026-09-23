// md-to-deck.mjs — turn a plain Markdown report into a deck.json for
// tools/pptx-deck-builder (its `themes` slide shape: title + bullets, no image).
//
//   node md-to-deck.mjs <input.md> <out-deck.json> [--title "..."] [--subtitle "..."]
//
// No dependencies — pure text parsing, so this step never needs an npm install and
// can't fail for a reason unrelated to the actual content. Only the later
// `build-deck.js` render step needs pptxgenjs; if that step fails or is skipped, the
// source Markdown is still a complete, standalone deliverable on its own.
//
// Parsing rules (deliberately simple — this is a report-to-slides pass, not a full
// Markdown renderer):
//   - The first `# H1` becomes deck.title (overridden by --title if passed).
//   - A plain paragraph directly under the H1, before any `## H2`, becomes
//     deck.subtitle (first line only, overridden by --subtitle if passed).
//   - Each `## H2` becomes one `themes` entry; its heading text is the slide title.
//   - Content under it until the next heading: `-`/`*`/`+`/`1.`-style list items become
//     bullets as-is; a plain paragraph becomes one bullet per paragraph (internal line
//     breaks collapsed to spaces). `### H3+` headings are flattened into a bullet
//     ("Subheading: ...") rather than a separate slide.
//   - `th.count` is the number of bullets collected for that section.
//
// Reusable by any skill whose real deliverable is a Markdown report that also wants a
// slide version of the same content (workshop's `ingest` mode; not showcase, whose
// deck has a fundamentally different narrative+screenshot shape — see
// tools/pptx-deck-builder's own header comment).
import fs from 'fs';

function parseArgs(argv) {
  const out = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--title') out.title = argv[++i];
    else if (a === '--subtitle') out.subtitle = argv[++i];
    else positional.push(a);
  }
  out.input = positional[0];
  out.output = positional[1];
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (!args.input || !args.output) {
  console.error('usage: node md-to-deck.mjs <input.md> <out-deck.json> [--title "..."] [--subtitle "..."]');
  process.exit(1);
}

const raw = fs.readFileSync(args.input, 'utf8');
const lines = raw.split(/\r?\n/);

let title = args.title || null;
let subtitle = args.subtitle || null;
const themes = [];
let current = null;
let paraBuf = [];

function flushParagraph() {
  if (!current) { paraBuf = []; return; }
  const text = paraBuf.join(' ').trim();
  paraBuf = [];
  if (text) current.notes.push(text);
}

for (const line of lines) {
  const h1 = line.match(/^#\s+(.*)/);
  const h2 = line.match(/^##\s+(.*)/);
  const h3plus = line.match(/^#{3,6}\s+(.*)/);
  const bullet = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)/);

  if (h1) {
    flushParagraph();
    if (!title) title = h1[1].trim();
    current = null;
    continue;
  }
  if (h2) {
    flushParagraph();
    current = { title: h2[1].trim(), notes: [] };
    themes.push(current);
    continue;
  }
  if (h3plus) {
    flushParagraph();
    if (current) current.notes.push(`${h3plus[1].trim()}:`);
    continue;
  }
  if (bullet) {
    flushParagraph();
    if (current) current.notes.push(bullet[1].trim());
    else if (!subtitle && !themes.length) subtitle = bullet[1].trim();
    continue;
  }
  if (line.trim() === '') {
    flushParagraph();
    continue;
  }
  if (!current && !subtitle && !themes.length) {
    // First plain line before any ## section and after the title becomes the subtitle.
    subtitle = line.trim();
    continue;
  }
  paraBuf.push(line.trim());
}
flushParagraph();

for (const th of themes) th.count = th.notes.length;

const deck = { title: title || 'Untitled', subtitle: subtitle || '', themes };
fs.writeFileSync(args.output, JSON.stringify(deck, null, 2));
console.log(`wrote ${args.output} (${themes.length} theme slide${themes.length === 1 ? '' : 's'})`);
