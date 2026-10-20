# Tailwind v4 mapping

Prototypes in this suite use Tailwind CSS v4 (`tailwindcss@4` with `@tailwindcss/vite`). There is no `tailwind.config.js` and no PostCSS file. The token file `src/index.css` holds the mapping.

## Contents

- How a role becomes a class
- Role-to-class table
- Elevation and radius ladders
- Moving a v3 prototype to v4
- Rules that do not change

## How a role becomes a class

Layer 2 variables (`--surface`) stay in `:root` and `.dark`. A `@theme inline` block maps each one to a Tailwind theme key (`--color-surface: var(--surface)`). The word `inline` makes the generated class read the live variable, so the `.dark` class flips it with no `dark:` variant.

Tailwind v4 shares one `--color-*` namespace across `bg-`, `text-`, `border-`, `ring-` and the other color utilities. A key named `--color-surface` therefore also creates `text-surface`. That is harmless. Use only the classes in the table.

## Role-to-class table

| CSS variable | Theme key | Classes components use |
|---|---|---|
| `--bg-page` | `--color-page` | `bg-page` |
| `--surface` | `--color-surface` | `bg-surface` |
| `--surface-hover` | `--color-surface-hover` | `bg-surface-hover` |
| `--surface-border` | `--color-surface-border` | `border-surface-border` |
| `--border-input` | `--color-input` | `border-input` |
| `--border-emphasis` | `--color-emphasis` | `border-emphasis` |
| `--text-primary` | `--color-primary` | `text-primary` |
| `--text-secondary` | `--color-secondary` | `text-secondary` |
| `--text-muted` | `--color-muted` | `text-muted` |
| `--text-brand` | `--color-brand` | `text-brand` |
| `--action-*` | `--color-action-*` | `bg-action-primary`, `bg-action-accent`, `text-action-accent-foreground` |
| `--focus-ring` | `--color-focus-ring` | `ring-focus-ring`, `outline-focus-ring` |
| `--status-<s>-rgb` | `--color-status-<s>` | `bg-status-success`, `bg-status-success/15` |
| `--status-<s>-text` | `--color-status-<s>-text` | `text-status-success-text` |
| `--shadow-card`, `--shadow-hover` | `@utility shadow-card` | `shadow-card`, `hover:shadow-hover` |

The elevation roles keep the same name for the variable and the utility. A theme key with that name would point at itself, so they register as `@utility` rules instead:

```css
@utility shadow-card { box-shadow: var(--shadow-card); }
```

## Elevation and radius ladders

For a numbered ladder, define `--shadow-level1` to `--shadow-level5` and `--radius-level1` to `--radius-level5` in `:root` and `.dark`. Register each step:

```css
@utility shadow-level1 { box-shadow: var(--shadow-level1); }
@utility rounded-level1 { border-radius: var(--radius-level1); }
```

## Moving a v3 prototype to v4

1. Run `npx @tailwindcss/upgrade` on a clean branch. It updates dependencies, the Vite config and most class renames.
2. Delete `tailwind.config.js` and `postcss.config.js` once the tool moves their content.
3. Replace the three `@tailwind` lines in `index.css` with `@import "tailwindcss";`.
4. Copy the `@theme inline` block and the `@utility` rules from [`../templates/index.css`](../templates/index.css). Keep the project's own Layer 1 and Layer 2 values.
5. Run `tools/design-check` and `tools/check-token-contrast`. Class names in components do not change, so both should give the same results as before.
6. Build and compare light and dark screens.

## Rules that do not change

- Components use only Layer 2 classes. No raw hex, no palette classes, no `dark:` variants.
- Every role exists in `:root` and is rebound in `.dark`.
- Status roles are real tokens.
