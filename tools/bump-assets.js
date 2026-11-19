#!/usr/bin/env node
/*
 * bump-assets.js — Recomputes 8-char MD5 cache-buster hashes (?v=<md5-8>) for
 * all root CSS and JS files and updates references across root HTML pages, 404.html,
 * and content/blog/posts/*.html.
 *
 * Usage:  node tools/bump-assets.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

const assetHashes = {};
for (const entry of fs.readdirSync(ROOT)) {
  if (/^(?:[a-z0-9_-]+)\.(?:css|js)$/i.test(entry)) {
    const buf = fs.readFileSync(path.join(ROOT, entry));
    assetHashes[entry] = crypto.createHash('md5').update(buf).digest('hex').slice(0, 8);
  }
}

const htmlFiles = [];
for (const entry of fs.readdirSync(ROOT)) {
  if (/\.html$/i.test(entry)) {
    htmlFiles.push(path.join(ROOT, entry));
  }
}
const postsDir = path.join(ROOT, 'content', 'blog', 'posts');
if (fs.existsSync(postsDir)) {
  for (const entry of fs.readdirSync(postsDir)) {
    if (/\.html$/i.test(entry)) {
      htmlFiles.push(path.join(postsDir, entry));
    }
  }
}

const pattern = /(href|src)="((?:\.\.\/)*)([a-z0-9_-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?"/gi;
let updatedFiles = 0;

for (const file of htmlFiles) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(pattern, (match, attr, prefix, filename) => {
    const hash = assetHashes[filename];
    if (!hash) return match;
    return `${attr}="${prefix}${filename}?v=${hash}"`;
  });
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    updatedFiles++;
  }
}

console.log(`Updated cache-busters in ${updatedFiles} / ${htmlFiles.length} HTML files.`);
