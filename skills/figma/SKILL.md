---
name: figma
description: >-
  Move work to and from Figma in one of three ways: capture (add a button/context-menu that sends a live prototype screen into Figma as editable layers, no MCP needed), import (bring a Figma frame/selection into the codebase as convention-conformant code via the Figma MCP), or sync (bidirectional token sync between index.css/DESIGN.md and a Figma library's Variables via the Figma MCP). Use whenever Figma is part of the workflow, in either direction.
---

# Figma

Three ways of moving work between this suite and Figma, sharing one skill as "Figma integration" even though their mechanics don't overlap. **Ask which mode if not specified**:

- **`capture`**: prototype screen → Figma, via a client-side script load. No MCP, no API keys, no file IDs.
- **`import`**: Figma frame/selection → codebase, as real convention-conformant code. Requires the Figma MCP server.
- **`sync`**: this suite's token system ↔ a Figma library's Variables, bidirectional. Requires the Figma MCP server.

`import` and `sync` require the Figma MCP server connected (`mcp__claude_ai_Figma__*` tools) — if unavailable, tell the user to connect it rather than guessing at Figma's structure from a screenshot alone. `capture` has no such requirement; it never touches the MCP.

---

## Output Discipline
- Chat: short, bullets over paragraphs, no recap of what you're about to do — just the result. Expand only if asked.
- Docs this skill writes: plain, scannable prose at the depth its template calls for — cut padding, keep substance.
- Code this skill writes: simplest version that works — stdlib/native first, no speculative abstractions, no unrequested scaffolding.

## Mode: capture

Add page capture to any prototype in this suite via a **button** or a **right-click context menu**. The capture loads Figma's script, serializes the DOM, and shows Figma's native toolbar with **Copy to clipboard**, **Entire screen**, and **Select element**.

No API keys, tokens, or Figma file IDs needed — a client-side script load, not an MCP call, adding no build dependency.

### How it works

Figma's `capture.js` exposes `window.figma.captureForDesign()`. Calling it serializes the DOM and copies it to the clipboard as editable Figma layers. After the first capture, Figma's native toolbar stays visible for subsequent captures using its own built-in buttons.

### Shared code

Both integration methods use the same core helper. Add near the top of the target file (after imports):

```ts
declare global {
  interface Window {
    figma?: {
      captureForDesign?: (options: {
        delayMs?: number;
        selector?: string;
      }) => Promise<{ error?: string; success?: boolean } | void>;
    };
  }
}

const FIGMA_CAPTURE_SCRIPT_ID = 'figma-script';
const FIGMA_CAPTURE_SCRIPT_SRC = 'https://mcp.figma.com/mcp/html-to-design/capture.js';

function enableFigmaCapture() {
  if (document.getElementById(FIGMA_CAPTURE_SCRIPT_ID)) {
    window.figma?.captureForDesign?.({ selector: 'body', delayMs: 300 });
    return;
  }
  const script = document.createElement('script');
  script.id = FIGMA_CAPTURE_SCRIPT_ID;
  script.src = FIGMA_CAPTURE_SCRIPT_SRC;
  script.onload = () => {
    window.figma?.captureForDesign?.({ selector: 'body', delayMs: 300 });
  };
  document.head.appendChild(script);
}
```

### Choose an integration method and placement

Ask the user which they prefer. **Don't assume the Prototype Tools menu is scaffolded**:
- **A launcher inside the "Prototype Tools" user-menu section**: the natural placement when [`scaffold`](../scaffold/SKILL.md)'s menu already exists in this prototype.
- **A standalone button** elsewhere: a toolbar, sidebar footer, or settings menu, for a prototype without that menu or where the user wants it more visible.
- **A right-click context menu**: no visible UI added, works globally. Default to this if the user has no preference and no Prototype Tools menu exists.

### Step 1: Identify the integration point
Find the app's root component or layout wrapper: `App.tsx`, a `Layout`/`Shell` component, or the Prototype Tools menu component if that placement was chosen.

### Step 2: Read the target file
Identify the framework, icon library, and styling approach in use.

### Step 3: Add the shared helper code
Add the TypeScript declaration and `enableFigmaCapture()` helper above.

### Step 4a: Prototype Tools menu or standalone button
```tsx
const triggerFigmaCapture = useCallback(() => { enableFigmaCapture(); }, []);
```
```tsx
<button onClick={triggerFigmaCapture} className="flex items-center gap-2 px-3 py-2 text-xs text-secondary hover:text-primary transition-colors" title="Capture page for Figma">
  <Camera size={14} />
  <span className="font-semibold uppercase tracking-wide">Figma Capture</span>
</button>
```
Use this suite's semantic tokens (`text-secondary`, `text-primary`) rather than raw colors. This button is prototype UI like any other and should pass [`audit`](../audit/SKILL.md)'s `code` mode.

### Step 4b: Right-click context menu
Registers a floating "Capture for Figma" pill above the click point. It does **not** call `e.preventDefault()`, so the browser's native context menu still opens too.

```tsx
useEffect(() => {
  function handleContextMenu(e: MouseEvent) {
    const existing = document.getElementById('figma-pill');
    if (existing) existing.remove();

    const pill = document.createElement('button');
    pill.id = 'figma-pill';
    pill.textContent = '📷 Capture for Figma';
    Object.assign(pill.style, {
      position: 'fixed', zIndex: '999999', background: '#1e1e1e', color: '#e0e0e0',
      border: '1px solid #444', borderRadius: '999px', padding: '6px 14px', fontSize: '12px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontWeight: '500',
      cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', whiteSpace: 'nowrap',
      transition: 'opacity 0.15s, transform 0.15s', opacity: '0', transform: 'translateY(4px)',
    });

    const pillHeight = 32;
    const margin = 8;
    pill.style.top = `${Math.max(margin, e.clientY - pillHeight - margin)}px`;
    pill.style.left = `${e.clientX}px`;

    pill.onmouseenter = () => { pill.style.background = '#333'; };
    pill.onmouseleave = () => { pill.style.background = '#1e1e1e'; };
    pill.onclick = (ev) => { ev.stopPropagation(); pill.remove(); enableFigmaCapture(); };

    document.body.appendChild(pill);
    requestAnimationFrame(() => {
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0)';
    });

    function dismiss() {
      pill.style.opacity = '0';
      pill.style.transform = 'translateY(4px)';
      setTimeout(() => pill.remove(), 150);
      document.removeEventListener('click', dismiss, true);
      document.removeEventListener('scroll', dismiss, true);
      document.removeEventListener('keydown', dismiss, true);
    }
    setTimeout(() => {
      document.addEventListener('click', dismiss, true);
      document.addEventListener('scroll', dismiss, true);
      document.addEventListener('keydown', dismiss, true);
    }, 0);
    // Do NOT call e.preventDefault() — the native context menu still appears
  }

  document.addEventListener('contextmenu', handleContextMenu);
  return () => document.removeEventListener('contextmenu', handleContextMenu);
}, []);
```

Vue/Svelte/plain HTML: same handler logic inside the framework's mount/unmount lifecycle.

### Step 5: Tell the user how to use it
1. Trigger the capture (click the button, or right-click then click the pill).
2. Use Figma's native toolbar: **Copy to clipboard**, **Entire screen**, or **Select element**.
3. Switch to Figma and paste (Cmd/Ctrl+V) as editable layers.

### Removing Figma capture

1. Search the file for `figma` (case-insensitive) to find all references.
2. Delete `enableFigmaCapture`, the `Window` type declaration, `FIGMA_CAPTURE_SCRIPT_ID`/`SRC`.
3. Button method: delete the callback and button JSX (and the icon import if unused elsewhere).
4. Context menu method: delete the lifecycle hook containing the `contextmenu` listener.

### Notes
- `captureForDesign` serializes actual DOM nodes, styles, and images. It pastes as editable Figma layers, not a flat screenshot.
- Works with any framework: React, Vue, Svelte, plain HTML.
- The context-menu pill never suppresses the native right-click menu.

---

## Mode: import

The Figma MCP server already generates code from a design (`get_design_context`, `get_screenshot`, `get_metadata`), but its raw output doesn't know this suite's conventions: it won't use our semantic token roles, won't land in the right atomic tier, and won't follow [`scaffold`](../scaffold/SKILL.md)'s folder layout. This mode wraps it with precise control over the mapping so imported code looks written for this codebase, not pasted in from elsewhere.

### Step 1: Resolve the target and check for an existing mapping

1. Resolve the Figma URL/frame/selection the user gave. Use `get_metadata` to understand its structure before pulling full design context. Large frames should be scoped down to the actual target, not imported wholesale.
2. Check `get_code_connect_map` / `list_file_components_for_code_connect` for this file. If components in the target already have a Code Connect mapping to real components in *this* codebase, reuse that mapping instead of generating new code for something that already exists. Don't duplicate a component that Code Connect already knows maps to `Button.tsx`.
3. Pull the actual design content with `get_design_context` and, if useful for verification, `get_screenshot`.

### Step 2: Map colors/spacing/type onto our semantic roles, not Figma's raw values

Pull `get_variable_defs` for the target. For each value used:
- If it matches (or closely matches) an existing role in [`styleguide/references/semantic-role-mold.md`](../styleguide/references/semantic-role-mold.md), use that semantic Tailwind class (`bg-surface`, `text-primary`), never the raw hex or Figma's literal pixel value.
- If it's a genuinely new value with no existing role, don't invent a one-off token inline. Flag it: this likely means the design introduces a new brand/token decision, which belongs in [`styleguide`](../styleguide/SKILL.md) (forge mode), not something this mode should silently absorb. Append it to `docs/UNKNOWNS.md` if it's not clear whether it's intentional.

### Step 3: Place the generated code correctly

Follow [`storybook`](../storybook/SKILL.md)'s tier taxonomy: decide whether the imported piece is an atom/molecule/organism/widget/page and place it in the matching folder from [`scaffold`](../scaffold/SKILL.md)'s layout. If the tier is ambiguous, ask rather than guessing — a component landing in the wrong tier is exactly the drift `audit`'s `craft` mode consistency checkpoint later catches, better to get it right on import.

### Step 4: Verify before calling it done

Run the same checks `audit`'s `code` mode would: zero hardcoded hex, zero raw Tailwind palette colors, zero redundant `dark:` overrides, and the component extends the native HTML element's attribute interface rather than a hand-rolled prop list. Imported code fails this far more often than hand-written code — Figma's own code-gen defaults to literal values, so don't skip this step just because the import "looked right."

**Completion criterion:** `grep -rnE "text-\[#|bg-\[#|#[0-9A-Fa-f]{3,6}"` against the newly imported file returns nothing, and the component lives in the atomic tier/folder that matches what it actually is.

---

## Mode: sync

Syncs this suite's token system with a Figma library, in either direction. **Determine direction from what the user actually asked — don't infer it.** "Bring the Figma library into our tokens" is Import; "push our design system to Figma" is Export. If genuinely ambiguous, ask.

Before any write to Figma (Export direction), follow the MCP server's own `/figma-use` guidance first. It's a prerequisite the server itself requires before `use_figma` calls, not optional here.

Both directions use the same correspondence table: [`styleguide/references/semantic-role-mold.md`](../styleguide/references/semantic-role-mold.md). That table is the single source of truth for what a "role" is on both sides; don't maintain a separate mapping for Figma.

### Import: Figma library → our tokens

Effectively [`styleguide`](../styleguide/SKILL.md)'s forge-mode Step 1-3 sourced from Figma instead of live CSS or a brand guide. Reuse its discipline — don't relax it just because the source is structured data.

1. `get_libraries` to find the target library, then `get_variable_defs` to pull its actual variable values (colors, typography, spacing, radius).
2. Map each Figma variable onto a role in `semantic-role-mold.md` by name/purpose, the same way forge mode's Step 3 rebinds Layer 2. **Verified beats provided**: if a Figma variable's name is ambiguous about which role it plays, don't guess. Check how it's actually used in the library's components (`search_design_system`) before binding it.
3. **If a value conflicts with what's already in `index.css`** (this app already has a value for a role the Figma library also defines), don't silently overwrite. This is exactly the conflict forge mode's Step 1 requires asking about. Surface it and ask which is authoritative.
4. A Figma variable with no matching role in the mold is a new-token candidate, not something to force into an existing role. Flag it to `docs/UNKNOWNS.md` rather than inventing a role on the spot.
5. Write the resolved values into `index.css` (Layer 1 + Layer 2, per [`styleguide`](../styleguide/SKILL.md)), then regenerate `DESIGN.md`.

**Completion criterion:** every role in `semantic-role-mold.md` that the Figma library actually defines has a value in `index.css`, and every conflict was surfaced to the user rather than silently resolved.

### Export: our tokens → Figma library

1. Read the current `index.css` (Layer 1 + Layer 2) and `DESIGN.md`.
2. Map each semantic role to a Figma Variable using the same `semantic-role-mold.md` correspondence: collections/modes for light vs. dark, matching how `index.css`'s `:root`/`.dark` split already works.
3. Use `use_figma` (after `/figma-use`) to create or update the target library's Variables. If component documentation should ship alongside (not just raw variables), use `create_new_file`/`upload_assets` to publish a documentation page summarizing `DESIGN.md`'s eight sections. Don't reinvent that structure, just render what `styleguide` already generated.
4. Confirm with the user before overwriting an existing Figma library's variables — a write to a shared external system, not a local file, so the "confirm before overwriting" bar is higher than usual.

**Completion criterion:** every role in `semantic-role-mold.md` that this app actually uses exists as a Figma Variable with the matching light/dark values, and the user explicitly confirmed the write before it happened.
