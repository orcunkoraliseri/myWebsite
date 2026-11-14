# Publications Page Walkthrough

The Publications page has been fully implemented based on the v1 implementation plan!

## What was completed:

1. **Created `publications.html`**
   - Same card layout as the Experience / Education pages (Inter font, 1200px max width, "← home" back link).
   - **Awards** section (top): 2 cards from `awards.txt` — Best Student Paper (2020, SIMAUD) and Young CAADRIA Award (2022, POST-CARBON) — each with the `award.png` rosette icon.
   - **Publications** section: all 24 entries from `publications_OrcunKoralIseri.csv`, grouped with sub-headers and counts:
     - Journals · 9
     - Book Chapters · 1
     - Conference Proceedings · 14
   - Every card has a type-based icon in the left column: `academic paper.png` for journals & book chapters, `conference.png` for conference proceedings.
   - Within each group, entries are sorted newest-first; the two "Under Evaluation" journals sort to the top with a `⏳ Under Evaluation` badge in place of a year.
   - The owner's name (`Iseri, O. K.` / `Iseri, O.K.`) is **bolded** inside every author list.

2. **Created `publications.css`**
   - Forked from `experience.css` with the theme color switched to the **green** of the publications tile (`rgba(48, 218, 119, 1)`); a darker green (`rgba(22, 145, 75, 1)`) is used for headers, the back-link hover, and the DOI button text.
   - Green is light, so type/award pills use **dark text** for contrast (matching the landing tile).
   - Added `.group-subheader` (with count), `.status-badge` (Under Evaluation), and `.doi-btn` styles.
   - Publication cards use slightly denser padding than awards to keep the long list compact.
   - Hover effects match the other pages: lift, green left border, icon greyscale → color.
   - Fully responsive — under 768px cards stack and headers collapse to a column.

3. **Created `publications.js`**
   - Reused the `IntersectionObserver` fade-in / slide-up entrance animation.

4. **Updated `index.html`**
   - Changed the green "publications" tile `href` from `#articles` to `publications.html`.

## DOI handling
- `DOI ↗` buttons (open in a new tab) appear only on entries with a link.
- Bare DOIs from the CSV (e.g. `10.4018/IJDIBE.301244`) were normalized to full `https://doi.org/…` URLs.
- `N/A` rows show no button. In total **9 entries have links** (7 journals, 1 book chapter, 1 conference); the remaining 17 do not.

## Verification:
- Click the green Publications tile on the homepage — it should open the new page.
- Confirm Awards shows 2 cards, then Publications with groups counted 9 / 1 / 14 (24 total).
- Check each card's type icon, bold title, and the bolded `Iseri, O. K.` in authors.
- Click a `DOI ↗` button → opens the correct DOI in a new tab.
- Confirm the two "Under Evaluation" journals appear at the top of the Journals group with the status badge.
- Hover any card (lift + green border + icon color-in); scroll to see entrance animations.
- Resize to confirm the mobile (stacked) layout works.

---

# Publications & Google Scholar Sync Walkthrough (2026-11-14)

## What changed

1. **Google Scholar Citation Metrics (`publications.html`, `publications.css`):**
   - Refreshed from live Scholar profile (`user=s4l2zioAAAAJ`): Citations `237` (All) / `230` (Since 2021), `h-index: 7 / 7`, `i10-index: 7 / 7`.
   - Updated 7-year bar chart (`2020–2026`, scale `180px = 68`): `2024: 26` (`--bar-h: 69px`), `2025: 66` (`--bar-h: 175px`), with `2020 (4)`, `2021 (20)`, `2022 (29)`, `2023 (21)`, and `2026 (68)` preserved.
   - Added `<th scope="col">` headers with a `.visually-hidden` metric column header and `role="img"` / `aria-label` summary on `.chart-bars` (plus `.visually-hidden` utility in `publications.css`).

2. **Journals (`Journals · 20`):**
   - **`⏳ Under Evaluation` (8):** Kept Journal 2, Journal 3, Journal 6, and Journal 7; updated **2J** (*Residential electricity load shape under changing occupancy...*, *Energy and Buildings*) and **3J** (*Survey-Based Occupancy Schedules in Mixed-Use Towers...*, *Energy Efficiency*); added **5J** (*An occupancy-aware EnergyPlus surrogate for two real residential districts, scored on the effect of the household*, *Building and Environment*) and **6J** (*Harmonised time-use diaries from nine countries as household heat gains in six urban building energy models*, *Building Simulation*).
   - **`🛠️ In Preparation` (3):** Kept **4J** (`HETUS-Wide Occupancy Generation...`), added **7J** (*Twenty years of American time use for occupancy and energy*), and added **OpenUBEM** (*OpenUBEM: An Open-Source, Parameter-Free Urban Building Energy Modeling Platform*).
   - **Published (9):** Added *Sustainable Cities and Society* (2025, `10.1016/j.scs.2025.106500`) alongside the 8 existing published journals.

3. **Conference Proceedings (`Conference Proceedings · 16`):**
   - Added **CISBAT 2027** (`8J`: *Home or office? Energy and emissions of a hybrid work day in two Canadian mixed-use towers*) with `⏳ Under Evaluation` at the top of the group.
   - Added **eSim 2026** (*Longitudinal Analysis of Occupancy-Driven Energy Demand in Canadian Residential Buildings (2005–2025)*, DOI `10.26868/31114504.2026.30`).

4. **Cross-file Sync (`skills.html`, `Prompt/MANAGER_PROMPT.md`):**
   - Updated the Academic Writing link chip in `skills.html` from `30 Publications ↗` to `37 Publications ↗` (`20 + 1 + 16 = 37`).
   - Updated `Prompt/MANAGER_PROMPT.md` (§3, §4, §9, §10 Session Log).

## Verification Performed (2026-11-14)
- **DOM card & link audit (Python + BeautifulSoup):** Verified `Awards · 2` (`2` `.award-card`s), `Journals · 20` (`20` `.pub-card`s), `Book Chapters · 1` (`1` `.pub-card`), `Conference Proceedings · 16` (`16` `.pub-card`s), total `37` `.pub-card`s, and `skills.html` chip `37 Publications ↗`.
- **Headless Chrome (`1440×1400` / `1440×1200` desktop & `390px` iframe mobile over `python3 -m http.server 3011`):**
  - Visually inspected desktop screenshots (`pub_desktop.png`, `skills_desktop.png`) and mobile screenshot (`pub_mobile_390.png`).
  - Mobile overflow check returned zero horizontal overflow (`pub_scrollWidth: 390`, `pub_overflow: false`, `skills_scrollWidth: 390`, `skills_overflow: false`) and mobile progressive disclosure toggles `["▾ Show all 20", "▾ Show all 16"]`.
