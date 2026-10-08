# Audit: craft mode

Part of the [`audit`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Never edits code. It's the "find what's wrong" half of a loop with [`refine`](../../refine/SKILL.md), which fixes and unifies visual craft. Run this on a prototype you didn't necessarily build yourself — a teammate's work, or your own after time away — to get an honest read before touching anything.

### Step 1: Score five dimensions (0-4 each)

Inspect the running prototype (or source, if it can't run) against each dimension below. Be honest: a 4 means genuinely excellent, not "good enough." Most real prototypes score 8-14 out of 20.

**1. Visual Hierarchy & Cognitive Load.** Is it obvious what matters most on each screen? Walk the [cognitive load checklist](cognitive-load.md) (8 items): 0-1 failures = 4, 2-3 = 2, 4+ = 0.

**2. Information Architecture & Navigation.** Can a user build a mental map of where things are without help? Breadcrumbs/active-states present where needed, logical grouping, no orphaned or unreachable views, sensible route naming.

**3. Consistency & Anti-Patterns.** Same type of action behaves the same way everywhere. Check for structural drift: components that duplicate what another component already does, copy-pasted views that should be one parameterized component, or a screen that feels interchangeable with an unrelated product (no product-specific character).

**4. Responsive Behavior.** Does layout hold up at mobile/tablet widths? No horizontal scroll on the page itself, touch targets ≥44×44px, text doesn't overflow its container when it grows. For a phone or tablet prototype, also walk the checklist in [`refine`'s `mobile.md`](../../refine/references/mobile.md) (safe areas, 200% text, one-thumb reach, gesture alternatives).

**5. Delight & Craft Heuristics.** Cross-check against [`refine`](../../refine/SKILL.md)'s 6 craft heuristics (density/scannability, elevation, micro-interactions, typography, empty/loading states, dark mode fidelity). This dimension scores how close the prototype already is to that skill's bar, not whether it exists as UI at all.

Optionally run `heuristic` mode (see [`heuristic.md`](heuristic.md)) for a deeper, more granular critique than the 5 dimensions above. Useful when the audit needs to justify a bigger investment of follow-up work.

### Step 2: Walk it through 2-3 personas

Pick 2-3 relevant personas from [references/personas.md](personas.md) (Alex the power user, Jordan the first-timer, Riley the stress-tester, Casey the mobile user) and walk the primary task through each one's eyes. Report specific red flags tied to exact elements — "icon-only nav in the sidebar confuses Jordan (violates #6, Recognition Rather Than Recall)," not "navigation could be clearer."

### Step 3: Report and file as tasks

```markdown
# Craft Audit — [target]

## Health Score
| # | Dimension | Score | Key Finding |
|---|---|---|---|
| 1 | Visual Hierarchy & Cognitive Load | ?/4 | |
| 2 | Information Architecture | ?/4 | |
| 3 | Consistency & Anti-Patterns | ?/4 | |
| 4 | Responsive Behavior | ?/4 | |
| 5 | Delight & Craft | ?/4 | |
| **Total** | | **??/20** | **[18-20 Excellent · 14-17 Good · 10-13 Acceptable · 6-9 Poor · 0-5 Critical]** |

## What's Working
[2-3 specific things done well — don't skip this, it tells `refine` what to preserve]

## Findings (task list, most impactful first)
Each finding is a ticket, not prose:
- **[P0/P1/P2/P3] [Short title]** — Location: `Component.tsx`. Violates: `[#N, Heuristic Name]` (from [references/nielsen-heuristics.md](nielsen-heuristics.md); `n/a` if it's a structural/code issue with no clean heuristic mapping — don't force one). Impact: [why it hurts the user]. Fix: [concrete, actionable]. Route to: `refine` (visual) or `audit` in `code` mode (structural/reuse).

## Persona Red Flags
[Specific breakage per persona from Step 2]

## Patterns & Systemic Issues
[Recurring problems, e.g. "hardcoded spacing appears in 6+ views, should use the layout rhythm from DESIGN.md" — call out a heuristic violated by 3+ findings by name, e.g. "#5 Error Prevention violated in 4 places: no confirm-before-destructive pattern established," since a repeated heuristic violation is a systemic gap, not four unrelated findings]
```

Severity: **P0** blocks task completion, fix immediately. **P1** major difficulty, fix before next review. **P2** annoyance with a workaround, next pass. **P3** polish, time-permitting.

**Completion criterion:** every P0/P1 finding names a concrete file/component and a concrete fix, and cites the specific heuristic it violates (or is explicitly marked `n/a`). No finding that just restates the dimension name without specifics.

---
