# Blog Page Walkthrough

The Blog has been fully implemented from the Blogger/Takeout export — an index of all 46 posts, each opening on its own page, in the same card style as the Education / Experience / Publications pages.

## What was completed:

1. **`tools/build-blog.js`** (generator)
   - Parses `content/blog/Blogs/Personal Blog/feed.atom`, selects the **46 `POST` entries** (skips 97 comments + 17 pages), newest-first.
   - For each post: extracts title, published date, labels, and the HTML content; **normalizes** it (strips Blogger's Times-New-Roman inline styles/classes, makes images responsive + lazy-loaded, opens external links in new tabs).
   - Emits **`blog.html`** (index, 46 cards) and **46 `content/blog/posts/<slug>.html`** full-post pages.

2. **`tools/localize-blog-images.js`** (one-time downloader)
   - Downloaded **all 176 unique post images** (0 failures) from `blogger.googleusercontent.com` into `content/blog/posts/img/`.
   - Wrote `content/blog/posts/img-map.json` (348 entries) mapping both display `<img>` URLs and their full-res anchor links to the local files.
   - The generator picks up this map and rewrites every image link to a local path — the blog is now **fully self-contained** (0 remaining remote image references), so it survives even if the old Blogger blog is deleted.

3. **`blog.css`**
   - **Blue theme** (`rgba(53, 152, 219, 1)`) to match the blog tile (white text on blue pills).
   - Index cards: thumbnail (left) + title + `Published · date` + label pills; hover lift, blue left border, thumbnail greyscale→color.
   - Post page: comfortable **760px reading column**, long-form typography (headings, lists, blockquotes, code blocks, tables, responsive images), `‹ All posts` links top & bottom.
   - Sticky `← home` topbar (same clean, no-shadow style as the other pages); responsive at 768px (thumbnail goes full-width on top).

4. **`blog.js`** — `IntersectionObserver` fade-in for the index cards.

5. **`index.html`** — blue "blog" tile `href` changed from `#blog` → `blog.html`.

## Flow
`index.html` → click blue **blog** tile → `blog.html` (46-post list) → click any card → `content/blog/posts/<slug>.html` (full post) → `‹ All posts` back to the list, or `← home`.

## Verified
- **46** post cards in `blog.html`, newest-first (2025 Journal → … → 2017 "DAY 1 - ABOUT ME"), matching the old Blogger listing order.
- **46** generated post pages.
- **177** inline images + **46** thumbnails, **all local** — `grep` finds **0** `googleusercontent` references anywhere.
- Turkish-language posts render correctly (e.g. *HypE Genetik Algoritması … Aydınlanma Oranının*).
- Content is clean (0 leftover Blogger `style=` / Times-New-Roman noise).

## Regenerating
If the export is refreshed: re-run `node tools/localize-blog-images.js` (re-downloads images + map) then `node tools/build-blog.js` (rebuilds index + post pages). Running only `build-blog.js` reuses the existing `img-map.json`.

## Notes / options
- **Plain newest-first list, no filter bar** — chosen to match the Education/Experience/Publications style you referenced (cards still show label pills).
- The screenshot's "All (46)" label filter was intentionally left out; it can be added later as a lightweight client-side filter if you want it.
- All 46 posts are included (including the early 2017 daily lecture notes). Say the word if you'd like any excluded.
