# CLAUDE.md — orcunkoraliseri.com

The personal academic website of Orcun Koral Iseri. It is built with static HTML, CSS, and vanilla JS (no framework, no bundler) and hosted on GitHub Pages at `www.orcunkoraliseri.com`.

The full project context lives in the manager prompt, which is imported below. Read it before starting any non-trivial task:

@Prompt/MANAGER_PROMPT.md

## Hard rules (short version)

- **Plan first, then build.** For anything beyond a small fix, write `docs_implementationPlan/<section>/implementation_plan.md` and get approval before building. Afterwards, write `walkthrough.md`.
- **`tools/build-blog.js` merges `content/blog/extra-posts.json`.** The 6 hand-added posts are registered there (`"handwritten": true`) so regenerating preserves them. Register any new hand-written post in `extra-posts.json` before running `node tools/build-blog.js`.
- **Phone changes must not alter desktop.** Every `mobile.css` rule goes inside `@media (max-width: 768px)`, and `mobile.js` exits above 768px.
- **The HTML is the source of truth.** The CSVs in `content/` are stale.
- **Don't invent bio, publication, or skill content.** Ask the user or use the CV.
- **Keep the docs current.** After structural changes, update `Prompt/MANAGER_PROMPT.md` (and its Session Log) and this file if a rule changes.

## Commands

```bash
npm run dev                   # http://localhost:3000
node tools/build-blog.js      # rebuilds Blogger posts + blog.html (merges extra-posts.json)
node tools/bump-assets.js     # refreshes ?v=<md5-8> cache-busters across all HTML files
node tools/mobile-audit.js    # needs: npm i -D playwright && npx playwright install chromium
```

**Deploy:** this folder is a git checkout of `github.com/orcunkoraliseri/myWebsite` (`main`), which serves GitHub Pages. Run `git pull`, commit, then `git push`; the site updates in about 1–2 minutes. Commit or push only when the user asks.
