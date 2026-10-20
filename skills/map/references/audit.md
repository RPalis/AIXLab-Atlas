# Map: audit mode

Part of the [`map`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Reconciles `objects` mode's model against what actually got built, once a prototype exists (with or without a prior `docs/OOUX_OBJECT_MAP.md`). Scans the actual codebase (`shared/types.ts`, component props, route structure) and walks through the same four ORCA steps, but each step compares what's found in code against what the doc says. Flag drift explicitly rather than silently overwriting either side.

### Step 1: Objects

Scan `shared/types.ts` and component names for what's actually modeled as an object today. For each real object found, check whether it's already in `docs/OOUX_OBJECT_MAP.md`. If not, propose adding it; if the doc lists an object that doesn't exist in code, ask whether it was descoped or just not built yet.

### Step 2: Relationships

Check the actual foreign-key-like references in `shared/types.ts` (a field like `portfolioId` on `Holding`) against the documented relationship. Flag any relationship in code with no doc entry, and any documented relationship with nothing in code backing it.

### Step 3: Calls-to-Action / CTAs

Check `shared/workflow.ts` or equivalent state-machine code against the documented lifecycle shape. A lifecycle that's actually parallel-track in code but documented as linear (or vice versa) is exactly the kind of drift this mode exists to catch.

### Step 4: Attributes

Diff the object's actual TypeScript interface fields against the documented attribute list.

### Deliverables

Report drift as a findings list (object/relationship/CTA/attribute, documented vs. actual, recommended resolution) rather than silently editing either side. Once resolved with the user, update `docs/OOUX_OBJECT_MAP.md` and its `erDiagram` (see `objects` mode Step 2) to match the reconciled state.

**Completion criterion:** every object, relationship, CTA, and attribute was reconciled against real code, findings were reported rather than silently resolved, and (once the user has weighed in) the doc and its `erDiagram` match the reconciled state, not the pre-audit one.

---
