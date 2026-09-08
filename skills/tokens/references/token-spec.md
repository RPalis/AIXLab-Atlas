# Token Architecture Specification

## Standard Semantic Token Matrix

| Token Name | CSS Custom Property | Light Mode Value | Dark Mode Value | Usage / Role |
|---|---|---|---|---|
| `bg-page` | `--bg-page` | Gray 50 / `#F9FAFB` | Deep Slate / `#0B0F19` | Application backdrop |
| `surface` | `--surface` | White / `#FFFFFF` | Gray 900 / `#111827` | Cards, panels, modals |
| `surface-hover` | `--surface-hover` | Gray 100 / `#F3F4F6` | Gray 800 / `#1F2937` | Table row hover, list hover |
| `surface-border` | `--surface-border` | Gray 200 / `#E5E7EB` | Gray 700 / `#374151` | Dividers, card strokes |
| `text-primary` | `--text-primary` | Gray 900 / `#111827` | Gray 50 / `#F9FAFB` | Main headings, primary labels |
| `text-secondary` | `--text-secondary` | Gray 600 / `#4B5563` | Gray 400 / `#9CA3AF` | Subtitles, supporting copy |
| `text-muted` | `--text-muted` | Gray 400 / `#9CA3AF` | Gray 500 / `#6B7280` | Placeholders, timestamps |
| `action-primary` | `--action-primary` | Primary Brand Hue | Brand Accent Hue | Primary CTAs, active highlights |
| `action-primary-hover` | `--action-primary-hover` | Primary Hover Tier | Accent Hover Tier | Hover state on primary CTA |
| `action-primary-active` | `--action-primary-active` | Primary Active Tier | Accent Active Tier | Pressed/active state on primary CTA |
| `shadow-card` | `--shadow-card` | Soft, low-opacity | Slightly stronger opacity | Resting elevation on cards/panels |
| `shadow-hover` | `--shadow-hover` | Medium opacity | Stronger opacity | Elevation on hover/focus |
| `scrollbar-thumb` | `--scrollbar-thumb` | Gray 200 | Gray 700 | Custom scrollbar styling |
| `focus-ring` | `--focus-ring` | Primary / 40% alpha | Accent / 50% alpha | Keyboard focus outlines |

See [`../../forge/references/semantic-role-mold.md`](../../forge/references/semantic-role-mold.md) for the complete role list including status, border, and action-secondary/accent roles.
