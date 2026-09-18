#!/usr/bin/env node
// Captures the running backend's GET responses into a JSON snapshot that static-backend.js serves
// when the packaged app runs without a backend process.
//
//   node snapshot-backend.mjs --backend-url http://localhost:3005 --out production/assets/backend-snapshot.json \
//        [--backend-dir backend] [--frontend frontend] [--app name] [--routes backend/static-routes.txt] [--prefix /api]
//
// Routes come from three places, merged: the backend source (Express/Koa/Fastify/Hono-style
// `app.get('/x')`, NestJS decorators, Flask/FastAPI decorators), the frontend's own fetch()
// literals, and an OpenAPI document if the backend serves one. `:id`-style params are expanded
// with ids taken from the parent collection's response. Anything the heuristics miss can be
// listed one-per-line in --routes (e.g. `GET /api/schedule?from=2025-01-01`).

import fs from 'node:fs';
import path from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, [])
);
const backendUrl = String(args['backend-url'] || 'http://localhost:3001').replace(/\/+$/, '');
const backendDir = args['backend-dir'] ? path.resolve(args['backend-dir']) : null;
const frontendDir = args.frontend ? path.resolve(args.frontend) : null;
const outFile = path.resolve(args.out || 'backend-snapshot.json');
const maxItems = Number(args['max-items'] || 300);
const TIMEOUT_MS = 20000;

// ---------- source scanning ----------
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.angular', 'coverage', 'storybook-static', '.git', 'public']);
function walk(dir, exts, out = []) {
  if (!dir || !fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), exts, out); }
    else if (exts.includes(path.extname(e.name))) out.push(path.join(dir, e.name));
  }
  return out;
}
const normalizePath = (p) =>
  ('/' + p.trim()).replace(/\/{2,}/g, '/').replace(/\{(\w+)\}/g, ':$1').replace(/<(?:\w+:)?(\w+)>/g, ':$1').replace(/\(\?[^)]*\)|\?$/g, '').replace(/\/+$/, '') || '/';
const isRoutePath = (p) => p.startsWith('/') && !/[\s*]/.test(p) && !/\.(png|jpe?g|gif|svg|ico|css|js|mjs|map|html|woff2?|ttf|txt|md)$/i.test(p);
const shape = (p) => p.replace(/:\w+/g, ':p');

function scanBackend(dir) {
  const routes = [];
  if (!dir) return routes;
  const files = walk(dir, ['.ts', '.js', '.mjs', '.cjs', '.py']);
  const perFile = new Map(); // file -> [{receiver, method, path}]
  const mounts = [];         // {file, prefix, ident}
  const routerDefs = new Map(); // file -> Set(receiver idents created with Router())
  const imports = new Map();  // file -> Map(ident -> resolved file)

  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const found = [];
    if (file.endsWith('.py')) {
      for (const m of src.matchAll(/@\w+\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g)) found.push({ receiver: '', method: m[1].toUpperCase(), path: m[2] });
      for (const m of src.matchAll(/@\w+\.route\(\s*['"]([^'"]+)['"]([^)]*)\)/g)) {
        const methods = (m[2].match(/methods\s*=\s*\[([^\]]*)\]/) || [, 'GET'])[1].match(/[A-Z]+/g) || ['GET'];
        for (const method of methods) found.push({ receiver: '', method, path: m[1] });
      }
    } else {
      for (const m of src.matchAll(/\b([A-Za-z_$][\w$]*)\.(get|post|put|patch|delete|all)\s*\(\s*(['"`])([^'"`\n]+)\3/g)) {
        if (m[4].startsWith('/')) found.push({ receiver: m[1], method: m[2] === 'all' ? 'ANY' : m[2].toUpperCase(), path: m[4] });
      }
      // NestJS: @Controller('x') + @Get(':id')
      const ctrl = src.match(/@Controller\(\s*(?:['"]([^'"]*)['"])?\s*\)/);
      if (ctrl) {
        for (const m of src.matchAll(/@(Get|Post|Put|Patch|Delete|All)\(\s*(?:['"]([^'"]*)['"])?\s*\)/g)) {
          found.push({ receiver: '', method: m[1] === 'All' ? 'ANY' : m[1].toUpperCase(), path: '/' + [ctrl[1] || '', m[2] || ''].filter(Boolean).join('/') });
        }
        const gp = src.match(/setGlobalPrefix\(\s*['"]([^'"]+)['"]/);
        if (gp) found.forEach((r) => { r.path = '/' + gp[1] + r.path; });
      }
      for (const m of src.matchAll(/\.use\s*\(\s*(['"`])([^'"`\n]+)\1\s*,\s*([A-Za-z_$][\w$]*)\s*[,)]/g)) mounts.push({ file, prefix: m[2], ident: m[3] });
      const defs = new Set();
      for (const m of src.matchAll(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:express\.)?Router\(/g)) defs.add(m[1]);
      routerDefs.set(file, defs);
      const imp = new Map();
      for (const m of src.matchAll(/import\s+(?:\*\s+as\s+)?([A-Za-z_$][\w$]*)\s+from\s+['"](\.[^'"]+)['"]|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*require\(\s*['"](\.[^'"]+)['"]\s*\)/g)) {
        const ident = m[1] || m[3], spec = m[2] || m[4];
        const base = path.resolve(path.dirname(file), spec).replace(/\.js$/, '');
        const target = ['', '.ts', '.js', '.mjs', '.cjs', '/index.ts', '/index.js'].map((s) => base + s).find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
        if (target) imp.set(ident, target);
      }
      imports.set(file, imp);
    }
    perFile.set(file, found);
  }
  // Apply router mount prefixes: same-file `app.use('/p', r)` or `app.use('/p', importedRouter)`.
  const prefixFor = (file, receiver, depth = 0) => {
    if (depth > 3) return '';
    for (const m of mounts) {
      if (m.file === file && m.ident === receiver && (routerDefs.get(file) || new Set()).has(receiver)) return prefixFor(file, 'app', depth + 1) + m.prefix;
      const target = (imports.get(m.file) || new Map()).get(m.ident);
      if (target === file && !(routerDefs.get(m.file) || new Set()).has(receiver)) return prefixFor(m.file, m.ident, depth + 1) + m.prefix;
    }
    return '';
  };
  for (const [file, found] of perFile) {
    for (const r of found) {
      const prefix = r.receiver ? prefixFor(file, r.receiver) : '';
      routes.push({ method: r.method, path: normalizePath(prefix + r.path), source: 'backend' });
    }
  }
  return routes.filter((r) => isRoutePath(r.path));
}

function scanFrontend(dir, backendPrefix) {
  const routes = [];
  if (!dir) return routes;
  const src = path.join(dir, 'src');
  for (const file of walk(fs.existsSync(src) ? src : dir, ['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'])) {
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
      let lit = m[2];
      if (!lit.includes('/')) continue;
      const templateStart = /^\$\{[^}]*\}/.test(lit);
      lit = lit.replace(/^\$\{[^}]*\}/, '').replace(/\$\{[^}]*\}/g, ':p').replace(/^https?:\/\/[^/]+/, '');
      if (!lit.startsWith('/') || !isRoutePath(lit) || /[^\w\-./:%]/.test(lit)) continue;
      if (!templateStart && !(lit.startsWith(backendPrefix + '/') || lit.startsWith('/api/'))) continue;
      if (lit === backendPrefix || lit === '/api') continue; // `${API_BASE}/api` is the base, not a route
      if (templateStart && backendPrefix && !lit.startsWith(backendPrefix + '/')) lit = backendPrefix + lit;
      const after = text.slice(m.index, m.index + 400);
      const method = (after.match(/method\s*:\s*['"`](GET|POST|PUT|PATCH|DELETE)['"`]/i) || [, 'GET'])[1].toUpperCase();
      routes.push({ method, path: normalizePath(lit), source: 'frontend' });
    }
  }
  return routes;
}

async function scanOpenApi() {
  for (const p of ['/openapi.json', '/api/openapi.json', '/swagger.json', '/api-docs', '/api/docs.json']) {
    try {
      const res = await fetch(backendUrl + p, { signal: AbortSignal.timeout(5000) });
      if (!res.ok || !/json/.test(res.headers.get('content-type') || '')) continue;
      const doc = await res.json();
      if (!doc.paths) continue;
      const base = (doc.servers && doc.servers[0] && doc.servers[0].url || doc.basePath || '').replace(/^https?:\/\/[^/]+/, '');
      const routes = [];
      for (const [p2, ops] of Object.entries(doc.paths)) for (const method of Object.keys(ops)) {
        if (/^(get|post|put|patch|delete)$/i.test(method)) routes.push({ method: method.toUpperCase(), path: normalizePath(base + p2), source: 'openapi' });
      }
      return routes;
    } catch { /* not served */ }
  }
  return [];
}

function readRoutesFile(file) {
  if (!file || !fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const [a, b] = l.split(/\s+/);
    return b ? { method: a.toUpperCase(), path: b, source: 'routes-file' } : { method: 'GET', path: a, source: 'routes-file' };
  });
}

function commonPrefix(routes) {
  const segLists = routes.map((r) => r.path.split('?')[0].split('/').filter(Boolean));
  if (!segLists.length) return '';
  const out = [];
  for (let i = 0; ; i++) {
    const seg = segLists[0][i];
    if (seg === undefined || seg.startsWith(':') || !segLists.every((s) => s[i] === seg)) break;
    out.push(seg);
  }
  return out.length ? '/' + out.join('/') : '';
}

// ---------- crawl ----------
const captured = {};
const tried = new Set();
const failures = [], skipped = [], unexpanded = [];

async function capture(fullPath) {
  if (tried.has(fullPath)) return captured[fullPath];
  tried.add(fullPath);
  let res;
  try {
    res = await fetch(backendUrl + fullPath, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) { failures.push(`${fullPath} (${err.name === 'TimeoutError' ? 'timeout' : err.message})`); return undefined; }
  if (!res.ok) { failures.push(`${fullPath} (HTTP ${res.status})`); return undefined; }
  const ct = res.headers.get('content-type') || '';
  if (!/json/i.test(ct)) { skipped.push(`${fullPath} (${ct.split(';')[0] || 'no content-type'})`); return undefined; }
  try { captured[fullPath] = await res.json(); } catch (err) { failures.push(`${fullPath} (bad JSON)`); return undefined; }
  return captured[fullPath];
}
const ID_KEYS = ['id', '_id', 'uuid', 'slug', 'key'];
function idsIn(value) {
  const lists = Array.isArray(value) ? [value] : value && typeof value === 'object' ? Object.values(value).filter(Array.isArray) : [];
  for (const list of lists) {
    const ids = list.map((x) => x && typeof x === 'object' ? ID_KEYS.map((k) => x[k]).find((v) => v !== undefined) : undefined).filter((v) => v !== undefined);
    if (ids.length) return ids.map(String);
  }
  return [];
}
async function expand(pattern) {
  const segs = pattern.split('/').filter(Boolean);
  const i = segs.findIndex((s) => s.startsWith(':'));
  if (i < 0) { await capture(pattern); return; }
  const parent = '/' + segs.slice(0, i).join('/');
  let ids = idsIn(captured[parent] ?? (await capture(parent)));
  if (!ids.length) { unexpanded.push(pattern + '  (no ids found at ' + parent + ')'); return; }
  if (ids.length > maxItems) { unexpanded.push(pattern + '  (truncated to first ' + maxItems + ' of ' + ids.length + ' ids)'); ids = ids.slice(0, maxItems); }
  for (const id of ids) await expand('/' + [...segs.slice(0, i), encodeURIComponent(id), ...segs.slice(i + 1)].join('/'));
}

// ---------- main ----------
const backendRoutes = scanBackend(backendDir);
let prefix = args.prefix !== undefined ? String(args.prefix) : commonPrefix(backendRoutes);
const openapiRoutes = await scanOpenApi();
const frontendRoutes = scanFrontend(frontendDir, prefix);
const fileRoutes = readRoutesFile(args.routes);
if (args.prefix === undefined && !backendRoutes.length) prefix = commonPrefix([...openapiRoutes, ...frontendRoutes, ...fileRoutes]);
prefix = prefix.replace(/\/$/, '');

const seen = new Set();
const routes = [];
for (const r of [...backendRoutes, ...openapiRoutes, ...fileRoutes, ...frontendRoutes]) {
  const key = r.method + ' ' + shape(r.path);
  if (seen.has(key)) continue;
  // The frontend scan only fills gaps: skip its routes if any source already has the same shape.
  if (r.source === 'frontend' && [...seen].some((k) => k.endsWith(' ' + shape(r.path)))) continue;
  seen.add(key);
  routes.push(r);
}
const withinPrefix = (p) => !prefix || p === prefix || p.startsWith(prefix + '/');
const rel = (p) => (prefix && withinPrefix(p) ? p.slice(prefix.length) || '/' : p);

console.log(`Routes: ${routes.length} (${backendRoutes.length} from backend source, ${openapiRoutes.length} from OpenAPI, ${fileRoutes.length} from --routes, ${routes.length - backendRoutes.length - openapiRoutes.length - fileRoutes.length} from frontend fetch calls)`);
console.log(`API prefix: "${prefix || '/'}"   backend: ${backendUrl}`);

const gets = routes.filter((r) => (r.method === 'GET' || r.method === 'ANY') && withinPrefix(r.path.split('?')[0]));
gets.sort((a, b) => (a.path.match(/:/g) || []).length - (b.path.match(/:/g) || []).length);
for (const r of gets) await expand(r.path);

const get = {};
for (const [p, v] of Object.entries(captured)) get[rel(p)] = v;
const snapshot = {
  app: args.app || path.basename(process.cwd()),
  prefix,
  backend: backendUrl,
  capturedAt: new Date().toISOString(),
  routes: routes.map((r) => ({ method: r.method, path: r.path })),
  get
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(snapshot));

const size = (fs.statSync(outFile).size / 1024).toFixed(0);
console.log(`Captured ${Object.keys(get).length} GET responses -> ${path.relative(process.cwd(), outFile)} (${size} KB)`);
const list = (label, items) => { if (items.length) console.log(`${label} (${items.length}):\n  ` + items.slice(0, 25).join('\n  ') + (items.length > 25 ? `\n  ... ${items.length - 25} more` : '')); };
list('Not JSON, skipped', skipped);
list('Failed', failures);
list('Not expanded', unexpanded);
const writes = routes.filter((r) => r.method !== 'GET').map((r) => `${r.method} ${r.path}`);
list('Write routes (generic REST unless a hook covers them)', writes);
if (!Object.keys(get).length) { console.error('Nothing captured — is the backend up at ' + backendUrl + '?'); process.exit(1); }
