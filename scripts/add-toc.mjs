#!/usr/bin/env node
// Adds a "## Contents" list to reference files longer than 100 lines that lack one
// (Anthropic guidance: partial reads should still show the file's full scope).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'skills');
function walk(d, o = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, o) : o.push(p); } return o; }
let n = 0;
for (const f of walk(ROOT).filter(f => f.endsWith('.md') && !f.endsWith('SKILL.md') && f.includes(path.sep + 'references' + path.sep))) {
  const t = fs.readFileSync(f, 'utf8');
  const lines = t.split('\n');
  if (lines.length <= 100 || /^#{1,3}\s+(Contents|Table of contents)\b/im.test(t)) continue;
  let fence = false; const heads = [];
  lines.forEach((l, i) => { if (/^```/.test(l)) fence = !fence; if (!fence && /^#{2,3} /.test(l)) heads.push({ i, lvl: l.match(/^#+/)[0].length, text: l.replace(/^#+\s+/, '').replace(/`/g, '') }); });
  if (!heads.length) continue;
  const toc = ['## Contents', '', ...heads.map(h => `${h.lvl === 3 ? '  ' : ''}- ${h.text}`), ''];
  lines.splice(heads[0].i, 0, ...toc);
  fs.writeFileSync(f, lines.join('\n'));
  n++;
}
console.log('added contents to', n, 'files');
