# Walkthrough — Site Audit & Prioritized Remediation (2026-11-19)

This walkthrough records all improvements executed from **Urgent → Not Urgent** following the audit of `orcunkoraliseri.com`. All changes are local and uncommitted (`git commit` / `git push` left for owner approval).

---

## Priority 1 (Urgent) — Exposed File Cleanup & Image Optimization

### 1A. Removed unreferenced, publicly served files
Deleted unused tracked assets that were publicly served by GitHub Pages (recoverable from git history):
- `content/blog/Profile/` (exposed `orcunkoral13@gmail.com` at `/content/blog/Profile/profile.csv`)
- `content/input_temporary/` (21 MB unused PDFs, including a 17.62 MB Elsevier article PDF)
- `content/blog/Albums/` (35 MB unused Blogger album export + 231 `.json` metadata files)
- `.cadence/` (empty directory)
- Duplicate PNGs in `docs_implementationPlan/blog/posts_June8th/` (kept the two `.md` graphical abstract prompts)

Impact: `content/` reduced from **116 MB → 31 MB**, `docs_implementationPlan/` reduced from **6.7 MB → 176 KB**.

### 1B. `about.html` photo mosaic optimization
- Resized and progressive-compressed all 14 photos in `content/about me/photos/` in place using Pillow (`ImageOps.exif_transpose` before resizing, EXIF stripped, `quality=82, optimize=True, progressive=True`):
  - **22.42 MB → 456.8 KB** (~98% reduction, `content/about me/` total now 684 KB including CV PDF).
- Updated `about.html` above-the-fold mosaic `<img>` attributes:
  - Removed `loading="lazy"`, added `decoding="async"` on all 14 images, added `fetchpriority="high"` on the first 2 images only.
  - Updated `alt` text to `"Orcun Koral Iseri portrait"` on `DigitalPhoto_orcunkoraliseri.jpg` and `alt=""` on the remaining 13 decorative mosaic images.

### 1C. Blog graphical abstracts & card thumbnails
- Converted the two multi-MB 2026 graphical abstract PNGs into crisp progressive JPEGs (`quality=85, optimize=True`):
  - `graphical-abstract-ces-cold-climates.png` (**5.44 MB**) → `graphical-abstract-ces-cold-climates.jpg` (**194.6 KB**, 1800×1005)
  - `graphical-abstract-centus-occupancy.png` (**1.22 MB**) → `graphical-abstract-centus-occupancy.jpg` (**141.3 KB**, 1376×768)
- Visually inspected both JPEGs to verify diagram text legibility, deleted the `.png` originals, and updated references in both 2026 blog posts and `blog.html`.
- Generated 480px progressive JPEG thumbnails under `content/blog/posts/img/thumbs/` (~20–39 KB each) for every `blog.html` thumbnail exceeding 120 KB (`UHIGraph.jpg`, `openubem-graphical-abstract.jpg`, `orcun-koral-iseri-portfolio-envelope-design-2017.jpg`, `tasarim-koyu-izmir-onsite-group.jpg`, and the two 2026 graphical abstracts).
- Impact: `blog.html` unique image payload reduced from **9.17 MB → 1.49 MB (1523.0 KB)** across 51 images.
- Removed `loading="lazy"` from the first 3 above-the-fold post thumbnails on `blog.html` and added `fetchpriority="high"` on the 1st thumbnail.

---

## Priority 2 (High) — Interactive & Visual Bugs

- **Landing page 3D tilt & keyboard/touch behavior (`styles.css`, `script.js`):**
  - Removed `!important` from `.tile:hover` and `.tile:active` in `styles.css` so `script.js` inline 3D tilt transforms take effect during mouse hover.
  - Added `.tile:focus-visible .tile__label` and `.tile.active-reveal .tile__label` in `styles.css` so keyboard navigation and touch reveals display tile labels cleanly without dynamic `<style>` injection.
  - Converted tile entrance to `@keyframes tileIn` inside `@media (prefers-reduced-motion: no-preference)` with `.tile` defaulting to `opacity: 1` (preventing invisible tiles if JS is disabled or motion is reduced).
  - Replaced `'ontouchstart' in window || navigator.maxTouchPoints > 0` with `matchMedia('(hover: hover) and (pointer: fine)')` and `pointerType` tracking + `e.detail === 0` keyboard pass-through so touchscreen laptops retain mouse 3D tilt and single-click navigation while finger taps still tap-to-reveal.
- **About mosaic hover zoom (`about.css`, `about.js`):** toggled `.is-visible` instead of setting inline `img.style.transform = 'scale(1)'`, restoring `.mosaic-img:hover` zoom (`scale(1.08)`).
- **Skills card hover lag (`skills.js`, `skills.css`):** cleared inline `card.style.transitionDelay` via timeout after reveal and added `transition-delay: 0s` on `:hover`.
- **Publications standalone button alignment (`publications.css`):** moved `margin-left: 8px` from `.blog-btn` to `.doi-btn + .blog-btn`.
- **Security (`about.html`):** added `rel="noopener"` to all 6 external `target="_blank"` social links.

---

## Priority 3 (Medium-High) — SEO, Icons, Sitemap/Robots/404 & Cache-Busting

- **Site icons & social card:** created `favicon.svg`, `favicon.ico` (16×16 + 32×32), `apple-touch-icon.png` (180×180), and `og-image.png` (1200×630) matching the 6-tile color palette.
- **Metadata & structured data:** replaced placeholder `<title>`/`<meta name="description">` on `index.html`; added `.js` progressive class initializer, `<link rel="canonical">`, favicon links, Open Graph and Twitter Card metadata across all 7 root pages and all 52 blog posts; added `Person` JSON-LD on `index.html` and `about.html`.
- **Crawl & error handling:** created `robots.txt` (blocking `/Prompt/`, `/docs_implementationPlan/`, `/References/`, `/tools/`), `sitemap.xml` (59 valid URLs), and `404.html`.
- **Cache-busting:** created `tools/bump-assets.js` and added `?v=<md5-8>` hashes across all 60 root and blog HTML files.

---

## Priority 4 (Medium) — Accessibility & Mobile Phase 3 Polish

- **Headings, tables & SVGs:** added `<h1 class="visually-hidden">` inside `<main>` on the 6 root pages without an `<h1>`; converted `.group-subheader` `<div>`s to `<h2>` on `publications.html` and `skills.html`; converted `publications.html` citation metric labels to `<th scope="row" class="metric-label">`; moved `.visually-hidden` into `styles.css`; added `aria-hidden="true"` to decorative SVGs; upgraded `<div><span><span>...` pseudo-headings to `<h2>` and added `.post-article-labels` in the 3 hand-written 2026 blog posts.
- **WCAG AA contrast:** darkened small-text/icon/pill foreground accents to ≥ 4.5:1 (`#cf4219`/`#b83712` for `.btn-cv` and `404.html`, `#6e6e7a` for `.social-icon` and `.blog-search::placeholder`, `#216ea5` for blog pills/active year chip, `#0a7482` education, `#127a3f` publications, `#7c6700` skills).
- **Reduced motion & no-JS safety:** wrapped `.hidden-section` reveal transitions in `@media (prefers-reduced-motion: no-preference)` scoped under `.js` across all section CSS files; lowered `IntersectionObserver` threshold to `0.05` with `rootMargin: '0px 0px 40px 0px'` and added `prefers-reduced-motion: reduce` guards in all section JS files.
- **ARIA & mobile Phase 3 (`blog.html`, `blog.js`, `mobile.css`, `mobile.js`):**
  - Added `aria-pressed` updates on `.year-chip`, `role="status" aria-live="polite"` on `#blog-noresults`, `aria-expanded` updates on `.m-toggle`, and `mobile.js` on `blog.html`.
  - Added mobile blog "Load more" (first 12 posts shown on `<= 768px`, 40 tucked behind toggle, auto-disabled during search/year filtering; added `.m-toggle[hidden] { display: none; }` in `mobile.css`).
  - Added `env(safe-area-inset-*)` padding and 44px minimum mobile tap targets inside `@media (max-width: 768px)` in `mobile.css`.

---

## Priority 5 (Lower Priority) — Copy, Safe Blog Builder & Docs

- **Copy consistency:** normalized trailing dashes and `Continuous` → `Present` on `experience.html` and `Peer Reviewer — Sci. Reports` → `Peer Reviewer (3 Journals)` on `skills.html`.
- **Safe blog builder (`content/blog/extra-posts.json`, `tools/build-blog.js`):** registered the 6 hand-written posts in `extra-posts.json` (`"handwritten": true`), updated `tools/build-blog.js` to merge them cleanly without overwriting their HTML, to add `alt=""` to Blogger `<img>` tags missing `alt`, and to prefer `img/thumbs/*.jpg` thumbnails on `blog.html`.
- **Docs updated:** `Prompt/MANAGER_PROMPT.md`, `CLAUDE.md`, `README.md`.

---

## Owner Confirmation Items Left Untouched

- `orcunkoral.oseri@concordia.ca` in `about.html` was verified against the published *Energies* 2026 article PDF (`energies-19-01198.pdf`) and left untouched.
- Duplicate DOI `10.1007/978-981-19-1280-1_14` in `publications.html` (Book Chapters and Conference Proceedings) matches the CV PDF and was left untouched.

---

## Verification Summary

1. **Automated HTML/Link/Asset/Contrast/Sitemap Audit (Python):**
   - 60 HTML files checked: **0 broken local references**, **0 root pages missing `<h1>`**, **0 `<img>` missing `alt`**, **0 root `target="_blank"` missing `rel="noopener"`**, **0 stale `?v=` hashes**.
   - Blog index: **52 unique linked posts**, all year-chip counts match.
   - Image payloads: `about.html` **456.8 KB** (14 images); `blog.html` **1523.0 KB** (51 images).
   - WCAG AA contrast verified across all adjusted tokens: `4.72:1` (`#cf4219` btn), `5.03:1` (`#6e6e7a` social icon/placeholder), `5.47:1` (`#216ea5`), `5.48:1` (`#0a7482`), `5.41:1` (`#127a3f`), `5.53:1` (`#7c6700`).
   - `sitemap.xml`: valid XML, all 59 URLs resolve to existing files.
2. **Headless Chrome Checks:**
   - Desktop `1440×900` screenshots visually inspected for `index.html`, `about.html`, `skills.html`, `publications.html`, and `blog.html`. `about.html` fits within 1 desktop viewport (`900px`).
   - `index.html` 3D tilt mousemove test passed (`tilt=True`).
   - Zero horizontal overflow, zero broken images, and zero console/page errors across `1440×900` desktop and `320px` / `360px` / `390px` mobile iframe checks on all root pages, `404.html`, a hand-written post, and a Blogger post.
   - Mobile blog "Load more" active on `<= 768px` (`toggles=1`, `blogCollapsed=40`) and absent on desktop (`toggles=0`).
   - Top-level Chrome `--dump-dom` verified initial above-the-fold `.show-section` triggers (`about`: 3/3, `experience`: 4/10, `education`: 3/5, `publications`: 3/40, `skills`: 7/9, `blog`: 5/52).
