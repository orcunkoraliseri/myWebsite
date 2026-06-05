// Preview the proposed mobile changes WITHOUT editing any site file.
// preview.css + preview.js are injected into each live page at render time.
//   - mobile render  -> shows the optimized layout
//   - desktop render -> must look identical to current (CSS is mobile-scoped,
//                       JS no-ops >768px). Proves the "desktop frozen" rule.
// Also re-runs the overflow audit WITH the preview applied.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const CSS = path.join(__dirname, 'preview', 'preview.css');
const JS = path.join(__dirname, 'preview', 'preview.js');
const shotDir = (t) => { const d = path.join(__dirname, '..', 'mobile-shots', t); fs.mkdirSync(d, { recursive: true }); return d; };

const PAGES = [
  ['about', '/about.html'],
  ['experience', '/experience.html'],
  ['education', '/education.html'],
  ['publications', '/publications.html'],
  ['skills', '/skills.html'],
  ['blog', '/blog.html'],
  ['blog-post', '/content/blog/posts/11-june-2017-day-1-about-me.html'],
];
const DESKTOP_PAGES = PAGES.filter(([n]) => !n.startsWith('blog')); // compare vs *-current baselines

async function prep(page) {
  await page.evaluate(() => document.querySelectorAll('.hidden-section').forEach((e) => e.classList.add('show-section')));
  await page.addStyleTag({ path: CSS });
  await page.addScriptTag({ path: JS }); // guarded: runs only if viewport <=768px
  await page.waitForTimeout(350);
}

(async () => {
  const browser = await chromium.launch();

  // 1) Mobile preview screenshots (390px)
  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mctx.newPage();
  const mDir = shotDir('preview-mobile');
  for (const [name, url] of PAGES) {
    await mp.goto(BASE + url, { waitUntil: 'networkidle' });
    await prep(mp);
    await mp.screenshot({ path: path.join(mDir, `${name}.png`), fullPage: true });
    console.log(`mobile   ${name}`);
  }
  await mctx.close();

  // 2) Desktop preview screenshots (1440px) — should equal mobile-shots/desktop/*-current.png
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const dp = await dctx.newPage();
  const dDir = shotDir('preview-desktop');
  for (const [name, url] of DESKTOP_PAGES) {
    await dp.goto(BASE + url, { waitUntil: 'networkidle' });
    await prep(dp);
    await dp.screenshot({ path: path.join(dDir, `${name}-with-preview.png`) });
    console.log(`desktop  ${name}`);
  }
  await dctx.close();

  // 3) Overflow audit WITH preview applied (proves Phase 1 fix)
  console.log('\n--- overflow audit WITH preview injected ---');
  for (const w of [320, 360, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: true });
    const p = await ctx.newPage();
    console.log(`  width ${w}px:`);
    for (const [name, url] of PAGES) {
      await p.goto(BASE + url, { waitUntil: 'networkidle' });
      await p.addStyleTag({ path: CSS });
      await p.addScriptTag({ path: JS });
      const r = await p.evaluate((vw) => ({ docW: document.documentElement.scrollWidth, over: document.documentElement.scrollWidth > vw + 1 }), w);
      console.log(`    ${r.over ? 'OVERFLOW' : 'ok      '} ${name}  (doc ${r.docW}px)`);
    }
    await ctx.close();
  }

  await browser.close();
})();
