# Audit: code mode

Part of the [`audit`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Audits **coding practice**: token adherence, structure/style/logic separation, component reuse, and cheap mechanical hygiene checks. Not for deep accessibility reasoning (`a11y` mode), subjective visual/UX critique (`craft`/`heuristic` modes), or fidelity against a design spec (`spec` mode) — this mode stays fast and grep-able rather than deliberative, and it never compares the build against a design; it checks the code against this suite's own standards regardless of what was designed.

### 6 Audit Checkpoints

**1. Design Token Compliance (Strict)**
- **Zero Hardcoded Hex Codes / Raw Tailwind Palette Colors**: Run [`tools/design-check`](../../../tools/design-check/design-check.mjs) against the app's source directory (`node ../../../tools/design-check/design-check.mjs <src>`). It flags bare and arbitrary hex values, raw palette classes like `text-slate-500`, `bg-emerald-600`, `border-zinc-300`, `dark:` variants, `transition-all`, and a project with motion but no `prefers-reduced-motion` rule — the same check `figma`'s `import` mode runs on newly imported code. A project can switch the check on at edit time with `node ../../../tools/design-hook/design-hook.mjs --enable`. All styling must use semantic tokens (`text-primary`, `bg-surface`, `bg-status-success/15`). This includes status/badge colors, which must never fall back to raw palette classes even for a "quick" state. `style={{ color: '...' }}` inline styles aren't caught by the script — check those by hand.
- **Zero Redundant `dark:` Overrides**: `design-check` reports every `dark:` variant. Flag `text-primary dark:text-white` on a token that already auto-flips. A `dark:` override is only legitimate when it pairs two genuinely distinct semantic tokens for a deliberate light/dark divergence, not as a patch on a single token.
- **Consistent Layout Rhythm**: Page containers should align to one shared max-width/padding convention defined once (e.g. in the app shell), not repeated ad hoc per view. Dense data tables should use consistent cell padding across the app.

**2. Semantic HTML5 & Heading Hierarchy**
- Ensure each view has a single top-level `<h1>` tag followed by logical `<h2>`, `<h3>` hierarchy.
- Ensure clickable actions use semantic `<button>` elements (not clickable `<div>`s without ARIA) — [`tools/audit-mechanical-checks`](../../../tools/audit-mechanical-checks/audit-mechanical-checks.sh) flags `<div onClick=...>` candidates as a starting point.
- Form inputs must have associated `<label>` tags or `aria-label` attributes.

**3. Keyboard Focus Hygiene** (mechanical only; see `a11y` mode for the real WCAG pass)
- Verify all interactive controls include `:focus-visible` ring styling (`focus:ring-2 focus:ring-focus-ring`) — the same tool's second check flags any file with interactive elements but zero `focus:ring`/`focus-visible` mentions anywhere in it (a coarse, file-level heuristic; a file that passes can still miss it on one element, so don't treat a clean run as the whole answer).
- Modals must trap keyboard focus and dismiss on `Escape`.

**4. Component & Type Hygiene**
- UI atoms/molecules should extend the native HTML element's attribute interface (`React.ComponentPropsWithoutRef<'button'>`) rather than hand-declaring a parallel prop list. Hand-rolled prop lists drift from native behavior and lose things like `aria-*` passthrough for free.
- Run `node ../../../tools/check-token-contrast/check-token-contrast.mjs <src/index.css>`; a failing token pair is a finding even when no component is wrong yet.
- Run a type-check (`npx tsc -b --noEmit` or equivalent) as part of verification. This catches drift a visual pass alone won't.

**5. Structure, Style & Logic Separation**
- Flag components that mix data-fetching/state logic, layout markup, and styling decisions inline with no separation. Logic should live in a hook or a clearly-named function, not interleaved line-by-line with JSX.
- Flag duplicated JSX blocks (near-identical markup repeated 3+ times) that should be one parameterized component instead. This is a coding-standards issue distinct from `craft` mode's "does it look consistent" check; here the question is whether the *code* is reused, not whether the *output* looks the same.
- Business/domain logic (state transitions, derived values) belongs in `shared/` or a hook, not duplicated inline in multiple view components.

**6. Prototype Cleanliness & Hygiene**
- Verify no large binary lock files (`~$*.docx`), temporary scratch files, generated `production/` output, data exports, or uncommitted zip archives clutter the repo root — the same tool's third check (`audit-mechanical-checks.sh <src> <repo-root>`) covers this.
- Confirm state mutations are centralized in mock store hooks or shared workflow files.
- Before a delivery handoff, confirm the static build being shipped was regenerated from current source. Don't assume a previously-built `dist`/`production` folder is still current.

### Review Output Format

```markdown
# UX Prototype Review Report

## Summary
- Files Reviewed: [Count]
- Token Adherence: [Pass / Fail]
- Accessibility Score: [Good / Needs Remediation]

## Findings & Remediation Steps
- [File Basename:Line]: [Specific Issue & Suggested Token Class Replacement]
```

---
