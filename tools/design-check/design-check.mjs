#!/usr/bin/env node
// design-check.mjs [--json] [--rules a,b] <path> [path...]
//
// Deterministic check of the suite's design rules in component source. Same input, same output.
// Exit codes: 0 clean, 1 findings, 2 usage or read error.
//
// Rules:
//   hex            raw hex colors in component code (the token layer, any CSS file defining :root or .dark, is exempt)
//   palette        raw Tailwind palette classes (text-slate-500, bg-emerald-600)
//   dark-override  dark: variant classes (semantic tokens flip by themselves)
//   transition-all transition-all or "transition: all" (animates layout; name the properties)
//   motion         keyframes or transitions in a project with no prefers-reduced-motion rule anywhere
//
// Suppress one finding with a comment on the same or the previous line:
//   // design-check-ignore palette: chart series colors come from the data viz palette
// A reason after the colon is required; an ignore without one is itself reported.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const json = args.includes('--json');
const rulesArg = args.indexOf('--rules');
const only = rulesArg >= 0 ? new Set(args[rulesArg + 1].split(',')) : null;
const paths = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--rules');
if (!paths.length) { console.error('usage: design-check.mjs [--json] [--rules hex,palette,dark-override,transition-all,motion] <path> [path...]'); process.exit(2); }

const EXCLUDE = new Set(['node_modules', 'dist', 'build', '.git', 'coverage', '.next', 'storybook-static']);
const CODE = /\.(tsx|jsx|ts|js|mjs|html|vue|svelte)$/;
const STYLE = /\.(css|scss)$/;
const PALETTES = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const RX = {
  hex: /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b(?!-)/g,
  palette: new RegExp(`\\b(?:text|bg|border|ring|fill|stroke|from|via|to|divide|outline|shadow|accent|decoration|placeholder)-(?:${PALETTES})-\\d{2,3}\\b`, 'g'),
  dark: /(?<![\w-])dark:[\w\[\]\/:.%-]+/g,
  transAll: /\btransition-all\b|transition:\s*all\b/g,
};
const MESSAGE = {
  hex: 'raw hex color; use a semantic token class',
  palette: 'raw Tailwind palette class; use a semantic token class',
  'dark-override': 'dark: variant; semantic tokens flip by themselves, so remove it or add a token',
  'transition-all': 'transition-all animates layout properties; name them (transition-colors, transition-[opacity,transform])',
  motion: 'animation or transition found but no prefers-reduced-motion rule anywhere in the scanned files',
  ignore: 'design-check-ignore needs a reason after the colon',
};

function walk(p, out = []) {
  const st = fs.statSync(p, { throwIfNoEntry: false });
  if (!st) { console.error(`not found: ${p}`); process.exit(2); }
  if (st.isFile()) { out.push(p); return out; }
  for (const e of fs.readdirSync(p, { withFileTypes: true })) {
    if (EXCLUDE.has(e.name)) continue;
    walk(path.join(p, e.name), out);
  }
  return out;
}

const files = paths.flatMap(p => walk(p)).filter(f => CODE.test(f) || STYLE.test(f)).filter(f => !/\.(test|spec|stories)\./.test(f));
const findings = [];
let sawMotion = null, sawReduced = false;
const on = r => !only || only.has(r);

for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const lines = text.split('\n');
  const isStyle = STYLE.test(f);
  const isTokenFile = isStyle && /(:root|\.dark)\s*\{/.test(text);
  if (/prefers-reduced-motion/.test(text)) sawReduced = true;
  if (!sawMotion && /@keyframes|\banimate-|\btransition(?:-\w+)?\b|animation\s*:/.test(text)) sawMotion = f;
  const ignores = new Map(); // line index -> Set(rules)
  lines.forEach((l, i) => {
    const m = l.match(/design-check-ignore\s+([\w-]+)(?::\s*(\S.*?))?\s*(?:\*\/\}?|-->|\}\})?\s*$/);
    if (!m) return;
    if (!m[2]) findings.push({ rule: 'ignore', file: f, line: i + 1, text: l.trim() });
    for (const j of [i, i + 1]) { if (!ignores.has(j)) ignores.set(j, new Set()); ignores.get(j).add(m[1]); }
  });
  const add = (rule, i, col, snippet) => {
    if (!on(rule)) return;
    if (ignores.get(i)?.has(rule)) return;
    findings.push({ rule, file: f, line: i + 1, col: col + 1, text: snippet.trim().slice(0, 160) });
  };
  lines.forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*|<!--)/.test(l) && !/className|class=/.test(l)) return; // pure comment line
    if (!isTokenFile && !isStyle) {
      for (const m of l.matchAll(RX.hex)) {
        const before = l.slice(Math.max(0, m.index - 12), m.index);
        if (/(href|to|id|htmlFor|url\()\s*=?\s*["'{(]*$/.test(before)) continue; // anchors and svg url(#id)
        add('hex', i, m.index, l);
      }
    }
    if (!isStyle) {
      for (const m of l.matchAll(RX.palette)) add('palette', i, m.index, l);
      for (const m of l.matchAll(RX.dark)) add('dark-override', i, m.index, l);
    }
    for (const m of l.matchAll(RX.transAll)) add('transition-all', i, m.index, l);
  });
}
if (on('motion') && sawMotion && !sawReduced) findings.push({ rule: 'motion', file: sawMotion, line: 1, col: 1, text: '(project-level)' });

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
if (json) console.log(JSON.stringify({ scanned: files.length, findings }, null, 2));
else {
  for (const f of findings) console.log(`${f.file}:${f.line}${f.col ? ':' + f.col : ''}  ${f.rule}  ${MESSAGE[f.rule]}${f.text && f.text !== '(project-level)' ? '\n    ' + f.text : ''}`);
  console.log(`${files.length} files scanned, ${findings.length} findings`);
}
process.exit(findings.length ? 1 : 0);
