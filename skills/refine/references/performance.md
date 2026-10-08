# Performance fixes

Apply these after `audit` `perf` mode reports a problem. Fix the largest cost first and measure again.

## Contents

- Load
- Render
- Images and fonts
- Lists and data
- Motion cost
- Verify

## Load

- Split by route with `React.lazy` and `Suspense`. Load the heavy widgets (charts, editors, maps) only on the screens that use them.
- Import icons by name from `lucide-react`. Do not import the whole set.
- Remove unused dependencies. Check the build output with a bundle visualizer.
- Preload the one font and the one hero image that the first view needs. Nothing else.

## Render

- Do not create objects or functions inside a render path that feeds a memoized child.
- Move state down to the component that uses it. A state change at the app root re-renders everything.
- Use `useDeferredValue` or `startTransition` for search-as-you-type over large lists.
- Memoize only after measuring. Profile with the React DevTools Profiler first.

## Images and fonts

- Serve modern formats (AVIF or WebP) at the displayed size. Set `width` and `height` to prevent layout shift.
- Use `loading="lazy"` below the fold. Never lazy-load the largest visible image.
- Use `font-display: swap` and subset to the glyphs you need. Limit to two families.

## Lists and data

- Virtualize lists above about 200 rows (a windowing library or `content-visibility: auto`).
- Debounce search input by 200 to 300ms.
- Keep mock data realistic in size. A 5-row seed hides problems that appear at 5,000.

## Motion cost

- Animate `transform` and `opacity` only. See `motion.md`.
- Remove `backdrop-filter` on large or scrolling areas.
- Avoid `box-shadow` animation on many elements at once.

## Verify

Run the `perf` audit again. Record before and after numbers in the findings file. Stop after the numbers meet the budget.
