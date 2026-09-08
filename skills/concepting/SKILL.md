---
name: concepting
description: Object-Oriented UX (OOUX/ORCA) modeling. Guides an interactive, one-question-at-a-time walkthrough of Objects, Relationships, Calls-to-Action, and Attributes. Plan mode seeds the model before build; Audit mode reconciles it against what actually got built. Use when planning new features, structuring data models, framing prototype scope, or checking a built prototype against its original object model.
disable-model-invocation: true
---

# Feature Concepting & OOUX Domain Modeling

Maps the object architecture of a prototype using **Object-Oriented UX (OOUX)** and the **ORCA framework** (Objects, Relationships, Calls-to-Action, Attributes). `docs/OOUX_OBJECT_MAP.md` is a **living document**: Plan mode seeds it before a line of code is written; Audit mode reconciles it against what actually got built. Don't restart from zero in Audit mode if `docs/OOUX_OBJECT_MAP.md` already exists; extend and correct it.

## Why OOUX for High-Fidelity Prototypes?
1. **Prevents Spaghetti Views**: Prototypes get tangled when screens are designed before understanding what objects live on those screens.
2. **Builds Clean Shared Types**: The OOUX matrix maps directly to `shared/types.ts` and `shared/workflow.ts` in your React prototype.
3. **Aligns Design & Engineering**: Creates a common ubiquitous language between designers, product managers, and developers.

## Choose the mode

- **Plan mode** (no prototype exists yet, or the model is being defined ahead of a new feature): work through the four ORCA steps below interactively, one question at a time, before any code is written.
- **Audit mode** (a prototype already exists, with or without a prior `docs/OOUX_OBJECT_MAP.md`): scan the actual codebase (`shared/types.ts`, component props, route structure) and walk through the same four steps, but each step compares what's found in code against what the doc says. Flag drift explicitly rather than silently overwriting either side.

Both modes use the same interactive discipline: **ask one question at a time, offer a recommendation, wait for the answer**, the same interrogation style as [`interrogate`](../interrogate/SKILL.md), rather than handing over the framework for the user to fill in alone.

## The ORCA Process

### 1. Objects (Identify Core Entities)
**Plan mode**: scan user stories, persona walkthroughs, and the goal for the feature. Propose a candidate list of domain nouns (e.g. `Submission`, `ReviewTier`, `Portfolio`) one at a time. For each, ask whether it's a real first-class object or actually an attribute of something else (a common early mistake: turning a status into an object). Confirm before moving to the next.

**Audit mode**: scan `shared/types.ts` and component names for what's actually modeled as an object today. For each real object found, check whether it's already in `docs/OOUX_OBJECT_MAP.md`. If not, propose adding it; if the doc lists an object that doesn't exist in code, ask whether it was descoped or just not built yet.

### 2. Relationships (Map Cardinality)
Walk each confirmed object and ask how it connects to the others already confirmed, one relationship at a time, stated as cardinality (`A Submission has 1..* ReviewTiers`). Don't ask about relationships to objects not yet confirmed in Step 1.

**Audit mode**: check the actual foreign-key-like references in `shared/types.ts` (a field like `portfolioId` on `Holding`) against the documented relationship. Flag any relationship in code with no doc entry, and any documented relationship with nothing in code backing it.

### 3. Calls-to-Action / CTAs (State Transitions & Actions)
For each object, walk its lifecycle interactively. Start by asking whether the lifecycle is one of these shapes. Don't default to linear without checking:
- **Linear**: `Draft` -> `Submit` -> `In Review` -> `Approved` / `Rejected` / `Needs Info`
- **Parallel independent tracks**: multiple independent reviewers (e.g. InfoSec / Legal / Privacy), each with its own `Pending`/`Approved`/`Rejected` state, with overall stage *derived* from the combination. Ask explicitly whether overall state is derived or stored, and document the derivation rule if derived.
- **Terminal states beyond approve/reject**: a `Withdrawn` state the actor can trigger unilaterally, distinct from `Rejected`.
- **Partial resubmission**: after rejection, does the whole object reopen, or only the rejected track/section (with approved parts persisting)?

For each CTA, ask who can trigger it and whether it's irreversible (needs confirmation).

**Audit mode**: check `shared/workflow.ts` or equivalent state-machine code against the documented lifecycle shape. A lifecycle that's actually parallel-track in code but documented as linear (or vice versa) is exactly the kind of drift this mode exists to catch.

### 4. Attributes (Data Elements & Metadata)
For each object, walk through Identity (`id`, `name`, `createdAt`), Status (`workflowState`, `riskScore`), and Content (`description`, `tags`) categories. Ask what's real for this object in each category rather than listing generic examples and assuming they apply.

**Audit mode**: diff the object's actual TypeScript interface fields against the documented attribute list.

## Deliverables

Output/update the ORCA model in `docs/OOUX_OBJECT_MAP.md`. In Plan mode, also generate the foundational TypeScript interface draft for `shared/types.ts`; in Audit mode, report drift as a findings list (object/relationship/CTA/attribute, documented vs. actual, recommended resolution) rather than silently editing either side.

Use the template at [`templates/ooux-matrix-template.md`](templates/ooux-matrix-template.md).

If a real ORCA question can't be resolved from the codebase or existing docs and genuinely needs user/stakeholder input beyond what's in this conversation, append it to `docs/UNKNOWNS.md` rather than guessing (see AGENTS.md §2.6). It's a good candidate for the next [`interview`](../interview/SKILL.md) round.

**Completion criterion:** every object, relationship, CTA, and attribute in the final doc was either confirmed interactively (Plan mode) or reconciled against real code (Audit mode). Nothing invented wholesale from generic examples.
