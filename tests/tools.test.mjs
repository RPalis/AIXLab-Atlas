import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const T = p => path.join(ROOT, 'tools', p);
const FX = p => path.join(ROOT, 'tests', 'fixtures', p);
const node = (script, args = [], opts = {}) => spawnSync('node', [script, ...args], { encoding: 'utf8', ...opts });

test('design-check passes a clean project, including an ignore with a reason and a #anchor', () => {
  const r = node(T('design-check/design-check.mjs'), ['--json', FX('clean/src')]);
  assert.equal(r.status, 0, r.stdout);
  assert.equal(JSON.parse(r.stdout).findings.length, 0);
});

test('design-check reports each rule in a dirty project and exits 1', () => {
  const r = node(T('design-check/design-check.mjs'), ['--json', FX('dirty/src')]);
  assert.equal(r.status, 1);
  const rules = new Set(JSON.parse(r.stdout).findings.map(f => f.rule));
  for (const rule of ['hex', 'palette', 'dark-override', 'transition-all', 'ignore']) assert.ok(rules.has(rule), `missing ${rule}`);
});

test('design-check --rules limits the output and exits 2 on a bad path', () => {
  const only = JSON.parse(node(T('design-check/design-check.mjs'), ['--json', '--rules', 'hex', FX('dirty/src')]).stdout);
  assert.ok(only.findings.every(f => f.rule === 'hex' || f.rule === 'ignore'));
  assert.equal(node(T('design-check/design-check.mjs'), ['/no/such/path']).status, 2);
});

test('the old check-hardcoded-colors wrapper still works', () => {
  assert.equal(spawnSync('bash', [T('check-hardcoded-colors/check-hardcoded-colors.sh'), FX('clean/src')]).status, 0);
  assert.equal(spawnSync('bash', [T('check-hardcoded-colors/check-hardcoded-colors.sh'), FX('dirty/src')]).status, 1);
});

test('the default token template passes every contrast pair', () => {
  const r = node(T('check-token-contrast/check-token-contrast.mjs'), ['--json', path.join(ROOT, 'skills/styleguide/templates/index.css')]);
  assert.equal(r.status, 0, r.stdout);
  const j = JSON.parse(r.stdout);
  assert.ok(j.results.length >= 30);
  assert.ok(j.results.every(x => x.status === 'pass'));
});

test('a low-contrast token file fails and names the pair', () => {
  const r = node(T('check-token-contrast/check-token-contrast.mjs'), ['--json', FX('dirty/src/index.css')]);
  assert.equal(r.status, 1);
  const bad = JSON.parse(r.stdout).results.filter(x => x.status === 'FAIL');
  assert.ok(bad.some(x => x.fg === 'text-muted'));
});

test('design-hook is silent until a project opts in, then returns findings with exit 2', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-'));
  fs.cpSync(FX('dirty/src'), path.join(dir, 'src'), { recursive: true });
  const ev = JSON.stringify({ cwd: dir, tool_input: { file_path: path.join(dir, 'src/Bad.tsx') } });
  assert.equal(node(T('design-hook/design-hook.mjs'), [], { input: ev }).status, 0);
  node(T('design-hook/design-hook.mjs'), ['--enable', dir]);
  const on = node(T('design-hook/design-hook.mjs'), [], { input: ev });
  assert.equal(on.status, 2);
  assert.match(on.stderr, /design check/i);
  const md = JSON.stringify({ cwd: dir, tool_input: { file_path: path.join(dir, 'README.md') } });
  assert.equal(node(T('design-hook/design-hook.mjs'), [], { input: md }).status, 0);
});

test('doctor reports missing roles and passes the template tokens', () => {
  const r = node(T('doctor/doctor.mjs'), ['--json', FX('dirty')]);
  assert.equal(r.status, 1);
  const areas = JSON.parse(r.stdout).problems.map(p => p.area);
  assert.ok(areas.includes('tokens') && areas.includes('contrast'));
  const ok = JSON.parse(node(T('doctor/doctor.mjs'), ['--json', FX('clean')]).stdout);
  assert.equal(ok.digest.contrastFailures, 0);
  assert.ok(!ok.problems.some(p => p.area === 'tokens' && /missing semantic role/.test(p.text)));
});

test('the portable build keeps only spec keys and vendors tools', () => {
  const r = node(path.join(ROOT, 'scripts/build-portable.mjs'), ['audit', 'persona']);
  assert.equal(r.status, 0, r.stderr);
  const t = fs.readFileSync(path.join(ROOT, 'dist/portable/audit/SKILL.md'), 'utf8');
  const fm = t.split('---')[1];
  assert.ok(!/argument-hint|disable-model-invocation/.test(fm));
  assert.ok(fs.existsSync(path.join(ROOT, 'dist/portable/audit/tools/design-check/design-check.mjs')));
  const pf = fs.readFileSync(path.join(ROOT, 'dist/portable/persona/SKILL.md'), 'utf8').split('---')[1];
  assert.ok(!/disable-model-invocation/.test(pf));
});
