#!/usr/bin/env node
// Validates every skill in skills/ against the Agent Skills spec, Claude Code limits,
// Codex budgets and this suite's own rules. No dependencies. Exit 1 on any error.
//   node scripts/validate.mjs            # check
//   node scripts/validate.mjs --warn     # also print warnings
import fs from 'node:fs';
import path from 'node:path';
import { readSkill } from './lib/frontmatter.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SKILLS = path.join(ROOT, 'skills');
const showWarn = process.argv.includes('--warn');
const errors = [], warns = [];
const err = (s, m) => errors.push(`${s}: ${m}`);
const warn = (s, m) => warns.push(`${s}: ${m}`);

// Keys the Agent Skills spec accepts everywhere. Claude Code adds more; the portable build strips them.
const SPEC_KEYS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const SUITE_KEYS = new Set(['argument-hint', 'disable-model-invocation', 'when_to_use']); // Claude Code only, allowed in source
const DESC_MAX = 1024, DESC_TARGET = 600, BODY_MAX = 500, REF_TOC_AT = 100, CODEX_BUDGET = 8000;
const OD_LINE = '- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).';

const names = fs.readdirSync(SKILLS).filter(n => fs.statSync(path.join(SKILLS, n)).isDirectory());
let descTotal = 0;
const invocable = [];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function slug(h) {
  return h.toLowerCase().replace(/[`*_]/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

function stripFences(t) { return t.replace(/```[\s\S]*?```/g, m => m.replace(/[^\n]/g, ' ')); }

function checkLinks(file, skill) {
  const text = fs.readFileSync(file, 'utf8');
  const prose = stripFences(text);
  const dir = path.dirname(file);
  const headings = new Set([...prose.matchAll(/^#{1,6}\s+(.*)$/gm)].map(m => slug(m[1])));
  if (file.split(path.sep).includes('templates')) return; // templates hold placeholder links for output docs
  const noCode = prose.replace(/`[^`\n]*`/g, m => ' '.repeat(m.length));
  for (const m of noCode.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|file:)/.test(href)) continue;
    if (/[<>]|NNNN/.test(href)) continue; // placeholder
    if (skill === 'wiki' && !/^\.\.\/\.\.\//.test(href) && !/^(references|templates)\//.test(href)) continue; // wiki prose shows example links
    const [p, frag] = href.split('#');
    if (!p) { if (frag && !headings.has(frag)) err(skill, `${path.relative(ROOT, file)}: anchor #${frag} not found`); continue; }
    const target = path.resolve(dir, p);
    if (!fs.existsSync(target)) err(skill, `${path.relative(ROOT, file)}: broken link ${href}`);
  }
  // bare tool paths inside code spans and fences: ../../tools/x or ../../../tools/x
  if (file.split(path.sep).includes('templates')) return;
  for (const m of text.matchAll(/(?<![\w.\/])((?:\.\.\/)+tools\/[\w.\/-]+)/g)) {
    const target = path.resolve(dir, m[1]);
    if (!fs.existsSync(target)) err(skill, `${path.relative(ROOT, file)}: tool path does not resolve: ${m[1]}`);
  }
}

for (const name of names) {
  const file = path.join(SKILLS, name, 'SKILL.md');
  if (!fs.existsSync(file)) { err(name, 'no SKILL.md'); continue; }
  const { fm, body } = readSkill(file);

  if (fm.name !== name) err(name, `frontmatter name "${fm.name}" does not match folder`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) err(name, 'name must be lowercase letters, digits and single hyphens, max 64');
  if (/anthropic|claude/.test(name)) err(name, 'name contains a reserved word');
  for (const k of Object.keys(fm)) if (!SPEC_KEYS.has(k) && !SUITE_KEYS.has(k)) err(name, `unknown frontmatter key "${k}"`);

  const d = fm.description || '';
  if (!d) err(name, 'missing description');
  if (d.length > DESC_MAX) err(name, `description is ${d.length} chars (max ${DESC_MAX})`);
  else if (d.length > DESC_TARGET) warn(name, `description is ${d.length} chars (target ${DESC_TARGET})`);
  if (/[<>]/.test(d)) err(name, 'description contains angle brackets (XML tags are not allowed)');
  if (/^\s*(I |You )/.test(d)) err(name, 'description must be third person');
  if (fm['disable-model-invocation'] !== 'true') { descTotal += d.length; invocable.push(name); }

  const lines = body.split('\n').length;
  if (lines > BODY_MAX) err(name, `SKILL.md body is ${lines} lines (max ${BODY_MAX})`);
  else if (lines > 250) warn(name, `SKILL.md body is ${lines} lines; consider splitting by mode`);

  if (!body.includes('## Output Discipline')) err(name, 'missing "## Output Discipline" section');
  else if (!body.includes(OD_LINE)) err(name, 'Output Discipline text differs from the standard line');

  if (/argument-hint/.test(fs.readFileSync(file, 'utf8').split('---')[1]) === false && /Mode/i.test(body) && fs.existsSync(path.join(SKILLS, name, 'references'))) {
    // multi-mode skills should carry a hint
  }

  // openai.yaml in sync with invocation flag
  const oy = path.join(SKILLS, name, 'agents', 'openai.yaml');
  if (!fs.existsSync(oy)) err(name, 'missing agents/openai.yaml (run: node scripts/sync-skill-metadata.mjs)');
  else {
    const want = fm['disable-model-invocation'] === 'true' ? 'false' : 'true';
    const m = fs.readFileSync(oy, 'utf8').match(/allow_implicit_invocation:\s*(\w+)/);
    if (!m || m[1] !== want) err(name, `agents/openai.yaml allow_implicit_invocation should be ${want} (run: node scripts/sync-skill-metadata.mjs)`);
  }

  for (const f of walk(path.join(SKILLS, name)).filter(f => f.endsWith('.md'))) {
    checkLinks(f, name);
    if (f !== file && fs.readFileSync(f, 'utf8').split('\n').length > REF_TOC_AT) {
      const t = fs.readFileSync(f, 'utf8');
      if (!/^#{1,3}\s+(Contents|Table of contents)\b/im.test(t)) warn(name, `${path.relative(SKILLS, f)} is over ${REF_TOC_AT} lines with no Contents list`);
    }
    // references must not nest deeper than one level below the skill root
    const rel = path.relative(path.join(SKILLS, name), f).split(path.sep);
    if (rel.length > 3) warn(name, `${rel.join('/')} nests deeper than one level of references`);
  }
  // backslash paths
  if (/scripts\\|references\\|templates\\/.test(body)) err(name, 'uses Windows-style path separators');
}

if (descTotal > CODEX_BUDGET) warn('suite', `model-invocable descriptions total ${descTotal} chars (Codex list budget ~${CODEX_BUDGET}); invocable: ${invocable.join(', ')}`);

// every skill must be listed in the three index docs
for (const doc of ['README.md', 'AGENTS.md', 'skills/help/references/atlas.md']) {
  const t = fs.readFileSync(path.join(ROOT, doc), 'utf8');
  for (const n of names) if (!t.includes('`' + n + '`') && !t.includes(`skills/${n}`)) err('index', `${doc} does not mention skill "${n}"`);
}

// plugin manifests
for (const f of ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
  try { JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { err('plugin', `${f}: ${e.message}`); }
}

// evals: at least three cases per skill
for (const n of names) {
  const f = path.join(ROOT, 'evals', `${n}.json`);
  if (!fs.existsSync(f)) { err('evals', `missing evals/${n}.json`); continue; }
  try { const e = JSON.parse(fs.readFileSync(f, 'utf8')); if ((e.cases || []).length < 3) err('evals', `${n}: needs at least 3 cases`); }
  catch (e) { err('evals', `${n}: ${e.message}`); }
}

// index.html: the hero's skill count and each phase's ribbon count must match (run scripts/build-skill-docs.mjs)
{
  const idx = path.join(ROOT, 'index.html');
  if (fs.existsSync(idx)) {
    const html = fs.readFileSync(idx, 'utf8').split('<script type="application/json" id="skill-docs">')[0];
    const ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
    const tens = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
    const words = (n) => n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
    const hero = (html.match(/<p class="hero-subhead">([\w-]+) <span/) || [])[1];
    if (hero !== words(names.length)) err('index.html', `hero says "${hero}" skills but there are ${names.length} (run: node scripts/build-skill-docs.mjs)`);
    for (const phase of ['before', 'discover', 'decide', 'design', 'deliver', 'anytime']) {
      const s = html.indexOf(`id="${phase}"`);
      const n = (html.slice(s, html.indexOf('</section>', s)).match(/class="card-name"/g) || []).length;
      const shown = (html.match(new RegExp(`<a href="#${phase}" data-phase="${phase}">\\s*<div class="num">[\\s\\S]*?<div class="count">(\\d+) skill`)) || [])[1];
      if (Number(shown) !== n) err('index.html', `${phase} ribbon says ${shown} but the section has ${n} cards (run: node scripts/build-skill-docs.mjs)`);
    }
  }
}

if (showWarn) for (const w of warns) console.log('warn  ' + w);
for (const e of errors) console.log('ERROR ' + e);
console.log(`${names.length} skills, ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
