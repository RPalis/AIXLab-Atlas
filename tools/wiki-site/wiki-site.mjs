// wiki-site.mjs — build a static, read-only website from a project's wiki.
//
//   node wiki-site.mjs [repo-root] [--out wiki-site]
//
// Output opens from any static host or straight from disk (no server, no fetch):
// search uses a script-tag index, not a network call.
//
// What goes in (the publish filter — no judgment lives here):
//   - Every page under <docs>/notes/wiki/ EXCEPT README.md, any page with
//     `status: draft` or `publish: false` in its frontmatter.
//   - A file listed in sources.md only when its row has Publish = yes.
//   - A file listed in artifacts.md unless its row has Publish = no. A .md file becomes a page.
//     An .html file (a showcase reveal deck) is copied as it is and linked under Presentations;
//     its relative screenshots and styles come along. Any other file (.pptx, .docx, .pdf, .svg ...)
//     is copied and linked under Downloads. Decks are linked, never embedded.
//   - An image a page references is copied when it is inside the docs folder (never my-notes/, and
//     a source only when opted in). Otherwise the image is dropped.
//   - NEVER anything from notes/my-notes/, and never a source that is not opted in.
//   - In the published sources.md, rows with Publish != yes are removed, so a
//     private source's title and summary do not leak.
//   - A link to a file that is not published is shown as plain text, not a dead link.
//
// Requires the `marked` npm package, resolved from the current directory first
// (`npm i marked`), then from this file.
// Exit 0 on success, 1 on a build problem, 2 on bad usage.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv.splice(i, 2)[1] : null; };
const outName = flag('--out') || 'wiki-site';
const repo = path.resolve(argv[0] || process.cwd());

let marked;
try { marked = createRequire(path.join(process.cwd(), 'noop.js'))('marked').marked; }
catch { try { marked = createRequire(import.meta.url)('marked').marked; } catch { console.error('marked package not found. Run `npm i marked` in the current directory.'); process.exit(1); } }

const here = path.dirname(new URL(import.meta.url).pathname);
const found = spawnSync('bash', [path.join(here, '../find-docs-folder/find-docs-folder.sh'), repo], { encoding: 'utf8' });
if (found.status !== 0) { console.error('No docs folder found under ' + repo); process.exit(2); }
const docs = path.join(repo, found.stdout.trim());
const wikiDir = path.join(docs, 'notes', 'wiki');
if (!fs.existsSync(wikiDir)) { console.error('No wiki yet at ' + wikiDir); process.exit(2); }
const outDir = path.join(repo, outName);

const walk = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]) : [];
const frontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split('\n')) { const k = line.match(/^([\w-]+):\s*(.*)$/); if (k) meta[k[1]] = k[2].trim(); }
  return { meta, body: text.slice(m[0].length) };
};

// Parse the pipe table in a register: returns { header, rows[], lines } so rows can be filtered.
const parseRegister = (file) => {
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const h = lines.findIndex(l => /^\|.*\|\s*$/.test(l) && /\bID\b/i.test(l));
  if (h < 0 || !/^\|[\s:|-]+\|\s*$/.test(lines[h + 1] || '')) return null;
  const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const header = cells(lines[h]).map(c => c.toLowerCase());
  const rows = [];
  let i = h + 2;
  for (; i < lines.length && /^\|/.test(lines[i]); i++) rows.push({ line: i, cells: cells(lines[i]) });
  return { lines, header, rows, start: h, end: i };
};
const col = (reg, re) => reg.header.findIndex(c => re.test(c));
const linkPath = (cell) => { const m = cell.match(/\]\(([^)]+)\)/); return (m ? m[1] : cell).replace(/^<|>$/g, '').trim(); };

// 1. decide what is included
const included = new Map();   // absolute source path -> output path (relative to outDir)
const excluded = [];
const wikiOut = (abs) => path.relative(wikiDir, abs).replace(/\.md$/, '.html');
const registers = {};

for (const abs of walk(wikiDir)) {
  if (!abs.endsWith('.md') || path.basename(abs) === 'README.md') continue;
  const { meta } = frontmatter(fs.readFileSync(abs, 'utf8'));
  if (meta.status === 'draft' || meta.publish === 'false') { excluded.push(path.relative(repo, abs)); continue; }
  included.set(abs, wikiOut(abs));
}

const filteredRegisterText = {};
const extras = [];   // registered files that are not Markdown pages: decks (.html) and downloads
for (const [name, base, defaultYes] of [['sources.md', 'sources', false], ['artifacts.md', 'artifacts', true]]) {
  const regFile = path.join(wikiDir, name);
  const reg = parseRegister(regFile);
  if (!reg) continue;
  registers[name] = reg;
  const pc = col(reg, /^publish/), pathc = col(reg, /path|url/), titlec = col(reg, /^title/);
  const drop = new Set();
  for (const row of reg.rows) {
    const v = pc >= 0 ? (row.cells[pc] || '').toLowerCase() : '';
    const yes = v ? v.startsWith('y') : defaultYes;
    if (!yes) { drop.add(row.line); if (name === 'sources.md') excluded.push(`${name} row ${row.cells[0]}`); continue; }
    const p = pathc >= 0 ? linkPath(row.cells[pathc] || '') : '';
    if (!p || /^https?:/.test(p)) continue;
    let abs = path.resolve(wikiDir, p);
    if (!fs.existsSync(abs)) abs = path.resolve(path.join(docs, base), p);
    if (!fs.existsSync(abs)) abs = path.resolve(docs, p);
    const inside = (d) => abs.startsWith(path.join(docs, d) + path.sep);
    if (!fs.existsSync(abs) || !abs.startsWith(docs + path.sep) || inside('sources') !== (base === 'sources') || inside('notes/my-notes')) continue;
    const under = inside(base) ? path.relative(path.join(docs, base), abs) : path.relative(docs, abs);
    const isMd = abs.endsWith('.md');
    // A Markdown file becomes a page. Anything else is copied as it is, keeping its docs-relative path, so an .html deck's own relative links keep working.
    const out = isMd ? path.join(base, under).replace(/\.md$/, '.html') : path.join('files', path.relative(docs, abs));
    included.set(abs, out);
    if (!isMd) extras.push({ abs, out, title: (titlec >= 0 && row.cells[titlec]) || path.basename(abs), html: abs.endsWith('.html') });
  }
  filteredRegisterText[regFile] = reg.lines.filter((_, i) => !drop.has(i)).join('\n');
}

// 2. build
if (fs.existsSync(outDir)) {
  if (!fs.existsSync(path.join(outDir, '.wiki-site'))) { console.error(outDir + ' exists and was not built by wiki-site. Remove it or use --out.'); process.exit(1); }
  fs.rmSync(outDir, { recursive: true });
}
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, '.wiki-site'), 'built by tools/wiki-site\n');

const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const relTo = (fromOut, toOut) => path.relative(path.dirname(fromOut), toOut) || path.basename(toOut);
const pages = [];
// A file may be copied into the site only from inside the docs folder, never from my-notes/, and from sources/ only when its row opted in.
const allowed = (abs) => abs.startsWith(docs + path.sep) && !abs.startsWith(path.join(docs, 'notes', 'my-notes') + path.sep)
  && (!abs.startsWith(path.join(docs, 'sources') + path.sep) || included.has(abs));
const addAsset = (abs) => {
  if (!included.has(abs) && fs.existsSync(abs) && fs.statSync(abs).isFile() && allowed(abs)) included.set(abs, path.join('files', path.relative(docs, abs)));
  return included.get(abs);
};
// A deck (.html) names its screenshots and styles by relative path. Bring those along, in the same relative layout.
for (const [abs, out] of [...included]) {
  if (!abs.endsWith('.html') || !out.startsWith('files')) continue;
  for (const m of fs.readFileSync(abs, 'utf8').matchAll(/\b(?:src|href)="([^"#?:]+)"/g)) addAsset(path.resolve(path.dirname(abs), decodeURI(m[1])));
}

for (const [abs, out] of included) {
  if (!abs.endsWith('.md')) { fs.mkdirSync(path.dirname(path.join(outDir, out)), { recursive: true }); fs.copyFileSync(abs, path.join(outDir, out)); continue; }
  const raw = filteredRegisterText[abs] ?? fs.readFileSync(abs, 'utf8');
  const { body } = frontmatter(raw);
  const clean = body.replace(/<!-- wiki:begin -->[\s\S]*?<!-- wiki:end -->/g, '');
  const title = (clean.match(/^#\s+(.+)$/m) || [null, path.basename(abs, '.md')])[1].trim();
  let html = marked.parse(clean);
  html = html.replace(/<a href="([^"]*)"([^>]*)>([\s\S]*?)<\/a>/g, (all, href, rest, inner) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all;
    const [p, hash] = href.split('#');
    const target = path.resolve(path.dirname(abs), decodeURI(p));
    if (!p || !included.has(target)) return inner;
    return `<a href="${relTo(out, included.get(target))}${hash ? '#' + hash : ''}"${rest}>${inner}</a>`;
  });
  html = html.replace(/<img([^>]*?)src="([^"]*)"([^>]*)>/g, (all, a, src, b) => {
    if (/^(https?:|data:)/.test(src)) return all;
    const o = addAsset(path.resolve(path.dirname(abs), decodeURI(src)));
    return o ? `<img${a}src="${relTo(out, o)}"${b}>` : '';
  });
  pages.push({ abs, out, title, html, text: clean.replace(/[#*`|>\[\]()_-]+/g, ' ').replace(/\s+/g, ' ').slice(0, 4000) });
}

pages.sort((a, b) => (a.out === 'index.html' ? -1 : b.out === 'index.html' ? 1 : a.out.localeCompare(b.out)));
const hasConstellation = fs.existsSync(path.join(wikiDir, 'constellation.html'));
if (hasConstellation) fs.copyFileSync(path.join(wikiDir, 'constellation.html'), path.join(outDir, 'constellation.html'));

const css = `:root{--bg-page:#fff;--text-primary:#1a1d21;--text-muted:#4b5563;--surface:#f5f6f8;--border:#d5d9df;--action:#0b6b73}
@media (prefers-color-scheme:dark){:root{--bg-page:#14171a;--text-primary:#e8eaed;--text-muted:#a3aab4;--surface:#1d2126;--border:#343a42;--action:#5fc4cc}}
*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,sans-serif;background:var(--bg-page);color:var(--text-primary);display:flex;min-height:100vh}
nav{width:260px;flex:none;background:var(--surface);border-right:1px solid var(--border);padding:16px;overflow:auto;position:sticky;top:0;height:100vh}
nav .nav-h{margin:14px 0 4px;font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--text-muted)}
nav a{display:block;padding:4px 0;color:var(--text-primary);text-decoration:none}nav a:hover,nav a[aria-current]{color:var(--action)}
nav input{width:100%;padding:8px;margin-bottom:12px;border:1px solid var(--border);border-radius:6px;background:var(--bg-page);color:inherit}
main{max-width:820px;padding:24px 32px;flex:1;min-width:0}a{color:var(--action)}
table{border-collapse:collapse;display:block;overflow:auto}th,td{border:1px solid var(--border);padding:6px 10px;text-align:left}
pre,code{background:var(--surface);border-radius:4px}pre{padding:12px;overflow:auto}code{padding:1px 4px}blockquote{margin-left:0;padding-left:12px;border-left:3px solid var(--border);color:var(--text-muted)}
@media(max-width:700px){body{display:block}nav{width:auto;height:auto;position:static}main{padding:16px}}`;
fs.writeFileSync(path.join(outDir, 'style.css'), css);

const searchData = pages.map(p => ({ t: p.title, u: p.out, x: p.text })).concat(extras.map(e => ({ t: e.title, u: e.out, x: '' })));
fs.writeFileSync(path.join(outDir, 'search-index.js'), 'window.WIKI_SEARCH=' + JSON.stringify(searchData) + ';');
fs.writeFileSync(path.join(outDir, 'search.js'), `(function(){var i=document.getElementById('q'),r=document.getElementById('hits'),root=document.body.getAttribute('data-root');
if(!i)return;i.addEventListener('input',function(){var q=i.value.trim().toLowerCase();r.innerHTML='';if(q.length<2)return;
(window.WIKI_SEARCH||[]).filter(function(p){return (p.t+' '+p.x).toLowerCase().indexOf(q)>-1}).slice(0,12).forEach(function(p){var a=document.createElement('a');a.href=root+p.u;a.textContent=p.t;r.appendChild(a)})})})();`);

for (const p of pages) {
  const root = path.relative(path.dirname(p.out), '.') || '.';
  const rootSlash = root === '.' ? '' : root + '/';
  const decks = extras.filter(e => e.html), files = extras.filter(e => !e.html);
  const nav = pages.map(n => `<a href="${rootSlash}${n.out}"${n.out === p.out ? ' aria-current="page"' : ''}>${esc(n.title)}</a>`).join('')
    + (decks.length ? '<p class="nav-h">Presentations</p>' + decks.map(e => `<a href="${rootSlash}${e.out}">${esc(e.title)}</a>`).join('') : '')
    + (files.length ? '<p class="nav-h">Downloads</p>' + files.map(e => `<a href="${rootSlash}${e.out}" download>${esc(e.title)}</a>`).join('') : '')
    + (hasConstellation ? `<a href="${rootSlash}constellation.html">Graph view</a>` : '');
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title><link rel="stylesheet" href="${rootSlash}style.css"></head>
<body data-root="${rootSlash}"><nav><input id="q" type="search" placeholder="Search" aria-label="Search the wiki"><div id="hits"></div>${nav}</nav><main>${p.html}</main>
<script src="${rootSlash}search-index.js"></script><script src="${rootSlash}search.js"></script></body></html>`;
  fs.mkdirSync(path.dirname(path.join(outDir, p.out)), { recursive: true });
  fs.writeFileSync(path.join(outDir, p.out), page);
}

console.log(`wiki-site: ${pages.length} pages -> ${path.relative(repo, outDir)}/`);
if (excluded.length) console.log('left out:\n  ' + excluded.join('\n  '));
