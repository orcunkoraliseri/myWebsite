# Walkthrough: Mobile Optimization

I optimized the six inner pages (about, experience, education, publications, skills, blog index + post) for phones, while leaving the desktop view **completely unchanged**. The home page was already mobile-perfect and was left alone.

The whole change ships as two shared files — `mobile.css` and `mobile.js` — linked after each page's own assets. Every CSS rule lives inside `@media (max-width: 768px)`, and the JavaScript bails out immediately above 768px, so desktop is untouched by construction.

### 1. Fixed horizontal scrolling (the real bugs)
- **Content pages were inheriting the home grid's flex-centering** from `styles.css`, which shoved the layout off-centre and overflowed on narrow phones. Reset `body` to `display:block` on mobile only.
- **Blog posts overflowed every phone** because a long bare URL wouldn't wrap. Added `overflow-wrap` so URLs break, and made wide tables scroll inside their own box instead of stretching the page.
- Added a mobile `overflow-x: clip` safety net (keeps the sticky "home" bar working).

### 2. "Show the headline, collapse the depth" (content optimization)
On phones the pages no longer dump every detail at once — a tap reveals the rest:
- **About** — the Background shows the first paragraph with a **"▾ Read more (3)"** toggle.
- **Experience / Education** — each card shows its first bullet with a **"▾ Show details (N)"** toggle.
- **Publications** (the longest page) — each group (Journals, Book Chapters, Conference Proceedings) shows its first 3 entries with a **"▾ Show all 12"** toggle.

### 3. About photo mosaic → swipeable strip
- On desktop the 14 photos stay in the 7×2 mosaic. On phones they become a **horizontally swipeable strip** of larger thumbnails (132px, scroll-snap) instead of a grid of tiny squares.

### 4. Blog (generated) wired through the build tool
- Added the `mobile.css` link to the post + index templates in `tools/build-blog.js` (with the existing `?v=<hash>` cache-buster) and rebuilt — `blog.html` + 46 post pages.

### Verification Performed
- **Mobile (automated):** `node tools/mobile-audit.js` → every page `ok` at 320 / 360 / 390px. Zero horizontal overflow (previously about@320 and every blog post failed).
- **Desktop frozen (automated):** at 1440px the container position/width and `body` display are **identical** to the pre-edit baseline on all five pages. `mobile.js` adds **0** elements on desktop (0 toggles, 0 collapsed) — the only DOM change is the inert `<script>` tag, which renders nothing.
- **Visual:** `mobile-shots/after/*.png` matches the approved preview; desktop equivalence shown in `mobile-shots/preview-desktop/` vs `mobile-shots/desktop/`.

### How to re-check
```bash
npm run dev
node tools/mobile-audit.js     # mobile: expect all "ok"
node tools/mobile-shot.js after # refresh mobile screenshots
```

### Not done (optional, future)
Phase 3 polish (44px tap targets, `env(safe-area-inset)` for notches, `prefers-reduced-motion`), standardized breakpoints, and a blog "Load more" — none required for the approved result.
