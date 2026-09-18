// Screenshot capture for a showcase deck. Copy this next to deck.json, fill in
// the scene steps, and run: node capture.js
//
// Conventions build-deck.js depends on:
//   - 1600x1000 viewport at 2x = a 16:10 frame, the exact aspect of the deck's
//     image slot, so nothing gets letterboxed or cropped.
//   - one PNG per scene, named NN_slug.png in story order.
//   - drive the prototype to the *state* the slide talks about (modal open,
//     row expanded, scrolled to the relevant panel) before each shot; a slide
//     whose copy mentions something not visible in its screenshot is a bug.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = process.env.BASE || 'http://localhost:5173';
const OUT = process.argv[2] || path.join(process.cwd(), 'showcase_screenshots');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.on('dialog', (d) => d.accept()); // never let a confirm() stall the run

  const shot = async (name) => {
    await page.waitForTimeout(600); // let transitions settle
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log(`captured ${name}`);
  };
  const click = async (text, tag = 'button') => {
    const el = page.locator(`${tag}:has-text("${text}")`).first();
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await el.click({ timeout: 8000 });
    await page.waitForTimeout(900);
  };
  const scrollTo = (top) => page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), top);

  try {
    // ── Scene 1 ──
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await shot('01_landing');

    // ── Scene 2: a state, not just a page ──
    // await scrollTo(420);
    // await shot('02_the_list');

    // ── Scene 3: a modal ──
    // await page.locator('tr:has-text("Some row")').first().locator('button:has-text("Why?")').click();
    // await shot('03_why_modal');
    // await click('Dismiss');

    // ── Scene 4: another route ──
    // await page.goto(`${BASE}/some/route`, { waitUntil: 'networkidle' });
    // await shot('04_route');

    await browser.close();
  } catch (err) {
    console.error('FAILED:', err.message);
    await page.screenshot({ path: path.join(OUT, 'ERROR_state.png') }).catch(() => {});
    await browser.close();
    process.exit(1);
  }
})();
