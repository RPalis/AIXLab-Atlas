# Semantic Role Mold

Every prototype in this suite binds these exact CSS variable and Tailwind key names to a brand's Layer 1 raw palette. Rebind values per brand; never rename, add, or drop a role. Other skills in this suite (component code, [`audit`](../../audit/SKILL.md), [`storybook`](../../storybook/SKILL.md)) assume this exact shape.

## Background / Surface
| CSS Variable | Tailwind Key | Role |
|---|---|---|
| `--bg-page` | `bg-page` | Application backdrop |
| `--surface` | `bg-surface` | Cards, panels, modals |
| `--surface-hover` | `bg-surface-hover` | Row hover, list hover |
| `--surface-border` | `border-surface-border` | Dividers, card strokes |
| `--border-input` | `border-input` | Form field borders |
| `--border-emphasis` | `border-emphasis` | Selected/active borders |

## Text
| CSS Variable | Tailwind Key | Role |
|---|---|---|
| `--text-primary` | `text-primary` | Headings, primary labels |
| `--text-secondary` | `text-secondary` | Subtitles, supporting copy |
| `--text-muted` | `text-muted` | Placeholders, timestamps |
| `--text-brand` | `text-brand` | Brand-colored text/links |

## Action
| CSS Variable | Tailwind Key | Role |
|---|---|---|
| `--action-primary` | `action-primary` | Primary CTA background |
| `--action-primary-hover` | `action-primary-hover` | Primary CTA hover |
| `--action-primary-active` | `action-primary-active` | Primary CTA pressed state |
| `--action-secondary` | `action-secondary` | Secondary buttons |
| `--action-accent` | `action-accent` | Highlight accents |
| `--action-accent-foreground` | `action-accent-foreground` | Text/icon on accent background |
| `--focus-ring` | `focus-ring` | `:focus-visible` outlines |

## Elevation & Chrome
| CSS Variable | Tailwind Key | Role |
|---|---|---|
| `--shadow-card` | `shadow-card` | Resting elevation on cards/panels |
| `--shadow-hover` | `shadow-hover` | Elevation on hover/focus |
| `--scrollbar-thumb` | (CSS-only, not a Tailwind key) | Custom scrollbar thumb color |

If the brand calls for more elevation range than two shadow tiers, use a numbered ladder instead (`--shadow-level1` … `--shadow-level5`, and a matching `--radius-level1` … `--radius-level5`) mapped into `tailwind.config.js`'s `boxShadow`/`borderRadius`. Pick one convention; don't mix the two-tier and ladder approaches in the same prototype.

## Status (RGB triplets, required for Tailwind opacity modifiers like `bg-status-success/15`)
| CSS Variable | Tailwind Key | Role |
|---|---|---|
| `--status-success-rgb` / `--status-success-text` | `status-success` / `status-success-text` | Success states, badges |
| `--status-error-rgb` / `--status-error-text` | `status-error` / `status-error-text` | Errors, destructive actions |
| `--status-warning-rgb` / `--status-warning-text` | `status-warning` / `status-warning-text` | Warnings, caution states |
| `--status-info-rgb` / `--status-info-text` | `status-info` / `status-info-text` | Informational states |
| `--status-pending-rgb` / `--status-pending-text` | `status-pending` / `status-pending-text` | *(add only if the app has a pending/in-progress workflow state)* |
| `--status-neutral-rgb` / `--status-neutral-text` | `status-neutral` / `status-neutral-text` | *(add only if the app has a neutral/inactive workflow state)* |

Status roles are never optional once a brand has any workflow-state UI (badges, alerts, banners). Do not fall back to raw Tailwind palette classes (`bg-red-50`, `text-amber-800`) for status color, even temporarily. That reintroduces per-component `dark:` overrides and defeats the whole point of Layer 2.

## Dark Mode
Every role above must be rebound under `.dark` in `index.css` by default, never left to inherit the light value, and never patched with a per-component `dark:` override in JSX. The one accepted exception is a prototype that needs one specific region to stay permanently dark or light regardless of the app-wide theme (e.g. a dashboard canvas). Scope that rebind to the component's own root class instead of `.dark`, and keep it the rare exception rather than the pattern.
