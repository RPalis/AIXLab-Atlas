# Figma: sync mode

Part of the [`figma`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Syncs this suite's token system with a Figma library, in either direction. **Determine direction from what the user actually asked — don't infer it.** "Bring the Figma library into our tokens" is Import; "push our design system to Figma" is Export. If genuinely ambiguous, ask.

Before any write to Figma (Export direction), follow the MCP server's own `/figma-use` guidance first. It's a prerequisite the server itself requires before `use_figma` calls, not optional here.

Both directions use the same correspondence table: [`styleguide/references/semantic-role-mold.md`](../../styleguide/references/semantic-role-mold.md). That table is the single source of truth for what a "role" is on both sides; don't maintain a separate mapping for Figma.

### Import: Figma library → our tokens

Effectively [`styleguide`](../../styleguide/SKILL.md)'s forge-mode Step 1-3 sourced from Figma instead of live CSS or a brand guide. Reuse its discipline — don't relax it just because the source is structured data.

1. `get_libraries` to find the target library, then `get_variable_defs` to pull its actual variable values (colors, typography, spacing, radius).
2. Map each Figma variable onto a role in `semantic-role-mold.md` by name/purpose, the same way forge mode's Step 3 rebinds Layer 2. **Verified beats provided**: if a Figma variable's name is ambiguous about which role it plays, don't guess. Check how it's actually used in the library's components (`search_design_system`) before binding it.
3. **If a value conflicts with what's already in `index.css`** (this app already has a value for a role the Figma library also defines), don't silently overwrite. This is exactly the conflict forge mode's Step 1 requires asking about. Surface it and ask which is authoritative. **Autonomous mode (tier 3, §2.9):** never guess between the two. Leave `index.css`'s existing value in place (it's what's actually shipping), skip writing that one role, and log the conflict to `docs/UNKNOWNS.md` flagged blocking so a human resolves which is authoritative.
4. A Figma variable with no matching role in the mold is a new-token candidate, not something to force into an existing role. Flag it to `docs/UNKNOWNS.md` rather than inventing a role on the spot.
5. Write the resolved values into `index.css` (Layer 1 + Layer 2, per [`styleguide`](../../styleguide/SKILL.md)), then regenerate `DESIGN.md`.

**Completion criterion:** every role in `semantic-role-mold.md` that the Figma library actually defines has a value in `index.css`, and every conflict was surfaced to the user rather than silently resolved.

### Export: our tokens → Figma library

1. Read the current `index.css` (Layer 1 + Layer 2) and `DESIGN.md`.
2. Map each semantic role to a Figma Variable using the same `semantic-role-mold.md` correspondence: collections/modes for light vs. dark, matching how `index.css`'s `:root`/`.dark` split already works.
3. Use `use_figma` (after `/figma-use`) to create or update the target library's Variables. If component documentation should ship alongside (not just raw variables), use `create_new_file`/`upload_assets` to publish a documentation page summarizing `DESIGN.md`'s eight sections. Don't reinvent that structure, just render what `styleguide` already generated.
4. Confirm with the user before overwriting an existing Figma library's variables — a write to a shared external system, not a local file, so the "confirm before overwriting" bar is higher than usual. **Autonomous mode:** this stays tier 3 (§2.9) regardless — a write to a resource other people rely on is never a default-and-log decision. Skip the write, log to `docs/UNKNOWNS.md` as blocked pending explicit human approval, and don't perform it unattended.

**Completion criterion:** every role in `semantic-role-mold.md` that this app actually uses exists as a Figma Variable with the matching light/dark values, and the user explicitly confirmed the write before it happened.
