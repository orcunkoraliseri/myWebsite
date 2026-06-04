# Skills Page Walkthrough

The Skills page has been fully implemented based on the v1 implementation plan!

## What was completed:

1. **Created `skills.html`**
   - A single-row, **6-column** grid of skill cards (Inter font, 1200px max width, "← home" back link).
   - Each card: pictogram (from `content/skills/`), skill name, a thin divider, and **4–5 keyword chips** sourced from the CV.
   - The 6 skills, left → right: **Energy Modeling · Deep Learning · Cloud Computing · Academic Writing · Project Management · Web Design**.

2. **Created `skills.css`**
   - Yellow theme (`rgba(253, 214, 4, 1)`) to match the skills tile, with a **darker amber** (`rgba(168, 140, 0, 1)`) for the divider, borders, and hover accents — since pure yellow is too light to read on white.
   - `.skills-grid { grid-template-columns: repeat(6, 1fr) }` for the requested single row.
   - Cards lift on hover, the pictogram shifts greyscale → full color (with a subtle scale-up), and the keyword chips brighten.
   - Keyword chips are full-width outline pills stacked vertically inside each column.
   - Responsive: **6 → 3 → 2 → 1** columns at 1024 / 768 / 480px.

3. **Created `skills.js`**
   - `IntersectionObserver` entrance animation with a **staggered left-to-right delay** (each card fades/slides in 0.08s after the previous).

4. **Updated `index.html`**
   - Changed the yellow "skills" tile `href` from `#skills` to `skills.html`.

## Keyword chips (CV-sourced)

| Skill | Chips |
|-------|-------|
| Energy Modeling | UBEM & BEM · EnergyPlus · Rhino/Grasshopper · TUBITAK 1001 Project · Energy & Buildings (Q1) |
| Deep Learning | TensorFlow/PyTorch · Time-Series & Transformers · Graph Neural Networks · Occupancy Modeling · Computer Vision |
| Cloud Computing | TRUBA (Turkish HPC) · Calcul Québec · HPC Workflows · Large-Scale Simulation · Building-Stock Modeling |
| Academic Writing | Q1 Journal Articles · Peer Reviewer — Sci. Reports · 24+ Publications · Best Student Paper · Grant Proposals |
| Project Management | TUBITAK 1001 Lead · Research Funding · Team Mentoring (METU) · Intl. Collaboration · Newton Fund |
| Web Design | LMN-Tool · Resilient Hab · Web Platform Development · Data Visualization · Interactive Tools |

> Cloud Computing (TRUBA, Calcul Québec) and Web Design (LMN-Tool, Resilient Hab) keywords were confirmed directly by the user.

## Verification:
- Click the yellow Skills tile on the homepage — it should open the new page.
- Desktop shows exactly **1 row × 6 columns**, each with pictogram + name + 4–5 chips.
- Hover a card: it lifts, the pictogram colors in, chips brighten.
- Scroll to see the staggered left-to-right entrance.
- Resize to confirm the grid collapses to 3 / 2 / 1 columns cleanly.
