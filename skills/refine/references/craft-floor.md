# Craft floor

The floor is the minimum a screen must meet before it counts as refined. Every line is a check that gives the same answer for two reviewers. The floor does not choose a visual direction. The brief and the design tokens do that.

## Contents

- Hierarchy and spacing
- Type
- Color and contrast
- Depth
- States
- Browser defaults
- Patterns to remove
- Dark mode

## Hierarchy and spacing

- One primary action per view region. Secondary actions look quieter in weight and fill.
- Group related items tightly. Separate groups generously. Space above a heading is larger than space below it.
- Use one spacing scale (multiples of 4px). A value outside the scale needs a reason.
- Align to one container width and one padding rule, defined once in the app shell.
- Numbers in tables use `tabular-nums` and align right. Text aligns left.

## Type

- Body line length is 65 to 75 characters (`max-w-prose` or about `65ch`).
- Body text is at least 16px on mobile and 14px in dense desktop tables.
- Use at most two type families and at most six sizes on a screen.
- Heading tracking is no tighter than -0.04em. Display size is no larger than 6rem.
- Test real copy at every breakpoint. Do not judge a layout on placeholder text.

## Color and contrast

- Body text is 4.5:1 against its surface. Large text and UI boundaries are 3:1. Run `tools/check-token-contrast`.
- Secondary text on a colored surface takes its hue from that surface. Do not use plain gray on color.
- Neutral grays carry a slight tint of the brand hue. Pure `#000` and pure gray on a dark surface read as flat.
- Color is never the only signal. Pair status color with an icon or text.
- Components use only semantic token classes. Run `tools/design-check`.

## Depth

- A shadow has a vertical offset and a soft blur. A zero-offset colored glow is not depth.
- Use one elevation method per element: a shadow or a border, not both stacked.
- Blur (`backdrop-filter`) is allowed only where it keeps content legible behind a sticky layer. It has a paint cost on low-end phones. Never use it as decoration.
- Card radius sits in one range (12 to 16px) across the product.

## States

Every interactive element has: default, hover, focus-visible, active, disabled, and, where data loads, loading, error and empty. Check each one in light and dark. Keyboard focus uses the `focus-ring` token at 3:1.

## Browser defaults

Theme the details a browser draws by default: text selection color, caret color (`caret-color`), scrollbar thumb (`--scrollbar-thumb`), form `accent-color`, and `color-scheme` on `:root` so native controls follow the theme.

## Patterns to remove

| Pattern | Why it fails | Replace with |
|---|---|---|
| Identical icon, heading and text cards repeated as the whole page | No hierarchy; the eye has nowhere to land | One lead item, then a denser list or table |
| Cards inside cards | Doubles borders and padding | One surface, then spacing or a divider |
| Gradient text | Low contrast at the edges; ignores tokens | Solid `text-primary` or `text-brand` |
| Colored side-stripe on a card | Decoration with no meaning | An icon or a status badge |
| Decorative glass or blur | Paint cost; weak contrast | A solid surface token |
| A modal for a simple choice | Interrupts without need | Inline control or popover |
| Emoji or Unicode glyphs as icons | Render differently per platform | Lucide icons |
| `transition-all` | Animates layout; drops frames | `transition-colors`, `transition-[opacity,transform]` |
| Bounce or elastic easing | Reads as playful; delays the result | Ease-out, 150 to 250ms |
| Eyebrow label above every heading | Adds noise | Delete it unless it carries information |

## Dark mode

- Surfaces are dark neutrals with a hint of the brand hue. Layers get lighter as they rise.
- Do not invert light mode. Rebind each role. See `styleguide`.
- Check shadows. A dark shadow disappears on a dark surface, so rely on border and surface step.
- Re-check contrast for every text pair. A pair that passes in light can fail in dark.
