# Persona-Based Craft Testing

Walk the primary user task through 2-3 of these archetypes, not a generic "design director" pass alone. Each exposes different failure modes.

## Alex: Impatient Power User
Expert with similar products, hates hand-holding, will find shortcuts or leave. **Test**: can Alex complete the core task in under 60s? Keyboard shortcuts for common actions? Can onboarding be skipped? **Red flags**: forced unskippable tutorials, no keyboard nav for primary actions, one-item-at-a-time flows where batch would be natural, redundant confirmations on low-risk actions.

## Jordan: Confused First-Timer
Never used this type of product, needs guidance, will abandon rather than figure it out. **Test**: is the first action obvious within 5 seconds? Are icons labeled? Contextual help at decision points? **Red flags**: icon-only nav with no labels, technical jargon unexplained, no visible help, ambiguous next-step after completing an action.

## Riley: Deliberate Stress Tester
Methodical, pushes past the happy path: empty states, very long strings, refresh mid-flow, multiple tabs. **Test**: what happens at 0 items / 1000 items / very long text? Does state survive a refresh mid-workflow? **Red flags**: features that silently fail, empty states with no guidance ("No results" and nothing else), lost data on refresh, inconsistent behavior between similar interactions in different parts of the app.

## Casey: Distracted Mobile User
Thumb-only, one-handed, frequently interrupted, low patience. **Test**: are primary actions in the thumb zone (bottom half)? Does state persist across an interruption? Touch targets ≥44×44px? **Red flags**: important actions stuck at the top of the screen, no state persistence on tab-switch, tiny or crowded tap targets.

For a deep accessibility-specific pass (screen reader flow, keyboard-only completion, WCAG contrast), use [`audit`](../../audit/SKILL.md) instead. It covers what a persona walkthrough alone can't verify.

## Choosing which 2-3 to use

| Interface type | Best-fit personas |
|---|---|
| Landing/marketing page | Jordan, Riley, Casey |
| Dashboard/admin | Alex, Riley |
| Workflow/form-heavy | Jordan, Casey |
| Data-dense analytics | Alex |
