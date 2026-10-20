# AIX Lab-Atlas: Onboarding

Start here. Pick the guide that matches how you will work. Each one has a **Check** line after every step that can go wrong.

| Guide | Use it when |
|---|---|
| [Install, click by click](onboarding/AIX-Lab-Atlas-Install-Click-by-Click.pdf) | **Start here.** Every click to install the skills in Claude Code (Part A) or Claude Design (Part B) |
| [Start here](onboarding/AIX-Lab-Atlas-Start-Here.pdf) | You want the short version: one install, then Claude Code, Chat or Claude Design |
| [Claude Code](onboarding/AIX-Lab-Atlas-Skills-in-Claude-Code.pdf) | You work in Claude Code in the desktop app: install the plugin with one line, then use the skills. No terminal. |
| [Claude Design](onboarding/AIX-Lab-Atlas-Skills-in-Claude-Design.pdf) | You work in Claude Design: connect the repository, copy the skills, add the rule file |

Each guide also exists as a Word file in the same folder, [`onboarding/`](onboarding/).

## Rules that apply to every guide

1. Practise only in a folder called `atlas-practice`, with an invented product idea. Never use client material.
2. Never paste passwords, API keys, tokens or real user data into a chat.
3. Keep Claude on its default, which asks before editing. Do not switch on bypass or auto-accept.
4. Plan first: a skill must show a plan before it writes anything.
5. No invented evidence: every persona, quote or number needs a source, otherwise the skill says "unknown".
6. Read each output before you run the next skill.
7. Stop and tell your observer if a file appears outside your practice folder, Claude asks for a password, or you are stuck for 5 minutes.

## For observers

Run the session with [`OBSERVER-SCRIPT.md`](onboarding/OBSERVER-SCRIPT.md), give the tester [`FEEDBACK-FORM.md`](onboarding/FEEDBACK-FORM.md) afterwards, and log findings in [`FINDINGS-LOG.csv`](onboarding/FINDINGS-LOG.csv).

## What each skill needs

The README's [Environments table](README.md#environments) lists, for every skill, whether it needs a file system, a shell and Node.js, an MCP server or web access.
