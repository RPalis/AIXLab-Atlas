# UX copy

Words are part of the interface. Fix them with the same care as layout.

## Contents

- Rules
- Buttons and links
- Errors
- Empty states
- Confirmations
- Checklist

## Rules

- Use the words the user uses. Do not use internal terms or system names.
- Say what happens, in the active voice, in the fewest words that stay clear.
- Be consistent: one word for one thing across the product. Keep a list in `GLOSSARY.md`.
- Write real copy in prototypes. Do not ship "Lorem ipsum" or "Click here".
- Front-load the key word in labels and headings.

## Buttons and links

- Use a verb and an object: "Save changes", "Send invoice". Avoid "Submit", "OK", "Yes".
- A destructive button names the thing: "Delete 3 files".
- A link says where it goes, out of context: "View billing history", not "here".

## Errors

An error message says what happened, why if known, and what to do next. It does not blame the user.

| Weak | Better |
|---|---|
| Invalid input | Enter a date in the format 12/31/2026 |
| Error 500 | We could not save your changes. Try again, or copy your text first. |
| Password does not meet requirements | Use at least 12 characters. Add a number. |

Place the message next to the field and link it with `aria-describedby`. Do not rely on color alone.

## Empty states

An empty state has three parts: why it is empty, what the user gains by filling it, and one clear action. "No reports yet. Reports show how your team spends time. Create a report."

## Confirmations

Confirm only what the user cannot undo. Prefer an undo toast to a confirmation dialog. When a dialog is needed, the title states the action and the buttons repeat the verbs.

## Checklist

- No placeholder text remains.
- Every button is a verb phrase.
- Every error says the next step.
- Every empty state has an action.
- Terms match the glossary.
