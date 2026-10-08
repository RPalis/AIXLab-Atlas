# Audit: perf mode

Part of the [`audit`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Finds what makes a prototype slow to load, slow to respond, or janky. It measures first, then lists causes. It does not fix anything. [`refine`](../../refine/references/performance.md) holds the fixes.

## Contents

- Step 1: Measure
- Step 2: Check the causes
- Step 3: Report
- Budgets

## Step 1: Measure

Measure the built app, not the dev server. Build for production and serve the output (`npm run build && npm run preview`).

- **Lighthouse**: `npx lighthouse http://localhost:4173 --only-categories=performance --form-factor=mobile --output=json --output-path=./lighthouse.json --chrome-flags="--headless"`. Run it on mobile settings by default, then once on desktop.
- **No Chrome headless available**: use the browser tools to load the page, then read `performance.getEntriesByType('navigation')`, the `largest-contentful-paint` and `layout-shift` entries, and the network list.
- **Bundle**: list the files in `dist/assets` by size (`ls -S -l dist/assets | head`). Note the largest script and the total gzip size.

Record each number with how it was measured. If nothing can run, say so and mark the whole report `Not Verified`. Do not estimate numbers.

## Step 2: Check the causes

| Area | Check | Evidence to cite |
|---|---|---|
| Bundle | One script over 250 kB gzip, or no route-level code splitting | file size, import map |
| Dependencies | Whole icon or chart library imported for a few items | import lines |
| Images | No `width`/`height`, original size served, no lazy loading below the fold, no modern format | `<img>` markup, file sizes |
| Fonts | More than two families, no `font-display`, full character sets | `@font-face`, network |
| Render | State held at the app root, inline objects passed to memoized children, no key or unstable keys | component file and line |
| Lists | More than 200 rows rendered at once with no virtualization | component, row count |
| Layout shift | Content that loads late without reserved space | CLS entries, element |
| Motion | `transition-all`, animation of layout properties, `backdrop-filter` on large areas | `tools/design-check` output, CSS |
| Main thread | Long tasks over 50 ms on interaction | performance trace or Lighthouse audit |
| Data | Unbounded mock data load at start, no debounce on search | store code |

Run `node ../../../tools/design-check/design-check.mjs <src> --rules transition-all,motion` for the motion rows.

## Step 3: Report

```markdown
# Performance Audit — [target]

## Measured
| Metric | Value | Budget | Status |
|---|---|---|---|
| LCP | | 2.5 s | |
| INP (or interaction delay) | | 200 ms | |
| CLS | | 0.1 | |
| Total JS (gzip) | | 170 kB | |
| Largest image | | 200 kB | |

How measured: [tool, device profile, network profile]

## Findings (largest cost first)
- **[Area]** — Location: `File.tsx:LINE`. Evidence: [number or line]. Cost: [what it slows]. Fix lens: `refine` performance.

## Passing
[What already meets budget]
```

## Budgets

The numbers are the "good" thresholds for Core Web Vitals (LCP 2.5 s, INP 200 ms, CLS 0.1) plus this suite's defaults for a prototype (170 kB gzip JavaScript, 200 kB for any one image). A project may set its own budgets in its `PRODUCT_BRIEF.md`; use those first.

**Completion criterion:** every number is measured or marked `Not Verified`, and every finding names a file and line or a measurement.
