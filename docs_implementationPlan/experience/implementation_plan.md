# Experience Page — Implementation Plan (v1)

> **Goal**: A clean, single-page experience timeline that maps to the user's CV data, fits within a premium design aesthetic matching the rest of the site.

All source files live in the project root: `C:\Users\o_iseri\Desktop\myWebsıte`

---

## Data Source

**7 entries** from `content/experience/convert experience section into table.csv`:

| # | Role | Icon | Period | Institution |
|---|------|------|---------|-------------|
| 1 | Postdoc | 🔬 researcher.png | Aug 2025 – Cont. | Concordia University, Canada |
| 2 | Lecturer | 👨‍🏫 teacher.png | Jan 2025 – Jun 2025 | Bilkent University, Architecture |
| 3 | Lead Researcher | 🔬 researcher.png | Jun 2020 – Aug 2023 | TUBITAK 1001, Research Project |
| 4 | Teaching Assistant | 👨‍🏫 teacher.png | Mar 2019 – Jun 2020 | Middle East Technical University |
| 5 | Researcher | 🔬 researcher.png | Jan 2019 – Jun 2020 | TUBITAK & Newton Fund |
| 6 | Researcher | 🔬 researcher.png | Jan 2019 – Sep 2019 | Oluşum Architecture |
| 7 | Lecturer | 👨‍🏫 teacher.png | Jan 2018 – Jan 2019 | Yasar University, Architecture |

**Icon logic**: Roles containing "Lecturer" or "Teaching Assistant" → `teacher.png`. All others → `researcher.png`.

---

## Layout (Desktop) — ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← home                                                             │
│                                                                     │
│  Experience                          (page title, Caveat font)      │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [🔬]  Postdoc              Aug 2025 – Cont.    Concordia, CA  │ │
│ │        BEM & AI/ML                                              │ │
│ │        • Developed urban energy modeling software/web platform  │ │
│ │        • Supported a modular Neighborhood Unit (NU) framework   │ │
│ │        • Peer reviewer for Scientific Reports (2025–Present)    │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │  [👨‍🏫]  Lecturer            Jan 2025 – Jun 2025   Bilkent Univ │ │
│ │         BEM & BIM                                               │ │
│ │         • Taught ARCH 324: Environmental Technologies           │ │
│ │         • Taught ADA 134: Designing with Digital Media          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ... (5 more rows) ...                                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Column Structure Per Card

```
┌──────────────────────────────────────────────────────────┐
│  ┌───────┐  ┌──────────────────────────────────────────┐ │
│  │ ICON  │  │ [Role Tag]      [Focus Area Tag]         │ │
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
| **Page style** | Vertically stacked cards (one per experience entry) |
| **Max width** | `1200px` (matching about page) |
| **Card style** | White, `border-radius: 24px`, subtle shadow |
| **Icon** | `48×48px` greyscale PNG left of each card body, colored orange on hover |
| **Role pill** | Small orange-filled badge (e.g. `Postdoc`, `Lecturer`) |
| **Focus area pill** | Small outline badge (e.g. `BEM & AI/ML`) |
| **Timeline** | Right-aligned muted text in each card header |
| **Bullets** | Clean `•` list, `font-size: 0.9rem` |
| **Hover effect** | Card lifts slightly (`translateY(-3px)`), left border flashes orange |
| **Left accent** | Thin `4px` orange left border on each card |
| **Page title** | `Experience` in Caveat font, large, left-aligned |
| **Background** | `rgba(248, 248, 246, 1)` — same as main site |
| **Body font** | Inter |
| **Back link** | Same `← home` style as About Me page |

---

## Linking from Landing Page

The yellow/gold tile on `index.html` (currently `#experience`) must be updated to point to `experience.html`.

---

## Project Files

#### [NEW] [experience.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.html)
- Back link `← home`
- Page title section
- 7 experience cards, each with icon, role pill, focus tag, institution, timeline, bullet points

#### [NEW] [experience.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.css)
- Card layout: `display: flex`, icon left, content right
- Role/focus pills
- Hover lift effect
- Icon orange-on-hover filter
- Responsive: stacks at `768px`

#### [MODIFY] [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- Update yellow tile `href` from `#experience` → `experience.html`

---

## Content Assets

- Icons: `content/experience/reseacher.png` and `content/experience/teacher.png`
- Data: `content/experience/convert experience section into table.csv`

---

## Verification Plan

### Manual Verification
- Click yellow tile on `index.html` → navigates to `experience.html`
- 7 cards appear in correct chronological order (newest first)
- Correct icon per role type (researcher vs teacher)
- Bullet points render cleanly
- Hover animation works on each card
- Back link returns to `index.html`
- Responsive at 768px: icon stacks above content

---

## v2 Addition — Bachelor's Internship (2026-09-14)

> **Goal**: Add the user's bachelor-era architecture internship at a heritage-restoration practice, sourced from `ozgecmis_orcunkoraliseri.pdf` / `Portfolio_OrcunKoralIseri.pdf` (CV: "Mita Mimarlık and Restoration", 2015 summer).

### New Entry — Internship, Summer 2015

| Field | Value |
|---|---|
| Role pill | Internship |
| Focus pill | Heritage Restoration & Conservation |
| Timeline | Summer 2015 |
| Institution | Mita Mimarlık ve Restorasyon (Mita Architecture & Restoration), İzmir, Turkey |
| Icon | `content/experience/reseacher.png` (matches other non-teaching professional roles) |
| Bullets | Architecture internship at a practice specializing in the restoration and conservation of heritage buildings in İzmir · Assisted with survey, documentation, and design work on historic building restoration projects |
| Reference links | Firm profile (Wikimapia) · Principal architect — İzmir Chamber of Architects (izmimod.org.tr) |

Chronological position: inserted as the final (10th) card, after the Yaşar University Lecturer entry (2018–2019), since Summer 2015 is the earliest date on the page.

#### [MODIFY] [experience.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.html)
- Add Entry 10 (internship card) after Entry 9, with two `.exp-link-btn` reference links.

#### [MODIFY] [experience.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.css)
- Add `.exp-link-btn` (+ container) styled like `education.css`'s `.thesis-btn`, using the page's own `--theme-color`.

---

## v3 Addition — Tasarım Köyü İzmir Organizing (2026-09-18)

> **Goal**: List the Tasarım Köyü İzmir (Design Village İzmir) organizing role as professional experience, not only as a bullet under the Bachelor's entry in `education.html`. The user was one of the organizers of the 2015 (ÜMOB'15) and 2016 editions and acted as site manager.

### New Entry — Organizer & Site Manager, 2015 – 2016

| Field | Value |
|---|---|
| Role pill | Organizer & Site Manager |
| Focus pill | Event Organization & Logistics |
| Timeline | 2015 – 2016 — year-round planning, ~1 month of on-site settlement, then the event (2015: Jul 27 – Aug 3, Düzce Köyü; 2016: Aug 27 – Sep 5, Turgutköyü — both Seferihisar) |
| Institution | Tasarım Köyü İzmir (Design Village İzmir), Seferihisar, İzmir, Turkey |
| Icon | `content/experience/reseacher.png` (same as the other non-teaching roles) |
| Bullets | Co-organized the student-run design village (2015 = ÜMOB'15, 2016 independent) · Year-round project planning + ~1 month of on-site settlement/preparation per edition · 10+ workshops for 120–150 students from across Turkey per edition · Site manager: on-site operations + liaison with municipalities, military, police, and sponsor companies · 2018 exhibition at İzmir Mimarlık Merkezi |
| Reference links | Blog: 2015 edition · Blog: 2016 edition · Sosyal Tasarım Platformu · Exhibition coverage (izmimod.org.tr) |

Chronological position: inserted as Entry 10, before the Summer 2015 internship (now Entry 11), since the organizing role ends later (2016). The Bachelor's bullet in `education.html` is kept as-is.

#### [MODIFY] [experience.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/experience.html)
- Add the Tasarım Köyü İzmir card before the internship card, reusing the existing `.exp-links` / `.exp-link-btn` styles (no CSS change).
