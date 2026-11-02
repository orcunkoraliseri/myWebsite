# Manager Prompt — orcunkoraliseri.com

> **How to use:** At the start of a new session, paste:
> `Read Prompt/MANAGER_PROMPT.md and act as the project manager for this site. Then: <your task>`
>
> Last full scan: **2026-11-02**. If you change something structural, update the relevant section and add a line to the **Session Log** at the bottom.

---

## 1. Your role

You are the manager and lead developer of **Orcun Koral Iseri's personal academic website** (live at `www.orcunkoraliseri.com`). For each request:

1. Read this file first. Then read only the docs/files for the section you're touching (see §4 and §7).
2. **Plan first for anything beyond a small fix:** write or update `docs_implementationPlan/<section>/implementation_plan.md`, show the plan, and wait for approval.
3. Build it, then verify (§6). Write or update `docs_implementationPlan/<section>/walkthrough.md` with what changed and how it was checked.
4. Update this prompt if you changed the architecture, a convention, the data, or the backlog.

The owner is a building-energy / urban-informatics / AI researcher (PhD, Concordia). Content is academic: publications, awards, UBEM, occupancy modeling, community energy systems.

---

## 2. Snapshot

- **Stack:** Static HTML + CSS + vanilla JS. No framework, no bundler, no runtime dependencies. Fonts: Google Fonts **Inter** (UI) + **Caveat** (handwritten tile labels and page titles).
- **Hosting:** GitHub Pages with a custom domain (`CNAME` → `www.orcunkoraliseri.com`). Build-script comments mention the "GitHub Pages CDN".
- ⚠️ **No `.git` in this local folder** (`/Users/orcunkoraliseri/Desktop/myWebsite`). The project was moved from Windows (`C:\Users\o_iseri\Desktop\myWebsıte`), and older docs still use those paths. **Deploy (confirmed 2026-11-02):** the public repo **`github.com/orcunkoraliseri/myWebsite`** (branch `main`) is the GitHub Pages source. A push goes live at www.orcunkoraliseri.com in about 1–2 minutes. Because this folder isn't a git checkout, deploy like this:
  1. `git clone https://github.com/orcunkoraliseri/myWebsite.git <scratch>/repo` (about 120 MB, takes a couple of minutes).
  2. `diff -rq --exclude=.git --exclude=.DS_Store <scratch>/repo .` to make sure the remote has no changes you don't have locally. Ignore the `content/blog/Albums/ne olduğunu…` line: it's a Unicode-normalization (NFC/NFD) difference in the folder name, not real changes.
  3. Copy only the changed files into the clone, commit, and `git push origin main`. HTTPS auth comes from the macOS keychain; SSH is not set up.
  4. Poll `https://www.orcunkoraliseri.com/<page>?x=$RANDOM` until the change appears.
  Only deploy when the user asks.
- **Local server:** `npm run dev` (runs `npx http-server -p 3000`) → http://localhost:3000. Opening `index.html` directly also works, except for the Playwright tools, which need the server.
- **Node:** v22 is available. **Playwright is not installed** (no `node_modules`, not in `package.json`). If you need the audit or screenshot tools: `npm i -D playwright && npx playwright install chromium`.

---

## 3. Architecture

```
index.html + styles.css + script.js      Landing: 3×2 grid of colored tiles → section pages
<section>.html / .css / .js              One trio per section, all in the project root
mobile.css + mobile.js                   Shared phone layer, linked LAST on every inner page
content/<section>/                       Source data (CSV/txt), icons, photos, CV
content/blog/posts/*.html (+ img/)       Blog post pages (mostly generated)
tools/                                   Node build + Playwright QA scripts
docs_implementationPlan/<section>/       implementation_plan.md + walkthrough.md per feature
References/                              Original design sketches (landing, about, old blog)
Prompt/                                  This file
```

### Landing page (`index.html`)
- Six `<a class="tile tile--color">` tiles. Labels are hidden until hover (desktop) or the first tap (touch; a second tap navigates).
- `script.js`: staggered load animation (`body.loaded`), 3D mouse tilt (max 6°, desktop only), tap-to-reveal on touch devices.
- Grid is 3×2 on desktop, 2×3 on tablet, 1×6 on mobile. `body` uses flex centering with `overflow:hidden`. Inner pages override this on mobile (see §5).

### Section pages and theme colors

| Tile | Page | Theme color | Text on pill | Accent (dark variant) | Content notes |
|---|---|---|---|---|---|
| orange | `about.html` | `rgba(240,95,51,1)` | white | — | 14-photo mosaic (7×2), identity card (CV download, 6 social links), Research Focus and Background side by side. **Desktop must fit one viewport with no scroll.** |
| magenta | `experience.html` | `rgba(180,4,149,1)` | white | — | **10** `.exp-card`; icons `teacher.png` / `reseacher.png` (sic) |
| cyan | `education.html` | `rgba(20,199,222,1)` | dark | `rgba(13,145,162,1)` | **5** `.edu-card`, newest first; 🏅 scholarship badges; thesis titles in italics |
| green | `publications.html` | `rgba(48,218,119,1)` | dark | `rgba(22,145,75,1)` | Citation-metrics card (Google Scholar table + bar chart), Awards ·2, Journals ·15, Book Chapters ·1, Conference Proceedings ·14. Owner's name is bolded in author lists. `DOI ↗` buttons; `⏳ Under Evaluation` badges sort to the top of their group. |
| blue | `blog.html` | `rgba(53,152,219,1)` | white | — | **51** post cards, search box + year chips (2015–2026). Post pages use a 760px reading column. |
| yellow | `skills.html` (**Skills & Tools**) | `rgba(253,214,4,1)` | dark | amber `rgba(168,140,0,1)` | **Skills · 6**: cards in 1 row (6→3→2→1 columns at 1024/768/480px), 4–5 keyword chips each; Linked chips: OpenUBEM on Energy Modeling; NEXA-web and RHLab on Web Design. **Tools & Websites · 3**: `.tool-card`s (3 columns on desktop, 1 column at ≤1024px) for OpenUBEM (own tool, *Creator & Developer*, GitHub link), NEXA-web (formerly LMN-Tool, `nexa-rhlab.com`) and the Resilient Habitat Lab site (`rhlab.encs.concordia.ca`); the owner is *Designer & Contributor* on those two. |

Background color: `rgba(248,248,246,1)`. Tile and card radius: 24px. Inner pages share a 1200px max-width container and a sticky `← home` topbar (no shadow).

---

## 4. Conventions (follow these)

- **Card pattern:** each card is white, with a left icon column and right content. On hover: lift (`translateY(-3px)`), a left border in the theme color, and the icon goes from greyscale to color. Under 768px the icon stacks on top.
- **Entrance animation:** add `.hidden-section` to an element. The page's own JS runs an `IntersectionObserver` that adds the visible class. New cards need `hidden-section`, or they still animate in through the observer.
- **New section page:** fork the closest existing CSS (most were forked from `experience.css`). Swap the theme color. Use dark text on pills for the light tiles (cyan, green, yellow) and a darker accent variant for titles and hover states.
- **Desktop-frozen rule (mobile work):** every `mobile.css` rule lives inside `@media (max-width: 768px)`, and `mobile.js` returns immediately above 768px. Never change desktop rendering while doing mobile work. On phones, `mobile.js` adds the "show the headline, collapse the depth" toggles: About "Read more", Experience/Education "Show details (N)", and Publications "Show all N" (first 3 entries shown per group).
- **Linking order on inner pages:** `styles.css` → `<section>.css` → `mobile.css`, then `<section>.js` → `mobile.js`.
- **Cache-busting:** only the blog pages use `?v=<md5-8>` (added by `build-blog.js`). Other pages link CSS/JS without it. If users report stale styles after a deploy, add version query strings there too.
- **Content source of truth = the HTML.** The CSVs in `content/` were the original inputs and are now **stale**. The publications CSV has 24 rows, but the page has 30 entries; the experience CSV has 5 rows, but the page has 10 cards. Edit the HTML directly. Only update a CSV if the user wants it kept in sync.
- **Ask before inventing content.** Use the CV (`content/about me/CV/CV_OrcunKoralISERI_AC.pdf`), the CSVs, or the user's own words. Don't write bio, publication, or skill claims yourself.

---

## 5. Blog pipeline (read before touching the blog)

- `tools/localize-blog-images.js` downloads Blogger images into `content/blog/posts/img/` and writes `img-map.json`. This is a one-time step; images are already local (205 files, 0 remote references).
- `tools/build-blog.js` parses `content/blog/Blogs/Personal Blog/feed.atom` (46 POST entries). It rewrites **`blog.html`** and the 46 generated post pages, normalizing Blogger HTML and adding `mobile.css`/`?v=` links.
- 🚨 **Gotcha: 5 posts were added by hand and are NOT in the feed:**
  - `journal-at-2026-technological-synergies-community-energy-systems-cold-climates.html`
  - `journal-at-2026-occupancy-modeling-population-statistics-machine-learning.html`
  - `architecture-portfolio-2012-2018.html`
  - `tasarim-koyu-izmir-2015-umob-15.html`
  - `tasarim-koyu-izmir-2016.html`

  Running `node tools/build-blog.js` as-is **drops these 5 cards from `blog.html`** and resets the count to 46. Their post files survive, but nothing links to them. Before you ever regenerate, add a mechanism for extra posts first (for example a `content/blog/extra-posts.json` that the builder merges in). Otherwise, edit `blog.html` by hand.
- **Adding a new post by hand** (current practice):
  1. Copy an existing hand-made post, such as a `journal-at-2026-*.html` file, into `content/blog/posts/`. Keep its relative links (`../../../blog.html`, `../../../mobile.css`).
  2. Put images in `content/blog/posts/img/`.
  3. Insert a `.post-card` at the correct date position in `blog.html`, with `data-year` and a lowercase `data-search` string of title plus keywords.
  4. Update the `All (N)` count and the matching year-chip count. Add a new year chip if needed.
- **Journal-post pattern:** a post titled "Journal at YYYY: <paper title>" with a graphical abstract image. Image-generation prompts for those abstracts live in `docs_implementationPlan/blog/posts_June8th/`.

---

## 6. Tools and verification

```bash
npm run dev                         # serve on :3000 (needed for everything below)
node tools/mobile-audit.js          # overflow / wide-element check at 320/360/390px → expect all "ok"
node tools/mobile-shot.js <tag>     # full-page phone screenshots → mobile-shots/<tag>/
node tools/desktop-check.js         # 1440px captures → mobile-shots/desktop/ (desktop regression)
node tools/preview-shot.js          # inject tools/preview/*.{css,js} to preview mobile changes without editing the site
```
`mobile-shots/` and `server.log` are git-ignored. Minimum manual checks after a change:
- The tile still links to the page.
- Hover and animations work.
- The layout holds at 1440px desktop (About still has no scroll).
- The audit is clean at 320–390px.

---

## 7. Where the history lives

`docs_implementationPlan/` has a plan and a walkthrough for each of: `firstPage`, `about me`, `experience`, `education`, `publications`, `skills`, `blog`, `mobile`. Read the walkthrough first because it's short. Read the plan only for design rationale.

Note: the publications page has grown beyond what its walkthrough describes. The walkthrough says 9 journals and has no citation card; the page now has 15 journals plus the citation card.

---

## 8. Recurring maintenance tasks

- **Paper accepted** (an "Under Evaluation" entry becomes published):
  1. Replace the badge with the year in `publications.html`, add the `DOI ↗` link, and re-sort the group.
  2. Optionally add a "Journal at YYYY" blog post (§5).
  3. Check the Research Focus and Skills chips for anything that should mention the paper.
- **Citation metrics refresh** (Google Scholar, user `s4l2zioAAAAJ`):
  - Update the table and the bars in `publications.html`.
  - Bar heights are set by hand as `--bar-h`. Current scale: max bar 180px = 64 citations, about **2.8px per citation**. Rescale every bar if a new year exceeds the max.
  - Update each bar's `title` text and add a `.chart-year` label for any new year.
- **New experience, education, or award:** add a card in the matching HTML following the existing markup and keep the order newest first. Group counts on publications are hard-coded (`· N`), so update them.
- **CV update:** replace `content/about me/CV/CV_OrcunKoralISERI_AC.pdf` and keep the same filename, or update the `href` in `about.html`.

---

## 9. Open backlog / known issues

- [ ] **Blog builder vs. hand-made posts** (§5): add extra-post support before any regeneration.
- [ ] **Mobile Phase 3 polish** (not done): 44px tap targets, `env(safe-area-inset-*)`, `prefers-reduced-motion`, standardized breakpoints, blog "Load more".
- [ ] **SEO/meta:** `index.html` still has `<title>Personal Portfolio</title>` and a generic description. Add a real title and description, Open Graph tags, and a favicon to all pages (a Blogger `favicon.ico` exists in the export).
- [ ] **Cache-busting** on non-blog pages (§4).
- [ ] **Deploy and versioning:** this folder has no git, so deploys go through a scratch clone (§2). Suggest converting this folder into a real checkout of the repo to simplify deploys (ask first).
- [ ] **Cleanup candidates (ask first):** `content/input_temporary/` holds the PDFs of the two 2026 papers, which are already on the site. `.cadence/configs/` is empty.
- [ ] **Docs drift:** Windows paths in the old docs; the publications walkthrough is outdated.
- [x] ~~`README.md` is a two-line placeholder.~~ Rewritten 2026-11-02.
- [ ] **nexa-rhlab.com is down** (as of 2026-11-02): the Namecheap registrant WHOIS verification is pending, so the domain shows Namecheap's verification page and HTTPS fails. The owner must verify the email at Namecheap, then re-enable "Enforce HTTPS" in GitHub Pages. Re-check with `curl -I https://nexa-rhlab.com/`. Our links are already correct.
- [x] ~~Skills chip "24+ Publications" is stale.~~ Changed to "30 Publications" on 2026-11-02. Keep it in sync with the publications page total (Journals + Book Chapters + Conference Proceedings).

---

## 10. Session Log

Add one line per working session: `YYYY-MM-DD — what changed — files touched`.

- 2026-11-02 — Full project scan; created this manager prompt. No site files changed.
- 2026-11-02 — Added `CLAUDE.md` (imports this file automatically) and rewrote `README.md`. Backlog item "README is a placeholder" done.
- 2026-11-02 — Skills page → **Skills & Tools**: new Tools & Websites section (NEXA-web, RHLab), linked Web Design chips, landing tile label renamed. LMN-Tool is now called NEXA-web. Files: `skills.html`, `skills.css`, `index.html`, `docs_implementationPlan/skills/walkthrough.md`.
- 2026-11-02 — Skills chip "24+ Publications" → "30 Publications" (`skills.html`).
- 2026-11-02 — Added **OpenUBEM** (github.com/orcunkoraliseri/OpenUBEM, Creator & Developer) as the first Tools & Websites card (3-column grid on desktop) plus a linked chip on Energy Modeling. **Deployed**: commit `36377f5` pushed to `orcunkoraliseri/myWebsite` main and verified live.
