// Mobile preview screenshot tool.
// Renders each page at a real phone viewport and saves full-page PNGs so we can
// SEE the mobile layout and iterate on it. Run: node tools/mobile-shot.js [tag]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const tag = process.argv[2] || 'before';
const outDir = path.join(__dirname, '..', 'mobile-shots', tag);
fs.mkdirSync(outDir, { recursive: true });

// iPhone 13 / 14 logical viewport. deviceScaleFactor 2 = crisp retina capture.
const VIEWPORT = { width: 390, height: 844 };

const PAGES = [
  ['index', '/index.html'],
  ['about', '/about.html'],
  ['experience', '/experience.html'],
  ['education', '/education.html'],
  ['publications', '/publications.html'],
  ['skills', '/skills.html'],
  ['blog', '/blog.html'],
  ['blog-post', '/content/blog/posts/11-june-2017-day-1-about-me.html'],
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();

  for (const [name, url] of PAGES) {
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30000 });
      // Let scroll-reveal animations settle so cards aren't captured mid-fade.
      await page.waitForTimeout(400);
      await page.evaluate(() =>
        document.querySelectorAll('.hidden-section').forEach((e) =>
          e.classList.add('show-section')
        )
      );
      await page.waitForTimeout(300);
      const file = path.join(outDir, `${name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`OK  ${name}  -> ${file}`);
    } catch (e) {
      console.log(`ERR ${name}: ${e.message}`);
    }
  }

  await browser.close();
})();
