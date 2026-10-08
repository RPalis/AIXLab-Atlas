# Persona: card mode

Part of the [`persona`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

### Step 1: Establish the research foundation

Ask what research is available. Accepted inputs: interview notes or transcripts, survey
results, field study observations, analytics segments, existing user segments or market
research. Apply the research-grounding rule above if nothing exists.

**Completion criterion:** either real research is in hand, or the output will be
explicitly labeled proto-persona throughout.

### Step 2: Identify user clusters

From the research, group users by shared behaviors and usage patterns, goals and
motivations, frustrations and pain points, and context of use (when, where, how often, on
what device). Merge clusters that are too similar; drop ones peripheral to the product.
Aim for **2-4 personas** for most products — enough to cover meaningful variation without
diluting focus. If more are genuinely needed, say so and explain the tradeoff (each added
persona dilutes team focus and design-decision clarity) rather than refusing outright.

### Step 3: Build each persona

**Required:**
- **Name** — fictional but believable, not generic ("Anna," not "User A").
- **Photo** — describe one if you can't provide it (stock-photo type, not a real person).
- **Age, location, occupation** — enough to anchor context.
- **Tag line** — one grounded, useful sentence capturing their essence, not a clever one.
- **Goals** (2-3) — what they're ultimately trying to achieve.
- **Frustrations / pain points** (2-3) — what currently gets in their way.
- **Behaviors** — how they currently solve the problem: tools, workarounds, habits.
- **Context of use** — required by job or by choice, how often, what device.
- **A quote** — one direct-voice sentence capturing their attitude toward the problem
  space.

**Optional (include only if design-relevant):** experience level with similar products,
tech comfort level, key tasks in the product, decision-making style.

**Never include** a detail that doesn't affect a design decision.

### Step 4: Apply the relevance test

Before finalizing any detail, ask: *would this change a design decision?* If yes, include
it. If no, cut it. A favorite coffee order is noise; a preferred device and time of day is
signal.

### Output Format

```
## [Name], [Age]
[Occupation] · [Location]

> "[Their defining quote]"

**[Tag line]**

### Goals
- ...

### Frustrations
- ...

### Behaviors
- ...

### Context of use
[1-2 sentences on how, when, and where they'd use the product]
```

### Quality checklist (before delivering)

- [ ] Each persona is grounded in real research, or clearly labeled proto-persona.
- [ ] Name and photo aid memorability.
- [ ] Goals and frustrations reflect research, not product-team assumptions.
- [ ] Every included detail passes the relevance test.
- [ ] Tag line is clear and useful, not just clever.
- [ ] Personas feel like distinct characters, not slight variations of each other.
- [ ] 2-4 personas total, or the tradeoff for more was explained.

**Completion criterion:** every persona in the set passes the checklist above.

### Common mistakes to avoid

| Mistake | Fix |
|---|---|
| Building personas from assumptions, not research | Ground every trait in observed data, or label it proto-persona |
| Too many personas | 2-4 is almost always enough; explain the tradeoff for more |
| Including irrelevant details | Apply the relevance test to every field |
| Making the tag line too witty | It should be useful, not entertaining |
| Treating personas as a one-time deliverable | Revisit as more is learned |
| Designing only for the primary persona | Secondary personas represent real edge cases |
