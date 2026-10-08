#!/usr/bin/env node
// check-token-contrast.mjs [--json] [path/to/index.css]
//
// Computes WCAG 2.x contrast ratios for the suite's fixed semantic role pairs, in light (:root) and
// dark (.dark), straight from the token file. Same input, same output.
// Exit codes: 0 all pairs pass, 1 at least one pair fails, 2 usage or parse error.
// Reads hex, rgb(), hsl() and "R G B" triplets. A pair with an unreadable color is skipped and reported.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const json = args.includes('--json');
let file = args.find(a => !a.startsWith('--'));
if (!file) file = ['src/index.css', 'frontend/src/index.css', 'index.css'].find(f => fs.existsSync(f));
if (!file || !fs.existsSync(file)) { console.error('usage: check-token-contrast.mjs [--json] <path/to/index.css>'); process.exit(2); }
const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

function block(selector) {
  const out = {};
  const re = new RegExp('(^|[\\s}])' + selector.replace('.', '\\.') + '\\s*\\{', 'g');
  let m;
  while ((m = re.exec(css))) {
    let depth = 1, i = re.lastIndex; const start = i;
    while (i < css.length && depth) { if (css[i] === '{') depth++; else if (css[i] === '}') depth--; i++; }
    for (const d of css.slice(start, i - 1).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) out[d[1]] = d[2].trim();
  }
  return out;
}
const light = block(':root');
const dark = { ...light, ...block('.dark') };

function resolve(vars, name, seen = new Set()) {
  let v = vars[name]; if (v === undefined || seen.has(name)) return undefined;
  seen.add(name);
  return v.replace(/var\((--[\w-]+)(?:,[^)]*)?\)/g, (_, n) => resolve(vars, n, seen) ?? 'INVALID');
}
function parse(v) {
  if (!v) return null; v = v.trim();
  let m;
  if ((m = v.match(/^#([0-9a-f]{3,8})$/i))) {
    let h = m[1]; if (h.length <= 4) h = [...h].map(c => c + c).join('');
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  }
  if ((m = v.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/))) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : +m[4]) : 1 };
  if ((m = v.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/))) return { r: +m[1], g: +m[2], b: +m[3], a: 1 };
  if ((m = v.match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%[\s,]+([\d.]+)%/))) {
    const h = +m[1] / 360, s = +m[2] / 100, l = +m[3] / 100;
    const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return { r: 255 * f(p, q, h + 1 / 3), g: 255 * f(p, q, h), b: 255 * f(p, q, h - 1 / 3), a: 1 };
  }
  return null;
}
const over = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
const lum = c => { const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

// [foreground role, background role, minimum ratio, kind]
const TEXT = 4.5, UI = 3;
const PAIRS = [];
for (const bg of ['bg-page', 'surface', 'surface-hover']) for (const fg of ['text-primary', 'text-secondary', 'text-muted', 'text-brand']) PAIRS.push([fg, bg, TEXT, 'text']);
PAIRS.push(['action-accent-foreground', 'action-accent', TEXT, 'text']);
for (const s of ['success', 'error', 'warning', 'info', 'pending', 'neutral']) PAIRS.push([`status-${s}-text`, `status-${s}-rgb@0.15/surface`, TEXT, 'text']);
for (const bg of ['bg-page', 'surface']) PAIRS.push(['focus-ring', bg, UI, 'ui']);
PAIRS.push(['border-input', 'surface', UI, 'ui']);

function color(vars, role) {
  const m = role.match(/^(.+)@([\d.]+)\/(.+)$/);
  if (m) { const base = parse(resolve(vars, '--' + m[1])), under = color(vars, m[3]); return base && under ? over({ ...base, a: +m[2] }, under) : null; }
  return parse(resolve(vars, '--' + role));
}

const results = [];
for (const [theme, vars] of [['light', light], ['dark', dark]]) {
  for (const [fg, bg, min, kind] of PAIRS) {
    const names = [fg, bg].map(r => r.replace(/@[\d.]+\/.*/, '').replace(/^(.*)$/, '$1'));
    if (names.some(n => vars['--' + n] === undefined)) continue; // role not defined in this project
    const f = color(vars, fg), b = color(vars, bg);
    if (!f || !b) { results.push({ theme, fg, bg, min, kind, ratio: null, status: 'skipped' }); continue; }
    const r = ratio(over(f, b), b);
    results.push({ theme, fg, bg: bg.replace(/@.*\//, ' over '), min, kind, ratio: +r.toFixed(2), status: r >= min ? 'pass' : 'FAIL' });
  }
}
const fails = results.filter(r => r.status === 'FAIL');
if (json) console.log(JSON.stringify({ file, results }, null, 2));
else {
  for (const r of results.filter(r => r.status !== 'pass')) console.log(`${r.status}  ${r.theme.padEnd(5)}  ${r.fg} on ${r.bg}  ${r.ratio ?? 'unreadable'} (needs ${r.min})`);
  console.log(`${path.basename(file)}: ${results.length} pairs checked, ${fails.length} failing, ${results.filter(r => r.status === 'skipped').length} skipped`);
}
process.exit(fails.length ? 1 : 0);
