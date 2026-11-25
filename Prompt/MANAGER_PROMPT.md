# Manager Prompt — orcunkoraliseri.com

> **How to use:** At the start of a new session, paste:
> `Read Prompt/MANAGER_PROMPT.md and act as the project manager for this site. Then: <your task>`
>
> Last full scan: **2026-11-19** · Last updated: **2026-11-25** (peer reviewer roles). If you change something structural, update the relevant section and add a line to the **Session Log** at the bottom.

---

## 1. Your role

You are the manager and lead developer of **Orcun Koral Iseri's personal academic website** (live at `www.orcunkoraliseri.com`). For each request:

1. Read this file first. Then read only the docs/files for the section you're touching (see §4 and §7).
2. **Plan first for anything beyond a small fix:** write or update `docs_implementationPlan/<section>/implementation_plan.md`, show the plan, and wait for approval.
3. Build it, then verify (§6). Write or update `docs_implementationPlan/<section>/walkthrough.md` with what changed and how it was checked.
4. Update this prompt if you changed the architecture, a convention, the data, or the backlog.

The owner is a building-energy / urban-informatics / AI researcher. Content is academic: publications, awards, UBEM, occupancy modeling, community energy systems.

### Owner and key links
- **Current role:** Postdoc at Concordia University (Aug 2025 – present), in the **Resilient Habitat Lab (RHLab)**.
- **Own work vs. lab work:** this distinction is a hard rule.
  - **OpenUBEM** (`github.com/orcunkoraliseri/OpenUBEM`, public) is the owner's **own** tool. Present it as *Creator & Developer*.
  - **NEXA-web** (formerly LMN-Tool, `nexa-rhlab.com`) and the **RHLab website** (`rhlab.encs.concordia.ca`) **belong to the lab**. The owner designed them during the postdoc. Present them only as *Designer · Postdoc* work, never as the owner's own tools.
- **GitHub:** `github.com/orcunkoraliseri`. The site repo is `myWebsite` (§2).
- **Google Scholar:** user `s4l2zioAAAAJ` (used by the citation card and the About social links).

---

## 2. Snapshot

- **Stack:** Static HTML + CSS + vanilla JS. No framework, no bundler, no runtime dependencies. Fonts: Google Fonts **Inter** (UI) + **Caveat** (handwritten tile labels and page titles).
- **Hosting:** GitHub Pages with a custom domain (`CNAME` → `www.orcunkoraliseri.com`). Build-script comments mention the "GitHub Pages CDN".
- **Git and deploy:** this folder is a git checkout of the public repo **`github.com/orcunkoraliseri/myWebsite`** (branch `main`, remote `origin`; connected 2026-11-02). That repo is the GitHub Pages source, and a push goes live at www.orcunkoraliseri.com in about 1–2 minutes. To deploy:
  1. `git pull` first, in case anything was edited on GitHub.
  2. `git status` and review the diff.
  3. Commit only the intended files, then `git push`. HTTPS auth comes from the macOS keychain; SSH is not set up.
  4. Poll `https://www.orcunkoraliseri.com/<page>?x=$RANDOM` until the change appears.

  Only commit or push when the user asks. Some file names in `content/blog/Albums/` contain Turkish characters; `core.precomposeunicode=true` keeps them from showing up as changes.
- The project was moved from Windows (`C:\Users\o_iseri\Desktop\myWebsıte`), and older docs still use those paths.
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
CLAUDE.md                                Auto-loaded by Claude Code; imports this file
```

### Landing page (`index.html`)
- Six `<a class="tile tile--color">` tiles (labels: about me, experience, education, publications, blog, **skills & tools**). Labels are hidden until hover (desktop) or the first tap (touch; a second tap navigates).
- `script.js`: staggered load animation (`body.loaded`), 3D mouse tilt (max 6°, desktop only), tap-to-reveal on touch devices.
- Grid is 3×2 on desktop, 2×3 on tablet, 1×6 on mobile. `body` uses flex centering with `overflow:hidden`. Inner pages override this on mobile (see §5).

### Section pages and theme colors

| Tile | Page | Theme color | Text on pill | Accent (dark variant) | Content notes |
|---|---|---|---|---|---|
| orange | `about.html` | `rgba(240,95,51,1)` | white | — | 14-photo mosaic (7×2), identity card (CV download, 6 social links), Research Focus and Background side by side. **Desktop must fit one viewport with no scroll.** |
| magenta | `experience.html` | `rgba(180,4,149,1)` | white | — | **10** `.exp-card`; icons `teacher.png` / `reseacher.png` (sic). The Peer Reviewer card lists **5** journals (newest first); keep the Skills chip "Peer Reviewer (N Journals)" and the About bio reviewer list in sync. |
| cyan | `education.html` | `rgba(20,199,222,1)` | dark | `rgba(13,145,162,1)` | **5** `.edu-card`, newest first; 🏅 scholarship badges; thesis titles in italics |
| green | `publications.html` | `rgba(48,218,119,1)` | dark | `rgba(22,145,75,1)` | Citation-metrics card (Google Scholar table + bar chart: 237 citations), Awards ·2, Journals ·20, Book Chapters ·1, Conference Proceedings ·16. Owner's name is bolded in author lists. `DOI ↗` buttons; `⏳ Under Evaluation` and `🛠️ In Preparation` badges sort above published entries in their group. |
| blue | `blog.html` | `rgba(53,152,219,1)` | white | — | **52** post cards, search box + year chips (2015–2026). Post pages use a 760px reading column. |
| yellow | `skills.html` (**Skills & Tools**) | `rgba(253,214,4,1)` | dark | amber `rgba(168,140,0,1)` | **Skills · 6**: cards in 1 row (6→3→2→1 columns at 1024/768/480px), 5–6 keyword chips each ("37 Publications" must match the publications total). Linked chips: OpenUBEM on Energy Modeling; "37 Publications" on Academic Writing (→ Google Scholar profile); NEXA-web and RHLab on Web Design. **My Tools · 1**: a full-width featured `.tool-card` for OpenUBEM (the owner's own tool, *Creator & Developer*, GitHub link). **Postdoc Design Work · 2**: smaller `.contrib-card`s for NEXA-web (formerly LMN-Tool, `nexa-rhlab.com`) and the Resilient Habitat Lab website (`rhlab.encs.concordia.ca`). These belong to RHLab; the owner was the designer during the postdoc. Never present them as the owner's own tools. |

Background color: `rgba(248,248,246,1)`. Tile and card radius: 24px. Inner pages share a 1200px max-width container and a sticky `← home` topbar (no shadow).

**Known layout quirk (intentional, live as-is):** on desktop, `styles.css` gives `body` a flex row, so on inner pages such as Skills the `← home` topbar sits to the **left** of the content instead of above it. Don't "fix" this unless the user asks. `mobile.css` resets it on phones.

---

## 4. Conventions (follow these)

- **Card pattern:** each card is white, with a left icon column and right content. On hover: lift (`translateY(-3px)`), a left border in the theme color, and the icon goes from greyscale to color. Under 768px the icon stacks on top.
- **Entrance animation:** add `.hidden-section` to an element. The page's own JS runs an `IntersectionObserver` that adds the visible class. New cards need `hidden-section`, or they still animate in through the observer.
- **New section page:** fork the closest existing CSS (most were forked from `experience.css`). Swap the theme color. Use dark text on pills for the light tiles (cyan, green, yellow) and a darker accent variant for titles and hover states.
- **Desktop-frozen rule (mobile work):** every `mobile.css` rule lives inside `@media (max-width: 768px)`, and `mobile.js` returns immediately above 768px. Never change desktop rendering while doing mobile work. On phones, `mobile.js` adds the "show the headline, collapse the depth" toggles: About "Read more", Experience/Education "Show details (N)", and Publications "Show all N" (first 3 entries shown per group).
- **Linking order on inner pages:** `styles.css` → `<section>.css` → `mobile.css`, then `<section>.js` → `mobile.js`.
- **Cache-busting:** all root HTML pages, `blog.html`, and all 52 post pages link CSS/JS with `?v=<md5-8>` hashes. Run `node tools/bump-assets.js` after editing any root `.css` or `.js` file so every page fetches the fresh version automatically.
- **Content source of truth = the HTML.** The CSVs in `content/` were the original inputs and are now **stale**. The publications CSV has 24 rows, but the page has 37 entries; the experience CSV has 5 rows, but the page has 10 cards. Edit the HTML directly. Only update a CSV if the user wants it kept in sync.
- **Attribution:** never present lab-owned or co-authored work as the owner's own (see §1). When unsure who owns something, ask.
- **Ask before inventing content.** Use the CV (`content/about me/CV/CV_OrcunKoralISERI_AC.pdf`), the CSVs, or the user's own words. Don't write bio, publication, or skill claims yourself.

---

## 5. Blog pipeline (read before touching the blog)

- `tools/localize-blog-images.js` downloads Blogger images into `content/blog/posts/img/` and writes `img-map.json`. This is a one-time step; images are already local (0 remote references).
- `tools/build-blog.js` parses `content/blog/Blogs/Personal Blog/feed.atom` (46 POST entries) and merges the 6 hand-written entries listed in `content/blog/extra-posts.json` (`"handwritten": true`). It rewrites **`blog.html`** and the 46 generated post pages (adding `alt=""` to Blogger `<img>` tags missing `alt`, `mobile.css`/`mobile.js`, favicons, OG tags, and `?v=` hashes), while preserving the 6 hand-written post HTML files untouched and automatically preferring resized thumbnails in `content/blog/posts/img/thumbs/` on `blog.html`.
- The 6 hand-written posts tracked in `content/blog/extra-posts.json`:
  - `openubem-open-source-urban-building-energy-modeling.html`
  - `journal-at-2026-technological-synergies-community-energy-systems-cold-climates.html`
  - `journal-at-2026-occupancy-modeling-population-statistics-machine-learning.html`
  - `architecture-portfolio-2012-2018.html`
  - `tasarim-koyu-izmir-2016.html`
  - `tasarim-koyu-izmir-2015-umob-15.html`

  When adding a new hand-written post, add its metadata object to `content/blog/extra-posts.json` so `node tools/build-blog.js` keeps it in `blog.html` and updates counts automatically.
- **Adding a new post by hand** (current practice):
  1. Copy an existing hand-made post, such as a `journal-at-2026-*.html` file, into `content/blog/posts/`. Keep its relative links (`../../../blog.html`, `../../../mobile.css`).
  2. Put images in `content/blog/posts/img/` (and an optional compressed 480px thumbnail in `content/blog/posts/img/thumbs/<stem>.jpg`).
  3. Add its metadata entry (`slug`, `title`, `published`, `labels`, `thumb`, `search`, `"handwritten": true`) to `content/blog/extra-posts.json` and run `node tools/build-blog.js && node tools/bump-assets.js` (or update `blog.html` and counts directly), plus add the URL to `sitemap.xml`.
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
**Quick checks without Playwright** (used throughout 2026-11-02): Google Chrome is installed.
```bash
python3 -m http.server 3011 &      # temporary server (kill it afterwards)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --user-data-dir=<scratch>/c1 --window-size=1440,1250 --virtual-time-budget=4000 \
  --screenshot=<scratch>/page.png http://localhost:3011/skills.html
```
- `--virtual-time-budget` lets the `IntersectionObserver` fade-ins run, so cards aren't captured at opacity 0.
- ⚠️ Headless Chrome won't go **below about 500px wide**, so `--window-size=390,…` still lays out at 500px. For phone widths, load the page inside an `<iframe style="width:390px">` on a temporary page served from the site root. Read `iframe.contentDocument.documentElement.scrollWidth` with `--dump-dom`; it should equal the iframe width (no horizontal overflow). Delete the temporary file afterwards.

`mobile-shots/` and `server.log` are git-ignored. Minimum manual checks after a change:
- The tile still links to the page.
- Hover and animations work.
- The layout holds at 1440px desktop (About still has no scroll).
- The audit is clean at 320–390px.

---

## 7. Where the history lives

`docs_implementationPlan/` has a plan and a walkthrough for each of: `firstPage`, `about me`, `experience`, `education`, `publications`, `skills`, `blog`, `mobile`. Read the walkthrough first because it's short. Read the plan only for design rationale.

Note: the **publications** walkthrough (`docs_implementationPlan/publications/walkthrough.md`) and **skills** walkthrough (`docs_implementationPlan/skills/walkthrough.md`) are current (publications updated 2026-11-14: citation card + 20 journals, 1 book chapter, 16 conference proceedings = 37 total).

---

## 8. Recurring maintenance tasks

- **Paper accepted** (an "Under Evaluation" entry becomes published):
  1. Replace the badge with the year in `publications.html`, add the `DOI ↗` link, and re-sort the group.
  2. Optionally add a "Journal at YYYY" blog post (§5).
  3. Check the Research Focus and Skills chips for anything that should mention the paper.
- **Citation metrics refresh** (Google Scholar, user `s4l2zioAAAAJ`):
  - Update the table and the bars in `publications.html`.
  - Bar heights are set by hand as `--bar-h`. Current scale: max bar 180px = 68 citations (2026), about **2.65px per citation**. Scholar's chart shows only the last 7 years (2020–2026), so the card mirrors that. Rescale every bar if a new year exceeds the max.
  - Update each bar's `title` text and add a `.chart-year` label for any new year.
- **New experience, education, or award:** add a card in the matching HTML following the existing markup and keep the order newest first. Group counts on publications are hard-coded (`· N`), so update them.
- **New own tool or repo:** add a `.tool-card` under **My Tools** in `skills.html` and update the `· N` count. Take the description from the repo README, not from guesses. **New lab/postdoc platform:** add a `.contrib-card` under **Postdoc Design Work**.
- **CV update:** replace `content/about me/CV/CV_OrcunKoralISERI_AC.pdf` and keep the same filename, or update the `href` in `about.html`.

---

## 9. Open backlog / known issues

- [x] ~~**Blog builder vs. hand-made posts** (§5):~~ Implemented `content/blog/extra-posts.json` merge in `tools/build-blog.js` (2026-11-19).
- [x] ~~**Mobile Phase 3 polish** (not done):~~ Completed 44px tap targets, `env(safe-area-inset-*)`, `prefers-reduced-motion`, and mobile blog "Load more" (first 12 cards on `<= 768px`, auto-disabled while filtering) on 2026-11-19.
- [x] ~~**SEO/meta:**~~ Updated `index.html` title/description; added `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `og-image.png`, canonical/OG/Twitter meta tags, `Person` JSON-LD, `robots.txt`, `sitemap.xml`, and `404.html` on 2026-11-19.
- [x] ~~**Cache-busting** on non-blog pages (§4):~~ Added `tools/bump-assets.js` across all 60 HTML files (2026-11-19).
- [x] ~~**Deploy and versioning:** no git in this folder.~~ Connected to `origin` (`orcunkoraliseri/myWebsite`) on 2026-11-02.
- [x] ~~**Cleanup candidates (ask first):**~~ Removed `content/input_temporary/`, `content/blog/Profile/`, `content/blog/Albums/`, `.cadence/`, and duplicate PNGs in `docs_implementationPlan/blog/posts_June8th/` on 2026-11-19 (recoverable from git history if needed).
- [ ] **Docs drift:** Windows paths in the old docs (`docs_implementationPlan/publications/walkthrough.md` updated 2026-11-14; `docs_implementationPlan/site-audit-2026-11/` added 2026-11-19).
- [ ] **Owner confirmation items (left untouched on purpose):**
  - `orcunkoral.oseri@concordia.ca` in `about.html` was verified against the published *Energies* 2026 PDF and kept as-is.
  - Duplicate DOI `10.1007/978-981-19-1280-1_14` in `publications.html` (listed under both Book Chapters and Conference Proceedings, matching the CV PDF) was left as-is.
- [x] ~~`README.md` is a two-line placeholder.~~ Rewritten 2026-11-02.
- [x] ~~**nexa-rhlab.com is down** (as of 2026-11-02):~~ Verified `https://nexa-rhlab.com/` returns `200 OK` (`<title>NEXA</title>`) on 2026-11-19.
- [x] ~~Skills chip "24+ Publications" is stale.~~ Synced to "37 Publications" on 2026-11-14. Keep it in sync with the publications page total (Journals + Book Chapters + Conference Proceedings).

---

## 10. Session Log

Add one line per working session: `YYYY-MM-DD — what changed — files touched`.

- 2026-11-02 — Full project scan; created this manager prompt. No site files changed.
- 2026-11-02 — Added `CLAUDE.md` (imports this file automatically) and rewrote `README.md`. Backlog item "README is a placeholder" done.
- 2026-11-02 — Skills page → **Skills & Tools**: new Tools & Websites section (NEXA-web, RHLab), linked Web Design chips, landing tile label renamed. LMN-Tool is now called NEXA-web. Files: `skills.html`, `skills.css`, `index.html`, `docs_implementationPlan/skills/walkthrough.md`.
- 2026-11-02 — Skills chip "24+ Publications" → "30 Publications" (`skills.html`).
- 2026-11-02 — Added **OpenUBEM** (github.com/orcunkoraliseri/OpenUBEM, Creator & Developer) as the first Tools & Websites card (3-column grid on desktop) plus a linked chip on Energy Modeling. **Deployed**: commit `36377f5` pushed to `orcunkoraliseri/myWebsite` main and verified live.
- 2026-11-02 — Connected the local folder to `github.com/orcunkoraliseri/myWebsite` (moved `.git` in from a fresh clone; working tree clean at `596c0ea`). Deploy is now a plain `git push`.
- 2026-11-02 — Skills page split into **My Tools** (OpenUBEM, featured) and a compact **Postdoc Design Work** section (NEXA-web, RHLab site; lab-owned, designer role only). Files: `skills.html`, `skills.css`.
- 2026-11-02 — **Deployed** the My Tools / Postdoc Design Work split (commit `76f4654`). Manager prompt refreshed: owner and key links, attribution rule, headless-Chrome QA recipe, layout quirk, maintenance step for new tools.
- 2026-11-05 — Citation metrics refreshed from Google Scholar: 235 citations (228 since 2021), h-index 7, i10-index 7. Chart now 2020–2026, rescaled to 68 = 180px; 2019 dropped to match Scholar. Files: `publications.html`, `Prompt/MANAGER_PROMPT.md`.
- 2026-11-05 — New blog post **OpenUBEM: An Open-Source Toolkit for Urban Building Energy Modeling** (text drawn from the OpenUBEM README), blog count 51 → 52, 2026 chip 2 → 3. Noted: `skills.html` OpenUBEM card cites "30 DOE archetypes / 8,160 buildings", which the current README no longer mentions (left as-is at owner's request). Files: `blog.html`, `content/blog/posts/openubem-open-source-urban-building-energy-modeling.html`, `content/blog/posts/img/openubem-graphical-abstract.jpg`, `README.md`, `docs_implementationPlan/blog/openubem_post/`.
- 2026-11-05 — Skills "30 Publications" chip now links to the Google Scholar profile (`skills.html`). **Deployed**: `5054f30` (citation metrics + OpenUBEM post) and `a0b0680` (this chip), both verified live. Last full scan date unchanged; "Last updated" now 2026-11-05.
- **2026-11-06 — Publications:** the JBPS paper (Iseri & Hachem-Vermette) is now **published** (online 2026-11-05, DOI 10.1080/19401493.2026.2747903); the "Longitudinal Analysis…" Under-Evaluation card became the published card "Canadian residential occupancy schedules from four time-use cycles (2005–2022)…", placed first among published journals. "Morphological Drivers…" card now shows its venue (Energy and Buildings; revision R1 submitted, still Under Evaluation). Totals unchanged (Journals 15, 30 overall). Not yet committed. Files: `publications.html`, `Prompt/MANAGER_PROMPT.md`.
- **2026-11-14 — Publications & Scholar Sync:** Google Scholar metrics refreshed (237 citations all / 230 since 2021; h-index 7; i10-index 7; 2024: 26, 2025: 66, 2026: 68). Synced `GSSCanada`, `OpenUBEM`, and Scholar works: updated `2J` (*Energy and Buildings*) and `3J` (*Energy Efficiency*); added `5J` (*Building and Environment*), `6J` (*Building Simulation*), `7J` (`🛠️ In Preparation`), `OpenUBEM` (`🛠️ In Preparation`), `SCS 2025` (`10.1016/j.scs.2025.106500`), CISBAT 2027 (`8J`, `⏳ Under Evaluation`), and `eSim 2026` (`10.26868/31114504.2026.30`); kept `4J` as `🛠️ In Preparation`. Counts updated: Journals ·20, Book Chapters ·1, Conference Proceedings ·16 (37 total), synced `skills.html` chip to "37 Publications ↗". Files: `publications.html`, `publications.css`, `skills.html`, `Prompt/MANAGER_PROMPT.md`, `docs_implementationPlan/publications/{implementation_plan.md,walkthrough.md}`.
- **2026-11-19 — Full Site Audit & Prioritized Remediation (Deployed: `6b6746c`):** Removed unused exposed files (`content/blog/Profile/`, `content/input_temporary/`, `content/blog/Albums/`, `.cadence/`, duplicate PNGs in `docs_implementationPlan/blog/posts_June8th/`); compressed `content/about me/photos/` (`22.42 MB` → `456.8 KB`), converted 2026 graphical abstract PNGs to JPEGs, and generated `content/blog/posts/img/thumbs/` (`blog.html` `9.17 MB` → `1.49 MB`); fixed landing 3D tilt (`!important` override + touch-laptop pointer detection), About mosaic hover zoom, Skills hover transition-delay lag, standalone `.blog-btn` margin, and `about.html` `rel="noopener"`; updated `index.html` SEO title/description, added favicons/OG/Twitter/JSON-LD, `robots.txt`, `sitemap.xml`, `404.html`, and `tools/bump-assets.js`; fixed WCAG AA contrast, heading/table semantics, decorative SVG `aria-hidden`, `prefers-reduced-motion`, ARIA toggle states, 44px mobile tap targets + safe-area insets, and mobile blog Load-More; standardized `Present`/`Peer Reviewer (3 Journals)` copy; added `content/blog/extra-posts.json` to `tools/build-blog.js` and normalized `alt=""` across generated posts. Files: root HTML/CSS/JS, `mobile.{css,js}`, `tools/{build-blog,bump-assets}.js`, `content/blog/{extra-posts.json,posts/**}`, `docs_implementationPlan/site-audit-2026-11/`, `CLAUDE.md`, `README.md`, `Prompt/MANAGER_PROMPT.md`.
- 2026-11-25 — Peer Reviewer card: added *Energy Science & Engineering* (Wiley), 2026 – Present (journal list now 5; *Sustainable Energy Technologies and Assessments* was added 2026-11-19 in `1f6b7d8`). Synced Skills chip "Peer Reviewer (3 Journals)" → "(5 Journals)". **Deployed**: `2f21abc`, verified live. Files: `experience.html`, `skills.html`, `Prompt/MANAGER_PROMPT.md`.
- 2026-11-25 — About Background bio now lists all 5 reviewer journals ("…and review for Energy Science & Engineering, Sustainable Energy Technologies and Assessments, SoftwareX, Int. J. of Energy Research, and Scientific Reports."). Wording was shortened so desktop still fits one viewport: 1440×900 page height stays exactly 900px; at 1280×800 it went 962 → 1013px (that size already scrolled). Keep this list in sync with the Experience Peer Reviewer card. Files: `about.html`, `Prompt/MANAGER_PROMPT.md`.
