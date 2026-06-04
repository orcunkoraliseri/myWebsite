# Personal Website — Landing Page (6-Rectangle Grid)

A modern, minimalist landing page featuring 6 vibrant colored rectangles in a 3×2 grid. Each rectangle acts as a navigation tile — on hover, handwritten-style text gracefully appears to reveal the section name. The design prioritizes visual impact, simplicity, and a premium feel. All source files are located in the `References` directory.

## Design Interpretation

The 6 rectangles map to these sections and colors:

| Position | Color | RGB | Section Label |
|----------|-------|-----|---------------|
| Top-Left | Orange | `rgba(240, 95, 51)` | about me |
| Top-Center | Magenta | `rgba(180, 4, 149)` | experience |
| Top-Right | Cyan | `rgba(20, 199, 222)` | education |
| Bottom-Left | Green | `rgba(48, 218, 119)` | publications |
| Bottom-Center | Blue | `rgba(53, 152, 219)` | blog |
| Bottom-Right | Yellow | `rgba(253, 214, 4)` | skills |

## Design Specs & User Decisions

* **Page Layout**: Purely the 6 interactive rectangles grid with no headers, titles, or other branding text on the starting page.
* **Typography**: Google Font **Caveat** is used for the handwriting look.
* **Background Color**: Clean off-white canvas using `rgba(248, 248, 246, 1)`.
* **Contrast Adjustments**: Lighter tiles (yellow, cyan, green, salmon/orange) use a dark ink text color (`#1a1a24`). Saturated tiles (magenta, blue) use white text (`#ffffff`) for optimal contrast and readability.

## Project Structure

All source documents are stored under `C:\Users\o_iseri\Desktop\myWebsıte\References`.

#### [index.html](file:///c:/Users/o_iseri/Desktop/myWebsıte/References/index.html)
- Main interactive 3x2 grid structure with `<main>` container and six `<a>` tags.
- Includes SEO viewport, meta description, and handles the Google Fonts stylesheet link.

#### [styles.css](file:///c:/Users/o_iseri/Desktop/myWebsıte/References/styles.css)
- Styles the viewport body with the background `rgba(248, 248, 246, 1)`.
- Defines CSS Grid rules for desktop (3 columns, 2 rows), tablets (2 columns, 3 rows), and mobile (1 column, 6 rows).
- Embeds individual color styling variables for each grid element.
- Configures hover animations: card lift (`translateY(-8px)`), scaling (`1.03x`), box-shadow adjustments, and smooth text reveal.
- Handles page load entry transitions where cards fade and slide up sequentially (staggered delay rules).

#### [script.js](file:///c:/Users/o_iseri/Desktop/myWebsıte/References/script.js)
- Adds a class `loaded` on DOM completion to trigger the CSS transition entrance cascade.
- Applies a desktop-only 3D mouse parallax tilt effect (`perspective` with dynamic `rotateX` and `rotateY`).
- Implements mobile touch fallback: a tap reveals the text label first and prevents premature link redirection.

#### [package.json](file:///c:/Users/o_iseri/Desktop/myWebsıte/References/package.json)
- Configures `npm start` to run a local web server utilizing `http-server` on port 3000.

## Verification Plan

### Manual Verification
- Open `index.html` in a web browser.
- Verify all 6 rectangles render in the grid with their correct updated colors (specifically yellow for skills).
- Hover each tile and confirm that lowercase labels smoothly fade in.
- Test responsive breakpoints (desktop grid vs tablet/mobile stack).
- Verify mobile touchscreen tap behaviors.
