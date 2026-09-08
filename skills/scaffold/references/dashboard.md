# Type: Dashboard

For prototypes whose core surface is a dashboard of widgets an analyst, advisor, or operator scans at once, rather than a single step-by-step task flow. **Density is a choice, not a requirement**. A dashboard can be sparse (a handful of KPI tiles) or dense (a full analyst workbench); don't default to maximum density just because it's a dashboard.

## Step 1: Define the widget grid

List the widgets the persona actually needs simultaneously visible (from [`persona`](../../persona/SKILL.md); don't invent widgets the walkthrough doesn't call for). For each: its data shape, its size class (full-width / half / quarter), and whether it's a number tile, a chart, or a table. Decide density deliberately per widget, not for the whole dashboard uniformly. A summary tile can stay sparse next to a dense data table.

Lay widgets out in a responsive CSS grid, not a fixed pixel layout. Widgets should reflow at narrower breakpoints rather than horizontally scroll the whole page (individual dense tables *may* scroll within their own widget).

## Step 2: Apply data formatting rules (where density is actually high)

For any widget that does carry dense tabular data:
- Numeric columns: `tabular-nums`, right-aligned; text columns left-aligned.
- Every KPI tile states its comparison basis (vs. prior period, vs. target). A bare number without context is close to useless.
- Use consistent cell padding across every table on the dashboard (see [`audit`](../../audit/SKILL.md) checkpoint 1). Mismatched density between adjacent widgets is the most common tell that a dashboard was assembled from disconnected components.
- Favor sparklines/inline trend indicators over full-size charts inside small tiles; reserve full charts for widgets with real width to spend.

## Step 3: (Optional) Build a presenter/meeting mode

If the persona walkthrough includes presenting this dashboard live to someone else (a client, a stakeholder), add a distinct "presenter mode" rather than reusing the analyst's working view as-is:
- A simplified, larger-type rendering suitable for screen-sharing or a second monitor.
- If the prototype needs the presenter's control view and the audience's display view to be two separate windows that stay in sync, use the browser's `BroadcastChannel` API for same-origin cross-window state sync, no backend needed.

**Completion criterion:** every widget's data ties back to a persona need documented in the walkthrough; no two tables on the same dashboard use different cell-padding conventions; density choices per widget are deliberate, not uniform by default.
