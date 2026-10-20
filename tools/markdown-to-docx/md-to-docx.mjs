// md-to-docx.mjs — turn a Markdown report into a styled Word (.docx) file.
//
//   node md-to-docx.mjs <input.md> <out.docx> [--theme theme.json] [--title "..."] [--subtitle "..."]
//
// A faithful conversion, not a summary: every heading, paragraph, list, table, quote,
// code block and image in the Markdown ends up in the document, in order. Nothing is
// condensed or reworded. (Condensing is `showcase`'s `deck` mode, which is a judgment
// call; this tool has none.)
//
// Requires the `docx` npm package, resolved from the current directory first
// (`npm i docx` in a scratch folder, then run this from there), then from this file.
//
// Mapping:
//   - First `# H1`            -> cover title. A plain paragraph right under it -> subtitle.
//   - `##` / `###` / `####`   -> Heading 1 / 2 / 3.
//   - `-` `*` `+` / `1.`      -> bullet / numbered lists, nested by 2-space indent.
//     `[ ]` / `[x]` task items render as ☐ / ☑.
//   - `>` blockquote          -> shaded callout. One starting with "Evidence warning",
//     "Warning" or "⚠" gets the amber warning tone.
//   - Pipe tables             -> header row in the theme's dark color, zebra rows. A cell
//     that is exactly a confidence label (Verified, Likely, Not Verified, Weak Signal,
//     Inferred, Proposed, ASSUMPTION) is tinted. A table of 6+ columns gets its own
//     landscape section so it stays readable.
//   - ``` fences              -> monospace block.
//   - `![alt](path)`          -> embedded PNG/JPEG, scaled to the page width.
//   - Inline `**bold**`, `*italic*`, `` `code` ``, `[text](url)`.
// Theme keys (hex without '#'): dark, accent, body, muted, canvas, font. Defaults match
// tools/pptx-deck-builder so a deck and a doc from the same project look related.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const themeFile = flag('--theme'), titleArg = flag('--title'), subtitleArg = flag('--subtitle');
const [inPath, outPath] = argv;
if (!inPath || !outPath) {
  console.error('usage: node md-to-docx.mjs <input.md> <out.docx> [--theme theme.json] [--title "..."] [--subtitle "..."]');
  process.exit(1);
}

let docx;
try { docx = createRequire(path.join(process.cwd(), 'noop.js'))('docx'); }
catch { try { docx = createRequire(import.meta.url)('docx'); } catch { console.error('docx package not found. Run `npm i docx` in the current directory.'); process.exit(1); } }
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, HeadingLevel,
  BorderStyle, ImageRun, ExternalHyperlink, Footer, Header, PageNumber, AlignmentType, LevelFormat,
  PageOrientation, VerticalAlign, TableLayoutType,
} = docx;

const T = Object.assign({
  dark: '152642', accent: 'F15840', body: '2D3748', muted: '8A94A6', canvas: 'F5F7FA', font: 'Calibri',
}, themeFile ? JSON.parse(fs.readFileSync(themeFile, 'utf8')) : {});
const CONF = {
  verified: 'D6E9D6', likely: 'FCEFCC', 'weak signal': 'FCEFCC', inferred: 'FCEFCC',
  'not verified': 'F6D8D6', assumption: 'F6D8D6', proposed: 'DCE6F5',
};
const WARN_BG = 'FCEFCC';

// HTML comments (template notes, hidden TODOs) are not content: drop them before parsing.
const lines = fs.readFileSync(inPath, 'utf8').replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '').split('\n');
const baseDir = path.dirname(path.resolve(inPath));

/* ---------- inline ---------- */
function runs(str, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_|\[[^\]]+\]\([^)]+\))/g;
  let last = 0, m;
  const plain = (s) => { if (s) out.push(new TextRun({ text: s, font: T.font, color: T.body, ...base })); };
  while ((m = re.exec(str))) {
    plain(str.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(new TextRun({ text: tok.slice(2, -2), bold: true, font: T.font, color: T.body, ...base }));
    else if (tok.startsWith('`')) out.push(new TextRun({ text: tok.slice(1, -1), font: 'Consolas', size: 20, color: T.dark, shading: { type: ShadingType.CLEAR, fill: T.canvas }, ...base }));
    else if (tok.startsWith('[')) {
      const [, label, url] = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      if (/^https?:|^mailto:/.test(url)) out.push(new ExternalHyperlink({ link: url, children: [new TextRun({ text: label, style: 'Hyperlink', color: '1F5FBF', underline: {}, font: T.font, ...base })] }));
      else out.push(new TextRun({ text: label, font: T.font, color: T.body, ...base }));
    } else out.push(new TextRun({ text: tok.slice(1, -1), italics: true, font: T.font, color: T.body, ...base }));
    last = m.index + tok.length;
  }
  plain(str.slice(last));
  return out.length ? out : [new TextRun({ text: '', font: T.font })];
}

/* ---------- block parsing ---------- */
const isTableSep = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l || '');
const splitRow = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));

const blocks = [];
for (let i = 0; i < lines.length;) {
  const l = lines[i];
  if (!l.trim()) { i++; continue; }
  if (i === 0 && l.trim() === '---') { const end = lines.indexOf('---', 1); if (end > 0) { i = end + 1; continue; } }
  let m;
  if (/^```/.test(l)) {
    const code = []; i++;
    while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
    i++; blocks.push({ t: 'code', lines: code }); continue;
  }
  if ((m = /^(#{1,6})\s+(.*)$/.exec(l))) { blocks.push({ t: 'h', n: m[1].length, text: m[2].trim() }); i++; continue; }
  if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)) { blocks.push({ t: 'hr' }); i++; continue; }
  if (l.includes('|') && isTableSep(lines[i + 1])) {
    const header = splitRow(l); const rows = []; i += 2;
    while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]));
    blocks.push({ t: 'table', header, rows }); continue;
  }
  if (/^>/.test(l)) {
    const q = [];
    while (i < lines.length && /^>/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
    blocks.push({ t: 'quote', text: q.join('\n').trim() }); continue;
  }
  if (/^\s*([-*+]|\d+[.)])\s+/.test(l)) {
    const items = [];
    while (i < lines.length && lines[i].trim() && (/^\s*([-*+]|\d+[.)])\s+/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
      const lm = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/.exec(lines[i]);
      if (lm) items.push({ level: Math.min(Math.floor(lm[1].length / 2), 3), ordered: /\d/.test(lm[2]), text: lm[3] });
      else if (items.length) items[items.length - 1].text += ' ' + lines[i].trim();
      i++;
    }
    blocks.push({ t: 'list', items }); continue;
  }
  if ((m = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(l))) { blocks.push({ t: 'img', alt: m[1], src: m[2] }); i++; continue; }
  const para = [];
  while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*([-*+]|\d+[.)])\s)/.test(lines[i]) && !(lines[i].includes('|') && isTableSep(lines[i + 1]))) para.push(lines[i++].trim());
  blocks.push({ t: 'p', text: para.join(' ') });
}

/* ---------- cover ---------- */
let title = titleArg, subtitle = subtitleArg;
const firstH1 = blocks.findIndex((b) => b.t === 'h' && b.n === 1);
if (firstH1 >= 0) {
  title = title || blocks[firstH1].text;
  const nxt = blocks[firstH1 + 1];
  let drop = 1;
  if (!subtitle && nxt && nxt.t === 'p') { subtitle = nxt.text; drop = 2; }
  blocks.splice(firstH1, drop);
}
title = title || path.basename(inPath, path.extname(inPath));

/* ---------- builders ---------- */
const PAGE_W = 12240, MARGIN = 1080;               // US Letter, DXA
const CONTENT_W = PAGE_W - 2 * MARGIN;
const LAND_W = 15840 - 2 * MARGIN;
const gap = (after = 120) => ({ spacing: { after } });
const stripMd = (s) => s.replace(/\*\*|`|\[([^\]]+)\]\([^)]+\)/g, (m0, g) => g || '');

const HEADS = [null, HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3];
function heading(b) {
  const n = Math.min(Math.max(b.n - 1, 1), 3);
  return new Paragraph({ heading: HEADS[n], children: runs(b.text, { bold: true, color: T.dark }), keepNext: true });
}
function callout(text) {
  const warn = /^(\*\*)?(evidence warning|warning|⚠)/i.test(text);
  const fill = warn ? WARN_BG : T.canvas, bar = warn ? 'E0A100' : T.accent;
  const none = { style: BorderStyle.NIL, size: 0, color: 'FFFFFF' };
  const kids = text.split(/\n+/).map((ln, k, arr) => new Paragraph({ spacing: { after: k === arr.length - 1 ? 0 : 80 }, children: runs(ln.trim(), { size: 21 }) }));
  // A one-cell table renders the shaded panel and the colored bar in every viewer; paragraph borders don't.
  return [new Table({
    width: { size: CONTENT_W, type: WidthType.DXA }, columnWidths: [CONTENT_W],
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: CONTENT_W, type: WidthType.DXA }, shading: { type: ShadingType.CLEAR, fill },
      borders: { top: none, bottom: none, right: none, left: { style: BorderStyle.SINGLE, size: 36, color: bar } },
      margins: { top: 120, bottom: 120, left: 200, right: 160 }, children: kids,
    })] })],
  }), new Paragraph({ ...gap(120), children: [] })];
}
function list(b) {
  return b.items.map((it) => {
    const task = /^\[( |x|X)\]\s+/.exec(it.text);
    const text = task ? it.text.slice(task[0].length) : it.text;
    const base = { numbering: { reference: it.ordered ? 'num' : 'bul', level: it.level }, spacing: { after: 60 } };
    const kids = runs(text);
    if (task) kids.unshift(new TextRun({ text: task[1] === ' ' ? '☐  ' : '☑  ', font: 'Segoe UI Symbol', color: T.dark }));
    return new Paragraph({ ...base, children: kids });
  });
}
function codeBlock(b) {
  return b.lines.map((ln, k) => new Paragraph({
    shading: { type: ShadingType.CLEAR, fill: T.canvas }, spacing: { after: k === b.lines.length - 1 ? 160 : 0 }, indent: { left: 120 },
    children: [new TextRun({ text: ln || ' ', font: 'Consolas', size: 19, color: T.dark })],
  }));
}
function imageDims(buf) {
  if (buf.slice(1, 4).toString() === 'PNG') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    for (let o = 2; o < buf.length;) {
      if (buf[o] !== 0xff) { o++; continue; }
      const mk = buf[o + 1];
      if (mk >= 0xc0 && mk <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(mk)) return { h: buf.readUInt16BE(o + 5), w: buf.readUInt16BE(o + 7) };
      o += 2 + buf.readUInt16BE(o + 2);
    }
  }
  return null;
}
function image(b, maxPx) {
  const p = path.resolve(baseDir, b.src);
  if (!fs.existsSync(p)) { console.error(`warning: image not found: ${b.src}`); return [new Paragraph({ children: runs(`[missing image: ${b.alt || b.src}]`, { italics: true, color: T.muted }) })]; }
  const buf = fs.readFileSync(p); const d = imageDims(buf) || { w: 800, h: 500 };
  const w = Math.min(d.w, maxPx), h = Math.round((d.h * w) / d.w);
  const type = p.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
  const out = [new Paragraph({ ...gap(60), alignment: AlignmentType.CENTER, children: [new ImageRun({ type, data: buf, transformation: { width: w, height: h }, altText: { title: b.alt || '', description: b.alt || '', name: path.basename(p) } })] })];
  if (b.alt) out.push(new Paragraph({ ...gap(160), alignment: AlignmentType.CENTER, children: runs(b.alt, { italics: true, size: 18, color: T.muted }) }));
  return out;
}
function table(b, totalW) {
  const cols = b.header.length;
  const weights = b.header.map((h, c) => Math.min(Math.max(stripMd(h).length, ...b.rows.map((r) => stripMd(r[c] || '').length), 12), 48));
  // Every column gets a floor wide enough for a word like "Confidence"; the rest is shared by content length.
  const FLOOR = Math.min(1250, Math.floor(totalW / cols));
  const sum = weights.reduce((x, y) => x + y, 0);
  const colW = weights.map((w) => FLOOR + Math.floor(((totalW - FLOOR * cols) * w) / sum));
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'D5DBE5' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const cell = (txt, c, opts) => {
    const fill = opts.fill ?? CONF[stripMd(txt).trim().toLowerCase()];
    return new TableCell({
      width: { size: colW[c], type: WidthType.DXA }, borders, verticalAlign: VerticalAlign.TOP,
      shading: fill ? { type: ShadingType.CLEAR, fill } : undefined,
      margins: { top: 70, bottom: 70, left: 100, right: 100 },
      children: [new Paragraph({ children: runs(txt, { size: 19, ...(opts.head ? { bold: true, color: 'FFFFFF' } : {}) }) })],
    });
  };
  const rows = [new TableRow({ tableHeader: true, cantSplit: true, children: b.header.map((h, c) => cell(h, c, { head: true, fill: T.dark })) })];
  b.rows.forEach((r, ri) => rows.push(new TableRow({ cantSplit: true, children: b.header.map((_, c) => cell(r[c] ?? '', c, { fill: CONF[stripMd(r[c] || '').trim().toLowerCase()] ?? (ri % 2 ? 'F8FAFC' : undefined) })) })));
  return [new Table({ width: { size: totalW, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: colW, rows }), new Paragraph({ ...gap(160), children: [] })];
}

/* ---------- assemble, splitting landscape sections for wide tables ---------- */
const portrait = { page: { size: { width: 12240, height: 15840 }, margin: { top: 1260, bottom: 1260, left: MARGIN, right: MARGIN } } };
const landscape = { page: { size: { width: 12240, height: 15840, orientation: PageOrientation.LANDSCAPE }, margin: { top: 1260, bottom: 1260, left: MARGIN, right: MARGIN } } };
const hdr = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: title, font: T.font, size: 16, color: T.muted })] })] });
const ftr = new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ children: ['Page ', PageNumber.CURRENT], font: T.font, size: 16, color: T.muted })] })] });

const cover = [
  new Paragraph({ spacing: { before: 600, after: 120 }, children: [new TextRun({ text: title, font: T.font, size: 60, bold: true, color: T.dark })] }),
  new Paragraph({ ...gap(subtitle ? 160 : 320), border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: T.accent, space: 6 } }, children: [] }),
];
if (subtitle) cover.push(new Paragraph({ ...gap(320), children: runs(subtitle, { size: 26, color: T.muted }) }));

const sections = []; let cur = { landscape: false, kids: cover };
const headingKids = new Set();
const flush = () => { if (cur.kids.length) sections.push(cur); };
const want = (ls) => {
  if (cur.landscape === ls) return;
  // Keep the heading(s) that introduce a table with the table, so a heading is never stranded alone on the previous page.
  const carry = [];
  while (cur.kids.length && headingKids.has(cur.kids[cur.kids.length - 1])) carry.unshift(cur.kids.pop());
  flush(); cur = { landscape: ls, kids: carry };
};
for (const b of blocks) {
  if (b.t === 'table') { const wide = b.header.length >= 6; want(wide); cur.kids.push(...table(b, wide ? LAND_W : CONTENT_W)); if (wide) { /* return to portrait on the next non-table block */ cur.afterWide = true; } continue; }
  if (cur.landscape && cur.afterWide) want(false);
  switch (b.t) {
    case 'h': { const h = heading(b); headingKids.add(h); cur.kids.push(h); break; }
    case 'p': cur.kids.push(new Paragraph({ ...gap(), children: runs(b.text) })); break;
    case 'list': cur.kids.push(...list(b)); break;
    case 'quote': cur.kids.push(...callout(b.text)); break;
    case 'code': cur.kids.push(...codeBlock(b)); break;
    case 'img': cur.kids.push(...image(b, cur.landscape ? 760 : 580)); break;
    case 'hr': cur.kids.push(new Paragraph({ ...gap(160), border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D5DBE5', space: 4 } }, children: [] })); break;
  }
}
flush();

const bulletLevels = [0, 1, 2, 3].map((level) => ({ level, format: LevelFormat.BULLET, text: ['•', '–', '·', '·'][level], alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540 + level * 360, hanging: 270 } } } }));
const numLevels = [0, 1, 2, 3].map((level) => ({ level, format: LevelFormat.DECIMAL, text: `%${level + 1}.`, alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540 + level * 360, hanging: 360 } } } }));
const hStyle = (id, size, before) => ({ id, name: id, basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size, bold: true, font: T.font, color: T.dark }, paragraph: { spacing: { before, after: 120 }, outlineLevel: 0 } });

const doc = new Document({
  creator: '', title,
  styles: {
    default: { document: { run: { font: T.font, size: 22, color: T.body } } },
    paragraphStyles: [hStyle('Heading1', 32, 360), hStyle('Heading2', 26, 280), hStyle('Heading3', 23, 200)],
  },
  numbering: { config: [{ reference: 'bul', levels: bulletLevels }, { reference: 'num', levels: numLevels }] },
  sections: sections.map((s) => ({ properties: s.landscape ? landscape : portrait, headers: { default: hdr }, footers: { default: ftr }, children: s.kids })),
});

const buf = await Packer.toBuffer(doc);
fs.writeFileSync(outPath, buf);
console.log(`wrote ${outPath} (${blocks.length} blocks, ${sections.length} section${sections.length === 1 ? '' : 's'})`);
