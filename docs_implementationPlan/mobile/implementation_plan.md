# Mobile Optimization — Implementation Plan (v1)

> **Goal**: Make every *inner* page read and look as good on a phone as the home grid already does — first by fixing real layout bugs, then by **optimizing content density** so pages don't dump every detail onto a small screen. The home page (`index.html`) is already great on mobile and is **out of scope**.

All source files live in the project root (`C:\Users\o_iseri\Desktop\myWebsıte`).

Pages in scope: **about, experience, education, publications, skills, blog (index + post)**.

---

## ✅ Implementation status — DONE (2026-06-04)

Phase 1 (correctness) + the Phase 2 content optimization shown in the approved preview are **implemented and verified**. Rather than scatter rules across five stylesheets, the changes ship as **two shared assets** linked after each page's own CSS/JS:

- **`mobile.css`** — every rule inside `@media (max-width:768px)`: body-flex reset, overflow safety net, blog URL/table wrapping, About photo strip, and the "Show more/less" styling.
- **`mobile.js`** — progressive disclosure (bio "Read more"; experience/education "Show details"; publications "Show all N"), guarded by `matchMedia('(max-width:768px)')` so it is a **no-op on desktop**.

Linked from the 5 static pages (`*.html`) and, for the generated blog, via `tools/build-blog.js` templates (rebuilt → `blog.html` + 46 post pages).

**Verification results:**
- Mobile overflow audit: **all pages `ok` at 320 / 360 / 390px** (was: about@320 and every blog post broken).
- Desktop frozen at 1440px: container `left`/`width`/`body display` **identical** to the pre-edit baseline on all 5 pages; `mobile.js` added **0** nodes (0 toggles, 0 collapsed) — the only DOM delta is the inert `<script>` tag.
- After-screenshots in `mobile-shots/after/` match the approved preview.

> Phase 3 (tap-target / safe-area / reduced-motion polish) and the blog "Load more" remain **optional, not yet done**.

---

## 0. How we visualize the mobile view

Two throwaway Node tools were added under `tools/` so we can *see* and *measure* the phone layout instead of guessing. They drive a real headless browser (Playwright) against the local server.

| Tool | What it does |
|------|--------------|
| [`tools/mobile-shot.js`](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/mobile-shot.js) | Renders all 8 pages at a phone viewport (390×844, retina) and saves full-page PNGs to `mobile-shots/<tag>/`. Run before/after to compare. |
| [`tools/mobile-audit.js`](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/mobile-audit.js) | Loads each page at **320 / 360 / 390 px** and reports horizontal **overflow** + the elements that stick past the screen edge. This is our pass/fail gate. |
| [`tools/desktop-check.js`](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/desktop-check.js) | Captures desktop baselines at 1440px + measures the container (left/width/height). The desktop-frozen proof gate. |
| [`tools/preview-shot.js`](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/preview-shot.js) | **Test-before-implement.** Injects `tools/preview/preview.css` + `preview.js` into the *live* pages at render time (no source files touched), screenshots mobile **and** desktop, and re-runs the overflow audit with the preview applied. |

**Run them:**
```bash
npm run dev                       # serves on http://localhost:3000 (already in package.json)
node tools/mobile-shot.js before  # capture baseline phone screenshots -> mobile-shots/before/
node tools/mobile-audit.js        # measure overflow at 320/360/390
node tools/desktop-check.js       # capture desktop baselines -> mobile-shots/desktop/*-current.png
node tools/preview-shot.js        # PREVIEW proposed changes without editing the site
```

### Test-before-implement (validated)
The proposed changes were prototyped in `tools/preview/preview.css` + `preview.js` and injected at render time — **the site files were never modified**. Results:
- **Overflow audit with preview applied:** every page `ok` at 320/360/390 (incl. the previously-broken about @320 and blog-post @all widths).
- **Desktop unchanged (proven):** at 1440px, container left/width, `body` display, and DOM node count are **identical** with vs without the preview. The only delta was a ~6px page-height wobble that also occurs *without* the preview (lazy-image reflow) — i.e. not caused by it.
- **Mobile preview screenshots:** `mobile-shots/preview-mobile/` (photo strip, "Read more", collapsible publication groups, wrapped URLs); desktop equivalence shots in `mobile-shots/preview-desktop/`.

When approved, the preview files become the implementation: their rules fold straight into the real `*.css`/`*.js`.

> These tools are dev-only and git-ignored (see §7). They are *not* shipped with the site.

---

## 1. Audit findings (measured, not guessed)

Running `mobile-audit.js` on the current site:

| Page | 320px | 360px | 390px | Issue |
|------|:---:|:---:|:---:|-------|
| about | ❌ | ✅ | ✅ | Container pushed off-center, overflows ~6px |
| experience | ✅ | ✅ | ✅ | — |
| education | ✅ | ✅ | ✅ | — |
| publications | ✅ | ✅ | ✅ | — |
| skills | ✅ | ✅ | ✅ | — |
| blog (index) | ✅ | ✅ | ✅ | — |
| **blog (post)** | ❌ | ❌ | ❌ | **Body locked at 499px — overflows every phone width** |

### Bug A — Content pages inherit the home grid's flex-centering
`styles.css` sets `body { display:flex; justify-content:center; align-items:center }` to center the 6-tile home grid. The inner pages link `styles.css` **and** their own CSS, but only `blog.css` re-declares `display` (to `flex-column`). So `about/experience/education/publications/skills` render their `body` as a **centered flex row** of `[topbar][main]`. At ≥360px there's enough room that it looks fine, but at 320px the main can't shrink and gets shoved off-center → horizontal scroll.

- **Evidence**: on `about.html` @320px the `<main>` computes to `left:73px` (should be ~16px) and `display:flex; flex-direction:row` on `<body>`.
- **Fix**: reset `body` to `display:block` on the five content pages — **inside `@media (max-width:768px)` only**. (Confirmed: a global reset moves the desktop container and changes its height, so it must be mobile-scoped.)

### Bug B — Blog post bodies overflow on every phone
A long bare URL in post content (e.g. `http://www.mimarlarodasiankara.org/dosya/dosya29eng.pdf`) does not wrap, forcing `.post-content` → `.post-article` to a fixed **499px**, wider than any phone.

- **Fix**: `overflow-wrap:anywhere` on links + `overflow-wrap:break-word` on `.post-content`; make wide tables scroll inside their own box.

These two are **correctness bugs** and are Phase 1 below.

---

## 2. Strategy overview (3 phases)

> ### 🔒 Hard constraint: the desktop view is frozen
> **Nothing changes above 768px. Mobile-only, full stop.** This is enforced by construction, not by promise:
> - Every CSS rule we add lives inside `@media (max-width: 768px)`. Desktop computed styles stay byte-for-byte identical.
> - No HTML edit may alter the desktop render. Any "Show more" collapsing either runs via JS that is a **no-op ≥768px**, or uses `<details>` that we force fully-open with the summary hidden on desktop — so desktop looks exactly as today.
> - **Proof gate:** desktop baselines were captured at 1440px (`mobile-shots/desktop/*-current.png`). After every change we re-shoot desktop and confirm the screenshots **and** container metrics (left/width/height) are unchanged. Any desktop diff = regression = blocked.
>
> *(Verified why this matters: forcing `body{display:block}` globally moves the desktop About container from left 160→120px and grows the page 900→947px. That is exactly the kind of change we are forbidding on desktop.)*

```
Phase 1  Correctness   →  no horizontal scroll on any page at 320–430px      (small, safe)
Phase 2  Content        →  progressive disclosure: show the essentials,
         optimization       tuck the detail behind "Show more"               (the main ask)
Phase 3  Polish          →  tap targets, breakpoints, safe-area, reduced-motion
```

Guiding principle for Phase 2 (your note: *"none should show everything in detail; we can optimize"*): on a phone, **show the headline of each item and collapse the depth**. Prefer the native `<details>/<summary>` element — it is accessible and needs **zero JavaScript**. On desktop (≥768px) we hide the `<summary>` and force the content open, so the desktop view is identical to today.

---

## 3. Phase 1 — Correctness fixes (do first)

> **All fixes are wrapped in `@media (max-width: 768px)` so desktop is provably untouched.** See the constraint in §2.

#### [MODIFY] about.css, experience.css, education.css, publications.css, skills.css
Reset the inherited flex-centering **only on phones**:
```css
@media (max-width: 768px) {
  body { display: block; }   /* stop the [topbar][main] flex row from off-centering on narrow screens */
}
```
> ⚠️ **Verified:** adding `display:block` *outside* a media query shifts the desktop container
> (left `160px → 120px`) and changes page height (`900 → 947px`) — i.e. it *does* alter desktop.
> So it must stay mobile-scoped. (Earlier I floated a global `body:has(.page-topbar)` reset — **rejected**: it's global and would hit desktop.)

#### [MODIFY] blog.css — wrap long content (mobile-scoped)
```css
@media (max-width: 768px) {
  .post-content { overflow-wrap: break-word; }
  .post-content a { overflow-wrap: anywhere; }            /* break long URLs */
  .post-content table { display: block; overflow-x: auto; } /* wide tables scroll, not the page */
}
```

#### [MODIFY] styles.css — mobile safety net only
```css
@media (max-width: 768px) {
  html, body { overflow-x: clip; }   /* clip, NOT hidden — preserves position:sticky topbar */
}
```

**Exit criteria for Phase 1:** `node tools/mobile-audit.js` prints **all `ok`** at 320/360/390.

---

## 4. Phase 2 — Per-page content optimization

> Mechanism: a small shared pattern. Add **one** stylesheet `mobile-collapse.css` (linked by the pages that use it) that styles `<details class="m-more">` to look like a "Show more / Show less" control and **force-opens it on desktop**:
> ```css
> @media (min-width: 769px) { details.m-more > summary { display: none; } details.m-more[open], details.m-more { } }
> /* On desktop the inner content always shows; on mobile the summary toggles it. */
> ```
> This keeps the desktop layouts (which you've already tuned) 100% unchanged.

### 4.1 About  *(orange)*
Current on mobile: 14 photos crammed into a 7-col grid (~36px each), 12 pills, 4 stacked bio paragraphs.

| Change | Detail |
|--------|--------|
| **Photo mosaic** | Swap the 7-col grid for a **swipeable horizontal strip** on ≤768px (`grid-auto-flow:column; overflow-x:auto; scroll-snap`). Photos become ~120px and look intentional instead of tiny. Vertical space drops too. |
| **Bio** | Show paragraph 1; wrap paragraphs 2–4 in `<details class="m-more">` → "Read more". |
| **Research Focus** | Fine as-is (pills wrap). *Optional:* cap at 8 pills + "show all". |

```
┌───────────────────────────┐
│ ← home                    │
│ ┌───────────────────────┐ │
│ │ [photo][photo][photo]→│ │  ← swipe strip (snap)
│ └───────────────────────┘ │
│ Orcun Koral Iseri, PhD    │
│ title · affiliation       │
│ email / email             │
│ [⬇ CV]  [icons row]       │
│ [TR][EN][FR]              │
│ Research Focus  [pills…]  │
│ Background                │
│  para 1 …                 │
│  ▸ Read more              │  ← <details>
└───────────────────────────┘
```

### 4.2 Experience  *(magenta)* — 7 cards, 18 bullets
Always show: role pill · timeline · **institution**. Collapse the bullet list (the depth) under `<details>`.

```
[POSTDOC]            Sep 2024 – now
Concordia University
▸ Show details (3)          ← bullets hidden until tapped
```
Keep the first bullet visible if you prefer a teaser; collapse the rest.

### 4.3 Education  *(cyan)* — 5 cards
Always show: degree pill · scholarship pill · dates · **institution** · thesis title.
Collapse: thesis description, advisor lines, sub-bullets → `<details>` "Show details".

### 4.4 Publications  *(green)* — **26 entries, longest page**
This page is the biggest mobile scroll. Two combined moves:

1. **Collapsible groups.** Keep the group subheaders with their counts; wrap each group's cards in `<details>`. Open **Journals** by default; collapse **Book Chapters** and **Conference Proceedings**.
   ```
   ▾ Journal Articles (12)
       [card][card]…
   ▸ Conference Proceedings (10)     ← collapsed
   ▸ Book Chapters (2)               ← collapsed
   ```
2. **Lighter cards on mobile.** Always show type pill · year · **title** · venue + DOI button. Move the long **authors** line into the collapsed/secondary text (smaller, or behind the group toggle). Your name stays bold when shown.

*Optional later:* a sticky mini-filter (year / type chips) mirroring the blog's filter pattern.

### 4.5 Skills  *(yellow)* — 6 cards, 36 chips
Already clean (1 column on phones). **Lowest priority.** *Optional:* show 3 chips + "+3 more" per card to shorten the column, or 2-up grid at 480–768px. Safe to leave as-is.

### 4.6 Blog index  *(blue)* — ~48 posts
- **Filter bar**: make it stack on mobile — search full-width on its own row; year chips become a horizontally scrolling row (no wrap pile-up).
- **List length**: add a **"Load more"** (render ~15, reveal more on tap) in `blog.js`, so the initial page isn't 48 cards tall. Search/year filter already narrows results.
- Post cards already stack correctly (thumb goes full-width, 160px).

### 4.7 Blog post  *(blue)*
Beyond the Phase-1 wrap fix: confirm images (`max-width:100%` ✓), iframes (✓), code blocks (`overflow-x:auto` ✓), and tables (Phase 1) all stay in-bounds. Body text/line-height are already good for reading. No content collapsing needed — long-form articles *should* show in full.

> ⚠️ **Blog is generated.** `blog.html` and `content/blog/posts/*.html` are produced by [`tools/build-blog.js`](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/build-blog.js). Edit the **generator/template + `blog.css`**, then rebuild — do **not** hand-edit generated files. The other five pages are hand-authored static HTML and are edited directly.

---

## 5. Phase 3 — Cross-cutting polish

| Area | Action |
|------|--------|
| **Breakpoints** | Standardize on `768px` (tablet→stack) and `480px` (phone). Today the site mixes 1024/900/768/550/480 — align them so behavior is predictable. |
| **Tap targets** | Ensure ≥44×44px hit area for back-link, social icons, year chips, DOI buttons (add padding, not just bigger icons). |
| **Safe area** | `padding` via `max(16px, env(safe-area-inset-left/right))` and topbar `env(safe-area-inset-top)` so content clears notches/rounded corners. |
| **Reduced motion** | Wrap the `.hidden-section`/scroll-reveal transitions in `@media (prefers-reduced-motion: no-preference)`; render content immediately otherwise. |
| **Sticky topbar** | Verify it never overlaps the first card after `display:block` fix; it already paints a solid background. |

---

## 6. Design decisions

| Decision | Value |
|----------|-------|
| Pages in scope | about, experience, education, publications, skills, blog (index + post) |
| Out of scope | `index.html` (home grid already mobile-perfect) |
| Target widths | 320 / 360 / 390 / 430px (iPhone SE → Pro Max, common Android) |
| Disclosure mechanism | Native `<details>/<summary>`, force-open ≥768px (zero JS, accessible) |
| Desktop layouts | **Unchanged** — all collapsing is mobile-only via media queries |
| Blog list | "Load more" (progressive), filters already present |
| Mosaic on mobile | Swipeable horizontal snap strip |
| Breakpoints | `768px`, `480px` (standardized) |

---

## 7. Files changed (as implemented)

Implemented as **two shared assets** (simpler than per-page edits, no duplication):

#### [ADD]
- [mobile.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/mobile.css) — all mobile rules inside `@media (max-width:768px)`: `body{display:block}`, `overflow-x:clip`, blog `.post-content` URL/table wrapping, About `.photo-mosaic` → swipe strip, `.m-toggle`/`.m-collapsed` styling.
- [mobile.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/mobile.js) — `matchMedia`-guarded progressive disclosure (bio / exp bullets / edu bullets / publication groups). No-op ≥768px.

#### [MODIFY] link the shared assets (HTML only — no layout CSS touched)
- [about.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/about.html), [experience.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.html), [education.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/education.html), [publications.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/publications.html), [skills.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/skills.html) — added `<link href="mobile.css">` + `<script src="mobile.js">`.

#### [MODIFY] generator (not generated output)
- [tools/build-blog.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/tools/build-blog.js) — added `mobile.css?v=<hash>` to the post + index templates → rebuilt `blog.html` + 46 post pages.

> The original per-page-CSS / `<details>`-in-HTML sketch was superseded by the shared `mobile.css`+`mobile.js` (same visual result, less duplication, existing page CSS untouched).

#### Not implemented (optional, future)
- Phase 3 polish (tap targets, `env(safe-area-inset)`, `prefers-reduced-motion`), standardized breakpoints, blog "Load more".

#### [GITIGNORE] dev artifacts
`.gitignore` updated with `mobile-shots/` and `server.log`. (`tools/*.js` preview/audit helpers kept as dev tooling.)
(`tools/mobile-shot.js` and `tools/mobile-audit.js` may be kept as dev helpers or deleted after.)

---

## 8. Verification plan

**Automated gate #1 — mobile fixed:**
- `node tools/mobile-audit.js` → every page `ok` at 320/360/390. **Zero overflow.**

**Automated gate #2 — desktop frozen (the one this question is about):**
- `node tools/desktop-check.js` → re-shoot desktop at 1440px and compare against `mobile-shots/desktop/*-current.png` (captured pre-change). Screenshots **and** the printed container metrics (left/width/height) must be **identical**. Any difference = desktop regression = blocked until fixed.

**Visual:**
- `node tools/mobile-shot.js after` → eyeball `mobile-shots/after/*.png` vs `before/`.

**Manual / interaction:**
- Real device or DevTools device mode (iPhone SE 375, iPhone 14 390, Pixel 360):
  - No sideways scroll on any page.
  - `<details>` "Show more" expands/collapses; content is reachable.
  - About photo strip swipes with snap.
  - Blog: filter + "Load more" work; long URLs wrap inside the screen.
  - Tap targets are comfortable (no fat-finger misses).
- **Desktop regression (manual):** open all pages ≥1024px → pixel-identical to today; resize across the 768px line and confirm the desktop layout only kicks in above it.

---

## 9. Suggested execution order

1. **Phase 1** (correctness) — ~30 min, unlocks a clean audit. *Recommend doing this immediately; it's pure bug-fixing.*
2. **Phase 2** per page, lightest first: skills → about → experience → education → **publications** (heaviest) → blog.
3. **Phase 3** polish pass across all pages.
4. Re-run audit + screenshots; manual device check.
