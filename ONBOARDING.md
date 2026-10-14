# UX Atlas (AIX fork): first-time user guide

This guide takes you from the GitHub link to your first finished, reviewed design artifact. It assumes you have never used these skills before. Follow it in order and do not skip the "Check" lines: each one tells you whether you are safe to continue.

**Status of this guide:** written for a pilot test. The macOS and Claude Code route was checked by running the installer against a throwaway home folder. The Windows route and the Claude.ai chat route are written but **not yet verified**; they are marked. If something here does not match your screen, that is a defect in the guide, not in you. Write it down (Part 9).

**Licence:** this fork has no licence file yet. Use it for the pilot only. Do not redistribute it.

---

## Part 0. Before you start

You need:

- A GitHub account (free). Create one at github.com if you do not have one.
- Claude, in one of two ways (you pick in Part 2):
  - **Claude Code** (the Claude desktop app's Code tab, or the `claude` command in a terminal). Skills can read and write files in a project folder.
  - **Claude.ai in the browser.** No access to your files; skills run as conversation.
- An empty folder on your computer for the practice project. Call it `atlas-practice`.
- About 45 minutes.

### Guardrails card (read once, applies to everything below)

| # | Rule | Why |
|---|---|---|
| G1 | Practice only in `atlas-practice`. Never point a skill at a client project, a production repo, or a folder with real research. | A skill can write files. A first session must not be able to damage real work. |
| G2 | Do not paste passwords, API keys, tokens, client names or real user data into any chat. | Claude never needs them for this guide. |
| G3 | Keep Claude on its default "ask before editing" behaviour. Do **not** switch on bypass, auto-accept or "dangerously skip permissions". | You approve every file change yourself. |
| G4 | **Plan first.** Before any skill writes a file, it must show you a plan and ask. If a skill starts writing without showing a plan, say "stop, show me your plan first". | This is the main safety net. |
| G5 | **No invented evidence.** A persona, quote, number or competitor fact must trace to something you gave the skill or that it found and cited. If it cannot, it must say "unknown". Treat any untagged claim as invented. | Fabricated research is the failure these skills are built to prevent. |
| G6 | **Human review.** Every skill ends by asking you to review. Read the output before running the next skill. | Skills draft; you decide. |
| G7 | Stop and tell the observer if: a file appears outside `atlas-practice`; Claude asks for a password or token; you are stuck for more than 5 minutes. | Those are the three ways a session goes wrong. |

---

## Part 1. Get the files (pick ONE route)

The repository is **RPalis/ux-atlas-aixlab**. Ask the person who gave you this guide which route applies to you.

### Route A. You were invited to the private repository

1. Open your email and find the message "RPalis invited you to collaborate on RPalis/ux-atlas-aixlab". Click **View invitation**.
2. If GitHub asks you to sign in, sign in.
3. Click **Accept invitation**.
4. You land on the repository page. **Check:** you see a file list that includes `skills`, `README.md` and `install.sh`.
5. The work lives on a branch, not the default one. Click the branch button (it says `main`), choose **`update-readme-retire-competitors-duplicate`**. **Check:** the file list now includes `ONBOARDING.md`. If not, you are on the wrong branch.
6. Go to **Get the files** below.

If you see "404 Not Found" at step 4, you are signed in to the wrong GitHub account. Click your avatar (top right), check the username matches the invited one, and switch accounts.

### Route B. The repository is public

1. Open the link you were given.
2. Click the branch button (it says `main`), choose **`update-readme-retire-competitors-duplicate`**.
3. **Check:** you see `ONBOARDING.md` in the file list.
4. Go to **Get the files** below.

### Route C. You were sent a ZIP file

1. Save the ZIP somewhere you can find it (Downloads is fine).
2. Unzip it: double-click on macOS; right-click then **Extract All** on Windows.
3. **Check:** the unzipped folder contains `skills`, `README.md` and `install.sh`.
4. Skip to Part 2.

### Get the files (Routes A and B)

1. On the repository page, click the green **Code** button.
2. Click **Download ZIP**. (If you already use Git, you may copy the HTTPS address and run `git clone` instead; most people should use the ZIP.)
3. Open the file from your Downloads and unzip it, as in Route C step 2.
4. **Check:** the folder contains `skills`, `README.md` and `install.sh`.

---

## Part 2. Pick your track

| | Track 1: Claude Code | Track 2: Claude.ai chat |
|---|---|---|
| What you do | Run one installer, then talk to Claude in a project folder | Upload skills one at a time in settings |
| Files | Skills read and write files in `atlas-practice` | No file access; output comes back in the chat |
| Plan-first gate | Claude Code's Plan mode **and** each skill's own plan step | Each skill's own plan step only |
| Best for | The full guide | Quick try-out of the research and thinking skills |
| Status | Checked on macOS | **Not yet verified** |

Choose one. Do the matching install section, then continue at Part 4.

---

## Part 3. Install

### Track 1. Claude Code

#### 3.1 macOS (verified)

1. Open **Terminal** (press Cmd+Space, type Terminal, press Enter).
2. Type `cd ` (with a space after it), then drag the unzipped folder from Finder onto the Terminal window. Press Enter.
3. Run:

```bash
./install.sh --claude --no-open
```

4. If you see "permission denied", run `chmod +x install.sh` and try again.
5. Expected ending, near the last lines:

```text
Symlinked 30 skills into Claude Code (…/.claude/skills)
Successfully installed 30 skills!
```

6. **Check:** the number is **30**. If it is not, stop and report it.

What this did: copied the skills to `~/.agents/skills` and linked each one into `~/.claude/skills`. It touched nothing else. To remove everything later, delete the 30 linked folders in `~/.claude/skills` and the copy in `~/.agents/skills` (the installer's file `.ux-atlas.manifest` lists exactly what it installed).

#### 3.2 Windows (not yet verified)

The installer is a bash script and uses symlinks, so it needs a Linux-style shell. Two options:

- **Option 1, WSL (recommended):** install "Ubuntu" from the Microsoft Store, open it, unzip the files inside it, then follow the macOS steps. Claude Code must be installed inside the same environment.
- **Option 2, copy by hand (no installer):** open the unzipped `skills` folder, select all 30 folders, copy them into `C:\Users\<you>\.claude\skills` (create that folder if it is missing). **Check:** inside `.claude\skills` each folder contains a file named `SKILL.md`.

Tell the observer which option you used.

### Track 2. Claude.ai chat (not yet verified)

Skills are uploaded as ZIP files, one folder per skill.

1. Choose 3 skills to start: `help`, `brief` and `interview-analysis`.
2. For each, make a ZIP of its folder. On macOS: right-click the folder (inside `skills`) then **Compress**. On Windows: right-click then **Send to > Compressed (zipped) folder**. **Check:** opening the ZIP shows one folder with `SKILL.md` inside it, not loose files.
3. In Claude.ai, open **Settings**, then the section for **Capabilities** or **Skills** (the name may differ). Turn skills on if asked.
4. Click the upload or **+** button, choose the ZIP, confirm.
5. **Check:** the skill appears in the list and is switched on. Repeat for the next skill.

Skills that write a document shell into a project folder (`setup`, `prototype`, `package`) cannot do that in chat. Use the research and thinking skills: `brief`, `interview-analysis`, `problem-statement`, `brainstorming`, `information-architecture`, `ux-benchmark`, `usability-test-plan`, `persona`, `journey`.

---

## Part 4. Verify the install

### Track 1

1. Create the folder `atlas-practice` and open it in Claude Code. In the desktop app: open the **Code** tab and choose `atlas-practice` as the working folder (the button label may differ). In a terminal: `cd atlas-practice` then `claude`.
2. Press **Shift+Tab** until the mode indicator says **plan mode**. (Plan mode means Claude shows a plan and waits for you before changing anything.) Leave it on for now.
3. Type `/` and look at the list that appears. **Check:** you can find skills such as `setup`, `brief`, `persona`, `audit`.
4. Type: `Use the UX Atlas help skill and tell me which skill to run first.`
5. **Check:** Claude names a skill and gives a reason tied to what it found in the folder (for an empty folder it should say `setup`). If you typed `/help` and saw Claude Code's own help screen instead, that is normal: the built-in command wins. Use the sentence above.
6. If the skills do not appear: quit Claude Code completely and reopen it, then repeat step 3. Still nothing: go to Part 8.

### Track 2

1. Start a new chat.
2. Type: `Use the help skill. I am starting a new product idea and have no files yet.`
3. **Check:** Claude names a next skill and says why. If it answers without mentioning a skill, open the skills list and confirm `help` is switched on.

---

## Part 5. First run: Plan, Execute, Audit

You will make a small practice project. Pick any invented product idea (for example "an app to share weekly meal plans with housemates"). Do not use a real client idea.

### Step 1. Plan

Track 1, in plan mode: `Use the setup skill. Project: <your idea in one sentence>. Starting point: brand-new idea.`

1. Claude shows a plan. Read it. **Check:** it only mentions files inside `atlas-practice`. If it mentions anything outside the folder, stop (rule G7).
2. Approve the plan.
3. Switch out of plan mode (Shift+Tab) only if Claude asks to edit files. Approve each edit one at a time (rule G3).
4. **Check:** `atlas-practice` now contains `README.md`, `AGENTS.md` and a folder named `<something>-docs` with `UNKNOWNS.md` in it.

Track 2: run `brief` instead and paste your one-sentence idea.

### Step 2. Execute one skill

Run `brief`. It interviews you, one question at a time. Answer honestly; say "I don't know" where you do not. **Check:** every "I don't know" ends up in `UNKNOWNS.md` (Track 1) or in an "Unknowns" list (Track 2), not as an invented answer.

### Step 3. Test the evidence guardrail on purpose

Run `persona` in `card` mode and **do not give it any research**.

- **Expected, correct behaviour:** the skill refuses to invent users and asks you for research or interviews.
- **Defect:** it writes a finished persona with names, ages and quotes. Report this immediately.

### Step 4. Audit

Pick the right audit for what you made:

| You made | Run | What it does |
|---|---|---|
| A prototype screen | `audit` mode `craft` | Scored critique and a task list. Fixes nothing. |
| A prototype screen | `audit` mode `heuristic` | 12-point Nielsen pass. A different rubric, so do not compare the two scores. |
| A prototype with real code | `audit` mode `a11y` | WCAG pass, criterion by criterion. |
| A prototype with real code | `audit` mode `code` | Coding standards and token use. |
| A build and an approved design | `audit` mode `spec` | Build against design, screen by screen. |
| Research or planning docs | Read the skill's own review checklist | These skills end with one. |

For each finding, write one word beside it: **accept**, **reject** or **unsure**. Nothing is fixed until you say so.

### Step 5. Review and stop

Read what you produced. Close the session. Go to Part 9.

---

## Part 6. If you have, or do not have, a design system

Ask yourself one question: **"Do I already have a design system?"** This is advice, never a blocker. Claude will ask you; you can say "skip" and carry on, and your output is labelled so nobody mistakes placeholder values for real ones.

| Your situation | What to do | Result |
|---|---|---|
| **A. Tokens or CSS already in code** (an `index.css` with colour and spacing variables) | Run `styleguide` and ask it to audit and document what exists. | A `DESIGN.md` generated from your real tokens. |
| **B. A brand but no system** (brand guide PDF, a live website, hex codes you can type) | Run `styleguide` in **forge** mode. Give it your sources. If two sources disagree (guide says one blue, the site shows another), it must ask you which wins. | Tokens cast from your real brand, every value traced to a source. |
| **C. A Figma library only** | Run `figma` in **import** mode, then **sync** to keep tokens aligned. Needs the Figma connector (MCP) set up. | Code that follows your library. |
| **D. Nothing yet** | Run `styleguide` in default mode. | A placeholder palette. Every screen built on it is labelled "placeholder tokens". Come back to B later. |

**Check:** whichever you choose, ask Claude "which of these values came from my sources and which did you choose?" A correct answer separates the two.

---

## Part 7. What good looks like

You are done with a skill when:

- You saw a plan before any file was written.
- Every claim is tagged evidenced, inferred or assumed, or is listed under unknowns.
- You reviewed the output and said accept, reject or unsure.

If one of those is missing, the skill did not finish properly. Report it even if the output looks good.

---

## Part 8. Troubleshooting

| Symptom | Likely cause | What to try |
|---|---|---|
| Installer says "permission denied" | File not marked executable | `chmod +x install.sh`, run again |
| Installer says "command not found" or "bad interpreter" | Windows line endings or not a bash shell | Use WSL, or the copy-by-hand option |
| Typing `/` shows no UX Atlas skills | Claude Code started before install | Quit fully and reopen |
| Skill count is not 30 | Partial download | Re-download the ZIP and run the installer again |
| `/help` shows a different help screen | Built-in command takes priority | Say "Use the UX Atlas help skill" |
| Skill starts writing before showing a plan | Plan-first step skipped | Say "stop, show me your plan first"; report it |
| Claude asks for a password or token | It should not | Stop; do not enter it; tell the observer |
| Track 2: skill uploaded but ignored | Skill switched off or ZIP has loose files | Check the toggle; re-zip the folder itself |
| Output mentions a skill you cannot find | Stale reference | Note the name and report it |

---

## Part 9. Tell us what happened

Fill this in right after the session, while you remember. Honest answers help most, including "I got confused here".

1. Which route (A, B or C) and which track (1 or 2)? Which operating system?
2. How long from opening the link to a successful Part 4 check?
3. The first place you hesitated, and why.
4. Any step where the guide did not match your screen. Copy the step number.
5. Did any skill write a file before showing you a plan? Which one?
6. Did the persona test (Part 5, Step 3) refuse correctly?
7. Which audit did you run, and how many findings did you accept, reject, mark unsure?
8. Did you say yes to something you did not fully understand? What was it?
9. Would you use these skills again on real work? What would stop you?

---

## For the observer

- Do not help unless the tester has been stuck for 5 minutes or rule G7 triggers. Note the time and what you said.
- Record: route, track, OS, time to first successful check, every hesitation, every point where you intervened.
- A tester who needs help at a step is a defect in that step. Log the step number.
- After the session, put findings in the table below and send to the guide owner.

| Step | What happened | Time lost | Guide defect (Y/N) | Fix proposed |
|---|---|---|---|---|
| | | | | |
