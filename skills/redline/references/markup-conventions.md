# Redline Markup Conventions

A shared visual vocabulary for interpreting an annotated screenshot. Not every
designer marks up the same way — read these as the default reading when
nothing in the image contradicts it, not a rigid spec. A written callout on
the image always overrides a guessed symbol meaning.

| Mark | Default reading |
|---|---|
| Circle / box around an element | "This is the target" — the edit applies to what's enclosed, not the whole screen |
| Arrow between two points | "Move this here," unless the arrowhead points at a label/callout, in which case it's "this note applies to this element" |
| Strikethrough / X over an element | "Remove this" |
| Squiggly underline or a wavy circle | "Something about this is off" (spacing, size, alignment) — infer the specific fix from context (nearby elements, the rest of the screen's rhythm), not a fixed meaning |
| Written text near an element (a callout) | Literal instruction. Highest priority — always overrides a guessed symbol meaning for that element |
| Color coding | No fixed meaning by default; if the image consistently uses one color for one kind of change (e.g. red = remove, blue = move) and that pattern is clear from context, follow it |

**Multiple annotations on one screenshot** are multiple separate edits, not
one combined instruction — apply each independently and report them as
separate changes, even if they land in the same file.

**When a mark is genuinely ambiguous** (an arrow with no clear direction, a
circle with no visible instruction nearby), take the reading most consistent
with the rest of the screenshot's markup and note the assumption in the
summary — this skill doesn't pause to confirm before editing, so the
after-the-fact report is where an ambiguous call needs to be visible.
