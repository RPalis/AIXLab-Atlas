// capture-screenshot.mjs — one real screenshot to one conventioned path.
//
//   node capture-screenshot.mjs --url <url> --out <path.png>
//     [--viewport 1600x1000] [--scale 2] [--wait <selector>] [--click <selector>]
//     [--fullpage]
//
// Requires playwright (npm i playwright; npx playwright install chromium if needed).
// The mechanical half of "capture the app/site at this state and save it here" —
// used by `showcase` (own running prototype, driven to a specific scene state) and
// `competitors` (a competitor's live site, its core-workflow screen). Driving the page
// to the right state before capture (open a modal, expand a row, log in) is the
// caller's job: pass --click for a single extra click, or drive the page yourself
// with Playwright directly and skip this script when the state needs more than that.
//
// Default viewport (1600x1000 @2x) is this suite's showcase convention: a 16:10 frame
// that lands uncropped in the deck builder's image slot. Override for other uses.
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

function parseArgs(argv) {
  const out = { viewport: '1600x1000', scale: '2' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      if (key === 'fullpage') { out[key] = true; continue; }
      out[key] = argv[++i];
    }
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
if (!args.url || !args.out) {
  console.error('usage: node capture-screenshot.mjs --url <url> --out <path.png> [--viewport 1600x1000] [--scale 2] [--wait <selector>] [--click <selector>] [--fullpage]');
  process.exit(1);
}
const [width, height] = args.viewport.split('x').map(Number);
const deviceScaleFactor = Number(args.scale);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor });
  page.on('dialog', (d) => d.accept().catch(() => {}));

  try {
    await page.goto(args.url, { waitUntil: 'networkidle', timeout: 30000 });
    if (args.wait) await page.waitForSelector(args.wait, { timeout: 15000 });
    if (args.click) {
      await page.click(args.click, { timeout: 15000 });
      await page.waitForLoadState('networkidle').catch(() => {});
    }
    fs.mkdirSync(path.dirname(args.out), { recursive: true });
    await page.screenshot({ path: args.out, fullPage: !!args.fullpage });
    console.log(`wrote ${args.out}`);
  } catch (err) {
    const errPath = path.join(path.dirname(args.out), 'ERROR_state.png');
    await page.screenshot({ path: errPath }).catch(() => {});
    console.error(`capture failed for ${args.url}: ${err.message}`);
    console.error(`error-state screenshot: ${errPath}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
