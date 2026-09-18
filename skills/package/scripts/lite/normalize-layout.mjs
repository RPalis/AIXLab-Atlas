#!/usr/bin/env node
// Lays a static build out as index.html at the root, everything else under assets/.
//
//   node normalize-layout.mjs --dir production [--inject static-backend.js,static-backend-hooks.js]
//
// Only files that must live at the root to work (favicon.ico, robots.txt, manifests, host config,
// 404 pages) stay beside index.html. Everything else — bundles, public/ files, embedded sub-apps
// like storybook/ — moves into assets/, and references to the moved names are rewritten:
//   index.html, manifests   every form: /name  ./name  name
//   assets/*.js             every form, except other .js/.css names (those are module-relative
//                           imports between chunks, which moved together and still resolve)
//   assets/*.css            absolute form only (url() is stylesheet-relative and moved with it)
// Files inside moved directories are left alone; their internal relative links still work.
// --inject adds <script> tags for the named files (expected in assets/) ahead of the app bundle.

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
const root = path.resolve(args.dir || 'production');
const assets = path.join(root, 'assets');
const inject = args.inject && args.inject !== true ? String(args.inject).split(',').map((s) => s.trim()).filter(Boolean) : [];

const KEEP = new Set([
  'index.html', 'favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json', 'manifest.webmanifest', 'site.webmanifest',
  'browserconfig.xml', '404.html', '200.html', '.htaccess', 'web.config', '_redirects', '_headers', 'staticwebapp.config.json',
  'vercel.json', 'netlify.toml', 'CNAME', '.nojekyll', 'serve.command', 'serve.bat', 'serve.ps1'
]);
const keepAtRoot = (name) => KEEP.has(name) || /^apple-touch-icon.*\.png$/.test(name);

if (!fs.existsSync(path.join(root, 'index.html'))) { console.error(`No index.html in ${root}`); process.exit(1); }
fs.mkdirSync(assets, { recursive: true });

// ---------- move ----------
const moved = [];
for (const name of fs.readdirSync(root)) {
  if (name === 'assets' || keepAtRoot(name) || name === '.DS_Store') continue;
  const from = path.join(root, name), to = path.join(assets, name);
  if (fs.existsSync(to)) { console.error(`assets/${name} already exists — cannot move root ${name} over it`); process.exit(1); }
  fs.renameSync(from, to);
  moved.push({ name, dir: fs.statSync(to).isDirectory() });
}

// ---------- rewrite ----------
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// What may follow a reference: end of string/attribute, a path separator (dirs only), or a query/fragment.
const tailFile = `(?=$|["'\`)?#\\s<>,;])`;
const tailDir = `(?=/)`;
function rules(entry, forms) {
  const n = esc(entry.name), tail = entry.dir ? tailDir : tailFile;
  const out = [];
  if (forms.includes('abs')) out.push([new RegExp(`(?<![\\w.\\-/:])/${n}${tail}`, 'g'), `/assets/${entry.name}`]);
  if (forms.includes('rel')) out.push([new RegExp(`(?<![\\w.\\-/:])\\./${n}${tail}`, 'g'), `./assets/${entry.name}`]);
  if (forms.includes('bare')) out.push([new RegExp(`(?<=["'\`(=])${n}${tail}`, 'g'), `assets/${entry.name}`]);
  return out;
}
const isText = (f) => /\.(html?|js|mjs|css|json|webmanifest|svg|xml)$/i.test(f);
const rewritten = new Map();
function rewrite(file, forms, exclude = () => false) {
  let text = fs.readFileSync(file, 'utf8'), count = 0;
  for (const entry of moved) {
    if (exclude(entry)) continue;
    for (const [re, to] of rules(entry, forms)) text = text.replace(re, () => { count++; return to; });
  }
  if (count) { fs.writeFileSync(file, text); rewritten.set(path.relative(root, file), count); }
}
const jsExclude = (e) => !e.dir && /\.(m?js|css)$/i.test(e.name);
for (const name of fs.readdirSync(root)) {
  const f = path.join(root, name);
  if (fs.statSync(f).isFile() && /\.(html?|json|webmanifest)$/i.test(name)) rewrite(f, ['abs', 'rel', 'bare']);
}
for (const name of fs.readdirSync(assets)) {
  const f = path.join(assets, name);
  if (!fs.statSync(f).isFile() || !isText(name)) continue;
  if (/\.m?js$/i.test(name)) rewrite(f, ['abs', 'rel', 'bare'], jsExclude);
  else if (/\.html?$/i.test(name)) rewrite(f, ['abs']);
  else rewrite(f, ['abs']);
}

// ---------- inject ----------
const indexFile = path.join(root, 'index.html');
if (inject.length) {
  let html = fs.readFileSync(indexFile, 'utf8');
  const base = /=["']\/assets\//.test(html) ? '/assets/' : './assets/';
  const tags = inject.map((f) => `<script src="${base}${f}"></script>`).join('\n    ');
  const headEnd = html.search(/<\/head>/i);
  const firstScript = html.slice(0, headEnd < 0 ? undefined : headEnd).search(/<script[\s>]/i);
  const at = firstScript >= 0 ? firstScript : headEnd;
  if (at < 0) { console.error('index.html has no <head> to inject into'); process.exit(1); }
  html = html.slice(0, at) + tags + '\n    ' + html.slice(at);
  fs.writeFileSync(indexFile, html);
}

// ---------- report ----------
const rootNow = fs.readdirSync(root).filter((n) => n !== '.DS_Store');
console.log(`Root: ${rootNow.join('  ')}`);
console.log(`Moved to assets/: ${moved.length ? moved.map((m) => m.name + (m.dir ? '/' : '')).join('  ') : '(nothing)'}`);
if (rewritten.size) console.log('Rewrote references: ' + [...rewritten].map(([f, c]) => `${f} (${c})`).join(', '));
if (inject.length) console.log(`Injected into index.html: ${inject.join(', ')}`);

// Leftovers the rules deliberately don't touch: a moved directory referenced without a trailing
// slash (could be a SPA route, could be a link that now 404s) — for a human to check.
const suspects = [];
const scanFiles = [indexFile, ...fs.readdirSync(assets).map((n) => path.join(assets, n)).filter((f) => fs.statSync(f).isFile() && /\.(m?js|html?)$/i.test(f))];
for (const f of scanFiles) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of moved.filter((e) => e.dir)) {
    const re = new RegExp(`["'\`]\\.?/?${esc(m.name)}["'\`]`, 'g');
    const hits = (text.match(re) || []).length;
    if (hits) suspects.push(`${path.relative(root, f)}: "${m.name}" ×${hits} without a trailing slash — a route, or a link that now needs assets/${m.name}/?`);
  }
}
if (suspects.length) console.log('Check by hand:\n  ' + suspects.join('\n  '));
