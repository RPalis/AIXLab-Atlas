// Build a .pptx deck from a deck.json. Two slide shapes share this one builder:
//
//   node build-deck.js <deck.json> <screenshots-dir> <out.pptx>
//
// Requires pptxgenjs (npm i pptxgenjs). Layout is 16:9 widescreen (13.33 x 7.5 in).
//
// - `deck.story`: a day-in-the-life narrative — one slide per scene, narrative column
//   on one side, a real 16:10 screenshot on the other (used by `showcase`). Text boxes
//   are fixed-size, so keep copy inside the limits in deck-template.json and run
//   render-preview.js before building to catch overflow. `<screenshots-dir>` is
//   required when `deck.story` is present; pass any placeholder path otherwise.
// - `deck.themes`: title + bullet-list slides, one per theme, no screenshot (used by
//   `workshop`'s `ingest` mode to summarize a workshop board). Not overflow-checked by
//   render-preview.js — keep bullets short by convention instead.
//
// - `deck.slides`: a report-style deck condensed from a Markdown report (used by
//   `showcase`'s `deck` mode). Each entry has a `type`: `callout` (evidence warning or
//   key message), `bullets`, `table` (color-codes confidence labels), `quote` (a
//   verbatim line with its source), `checklist`, `section` (divider). Limits are
//   enforced before anything is written, so a slide that wouldn't fit fails loudly
//   with its index instead of overflowing in PowerPoint. Rendered after the title and
//   before `problem`/`story`/`closing` if those are also present.
//
// `deck.problem` and `deck.closing` (stat/beat slides) are shared by all shapes.
const fs = require('fs');
const path = require('path');
// Resolve pptxgenjs from the current directory first (`npm i pptxgenjs` in a scratch
// folder, then run this file from there), then from this file's own location.
const load = (name) => {
  try { return require(require('module').createRequire(path.join(process.cwd(), 'noop.js')).resolve(name)); }
  catch { return require(name); }
};
const pptxgen = load('pptxgenjs');

const [, , deckPath, shotsDir, outPath] = process.argv;
if (!deckPath || !shotsDir || !outPath) {
  console.error('usage: node build-deck.js <deck.json> <screenshots-dir> <out.pptx>');
  process.exit(1);
}
const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));

// Theme: override any key from deck.theme (hex without '#'). Defaults are a neutral
// navy/coral pairing; swap for the project's own tokens (DESIGN.md / index.css).
const T = Object.assign({
  dark: '152642',      // title/problem/closing backgrounds
  darkMid: '2B3E5C',   // quote text
  accent: 'F15840',    // time chips, stats, bullets
  accent2: '00A792',   // closing "next" line
  onDark: 'C9D3E4',    // secondary text on dark slides
  body: '4A5568',
  muted: '8A94A6',
  canvas: 'F5F7FA',    // quote panel
  font: 'Calibri',
}, deck.theme || {});
const WHITE = 'FFFFFF';
const CONF = { verified: 'D6E9D6', likely: 'FCEFCC', 'weak signal': 'FCEFCC', inferred: 'FCEFCC', 'not verified': 'F6D8D6', assumption: 'F6D8D6', proposed: 'DCE6F5' };

// Fit limits for `deck.slides`. Conservative on purpose: the text boxes are fixed-size.
const LIMITS = { title: 70, bullets: 6, bullet: 140, tableRows: 8, tableCols: 6, cell: 60, callout: 420, quote: 240, source: 90, checklist: 8, item: 110, caption: 160 };
function checkSlides(slides) {
  const bad = [];
  const over = (i, what, got, max) => bad.push(`slides[${i}] ${what}: ${got} > ${max}`);
  slides.forEach((sl, i) => {
    if (!['callout', 'bullets', 'table', 'quote', 'checklist', 'section'].includes(sl.type)) return bad.push(`slides[${i}] unknown type "${sl.type}"`);
    if ((sl.title || '').length > LIMITS.title) over(i, 'title chars', sl.title.length, LIMITS.title);
    if (sl.type === 'bullets') {
      if ((sl.bullets || []).length > LIMITS.bullets) over(i, 'bullets', sl.bullets.length, LIMITS.bullets);
      (sl.bullets || []).forEach((b, k) => b.length > LIMITS.bullet && over(i, `bullet ${k} chars`, b.length, LIMITS.bullet));
    }
    if (sl.type === 'checklist') {
      if ((sl.items || []).length > LIMITS.checklist) over(i, 'items', sl.items.length, LIMITS.checklist);
      (sl.items || []).forEach((b, k) => b.length > LIMITS.item && over(i, `item ${k} chars`, b.length, LIMITS.item));
    }
    if (sl.type === 'table') {
      if ((sl.columns || []).length > LIMITS.tableCols) over(i, 'columns', sl.columns.length, LIMITS.tableCols);
      if ((sl.rows || []).length > LIMITS.tableRows) over(i, 'rows (split across slides)', sl.rows.length, LIMITS.tableRows);
      (sl.rows || []).forEach((r, k) => r.forEach((c) => String(c).length > LIMITS.cell && over(i, `row ${k} cell chars`, String(c).length, LIMITS.cell)));
      if (sl.caption && sl.caption.length > LIMITS.caption) over(i, 'caption chars', sl.caption.length, LIMITS.caption);
    }
    if (sl.type === 'callout' && (sl.text || '').length > LIMITS.callout) over(i, 'text chars', sl.text.length, LIMITS.callout);
    if (sl.type === 'quote') {
      if ((sl.quote || '').length > LIMITS.quote) over(i, 'quote chars', sl.quote.length, LIMITS.quote);
      if ((sl.source || '').length > LIMITS.source) over(i, 'source chars', sl.source.length, LIMITS.source);
    }
  });
  if (bad.length) { console.error('deck.slides does not fit:\n  ' + bad.join('\n  ')); process.exit(1); }
}
if (deck.slides) checkSlides(deck.slides);

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = deck.author || '';
pres.title = deck.title;

const shadow = () => ({ type: 'outer', color: '9AA5B5', blur: 18, offset: 4, angle: 90, opacity: 0.35 });
const text = (slide, str, opts) =>
  slide.addText(str, Object.assign({ isTextBox: true, margin: 0, fontFace: T.font }, opts));

function pill(slide, label, x, y, w, h, fontSize, charSpacing) {
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill: { color: T.accent }, rectRadius: h / 2, line: { type: 'none' } });
  text(slide, label, { x, y, w, h, align: 'center', valign: 'middle', fontSize, bold: true, color: WHITE, charSpacing });
}

function timeChip(slide, time, x, y) {
  pill(slide, time, x, y, 0.35 + time.length * 0.085, 0.32, 11, 0.5);
}

function slideNum(slide, n) {
  text(slide, String(n), { x: 12.55, y: 6.95, w: 0.4, h: 0.3, align: 'right', fontSize: 10, color: T.muted });
}

let n = 0;

/* Title (omit with `deck.skipTitle: true`, e.g. to preview one slide on its own) */
if (!deck.skipTitle) {
  const s = pres.addSlide();
  s.background = { color: T.dark };
  if (deck.tag) pill(s, deck.tag.toUpperCase(), 0.9, 1.62, 0.6 + deck.tag.length * 0.13, 0.38, 11, 1.2);
  text(s, deck.title, { x: 0.9, y: 2.35, w: 9.6, h: 1.3, fontSize: 52, bold: true, color: WHITE });
  text(s, deck.subtitle || '', { x: 0.9, y: 3.72, w: 9.6, h: 0.5, fontSize: 19, color: T.onDark });
  text(s, deck.footer || '', { x: 0.9, y: 5.9, w: 9.6, h: 0.4, fontSize: 12, color: T.muted });
  if (deck.notes) s.addNotes(deck.notes);
  n++;
}

/* Report slides (condensed from a Markdown report) */
(deck.slides || []).forEach((sl) => {
  const s = pres.addSlide();
  const dark = sl.type === 'section';
  s.background = { color: dark ? T.dark : WHITE };
  if (sl.type === 'section') {
    text(s, sl.title, { x: 0.9, y: 2.7, w: 10.5, h: 1.2, fontSize: 40, bold: true, color: WHITE });
    if (sl.subtitle) text(s, sl.subtitle, { x: 0.9, y: 4.0, w: 10.5, h: 0.8, fontSize: 18, color: T.onDark });
  } else {
    if (sl.kicker) text(s, sl.kicker.toUpperCase(), { x: 0.9, y: 0.55, w: 10.9, h: 0.3, fontSize: 11, bold: true, color: T.accent, charSpacing: 1.2 });
    text(s, sl.title || '', { x: 0.9, y: 0.85, w: 11.4, h: 0.8, fontSize: 28, bold: true, color: T.dark, valign: 'top' });
    const top = 1.95;
    if (sl.type === 'bullets') {
      const items = (sl.bullets || []).map((b) => ({ text: b, options: { bullet: { indent: 18 }, breakLine: true, paraSpaceAfter: 10 } }));
      s.addText(items, { x: 0.9, y: top, w: 11.4, h: 4.6, margin: 0, fontFace: T.font, fontSize: 17, color: T.body, valign: 'top' });
      if (sl.note) text(s, sl.note, { x: 0.9, y: 6.55, w: 11.4, h: 0.4, fontSize: 12, italic: true, color: T.muted });
    } else if (sl.type === 'checklist') {
      const items = (sl.items || []).map((b) => ({ text: `\u2610  ${b}`, options: { breakLine: true, paraSpaceAfter: 10 } }));
      s.addText(items, { x: 0.9, y: top, w: 11.4, h: 4.6, margin: 0, fontFace: T.font, fontSize: 17, color: T.body, valign: 'top' });
    } else if (sl.type === 'callout') {
      const warn = sl.tone === 'warning';
      s.addShape(pres.ShapeType.rect, { x: 0.9, y: top, w: 11.4, h: 3.6, fill: { color: warn ? 'FCEFCC' : T.canvas }, line: { type: 'none' } });
      s.addShape(pres.ShapeType.rect, { x: 0.9, y: top, w: 0.1, h: 3.6, fill: { color: warn ? 'E0A100' : T.accent }, line: { type: 'none' } });
      text(s, sl.text, { x: 1.35, y: top + 0.3, w: 10.6, h: 3.0, fontSize: 20, color: T.dark, valign: 'top', lineSpacing: 30 });
    } else if (sl.type === 'quote') {
      s.addShape(pres.ShapeType.rect, { x: 0.9, y: top, w: 0.08, h: 2.6, fill: { color: T.accent }, line: { type: 'none' } });
      text(s, `\u201C${sl.quote}\u201D`, { x: 1.3, y: top, w: 10.6, h: 2.0, fontSize: 26, italic: true, color: T.darkMid, valign: 'top', lineSpacing: 36 });
      if (sl.source) text(s, sl.source, { x: 1.3, y: top + 2.2, w: 10.6, h: 0.4, fontSize: 14, bold: true, color: T.muted });
    } else if (sl.type === 'table') {
      const cols = sl.columns || [];
      const w = 11.4;
      const weights = cols.map((c, ci) => Math.max(String(c).length, ...(sl.rows || []).map((r) => String(r[ci] ?? '').length), 8));
      const sum = weights.reduce((a, b) => a + b, 0);
      const colW = weights.map((x) => (x / sum) * w);
      const head = cols.map((c) => ({ text: String(c), options: { bold: true, color: WHITE, fill: { color: T.dark }, fontSize: 14, fontFace: T.font } }));
      const body = (sl.rows || []).map((r, ri) => cols.map((_, ci) => {
        const v = String(r[ci] ?? '');
        const tint = CONF[v.trim().toLowerCase()];
        return { text: v, options: { fontSize: 14, fontFace: T.font, color: T.body, fill: { color: tint || (ri % 2 ? 'F8FAFC' : WHITE) } } };
      }));
      s.addTable([head, ...body], { x: 0.9, y: top, w, colW, rowH: 0.5, border: { type: 'solid', pt: 0.5, color: 'D5DBE5' }, margin: [0.06, 0.08, 0.06, 0.08], valign: 'middle' });
      if (sl.caption) text(s, sl.caption, { x: 0.9, y: 6.55, w: 11.4, h: 0.4, fontSize: 12, italic: true, color: T.muted });
    }
    slideNum(s, n + 1);
  }
  if (sl.notes) s.addNotes(sl.notes);
  n++;
});

/* Problem */
if (deck.problem) {
  const p = deck.problem;
  const s = pres.addSlide();
  s.background = { color: T.dark };
  text(s, p.headline, { x: 0.9, y: 1.25, w: 8.6, h: 0.9, fontSize: 38, bold: true, color: WHITE });
  text(s, p.body, { x: 0.9, y: 2.3, w: 8.2, h: 1.0, fontSize: 15, color: T.onDark, lineSpacing: 23 });
  (p.stats || []).slice(0, 3).forEach((st, i) => {
    const x = 0.9 + i * 4.0;
    text(s, st.value, { x, y: 4.3, w: 3.5, h: 1.0, fontSize: 56, bold: true, color: T.accent });
    text(s, st.label, { x, y: 5.4, w: 3.4, h: 0.9, fontSize: 13, color: T.onDark, lineSpacing: 18 });
  });
  slideNum(s, ++n);
}

/* Themes: one slide per theme (title + bullets + note count) — workshop ingest mode */
(deck.themes || []).forEach((th) => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  text(s, th.title, { x: 0.9, y: 0.7, w: 10.9, h: 0.7, fontSize: 30, bold: true, color: T.dark });
  let bulletY = 1.6;
  if (th.count != null) {
    pill(s, `${th.count} note${th.count === 1 ? '' : 's'}`, 0.9, 1.5, 1.1 + String(th.count).length * 0.12, 0.35, 11, 0.5);
    bulletY = 2.05;
  }
  const bulletsText = (th.notes || []).map((b) => `• ${b}`).join('\n');
  text(s, bulletsText, { x: 0.9, y: bulletY, w: 10.9, h: 4.8, fontSize: 14, color: T.body, lineSpacing: 22, valign: 'top' });
  slideNum(s, ++n);
});

/* Story: one slide per scene */
(deck.story || []).forEach((sc, i) => {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  const imageSide = sc.imageSide || (i % 2 === 0 ? 'right' : 'left');
  const imgW = 7.9, imgH = imgW / 1.6;
  const imgX = imageSide === 'right' ? 4.95 : 0.55;
  const txtX = imageSide === 'right' ? 0.6 : 9.0;
  const txtW = 3.85;

  const img = path.join(shotsDir, sc.image);
  if (!fs.existsSync(img)) { console.error(`missing screenshot: ${img}`); process.exit(1); }
  s.addImage({ path: img, x: imgX, y: (7.5 - imgH) / 2, w: imgW, h: imgH, shadow: shadow() });

  let y = 1.62;
  if (sc.time) timeChip(s, sc.time, txtX, y);
  y += 0.62;
  text(s, sc.headline, { x: txtX, y, w: txtW, h: 1.5, valign: 'top', fontSize: 27, bold: true, color: T.dark, lineSpacing: 31 });
  y += 1.62;
  text(s, sc.body, { x: txtX, y, w: txtW, h: 2.0, valign: 'top', fontSize: 13, color: T.body, lineSpacing: 20 });

  if (sc.quote) {
    s.addShape(pres.ShapeType.roundRect, { x: txtX, y: 5.28, w: txtW, h: 1.12, fill: { color: T.canvas }, rectRadius: 0.08, line: { type: 'none' } });
    text(s, sc.quote, { x: txtX + 0.18, y: 5.36, w: txtW - 0.36, h: 0.96, valign: 'middle', fontSize: 10.5, italic: true, color: T.darkMid, lineSpacing: 14 });
  }
  if (sc.notes) s.addNotes(sc.notes);
  slideNum(s, ++n);
});

/* Closing */
if (deck.closing) {
  const c = deck.closing;
  const s = pres.addSlide();
  s.background = { color: T.dark };
  text(s, c.headline, { x: 0.9, y: 1.25, w: 8.6, h: 0.8, fontSize: 38, bold: true, color: WHITE });
  text(s, c.body || '', { x: 0.9, y: 2.25, w: 8.4, h: 1.2, fontSize: 15, color: T.onDark, lineSpacing: 24 });
  (c.beats || []).slice(0, 3).forEach((b, i) => {
    const y = 3.95 + i * 0.78;
    s.addShape(pres.ShapeType.ellipse, { x: 0.92, y: y + 0.08, w: 0.16, h: 0.16, fill: { color: T.accent }, line: { type: 'none' } });
    text(s, b.label, { x: 1.35, y, w: 3.1, h: 0.35, fontSize: 14, bold: true, color: WHITE });
    text(s, b.detail, { x: 4.5, y, w: 7.4, h: 0.5, fontSize: 13, color: T.onDark });
  });
  if (c.next) text(s, `Next:  ${c.next}`, { x: 0.9, y: 6.5, w: 10.5, h: 0.4, fontSize: 13, bold: true, color: T.accent2 });
  slideNum(s, ++n);
}

pres.writeFile({ fileName: outPath }).then(() => console.log(`wrote ${outPath} (${n} slides)`));
