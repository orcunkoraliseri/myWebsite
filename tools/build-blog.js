#!/usr/bin/env node
/*
 * build-blog.js — Generates the blog index (blog.html) and one HTML page per
 * generated post (content/blog/posts/<slug>.html) from the Blogger Atom export,
 * safely merging hand-written posts from content/blog/extra-posts.json.
 *
 * Usage:  node tools/build-blog.js
 *
 * Source feed:  content/blog/Blogs/Personal Blog/feed.atom
 * Extra posts:  content/blog/extra-posts.json (handwritten: true preserves HTML)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const SITE_URL = 'https://www.orcunkoraliseri.com';
const FEED = path.join(ROOT, 'content', 'blog', 'Blogs', 'Personal Blog', 'feed.atom');
const EXTRA_FILE = path.join(ROOT, 'content', 'blog', 'extra-posts.json');
const POSTS_DIR = path.join(ROOT, 'content', 'blog', 'posts');
const THUMBS_DIR = path.join(POSTS_DIR, 'img', 'thumbs');
const IMG_MAP_FILE = path.join(POSTS_DIR, 'img-map.json');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function assetVer(relPath) {
  try {
    return crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, relPath))).digest('hex').slice(0, 8);
  } catch {
    return '1';
  }
}

const STYLES_VER = assetVer('styles.css');
const CSS_VER = assetVer('blog.css');
const JS_VER = assetVer('blog.js');
const MOBILE_CSS_VER = assetVer('mobile.css');
const MOBILE_JS_VER = assetVer('mobile.js');

// ---------- helpers ----------
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(iso) {
  const y = iso.slice(0, 4);
  const m = parseInt(iso.slice(5, 7), 10);
  const d = parseInt(iso.slice(8, 10), 10);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function stripDiacritics(s) {
  const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u', 'é': 'e', 'è': 'e' };
  return s.toLowerCase().replace(/[çğıöşüâîûéè]/g, c => map[c] || c).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function slugify(title, used) {
  const base = stripDiacritics(title).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'post';
  let slug = base;
  let i = 2;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
}

function normalizeContent(html, imgMap) {
  let h = html;
  h = h.replace(/^(\s*<p>\s*<\/p>\s*)+/i, '');
  h = h.replace(/\s+style=("[^"]*"|'[^']*')/gi, '');
  h = h.replace(/\s+class=("[^"]*"|'[^']*')/gi, '');
  h = h.replace(/\s+(?:width|height|border|imageanchor|data-original-width|data-original-height)=("[^"]*"|'[^']*')/gi, '');

  if (imgMap) {
    h = h.replace(/(<(?:img|a)[^>]*\b(?:src|href)=")([^"]+)(")/gi, (m, pre, url, post) => {
      const local = imgMap[url];
      return local ? `${pre}img/${local}${post}` : m;
    });
    h = h.replace(
      /(<a\b[^>]*\bhref=")https?:\/\/[^"]*googleusercontent[^"]*("[^>]*>\s*<img\b[^>]*\bsrc=")(img\/[^"]+)(")/gi,
      (m, p1, p2, local, p4) => `${p1}${local}${p2}${local}${p4}`
    );
    const localFiles = new Set(Object.values(imgMap));
    h = h.replace(
      /https?:\/\/[^"'\s<>]*googleusercontent[^"'\s<>]*\/([^/"'\s<>]+\.(?:jpe?g|png|gif|webp))/gi,
      (m, fname) => {
        let seg = decodeURIComponent(fname.replace(/\+/g, ' ')).replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = (seg.match(/(\.[a-z0-9]+)$/i) || [])[1] || '';
        let stem = ext ? seg.slice(0, -ext.length) : seg;
        if (stem.length > 50) stem = stem.slice(0, 50);
        seg = stem + ext;
        return localFiles.has(seg) ? `img/${seg}` : m;
      }
    );
  }

  // Ensure every <img> has an alt attribute; avoid lazy-loading the first image (LCP candidate)
  let imgIdx = 0;
  h = h.replace(/<img\b([^>]*?)(\s*\/?)>/gi, (m, attrs, slash) => {
    let out = attrs;
    if (imgIdx > 0 && !/\bloading=/i.test(out)) {
      out = ' loading="lazy"' + out;
    }
    if (!/\balt=/i.test(out)) {
      out = out + ' alt=""';
    }
    imgIdx++;
    return `<img${out}${slash}>`;
  });

  // Open external links in a new tab safely
  h = h.replace(/<a\s+href=("https?:[^"]*"|'https?:[^']*')/gi, '<a target="_blank" rel="noopener" href=$1');
  return h.trim();
}

function firstImageName(decodedContent, imgMap) {
  const m = decodedContent.match(/<img[^>]*\bsrc=["']([^"']+)["']/i);
  if (!m) return null;
  const url = m[1];
  if (imgMap && imgMap[url]) return { local: imgMap[url], url };
  return { local: null, url };
}

function resolveCardThumb(p, imgMap) {
  let fileName = p.thumb || null;
  let remoteUrl = null;
  if (!fileName && p.decoded) {
    const info = firstImageName(p.decoded, imgMap);
    if (info) {
      fileName = info.local;
      remoteUrl = info.url;
    }
  }
  if (fileName) {
    const stem = path.parse(fileName).name;
    const thumbFile = `${stem}.jpg`;
    if (fs.existsSync(path.join(THUMBS_DIR, thumbFile))) {
      return `content/blog/posts/img/thumbs/${thumbFile}`;
    }
    return `content/blog/posts/img/${fileName}`;
  }
  return remoteUrl;
}

// ---------- parse feed + extra posts ----------
const raw = fs.readFileSync(FEED, 'utf8');
const imgMap = fs.existsSync(IMG_MAP_FILE) ? JSON.parse(fs.readFileSync(IMG_MAP_FILE, 'utf8')) : null;
const extraPosts = fs.existsSync(EXTRA_FILE) ? JSON.parse(fs.readFileSync(EXTRA_FILE, 'utf8')) : [];

const entries = raw.split('<entry>').slice(1);
const used = new Set(extraPosts.map(p => p.slug));
const posts = [];

for (const e of entries) {
  const type = (e.match(/<blogger:type>([A-Z]+)<\/blogger:type>/) || [])[1];
  if (type !== 'POST') continue;
  const trashed = /<blogger:trashed>[^<]+<\/blogger:trashed>/.test(e);
  const status = (e.match(/<blogger:status>([A-Z_]+)<\/blogger:status>/) || [])[1] || 'LIVE';
  if (trashed || status === 'DRAFT') continue;

  const title = decodeEntities(
    ((e.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || '(untitled)').trim().replace(/\s+/g, ' ')
  );
  const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1] || '1970-01-01';
  const labels = [...e.matchAll(/<category\s+scheme='tag:blogger\.com[^']*'\s+term='([^']+)'/g)].map(m =>
    decodeEntities(m[1])
  );
  const rawContent = (e.match(/<content type=['"]html['"]>([\s\S]*?)<\/content>/) || [])[1] || '';
  const decoded = decodeEntities(rawContent);

  posts.push({ title, published, labels, decoded, handwritten: false });
}

posts.sort((a, b) => b.published.localeCompare(a.published));
posts.forEach(p => {
  p.slug = slugify(p.title, used);
});

for (const ep of extraPosts) {
  posts.push({
    slug: ep.slug,
    title: ep.title,
    published: ep.published,
    labels: ep.labels || [],
    thumb: ep.thumb || null,
    search: ep.search || null,
    handwritten: ep.handwritten !== false,
  });
}

posts.sort((a, b) => b.published.localeCompare(a.published));

const generatedCount = posts.filter(p => !p.handwritten).length;
const extraCount = posts.filter(p => p.handwritten).length;
console.log(`Parsed ${generatedCount} feed POST entries + ${extraCount} extra posts = ${posts.length} total.`);

// ---------- emit generated post pages ----------
fs.mkdirSync(POSTS_DIR, { recursive: true });

function postPage(p) {
  const content = normalizeContent(p.decoded, imgMap);
  const labels = p.labels.map(l => `<span class="post-label">${escapeHtml(l)}</span>`).join('');
  const firstImg = firstImageName(p.decoded, imgMap);
  const ogImage =
    firstImg && firstImg.local
      ? `${SITE_URL}/content/blog/posts/img/${encodeURI(firstImg.local)}`
      : `${SITE_URL}/og-image.png`;
  const canonicalUrl = `${SITE_URL}/content/blog/posts/${p.slug}.html`;
  const fullTitle = `${escapeHtml(p.title)} - Orcun Koral Iseri`;
  const desc = escapeHtml(p.title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullTitle}</title>
  <meta name="description" content="${desc}">
  <script>document.documentElement.classList.add('js');</script>
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" href="../../../favicon.svg" type="image/svg+xml">
  <link rel="icon" href="../../../favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="../../../apple-touch-icon.png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Orcun Koral Iseri">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../styles.css?v=${STYLES_VER}">
  <link rel="stylesheet" href="../../../blog.css?v=${CSS_VER}">
  <link rel="stylesheet" href="../../../mobile.css?v=${MOBILE_CSS_VER}">
</head>
<body>
  <!-- Sticky top bar with Home Link -->
  <header class="page-topbar">
    <a href="../../../index.html" class="back-link">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      home
    </a>
  </header>

  <article class="post-article">
    <a href="../../../blog.html" class="post-allposts">‹ All posts</a>
    <h1 class="post-article-title">${escapeHtml(p.title)}</h1>
    <div class="post-article-meta">Published · ${fmtDate(p.published)}</div>
    ${labels ? `<div class="post-article-labels">${labels}</div>` : ''}
    <hr class="post-divider">
    <div class="post-content">
${content}
    </div>
    <hr class="post-divider">
    <a href="../../../blog.html" class="post-allposts">‹ All posts</a>
  </article>
</body>
</html>
`;
}

let writtenCount = 0;
for (const p of posts) {
  if (p.handwritten) continue;
  fs.writeFileSync(path.join(POSTS_DIR, `${p.slug}.html`), postPage(p), 'utf8');
  writtenCount++;
}
console.log(`Wrote ${writtenCount} generated post pages to content/blog/posts/ (preserved ${extraCount} hand-written posts).`);

// ---------- emit index ----------
function card(p, idx) {
  const thumb = resolveCardThumb(p, imgMap);
  const loadingAttrs =
    idx === 0
      ? ' fetchpriority="high" decoding="async"'
      : idx < 3
        ? ' decoding="async"'
        : ' loading="lazy" decoding="async"';
  const thumbHtml = thumb
    ? `<img src="${thumb}" alt="" class="post-thumb"${loadingAttrs}>`
    : `<div class="post-thumb post-thumb--empty"></div>`;
  const labels = p.labels.slice(0, 6).map(l => `<span class="post-label">${escapeHtml(l)}</span>`).join('');
  const year = p.published.slice(0, 4);
  const searchStr = p.search || (p.title + ' ' + p.labels.join(' ')).toLowerCase();
  const search = escapeHtml(searchStr);
  return `    <a class="post-card hidden-section" href="content/blog/posts/${p.slug}.html" data-year="${year}" data-search="${search}">
      <div class="post-thumb-col">${thumbHtml}</div>
      <div class="post-card-body">
        <h3 class="post-card-title">${escapeHtml(p.title)}</h3>
        <div class="post-meta">Published · ${fmtDate(p.published)}</div>
        ${labels ? `<div class="post-labels">${labels}</div>` : ''}
      </div>
    </a>`;
}

const years = [...new Set(posts.map(p => p.published.slice(0, 4)))].sort((a, b) => b.localeCompare(a));
const yearCounts = {};
posts.forEach(p => {
  const y = p.published.slice(0, 4);
  yearCounts[y] = (yearCounts[y] || 0) + 1;
});
const yearChips = years
  .map(
    y =>
      `        <button type="button" class="year-chip" data-year="${y}" aria-pressed="false">${y} <span class="year-count">${yearCounts[y]}</span></button>`
  )
  .join('\n');

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Orcun Koral Iseri</title>
  <meta name="description" content="Blog posts by Orcun Koral Iseri — research notes, tutorials, and updates.">
  <script>document.documentElement.classList.add('js');</script>
  <link rel="canonical" href="${SITE_URL}/blog.html">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="icon" href="favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Orcun Koral Iseri">
  <meta property="og:title" content="Blog - Orcun Koral Iseri">
  <meta property="og:description" content="Blog posts by Orcun Koral Iseri — research notes, tutorials, and updates.">
  <meta property="og:url" content="${SITE_URL}/blog.html">
  <meta property="og:image" content="${SITE_URL}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Blog - Orcun Koral Iseri">
  <meta name="twitter:description" content="Blog posts by Orcun Koral Iseri — research notes, tutorials, and updates.">
  <meta name="twitter:image" content="${SITE_URL}/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css?v=${STYLES_VER}">
  <link rel="stylesheet" href="blog.css?v=${CSS_VER}">
  <link rel="stylesheet" href="mobile.css?v=${MOBILE_CSS_VER}">
</head>
<body>
  <!-- Sticky top bar with Home Link -->
  <header class="page-topbar">
    <a href="index.html" class="back-link">
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      home
    </a>
  </header>

  <main class="blog-container">
    <h1 class="visually-hidden">Blog — Orcun Koral Iseri</h1>
    <div class="blog-filters">
      <input type="search" id="blog-search" class="blog-search" placeholder="Search posts…" aria-label="Search posts">
      <div class="year-chips" id="year-chips">
        <button type="button" class="year-chip is-active" data-year="all" aria-pressed="true">All <span class="year-count">${posts.length}</span></button>
${yearChips}
      </div>
    </div>
${posts.map((p, idx) => card(p, idx)).join('\n')}
    <p class="blog-noresults" id="blog-noresults" role="status" aria-live="polite" hidden>No posts match your search.</p>
  </main>

  <script src="blog.js?v=${JS_VER}"></script>
  <script src="mobile.js?v=${MOBILE_JS_VER}"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'blog.html'), indexHtml, 'utf8');
console.log('Wrote blog.html');
console.log(`Images: ${imgMap ? 'LOCALIZED via img-map.json' : 'REMOTE (blogger.googleusercontent.com)'}`);
