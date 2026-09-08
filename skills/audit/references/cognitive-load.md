# Cognitive Load Checklist

Cognitive load is the total mental effort required to use an interface. Overloaded users make mistakes, get frustrated, and leave.

## Three Types

- **Intrinsic**: complexity inherent to the task itself. Can't eliminate, only structure (break into steps, provide defaults, progressive disclosure).
- **Extraneous**: mental effort from bad design choices. Eliminate ruthlessly: confusing navigation, unclear labels, visual clutter, inconsistent patterns, unnecessary steps.
- **Germane**: mental effort spent building understanding. This is *good* load; support it with consistent patterns and feedback that confirms correct understanding.

## The 8-Item Checklist

- [ ] **Single focus**: can the user complete their primary task without competing distractions?
- [ ] **Chunking**: is information grouped in digestible chunks (≤4 items per group)?
- [ ] **Grouping**: are related items visually grouped (proximity, borders, shared background)?
- [ ] **Visual hierarchy**: is it immediately clear what's most important on screen?
- [ ] **One thing at a time**: can the user focus on a single decision before the next?
- [ ] **Minimal choices**: ≤4 visible options at any single decision point?
- [ ] **Working memory**: does the user need to remember info from a previous screen to act on this one?
- [ ] **Progressive disclosure**: is complexity revealed only when needed?

**Scoring**: 0-1 failures = low load (good). 2-3 = moderate (address soon). 4+ = high (critical fix needed).

## Common Violations

| Problem | Fix |
|---|---|
| Wall of options (10+ choices, no hierarchy) | Group into categories, highlight recommended, progressive disclosure |
| Memory bridge (must recall step 1 info at step 3) | Keep relevant context visible, or repeat it where needed |
| Hidden navigation (no mental map) | Always show current location (breadcrumbs, active states) |
| Jargon barrier | Plain language; define unavoidable domain terms inline |
| Visual noise floor (everything same weight) | One primary element, 2-3 secondary, everything else muted |
| Inconsistent pattern (same action, different UI) | Standardize: same type of action = same type of UI |
| Multi-task demand (read + decide + navigate at once) | Sequence the steps |
| Context switch (jumping screens to gather info for one decision) | Co-locate what's needed for each decision |

**Working memory rule**: humans hold ≤4 items at once. At any decision point, count distinct options/actions/pieces of info: ≤4 is manageable, 5-7 needs grouping, 8+ will be skipped or misclicked.
