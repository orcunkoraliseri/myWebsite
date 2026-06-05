// Desktop regression probe: captures each in-scope page at desktop width, and
// specifically tests whether forcing body{display:block} changes the desktop view.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const outDir = path.join(__dirname, '..', 'mobile-shots', 'desktop');
fs.mkdirSync(outDir, { recursive: true });

const PAGES = [
  ['about', '/about.html'],
  ['experience', '/experience.html'],
  ['education', '/education.html'],
  ['publications', '/publications.html'],
  ['skills', '/skills.html'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const [name, url] of PAGES) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.evaluate(() => document.querySelectorAll('.hidden-section').forEach(e => e.classList.add('show-section')));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${name}-current.png`) });
  }

  // The critical test: does body{display:block} alter the DESKTOP about page?
  await page.goto(BASE + '/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.evaluate(() => document.querySelectorAll('.hidden-section').forEach(e => e.classList.add('show-section')));
  const before = await page.evaluate(() => {
    const m = document.querySelector('.about-container').getBoundingClientRect();
    const cs = getComputedStyle(document.body);
    return { containerLeft: Math.round(m.left), containerWidth: Math.round(m.width), bodyDisplay: cs.display, scrollH: document.documentElement.scrollHeight };
  });
  await page.evaluate(() => { document.body.style.display = 'block'; });
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, 'about-with-block.png') });
  const after = await page.evaluate(() => {
    const m = document.querySelector('.about-container').getBoundingClientRect();
    return { containerLeft: Math.round(m.left), containerWidth: Math.round(m.width), scrollH: document.documentElement.scrollHeight };
  });

  console.log('DESKTOP about.html (1440px wide):');
  console.log('  current  :', JSON.stringify(before));
  console.log('  +block   :', JSON.stringify(after));
  console.log('  container moved?', before.containerLeft !== after.containerLeft || before.containerWidth !== after.containerWidth);
  console.log('  page height changed?', before.scrollH !== after.scrollH);

  await browser.close();
})();
