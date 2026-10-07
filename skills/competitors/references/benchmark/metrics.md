# Metrics library — anchoring scores in real numbers

The rubric produces a 1–5 judgement. Where you have (or can gather) hard metrics, use them to
**anchor** that judgement instead of scoring on impression. A metric only raises confidence if you
actually observed it — a benchmark figure you cannot reproduce for *this* product stays context,
not evidence.

## The four comparison baselines

Every score is a comparison. Be explicit about which baseline you're comparing against:

| Baseline | Compare against | Best for |
|---|---|---|
| **Competitive** | Direct competitors / best-in-class | This benchmark's core job |
| **Historical** | The product's own past versions | Tracking whether a redesign moved the needle |
| **Industry-standard** | Published averages (SUS 68, task success ≈78%) | When you have no history yet — your first anchor |
| **Goal-based** | Targets you set internally | Judging against your own definition of "good" |

## Task-level metrics (from walking the flows)

- **Task success / completion rate** — did the user finish (1) or not (0)? The most direct measure
  of whether the product works. Industry average ≈ **78%**; **>90%** is well-optimised; **<70%** on
  a core flow signals a real bottleneck worth immediate attention.
- **Time-on-task** — efficiency. Shorter isn't automatically better; the useful question is how it
  compares to the baseline. Prefer time over raw click-counts.
- **Single Ease Question (SEQ)** — a 7-point rating of how difficult the task felt, asked right
  after the task. Cheap, sensitive, and pairs naturally with success rate.
- **Error count / partial success** — where a user technically completed the task but took a wrong
  or slow path. Records *why* a score is low, not just that it is.
- **SUM** — a single combined measure of completion, ease and time for one task. Useful when you
  want one number per task in a competitive benchmark.

## Study-level attitudinal metrics (if you run a real study)

- **SUS (System Usability Scale)** — 10-item usability score, 0–100. Industry average ≈ **68**;
  above 68 is above average, **above 80 rates as good**.
- **SUPR-Q** — usability, trust, appearance and loyalty, reported as a percentile against a large
  reference set. **SUPR-Qm** is the mobile-app variant.
- **UMUX-Lite** — a compact 2-item stand-in for SUS (perceived usefulness + ease).
- **NPS / CSAT** — weak alone, powerful when segmented (e.g. NPS among users who hit the happy path
  vs those who errored).

## The HEART framework (product-scale, behavioural)

Google's HEART, via the **Goals → Signals → Metrics** process, is the standard taxonomy when you
have analytics rather than a lab study:

| Dimension | What it captures | Example metric |
|---|---|---|
| **Happiness** | Satisfaction / attitude | SUS, CSAT, NPS |
| **Engagement** | Depth / frequency of use | Sessions per user, actions per session |
| **Adoption** | New uptake | Sign-ups, first-feature use |
| **Retention** | Keeping users | 30-day return rate, churn |
| **Task success** | Effectiveness + efficiency | Completion rate, time, error rate |

**Caveat:** Engagement, Adoption and Retention are only meaningful for **consumer products where
the user chooses whether to use it.** Don't read them as quality signals for a captive audience.

## CASTLE — the enterprise / captive-audience complement

NNG's CASTLE fills HEART's gap for internal tools, admin systems and workplace software. Use it
alongside HEART, not instead:

- **C**ognitive load — mental effort to complete the task (NASA-TLX is a common measure).
- **A**dvanced-feature usage — whether users graduate beyond the basics.
- **S**atisfaction.
- **T**ask efficiency.
- **L**earnability — e.g. days to proficiency for a new hire. Often invisible under HEART.
- **E**rrors.

## References (from the card, verified as live methods)

- **nngroup.com** — HEART framework, CASTLE framework, the 10 usability heuristics.
- **measuringu.com** — the 15 UX benchmarking metrics (task success, time, SEQ, SUM, SUS, SUPR-Q,
  UMUX-Lite) and competitive benchmark method.
- **baymard.com** — research-based UI patterns and scorecard-with-parameters benchmarking.
- **dscout.com** — the UX scorecard build (goals → competitors → tasks → metrics → score).
- **parallelhq.com** — 7-step benchmark process and the useful/usable/desirable/findable/
  accessible/credible honeycomb lens.
- **uxtweak.com** / **uxpin.com** — UX benchmarking metrics, tooling, and competitive research
  methods.

Treat published averages as *industry-standard baselines*, not as scores for a specific product.
A number you did not measure for the product in front of you does not raise its confidence rating.
