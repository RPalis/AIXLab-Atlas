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
// `deck.problem` and `deck.closing` (stat/beat slides) are shared by both shapes.
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

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

/* Title */
{
  const s = pres.addSlide();
  s.background = { color: T.dark };
  if (deck.tag) pill(s, deck.tag.toUpperCase(), 0.9, 1.62, 0.6 + deck.tag.length * 0.13, 0.38, 11, 1.2);
  text(s, deck.title, { x: 0.9, y: 2.35, w: 9.6, h: 1.3, fontSize: 52, bold: true, color: WHITE });
  text(s, deck.subtitle || '', { x: 0.9, y: 3.72, w: 9.6, h: 0.5, fontSize: 19, color: T.onDark });
  text(s, deck.footer || '', { x: 0.9, y: 5.9, w: 9.6, h: 0.4, fontSize: 12, color: T.muted });
  if (deck.notes) s.addNotes(deck.notes);
  n++;
}

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
