# Education Page Walkthrough

The Education page has been fully implemented based on the CV data and the v1 implementation plan!

## What was completed:

1. **Created `education.html`**
   - Implemented the same clean, vertically-stacked card layout as the Experience page (Inter font, 1200px max width).
   - Embedded all 5 education entries directly from `OrcunKoralIseri_Education.csv` into individual cards, newest first (Doctorate → MSc → Bachelor → Online Education → High School).
   - Every card uses the shared `content/education/Education.png` book-and-lightbulb infographic.
   - Added a `Education` page title (Caveat font) and a "← home" back link.
   - Promoted the recurring "100% scholarship" note to a `🏅 100% Scholarship` badge on the MSc, Bachelor, and High School cards.
   - Italicized thesis titles for the Doctorate and MSc entries.
   - Undated entries (Online Education, High School) render a muted `—` in the timeline slot.

2. **Created `education.css`**
   - Forked from `experience.css` with the theme color switched to the **cyan** of the education tile (`rgba(20, 199, 222, 1)`).
   - Because cyan is light, the degree pill uses **dark text** for contrast, and a slightly darker cyan (`rgba(13, 145, 162, 1)`) is used for the page title and back-link hover.
   - Added a subtle `.scholarship-pill` highlight style.
   - Card hover effects match Experience: lift (`translateY(-3px)`), cyan left border, and the icon shifts from greyscale to full color.
   - Fully responsive — on screens under 768px the icon stacks above the content and the header collapses to a column.

3. **Created `education.js`**
   - Reused the Experience page's `IntersectionObserver` for smooth fade-in / slide-up entrance animations as the user scrolls.

4. **Updated `index.html`**
   - Changed the cyan "education" tile `href` from `#education` to `education.html`.

## Verification:
- Go to the homepage and click the cyan Education tile — it should open the new page.
- Confirm all 5 cards appear in order, each with the book-and-lightbulb icon.
- Scroll down to see the entrance animations.
- Hover over any card to see the lift + cyan border + icon color-in.
- Check that scholarship badges appear only on MSc, Bachelor, and High School.
- Resize the window to confirm the mobile (stacked) layout works.
