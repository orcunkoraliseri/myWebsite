# Walkthrough: Personal Website Landing Page

We successfully built a modern, minimalist, and highly interactive landing page for your personal website based on your sketch. The page features a gorgeous 3×2 grid of six colored rectangles that display handwritten labels upon hover.

## Changes Made

### 1. Created Project Files
All project files are saved under **`C:\Users\o_iseri\Desktop\myWebsıte\References`**:
* **[index.html](file:///C:/Users/o_iseri/Desktop/myWebsıte/References/index.html)**: Sets up the structural HTML markup.
  * Embeds the Google Font families **Inter** (for UI/fallback) and **Caveat** (for the beautiful handwriting style).
  * Outlines a clean `<main>` container with six semantic `<a>` blocks (tiles) mapping to your site's sections.
* **[styles.css](file:///C:/Users/o_iseri/Desktop/myWebsıte/References/styles.css)**: Implements styling and layout.
  * Uses a clean off-white background: `rgba(248, 248, 246, 1)`.
  * Generates a 3×2 CSS Grid layout on desktop, shrinking down to 2×3 on tablets, and 1×6 vertical stack on mobile.
  * Applies your exact RGB colors for the tiles with a premium subtle gloss gradient overlay.
  * Controls the hover reveal transition: labels start at `opacity: 0` with a slight offset, and smoothly fade/translate in on hover.
  * Individual text color styling ensures maximum contrast (e.g. white text for dark tiles, dark ink text for light/yellow tiles).
* **[script.js](file:///C:/Users/o_iseri/Desktop/myWebsıte/References/script.js)**: Orchestrates interactive visual enhancements.
  * **Staggered Entry**: On page load, tiles cascade fade-and-slide up one after the other.
  * **3D Mouse Tilt (Desktop)**: Adds a subtle mouse-tracking parallax effect when a cursor hovers over a tile (temporarily turning off transition lag for raw tracking response).
  * **Mobile Tap-to-Reveal**: Handles touchscreen devices gracefully. Tapping a card reveals the label first, preventing accidental navigation until a second tap.
* **[package.json](file:///C:/Users/o_iseri/Desktop/myWebsıte/References/package.json)**: Bundles basic scripts to serve the folder locally.

---

## Interactive Details

| Property | Value / Behavior |
|---|---|
| **Background Color** | `rgba(248, 248, 246, 1)` (Off-white canvas) |
| **Orange Tile** | `rgba(240, 95, 51)` ➔ White text: *"about me"* |
| **Magenta Tile** | `rgba(180, 4, 149)` ➔ White text: *"experience"* |
| **Cyan Tile** | `rgba(20, 199, 222)` ➔ Charcoal ink text: *"education"* |
| **Green Tile** | `rgba(48, 218, 119)` ➔ Charcoal ink text: *"publications"* |
| **Blue Tile** | `rgba(53, 152, 219)` ➔ White text: *"blog"* |
| **Yellow Tile** | `rgba(253, 214, 4)` ➔ Charcoal ink text: *"skills"* |
| **Hover Effect** | Card scales up (`1.03x`), shifts up (`8px`), increases shadow depth, and reveals the label. |
| **Tilt Sensitivity** | Max `6deg` rotation depending on where the mouse cursor sits on the card. |

---

## Local Verification

To run and preview the site on your computer, you have two options:

### Option A: Double-Click (Zero Setup)
Simply navigate to your workspace references folder: `C:\Users\o_iseri\Desktop\myWebsıte\References` and double-click **`index.html`**. It will open instantly in any web browser and support all interactions.

### Option B: Local Web Server (Recommended)
If you have Node.js installed, open a command prompt in your workspace references folder and run:
```bash
npm start
```
This serves the project locally at `http://localhost:3000`.
