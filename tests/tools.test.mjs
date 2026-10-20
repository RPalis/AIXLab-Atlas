import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

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

// --- wiki tools ---
const bash = (script, args = [], opts = {}) => spawnSync('bash', [script, ...args], { encoding: 'utf8', ...opts });
const wikiFixture = () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wiki-'));
  spawnSync('git', ['init', '-q'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'AGENTS.md'), 'Docs folder: `p-docs`\n');
  for (const d of ['notes/my-notes', 'notes/wiki/topics', 'sources/client', 'artifacts/workflows']) fs.mkdirSync(path.join(dir, 'p-docs', d), { recursive: true });
  return dir;
};
const put = (dir, rel, text) => fs.writeFileSync(path.join(dir, 'p-docs', rel), text);

test('wiki-status finds unregistered, loose and new files and --check gates on them', () => {
  const dir = wikiFixture();
  put(dir, 'sources/client/spec.md', 'spec\n');
  put(dir, 'loose-brief.pdf', 'x');
  put(dir, 'notes/my-notes/2026-10-10.md', '- thought\n');
  const r = bash(T('wiki-status/wiki-status.sh'), ['--check', dir]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /UNREGISTERED p-docs\/sources\/client\/spec\.md/);
  assert.match(r.stdout, /LOOSE p-docs\/loose-brief\.pdf/);
  assert.match(r.stdout, /NEW p-docs\/notes\/my-notes\/2026-10-10\.md/);
});

test('wiki-status is clean once sources are registered and notes have a footer; drafts are counted', () => {
  const dir = wikiFixture();
  put(dir, 'sources/client/spec.md', 'spec\n');
  put(dir, 'notes/wiki/sources.md', '| S-001 | [spec](../../sources/client/spec.md) |\n');
  put(dir, 'notes/my-notes/n.md', '- a\n');
  assert.equal(bash(T('wiki-footer/wiki-footer.sh'), [path.join(dir, 'p-docs/notes/my-notes/n.md'), 'Topic|../wiki/topics/t.md']).status, 0);
  const ok = bash(T('wiki-status/wiki-status.sh'), ['--check', dir]);
  assert.equal(ok.status, 0, ok.stdout);
  assert.match(ok.stdout, /^OK$/m);
  put(dir, 'notes/wiki/topics/t.md', '---\nstatus: draft\n---\n# T\n');
  assert.match(bash(T('wiki-status/wiki-status.sh'), [dir]).stdout, /DRAFTS 1/);
});

test('wiki-status flags a note edited after its footer date', () => {
  const dir = wikiFixture();
  const f = path.join(dir, 'p-docs/notes/my-notes/n.md');
  put(dir, 'notes/my-notes/n.md', '- a\n');
  bash(T('wiki-footer/wiki-footer.sh'), [f, 'Topic|../wiki/topics/t.md']);
  const future = new Date(Date.now() + 3 * 86400000);
  fs.utimesSync(f, future, future);
  assert.match(bash(T('wiki-status/wiki-status.sh'), [dir]).stdout, /CHANGED p-docs\/notes\/my-notes\/n\.md/);
});

test('wiki-footer replaces its own block, keeps the text above, and does not pile up links', () => {
  const dir = wikiFixture();
  const f = path.join(dir, 'p-docs/notes/my-notes/n.md');
  put(dir, 'notes/my-notes/n.md', '- my thought\n');
  bash(T('wiki-footer/wiki-footer.sh'), [f, 'A|../a.md', 'B|../b.md']);
  bash(T('wiki-footer/wiki-footer.sh'), [f, 'C|../c.md']);
  const t = fs.readFileSync(f, 'utf8');
  assert.ok(t.startsWith('- my thought\n'));
  assert.equal((t.match(/wiki:begin/g) || []).length, 1);
  assert.match(t, /\[C\]\(\.\.\/c\.md\)/);
  assert.ok(!/\[A\]/.test(t));
  assert.equal(bash(T('wiki-footer/wiki-footer.sh'), ['/no/such/file', 'A|a.md']).status, 2);
});

const hasMarked = (() => { try { return !!createRequire(import.meta.url)('marked'); } catch { return false; } })();
test('wiki-site builds only what the publish filter allows', { skip: !hasMarked && 'marked not installed (npm i marked)' }, () => {
  const dir = wikiFixture();
  put(dir, 'notes/wiki/index.md', '# Wiki\n\n- [On](topics/on.md)\n- [Secret](topics/secret.md)\n- [Mine](../my-notes/a.md)\n- [Spec](../../sources/client/spec.md)\n');
  put(dir, 'notes/wiki/topics/on.md', '---\nstatus: stable\n---\n# Onboarding\n\nText (S-001).\n');
  put(dir, 'notes/wiki/topics/secret.md', '---\nstatus: draft\n---\n# Secret\n');
  put(dir, 'notes/wiki/sources.md', '# Sources\n\n| ID | Title | Path | Told us | Publish |\n|---|---|---|---|---|\n| S-001 | Open | [spec](../../sources/client/spec.md) | fine | yes |\n| S-002 | Hidden | [conf](../../sources/client/conf.md) | LEAKME | no |\n');
  put(dir, 'sources/client/spec.md', '# Spec\n');
  put(dir, 'sources/client/conf.md', '# Conf\n');
  put(dir, 'notes/my-notes/a.md', 'private\n');
  const r = node(T('wiki-site/wiki-site.mjs'), [dir]);
  assert.equal(r.status, 0, r.stderr);
  const out = p => path.join(dir, 'wiki-site', p);
  assert.ok(fs.existsSync(out('topics/on.html')));
  assert.ok(fs.existsSync(out('sources/client/spec.html')));
  assert.ok(!fs.existsSync(out('topics/secret.html')));
  assert.ok(!fs.existsSync(out('sources/client/conf.html')));
  assert.ok(!fs.readFileSync(out('sources.html'), 'utf8').includes('LEAKME'));
  const idx = fs.readFileSync(out('index.html'), 'utf8');
  assert.ok(idx.includes('topics/on.html'));
  assert.ok(!idx.includes('secret.html') && !idx.includes('my-notes'));
});

test('wiki-status reports a folder with no README but does not fail --check for it', () => {
  const dir = wikiFixture();
  fs.mkdirSync(path.join(dir, 'p-docs/sources/teams/platform'), { recursive: true });
  for (const d of ['notes', 'notes/my-notes', 'notes/wiki', 'notes/wiki/topics', 'sources', 'sources/client', 'sources/teams', 'artifacts', 'artifacts/workflows']) put(dir, `${d}/README.md`, '# r\n');
  const r = bash(T('wiki-status/wiki-status.sh'), ['--check', dir]);
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /NOREADME p-docs\/sources\/teams\/platform/);
  assert.ok(!/NOREADME p-docs\/sources\/client/.test(r.stdout));
});

test('adr-bundle joins ADRs under one H1, demotes headings outside code fences, skips README', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'adr-'));
  fs.writeFileSync(path.join(dir, 'README.md'), '# Decision records\n');
  fs.writeFileSync(path.join(dir, '0002-b.md'), '# 0002: B\n\n## Decision\nUse B.\n');
  fs.writeFileSync(path.join(dir, '0001-a.md'), '# 0001: A\n\n## Decision\nUse A.\n\n```\n# not a heading\n```\n');
  const r = bash(T('adr-bundle/adr-bundle.sh'), ['--title', 'Key decisions', dir]);
  assert.equal(r.status, 0, r.stderr);
  const o = r.stdout;
  assert.ok(o.startsWith('# Key decisions\n'));
  assert.ok(o.indexOf('## 0001: A') < o.indexOf('## 0002: B'));
  assert.ok(o.includes('### Decision') && o.includes('\n# not a heading\n'));
  assert.ok(!o.includes('Decision records'));
  assert.equal(bash(T('adr-bundle/adr-bundle.sh'), ['/no/such/dir']).status, 2);
});

test('foundations-check names each missing foundation and the skill that makes it', () => {
  const dir = wikiFixture();
  put(dir, 'PRODUCT_BRIEF.md', '# b\n');
  put(dir, 'OOUX_OBJECT_MAP.md', '# o\n');
  put(dir, 'checkout-flow.md', '# f\n');
  const r = bash(T('foundations-check/foundations-check.sh'), ['--check', dir]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /HAVE brief /);
  assert.match(r.stdout, /MISSING users persona/);
  assert.match(r.stdout, /MISSING problem problems/);
  assert.match(r.stdout, /MISSING content map \(ia mode\)/);
  assert.match(r.stdout, /MISSING architecture map \(site mode\)/);
  assert.match(r.stdout, /HAVE workflow .*checkout-flow\.md/);
  assert.match(r.stdout, /SUMMARY have=3 missing=4/);
  for (const f of ['PERSONA_WALKTHROUGH.md', 'PROBLEM_STATEMENTS.md', 'INFORMATION_ARCHITECTURE.md', 'ARCHITECTURE_MAP.md']) put(dir, f, '# x\n');
  const ok = bash(T('foundations-check/foundations-check.sh'), ['--check', dir]);
  assert.equal(ok.status, 0, ok.stdout);
  put(dir, 'PRODUCT_BRIEF.md', 'Status: minimum\n# b\n');
  assert.match(bash(T('foundations-check/foundations-check.sh'), [dir]).stdout, /QUICKSTART brief is minimum/);
});

test('wiki-site links decks and downloads, copies allowed images, and drops private ones', { skip: !hasMarked && 'marked not installed (npm i marked)' }, () => {
  const dir = wikiFixture();
  fs.mkdirSync(path.join(dir, 'p-docs/exports'), { recursive: true });
  put(dir, 'exports/story.html', '<html><body><img src="shots/a.png"><link rel="stylesheet" href="https://cdn.example.com/x.css"></body></html>');
  fs.mkdirSync(path.join(dir, 'p-docs/exports/shots'), { recursive: true });
  put(dir, 'exports/shots/a.png', 'png');
  put(dir, 'exports/report.pptx', 'pptx');
  put(dir, 'artifacts/workflows/flow.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>');
  put(dir, 'notes/my-notes/secret.png', 'private');
  put(dir, 'sources/client/conf.png', 'conf');
  put(dir, 'notes/wiki/index.md', '# Wiki\n\n![flow](../../artifacts/workflows/flow.svg)\n\n![mine](../my-notes/secret.png)\n\n![conf](../../sources/client/conf.png)\n\n- [Deck](../../exports/story.html)\n');
  put(dir, 'notes/wiki/artifacts.md', '# Artifacts\n\n| ID | Title | Path | Publish |\n|---|---|---|---|\n| A-001 | Story deck | [deck](../../exports/story.html) | yes |\n| A-002 | Readout slides | [pptx](../../exports/report.pptx) | yes |\n');
  const r = node(T('wiki-site/wiki-site.mjs'), [dir]);
  assert.equal(r.status, 0, r.stderr);
  const out = p => path.join(dir, 'wiki-site', p);
  assert.ok(fs.existsSync(out('files/exports/story.html')));
  assert.ok(fs.existsSync(out('files/exports/shots/a.png')), 'deck screenshot comes along');
  assert.ok(fs.existsSync(out('files/exports/report.pptx')));
  assert.ok(fs.existsSync(out('files/artifacts/workflows/flow.svg')));
  assert.ok(!fs.existsSync(out('files/notes/my-notes/secret.png')));
  assert.ok(!fs.existsSync(out('files/sources/client/conf.png')));
  const idx = fs.readFileSync(out('index.html'), 'utf8');
  assert.ok(idx.includes('src="files/artifacts/workflows/flow.svg"'));
  assert.ok(!idx.includes('secret.png') && !idx.includes('conf.png'));
  assert.ok(idx.includes('href="files/exports/story.html"'));
  assert.match(idx, /Presentations[\s\S]*Story deck/);
  assert.match(idx, /Downloads[\s\S]*Readout slides/);
  assert.ok(/<a href="files\/exports\/report\.pptx" download>/.test(idx));
});
