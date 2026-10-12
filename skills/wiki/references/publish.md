# Mode: publish

Goal: a read-only site for people who have no editor or no repo access (the client, other teams).

The team itself reads the folder in Obsidian, Plainva or any editor. Publish is for everyone else.

## Step 1: Check what goes out

1. Run `lint` first if `wiki-status` shows `LINT never` or an age above 14 days.
2. Tell the user what the filter does. It is mechanical:
   - **In:** wiki pages that are not `status: draft` or `publish: false`; files in `artifacts.md` unless `Publish = no`; sources only with `Publish = yes`.
   - **How each file type appears:** a `.md` file is a page. A `.html` file (a `showcase` `reveal` deck, a hand-built interactive sitemap) is copied as it is and linked under **Presentations**. The site links to it and does not embed it, and the deck's own screenshots and styles come along. Any other file (`.pptx`, `.docx`, `.pdf`, `.svg`) is linked under **Downloads**.
   - **Images:** an image a page uses is copied when it sits in the docs folder. An image from `my-notes/`, or from a source that is not opted in, is dropped.
   - **Out:** `my-notes/`, drafts, and every source that is not opted in. In the published `sources.md`, rows that are not opted in are removed, so a private title does not leak.
   - A link to a file that is out shows as plain text.
   - To appear on the site, a deck or download needs a row in `artifacts.md`. `showcase` saves its files in `<docs>/exports/`. Register each one there.
3. Ask which sources to opt in, if any. Set `Publish` to `yes` in the row only after the user says yes. Never opt a source in on your own.

## Step 2: Build

```bash
npm i marked          # once, in the current directory
node ../../../tools/wiki-site/wiki-site.mjs <repo-root> --out wiki-site
```

The tool path is relative to this file. The tool prints the page count and everything it left out. Show the user the "left out" list.

The site needs no server and no network. Open `wiki-site/index.html` from disk or put the folder on any static host.

## Step 3: Log and hand over

Append `## [YYYY-MM-DD] publish, <n> pages, <m> sources opted in` to `log.md`.

[`package`](../../package/SKILL.md) in `full` mode includes `wiki-site/` in the handoff zip when it exists.

## Ship it with the prototype

To publish next to the prototype, build into the frontend's public folder: `--out <frontend>/public/wiki`. The prototype's normal build and [`package`](../../package/SKILL.md) then carry it, and the app can link to `./wiki/index.html` from its Prototype Tools menu ([`scaffold`](../../scaffold/SKILL.md) adds an optional launcher). Rebuild the site before each package run.

## Editing is back-and-forth only in the Markdown folder

The Markdown folder is the one place people edit and the wiki reads. Pushes to other tools (the site, Confluence, Notion) are one-way copies: an edit made there does not come back. Tell the team to edit in a Markdown editor (see the docs-root README for starters), and treat every published copy as read-only.

## Optional: push to Confluence or Notion

Only when the user has connected that MCP server. Apply the same filter, then push the filtered set. Notion and Confluence do not keep relative links when you import a folder, so push page by page and rewrite each link to the target page. State this dependency up front. If the server is not connected, say so and stop. Do not ask for credentials.

**Completion criterion:** `wiki-site/index.html` exists, the "left out" list was shown to the user, no source went out without an explicit yes, and `log.md` has the publish line.
