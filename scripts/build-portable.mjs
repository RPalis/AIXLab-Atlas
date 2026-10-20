#!/usr/bin/env node
// Builds spec-clean, self-contained copies of each skill in dist/portable/<name>/ (and <name>.zip when
// `zip` exists) for places that take one skill at a time: claude.ai and API uploads, or a copy into a
// project's .agents/skills. The plugin and the hub install do not need this.
//
// For each skill it:
//   - keeps only Agent Skills spec frontmatter keys (drops argument-hint and disable-model-invocation)
//   - copies the tools the skill calls into <skill>/tools/ and rewrites the ../../tools/ paths
//   - turns links to other skills into plain skill names, since those skills are not in the bundle
//   node scripts/build-portable.mjs [skill ...]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { splitSkill, parseFrontmatter, foldedBlock } from './lib/frontmatter.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SKILLS = path.join(ROOT, 'skills'), TOOLS = path.join(ROOT, 'tools'), OUT = path.join(ROOT, 'dist', 'portable');
const wanted = process.argv.slice(2);
const names = fs.readdirSync(SKILLS).filter(n => fs.existsSync(path.join(SKILLS, n, 'SKILL.md')) && (!wanted.length || wanted.includes(n)));
fs.rmSync(OUT, { recursive: true, force: true });

function walk(d, o = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, o) : o.push(p); } return o; }
function copyDir(src, dst) { fs.cpSync(src, dst, { recursive: true, filter: s => !s.endsWith('.DS_Store') && !s.includes(path.sep + 'agents' + path.sep) && !s.endsWith(path.sep + 'agents') }); }

for (const name of names) {
  const src = path.join(SKILLS, name), dst = path.join(OUT, name);
  copyDir(src, dst);
  const used = new Set();
  for (const f of walk(dst).filter(f => f.endsWith('.md'))) {
    const depth = path.relative(dst, path.dirname(f)).split(path.sep).filter(Boolean).length; // 0 = skill root
    let t = fs.readFileSync(f, 'utf8');
    // tools: ../../tools/x (root) or ../../../tools/x (one level down) -> tools/x relative to this file
    const toolRel = depth === 0 ? 'tools/' : '../'.repeat(depth) + 'tools/';
    t = t.replace(/(?:\.\.\/)+tools\/([\w-]+)/g, (_, tool) => { used.add(tool); return toolRel + tool; });
    // links to other skills: [`x`](../x/SKILL.md#frag) or deeper -> `x`
    t = t.replace(/\[([^\]]+)\]\((?:\.\.\/)+([a-z0-9-]+)\/[^)]*\)/g, (m, label, skill) => (skill === name || !names.includes(skill) && !fs.existsSync(path.join(SKILLS, skill))) ? m : (label.includes('`') ? label : `${label} (\`${skill}\` skill)`));
    if (path.basename(f) === 'SKILL.md' && depth === 0) {
      const { fm, body } = splitSkill(t);
      const meta = parseFrontmatter(fm);
      t = `---\nname: ${meta.name}\n${foldedBlock('description', meta.description)}\n---\n${body}`;
    }
    fs.writeFileSync(f, t);
  }
  for (const tool of used) if (fs.existsSync(path.join(TOOLS, tool))) fs.cpSync(path.join(TOOLS, tool), path.join(dst, 'tools', tool), { recursive: true });
  // tools call each other (doctor -> design-check ...): vendor one level of siblings they name
  for (const tool of [...used]) for (const f of fs.existsSync(path.join(dst, 'tools', tool)) ? walk(path.join(dst, 'tools', tool)) : []) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(/\.\.\/([\w-]+)\//g)) if (fs.existsSync(path.join(TOOLS, m[1])) && !fs.existsSync(path.join(dst, 'tools', m[1]))) fs.cpSync(path.join(TOOLS, m[1]), path.join(dst, 'tools', m[1]), { recursive: true });
  }
  if (spawnSync('which', ['zip']).status === 0) spawnSync('zip', ['-qr', path.join(OUT, name + '.zip'), name], { cwd: OUT });
}
const size = d => walk(d).reduce((s, f) => s + fs.statSync(f).size, 0);
console.log(`${names.length} portable skills in ${path.relative(ROOT, OUT)} (largest: ${names.map(n => [n, size(path.join(OUT, n))]).sort((a, b) => b[1] - a[1])[0].join(' ')} bytes)`);
