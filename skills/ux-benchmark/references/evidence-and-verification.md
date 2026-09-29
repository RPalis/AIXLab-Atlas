# Evidence & verification

This is the discipline that separates a benchmark from an opinion. Read it before Phase 3.

## The evidence ladder

Work from strongest source to weakest. The tier sets the **confidence ceiling** for the score.

| Tier | Source | Confidence ceiling |
|---|---|---|
| 1 | **Hands-on walkthrough** — you navigated the real flow and read the real screen | `Verified` |
| 2 | **First-party documentation** — help centre, accessibility statement, product/pricing page, changelog | `Verified` |
| 3 | **Supplied screenshots / recordings** — from the user | `Verified` for what is visible, nothing beyond |
| 4 | **Credible third party** — design case studies, reputable reporting, app-store listings | `Likely` |
| 5 | **Vendor marketing claim** about the vendor's own product | `Likely`, **labelled as a vendor claim** |
| 6 | **Nothing found** | `NOT VERIFIED` |

Every finding records the **tier** that produced it, not just a source name — a reader must be able
to tell a walked-through screen from a marketing page at a glance. Number sources `[1]`, `[2]`… and
resolve them in a source register at the end, each marked first-party or third-party.

## The three confidence ratings

Exactly one per score. Colour-code them on every deliverable:

- **Verified** — green `D6E9D6`
- **Likely** — amber `FCEFCC`
- **Not Verified** — red `F6D8D6`

A visibly red-heavy scorecard is **honest output, not failed output.** Do not raise a rating to make
the board look complete.

## OBSERVED vs INFERRED

Keep them separate, always. If you did not see it, you are inferring it — say so.

- OBSERVED: "Checkout is 4 steps" (you walked it).
- INFERRED: "Checkout is probably fast" (you're guessing from the step count).

Never present an inference as a fact, and never turn one into a number.

## Absence of evidence

A search that finds nothing produces:
`NOT VERIFIED — searched [where], nothing found. This does not establish absence.`

It **never** produces "no product does X". Any headline opportunity that rests on an absence claim
must name that dependency in the Validation Checklist — it's the claim a stakeholder is most likely
to challenge.

## Walkthrough limits

Hands-on verification stops before commitment:

- **No payment.** Do not enter card details or complete a purchase.
- **No account creation with real personal details.** If a flow requires sign-up to proceed, record
  `NOT VERIFIED — auth wall` and move on.
- **No scraping or automated bulk collection.** Navigate as a user would.
- Where a flow is geo-gated, app-only, or otherwise unreachable, record which, and why.

A screen you cannot reach is a legitimate, reportable result. Guessing what's on it is not.

## The ⚠ review pass (run after Phase 4, before finalising)

Check your own work and flag with ⚠:

- ⚠ any score without evidence
- ⚠ any feature, price or claim that is NOT VERIFIED
- ⚠ any dimension scored on a **different bar** than the other products
- ⚠ any task that was **not comparable** across products

**Rewrite or downgrade anything you flag.** This pass is not optional — it's where consistency is
actually enforced.

## The Validation Checklist (a required deliverable)

List everything that needs manual verification before the benchmark informs design:

- Every score whose evidence is Tier 4–6 (Likely or Not Verified).
- Every feature, price or claim marked Not Verified.
- Every absence-of-evidence claim, especially any a headline opportunity depends on.
- Any task that wasn't fully comparable across products.
- Any dimension where you suspect the bar drifted between products.

## Human-review gate (before this informs design)

- Verify every score against the actual product — a score without evidence is an opinion.
- Remove anything marked Not Verified.
- Confirm the rubric was applied consistently — the same 5 must mean the same bar everywhere.
- Confirm comparable tasks, not cherry-picked screens.
- Re-run over time — benchmarking is a program, not a one-off.
- Treat the output as a **first draft, not final research.**
