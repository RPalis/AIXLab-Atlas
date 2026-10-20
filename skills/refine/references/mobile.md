# Mobile layouts and touch

Use this reference for phone and tablet prototypes, and for any responsive screen that people will use by touch. The prototype is a mobile-first web build. Follow the platform conventions it will be handed to.

## Contents

- Touch and reach
- Safe areas and viewport
- Navigation patterns
- Text scaling
- Gestures and feedback
- Forms on phones
- Platform conventions
- Checklist

## Touch and reach

- Touch targets are at least 44x44pt on iOS and 48x48dp on Android. WCAG 2.2 sets the floor at 24x24 CSS px (2.5.8). Use the larger platform size.
- Leave at least 8px between adjacent targets.
- Put the primary action in the lower half of the screen where a thumb reaches. Put destructive actions out of easy reach.
- Make the whole row tappable in a list, not only the text.

## Safe areas and viewport

- Set `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Pad fixed bars with the safe-area insets so the notch and home indicator never cover content:

```css
@utility pt-safe { padding-top: env(safe-area-inset-top); }
@utility pb-safe { padding-bottom: env(safe-area-inset-bottom); }
```

- Use `dvh` units for full-height screens. `100vh` hides content behind the browser bar.
- Do not disable zoom (`user-scalable=no`). That fails WCAG 1.4.4.

## Navigation patterns

| Pattern | Use when |
|---|---|
| Bottom tab bar (3 to 5 destinations) | Top-level areas that people switch between often |
| Top app bar with back | Drill-down inside one area |
| Bottom sheet | A short task or choice that keeps context |
| Navigation drawer | Many destinations, low frequency (Android) |
| Full-screen modal | A focused task with its own save and cancel |

On iOS the back action sits top-left and the swipe-from-edge gesture goes back. On Android the system back must work from every screen. Keep tab bar order stable. Show labels with icons.

## Text scaling

- Size type in `rem`, not `px`, so the user's text size setting applies.
- Test at 200% text size. Nothing may clip or overlap. Containers grow; they do not use fixed heights for text.
- Minimum body text is 16px. Inputs are 16px or larger, which also stops iOS Safari from zooming on focus.

## Gestures and feedback

- Every gesture has a visible button alternative (swipe to delete also has a delete control).
- Show press feedback within 100ms (`active:` state).
- Avoid hover-only UI. Hover does not exist on touch.
- Respect the system back gesture. Do not place a custom swipe at the screen edge.

## Forms on phones

- Use the right `type` and `inputmode` (`email`, `tel`, `numeric`) and `autocomplete` values.
- One column. Labels above fields. Show the primary button above the keyboard or sticky at the bottom.
- Keep the focused field visible when the keyboard opens (`scroll-margin`, `visualViewport`).

## Platform conventions

| Area | iOS | Android (Material 3) |
|---|---|---|
| Touch target | 44pt | 48dp |
| Top bar | Large title that collapses | Top app bar, center-aligned or small |
| Primary action | In-content button or bar button | Floating action button or filled button |
| Dialogs | Centered alert, action sheet | Dialog with text buttons, bottom sheet |
| Typography | SF Pro, Dynamic Type | Roboto or Google Sans, type scale in `sp` |
| Icons | SF Symbols style | Material Symbols |

A web prototype shows one coherent look. When the product ships on both platforms, record the differences in `DESIGN.md` and in a decision record rather than faking both in one build.

## Checklist

- Every target is 44pt or larger and spaced.
- Bars respect safe areas. Nothing sits under the notch or home indicator.
- The layout holds at 200% text and in landscape.
- Every gesture has a button alternative.
- The primary action is reachable with one thumb.
- No feature depends on hover.
