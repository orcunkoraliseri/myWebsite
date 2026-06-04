#!/usr/bin/env node
/*
 * localize-blog-images.js — Downloads every blogger.googleusercontent.com image
 * referenced by the 46 posts into content/blog/posts/img/, and writes
 * content/blog/posts/img-map.json ({ "<remoteUrl>": "<localFile>" }).
 *
 * Maps BOTH the displayed <img src> (display resolution) and its wrapping
 * <a href> (full resolution link) to the same downloaded display image, so
 * inline images and click-to-enlarge both work offline.
 *
 * Run AFTER which: node tools/build-blog.js  (it picks up img-map.json).
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const FEED = path.join(ROOT, 'content', 'blog', 'Blogs', 'Personal Blog', 'feed.atom');
const IMG_DIR = path.join(ROOT, 'content', 'blog', 'posts', 'img');
const MAP_FILE = path.join(ROOT, 'content', 'blog', 'posts', 'img-map.json');

const HOST = 'blogger.googleusercontent.com';

function decodeEntities(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

const raw = fs.readFileSync(FEED, 'utf8');
const entries = raw.split('<entry>').slice(1);

const imgUrls = new Set();          // <img src> urls to download
const hrefToImg = {};               // anchor href -> the img src it wraps

for (const e of entries) {
  if ((e.match(/<blogger:type>([A-Z]+)<\/blogger:type>/) || [])[1] !== 'POST') continue;
  const content = decodeEntities((e.match(/<content type=['"]html['"]>([\s\S]*?)<\/content>/) || [])[1] || '');
  // anchor-wrapped images: pair href -> img src
  for (const m of content.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>\s*<img\s+[^>]*src="([^"]+)"/gi)) {
    if (m[2].includes(HOST)) { imgUrls.add(m[2]); if (m[1].includes(HOST)) hrefToImg[m[1]] = m[2]; }
  }
  // all images
  for (const m of content.matchAll(/<img\s+[^>]*src="([^"]+)"/gi)) {
    if (m[1].includes(HOST)) imgUrls.add(m[1]);
  }
}

console.log(`Unique images to download: ${imgUrls.size}`);
fs.mkdirSync(IMG_DIR, { recursive: true });

const map = {};
const urlToFile = {};
const usedNames = new Set();
let i = 0, ok = 0, fail = 0;

function fileNameFor(url) {
  let seg = url.split('?')[0].split('/').filter(Boolean).pop() || 'image';
  seg = seg.replace(/[^a-zA-Z0-9._-]/g, '_');
  if (!/\.(jpe?g|png|gif|webp)$/i.test(seg)) seg += '.jpg';
  // cap length (Windows MAX_PATH) — keep extension
  const extM = seg.match(/(\.[a-z0-9]+)$/i);
  const ext = extM ? extM[1] : '';
  let stem = ext ? seg.slice(0, -ext.length) : seg;
  if (stem.length > 50) stem = stem.slice(0, 50);
  seg = stem + ext;
  let name = seg, n = 2;
  while (usedNames.has(name.toLowerCase())) {
    name = seg.replace(/(\.[a-z0-9]+)$/i, `-${n++}$1`);
  }
  usedNames.add(name.toLowerCase());
  return name;
}

for (const url of imgUrls) {
  i++;
  const file = fileNameFor(url);
  const dest = path.join(IMG_DIR, file);
  // Pass a repo-relative forward-slash path; the absolute path contains a non-ASCII
  // char ("ı" in myWebsıte) that MSYS curl mangles. cwd:ROOT makes it resolve.
  const relDest = `content/blog/posts/img/${file}`;
  try {
    execFileSync('curl', ['-sS', '-L', '-m', '40', '-o', relDest, url], { cwd: ROOT, stdio: ['ignore', 'ignore', 'pipe'] });
    const sz = fs.statSync(dest).size;
    if (sz < 100) throw new Error('too small (' + sz + ' bytes)');
    urlToFile[url] = file;
    map[url] = file;
    ok++;
    if (i % 20 === 0 || i === imgUrls.size) console.log(`  [${i}/${imgUrls.size}] ok=${ok} fail=${fail}`);
  } catch (err) {
    fail++;
    try { fs.unlinkSync(dest); } catch {}
    console.log(`  FAIL ${file}: ${String(err.message || err).slice(0, 80)}`);
  }
}

// map anchor hrefs to the same local file as the image they wrap
for (const [href, img] of Object.entries(hrefToImg)) {
  if (urlToFile[img]) map[href] = urlToFile[img];
}

fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 0), 'utf8');
console.log(`\nDownloaded ${ok} images (${fail} failed). Map entries: ${Object.keys(map).length}`);
console.log(`Wrote ${path.relative(ROOT, MAP_FILE)}`);
