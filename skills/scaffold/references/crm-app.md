# Type: CRM / Record-Management App

For prototypes whose core surface is managing records through a lifecycle: contacts, deals, tickets, cases, or any object that moves through stages over time. This type leans heavily on [`concepting`](../../concepting/SKILL.md)'s OOUX modeling. Do that first if it hasn't been done, since a CRM's entire UI shape follows from its object/relationship/CTA model.

## Step 1: List view, detail view, and the relationship between them

Every record type needs:
- A **list/table view**: filterable, sortable, searchable, with the columns that actually matter for triage (not every field; see `audit`'s cognitive-load "chunking" rule).
- A **detail view**: the full record, its related records (a contact's deals, a deal's activity), and the CTAs available from its current lifecycle stage (per `concepting`'s CTA modeling).

Keep navigation between them obvious. Clicking a list row goes to detail; detail has a clear way back to the filtered list state, not just "back" that loses filters.

## Step 2: Stage-based views (pipeline/kanban), if the object has real stages

If `concepting` modeled a stage-transition lifecycle (Draft → Qualified → Won/Lost, or similar), consider a kanban/pipeline view as a first-class alternative to the table view, dragging a card between columns as the primary way to trigger a stage-transition CTA. Only build this if stages are a real, small, ordered set (roughly 3-7). A kanban view for a lifecycle with too many stages or non-linear transitions becomes worse than a table.

## Step 3: Activity timeline per record

Records with any meaningful history (calls logged, emails sent, notes added, stage changes) need a chronological activity feed on the detail view. This is usually the second-most-used surface after the record fields themselves, and is exactly the kind of thing `audit`'s persona pass (especially Alex, the power user who wants efficient scanning) will flag if missing or hard to scan.

## Step 4: Bulk actions on the list view

Once there's a list view with more than a handful of rows, selecting multiple records and acting on them (bulk status change, bulk assign, bulk export) becomes a real need. Check the persona walkthrough for whether this matters before building it; don't add it reflexively.

## Step 5: Inline edit vs. modal edit: pick one convention and stay consistent

Decide once whether editing a record happens inline (click a field, it becomes editable) or via a modal/side-panel, and apply that convention everywhere. Mixing the two within the same app is exactly the kind of inconsistency `audit`'s Nielsen heuristic 4 (Consistency & Standards) penalizes.

**Completion criterion:** every record type has both a list and detail view with clear navigation between them; if a kanban view exists, it maps directly to a real, small stage set from `concepting`; the edit convention (inline vs. modal) is applied uniformly.
