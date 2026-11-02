# CLAUDE.md — orcunkoraliseri.com

The personal academic website of Orcun Koral Iseri. It is built with static HTML, CSS, and vanilla JS (no framework, no bundler) and hosted on GitHub Pages at `www.orcunkoraliseri.com`.

The full project context lives in the manager prompt, which is imported below. Read it before starting any non-trivial task:

@Prompt/MANAGER_PROMPT.md

## Hard rules (short version)

- **Plan first, then build.** For anything beyond a small fix, write `docs_implementationPlan/<section>/implementation_plan.md` and get approval before building. Afterwards, write `walkthrough.md`.
- **Never run `node tools/build-blog.js` as-is.** It would drop 5 hand-added posts from `blog.html`. See §5 of the manager prompt.
- **Phone changes must not alter desktop.** Every `mobile.css` rule goes inside `@media (max-width: 768px)`, and `mobile.js` exits above 768px.
- **The HTML is the source of truth.** The CSVs in `content/` are stale.
- **Don't invent bio, publication, or skill content.** Ask the user or use the CV.
- **Keep the docs current.** After structural changes, update `Prompt/MANAGER_PROMPT.md` (and its Session Log) and this file if a rule changes.

## Commands

```bash
npm run dev                   # http://localhost:3000
node tools/mobile-audit.js    # needs: npm i -D playwright && npx playwright install chromium
```
