#!/usr/bin/env node
// doctor.mjs [repo-root] [--json]
//
// One read of a prototype project's health. It prints a context digest (what every skill would
// otherwise re-derive) and then a list of problems, each with the skill that fixes it.
// Same input, same output. Exit codes: 0 no problems, 1 problems found, 2 error.
//
// Checks: docs folder resolves and AGENTS.md names it; open blocking unknowns; token file has every
// semantic role in light and dark; DESIGN.md is not older than index.css; design-check findings;
// token contrast failures; edit-time hook state; installed suite version.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const TOOLS = path.join(HERE, '..');
const args = process.argv.slice(2);
const json = args.includes('--json');
const repo = path.resolve(args.find(a => !a.startsWith('--')) || spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).stdout.trim() || '.');
const run = (cmd, a, opts = {}) => spawnSync(cmd, a, { encoding: 'utf8', cwd: repo, ...opts });
const sh = (tool, ...a) => run('bash', [path.join(TOOLS, tool), ...a]);

const digest = {}, problems = [];
const problem = (area, text, fix) => problems.push({ area, text, fix });

// docs folder + phase
const docs = sh('find-docs-folder/find-docs-folder.sh', repo);
digest.docs = docs.status === 0 ? docs.stdout.trim() : null;
const phase = sh('detect-project-phase/detect-project-phase.sh', repo);
digest.phase = (phase.stdout.match(/PHASE=(.*)/) || [])[1] || 'unknown';
digest.signal = (phase.stdout.match(/SIGNAL=(.*)/) || [])[1] || '';
if (!digest.docs) problem('docs', 'No docs folder found.', 'setup');
else {
  const agents = path.join(repo, 'AGENTS.md');
  if (!fs.existsSync(agents) || !/Docs folder: `[^`]+`/.test(fs.readFileSync(agents, 'utf8'))) problem('docs', 'AGENTS.md does not name the docs folder, so skills must guess it.', 'setup');
}

// unknowns
if (digest.docs) {
  const f = path.join(repo, digest.docs, 'UNKNOWNS.md');
  const blocking = fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(l => /blocking/i.test(l) && /^[-*]/.test(l.trim())) : [];
  digest.blockingUnknowns = blocking.length;
  if (blocking.length) problem('unknowns', `${blocking.length} blocking unknown(s) are open in UNKNOWNS.md.`, 'interview (to ask users) or decisions (to record the call)');
}

// tokens
function findFile(names, dirs) { for (const d of dirs) for (const n of names) { const p = path.join(repo, d, n); if (fs.existsSync(p)) return p; } return null; }
const css = findFile(['index.css'], ['src', 'frontend/src', 'web/src', 'client/src', '.']);
const roles = ['bg-page', 'surface', 'surface-hover', 'surface-border', 'border-input', 'border-emphasis', 'text-primary', 'text-secondary', 'text-muted', 'text-brand', 'action-primary', 'action-primary-hover', 'action-primary-active', 'action-secondary', 'action-accent', 'action-accent-foreground', 'focus-ring', 'shadow-card', 'shadow-hover'];
digest.tokenFile = css ? path.relative(repo, css) : null;
if (css) {
  const text = fs.readFileSync(css, 'utf8');
  const part = (sel) => { const i = text.search(new RegExp(`(^|\\s)${sel}\\s*\\{`)); if (i < 0) return ''; let d = 0, j = text.indexOf('{', i); const s = j; for (; j < text.length; j++) { if (text[j] === '{') d++; else if (text[j] === '}' && !--d) break; } return text.slice(s, j); };
  const root = part(':root'), dk = part('\\.dark');
  const missing = roles.filter(r => !new RegExp(`--${r}\\s*:`).test(root));
  const unflipped = ['bg-page', 'surface', 'text-primary', 'text-secondary'].filter(r => !new RegExp(`--${r}\\s*:`).test(dk));
  if (missing.length) problem('tokens', `index.css is missing semantic role(s): ${missing.join(', ')}.`, 'styleguide');
  if (!dk) problem('tokens', 'index.css has no .dark block.', 'styleguide');
  else if (unflipped.length) problem('tokens', `.dark does not rebind: ${unflipped.join(', ')}.`, 'styleguide');
  const design = path.join(path.dirname(css), '..', 'DESIGN.md');
  const dm = [path.join(repo, 'DESIGN.md'), design].find(fs.existsSync);
  if (!dm) problem('tokens', 'DESIGN.md not found.', 'styleguide');
  else if (fs.statSync(dm).mtimeMs < fs.statSync(css).mtimeMs) problem('tokens', 'DESIGN.md is older than index.css. Regenerate it.', 'styleguide');
  const c = run('node', [path.join(TOOLS, 'check-token-contrast/check-token-contrast.mjs'), '--json', css]);
  if (c.stdout) { try { const r = JSON.parse(c.stdout).results.filter(x => x.status === 'FAIL'); digest.contrastFailures = r.length; if (r.length) problem('contrast', `${r.length} token pair(s) fail WCAG contrast (e.g. ${r[0].fg} on ${r[0].bg}, ${r[0].theme}, ${r[0].ratio}).`, 'styleguide, then audit a11y'); } catch {} }
  const srcDir = path.join(path.dirname(css));
  const d = run('node', [path.join(TOOLS, 'design-check/design-check.mjs'), '--json', '--rules', 'hex,palette,dark-override,transition-all', srcDir]);
  if (d.stdout) { try { const f = JSON.parse(d.stdout).findings; digest.designFindings = f.length; if (f.length) problem('design', `${f.length} design-check finding(s) in component code.`, 'refine (fix) or audit code (report)'); } catch {} }
  const hook = fs.existsSync(path.join(repo, '.ux-atlas', 'design-hook'));
  digest.designHook = hook ? 'on' : 'off';
}

// installed suite version
const ver = path.join(os.homedir(), '.agents', 'skills', '.ux-atlas.version');
if (fs.existsSync(ver)) digest.suiteVersion = (fs.readFileSync(ver, 'utf8').match(/sha=(\w{7})/) || [])[1];

if (json) console.log(JSON.stringify({ repo, digest, problems }, null, 2));
else {
  console.log('CONTEXT');
  for (const [k, v] of Object.entries(digest)) console.log(`  ${k}: ${v}`);
  console.log(problems.length ? '\nPROBLEMS' : '\nNo problems found.');
  for (const p of problems) console.log(`  [${p.area}] ${p.text}\n      fix with: ${p.fix}`);
}
process.exit(problems.length ? 1 : 0);
