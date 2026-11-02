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
| Academic Writing | Q1 Journal Articles · Peer Reviewer — Sci. Reports · 30 Publications · Best Student Paper · Grant Proposals |
| Project Management | TUBITAK 1001 Lead · Research Funding · Team Mentoring (METU) · Intl. Collaboration · Newton Fund |
| Web Design | LMN-Tool · Resilient Hab · Web Platform Development · Data Visualization · Interactive Tools |

> Cloud Computing (TRUBA, Calcul Québec) and Web Design (LMN-Tool, Resilient Hab) keywords were confirmed directly by the user.

## Verification:
- Click the yellow Skills tile on the homepage — it should open the new page.
- Desktop shows exactly **1 row × 6 columns**, each with pictogram + name + 4–5 chips.
- Hover a card: it lifts, the pictogram colors in, chips brighten.
- Scroll to see the staggered left-to-right entrance.
- Resize to confirm the grid collapses to 3 / 2 / 1 columns cleanly.

---

## Update 2026-11-02 — "Skills & Tools" + website links

1. **Renamed** the page to **Skills & Tools**: the `<title>` and meta description, plus the landing tile label in `index.html` (`skills` → `skills & tools`).
2. **Section structure:** `<main class="skills-page">` now wraps two sections, each with a `.group-subheader` styled like the publications page:
   - **Skills · 6**: the same 6-card `.skills-grid`, unchanged.
   - **Tools & Websites · 2**: a new `.tools-grid` (2 columns, 1 column ≤768px) containing `.tool-card`s.
3. **Tool cards** (role pill: *Designer & Contributor*):
   - **NEXA-web** (formerly LMN-Tool): Neighbourhood Energy Planning & Decision-Support Platform → `https://nexa-rhlab.com/`
   - **Resilient Habitat Lab** website (Concordia) → `https://rhlab.encs.concordia.ca/` + `Tools page ↗` → `/tools.html`
4. **Web Design chips:** `LMN-Tool` → linked **NEXA-web ↗** chip and `Resilient Hab` → linked **Resilient Habitat Lab ↗** chip (`.skill-chip--link`).
5. The `skills.js` stagger still works, because each grid's children are cards only.

### Verified
- Rendered in headless Chrome at 1440px: 6-card row, then 2 tool cards side by side.
- At 320 and 390px: `scrollWidth` equals the viewport, so there's no horizontal overflow, and the tool cards stack.
- `rhlab.encs.concordia.ca` returns 200.

### Known issue: nexa-rhlab.com unreachable (2026-11-02)
- `carolinehvermette.github.io/NEXA-Web/` 301-redirects to `nexa-rhlab.com` (a GitHub Pages custom domain).
- The domain (registered 2026-10-13 at Namecheap) resolves to `198.54.117.242`, which serves Namecheap's **"Registrant WHOIS contact information verification"** page. HTTPS is refused.
- **Fix:** the domain owner must verify the registrant email in Namecheap. After that, DNS goes back to the GitHub Pages records; then re-tick "Enforce HTTPS" in the repo's Pages settings.
- The links on this site need no change once that's done.

## Update 2026-11-02 (2): OpenUBEM
- Added **OpenUBEM** (`github.com/orcunkoraliseri/OpenUBEM`), the owner's open-source UBEM platform, as the first card in Tools & Websites. Its role pill is *Creator & Developer*; it has tech tags (Python, EnergyPlus, OpenStreetMap, 3D Viewer) and a `View on GitHub ↗` button. The description is taken from the repo README.
- Added a linked **OpenUBEM ↗** chip at the top of the Energy Modeling card.
- The tools grid is now **3 columns** on desktop (cards stacked vertically, buttons pinned to the bottom), 1 column with a row layout at ≤1024px, and stacked at ≤768px.
- Verified: desktop render at 1440px; no horizontal overflow at 320 and 390px.
- **Deployed** in commit `36377f5` and confirmed live at www.orcunkoraliseri.com/skills.html.
