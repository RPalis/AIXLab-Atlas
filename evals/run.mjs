#!/usr/bin/env node
// node evals/run.mjs list
// node evals/run.mjs sheet <skill> [model]     prints a Markdown grading sheet
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const [cmd, skill, model = 'sonnet'] = process.argv.slice(2);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();

if (cmd === 'list') {
  for (const f of files) { const e = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); console.log(`${e.skill.padEnd(14)} ${e.cases.length} cases${e.trigger ? `, ${e.trigger.should_start.length}+${e.trigger.should_not_start.length} trigger` : ''}`); }
} else if (cmd === 'sheet' && skill) {
  const f = path.join(dir, `${skill}.json`);
  if (!fs.existsSync(f)) { console.error(`no evals for ${skill}`); process.exit(2); }
  const e = JSON.parse(fs.readFileSync(f, 'utf8'));
  console.log(`# ${skill} on ${model}\n\nDate: ____  Plugin version: ____\n`);
  e.cases.forEach((c, i) => {
    console.log(`## Case ${i + 1}: ${c.query}\n${c.setup ? `Setup: ${c.setup}\n` : ''}`);
    c.expected_behavior.forEach(b => console.log(`- [ ] ${b}`));
    console.log('');
  });
  if (e.trigger) {
    console.log('## Trigger\n');
    e.trigger.should_start.forEach(q => console.log(`- [ ] starts: "${q}"`));
    e.trigger.should_not_start.forEach(q => console.log(`- [ ] does not start: "${q}"`));
  }
} else { console.error('usage: run.mjs list | sheet <skill> [model]'); process.exit(2); }
