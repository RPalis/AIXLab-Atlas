# Figma: import mode

Part of the [`figma`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

The Figma MCP server already generates code from a design (`get_design_context`, `get_screenshot`, `get_metadata`), but its raw output doesn't know this suite's conventions: it won't use our semantic token roles, won't land in the right atomic tier, and won't follow [`scaffold`](../../scaffold/SKILL.md)'s folder layout. This mode wraps it with precise control over the mapping so imported code looks written for this codebase, not pasted in from elsewhere.

### Step 1: Resolve the target and check for an existing mapping

1. Resolve the Figma URL/frame/selection the user gave. Use `get_metadata` to understand its structure before pulling full design context. Large frames should be scoped down to the actual target, not imported wholesale.
2. Check `get_code_connect_map` / `list_file_components_for_code_connect` for this file. If components in the target already have a Code Connect mapping to real components in *this* codebase, reuse that mapping instead of generating new code for something that already exists. Don't duplicate a component that Code Connect already knows maps to `Button.tsx`.
3. Pull the actual design content with `get_design_context` and, if useful for verification, `get_screenshot`.

### Step 2: Map colors/spacing/type onto our semantic roles, not Figma's raw values

Pull `get_variable_defs` for the target. For each value used:
- If it matches (or closely matches) an existing role in [`styleguide/references/semantic-role-mold.md`](../../styleguide/references/semantic-role-mold.md), use that semantic Tailwind class (`bg-surface`, `text-primary`), never the raw hex or Figma's literal pixel value.
- If it's a genuinely new value with no existing role, don't invent a one-off token inline. Flag it: this likely means the design introduces a new brand/token decision, which belongs in [`styleguide`](../../styleguide/SKILL.md) (forge mode), not something this mode should silently absorb. Append it to `docs/UNKNOWNS.md` if it's not clear whether it's intentional.

### Step 3: Place the generated code correctly

Follow [`storybook`](../../storybook/SKILL.md)'s tier taxonomy: decide whether the imported piece is an atom/molecule/organism/widget/page and place it in the matching folder from [`scaffold`](../../scaffold/SKILL.md)'s layout. If the tier is ambiguous, ask rather than guessing — a component landing in the wrong tier is exactly the drift `audit`'s `craft` mode consistency checkpoint later catches, better to get it right on import.

### Step 4: Verify before calling it done

Run [`tools/check-hardcoded-colors`](../../../tools/check-hardcoded-colors/check-hardcoded-colors.sh) against the newly imported file(s) — the same check `audit`'s `code` mode runs. Also check, by hand: zero redundant `dark:` overrides, and the component extends the native HTML element's attribute interface rather than a hand-rolled prop list. Imported code fails this far more often than hand-written code — Figma's own code-gen defaults to literal values, so don't skip this step just because the import "looked right."

**Completion criterion:** `tools/check-hardcoded-colors` against the newly imported file returns clean (exit 0), and the component lives in the atomic tier/folder that matches what it actually is.

---
