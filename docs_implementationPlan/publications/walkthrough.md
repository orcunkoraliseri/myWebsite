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
