# Blog Page — Implementation Plan (v1)

> **Goal**: Recreate the old Blogger listing as a native part of this site — an index of all 46 posts (thumbnail · title · date · labels) in the same card style as the Education / Experience / Publications pages. Clicking a post opens its **full text** on its own page. Sticky "← home" bar, blue theme, fully static.

All source files live in the project root: `C:\Users\o_iseri\Desktop\myWebsıte`

---

## Data Source

A Blogger / Google Takeout export under `content/blog/`:

| Path | What it is |
|------|-----------|
| `content/blog/Blogs/Personal Blog/feed.atom` | **The canonical source** — 714 KB Atom feed with every entry |
| `content/blog/Albums/…` | Google-Photos image backup (461 files; hard to map to posts — see Images) |
| `content/blog/Profile/profile.csv` | Author profile (not needed for the page) |

### What's in `feed.atom`
- **160 `<entry>` elements**, of which only **46 are `<blogger:type>POST</blogger:type>`** (the rest: 97 comments — mostly `SPAM_COMMENT` — and 17 pages). **Only the 46 POSTs are used.**
- Each POST provides: `<title>`, `<published>`, decoded-HTML `<content>`, and `<category … term='…'>` **labels** (372 label instances across the 46 posts).
- Date range: **June 2017 → March 2025**. Two posts are in Turkish.
- Every post has ≥1 image; **all 177 images are remote `blogger.googleusercontent.com` URLs** embedded in the content.

---

## Architecture / Approach

The site is hand-authored static HTML with no build tooling, and pages may be opened via `file://` — so **`fetch()` of a local JSON file is not reliable** (blocked under `file://`). Two viable approaches:

### ✅ Recommended — Option A: Generate static pages (one HTML file per post)
A small **Node generator script** (`tools/build-blog.js`, run once by me) parses `feed.atom` and emits:
- `blog.html` — the index/listing page (46 cards)
- `content/blog/posts/<slug>.html` — **46 full-post pages**, each wrapped in the site shell
- A generated `content/blog/posts/posts-index.js` is **not** needed (the index is baked straight into `blog.html`)

**Why:** fully static, works on `file://` and any host, every post is its own shareable URL, no client-side data loading, and it matches how every other section is a real page. The 46 files are *generated*, not hand-maintained — re-running the script regenerates them.

### Alternative — Option B: One template + embedded JS data
Generator emits `blog-data.js` (`const POSTS=[…]` with content inlined) + a single `post.html?slug=…` template that injects content client-side. Fewer files (~4), but each post isn't its own file and it leans on JS. Avoids `fetch` by using a `<script>` (works on `file://`).

> **Decision needed** (see end): Option A vs B.

---

## Images — strategy

Post content points at remote `blogger.googleusercontent.com` URLs.

| Option | Behavior | Trade-off |
|--------|----------|-----------|
| **A. Keep remote URLs** (default) | Images load from Google's servers | Zero work, but breaks if the Blogger blog is ever deleted |
| **B. Localize during generation** (recommended for durability) | Generator downloads each image into `content/blog/posts/img/` and rewrites `src` | Self-contained forever; needs network access at build time (~177 images) |

The `Albums/` backup is **not** a practical source — Takeout names files `0001.jpg` with no link to the googleusercontent IDs in the content, so it can't be auto-mapped.

---

## Content normalization (applied by the generator)

- **Strip** Blogger's inline `font-family` / `font-size` / `white-space` span styles so posts inherit the site's **Inter** typography.
- **Keep & restyle**: headings, paragraphs, lists, links, tables, code blocks, and the centered `.separator` image blocks (→ responsive `max-width:100%` images with rounded corners).
- Force `<img>` to be responsive; add `loading="lazy"`.
- Open external links in a new tab (`target="_blank" rel="noopener"`).
- Preserve UTF-8 (Turkish characters appear in two posts).
- **Thumbnail** = the post's first image (all 46 have one).
- **Excerpt** = first ~160 chars of text (stripped of HTML) for the card preview.

---

## Layout — Index Page (`blog.html`)

Mirrors the old Blogger list and the site's card pattern (left visual column + content column), newest-first.

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← home                                          (sticky topbar)      │
│                                                                       │
│  [All ▾  ·  46]   [label] [label] [label] …      (optional filter)    │
│                                                                       │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ┌────────┐  Journal at 2025: A Method For Zone-level UBEM …      │ │
│ │ │ thumb  │  Published · Mar 24, 2025                              │ │
│ │ │ 96×72  │  [UBEM] [energy] [machine learning]                   │ │
│ │ └────────┘                                                        │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────────────┐ │
│ │ ┌────────┐  How to use TRUBA for deep learning with PyTorch - 2  │ │
│ │ │ thumb  │  Published · Aug 8, 2024                               │ │
│ │ │        │  [TRUBA] [PyTorch] [deep learning] [HPC]               │ │
│ │ └────────┘                                                        │ │
│ └───────────────────────────────────────────────────────────────────┘ │
│  … 44 more cards …                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

Each card is a link to that post's page (`content/blog/posts/<slug>.html`).

---

## Layout — Post Page (`content/blog/posts/<slug>.html`)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← home                                          (sticky topbar)      │
│                                                                       │
│  ‹ All posts                                     (back to blog.html)  │
│                                                                       │
│  Journal at 2025: A Method For Zone-level Urban Building Energy …     │
│  Published · Mar 24, 2025      [UBEM] [energy] [machine learning]     │
│  ───────────────────────────────────────────────────────────────     │
│                                                                       │
│  <full post content: text, images, lists, code, tables …>            │
│                                                                       │
│  ───────────────────────────────────────────────────────────────     │
│  ‹ All posts                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

- Reading-width column (`max-width: 760px`) for comfortable long-form reading (narrower than the 1200px index).
- Title in Inter bold; body inherits site typography.

---

## Design Decisions

| Decision | Value |
|----------|-------|
| **Theme/accent color** | **Blue `rgba(53, 152, 219, 1)`** — matches the blue blog tile (white text works on blue, unlike the lighter tiles) |
| **Index card style** | White, `border-radius: 24px`, hover lift + blue left border + thumbnail zoom — same family as the other section cards |
| **Thumbnail** | Post's first image, `~96×72`, `object-fit: cover`, rounded; greyscale→color on hover (consistent with the icon treatment elsewhere) |
| **Label pills** | Small blue-filled pills (white text) on cards and post headers |
| **Date format** | `Published · Mon D, YYYY` (e.g. `Mar 24, 2025`) |
| **Order** | Newest first |
| **Optional filter bar** | `All (46)` + clickable label chips that show/hide cards client-side (no fetch) — matches the old Blogger "All (46)" control. Marked optional; lean default keeps it. |
| **Post reading width** | `760px` |
| **Sticky topbar** | Same `← home` pinned bar as the other pages (no shadow/frame) |
| **Back to list** | `‹ All posts` link on every post page → `blog.html` |
| **Animations** | `IntersectionObserver` fade-in on the index cards (reused pattern) |
| **Background / font** | `rgba(248,248,246,1)` · Inter |

---

## Generation Pipeline (run once by me during build)

1. `tools/build-blog.js` reads `feed.atom`, selects the 46 POST entries.
2. For each: parse title, date, labels, decode + normalize content, extract thumbnail + excerpt, build a slug.
3. (If image-localization chosen) download remote images → `content/blog/posts/img/`, rewrite `src`.
4. Write 46 `content/blog/posts/<slug>.html` files from a post template.
5. Write `blog.html` with all 46 cards (sorted newest-first).
6. The script is committed under `tools/` so the blog can be regenerated if the export is refreshed.

---

## Project Files

#### [NEW] [blog.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/blog.html)
- Sticky `← home` topbar, optional filter bar, 46 post cards (generated)

#### [NEW] [blog.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/blog.css)
- Blue theme; index card + thumbnail + label-pill styles; **and** post-page styles (`.post-article`, reading width, content typography) — or split into `post.css`
- Sticky `.page-topbar` (same as other pages); responsive at 768px

#### [NEW] [blog.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/blog.js)
- `IntersectionObserver` card fade-in + (optional) label-filter show/hide

#### [NEW] content/blog/posts/<slug>.html  ×46
- Generated full-post pages

#### [NEW] tools/build-blog.js
- The generator (parses `feed.atom`, emits `blog.html` + post pages)

#### [MODIFY] [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- Update blue tile `href` from `#blog` → `blog.html`

---

## Content Assets

- Source feed: `content/blog/Blogs/Personal Blog/feed.atom`
- (Optional) localized images: `content/blog/posts/img/`

---

## File Organization

- **Source/index pages** (`blog.html`, `blog.css`, `blog.js`): project root
- **Generated post pages**: `content/blog/posts/`
- **Generator**: `tools/build-blog.js`
- **Documentation**: `docs_implementationPlan/blog/`

---

## Verification Plan

- Click the blue "blog" tile on `index.html` → opens `blog.html`
- **46 cards** appear, newest-first, each with thumbnail, title, `Published · date`, and label pills
- Clicking any card opens that post's page with the **full content** (text + images) rendered cleanly in the reading column
- Images display (remote or localized per the chosen option)
- `‹ All posts` returns to `blog.html`; `← home` returns to `index.html`
- Turkish-language posts render with correct characters
- (If filter kept) clicking a label chip filters the list; `All (46)` resets
- Responsive at 768px: cards stack thumbnail-over-text; post column stays readable
- Spot-check 3 posts of different eras (2017 lecture note, 2022 award, 2025 journal)

---

## Open Decisions (please confirm before build)
1. **Per-post pages (Option A, recommended)** vs single template + embedded JS (Option B)
2. **Images**: keep remote URLs (simplest) vs localize/download them (durable, needs network at build)
3. **Filter bar**: include the `All (46)` + label-chip filter, or keep the index as a plain list
