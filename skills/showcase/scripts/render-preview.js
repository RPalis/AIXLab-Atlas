// Overflow check for build-deck.js content slides, without opening PowerPoint.
//
//   node render-preview.js <deck.json> <screenshots-dir> [out-dir]
//
// Renders a geometry-faithful HTML replica of each story slide (same inch
// coordinates as build-deck.js, at 96 px/in, same font) with Playwright and reports
// any headline / body / quote that overflows its box. Also writes one PNG per slide
// to out-dir (default: ./render next to deck.json) for a visual once-over.
// Requires playwright (npm i playwright) with Chromium installed. If headless Chromium
// can't find the theme font it falls back to a serif, which is wider — so a pass here
// is conservative, not optimistic.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const [, , deckPath, shotsDir, outArg] = process.argv;
if (!deckPath || !shotsDir) {
  console.error('usage: node render-preview.js <deck.json> <screenshots-dir> [out-dir]');
  process.exit(1);
}
const deck = JSON.parse(fs.readFileSync(deckPath, 'utf8'));
const outDir = outArg || path.join(path.dirname(path.resolve(deckPath)), 'render');
const T = Object.assign({ dark: '152642', darkMid: '2B3E5C', accent: 'F15840', body: '4A5568', muted: '8A94A6', canvas: 'F5F7FA', font: 'Calibri' }, deck.theme || {});
const IN = 96;
const firstStoryNum = 1 + (deck.problem ? 1 : 0) + 1;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const box = (x, y, w, h, style, content) =>
  `<div style="position:absolute;left:${x * IN}px;top:${y * IN}px;width:${w * IN}px;height:${h * IN}px;${style}">${content}</div>`;

function slideHtml(sc, i, num) {
  const imageSide = sc.imageSide || (i % 2 === 0 ? 'right' : 'left');
  const imgW = 7.9, imgH = imgW / 1.6;
  const imgX = imageSide === 'right' ? 4.95 : 0.55;
  const txtX = imageSide === 'right' ? 0.6 : 9.0;
  const txtW = 3.85;
  const time = sc.time || '';
  const chipW = 0.35 + time.length * 0.085;
  return `
  <div class="slide" data-n="${num}">
    <img src="file://${path.resolve(shotsDir, sc.image)}" style="position:absolute;left:${imgX * IN}px;top:${((7.5 - imgH) / 2) * IN}px;width:${imgW * IN}px;height:${imgH * IN}px;box-shadow:0 4px 18px rgba(154,165,181,.55)">
    ${time ? box(txtX, 1.62, chipW, 0.32, `background:#${T.accent};border-radius:${0.16 * IN}px;display:flex;align-items:center;justify-content:center;`, `<span style="font:bold 11pt ${T.font};color:#fff;letter-spacing:.5px">${esc(time)}</span>`) : ''}
    ${box(txtX, 2.24, txtW, 1.5, `font:bold 27pt ${T.font};color:#${T.dark};line-height:31pt;`, `<span class="fit" data-part="headline">${esc(sc.headline)}</span>`)}
    ${box(txtX, 3.86, txtW, 2.0, `font:13pt ${T.font};color:#${T.body};line-height:20pt;`, `<span class="fit" data-part="body">${esc(sc.body)}</span>`)}
    ${sc.quote ? box(txtX, 5.28, txtW, 1.12, `background:#${T.canvas};border-radius:${0.08 * IN}px;`, '') : ''}
    ${sc.quote ? box(txtX + 0.18, 5.36, txtW - 0.36, 0.96, `font:italic 10.5pt ${T.font};color:#${T.darkMid};line-height:14pt;display:flex;align-items:center;`, `<span class="fit" data-part="quote">${esc(sc.quote)}</span>`) : ''}
    ${box(12.55, 6.95, 0.4, 0.3, `font:10pt ${T.font};color:#${T.muted};text-align:right;`, String(num))}
  </div>`;
}

const html = `<html><head><meta charset="utf-8"><style>
  body { margin:0; background:#888; }
  .slide { position:relative; width:${13.33 * IN}px; height:${7.5 * IN}px; background:#fff; overflow:hidden; margin:0 0 24px 0; }
</style></head><body>${deck.story.map((sc, i) => slideHtml(sc, i, firstStoryNum + i)).join('\n')}</body></html>`;

fs.mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(outDir, 'preview.html');
fs.writeFileSync(htmlPath, html);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1.5 });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  const overflows = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((sl) => {
      sl.querySelectorAll('.fit').forEach((span) => {
        const over = span.getBoundingClientRect().height - span.parentElement.getBoundingClientRect().height;
        if (over > 2) out.push({ slide: sl.dataset.n, part: span.dataset.part, overBy: Math.round(over) + 'px', text: span.textContent.slice(0, 50) });
      });
    });
    return out;
  });

  const slides = await page.locator('.slide').all();
  for (let i = 0; i < slides.length; i++) {
    await slides[i].screenshot({ path: path.join(outDir, `slide-${String(firstStoryNum + i).padStart(2, '0')}.png`) });
  }
  await browser.close();

  console.log(`rendered ${slides.length} story slides to ${outDir}`);
  if (overflows.length) {
    console.log('OVERFLOW — shorten these before building:');
    overflows.forEach((o) => console.log(`  slide ${o.slide} ${o.part} over by ${o.overBy}: "${o.text}…"`));
    process.exit(2);
  }
  console.log('no overflow');
})();
