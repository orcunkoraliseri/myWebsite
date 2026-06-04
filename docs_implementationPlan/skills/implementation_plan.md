# Skills Page — Implementation Plan (v1)

> **Goal**: A single-row, 6-column skills showcase. Each column shows a pictogram + skill name, and below it 4–5 keyword chips ("related jobs, publications, tools") drawn from the CV — so each skill is backed by concrete evidence. Reuses the site's card aesthetic and the greyscale-→-color-on-hover icon treatment from the other section pages.

All source files live in the project root: `C:\Users\o_iseri\Desktop\myWebsıte`

---

## Data Sources

### 1. Pictograms — `content/skills/` (6 PNGs = the 6 main skills)

| Skill | Pictogram |
|-------|-----------|
| Energy Modeling | `content/skills/energy modeling.png` |
| Deep Learning | `content/skills/deep learning.png` |
| Cloud Computing | `content/skills/cloud computing.png` |
| Academic Writing | `content/skills/academic writing.png` |
| Project Management | `content/skills/project management.png` |
| Web Design | `content/skills/web design.png` |

> Note: every filename contains a space — reference them in HTML exactly as `content/skills/energy modeling.png` (browsers handle the space).

### 2. Keyword evidence — `content/about me/CV/CV_OrcunKoralISERI_AC.pdf`

The CV has no standalone "Skills" list; keywords below are extracted from the summary, Experience, and Publications sections.

---

## The 6 Skills + Keyword Chips

Column order (left → right): research-technical first, then professional, then web.

| # | Skill | Pictogram | 4–5 Keyword Chips (from CV) |
|---|-------|-----------|------------------------------|
| 1 | **Energy Modeling** | `energy modeling.png` | `UBEM & BEM` · `EnergyPlus` · `Rhino/Grasshopper` · `TUBITAK 1001 Project` · `Energy & Buildings (Q1)` |
| 2 | **Deep Learning** | `deep learning.png` | `TensorFlow / PyTorch` · `Time-Series & Transformers` · `Graph Neural Networks` · `Occupancy Modeling` · `Computer Vision` |
| 3 | **Cloud Computing** | `cloud computing.png` | `TRUBA (Turkish HPC)` · `Calcul Québec` · `HPC Workflows` · `Large-Scale Simulation` · `Building-Stock Modeling` |
| 4 | **Academic Writing** | `academic writing.png` | `Q1 Journal Articles` · `Peer Reviewer — Sci. Reports` · `24+ Publications` · `Best Student Paper` · `Grant Proposals` |
| 5 | **Project Management** | `project management.png` | `TUBITAK 1001 Lead` · `Research Funding` · `Team Mentoring (METU)` · `Intl. Collaboration` · `Newton Fund` |
| 6 | **Web Design** | `web design.png` | `LMN-Tool` · `Resilient Hab` · `Web Platform Development` · `Data Visualization` · `Interactive Tools` |

### Sourcing notes
- **Energy Modeling / Deep Learning / Academic Writing / Project Management** — all directly evidenced in the CV (UBEM, EnergyPlus, TensorFlow/PyTorch, GNN, Q1 journals, peer reviewer for *Scientific Reports*, TUBITAK 1001 lead, Newton Fund, mentoring at METU).
- **Cloud Computing** — confirmed by the user as the two **national HPC systems** used: **TRUBA** (Turkey's national high-performance computing grid) and **Calcul Québec** (Quebec's national HPC system), supporting large-scale building-stock simulation workflows.
- **Web Design** — confirmed by the user: **LMN-Tool** and **Resilient Hab**, the energy-modeling web platforms/tools developed (aligns with the Postdoc line *"Developed urban energy modeling software/web platform"*).

---

## Layout (Desktop) — ASCII Wireframe

Single row, 6 equal columns (`grid-template-columns: repeat(6, 1fr)`), max-width `1200px`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ← home                                                                       │
│                                                                               │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ [icon] │ │ [icon] │ │ [icon] │ │ [icon] │ │ [icon] │ │ [icon] │           │
│ │ Energy │ │ Deep   │ │ Cloud  │ │Academic│ │Project │ │  Web   │           │
│ │Modeling│ │Learning│ │Computng│ │Writing │ │ Mgmt   │ │ Design │           │
│ │────────│ │────────│ │────────│ │────────│ │────────│ │────────│           │
│ │ UBEM   │ │TF/PyT  │ │ TRUBA  │ │ Q1 art │ │TUBITAK │ │LMN-Tool│           │
│ │ E+     │ │ GNN    │ │ Calcul │ │Reviewer│ │ Funding│ │ResilHab│           │
│ │ Rhino  │ │ Time-S │ │ HPC    │ │ 24+ pub│ │ Mentor │ │ WebPlat│           │
│ │ TUBITAK│ │ Occ.   │ │ Large  │ │ Award  │ │ Intl.  │ │ DataViz│           │
│ │ E&B Q1 │ │ CV     │ │ Stock  │ │ Grants │ │ Newton │ │ Tools  │           │
│ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Column / Card Structure

```
┌──────────────────────┐
│      ┌────────┐       │
│      │  icon  │  64×64│   ← pictogram, greyscale → color on hover
│      └────────┘       │
│   Energy Modeling     │   ← skill name (Inter, bold)
│  ────────────────     │   ← thin divider
│  ┌────────────────┐   │
│  │ UBEM & BEM     │   │   ← keyword chips, stacked vertically
│  ├────────────────┤   │      (full-width outline pills, 4–5 each)
│  │ EnergyPlus     │   │
│  ├────────────────┤   │
│  │ Rhino/Grasshpr │   │
│  ├────────────────┤   │
│  │ TUBITAK 1001   │   │
│  ├────────────────┤   │
│  │ Energy&Bldgs Q1│   │
│  └────────────────┘   │
└──────────────────────┘
```

---

## Design Decisions

| Decision | Value |
|----------|-------|
| **Page style** | Single row of 6 skill cards (CSS Grid `repeat(6, 1fr)`) |
| **Max width** | `1200px` (matching the other section pages) |
| **Card style** | White, `border-radius: 24px`, subtle shadow, hover lift (`translateY(-4px)`) |
| **Theme/accent color** | **Yellow `rgba(253, 214, 4, 1)`** — matches the yellow skills tile |
| **Accent-dark (text/borders)** | Darker amber `rgba(168, 140, 0, 1)` — yellow is too light for text/thin lines on white |
| **Pictogram** | `64×64px`, centered, greyscale → full color + amber drop-shadow on hover |
| **Skill name** | Inter, 700 weight, centered, dark text |
| **Keyword chips** | Small full-width **outline pills**, stacked vertically (4–5 per card), amber border / muted text |
| **Divider** | Thin `2px` amber rule between the name and the chips |
| **Page title** | **None** — consistent with the title-less Education & Publications pages (easy to add a Caveat "skills" later if wanted) |
| **Background** | `rgba(248, 248, 246, 1)` — same as main site |
| **Body font** | Inter |
| **Back link** | Same `← home` style as the other section pages |
| **Animations** | `IntersectionObserver` fade-in / slide-up, staggered left → right |

---

## Responsive Plan

6 columns only fit comfortably on desktop. Graceful fallbacks:

| Viewport | Grid |
|----------|------|
| > 1024px | `repeat(6, 1fr)` — the requested single row |
| 768–1024px | `repeat(3, 1fr)` — 3 × 2 |
| 480–768px | `repeat(2, 1fr)` — 2 × 3 |
| < 480px | `1fr` — single column stack |

---

## Linking from Landing Page

The yellow tile on `index.html` (currently `<a href="#skills" class="tile tile--yellow" id="tile-skills">`) must be updated to point to `skills.html`.

---

## Project Files

All source files at root: `C:\Users\o_iseri\Desktop\myWebsıte\`

#### [NEW] [skills.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/skills.html)
- Back link `← home`
- A `skills-grid` with 6 skill cards
- Each card: pictogram, skill name, divider, 4–5 keyword chips

#### [NEW] [skills.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/skills.css)
- `--theme-color` yellow + `--theme-color-dark` amber
- `.skills-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: … }`
- `.skill-card`, `.skill-icon`, `.skill-name`, `.skill-chips`, `.skill-chip` styles
- Hover lift + greyscale-→-color icon
- Responsive breakpoints (6 → 3 → 2 → 1)

#### [NEW] [skills.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/skills.js)
- Direct copy of the `IntersectionObserver` fade-in pattern used by the other pages

#### [MODIFY] [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/index.html)
- Update yellow tile `href` from `#skills` → `skills.html`

---

## Content Assets

- Pictograms: the 6 PNGs in `content/skills/`
- Keyword evidence: `content/about me/CV/CV_OrcunKoralISERI_AC.pdf`

---

## File Organization

- **Source files** (`.html`, `.css`, `.js`): `C:\Users\o_iseri\Desktop\myWebsıte\`
- **Content assets** (pictograms): `C:\Users\o_iseri\Desktop\myWebsıte\content\skills\`
- **Documentation** (plans, walkthroughs): `C:\Users\o_iseri\Desktop\myWebsıte\docs_implementationPlan\skills\`

---

## Verification Plan

### Manual Verification
- Click the yellow "skills" tile on `index.html` → navigates to `skills.html`
- Desktop shows exactly **1 row × 6 columns**
- Each column shows the correct pictogram, skill name, and 4–5 keyword chips
- Pictograms color-in on hover; cards lift
- Scroll triggers the staggered fade-in
- Back link returns to `index.html`
- Responsive: collapses to 3 / 2 / 1 columns at the breakpoints above without overflow
