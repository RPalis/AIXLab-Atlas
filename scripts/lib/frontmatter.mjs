// Minimal frontmatter reader/writer for this suite's SKILL.md files.
// Handles only the shapes the suite uses: plain scalars, quoted scalars and
// folded (>- or >) block scalars. Not a general YAML parser.
import fs from 'node:fs';

export function splitSkill(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter');
  return { fm: m[1], body: m[2] };
}

export function parseFrontmatter(fm) {
  const out = {};
  const lines = fm.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!m) continue;
    const [, key, rest] = m;
    if (/^[>|][-+]?$/.test(rest)) {
      const buf = [];
      while (i + 1 < lines.length && /^\s+\S|^\s*$/.test(lines[i + 1]) && !/^[A-Za-z_][\w-]*:/.test(lines[i + 1])) {
        buf.push(lines[++i].trim());
      }
      out[key] = buf.join(' ').replace(/\s+/g, ' ').trim();
    } else {
      let v = rest.trim();
      if (/^".*"$/.test(v)) v = v.slice(1, -1).replace(/\\"/g, '"');
      else if (/^'.*'$/.test(v)) v = v.slice(1, -1);
      out[key] = v;
    }
  }
  return out;
}

export function readSkill(file) {
  const { fm, body } = splitSkill(fs.readFileSync(file, 'utf8'));
  return { fm: parseFrontmatter(fm), rawFm: fm, body };
}

export function foldedBlock(key, text, width = 98) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > width) { lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return `${key}: >-\n` + lines.map(l => '  ' + l).join('\n');
}
