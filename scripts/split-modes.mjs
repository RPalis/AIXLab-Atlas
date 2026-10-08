#!/usr/bin/env node
// One-off refactor helper: moves each "## Mode: x" section of a multi-mode SKILL.md
// into references/<file>.md and leaves a router table in SKILL.md.
// Usage: node scripts/split-modes.mjs <skill> '<regex>=<file>' ...
// Kept in the repo so the same split can be re-applied to a new mode-heavy skill.
import fs from 'node:fs';
import path from 'node:path';
import { splitSkill, parseFrontmatter } from './lib/frontmatter.mjs';

const [skill, ...pairs] = process.argv.slice(2);
const dir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'skills', skill);
const text = fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8');
const { fm, body } = splitSkill(text);
const meta = parseFrontmatter(fm);
const rules = pairs.map(p => { const i = p.lastIndexOf('='); return { re: new RegExp(p.slice(0, i)), file: p.slice(i + 1) }; });

// Section boundaries: top-level "## " headings outside code fences.
const lines = body.split('\n');
let fence = false;
const heads = [];
lines.forEach((l, i) => {
  if (/^```/.test(l)) fence = !fence;
  if (!fence && /^## /.test(l)) heads.push(i);
});
const sections = heads.map((s, k) => ({ start: s, end: k + 1 < heads.length ? heads[k + 1] : lines.length, title: lines[s] }));
const pre = lines.slice(0, heads[0]).join('\n');

function fixLinks(s) {
  // add one "../" to relative parent paths (markdown links and bare/code paths)
  s = s.replace(/(^|[\s`(\["'=:])((?:\.\.\/)+)(?=[\w.])/gm, (m, a, b) => a + '../' + b);
  s = s.replace(/\]\(templates\//g, '](../templates/');
  s = s.replace(/\]\(references\//g, '](');
  return s;
}

const cap = skill[0].toUpperCase() + skill.slice(1);
const refDir = path.join(dir, 'references');
fs.mkdirSync(refDir, { recursive: true });
const out = [pre.trimEnd(), ''];
const moved = [];
let routerAt = -1;
for (const sec of sections) {
  const rule = rules.find(r => r.re.test(sec.title));
  if (!rule) { out.push(lines.slice(sec.start, sec.end).join('\n').trimEnd(), ''); continue; }
  if (routerAt < 0) { routerAt = out.length; out.push('@@ROUTER@@', ''); }
  let content = lines.slice(sec.start + 1, sec.end).join('\n').trim();
  content = fixLinks(content);
  const name = rule.file.replace(/\.md$/, '');
  const target = path.join(refDir, rule.file.endsWith('.md') ? rule.file : rule.file + '.md');
  fs.writeFileSync(target, `# ${cap}: ${name} mode\n\nPart of the [\`${skill}\`](../SKILL.md) skill. Shared rules in \`SKILL.md\` still apply.\n\n${content}\n`);
  moved.push({ name, file: path.basename(target), lines: content.split('\n').length });
}
const hint = (meta['argument-hint'] || '').replace(/^\[|\]$/g, '').split('|').map(s => s.trim());
const gloss = n => (hint.find(h => h.startsWith(n + ':')) || '').split(':').slice(1).join(':').trim();
const router = ['## Modes', '', 'Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode\'s file when one is named.', '',
  '| Mode | What it does | File |', '|---|---|---|',
  ...moved.map(m => `| \`${m.name}\` | ${gloss(m.name) || ''} | [references/${m.file}](references/${m.file}) |`)].join('\n');
let res = out.join('\n').replace('@@ROUTER@@', router);
fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\n${fm}\n---\n${res.trimEnd()}\n`);
console.log(skill, moved.map(m => `${m.file}:${m.lines}`).join(' '), '| SKILL.md lines:', fs.readFileSync(path.join(dir, 'SKILL.md'), 'utf8').split('\n').length);
