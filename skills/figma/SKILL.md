---
name: figma
description: >-
  Moves work between a prototype and Figma. Modes: capture (screen to editable Figma layers), import
  (Figma frame to code), sync (design tokens both ways). Use whenever Figma is part of the workflow.
argument-hint: "[capture: screen to Figma | import: Figma to code | sync: tokens both ways]"
disable-model-invocation: true
---

# Figma

Three ways of moving work between this suite and Figma, sharing one skill as "Figma integration" even though their mechanics don't overlap. **Ask which mode if not specified**. **Autonomous mode** (suite `AGENTS.md` §2.9): infer from an explicit signal in the request ("bring in this frame" → `import`, "push our tokens to Figma" → `sync`, anything else Figma-related → `capture`, the only mode with no MCP write and nothing to get wrong). With no signal at all, default to `capture`. Never default into `sync`'s Export direction — that writes to a shared external resource (tier 3, §2.9); it always needs an explicit ask or explicit instruction, autonomous or not.

- **`capture`**: prototype screen → Figma, via a client-side script load. No MCP, no API keys, no file IDs.
- **`import`**: Figma frame/selection → codebase, as real convention-conformant code. Requires the Figma MCP server.
- **`sync`**: this suite's token system ↔ a Figma library's Variables, bidirectional. Requires the Figma MCP server.

Not a mode here: getting a whole prototype into Figma Make. That's a packaging job (build, flatten, size-check), so it lives in [`package`](../package/SKILL.md)'s `figma` mode (`/package figma`).

`import` and `sync` require the Figma MCP server connected (`mcp__claude_ai_Figma__*` tools) — if unavailable, tell the user to connect it rather than guessing at Figma's structure from a screenshot alone. `capture` has no such requirement; it never touches the MCP. **Autonomous mode:** skip the mode entirely, log to `docs/UNKNOWNS.md` as blocked pending the MCP connection (tier 3, §2.9) rather than waiting or guessing at structure.

---

## Output Discipline
- Keep chat replies short and bullet-first, docs plain and scannable, and code the simplest version that works (stdlib and native first).

## Modes

Open the reference file for the chosen mode and follow it. Load only that file. Cross-references between modes name the mode, so open that mode's file when one is named.

| Mode | What it does | File |
|---|---|---|
| `capture` | screen to Figma | [references/capture.md](references/capture.md) |
| `import` | Figma to code | [references/import.md](references/import.md) |
| `sync` | tokens both ways | [references/sync.md](references/sync.md) |
