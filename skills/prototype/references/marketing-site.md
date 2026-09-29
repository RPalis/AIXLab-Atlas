# Type: Marketing Site

For prototypes whose core surface is persuasion/conversion: landing pages, campaigns, product marketing sites. This is the one type where [`audit`](../../audit/SKILL.md)'s Nielsen heuristics 7 (Flexibility & Efficiency) and 10 (Help & Documentation) usually don't apply. Mark them `n/a` rather than scoring them low.

## Step 1: One primary CTA per section, always

Every section (hero, feature block, pricing, footer) should have exactly one primary call-to-action visually dominant. Competing CTAs of equal visual weight force the visitor to choose, which they'll resolve by leaving. Secondary actions (learn more, see pricing) exist but are visually subordinate.

## Step 2: Structure the scroll as a persuasion sequence, not a feature dump

A marketing page has a narrative arc: hero (what is this, why should I care) → proof (social proof, credibility signals, specifics) → objection handling (pricing clarity, FAQ, comparison) → final CTA. Don't list every feature with equal weight. Lead with the 2-3 that matter most to the target persona from [`persona`](../../persona/SKILL.md).

## Step 3: Treat loading/scroll performance as part of the design, not an afterthought

Even in a mocked prototype: lazy-load below-the-fold images, avoid layout shift from late-loading content (reserve space), and keep hero content rendering immediately. A marketing page that visibly reflows while loading undermines the polish the rest of the page is trying to convey.

## Step 4: Design for the skim, not the read

Most visitors skim. Use scannable headers, short paragraphs, bulleted feature lists, and bold key phrases sparingly, not walls of text. Craft-audit's cognitive-load checklist (chunking, visual hierarchy) applies directly here.

## Step 5: Trust signals need real placement, not decoration

Testimonials, logos, certifications, or stats need to sit near the decision point they're meant to support (e.g. a trust badge near the signup CTA, not buried in a footer). Proof that isn't near the ask doesn't do its job.

**Completion criterion:** every section has one clearly dominant CTA; the scroll order follows a persuasion arc, not an arbitrary feature list; nothing shifts layout while loading.
