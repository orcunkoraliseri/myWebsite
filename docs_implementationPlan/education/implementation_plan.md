# Education Page — Implementation Plan (v1)

> **Goal**: A clean, single-page education timeline that maps to the user's CV data, reusing the exact card-based pattern of `experience.html` so the two pages feel like siblings within the same premium design system.

All source files live in the project root: `C:\Users\o_iseri\Desktop\myWebsıte`

---

## Data Source

**5 entries** from `content/education/OrcunKoralIseri_Education.csv`:

| # | Degree | Icon | Period | Institution | Focus Area |
|---|--------|------|--------|-------------|------------|
| 1 | Doctorate | 📖 Education.png | Jan. 2019 – Sep. 2024 | Middle East Technical University — School of Applied Sciences, Faculty of Architecture | UBEM & AI/ML |
| 2 | MSc | 📖 Education.png | Sep. 2016 – June 2018 | Yaşar University — School of Applied Sciences, Faculty of Architecture | BEM & Statistics |
| 3 | Bachelor | 📖 Education.png | Sep. 2012 – June 2016 | Yaşar University, Faculty of Architecture | Architecture |
| 4 | Online Education | 📖 Education.png | — | Self-paced (CENG / MITx) | Deep Learning & Probability & ML |
| 5 | High School | 📖 Education.png | — | Le Lycée Français Saint Joseph d'Izmir | General Academic |

**Icon logic**: Unlike the Experience page (which branched between `researcher.png` / `teacher.png`), Education has a **single shared infographic** — the book-and-lightbulb icon at `content/education/Education.png`. Every card uses the same icon.

**Timeline logic**: Entries 4 and 5 have `—` (no dated range) in the CSV. Render their timeline slot as a muted `—` (or omit the timeline element entirely) so the header doesn't collapse awkwardly.

---

## Content Mapping (CSV → Card)

Each CSV column maps to a card element. The free-text `Key_Contributions_and_Details` field is split into clean bullets, and the recurring `100% scholarship` note is promoted to a small highlight badge.

| # | Degree pill | Focus pill | Scholarship badge | Bullets |
|---|-------------|------------|-------------------|---------|
| 1 | Doctorate | UBEM & AI/ML | — | • *Thesis*: Occupancy Modeling for Sustainable Transformation of Residential Building Stock.<br>• Developed deep learning (time-series) models to improve occupancy representation in UBEM.<br>• Advisor: Prof. Dr. Ipek Gursel Dino · Co-advisor: Prof. Dr. Sinan Kalkan (Computer Engineering). |
| 2 | MSc | BEM & Statistics | 🏅 100% Scholarship | • *Thesis*: The influence of early design decisions on energy demand — a quantitative assessment using sensitivity analysis.<br>• Applied Sobol sensitivity analysis in Python (Eppy/Geomeppy, SciPy, SALib, NumPy).<br>• Specialized in thermodynamics and statistical modeling for energy-system evaluation.<br>• Advisor: Dr. Onur Dursun (Civil Engineer). |
| 3 | Bachelor | Architecture | 🏅 100% Scholarship | • Focused on core architectural foundations. |
| 4 | Online Education | Deep Learning & Probability & ML | — | • CENG 501 — Deep Learning.<br>• MITx 6.431x — Probability.<br>• MITx 6.86x — Machine Learning with Python. |
| 5 | High School | General Academic | 🏅 100% Scholarship | • Bilingual French / Turkish academic foundation. |

---

## Layout (Desktop) — ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← home                                                             │
│                                                                     │
│  Education                            (page title, Caveat font)     │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [📖]  Doctorate           UBEM & AI/ML      Jan 2019 – Sep 2024 │ │
│ │        Middle East Technical University                          │ │
│ │        • Thesis: Occupancy Modeling for Sustainable Transform... │ │
│ │        • Developed deep learning (time-series) models for UBEM   │ │
│ │        • Advisor: Prof. Dr. Ipek Gursel Dino (+ co-advisor)      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [📖]  MSc   BEM & Statistics  [🏅 100% Scholarship] Sep18–Jun18 │ │
│ │        Yaşar University, Faculty of Architecture                 │ │
│ │        • Thesis: Influence of early design decisions on energy   │ │
│ │        • Sobol sensitivity analysis in Python (SALib, NumPy...)  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ... (3 more rows: Bachelor, Online Education, High School) ...     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Column Structure Per Card

```
┌──────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌──────────────────────────────────────────┐ │
│  │ ICON  │  │ [Degree Tag] [Focus Tag] [🏅 Scholarship] │ │
│  │ 48×48 │  │ Institution Name              Timeline   │ │
│  └───────┘  │ • Bullet point 1                         │ │
│             │ • Bullet point 2                         │ │
│             └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Design Decisions

| Decision | Value |
|----------|-------|
| **Page style** | Vertically stacked cards (one per education entry) — identical pattern to `experience.html` |
| **Max width** | `1200px` (matching experience & about pages) |
| **Card style** | White, `border-radius: 24px`, subtle shadow |
| **Icon** | `48×48px` greyscale `Education.png` left of each card body, colored on hover |
| **Theme/accent color** | **Cyan `rgba(20, 199, 222, 1)`** — matches the cyan education tile (Experience used magenta) |
| **Degree pill** | Small cyan-filled badge with **dark text `#1a1a24`** (cyan is light — dark text keeps contrast, same as the landing tile) |
| **Focus area pill** | Small outline badge (e.g. `UBEM & AI/ML`) |
| **Scholarship badge** | Small subtle highlight pill `🏅 100% Scholarship` (shown only on entries 2, 3, 5) |
| **Timeline** | Right-aligned muted text in each card header; `—` for undated entries (4, 5) |
| **Bullets** | Clean `•` list, `font-size: 0.95rem`, thesis titles italicized |
| **Hover effect** | Card lifts slightly (`translateY(-3px)`), left border flashes cyan |
| **Left accent** | Thin `4px` cyan left border on each card |
| **Page title** | `Education` in Caveat font, large, left-aligned, cyan |
| **Background** | `rgba(248, 248, 246, 1)` — same as main site |
| **Body font** | Inter |
| **Back link** | Same `← home` style as Experience / About pages |
| **Order** | Newest first (Doctorate → High School), matching the Experience reverse-chronological convention |

---

## Linking from Landing Page

The cyan tile on `index.html` (currently `<a href="#education" class="tile tile--cyan" id="tile-education">`) must be updated to point to `education.html` — mirroring the change already made for the experience tile.

---

## Project Files

All source files at root: `C:\Users\o_iseri\Desktop\myWebsıte\`

#### [NEW] [education.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/education.html)
- Back link `← home`
- Page title section (`Education`, Caveat font)
- 5 education cards, each with the shared `Education.png` icon, degree pill, focus tag, optional scholarship badge, institution, timeline, and bullet points
- Loads `styles.css`, `education.css`, and `education.js`

#### [NEW] [education.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/education.css)
- Forked from `experience.css` with `--theme-color` set to cyan `rgba(20, 199, 222, 1)`
- Degree pill uses dark text on cyan for contrast
- New `.scholarship-pill` style (subtle highlight)
- Card layout: `display: flex`, icon left, content right
- Hover lift + cyan left border + icon color-in
- Responsive: stacks at `768px`

#### [NEW] [education.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/education.js)
- Direct copy of `experience.js` — `IntersectionObserver` fade-in/slide-up on scroll (`.hidden-section` → `.show-section`)

#### [MODIFY] [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- Update cyan tile `href` from `#education` → `education.html`

---

## Content Assets

- Icon: `content/education/Education.png` (book + lightbulb, shared by all cards)
- Data: `content/education/OrcunKoralIseri_Education.csv`

---

## File Organization

- **Source files** (`.html`, `.css`, `.js`): `C:\Users\o_iseri\Desktop\myWebsıte\`
- **Content assets** (icon, CSV): `C:\Users\o_iseri\Desktop\myWebsıte\content\education\`
- **Documentation** (plans, walkthroughs): `C:\Users\o_iseri\Desktop\myWebsıte\docs_implementationPlan\education\`

---

## Verification Plan

### Manual Verification
- Click the cyan tile on `index.html` → navigates to `education.html`
- 5 cards appear in correct order (Doctorate → MSc → Bachelor → Online Education → High School)
- Every card shows the `Education.png` book-and-lightbulb icon
- Degree, focus, and scholarship pills render with correct cyan theme and readable contrast
- Undated entries (Online Education, High School) show `—` cleanly in the timeline slot
- Thesis titles render italicized; bullet points are clean
- Hover animation works on each card (lift + cyan border + icon color-in)
- Scroll triggers the fade-in / slide-up entrance animation
- Back link returns to `index.html`
- Responsive at 768px: icon stacks above content, header stacks vertically
