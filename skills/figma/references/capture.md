# Figma: capture mode

Part of the [`figma`](../SKILL.md) skill. Shared rules in `SKILL.md` still apply.

Add page capture to any prototype in this suite via a **button** or a **right-click context menu**. The capture loads Figma's script, serializes the DOM, and shows Figma's native toolbar with **Copy to clipboard**, **Entire screen**, and **Select element**.

No API keys, tokens, or Figma file IDs needed — a client-side script load, not an MCP call, adding no build dependency.

## Contents

  - How it works
  - Shared code
  - Choose an integration method and placement
  - Step 1: Identify the integration point
  - Step 2: Read the target file
  - Step 3: Generate the shared helper
  - Step 4a: Prototype Tools menu or standalone button
  - Step 4b: Right-click context menu
  - Step 5: Tell the user how to use it
  - Removing Figma capture
  - Notes

### How it works

Figma's `capture.js` exposes `window.figma.captureForDesign()`. Calling it serializes the DOM and copies it to the clipboard as editable Figma layers. After the first capture, Figma's native toolbar stays visible for subsequent captures using its own built-in buttons.

### Shared code

Both integration methods use the same core helper — a static module, identical across every project, so generate it rather than hand-typing it: [`tools/figma-capture-helper`](../../../tools/figma-capture-helper/write-capture-helper.sh) writes it to a target path.

```bash
../../../tools/figma-capture-helper/write-capture-helper.sh src/lib/figma-capture.ts
```

That produces a module exporting `enableFigmaCapture()`:

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

export function enableFigmaCapture() {
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

Import it from wherever the button or context menu gets wired up: `import { enableFigmaCapture } from '<path-to>/figma-capture';`. Placement (which file, which directory) is this skill's call, not the script's — pick a path consistent with the project's existing structure (e.g. beside other `lib/`/`utils/` helpers).

### Choose an integration method and placement

Ask the user which they prefer. **Don't assume the Prototype Tools menu is scaffolded**:
- **A launcher inside the "Prototype Tools" user-menu section**: the natural placement when [`scaffold`](../../scaffold/SKILL.md)'s menu already exists in this prototype.
- **A standalone button** elsewhere: a toolbar, sidebar footer, or settings menu, for a prototype without that menu or where the user wants it more visible.
- **A right-click context menu**: no visible UI added, works globally. Default to this if the user has no preference and no Prototype Tools menu exists.

**Autonomous mode:** skip the ask, this is already tier-1 safe (reversible, purely additive UI) — use the Prototype Tools menu if it exists, otherwise the context menu default above. Log which placement was used.

### Step 1: Identify the integration point
Find the app's root component or layout wrapper: `App.tsx`, a `Layout`/`Shell` component, or the Prototype Tools menu component if that placement was chosen.

### Step 2: Read the target file
Identify the framework, icon library, and styling approach in use.

### Step 3: Generate the shared helper
Run `tools/figma-capture-helper/write-capture-helper.sh` (see Shared code, above) to write the helper module, then import `enableFigmaCapture` into the target file.

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
Use this suite's semantic tokens (`text-secondary`, `text-primary`) rather than raw colors. This button is prototype UI like any other and should pass [`audit`](../../audit/SKILL.md)'s `code` mode.

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

1. Search the repo for `figma-capture` (case-insensitive) to find the helper module and every import of it.
2. Delete the helper module written by `tools/figma-capture-helper` and its import.
3. Button method: delete the callback and button JSX (and the icon import if unused elsewhere).
4. Context menu method: delete the lifecycle hook containing the `contextmenu` listener.

### Notes
- `captureForDesign` serializes actual DOM nodes, styles, and images. It pastes as editable Figma layers, not a flat screenshot.
- Works with any framework: React, Vue, Svelte, plain HTML.
- The context-menu pill never suppresses the native right-click menu.

---
