# Patterns — naming and adopt / adapt / avoid

Every score names the **specific UX / navigation / layout pattern** the product uses to solve the
task, and tags it. Naming the pattern is what makes the benchmark reusable — a scorecard tells you
*who won*; the pattern library tells you *what to do about it*.

## How to name a pattern

Name the mechanism, not the vibe. "Nice onboarding" is not a pattern; **"progressive disclosure
across a 3-step wizard with a persistent skip"** is. A good pattern name is concrete enough that a
designer could reproduce it from the name alone.

Reference libraries for canonical names: Mobbin (real product screens) and Baymard (research-based
e-commerce patterns). Use their vocabulary where it fits so the library is legible to the team.

Worked example — *NAVIGATION & FINDABILITY · Product B · 4/5 · persistent left nav, clear labels,
search one tap from every screen · **Pattern: sidebar + global search (adopt)** · Strength.*

## The three tags

| Tag | Meaning | Use when |
|---|---|---|
| **Adopt** | Take it as-is | A pattern that clearly works and fits your persona and constraints. Usually a table-stake — you need it just to compete. |
| **Adapt** | Take the idea, change the execution | A pattern that solves a real problem but doesn't fit your context, business model, or brand as built. Note *what* you'd change. |
| **Avoid** | Don't copy it | A pattern that looks common but tests poorly, adds friction, or is a dark pattern. Record *why* — the reason is the value. |

A pattern that **every** product shares is a **table-stake**: tag it adopt, but note it's the cost
of entry, not an advantage. The advantage is in the outliers and the market's blind spots.

## The Pattern Library structure

Group by task or by dimension (match the scorecard). For each pattern record:

| Field | Content |
|---|---|
| **Pattern** | The named mechanism |
| **Where seen** | Which product(s), which screen/step |
| **Tag** | adopt / adapt / avoid |
| **Rationale** | Why this tag — the one line that makes it actionable |
| **Table-stake?** | Yes if every product shares it |
| **Evidence** | Screen / step, and confidence (Verified / Likely / Not Verified) |

## Turning patterns into opportunities

The library feeds Phase 5 and Phase 6:

- **Adopt patterns you lack** → parity opportunities (needed to compete).
- **Adapt patterns** → differentiation opportunities (the same job, done better for your user).
- **Market blind spots** (a task no product handles well) → the highest-value opportunities.
- **Avoid patterns** → guardrails for your own design, and traps competitors have fallen into.
