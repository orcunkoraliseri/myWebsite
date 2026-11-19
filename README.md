# orcunkoraliseri.com

Personal academic website of **Orcun Koral Iseri**, a researcher in building energy modeling, urban informatics, and AI (UBEM, occupancy modeling, community energy systems).

🌐 **Live:** [www.orcunkoraliseri.com](https://www.orcunkoraliseri.com)

The landing page is a 3×2 grid of colored tiles. Each tile opens one section of the site:

| Tile | Page | What's there |
|---|---|---|
| 🟧 about me | `about.html` | Photo mosaic, short bio, research focus, CV download, social links |
| 🟪 experience | `experience.html` | Research and teaching positions |
| 🟦 education | `education.html` | Degrees (PhD → high school), scholarships, thesis titles |
| 🟩 publications | `publications.html` | Citation metrics, awards, journals, book chapters, conference papers |
| 🔵 blog | `blog.html` | 52 posts (2015–2026) with search and year filters |
| 🟨 skills & tools | `skills.html` | Six skill areas, own tools (OpenUBEM), and postdoc design work (NEXA-web, Resilient Habitat Lab website) |

## Tech

Plain **HTML, CSS, and vanilla JavaScript**. There is no framework, no build step for the main pages, and no runtime dependencies. Fonts are [Inter](https://fonts.google.com/specimen/Inter) and [Caveat](https://fonts.google.com/specimen/Caveat). The site is hosted on **GitHub Pages** with a custom domain (`CNAME`).

## Run locally

```bash
npm run dev          # serves the folder at http://localhost:3000
```

You can also open `index.html` directly in a browser.

## Project structure

```
index.html, styles.css, script.js     Landing grid (hover/tap reveal, 3D tilt)
<section>.html / .css / .js           One set per section page (root folder)
mobile.css, mobile.js                 Shared phone layout (≤768px only; desktop unaffected)
content/                              Images, icons, photos, CV, original data (CSV/txt)
content/blog/posts/                   Individual blog post pages + img/
content/blog/Blogs/Personal Blog/     Original Blogger export (feed.atom)
tools/                                Blog generator + mobile QA scripts (Node/Playwright)
docs_implementationPlan/              Design plan + walkthrough for each feature
References/                           Original design sketches
Prompt/MANAGER_PROMPT.md              Full maintainer / AI-assistant context
```

## Updating content

Content is edited **directly in the HTML pages**. The CSV files in `content/` were the original inputs and are no longer kept in sync.

- **New publication, award, or experience entry:** copy an existing card in the relevant page and keep the newest-first order. On the publications page, also update the group count (`· N`).
- **New blog post:** add the post page to `content/blog/posts/`, add its metadata entry to `content/blog/extra-posts.json`, run `node tools/build-blog.js && node tools/bump-assets.js`, and add the URL to `sitemap.xml`. See `Prompt/MANAGER_PROMPT.md` §5 for the steps.
- **CV:** replace `content/about me/CV/CV_OrcunKoralISERI_AC.pdf`.

### Blog generator

`tools/build-blog.js` builds the 46 posts from the Blogger export, merges the 6 hand-written posts defined in `content/blog/extra-posts.json` (without overwriting their HTML), and writes `blog.html` using optimized thumbnails from `content/blog/posts/img/thumbs/` when available. Run `node tools/bump-assets.js` after editing CSS/JS files to update `?v=` cache-busters across all pages.

## Mobile QA (optional)

```bash
npm i -D playwright && npx playwright install chromium
npm run dev
node tools/mobile-audit.js        # checks horizontal overflow at 320/360/390px
node tools/mobile-shot.js after   # saves phone screenshots to mobile-shots/after/
```

## Docs

- `docs_implementationPlan/<section>/`: the plan and walkthrough for each feature.
- `Prompt/MANAGER_PROMPT.md`: architecture, conventions, maintenance tasks, backlog, and session log.
- `CLAUDE.md`: loads that context automatically for Claude Code sessions.

---

© Orcun Koral Iseri
