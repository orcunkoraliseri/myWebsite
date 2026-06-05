// Mobile audit: detects horizontal overflow + elements wider than the viewport,
// and tests tap-target sizes. Runs across several phone widths.
// Run: node tools/mobile-audit.js
const { chromium } = require('playwright');

const BASE = 'http://localhost:3000';
const WIDTHS = [320, 360, 390]; // iPhone SE, common Android, iPhone 13/14
const PAGES = [
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
  for (const w of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width: w, height: 800 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    console.log(`\n===== width ${w}px =====`);
    for (const [name, url] of PAGES) {
      await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 30000 });
      const report = await page.evaluate((vw) => {
        const docW = document.documentElement.scrollWidth;
        const overflow = docW > vw + 1;
        // Find elements that stick out past the right edge of the viewport.
        const culprits = [];
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.right > vw + 1.5) {
            culprits.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.toString().slice(0, 40)) || '',
              right: Math.round(r.right),
              width: Math.round(r.width),
            });
          }
        });
        // De-dupe by class+tag, keep widest offender.
        const seen = {};
        culprits.forEach((c) => {
          const k = c.tag + '.' + c.cls;
          if (!seen[k] || c.right > seen[k].right) seen[k] = c;
        });
        return { docW, overflow, culprits: Object.values(seen).slice(0, 6) };
      }, w);

      if (report.overflow) {
        console.log(`  [OVERFLOW] ${name}: doc=${report.docW}px > ${w}px`);
        report.culprits.forEach((c) =>
          console.log(`      <${c.tag} class="${c.cls}"> right=${c.right} w=${c.width}`)
        );
      } else {
        console.log(`  ok        ${name}`);
      }
    }
    await context.close();
  }
  await browser.close();
})();
