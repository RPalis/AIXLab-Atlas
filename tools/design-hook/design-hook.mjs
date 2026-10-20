#!/usr/bin/env node
// Edit-time design check for Claude Code. Opt in per project; silent everywhere else.
//
//   design-hook.mjs --enable [dir]     create <dir>/.ux-atlas/design-hook (turns the hook on for that project)
//   design-hook.mjs --disable [dir]    remove it
//   design-hook.mjs --status [dir]
//   (no flag)                          PostToolUse mode: reads the hook JSON on stdin
//
// In PostToolUse mode the hook runs design-check on the file that was just written. It exits 2 with the
// findings on stderr, which Claude Code returns to the agent so it can fix them. It exits 0 and prints
// nothing when the project has not opted in, when the file is not UI source, or when the file is clean.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const [flag, dirArg] = process.argv.slice(2);
const marker = d => path.join(path.resolve(d || '.'), '.ux-atlas', 'design-hook');

if (flag === '--enable') { fs.mkdirSync(path.dirname(marker(dirArg)), { recursive: true }); fs.writeFileSync(marker(dirArg), 'on\n'); console.log('design hook enabled for', path.resolve(dirArg || '.')); process.exit(0); }
if (flag === '--disable') { fs.rmSync(marker(dirArg), { force: true }); console.log('design hook disabled'); process.exit(0); }
if (flag === '--status') { console.log(fs.existsSync(marker(dirArg)) ? 'on' : 'off'); process.exit(0); }

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
let ev; try { ev = JSON.parse(input); } catch { process.exit(0); }
const file = ev?.tool_input?.file_path;
const cwd = ev?.cwd || process.cwd();
if (!file || !/\.(tsx|jsx|ts|js|html|vue|svelte|css)$/.test(file) || /\.(test|spec|stories)\./.test(file)) process.exit(0);

// find the opt-in marker walking up from the edited file
let dir = path.dirname(path.resolve(cwd, file)), on = false;
for (let i = 0; i < 8; i++) { if (fs.existsSync(path.join(dir, '.ux-atlas', 'design-hook'))) { on = true; break; } const up = path.dirname(dir); if (up === dir) break; dir = up; }
if (!on) process.exit(0);

const r = spawnSync('node', [path.join(HERE, '..', 'design-check', 'design-check.mjs'), '--json', '--rules', 'hex,palette,dark-override,transition-all', path.resolve(cwd, file)], { encoding: 'utf8' });
if (r.status !== 1) process.exit(0);
let out; try { out = JSON.parse(r.stdout); } catch { process.exit(0); }
const lines = out.findings.map(f => `  ${path.relative(cwd, f.file)}:${f.line}  ${f.rule}  ${f.text}`);
process.stderr.write(`UX Atlas design check: ${out.findings.length} finding(s) in the file you just edited. Replace each with a semantic token class (see styleguide), or add "design-check-ignore <rule>: <reason>" if it is intentional.\n${lines.join('\n')}\n`);
process.exit(2);
