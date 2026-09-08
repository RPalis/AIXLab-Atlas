# Nielsen's 10 Usability Heuristics: Scoring Guide

Score each 0-4. Be honest, a 4 is genuinely excellent, not "good enough." Mark a heuristic `n/a` (with a one-line reason) when it genuinely can't apply to this surface (e.g. heuristic 7 and 10 often don't apply to a pure landing/marketing surface) and renormalize the total to the applicable maximum.

| # | Heuristic | What to check | 0 | 4 |
|---|---|---|---|---|
| 1 | Visibility of System Status | Loading indicators, action confirmations, progress indicators, current-location cues, inline form validation | No feedback; user is guessing | Every action confirms, progress always visible |
| 2 | Match Between System & Real World | Familiar terminology, logical info order, recognizable icons/metaphors | Pure jargon | Speaks the user's language fluently |
| 3 | User Control & Freedom | Undo/redo, cancel on forms/modals, clear back-to-safety nav, escape from multi-step flows | Users get trapped | Undo/cancel/back/escape everywhere |
| 4 | Consistency & Standards | Same terminology throughout, same action = same result, visual consistency | Feels like stitched-together products | Fully consistent, predictable |
| 5 | Error Prevention | Confirmation before destructive actions, constrained inputs, smart defaults | No guardrails anywhere | Errors nearly impossible via smart constraints |
| 6 | Recognition Rather Than Recall | Visible options (not buried), contextual help, autocomplete, labeled icons | Heavy memorization required | Everything discoverable |
| 7 | Flexibility & Efficiency of Use | Keyboard shortcuts, customization, bulk/batch actions | One rigid path | Multiple paths, power features |
| 8 | Aesthetic & Minimalist Design | Only necessary info visible, clear hierarchy, no decorative clutter | Everything competes equally | Every element earns its pixel |
| 9 | Help Recognize/Diagnose/Recover from Errors | Plain-language errors, specific problem ID, actionable recovery, non-blocking | Cryptic codes/jargon | Pinpoints issue, suggests fix, preserves work |
| 10 | Help & Documentation | Searchable/contextual help, task-focused, concise | No help anywhere | Right info at the right moment |

**Total**: 4 × heuristics scored. **Rating bands** (as % of applicable max): 90%+ Excellent, 70%+ Good, 50%+ Acceptable, 30%+ Poor, below Critical.

Tag each individual issue found while scoring with P0-P3 (see main `audit` SKILL.md). The heuristic table gives you the score; the individual issues are what become tasks.
