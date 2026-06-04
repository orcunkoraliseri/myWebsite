# Publications Page — Implementation Plan (v1)

> **Goal**: A clean, single-page publications + awards listing that reuses the exact card-based pattern of `experience.html` / `education.html`, so all section pages feel like siblings within the same premium design system.

All source files live in the project root: `C:\Users\o_iseri\Desktop\myWebsıte`

---

## Data Sources

### 1. Publications — `content/publications/publications_OrcunKoralIseri.csv`

**24 entries** across 3 types. Columns: `Type, Journal / Venue, Year, Title, Authors, URL`.

| Type | Count |
|------|-------|
| Journal | 9 |
| Book Chapter | 1 |
| Conference Proceeding | 14 |
| **Total** | **24** |

### 2. Awards — `content/publications/awards.txt`

**2 entries**. Columns: `Award Title, Year, Associated Work, Authors, Event / Venue`.

| # | Award | Year | Associated Work | Venue |
|---|-------|------|-----------------|-------|
| 1 | Best Student Paper | 2020 | An Algorithm for Efficient Urban Building Energy Modeling and Simulation | SIMAUD (11th Annual Symposium on Simulation for Architecture and Urban Design) |
| 2 | Young CAADRIA Award | 2022 | Compiling Open Datasets to Improve Urban Building Energy Models with Occupancy and Layout Data | POST-CARBON, CAADRIA 2022 |

---

## Page Structure

Two stacked sections on one page, in this order:

1. **🏅 Awards** (highlighted, at top) — 2 cards, each using the `award.png` rosette icon in the left icon column.
2. **📚 Publications** — grouped by type with a sub-header per group, newest-first within each group. Every card keeps the experience/education-style left icon column, now that per-type pictograms exist:
   - Journals (9)
   - Book Chapters (1)
   - Conference Proceedings (14)

> *Order is adjustable* — if you'd prefer Publications first and Awards at the bottom, it's a one-block move.

---

## Layout (Desktop) — ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← home                                                             │
│                                                                     │
│  Awards                               (section header, Caveat font) │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [🏅]  Best Student Paper                              2020      │ │
│ │        An Algorithm for Efficient Urban Building Energy Modeling │ │
│ │        Iseri, O. K., & Dino, I. G.                              │ │
│ │        SIMAUD — Symposium on Simulation for Arch. & Urban Design │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [🏅]  Young CAADRIA Award                            2022      │ │
│ │        ...                                                       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Publications                         (section header, Caveat font) │
│                                                                     │
│  Journals                             (group sub-header · 9)        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [Journal]  Energies                                  2026       │ │
│ │  Technological synergies in community energy systems in cold...  │ │
│ │  Hachem-Vermette, C., Iseri, O. K., Subedi, A., ...             │ │
│ │                                                  [ DOI ↗ ]       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│  ... (8 more journals) ...                                          │
│                                                                     │
│  Book Chapters                        (group sub-header · 1)        │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [Book Chapter]  CAAD: Design Imperatives             2022       │ │
│ │  Building Archetype Characterization using K-means Clustering... │ │
│ │  Iseri, O. K., & Dino, I. G.                     [ DOI ↗ ]       │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Conference Proceedings               (group sub-header · 14)       │
│  ... (14 conference cards) ...                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Card Structure

**Award card** (keeps icon column — we have `award.png`):
```
┌──────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌──────────────────────────────────────────┐ │
│  │ 🏅    │  │ [Award Tag]                      Year     │ │
│  │ 48×48 │  │ Associated Work Title                     │ │
│  └───────┘  │ Authors (owner bolded)                    │ │
│             │ Event / Venue (muted)                     │ │
│             └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Publication card** (icon column by type — `academic paper.png` for Journals/Book Chapters, `conference.png` for Conference Proceedings):
```
┌──────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌──────────────────────────────────────────┐ │
│  │ 📄/👥 │  │ [Type Pill]  Venue                Year    │ │
│  │ 48×48 │  │ Title (bold, primary)                     │ │
│  └───────┘  │ Authors (muted, owner bolded)   [ DOI ↗ ] │ │
│             └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Design Decisions

| Decision | Value |
|----------|-------|
| **Page style** | Vertically stacked cards — same pattern as `experience.html` / `education.html` |
| **Max width** | `1200px` (matching the other section pages) |
| **Card style** | White, `border-radius: 24px`, subtle shadow, hover lift (`translateY(-3px)`) |
| **Theme/accent color** | **Green `rgba(48, 218, 119, 1)`** — matches the green publications tile |
| **Pill text color** | **Dark `#1a1a24`** (green is light — keeps contrast, same as the landing tile) |
| **Type pill** | Green-filled badge: `Journal` / `Book Chapter` / `Conference Proceeding` |
| **Award pill** | Green-filled badge with the award name |
| **Status badge** | `Under Evaluation` entries get a distinct muted-outline `⏳ Under Evaluation` badge in place of a year |
| **Year** | Right-aligned in the card header (muted), mirroring the experience timeline slot |
| **Title** | Bold, primary text, the focal element of each publication card |
| **Authors** | Muted text; **the owner's name (`Iseri, O. K.` and variants) is bolded** to make his contributions scannable |
| **DOI / link** | Small `DOI ↗` button (opens in new tab) when a URL/DOI exists; omitted when `N/A` |
| **Icon column** | Every card keeps the `48×48` greyscale → color-on-hover icon column, matching experience/education (see Icon Logic below) |
| **Section headers** | `Awards`, `Publications` in Caveat font, green accent |
| **Group sub-headers** | `Journals` / `Book Chapters` / `Conference Proceedings`, with a count |
| **Sorting** | Within each group, newest-first; "Under Evaluation" journals sort to the top |
| **Animations** | `IntersectionObserver` fade-in / slide-up on scroll (reused from experience.js) |
| **Background** | `rgba(248, 248, 246, 1)` — same as main site |
| **Back link** | Same `← home` style as the other section pages |

---

## Icon Logic

Each card's left-column icon is chosen by type:

| Type | Icon |
|------|------|
| Award | `content/publications/award.png` (rosette + star) |
| Journal | `content/publications/academic paper.png` (SCIENCE document) |
| Book Chapter | `content/publications/academic paper.png` (reused — no dedicated book asset) |
| Conference Proceeding | `content/publications/conference.png` (speaker + audience) |

> Note: the `academic paper.png` filename contains a space — reference it in HTML exactly as `content/publications/academic paper.png` (the browser handles the space, but keep it consistent).

---

## URL / DOI Normalization

The CSV `URL` column is inconsistent — normalize when rendering the `DOI ↗` button:

| CSV value | Rendered link |
|-----------|---------------|
| `https://doi.org/10.xxxx` | use as-is |
| `10.xxxx` (bare DOI) | prefix → `https://doi.org/10.xxxx` |
| `N/A` | **no button** |

(Bare-DOI rows in the CSV: IJDIBE 2022 ×2, Advanced Engineering Informatics 2022, Automation in Construction 2020, Book Chapter 2022.)

---

## Linking from Landing Page

The green tile on `index.html` (currently `<a href="#articles" class="tile tile--green" id="tile-articles">` labeled "publications") must be updated to point to `publications.html`.

---

## Project Files

All source files at root: `C:\Users\o_iseri\Desktop\myWebsıte\`

#### [NEW] [publications.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/publications.html)
- Back link `← home`
- `Awards` section: 2 award cards (rosette icon, award pill, year, associated work, authors, venue)
- `Publications` section: 3 groups (Journals, Book Chapters, Conference Proceedings) with sub-headers + counts, 24 cards total
- Each publication card: type pill, venue, year (or Under-Evaluation badge), bold title, authors (owner bolded), optional `DOI ↗` button
- Loads `styles.css`, `publications.css`, `publications.js`

#### [NEW] [publications.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/publications.css)
- Forked from `experience.css` with `--theme-color` set to green `rgba(48, 218, 119, 1)`
- Dark text on green pills for contrast
- `.pub-card` / `.award-card` both reuse the experience icon-column + content-column flex layout (denser padding on publications for a long list)
- `.status-badge` (Under Evaluation), `.doi-btn`, `.group-subheader` styles
- Responsive: stacks at `768px`

#### [NEW] [publications.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/publications.js)
- Direct copy of `experience.js` — `IntersectionObserver` fade-in/slide-up on scroll
- *(Optional v2)* type filter pills (All / Journal / Book Chapter / Conference) — noted but not in v1 to stay aligned with the existing simple pattern

#### [MODIFY] [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- Update green tile `href` from `#articles` → `publications.html`

---

## Content Assets

- Publications data: `content/publications/publications_OrcunKoralIseri.csv`
- Awards data: `content/publications/awards.txt`
- Icons: `content/publications/award.png` (rosette), `content/publications/academic paper.png` (journals/book chapters), `content/publications/conference.png` (conference proceedings)

---

## File Organization

- **Source files** (`.html`, `.css`, `.js`): `C:\Users\o_iseri\Desktop\myWebsıte\`
- **Content assets** (CSV, txt, icon): `C:\Users\o_iseri\Desktop\myWebsıte\content\publications\`
- **Documentation** (plans, walkthroughs): `C:\Users\o_iseri\Desktop\myWebsıte\docs_implementationPlan\publications\`

---

## Verification Plan

### Manual Verification
- Click the green "publications" tile on `index.html` → navigates to `publications.html`
- Awards section shows 2 cards, each with the rosette icon, correct year, associated work, authors, and venue
- Publications section shows 3 groups with correct counts (Journals 9, Book Chapters 1, Conference Proceedings 14 = 24 total)
- Each card shows the correct type pill, bold title, and muted authors with `Iseri, O. K.` bolded
- Correct icon per type (award rosette / academic-paper / conference) renders in the left column and colors-in on hover
- `DOI ↗` button appears only on entries with a URL/DOI, opens the correct page in a new tab, and is absent on `N/A` rows
- The two "Under Evaluation" journals show the status badge instead of a year and sort to the top of the Journals group
- Green theme renders with readable contrast (dark text on green pills)
- Hover animation works on each card; scroll triggers fade-in
- Back link returns to `index.html`
- Responsive at 768px: cards stack, headers collapse cleanly
