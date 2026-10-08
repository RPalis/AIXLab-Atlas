# Type: Mobile App

For prototypes of a phone or tablet app. The prototype is still the standard web scaffold (React, Vite, Tailwind v4, local mock data). It is built mobile-first and shown in a device frame, so stakeholders can judge it and developers can read the behavior. It is not a native build. The hand-off to a native or cross-platform team is the prototype plus its docs.

Read [`refine`](../../refine/SKILL.md)'s [`mobile.md`](../../refine/references/mobile.md) before Step 1. It holds the touch, safe-area, text-scaling and platform rules that this layer assumes.

## Contents

- Step 1: Pick the target platform
- Step 2: Device frame and viewport
- Step 3: Navigation shell
- Step 4: Touch, safe areas and gestures
- Step 5: Installable and offline
- Step 6: Hand-off to native

## Step 1: Pick the target platform

Ask which platform the product ships on first: iOS, Android, or both. The answer sets the navigation, the dialogs and the type.

- **One platform**: follow its conventions fully.
- **Both**: build one coherent prototype on the shared pattern, and list every platform difference in `DESIGN.md` and in a decision record (`decisions`). Do not fake both in one build.
- **Autonomous mode** (suite `AGENTS.md` §2.9): this is a product-positioning checkpoint. Do not pick it. Resolve it with the designer before the layer is applied.

**Completion criterion:** the platform choice is recorded in `PRODUCT_BRIEF.md` or `DESIGN.md`.

## Step 2: Device frame and viewport

- Set `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- Add the safe-area utilities from `mobile.md` to `index.css`.
- In the app shell, show the app inside a device frame on wide screens (a centered column, 390 px wide by default, with a toggle to full width). On a real phone, the frame is off and the app fills the screen.
- Add a device-size switcher to Prototype Tools (small phone 360, phone 390, large phone 430, tablet 820).
- Use `dvh` for full-height screens.

## Step 3: Navigation shell

Choose from the table in `mobile.md`. The default shell is:

- A top app bar with the screen title and back action.
- A bottom tab bar with 3 to 5 destinations, icons with labels.
- Stack navigation inside each tab (React Router nested routes), with each tab keeping its own history.
- Sheets (bottom sheet component) for short tasks and pickers.

Add the tab bar and the sheet to the component inventory so `storybook` documents them.

## Step 4: Touch, safe areas and gestures

- Every target is 44 pt or 48 dp. Use a `min-h-11 min-w-11` base on `Button` and tab items.
- Fixed bars use the safe-area utilities.
- Replace hover states with press states (`active:`) and focus states.
- Add a button alternative for every gesture.
- Use `inputmode`, `type` and `autocomplete` on every field.

## Step 5: Installable and offline

If the product should work like an app on a phone, make the prototype a PWA so stakeholders can add it to their home screen: a web manifest (`display: standalone`, theme color from the tokens, icons) and a small service worker that caches the shell. Keep it optional and local-first. No push, no accounts. Test the offline state with the browser set to offline, and design what the user sees (see `refine`'s `harden.md`).

## Step 6: Hand-off to native

Add to the docs what a native team needs and cannot read from a web build:

- Screen list with the route for each (`map` `document`).
- Gesture and transition notes.
- Platform differences and the decisions behind them.
- Token export: `DESIGN.md` carries the machine-readable tokens. For Figma, use `figma` `sync`.
- Accessibility notes for VoiceOver and TalkBack (from `audit` `a11y`).

**Completion criterion:** the platform is chosen, the shell uses safe areas and a tab bar, every target meets the size, every gesture has a button alternative, and the hand-off notes exist.
