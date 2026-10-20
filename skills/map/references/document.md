# Map: document mode

Part of the [`map`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Once real code exists, regenerates every diagram from the actual built app so they don't go stale as the prototype evolves. Where `site` mode plans and `objects` mode models before anything is built, `document` mode is the after-the-fact refresh: it doesn't invent new structure, it reflects what's actually there.

### Step 1: Refresh the site diagram (Interactive, Mermaid, SVG)

Produces three synced outputs from the actual route tree and component usage — don't hand-edit any of them independently; regenerate all three together whenever the route/component structure changes.

**Interactive (Vis.js modal):**
1. Install the Vis.js network packages:
   ```bash
   npm install vis-network vis-data
   ```
   If the prototype can't add a dependency, load Vis.js as a CDN UMD script (`window.vis`) with a readiness poll instead — only as a fallback when npm install is genuinely blocked, since the typed import is easier to maintain.
2. Embed [`templates/ArchitectureMapModalComponent.tsx`](../templates/ArchitectureMapModalComponent.tsx) in your prototype layout. It accepts `nodes`/`edges` as props; build them from the actual route tree and component usage, don't hardcode the example data.
3. Wire the trigger into the user menu's Prototype Tools section as "Architecture Map" (see [`scaffold`](../../scaffold/SKILL.md)).
4. Set `storybookBasePath` to wherever the embedded static Storybook is served from (default `/storybook/index.html`) so deep links resolve. Give each `component` node a real `storybookId` (matching its Storybook story path, e.g. `organisms-submissionstable--default`) now that Storybook actually exists — `site` mode couldn't do this before code existed.

**Completion criterion:** clicking any `component` node with a `componentType` dims all unrelated nodes and keeps every same-type instance highlighted; clicking a node with a `storybookId` shows a working "View in Storybook" link in the side panel.

**Mermaid (portable diagram):** convert the same `nodes`/`edges` data into Mermaid `flowchart TD` syntax, grouped by `group` via subgraphs. Write to `docs/ARCHITECTURE_MAP.md`, replacing `site` mode's proposed-architecture version with the as-built one.

**SVG (standalone export):** reuse the Mermaid syntax rather than building a second graph representation:
```bash
npx -y @mermaid-js/mermaid-cli -i docs/ARCHITECTURE_MAP.md -o docs/sitemap.svg
```

### Step 2: Reconcile the object model, if needed

Check whether `docs/OOUX_OBJECT_MAP.md` has drifted since the last `audit` pass (or since `objects` mode last ran, if `audit` has never run). If it has, run `audit` mode's checks now, resolve findings with the user the same way `audit` mode directs (report, don't silently overwrite), then regenerate the `erDiagram` from the reconciled doc. If nothing has drifted, skip this step and say so rather than running a no-op reconciliation.

**Completion criterion:** all three site outputs derive from the same current node/edge data pulled from the actual codebase, and `docs/OOUX_OBJECT_MAP.md`'s `erDiagram` matches the current, reconciled object model rather than the last-stated plan.

---
