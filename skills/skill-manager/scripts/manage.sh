#!/usr/bin/env bash
set -euo pipefail

LIBRARY="$HOME/.agents/skills"
DISABLED="$LIBRARY/.disabled"
TOOL_LINKS=("$HOME/.claude/skills" "$HOME/.gemini/skills")

usage() {
  cat <<EOF
Usage: manage.sh <command> [args]
  install <git-url-or-local-path> [name]   Add a skill to the library
  delete  <name>                           Permanently remove a skill
  disable <name>                           Move a skill out of active use
  enable  <name>                           Restore a disabled skill
  sync                                     Verify/repair tool symlinks
  list                                     List active + disabled skills
  details <name>                           Show full info on one skill
EOF
  exit 1
}

cmd_install() {
  local src="${1:?source required}"
  local name="${2:-}"
  if [[ "$src" == http*://* || "$src" == git@* ]]; then
    name="${name:-$(basename "$src" .git)}"
    git clone --depth 1 "$src" "$LIBRARY/$name"
  else
    name="${name:-$(basename "$src")}"
    cp -R "$src" "$LIBRARY/$name"
  fi
  echo "Installed '$name'"
}

cmd_delete() {
  local name="${1:?skill name required}"
  rm -rf "${LIBRARY:?}/$name" "${DISABLED:?}/$name"
  echo "Deleted '$name'"
}

cmd_disable() {
  local name="${1:?skill name required}"
  [[ -d "$LIBRARY/$name" ]] || { echo "'$name' not found or already disabled"; exit 1; }
  mkdir -p "$DISABLED"
  mv "$LIBRARY/$name" "$DISABLED/$name"
  echo "Disabled '$name'"
}

cmd_enable() {
  local name="${1:?skill name required}"
  [[ -d "$DISABLED/$name" ]] || { echo "'$name' not found in disabled skills"; exit 1; }
  mv "$DISABLED/$name" "$LIBRARY/$name"
  echo "Enabled '$name'"
}

cmd_sync() {
  for link in "${TOOL_LINKS[@]}"; do
    if [[ -L "$link" && "$(readlink "$link")" == "$LIBRARY" ]]; then
      echo "OK: $link"
      continue
    fi
    if [[ -e "$link" || -L "$link" ]]; then
      echo "Fixing $link (was not a correct symlink)"
      rm -rf "$link"
    else
      echo "Creating $link"
    fi
    ln -s "$LIBRARY" "$link"
  done
  echo "Sync complete."
}

# Pulls the `description:` line out of a skill's SKILL.md frontmatter
_get_description() {
  local skill_md="$1/SKILL.md"
  [[ -f "$skill_md" ]] || { echo "(no SKILL.md found)"; return; }
  awk '/^description:/{sub(/^description:[ ]*/,""); print; exit}' "$skill_md"
}

cmd_list() {
  echo "Active:"
  for dir in "$LIBRARY"/*/; do
    name="$(basename "$dir")"
    [[ "$name" == ".disabled" ]] && continue
    desc="$(_get_description "$dir")"
    printf "  %-24s %s\n" "$name" "$desc"
  done | sort

  if [[ -d "$DISABLED" ]] && [[ -n "$(ls -A "$DISABLED" 2>/dev/null)" ]]; then
    echo "Disabled:"
    for dir in "$DISABLED"/*/; do
      name="$(basename "$dir")"
      desc="$(_get_description "$dir")"
      printf "  %-24s %s\n" "$name" "$desc"
    done | sort
  fi
}

cmd_details() {
  local name="${1:?skill name required}"
  local dir="$LIBRARY/$name"
  local status="active"
  if [[ ! -d "$dir" ]]; then
    dir="$DISABLED/$name"
    status="disabled"
  fi
  [[ -d "$dir" ]] || { echo "'$name' not found (checked active and disabled)"; exit 1; }

  echo "Name:        $name"
  echo "Status:      $status"
  echo "Path:        $dir"
  if [[ -d "$dir/.git" ]]; then
    local origin
    origin="$(git -C "$dir" remote get-url origin 2>/dev/null || echo "unknown")"
    echo "Source:      $origin (git)"
  else
    echo "Source:      local (not a git checkout)"
  fi
  echo ""
  if [[ -f "$dir/SKILL.md" ]]; then
    cat "$dir/SKILL.md"
  else
    echo "No SKILL.md found."
  fi
}

case "${1:-}" in
  install) shift; cmd_install "$@" ;;
  delete)  shift; cmd_delete "$@" ;;
  disable) shift; cmd_disable "$@" ;;
  enable)  shift; cmd_enable "$@" ;;
  sync)    cmd_sync ;;
  list)    cmd_list ;;
  details) shift; cmd_details "$@" ;;
  *) usage ;;
esac
