# Experience Page Walkthrough

The Experience page has been fully implemented based on the provided CV data and design plan!

## What was completed:

1. **Created `experience.html`**
   - Implemented a clean, vertically-stacked layout matching the existing site aesthetic (Inter font, 1200px max width).
   - Embedded the 7 provided timeline entries directly from the CSV into individual cards.
   - Used the correct icons based on role (`teacher.png` for teaching roles, `reseacher.png` for research roles).
   - Added a "Back to Home" button.

2. **Created `experience.css`**
   - Styled the experience cards with flexbox for a neat side-by-side icon/content split.
   - Added interactive hover effects (cards slightly float upward, left border turns orange, and icons shift from greyscale to full color).
   - Styled the role and focus tags cleanly in the headers.
   - Made the design fully responsive—on mobile devices, the icons gracefully stack above the content.

3. **Created `experience.js`**
   - Added an `IntersectionObserver` to trigger a smooth fade-in and slide-up animation as you scroll down through the experience timeline, keeping the page feeling dynamic and alive.

4. **Updated `index.html`**
   - Modified the "Experience" tile on the homepage to point to `experience.html` instead of `#experience`.

## Verification:
- Go to the homepage and click the Experience tile—it should take you straight to the new page.
- Scroll down the new page to see the smooth entrance animations.
- Hover over any card to see the interaction (lift + color shift).
- Try resizing the window to see how nicely it adapts to mobile sizes.
