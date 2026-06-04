# About Me Page — Implementation Plan (v4)

> **Goal**: Fit the entire About Me page inside a single viewport on desktop — **no scrolling**.

All source files live in the project root (`C:\Users\o_iseri\Desktop\myWebsıte`).

---

## Layout (Desktop)

The page targets `100vh` with no overflow. Four strategies combine to achieve this:

### Strategy 1 — Widen the container
- Increase `max-width` from `900px` → **`1200px`**
- Content spreads horizontally, reducing the vertical height required

### Strategy 2 — Tighten spacing
- Card padding: `36px` → **`20px`**
- Section gap: `28px` → **`16px`**
- Body padding: `40px` → **`24px 40px`**
- Back-link margin-bottom: `40px` → **`16px`**

### Strategy 3 — Side-by-side Background & Research Focus
- Background and Research Focus are placed **next to each other** in a horizontal row instead of stacked vertically
- This cuts the combined height of these two sections roughly in half

### Strategy 4 — Compact photo mosaic
- Fixed **7-column** grid (2 rows × 7 photos = 14 photos)
- Smaller thumbnails via reduced row height
- Tighter mosaic gap: `8px` → **`6px`**

```
┌──────────────────────────────────────────────────────────────────┐
│ ← home                                                          │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 1. PHOTO MOSAIC  (7 cols × 2 rows, compact thumbnails)      │ │
│ │ ┌──┬──┬──┬──┬──┬──┬──┐                                     │ │
│ │ ├──┼──┼──┼──┼──┼──┼──┤                                     │ │
│ │ └──┴──┴──┴──┴──┴──┴──┘                                     │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ 2. IDENTITY  (centered)                                     │ │
│ │ Orcun Koral Iseri, PhD                                      │ │
│ │ Postdoctoral Researcher | Building Physics & AI/ML          │ │
│ │ Concordia University, Montreal                              │ │
│ │ email | email                                               │ │
│ │ [⬇ Download CV]  [Scholar] [RG] [LI] [GH] [X] [YT]        │ │
│ │ [Turkish] [English] [French]                                │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌──────────────────────────────┐ ┌──────────────────────────────┐│
│ │ 3. BACKGROUND                │ │ 4. RESEARCH FOCUS            ││
│ │ Paragraphs (condensed)       │ │ Pill tags (wrapped)          ││
│ └──────────────────────────────┘ └──────────────────────────────┘│
└──────────────────────────────────────────────────────────────────┘
```

---

## Design Decisions

| Decision | Value |
|----------|-------|
| **Desktop layout** | Single viewport, no scroll (`100vh`) |
| **Container max-width** | `1200px` (was `900px`) |
| **Section gap** | `16px` (was `28px`) |
| **Card padding** | `20px` (was `36px`) |
| **Background + Research Focus** | Side-by-side (flexbox row) |
| **Name font** | **Inter** (bold, 700 weight) — NOT Caveat |
| **Title / affiliation / contact font** | **Inter** (500 weight, muted color) |
| **Section titles** | **Caveat** (handwritten, orange accent) |
| **Background color** | `rgba(248, 248, 246, 1)` |
| **Accent color** | Orange `rgba(240, 95, 51)` |
| **Photo mosaic** | Fixed 7-column grid, 14 photos, 2 rows |
| **Identity section** | Center-aligned, includes languages |
| **Languages** | Inside Identity card (Turkish, English, French only) |
| **Research focus items** | Pill-shaped tags |
| **Cards** | White `border-radius: 24px`, subtle shadow |

---

## Content

- **14 photos** from `content/about me/photos/` (3 `.CR2` excluded)
- **CV PDF** from `content/about me/CV/CV_OrcunKoralISERI_AC.pdf`
- **Social links**: Google Scholar, ResearchGate, LinkedIn, GitHub, X/Twitter, YouTube
- **Languages**: Turkish (Native), English (Professional), French (Fluent)
- **Research Focus** (12 pills): UBEM, AI/ML, Occupancy Modeling, BIM, Climate-Resilient, Deep Learning, Stochastic Occupancy, Stock Turnover, K-Means, NSGA-II, Computer Vision, HPC

---

## Project Files

All source files at root: `C:\Users\o_iseri\Desktop\myWebsıte\`

#### [MODIFY] [about.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/about.html)
- Wrap Background + Research Focus in a shared `content-row` flex container
- Languages inside the Identity card (already done)
- 14 photos in mosaic (already done)

#### [MODIFY] [about.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/about.css)
- `max-width: 1200px`, tighter padding/gaps
- `.content-row` with `display: flex; gap: 16px` for side-by-side cards
- Photo mosaic: `repeat(7, 1fr)` (already done)
- Responsive fallback at `768px`: stack everything vertically, allow scrolling

#### [about.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/about.js)
- No changes needed

#### [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- No changes needed

---

## File Organization

- **Source files** (`.html`, `.css`, `.js`): `C:\Users\o_iseri\Desktop\myWebsıte\`
- **Content assets** (photos, CV): `C:\Users\o_iseri\Desktop\myWebsıte\content\about me\`
- **References** (wireframes only): `C:\Users\o_iseri\Desktop\myWebsıte\References\`
- **Documentation** (plans, walkthroughs): `C:\Users\o_iseri\Desktop\myWebsıte\docs_implementationPlan\`

---

## Verification Plan

### Manual Verification
- Open `about.html` on a standard 1920×1080 desktop monitor
- Confirm **all content is visible without scrolling**
- Background and Research Focus appear side-by-side
- Photo mosaic shows exactly 2 rows × 7 columns
- Name is in Inter font, section titles in Caveat
- Languages (3 badges) appear inside the Identity card
- Click "Download CV" → downloads the PDF
- All 6 social icons open in new tabs
- Back link returns to `index.html`
- Test at 768px viewport → layout stacks vertically and allows scroll
