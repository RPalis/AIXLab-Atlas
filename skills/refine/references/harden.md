# Harden

Make the prototype hold up when real data and real conditions arrive. Do the checks below on every screen that shows data or takes input.

## Contents

- Data extremes
- Failure states
- Input and forms
- Localization and direction
- Permissions and roles
- Checklist

## Data extremes

| Case | What to test |
|---|---|
| Zero items | A designed empty state with an action |
| One item | Layout does not look broken with a single row or card |
| Very long text | Names of 80+ characters truncate with `truncate` or wrap; the full text is reachable (title or expand) |
| Very large numbers | Format with separators; do not overflow the cell |
| Many items | Pagination, virtual list or "load more"; the page stays responsive at 1,000 rows |
| Missing optional fields | Show a dash or hide the row; never show `undefined` or `null` |

## Failure states

- Network failure: a message, a retry action, and the user's input kept.
- Slow response: a loading state after 300ms, a skeleton for lists, a timeout message after 10s.
- Partial failure: show what loaded and mark what did not.
- Stale data: show "Updated 5 min ago" where freshness matters.
- Offline: say so and queue or disable actions. For a PWA, test with the browser set to offline.

## Input and forms

- Validate on blur and on submit. Do not validate while the user is still typing the first time.
- Keep the user's input after an error.
- Prevent double submit: disable the button and show progress.
- Set `autocomplete`, `inputmode` and `type` so phones show the right keyboard.
- Trim whitespace. Accept pasted values with spaces or dashes in phone and card fields.

## Localization and direction

- Text grows. German and Finnish run 30% longer than English. Do not fix widths on buttons or labels.
- Use `Intl.DateTimeFormat`, `Intl.NumberFormat` and `Intl.RelativeTimeFormat`. Do not build date strings by hand.
- Use logical CSS properties (`ms-4`, `ps-4`, `text-start`) so right-to-left languages mirror. Test with `dir="rtl"` on `<html>`.
- Icons that show direction (back arrows, progress) mirror in right-to-left. Icons for objects (a clock, a search glass) do not.
- Do not put text inside images.

## Permissions and roles

Test each persona from the persona switcher. Controls the user cannot use are hidden or disabled with a reason, not left to fail on click.

## Checklist

- Every list has an empty, one-item and long state.
- Every request has loading, error and retry.
- Every form keeps input on error.
- The layout survives 40% longer text and `dir="rtl"`.
- No `undefined`, `null` or `NaN` is visible anywhere.
