# Motion

Motion explains a change. It does not decorate. Use it for feedback, for continuity between states, and for focus.

## Contents

- Rules
- Durations and easing
- Properties that are safe to animate
- Reduced motion
- Patterns

## Rules

- Every animation answers a question: what changed, where did it go, what can I do now.
- One deliberate moment per view. Do not add the same entrance to every section.
- Start from a visible default state. Content must be readable if the animation never runs.
- Never block input while an animation plays.

## Durations and easing

| Use | Duration | Easing |
|---|---|---|
| Hover, press, toggle | 100 to 150ms | ease-out |
| Menu, tooltip, popover | 150 to 200ms | ease-out |
| Panel, modal, drawer enter | 200 to 300ms | ease-out |
| Exit | 70% of the enter time | ease-in |
| Page or route change | 200 to 300ms | ease-in-out |

Do not use bounce or elastic curves. Do not exceed 500ms for any UI response.

## Properties that are safe to animate

Animate `transform` and `opacity`. They run on the compositor and do not trigger layout. Avoid animating `width`, `height`, `top`, `left`, `margin` and `box-shadow` on large areas. To animate height, use a grid-row transition (`grid-template-rows: 0fr` to `1fr`) or `transform: scaleY`. Name the properties in `transition-[...]`. Do not use `transition-all`.

## Reduced motion

The token file includes a `prefers-reduced-motion: reduce` rule that cuts durations to near zero. Keep it. For motion that carries meaning (a progress bar, a slide that shows direction), keep the state change and drop the travel: use an opacity fade instead of a slide.

```css
@media (prefers-reduced-motion: reduce) {
  .toast { transition: opacity 100ms linear; transform: none; }
}
```

Autoplaying video, parallax and looping animation must pause under this setting. Provide a visible pause control for anything that moves for more than 5 seconds (WCAG 2.2.2).

## Patterns

- Skeleton loaders that match the final layout, not generic spinners.
- Optimistic updates with a quiet rollback message.
- Shared-element transitions with the View Transitions API where the browser supports it. Fall back to no animation.
- Stagger lists by 30 to 50ms for at most 8 items.
