# Type: Chatbot / Conversational

For prototypes whose core surface is a chat or AI-assistant interaction: thread-based conversation, not a form or data grid.

## Step 1: Model the thread, not just the message

Define the data shape as **threads containing messages**, not a flat message list. Even a single-conversation prototype benefits from this shape since "start a new conversation" and "switch between conversations" are both realistic asks. Each message needs at minimum: role (user/assistant/system), content, timestamp, and a streaming/pending state distinct from settled state.

## Step 2: Design the streaming states explicitly

A chat UI has UI states most prototypes don't: message mid-stream (partial content, still growing), a "thinking"/pending indicator before the first token, and a settled/complete message. Mock all three in the seed data and prototype store. Don't just seed complete messages, since the mid-stream state is often where real UX problems (layout shift, scroll-jumping) show up.

## Step 3: Document the prompt/context layering, if relevant

If the prototype's behavior depends on how instructions are layered into context (system prompt + tool definitions + retrieved documents + conversation history, or similar), write this down as a short reference doc, not to spec a real backend, but so a reviewer understands *why* the assistant responds the way it does in the prototype's canned/mocked responses. Keep it proportional: a one-page description of the layers is enough for a prototype; don't build a real prompt-engineering spec.

## Step 4: Support the display modes the persona actually needs

A conversational UI is often embedded, not full-page. Decide up front which of these the prototype needs and only build those:
- **Fullscreen**: the primary, dedicated chat surface.
- **Modal**: launched over another view, for a "help me with this" style assistant.
- **Sidebar/docked panel**: persistent alongside other content, for an always-available assistant.

Each mode has different constraints (a sidebar needs a much narrower message layout than fullscreen). Don't design one layout and reuse it unchanged across modes.

**Completion criterion:** the thread/message data model supports starting a new thread and switching between existing ones; all three message states (pending, streaming, settled) are represented in the mock store, not just settled messages; each supported display mode has a layout that actually fits its real width constraint.
