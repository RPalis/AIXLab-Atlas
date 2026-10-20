#!/bin/bash
# check-hardcoded-colors.sh <path> [path...]
#
# Kept for existing callers. The real check now lives in tools/design-check, which also
# catches dark: overrides, transition-all and missing reduced-motion rules, supports
# --json and inline suppressions, and exits 0 clean / 1 findings / 2 usage error.
# This wrapper runs only the two color rules (raw hex, raw Tailwind palette classes).

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: check-hardcoded-colors.sh <path> [path...]" >&2
  exit 2
fi

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$HERE/../design-check/design-check.mjs" --rules hex,palette "$@"
