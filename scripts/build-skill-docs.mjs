// build-skill-docs.mjs — regenerates index.html's embedded #skill-docs JSON
// blob from the real skills/*/SKILL.md files, so the page's "view source"
// panel per skill can't drift from what's actually installed.
//
//   node scripts/build-skill-docs.mjs
//
// Repo-maintenance only — not part of tools/ (which ships to consumer
// projects via install.sh) or skills/ itself. Run this after any SKILL.md
// change, or after adding/removing a skill, before shipping index.html.
//
// Injects `disable-model-invocation: true` into each skill's frontmatter
// (last line before the closing `---`) so a client that scans this JSON for
// skill definitions doesn't treat the embedded copy as a second, live
// skill — it's a read-only reference copy for the page's viewer, not an
// installable one.
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SKILLS_DIR = path.join(REPO_ROOT, 'skills');
const INDEX_HTML = path.join(REPO_ROOT, 'index.html');

const skillNames = fs.readdirSync(SKILLS_DIR)
  .filter((name) => fs.statSync(path.join(SKILLS_DIR, name)).isDirectory())
  .sort();

const docs = {};
for (const name of skillNames) {
  const skillMdPath = path.join(SKILLS_DIR, name, 'SKILL.md');
  if (!fs.existsSync(skillMdPath)) {
    console.error(`skipping ${name}: no SKILL.md`);
    continue;
  }
  const raw = fs.readFileSync(skillMdPath, 'utf8');
  const lines = raw.split('\n');
  if (lines[0].trim() !== '---') {
    console.error(`skipping ${name}: no frontmatter delimiter at line 1`);
    continue;
  }
  const closeIdx = lines.indexOf('---', 1);
  if (closeIdx === -1) {
    console.error(`skipping ${name}: no closing frontmatter delimiter`);
    continue;
  }
  if (!lines.slice(0, closeIdx).some((l) => l.startsWith('disable-model-invocation:'))) {
    lines.splice(closeIdx, 0, 'disable-model-invocation: true');
  }
  let doc = lines.join('\n');
  // Multi-mode skills keep each mode in references/<mode>.md; append the top-level reference files so
  // the viewer still shows the whole skill, not only its router.
  const refDir = path.join(SKILLS_DIR, name, 'references');
  if (fs.existsSync(refDir)) {
    for (const f of fs.readdirSync(refDir).filter((f) => f.endsWith('.md')).sort()) {
      doc += `\n\n<!-- references/${f} -->\n` + fs.readFileSync(path.join(refDir, f), 'utf8');
    }
  }
  docs[name] = doc;
}

const json = JSON.stringify(docs);
const html = fs.readFileSync(INDEX_HTML, 'utf8');
const openTag = '<script type="application/json" id="skill-docs">';
const closeTag = '</script>';
const start = html.indexOf(openTag);
if (start === -1) throw new Error('could not find #skill-docs script tag in index.html');
const contentStart = start + openTag.length;
const end = html.indexOf(closeTag, contentStart);
if (end === -1) throw new Error('could not find closing </script> for #skill-docs');

let updated = html.slice(0, contentStart) + json + html.slice(end);

// Keep the numbers on the page true: the hero's total skill count (a word) and each phase's
// count in the ribbon (the cards in that phase's section). scripts/validate.mjs checks both.
const ones = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const words = (n) => n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
const total = Object.keys(docs).length;
updated = updated.replace(/(<p class="hero-subhead">)[\w-]+( <span class="slash">\/<\/span>skills)/, `$1${words(total)}$2`);
for (const phase of ['before', 'discover', 'decide', 'design', 'deliver', 'anytime']) {
  const s = updated.indexOf(`id="${phase}"`);
  const body = updated.slice(s, updated.indexOf('</section>', s));
  const n = (body.match(/class="card-name"/g) || []).length;
  updated = updated.replace(new RegExp(`(<a href="#${phase}" data-phase="${phase}">\\s*<div class="num">[\\s\\S]*?<div class="count">)\\d+ skills?(</div>)`), `$1${n} skill${n === 1 ? '' : 's'}$2`);
}
fs.writeFileSync(INDEX_HTML, updated);
console.log(`wrote ${Object.keys(docs).length} skill docs into index.html`);
