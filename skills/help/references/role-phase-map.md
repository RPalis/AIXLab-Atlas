# Role by phase map

Each cell lists **core** skills (the default suggestion) and **optional** skills (offer when the goal fits). Phases are the suite's four: Discover, Decide, Design, Deliver. Skill names are checked against `skills/` by `scripts/verify-help-map.py`.

| Role | Phase | Core | Optional |
|---|---|---|---|
| UX researcher | Discover | `brief`, `interview`, `interview-analysis`, `persona` | `workshop`, `competitor-analysis`, `ux-benchmark`, `journey`, `metrics` |
| UX researcher | Decide | `problem-statement` | `brainstorming`, `interrogate` |
| UX researcher | Design | `usability-test-plan` | `audit` (heuristic) |
| UX researcher | Deliver | `showcase` | `wiki`, `guide` |
| UX designer | Discover | `brief`, `persona`, `journey` | `interview`, `competitor-analysis`, `workshop` |
| UX designer | Decide | `problem-statement`, `information-architecture`, `map` (flow) | `brainstorming`, `interrogate`, `decisions` |
| UX designer | Design | `prototype`, `audit` (heuristic, craft), `usability-test-plan` | `styleguide`, `refine` |
| UX designer | Deliver | `requirements` | `showcase`, `guide` |
| UX writer | Discover | `interview-analysis`, `competitor-analysis` | `persona`, `journey` |
| UX writer | Decide | `information-architecture` (labelling) | `interrogate`, `decisions` |
| UX writer | Design | `audit` (heuristic), `refine`, `usability-test-plan` | `prototype` |
| UX writer | Deliver | `guide` | `showcase`, `wiki` |
| UI designer | Discover | `brief` | `competitor-analysis`, `ux-benchmark` |
| UI designer | Decide | `brainstorming` | `map` |
| UI designer | Design | `styleguide`, `prototype`, `refine`, `audit` (craft, a11y) | `figma` |
| UI designer | Deliver | `showcase` | `storybook` |
| Design systems | Discover | `brief` | `competitor-analysis`, `ux-benchmark` |
| Design systems | Decide | `map` (objects), `decisions` | `interrogate` |
| Design systems | Design | `styleguide`, `audit` (code, spec, a11y), `figma` (sync) | `storybook`, `prototype` |
| Design systems | Deliver | `guide` | `storybook`, `package`, `wiki` |
| Design engineer | Discover | `brief` | `competitor-analysis` |
| Design engineer | Decide | `map` | `decisions` |
| Design engineer | Design | `prototype`, `styleguide`, `audit` (code, spec), `figma` (import) | `storybook`, `refine` |
| Design engineer | Deliver | `requirements`, `package` | `guide`, `storybook` |

Anytime, for every role: `help`, `wiki` (notes), `decisions`, `interrogate`, `setup` (once, before anything else).

## Project state to phase

| State the user gives | Phase |
|---|---|
| Idea, or discovery under way | Discover |
| Definition (problem, scope, structure) | Decide |
| Design or prototype, or testing | Design |
| Handoff or build | Deliver |
| Live | Deliver now, and Discover for the next round |

## Known gaps

- There is no dedicated UX writing skill. The writer rows borrow from labelling, heuristic audit and test plans. Say so if the user asks for copywriting or voice work.
- Storybook is optional for every role, including design systems and design engineers. Offer it only when components are being documented.
- Recruiting participants and running sessions are outside the suite. `interview` and `usability-test-plan` prepare the material only.
