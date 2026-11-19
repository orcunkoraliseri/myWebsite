# Site Audit & Improvement Plan — orcunkoraliseri.com

**Date:** 2026-11-19
**Scope:** Full-site audit and prioritized remediation across root pages (`index.html`, `about.html`, `experience.html`, `education.html`, `publications.html`, `blog.html`, `skills.html`), stylesheets/scripts, blog pipeline (`tools/build-blog.js`), assets, SEO/metadata, and accessibility/mobile Phase 3 polish.

## Guardrails
- Never commit or push automatically (only when requested).
- **Desktop-frozen rule for mobile work:** every rule in `mobile.css` stays inside `@media (max-width: 768px)`, and `mobile.js` returns immediately above `768px`. Do not alter the intentional desktop flex-row topbar quirk in `styles.css`.
- Preserve all factual/personal data (`orcunkoral.oseri@concordia.ca` verified in published *Energies* 2026 paper; keep duplicate DOI entry `10.1007/978-981-19-1280-1_14` and OpenUBEM description intact).

## Priority Order

1. **Priority 1 (Urgent) — Security/Privacy Cleanup & Heavy Image Optimization**
   - Remove unreferenced, publicly exposed non-site directories/files (`content/blog/Profile/`, `content/input_temporary/`, `content/blog/Albums/`, `.cadence/`, and duplicate PNGs in `docs_implementationPlan/blog/posts_June8th/`).
   - Resize and compress the 14 photos in `content/about me/photos/` in place (preserving filenames) from 22.42 MB to < 600 KB; remove `loading="lazy"` on above-the-fold mosaic images, set `fetchpriority="high"` on first 2 only, `decoding="async"` on all, and clean `alt` attributes.
   - Optimize oversized blog graphical abstract PNGs and generate resized thumbnails in `content/blog/posts/img/thumbs/` for `blog.html`; remove `loading="lazy"` on top 3 thumbnails and set `fetchpriority="high"` on the 1st.

2. **Priority 2 (High) — Interactive & Visual CSS/JS Fixes**
   - Fix `.tile:hover` `!important` overriding `script.js` 3D tilt; reveal `.tile__label` on `:focus-visible`; replace `'ontouchstart' in window || navigator.maxTouchPoints > 0` with `matchMedia` / `pointerType` detection so touch laptops retain mouse hover/tilt; add CSS `@media (prefers-reduced-motion: no-preference)` entrance animation without `opacity: 0` fallback risk.
   - Fix `about.js` setting inline `transform` (which broke `.mosaic-img:hover` zoom) by toggling `.is-visible`.
   - Clear `skills.js` inline `transitionDelay` after entrance reveal (and add `transition-delay: 0s` on `:hover`).
   - Fix `.blog-btn` 8px left margin in `publications.css` via `.doi-btn + .blog-btn`.
   - Add `rel="noopener"` to all external `target="_blank"` links in `about.html`.

3. **Priority 3 (Medium-High) — SEO, Icons, Open Graph, Sitemap/Robots/404 & Cache-Busting**
   - Create `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, and `og-image.png`.
   - Update `<title>` and `<meta name="description">` on `index.html`; add canonical links, favicons, Open Graph, Twitter Card tags, and `<script>document.documentElement.classList.add('js');</script>` across all 7 root pages + `404.html`; add JSON-LD `Person` schema on `index.html` and `about.html`.
   - Add `robots.txt`, `sitemap.xml`, and `404.html`.
   - Add `tools/bump-assets.js` to keep `?v=<md5-8>` hashes fresh across all pages.

4. **Priority 4 (Medium) — Accessibility & Mobile Phase 3 Polish**
   - Add `<h1 class="visually-hidden">` on the 6 root pages lacking an `<h1>`; convert `.group-subheader` `<div>`s to `<h2>` on `publications.html` and `skills.html`; use `<th scope="row">` in `publications.html`; add `aria-hidden="true"` on decorative SVGs; upgrade pseudo-headings (`<div><span><span>...`) in the 3 2026 blog posts to `<h2>` and include `.post-article-labels`.
   - Adjust accent/placeholder/icon contrast to satisfy WCAG AA (≥ 4.5:1 normal text, ≥ 3.0:1 UI/large text).
   - Wrap `.hidden-section` reveal transitions in `@media (prefers-reduced-motion: no-preference)` scoped under `.js` across section CSS files, and lower observer threshold to `0.05` with reduced-motion guard.
   - Add `aria-pressed` to blog `.year-chip`s, `role="status" aria-live="polite"` on `#blog-noresults`, `aria-expanded` on `.m-toggle`, `mobile.js` on `blog.html`, 44px mobile tap targets + safe-area insets in `mobile.css`, and mobile blog "Load more" (first 12 cards on `<= 768px`, auto-disabled when filtering).

5. **Priority 5 (Lower) — Copy Consistency, Safe Blog Builder & Documentation**
   - Normalize trailing dashes/`Continuous` → `Present` on `experience.html` and `Peer Reviewer (3 Journals)` on `skills.html`.
   - Add `content/blog/extra-posts.json` and update `tools/build-blog.js` to merge hand-written posts safely, auto-add `alt=""` to Blogger `<img>` tags missing `alt`, and emit updated templates.
   - Update `Prompt/MANAGER_PROMPT.md`, `CLAUDE.md`, `README.md`, and write `docs_implementationPlan/site-audit-2026-11/walkthrough.md`.
