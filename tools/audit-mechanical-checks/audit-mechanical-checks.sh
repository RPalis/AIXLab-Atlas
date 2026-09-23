#!/bin/bash
# audit-mechanical-checks.sh <src-path> [repo-root]
#
# The grep-able, non-deliberative half of `audit`'s `code` mode (checkpoints 2, 3, 6
# — see skills/audit/SKILL.md). Deliberative checkpoints (structure/logic separation,
# duplicated JSX, component reuse) still need a real read and stay in the skill; this
# script only finds candidates for the mechanical ones. <repo-root> defaults to the
# git root and is only used for the repo-hygiene check; <src-path> is checked for the
# other two.
#
# Exits 1 if anything is found in any section, 0 if clean.

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: audit-mechanical-checks.sh <src-path> [repo-root]" >&2
  exit 2
fi
SRC="$1"
REPO="${2:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
EXCLUDES=(--exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=.git)

found=0

echo "== clickable non-semantic elements (checkpoint 2) =="
hits=$(grep -rnE "${EXCLUDES[@]}" '<div[^>]*onClick=' "$SRC" 2>/dev/null || true)
if [ -n "$hits" ]; then
  echo "$hits"
  echo "-> clickable <div>s: should be a <button> (or carry role=\"button\" + keyboard handling) instead."
  found=1
else
  echo "none found"
fi

echo ""
echo "== files with interactive elements but no focus-visible styling anywhere (checkpoint 3) =="
# Coarse, file-level heuristic (not element-level): a file that has a <button>,
# role="button", or onClick but never mentions focus:ring/focus-visible anywhere is
# a real candidate; a file that has the styling somewhere may still miss it on one
# specific element, which this script can't tell — read the file for that.
interactive_files=$(grep -rlE "${EXCLUDES[@]}" '<button|role="button"|onClick=' "$SRC" 2>/dev/null || true)
any_missing=0
if [ -n "$interactive_files" ]; then
  while IFS= read -r f; do
    if ! grep -qE 'focus:ring|focus-visible' "$f" 2>/dev/null; then
      echo "$f"
      any_missing=1
    fi
  done <<< "$interactive_files"
fi
if [ "$any_missing" -eq 1 ]; then
  echo "-> no focus:ring*/focus-visible: anywhere in these files despite interactive elements."
  found=1
else
  echo "none found"
fi

echo ""
echo "== repo-root hygiene (checkpoint 6, checked at $REPO) =="
hygiene_hits=$(find "$REPO" -maxdepth 1 \( -name '~$*' -o -name '*.zip' -o -iname '*-production' -o -name '*.DS_Store' \) 2>/dev/null || true)
if [ -n "$hygiene_hits" ]; then
  echo "$hygiene_hits"
  echo "-> lock files, zips, or a generated production/ folder at the repo root — confirm these are meant to ship or clean them up."
  found=1
else
  echo "none found"
fi

exit "$found"
