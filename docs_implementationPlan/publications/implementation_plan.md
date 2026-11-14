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

---

# Publications Sync & Google Scholar Update Plan (2026-11-14)

> **Scope:** Reconcile `publications.html`, `skills.html`, and `Prompt/MANAGER_PROMPT.md` against live Google Scholar (`user=s4l2zioAAAAJ`), `GSSCanada` (`1J`–`8J` + `eSim`), and `OpenUBEM`.

## 1. Google Scholar Citation Metrics (`publications.html`)

- **Table (`#gsc_rsb_st` verified 2026-11-14):**
  - Citations: `235` → **`237`** (All), `228` → **`230`** (Since 2021)
  - h-index: `7` / `7` (unchanged)
  - i10-index: `7` / `7` (unchanged)
- **Yearly Bar Chart (`2020–2026`, `max = 68 -> 180px`, `round(count / 68 * 180)`):**
  - `2020`: `4` (`11px`)
  - `2021`: `20` (`53px`)
  - `2022`: `29` (`77px`)
  - `2023`: `21` (`56px`)
  - `2024`: `25` → **`26`** (`66px` → **`69px`**)
  - `2025`: `65` → **`66`** (`172px` → **`175px`**)
  - `2026`: `68` (`180px`)

## 2. Verified Publication Updates from `GSSCanada`, `OpenUBEM`, and Google Scholar

| ID / Source | Action | Proposed Card Content & Status | Needs Author Decision? |
|---|---|---|---|
| **GS `SCS 2025`** | Add (if approved) | *Machine learning based prediction of long-term energy consumption and overheating under climate change impacts using urban building energy modeling* — *Sustainable Cities and Society* (2025), DOI `10.1016/j.scs.2025.106500` | Yes — confirm inclusion in Journals |
| **GSS `eSim 2026`** | Add to Conferences | *Longitudinal Analysis of Occupancy-Driven Energy Demand in Canadian Residential Buildings (2005–2025)* — *Proceedings of eSim 2026: 14th Conference of IBPSA-Canada* (2026), **Iseri, O. K.**, Hachem-Vermette, C., DOI `10.26868/31114504.2026.30` | Yes — confirm inclusion |
| **GSS `2J`** (Journal 4) | Update title & add venue | Title → *Residential electricity load shape under changing occupancy: household-level schedules and stock-scale building energy simulation for Canada, 2005–2030*; Venue → *Energy and Buildings* (submitted 2026-09-29); Status → `⏳ Under Evaluation` | Approve |
| **GSS `3J`** (Journal 5) | Update title & add venue | Title → *Survey-Based Occupancy Schedules in Mixed-Use Towers: Effects on Tenant Energy, Peak Demand and Benchmarking*; Venue → *Energy Efficiency* (submitted 2026-10-28); Status → `⏳ Under Evaluation` | Approve |
| **GSS `5J`** | Add new Journal card | *An occupancy-aware EnergyPlus surrogate for two real residential districts, scored on the effect of the household* — *Building and Environment* (submitted 2026-11-14) — **Iseri, O. K.** — `⏳ Under Evaluation` | Approve |
| **GSS `6J`** | Add new Journal card | *Harmonised time-use diaries from nine countries as household heat gains in six urban building energy models* — *Building Simulation* (submitted 2026-11-13) — **Iseri, O. K.** — `⏳ Under Evaluation` | Approve |
| **GSS `4J`** (Journal 8) | Update or keep working title | Currently *HETUS-Wide Occupancy Generation with a Fine-Tuned Open-Weight LLM...* (`🛠️ In Preparation`). Pivoted 2026-11-14 to cross-country conditioned slot transformer (`MTUS` + `ES`/`IT`) + EnergyPlus `E7` benchmark. | Yes — confirm updated title or keep current |
| **GSS `7J`** | Add `🛠️ In Preparation` (if approved) | *Twenty years of American time use for occupancy and energy* (`ATUS` 2003–2023 LLM/energy study, **Iseri, O. K.** — confirm co-authors/title) — `🛠️ In Preparation` | Yes — confirm inclusion, title & authors |
| **GSS `8J` / CISBAT 2027** | Add to Conferences (if approved) | *Home or office? Energy and emissions of a hybrid work day in two Canadian mixed-use towers* — *CISBAT 2027* (abstract submitted 2026-10-25, #132) — **Iseri, O. K.**, Hachem-Vermette, C. — `⏳ Under Evaluation` or `🛠️ In Preparation` | Yes — confirm badge (`⏳ Under Evaluation` vs `🛠️ In Preparation`) |
| **OpenUBEM** | Add `🛠️ In Preparation` (if approved) | Code + 3-city U.S. validation (`NYC`/`LA`/`Austin`) + 10/11 European districts + GMaps height fusion exist in `/Users/orcunkoraliseri/Desktop/OpenUBEM`; paper-review notes target *Sustainable Cities and Society* with no manuscript draft yet. | Yes — add working entry (title & authors) or wait until drafted? |
| **GS `Journal 2` SSRN / `MSTAS 2017`** | Optional | Add SSRN `6576766` link to Journal 2? Keep `MSTAS 2017` omitted? | Yes — confirm |

## 3. Sync & Verification Plan (Post-Approval)

1. Edit `publications.html` (citation metrics, card updates/additions, `<span class="group-count">` totals, newest-first / `⏳ Under Evaluation` -> `🛠️ In Preparation` -> published ordering).
2. Edit `skills.html` to update the `30 Publications ↗` chip to the new `(Journals + Book Chapters + Conference Proceedings)` total.
3. Update `Prompt/MANAGER_PROMPT.md` (§3 counts and §10 Session Log) and `docs_implementationPlan/publications/walkthrough.md`.
4. Verify in headless Chromium (`1440×900` desktop and `390×844` mobile) via `python3 -m http.server`, checking zero console errors, zero horizontal overflow, valid SVG/CSS bar rendering, and matching totals. Do NOT commit or push unless explicitly instructed.

### Approved Resolution (2026-11-14)
- User approved plan (`"lets go"`) and instructed: keep `4J` (`Journal 8`) and `7J` as `🛠️ In Preparation`.
- Final totals applied: **Journals · 20** (8 `⏳ Under Evaluation`, 3 `🛠️ In Preparation` including `4J`, `7J`, and `OpenUBEM`, 9 published including `SCS 2025`), **Book Chapters · 1**, **Conference Proceedings · 16** (`CISBAT 2027` abstract `⏳ Under Evaluation` + `eSim 2026` + 14 earlier), **37 Publications** overall (synced in `skills.html`).
