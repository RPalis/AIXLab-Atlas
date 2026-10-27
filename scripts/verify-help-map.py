#!/usr/bin/env python3
"""Checks that the help skill's maps and the repo's skill lists match the skills on disk.
Run from the repo root: python3 scripts/verify-help-map.py
Exit code 0 = all checks pass, 1 = at least one failed."""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
skills = sorted(d for d in os.listdir('skills') if os.path.isfile(f'skills/{d}/SKILL.md'))
fails = []


def check(name, ok, detail=''):
    print(('PASS  ' if ok else 'FAIL  ') + name + (f'  {detail}' if detail and not ok else ''))
    if not ok:
        fails.append(name)


def read(p):
    return open(p, encoding='utf8').read()


# 1. every backticked name in the role map's table is a real skill
rm = read('skills/help/references/role-phase-map.md')
table_lines = [l for l in rm.splitlines() if l.startswith('|') and not l.startswith('|---')]
names = set()
for l in table_lines[1:]:
    cells = l.split('|')[1:-1]
    if len(cells) == 4:                       # role | phase | core | optional
        for c in cells[2:]:
            names |= set(re.findall(r'`([a-z][a-z-]*)`', c))
bad = sorted(n for n in names if n not in skills)
check('role map names only real skills', not bad, str(bad))
check('role map covers 6 roles', len({l.split('|')[1].strip() for l in table_lines[1:] if len(l.split('|')) == 6}) == 6)

# 2. atlas reference lists every skill
atlas = read('skills/help/references/atlas.md')
missing = [s for s in skills if s != 'help' and f'](../../{s}/SKILL.md)' not in atlas]
check('atlas.md links every skill', not missing, str(missing))

# 3. AGENTS.md table lists every skill and nothing extra
agents = read('AGENTS.md')
listed = set(re.findall(r'\|\s*`skills/([a-z-]+)`\s*\|', agents))
check('AGENTS.md table lists every skill', not (set(skills) - listed), str(sorted(set(skills) - listed)))
check('AGENTS.md table has no removed skill', not (listed - set(skills)), str(sorted(listed - set(skills))))

# 4. README links every skill
readme = read('README.md')
rl = set(re.findall(r'\]\(skills/([a-z-]+)/SKILL\.md\)', readme))
check('README links every skill', not (set(skills) - rl), str(sorted(set(skills) - rl)))

# 5. descriptions within the 1,024-character limit, required sections present
for s in skills:
    t = read(f'skills/{s}/SKILL.md')
    fm = re.match(r'---\n(.*?)\n---', t, re.S)
    desc = ''
    if fm:
        raw = re.search(r'^description:(.*)', fm.group(1), re.M)
        if raw and raw.group(1).strip() not in ('>-', '>', '|', '|-'):
            desc = raw.group(1).strip()
        else:
            block = fm.group(1).split('description:', 1)[1].split('\n', 1)[1]
            desc = ' '.join(l.strip() for l in block.splitlines() if l.startswith('  '))
    m = fm
    check(f'{s}: description <= 1024', bool(m) and len(desc) <= 1024, str(len(desc)))
    check(f'{s}: Output Discipline and Environment present', '## Output Discipline' in t and '## Environment' in t)

# 6. help stays lean
n = len(read('skills/help/SKILL.md').splitlines())
check('help SKILL.md stays under 120 lines', n < 120, str(n))

# 7. plugin descriptions state the real skill count
for f in ('.claude-plugin/plugin.json', '.claude-plugin/marketplace.json'):
    ok = f'{len(skills)} UX design skills' in read(f)
    check(f'{f} says {len(skills)} skills', ok)

print(f'\n{len(fails)} failed' if fails else '\nall checks passed')
sys.exit(1 if fails else 0)
