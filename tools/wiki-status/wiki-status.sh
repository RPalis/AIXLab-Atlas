#!/bin/bash
# wiki-status.sh [--check] [repo-root]
#
# Lists what the wiki has not processed yet. No model, no judgment: it only
# compares files on disk with the wiki's own markers. Prints one line per item:
#
#   UNREGISTERED <path>   a file in sources/ that notes/wiki/sources.md does not mention
#   LOOSE <path>          a file in the docs root that no skill owns (move it to sources/)
#   NEW <path>            a my-notes/ or artifacts/ file with no wiki footer
#   CHANGED <path>        a my-notes/ or artifacts/ file edited after its footer date
#   DRAFTS <n>            wiki pages with "status: draft" (waiting for review)
#   LINT <n>              days since the last lint line in log.md, or "never"
#   NOREADME <dir>        a folder under sources/, artifacts/ or notes/ with no README.md (informational)
#   OK                    nothing pending
#
# Exit 0 always, unless --check is set: then exit 1 when anything is pending
# (UNREGISTERED, LOOSE, NEW, CHANGED or DRAFTS), so a caller can gate on it.
# Used by `help`, `package`, `doctor` and `wiki` itself.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHECK=""
[ "${1:-}" = "--check" ] && { CHECK=1; shift; }
REPO="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
cd "$REPO"

DOCS="$("$HERE/../find-docs-folder/find-docs-folder.sh" "$REPO" 2>/dev/null)" || { echo "OK"; exit 0; }
WIKI="$DOCS/notes/wiki"
PENDING=0
emit() { echo "$1"; PENDING=1; }

# 1. sources/ files the register does not mention (match on the path after sources/)
if [ -d "$DOCS/sources" ]; then
  while IFS= read -r f; do
    rel="${f#"$DOCS"/sources/}"
    if [ ! -f "$WIKI/sources.md" ] || ! grep -qF "$rel" "$WIKI/sources.md"; then
      emit "UNREGISTERED $f"
    fi
  done < <(find "$DOCS/sources" -type f ! -name 'README.md' ! -name '.gitkeep' ! -name '.DS_Store' | sort)
fi

# 2. loose files in the docs root that no skill owns
KNOWN=" README.md UNKNOWNS.md GLOSSARY.md PRODUCT_BRIEF.md COMPETITIVE_ANALYSIS.md PERSONA_WALKTHROUGH.md JOURNEY_MAP.md OKR.md OOUX_OBJECT_MAP.md REQUIREMENTS.md USER_GUIDE.md PROBLEM_STATEMENTS.md BRAINSTORM.md UX_BENCHMARK.md VISUAL_LANGUAGE.md DESIGN.md "
while IFS= read -r f; do
  name="$(basename "$f")"
  case "$KNOWN" in *" $name "*) continue ;; esac
  case "$name" in .*) continue ;; esac
  emit "LOOSE $f"
done < <(find "$DOCS" -maxdepth 1 -type f | sort)

# 3. hand-written files without a current footer
check_footer() {
  local f="$1" date
  date="$(grep -o 'Incorporated into the wiki on [0-9-]*' "$f" 2>/dev/null | tail -1 | grep -o '[0-9-]*$' || true)"
  if [ -z "$date" ]; then emit "NEW $f"
  elif [ -n "$(find "$f" -newermt "$date 23:59:59" 2>/dev/null)" ]; then emit "CHANGED $f"
  fi
}
for dir in "$DOCS/notes/my-notes" "$DOCS/artifacts"; do
  [ -d "$dir" ] || continue
  while IFS= read -r f; do check_footer "$f"; done < <(find "$dir" -type f -name '*.md' ! -name 'README.md' | sort)
done

# 4. folders without a README (informational: does not make --check fail)
while IFS= read -r d; do
  [ -f "$d/README.md" ] || echo "NOREADME $d"
done < <(find "$DOCS/sources" "$DOCS/artifacts" "$DOCS/notes" -type d ! -name '.*' ! -path '*/.*' 2>/dev/null | sort)

# 5. drafts and lint age
DRAFTS=0
if [ -d "$WIKI" ]; then
  DRAFTS="$(grep -rl '^status: draft' "$WIKI" --include='*.md' 2>/dev/null | wc -l | tr -d ' ' || true)"
fi
[ "$DRAFTS" -gt 0 ] && emit "DRAFTS $DRAFTS"

if [ -f "$WIKI/log.md" ]; then
  last="$(grep -o '^## \[[0-9-]*\] lint' "$WIKI/log.md" | tail -1 | grep -o '[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}' || true)"
  if [ -n "$last" ]; then
    now="$(date +%s)"
    then_s="$(date -j -f %Y-%m-%d "$last" +%s 2>/dev/null || date -d "$last" +%s)"
    echo "LINT $(( (now - then_s) / 86400 ))"
  else
    echo "LINT never"
  fi
fi

[ "$PENDING" -eq 0 ] && echo "OK"
[ -n "$CHECK" ] && exit "$PENDING"
exit 0
