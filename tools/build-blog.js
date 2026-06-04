#!/usr/bin/env node
/*
 * build-blog.js — Generates the blog index (blog.html) and one HTML page per
 * post (content/blog/posts/<slug>.html) from the Blogger Atom export.
 *
 * Usage:  node tools/build-blog.js
 *
 * Source feed: content/blog/Blogs/Personal Blog/feed.atom
 * Only <blogger:type>POST</blogger:type> entries are used (comments/pages skipped).
 *
 * Image mode: if content/blog/posts/img-map.json exists ({ "<remoteUrl>": "<localFile>" }),
 * image src URLs found in that map are rewritten to local paths (img/<localFile>).
 * Otherwise the original remote URLs are kept.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FEED = path.join(ROOT, 'content', 'blog', 'Blogs', 'Personal Blog', 'feed.atom');
const POSTS_DIR = path.join(ROOT, 'content', 'blog', 'posts');
const IMG_MAP_FILE = path.join(POSTS_DIR, 'img-map.json');

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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
  const y = iso.slice(0, 4), m = parseInt(iso.slice(5, 7), 10), d = parseInt(iso.slice(8, 10), 10);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
function stripDiacritics(s) {
  const map = { 'ç':'c','ğ':'g','ı':'i','ö':'o','ş':'s','ü':'u','â':'a','î':'i','û':'u','é':'e','è':'e' };
  return s.toLowerCase().replace(/[çğıöşüâîûéè]/g, c => map[c] || c).normalize('NFD').replace(/[̀-ͯ]/g, '');
}
function slugify(title, used) {
  let base = stripDiacritics(title).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'post';
  let slug = base, i = 2;
  while (used.has(slug)) slug = `${base}-${i++}`;
  used.add(slug);
  return slug;
}

function normalizeContent(html, imgMap) {
  let h = html;
  // strip leading empty paragraphs
  h = h.replace(/^(\s*<p>\s*<\/p>\s*)+/i, '');
  // remove style / class attributes (kills Blogger's Times-New-Roman inline noise)
  h = h.replace(/\s+style=("[^"]*"|'[^']*')/gi, '');
  h = h.replace(/\s+class=("[^"]*"|'[^']*')/gi, '');
  // remove fixed sizing / blogger data attrs so images are responsive
  h = h.replace(/\s+(?:width|height|border|imageanchor|data-original-width|data-original-height)=("[^"]*"|'[^']*')/gi, '');
  // rewrite image src to local copies when a map is provided
  if (imgMap) {
    h = h.replace(/(<(?:img|a)[^>]*\b(?:src|href)=")([^"]+)(")/gi, (m, pre, url, post) => {
      const local = imgMap[url];
      return local ? `${pre}img/${local}${post}` : m;
    });
    // any anchor still pointing remote that wraps an already-localized image →
    // point it at that local image (full-res URL variants not in the map)
    h = h.replace(/(<a\b[^>]*\bhref=")https?:\/\/[^"]*googleusercontent[^"]*("[^>]*>\s*<img\b[^>]*\bsrc=")(img\/[^"]+)(")/gi,
      (m, p1, p2, local, p4) => `${p1}${local}${p2}${local}${p4}`);
    // final fallback: any leftover googleusercontent URL (e.g. a bare text link to
    // a full-res variant) whose trailing filename matches a downloaded file
    const localFiles = new Set(Object.values(imgMap));
    h = h.replace(/https?:\/\/[^"'\s<>]*googleusercontent[^"'\s<>]*\/([^\/"'\s<>]+\.(?:jpe?g|png|gif|webp))/gi, (m, fname) => {
      let seg = decodeURIComponent(fname.replace(/\+/g, ' ')).replace(/[^a-zA-Z0-9._-]/g, '_');
      const ext = (seg.match(/(\.[a-z0-9]+)$/i) || [])[1] || '';
      let stem = ext ? seg.slice(0, -ext.length) : seg;
      if (stem.length > 50) stem = stem.slice(0, 50);
      seg = stem + ext;
      return localFiles.has(seg) ? `img/${seg}` : m;
    });
  }
  // lazy-load images
  h = h.replace(/<img\b/gi, '<img loading="lazy"');
  // open external links in a new tab
  h = h.replace(/<a\s+href=("https?:[^"]*"|'https?:[^']*')/gi, '<a target="_blank" rel="noopener" href=$1');
  return h.trim();
}

function firstImage(decodedContent, imgMap, relPrefix) {
  const m = decodedContent.match(/<img[^>]*\bsrc=["']([^"']+)["']/i);
  if (!m) return null;
  const url = m[1];
  if (imgMap && imgMap[url]) return `${relPrefix}img/${imgMap[url]}`;
  return url;
}

// ---------- parse feed ----------
const raw = fs.readFileSync(FEED, 'utf8');
const imgMap = fs.existsSync(IMG_MAP_FILE) ? JSON.parse(fs.readFileSync(IMG_MAP_FILE, 'utf8')) : null;

const entries = raw.split('<entry>').slice(1);
const used = new Set();
const posts = [];

for (const e of entries) {
  const type = (e.match(/<blogger:type>([A-Z]+)<\/blogger:type>/) || [])[1];
  if (type !== 'POST') continue;
  const trashed = /<blogger:trashed>[^<]+<\/blogger:trashed>/.test(e);
  const status = (e.match(/<blogger:status>([A-Z_]+)<\/blogger:status>/) || [])[1] || 'LIVE';
  if (trashed || status === 'DRAFT') continue;

  const title = decodeEntities(((e.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || '(untitled)').trim().replace(/\s+/g, ' '));
  const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1] || '1970-01-01';
  const labels = [...e.matchAll(/<category\s+scheme='tag:blogger\.com[^']*'\s+term='([^']+)'/g)].map(m => decodeEntities(m[1]));
  const rawContent = (e.match(/<content type=['"]html['"]>([\s\S]*?)<\/content>/) || [])[1] || '';
  const decoded = decodeEntities(rawContent);

  posts.push({ title, published, labels, decoded });
}

posts.sort((a, b) => b.published.localeCompare(a.published));
posts.forEach(p => { p.slug = slugify(p.title, used); });

console.log(`Parsed ${posts.length} POST entries.`);

// ---------- emit post pages ----------
fs.mkdirSync(POSTS_DIR, { recursive: true });

function postPage(p) {
  const content = normalizeContent(p.decoded, imgMap);
  const labels = p.labels.map(l => `<span class="post-label">${escapeHtml(l)}</span>`).join('');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(p.title)} - Orcun Koral Iseri</title>
  <meta name="description" content="${escapeHtml(p.title)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../styles.css">
  <link rel="stylesheet" href="../../../blog.css">
</head>
<body>
  <!-- Sticky top bar with Home Link -->
  <header class="page-topbar">
    <a href="../../../index.html" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
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

for (const p of posts) {
  fs.writeFileSync(path.join(POSTS_DIR, `${p.slug}.html`), postPage(p), 'utf8');
}
console.log(`Wrote ${posts.length} post pages to content/blog/posts/`);

// ---------- emit index ----------
function card(p) {
  const thumb = firstImage(p.decoded, imgMap, 'content/blog/posts/');
  const thumbHtml = thumb
    ? `<img src="${thumb}" alt="" class="post-thumb" loading="lazy">`
    : `<div class="post-thumb post-thumb--empty"></div>`;
  const labels = p.labels.slice(0, 6).map(l => `<span class="post-label">${escapeHtml(l)}</span>`).join('');
  return `    <a class="post-card hidden-section" href="content/blog/posts/${p.slug}.html">
      <div class="post-thumb-col">${thumbHtml}</div>
      <div class="post-card-body">
        <h3 class="post-card-title">${escapeHtml(p.title)}</h3>
        <div class="post-meta">Published · ${fmtDate(p.published)}</div>
        ${labels ? `<div class="post-labels">${labels}</div>` : ''}
      </div>
    </a>`;
}

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog - Orcun Koral Iseri</title>
  <meta name="description" content="Blog posts by Orcun Koral Iseri — research notes, tutorials, and updates.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <link rel="stylesheet" href="blog.css">
</head>
<body>
  <!-- Sticky top bar with Home Link -->
  <header class="page-topbar">
    <a href="index.html" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      home
    </a>
  </header>

  <main class="blog-container">
${posts.map(card).join('\n')}
  </main>

  <script src="blog.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'blog.html'), indexHtml, 'utf8');
console.log('Wrote blog.html');
console.log(`Images: ${imgMap ? 'LOCALIZED via img-map.json' : 'REMOTE (blogger.googleusercontent.com)'}`);
