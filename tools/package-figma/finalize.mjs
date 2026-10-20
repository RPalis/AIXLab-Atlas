#!/usr/bin/env node
// Turns a build-flat.mjs output folder into the Figma Make handoff: one flat folder, every file
// under the size limit, plus package.json and a ready-to-paste prompt.
//
//   node finalize.mjs --dir out --frontend frontend --app my-app [--limit 900000]
//                     [--bundle-deps] [--inject static-backend.js,static-backend-hooks.js]
//
// 1. Flattens any subfolder (public/ files, fonts) to the root and rewrites references to them.
// 2. --inject adds <script> tags for the named files (already in --dir) ahead of the app entry.
// 3. Writes package.json (the frontend's "dependencies" only) unless --bundle-deps.
// 4. Writes MAKE_PROMPT.txt (paste into the Make chat; don't attach it).
// 5. Reports: file list with sizes, anything over the limit, subfolders left, minification check.
// Exits 1 if a file is over the limit, a subfolder is left, or a name collision blocked flattening.

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
const root = path.resolve(args.dir || 'figma-out');
const frontend = path.resolve(args.frontend || '.');
const app = args.app && args.app !== true ? args.app : path.basename(path.dirname(frontend));
const limit = Number(args.limit) || 900_000;
const bundleDeps = !!args['bundle-deps'];
const inject = args.inject && args.inject !== true ? String(args.inject).split(',').map((s) => s.trim()).filter(Boolean) : [];
const HARD_LIMIT = 1_000_000; // Figma Make rejects files at 1MB; --limit is the safety margin below it.

if (!fs.existsSync(path.join(root, 'index.html'))) { console.error(`No index.html in ${root}`); process.exit(1); }

// ---------- flatten ----------
const files = fs.readdirSync(root, { recursive: true, withFileTypes: true })
  .filter((e) => e.isFile()).map((e) => path.relative(root, path.join(e.parentPath, e.name)));
const nested = files.filter((f) => f.includes(path.sep));
const seen = new Map(files.filter((f) => !f.includes(path.sep)).map((f) => [f, f]));
const moved = [], collisions = [];
for (const rel of nested) {
  const name = path.basename(rel);
  if (name === '.DS_Store') { fs.rmSync(path.join(root, rel)); continue; }
  if (seen.has(name)) {
    const same = Buffer.compare(fs.readFileSync(path.join(root, rel)), fs.readFileSync(path.join(root, seen.get(name)))) === 0;
    if (same) { fs.rmSync(path.join(root, rel)); moved.push({ rel: rel.split(path.sep).join('/'), name }); continue; }
    collisions.push(`${rel} and ${seen.get(name)} are both named ${name}`);
    continue;
  }
  fs.renameSync(path.join(root, rel), path.join(root, name));
  seen.set(name, rel);
  moved.push({ rel: rel.split(path.sep).join('/'), name });
}
if (collisions.length) {
  console.error('Name collisions — rename one of each pair in the source, then rebuild:\n  ' + collisions.join('\n  '));
  process.exit(1);
}
for (const d of fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory())) {
  fs.rmSync(path.join(root, d.name), { recursive: true, force: true });
}

// ---------- rewrite references to moved files ----------
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const tail = `(?=$|["'\`)?#\\s<>,;])`;
const textFiles = fs.readdirSync(root).filter((n) => /\.(html?|m?js|css|json|svg)$/i.test(n));
let rewrites = 0;
for (const n of textFiles) {
  const f = path.join(root, n);
  let text = fs.readFileSync(f, 'utf8'), changed = false;
  for (const m of moved) {
    const r = esc(m.rel);
    for (const re of [
      new RegExp(`(?<![\\w.\\-/:])\\.?/${r}${tail}`, 'g'),
      new RegExp(`(?<=["'\`(=])${r}${tail}`, 'g'),
    ]) text = text.replace(re, () => { rewrites++; changed = true; return `./${m.name}`; });
  }
  if (changed) fs.writeFileSync(f, text);
}

// ---------- drop script tags for external packages ----------
// Vite adds <script src="react"> for every external import of the entry chunk; a bare package name
// isn't a URL, and the JS already imports those packages itself.
{
  const f = path.join(root, 'index.html');
  const html = fs.readFileSync(f, 'utf8');
  const cleaned = html.replace(/[ \t]*<script\b[^>]*\bsrc=["'](?![./]|https?:)[^"']*["'][^>]*><\/script>\n?/gi, '');
  if (cleaned !== html) fs.writeFileSync(f, cleaned);
}

// ---------- inject ----------
if (inject.length) {
  const f = path.join(root, 'index.html');
  let html = fs.readFileSync(f, 'utf8');
  const tags = inject.map((s) => `<script src="./${s}"></script>`).join('\n    ');
  const headEnd = html.search(/<\/head>/i);
  const firstScript = html.slice(0, headEnd < 0 ? undefined : headEnd).search(/<script[\s>]/i);
  const at = firstScript >= 0 ? firstScript : headEnd;
  if (at < 0) { console.error('index.html has no <head> to inject into'); process.exit(1); }
  fs.writeFileSync(f, html.slice(0, at) + tags + '\n    ' + html.slice(at));
}

// ---------- package.json ----------
const frontPkg = JSON.parse(fs.readFileSync(path.join(frontend, 'package.json'), 'utf8'));
if (!bundleDeps) {
  const out = { name: app, private: true, type: 'module', dependencies: frontPkg.dependencies || {} };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(out, null, 2) + '\n');
}

// ---------- prompt ----------
const deps = Object.keys(frontPkg.dependencies || {});
const hasBackend = fs.existsSync(path.join(root, 'backend-snapshot.json'));
const prompt = `Recreate the attached prototype in this Make file. Treat the attachments as the source of truth and keep its look, layout and behavior as-is; don't redesign or simplify it.

Files: index.html is the entry and loads the script and stylesheet it references. The other .js files are modules those scripts import by relative path, so keep their names. The code is intentionally unminified.
${bundleDeps ? 'Libraries are already bundled into the JS, so nothing needs installing.' : `Install the packages listed in package.json (${deps.slice(0, 8).join(', ')}${deps.length > 8 ? ', …' : ''}). The JS imports them by name and does not bundle them.`}${hasBackend ? '\nThere is no real backend. static-backend.js answers the app\'s API calls from backend-snapshot.json and saves changes in localStorage; load it before the app scripts.' : ''}
Put the files in the project as flat siblings and don't move or rename them. If something fails to run, fix the smallest thing that breaks it and tell me what you changed.
`;
fs.writeFileSync(path.join(root, 'MAKE_PROMPT.txt'), prompt);

// ---------- report ----------
const finalFiles = fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isFile() && e.name !== '.DS_Store');
const rows = finalFiles.map((e) => ({ name: e.name, size: fs.statSync(path.join(root, e.name)).size })).sort((a, b) => b.size - a.size);
const kb = (n) => (n / 1000).toFixed(0) + ' KB';
const over = rows.filter((r) => r.name !== 'MAKE_PROMPT.txt' && r.size > limit);
const subdirs = fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
const minified = rows.filter((r) => /\.m?js$/.test(r.name)).filter((r) => {
  const t = fs.readFileSync(path.join(root, r.name), 'utf8');
  return t.length > 20_000 && t.length / (t.split('\n').length) > 400;
}).map((r) => r.name);

console.log(`Figma Make folder: ${root}`);
console.log(`${rows.length} files, ${kb(rows.reduce((s, r) => s + r.size, 0))} total, largest ${rows[0].name} (${kb(rows[0].size)}), limit ${kb(limit)} (hard ${kb(HARD_LIMIT)})`);
for (const r of rows) console.log(`  ${r.size > limit ? '!!' : '  '} ${r.name.padEnd(36)} ${kb(r.size).padStart(8)}`);
if (moved.length) console.log(`Flattened ${moved.length} file(s) from subfolders, rewrote ${rewrites} reference(s)`);
if (inject.length) console.log(`Injected into index.html: ${inject.join(', ')}`);
if (subdirs.length) console.log(`!! subfolders remain: ${subdirs.join(', ')}`);
if (minified.length) console.log(`!! looks minified (very long lines): ${minified.join(', ')}`);
for (const r of over) {
  const ext = path.extname(r.name);
  console.log(`!! ${r.name} is over the limit: ` + (/\.m?js$/.test(ext)
    ? 'one module is bigger than the limit and can\'t be split — break that source file up, or move its data out'
    : r.name === 'backend-snapshot.json' ? 'trim the snapshot (fewer routes via backend/static-routes.txt, or smaller seed data)'
    : 'shrink or drop it'));
}
process.exit(over.length || subdirs.length ? 1 : 0);
