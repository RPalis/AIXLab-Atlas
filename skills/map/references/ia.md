# Map: ia mode

Part of the [`map`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Turns a product's content, screens and navigation into an information architecture built around the user's mental model, not the org chart: a content structure, navigation, labelling and search, all four IA systems (organisation, labelling, navigation, search), grounded in Dan Brown's eight principles and Rosenfeld & Morville. It enforces an evidence discipline (no invented pages), a confidence rating on every decision, and a plan-first gate. Handles iOS, Android, desktop and web navigation patterns, accessibility, and localisation. Role while running it: a senior information architect and UX designer. The objective is to minimise cognitive effort, improve findability, and create a scalable architecture.

**Where it sits.** `ia` structures *content and navigation*; `objects` structures *data*; `site` plans the *build* (routes, shells, components). Run `ia` first, then `site` reads its structure instead of inventing one. Its sitemap is a content structure, not a route diagram, so the two inform each other without being the same artifact.

Two rules sit above everything else and are never traded away:

1. **Always prioritise the user's mental model.** Don't organise content around internal teams, business units or organisational structures. Users think in tasks and goals; the structure must match that, not your client's departments.
2. **Never invent structure.** Every page, label, group and path must trace to a supplied input. Inventing plausible-sounding navigation is the core failure mode of an AI doing this job, and it is invisible to a reader who wasn't in the room.

This mode runs as **ordered, gated phases**. The gates are the point: you understand before you
structure, you plan before you build, and you do not present an architecture until it has passed
the feedback-loop check in Phase 6. Treat every output as a **first draft, not final.**

## Contents

  - The evidence rule — the core of this mode
  - Handles — the project frame
  - Inputs
  - Phases
  - Where this sits
  - Anti-patterns

### The evidence rule — the core of this mode

**Do not invent information. Never assume a page, feature or label exists.** If content is not in
the inventory, you may only introduce it as `PROPOSED — missing content, requires validation`,
never as if it were already there. This rule outranks completeness, symmetry and deadline.

Every structural decision — a grouping, a hierarchy level, a label, a navigation placement —
carries **one confidence tag**:

| Tag | Meaning |
|---|---|
| `Verified` | Grounded in a supplied input (inventory item, analytics signal, card-sort result, stated user goal). |
| `Inferred` | A reasonable IA judgement from best practice, but not directly evidenced. Real, but flag it for validation. |
| `Proposed` | New content or structure you are recommending be created. Not currently in the product. |
| `Not Verified` | Cannot be established from the inputs. State why. Resolve or remove before final sharing. |

**Absence of evidence is never a finding.** "Users don't need X" requires evidence users don't
need X, not the absence of X from the inventory. Record gaps as open questions, never as
conclusions.

### Handles — the project frame

Fill these before structuring. Ask for any that are missing (see Phase 0).

| Handle | |
|---|---|
| **Product** | What the product is. |
| **Feature** | The feature or area in scope, if narrower than the whole product. |
| **Business objective** | The outcome the business wants — used to *weight* structure, never to *shape* it against the user. |
| **Target users** | Who navigates this, and their mental model. |
| **Platform(s)** | iOS / Android / desktop web / mobile web / responsive — drives navigation pattern choices in Phase 5. |
| **Situation** | Greenfield (new IA) or redesign (existing IA to restructure — triggers a migration map). |

### Inputs

**Required** — do not proceed without a way to ground the structure:
- **Product or feature overview**, and a **screen or content inventory** (the pages/screens/content that exist or are planned).
- **User goals or personas** (a `persona` `card` output, if one exists).
- **Existing navigation**, if this is a redesign.

**Optional** — use if supplied, and say which you used:
- User flows · analytics or search-query data · card-sort results · API structure ·
  [`competitors`](../../competitors/SKILL.md) `analysis` or `benchmark` output · wireframes or sketches.

If a connector for product analytics, a content/CMS source, or search logs is available, you may
triangulate against it. Never let it substitute for the inventory.

### Phases

#### Phase 0 · Pre-flight & scope — GATE
- Confirm the required inputs and the handles are present. If the **content inventory** or
  **user goals** are missing, stop — you cannot ground an IA without them.
- Ask **up to five clarifying questions**, only for what is genuinely
  missing: primary user goals, platform(s), greenfield vs redesign, whether card-sort/analytics
  exist, and the desired **output format** (Phase 7 confirms this again before building). Skip
  anything already supplied.
- **Do not begin structuring in this phase.**
- **Autonomous mode** (suite `AGENTS.md` §2.9): the content inventory and user goals can be derived rather than asked for. Build the inventory from `docs/OOUX_OBJECT_MAP.md`, the router/page files if code exists, or `docs/PRODUCT_BRIEF.md`; take user goals from `docs/PERSONA_WALKTHROUGH.md`. Tag everything derived `Inferred`. If neither source exists, an IA can't be grounded: skip, log tier 3 (`../../../tools/log-unknown/log-unknown.sh --skill map --tier 3 "..."`), and stop. Default platform to responsive web and situation to greenfield (or redesign when code exists), and log each default.

#### Phase 1 · Understand content
- Ingest the inventory. Give every item a **stable source ID** (`C1, C2 …`) so every later
  grouping and label can cite what it came from.
- Classify each item and flag: **duplicate content**, **orphan content** (belongs nowhere yet),
  **missing content** (a goal has no supporting content — record as `PROPOSED`, do not invent the
  page), **ambiguous items**, and **related clusters**.
- Output a content map, not a structure yet.

#### Phase 2 · Define user goals & tasks
- Restate **primary user goals** and **core tasks** in your own words for confirmation.
- Rank tasks by **frequency and importance** — this drives content hierarchy later (frequent tasks
  get shallow, prominent placement).
- Form **mental-model hypotheses**: how do these users naturally group this content? Note where the
  business's likely grouping (by team/product line) diverges from the user's (by task/goal). The
  divergence is the whole reason this skill exists.

#### Phase 3 · Plan — GATE
- Produce the plan as a `.md` **fidelity-reference file**: the proposed **organisation structure**
  (hierarchical / sequential / matrix / hub-and-spoke) and **scheme(s)** (topic / task / audience /
  exact), which of the four IA systems are in scope (organisation, labelling, navigation, search),
  the labelling approach, and the **validation plan** (which core tasks the Phase 6 check will
  test).
- **Share it for approval. Execute only after approval.** Save the approved `.md` so it can be
  iterated. Do not build the architecture before the plan is signed off. **Autonomous mode:** write the plan to `docs/` and stop here; approval is the human step.

#### Phase 4 · Structure the information
- Build the **organisation system**: group content into the chosen structure and scheme(s).
  - **Maximum three navigation levels where possible.** Going deeper is a flag, not a default.
  - Use **polyhierarchy (multiple classification) sparingly** — one item may sit in two paths only
    when two distinct user mental models genuinely require it, and never so much that the structure
    loses focus.
  - Where a **backstage taxonomy / metadata** would serve filtering and search better than visible
    nesting, specify it separately from the visible navigation.
- Produce the **content hierarchy**: prioritised by user need and task frequency, not by page count
  or internal importance.
- Tag every group and level with its confidence.

#### Phase 5 · Design navigation, labels & search
- Define the **navigation system**: primary, secondary, contextual (signpost/breadcrumb), and
  utility navigation. Choose the right container per platform — tab bar vs bottom nav vs
  mega-menu vs hamburger differ by platform convention, not personal preference.
- For **every navigation label**, record three things (this is a hard requirement):
  1. **Why it belongs there.**
  2. **Which user goal it supports.**
  3. **Alternative labels** considered, if any.
  Labels are user-language, not internal jargon; never named after their template position
  ("global nav", "main menu").
- Define the **search system** where the product warrants it: scope, filters/facets (fed by the
  taxonomy), autosuggest, and the **zero-results** state. Search is the fourth IA system alongside
  organisation, labelling and navigation — do not skip it.
- Specify **accessibility of navigation** (landmarks, skip link, keyboard order, focus, target
  size, reflow) and **localisation** risks (label expansion, RTL).
- For **web**, specify **URL / breadcrumb / SEO** structure. For **redesign mode**, produce an
  **old → new migration & redirect map** so nothing is silently orphaned.

#### Phase 6 · Feedback-loop check — GATE

The draft IA does not go to the human until it has passed this check. No script ships with this
skill — perform each check directly against the draft sitemap, and write a small one-off script
only if the sitemap is large enough that manual counting would be unreliable.

1. **Depth check.** Flag any path deeper than 3 levels.
2. **Breadth check.** Flag any menu with materially more than **7±2** sibling items (Hick's law) —
   not a hard cap, but a deliberate choice past that point, not a default.
3. **Orphan and unreachable check.** Every content item from Phase 1's inventory must appear
   somewhere in the tree, or be explicitly marked cut.
4. **Duplicate-label check.** No two items in the same context share a label.
5. **Hallucination check.** Every node must map to a source ID (`C#`) from Phase 1, or be tagged
   `PROPOSED`. A node mapping to neither is a defect — remove it or evidence it.
6. **Simulated tree test.** For each core task from Phase 3, trace the path a target user would
   take. Note whether the first click is correct and whether the path is direct — record this even
   informally; it's the cheapest way to catch a structure that only makes sense to its author.
7. **If any check fails, revise and re-run.** Loop until clean, or until a residual issue is
   explicitly justified and logged. **Do not exit this gate on a failing draft.** Record the final
   result — it ships with the deliverable.

#### Phase 7 · Assemble deliverables — GATE
- Produce the **eight required outputs**, in this order:
  1. **Executive Summary**
  2. **Information Architecture** (the grouped hierarchy)
  3. **Navigation Structure** (primary / secondary / contextual / utility + search)
  4. **Navigation Principles** (the guiding rules behind the major structural decisions)
  5. **Content Hierarchy** (prioritised by user need and task frequency)
  6. **Navigation Rationale** (why the major structural decisions were made)
  7. **Risks & Recommendations** (duplicate / orphan / deep nav / ambiguous labels / scalability)
  8. **Validation Checklist** (what still needs tree testing or research, plus the Phase 6 results)
  Include the **migration/redirect map** in redesign mode.
- **Format.** The deliverable is `docs/INFORMATION_ARCHITECTURE.md`, and the approved plan file is always kept. Render the sitemap as a Mermaid tree (the same diagram conventions as `site` mode) with each node's confidence tag, plus the source-ID legend. If a content inventory × placement × confidence matrix or a label register is wanted as a spreadsheet, also write it as CSV. For a Word document or a stakeholder walkthrough deck, hand the Markdown to [`showcase`](../../showcase/SKILL.md)'s `doc` or `deck` mode; the Markdown stays the source of truth. For a FigJam sitemap, use the optional FigJam export at the end of this skill.
- **No format may drop the confidence tags, the per-label rationale, or the Phase 6 check result.**

#### Phase 8 · Human review & persist
- Verify before sharing: the structure reflects **user goals, not the organisation**; unnecessary
  levels and duplicate content are removed; labels are ones a real user would recognise, not
  internal jargon; the hierarchy has been through the Phase 6 check before wireframing.
- **Persist to the docs folder**: the approved plan, the sitemap, the Phase 6 results, and the deliverable together, so this feeds wireframing, navigation design and tree testing downstream.
- Deliver flagged as a **first draft, not final.**

### Where this sits

Reads from [`interview`](../../interview/SKILL.md)'s `analysis` output and `persona`'s `card` mode (the user goals), and from [`competitors`](../../competitors/SKILL.md) (competitor navigation examples). Feeds `site` mode (the route and component architecture is built from this content structure), `flow` mode (screen names should match this mode's labels), and [`audit`](../../audit/SKILL.md)'s `a11y` mode for a deeper navigation accessibility pass.

### Anti-patterns
- Structuring before the plan is approved, or presenting an IA that has not passed Phase 6.
- **Inventing a page, label or path that is not in the inventory** and not tagged `PROPOSED`.
- Organising by team, department or product line instead of user task.
- A navigation label without its why / which-goal / alternatives.
- Reporting "users don't need X" from the absence of X in the inventory.
- Four or more levels deep, or a menu with fifteen sibling items, passed off as fine.
- Covering navigation only and ignoring the organisation, labelling and search systems.
- Dropping confidence tags to fit a slide.
- Delivering without the migration map (in redesign mode), the human-review checklist, or as if it
  were final.

**Completion criterion:** every node maps to a source ID or is tagged `PROPOSED`, every navigation label carries its why / which-goal / alternatives, the Phase 6 check has passed (or its residual issues are logged), and all eight outputs exist.
