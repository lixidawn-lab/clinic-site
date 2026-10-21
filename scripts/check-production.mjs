// Checks a production build (indexing on, so preview labels off). Usage: npm run check:production
// 1. No preview-only labels: TBC, 初稿 (draft), 待涵倪审阅 (pending review), 待取得转载许可 (pending permission).
// 2. Every page has an og:image.
// 3. No canonical points to example.com or workers.dev (and example.com appears nowhere).
// 4. robots.txt points to the sitemap, and the sitemap lists exactly the pages whose canonical is on this site:
//    each <loc> is the canonical of exactly one page, and every such canonical is in the sitemap.
// 5. Every FAQ answer is confirmed by Hanni (content-status.json, only built for this check; 灵晞 2026-10-20).
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const labelPatterns = [/data-preview-label/, /TBC/, /待补充/, /初稿/, /待涵倪审阅/, /待取得转载许可/, /Pending Hanni/, /Permission pending/];
const problems = [];
let pages = 0;
function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}

const robots = fs.readFileSync(path.join(dir, 'robots.txt'), 'utf8');
const sitemapRef = robots.match(/^Sitemap: (\S+)$/m)?.[1];
if (!sitemapRef) problems.push('robots.txt: no "Sitemap:" line');
const origin = sitemapRef ? new URL(sitemapRef).origin : null;

const canonicalPages = new Map(); // canonical on this site → page files
for (const file of walk(dir)) {
  const html = fs.readFileSync(file, 'utf8');
  if (/http-equiv="refresh"/.test(html)) continue; // Astro's redirect page for "/"
  pages++;
  for (const re of labelPatterns) if (re.test(html)) problems.push(`${file}: preview label ${re}`);
  if (!/<meta property="og:image" content="https?:\/\/[^"]+"/.test(html)) problems.push(`${file}: no og:image`);
  if (/example\.com/.test(html)) problems.push(`${file}: mentions example.com`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) { problems.push(`${file}: no canonical`); continue; }
  if (/example\.com|workers\.dev/.test(canonical)) problems.push(`${file}: canonical points to ${canonical}`);
  if (origin && new URL(canonical).origin === origin) {
    canonicalPages.set(canonical, [...(canonicalPages.get(canonical) ?? []), file]);
  }
}

const sitemap = fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(locs).size !== locs.length) problems.push('sitemap.xml: duplicate <loc>');
for (const loc of locs) {
  const files = canonicalPages.get(loc);
  if (!files) problems.push(`sitemap.xml: ${loc} is not the canonical of any page`);
  else if (files.length > 1) problems.push(`sitemap.xml: ${loc} is the canonical of ${files.length} pages: ${files.join(', ')}`);
}
for (const canonical of canonicalPages.keys()) if (!locs.includes(canonical)) problems.push(`sitemap.xml: missing ${canonical}`);

const statusFile = path.join(dir, 'content-status.json');
if (!fs.existsSync(statusFile)) problems.push('content-status.json missing (run through `npm run check:production`)');
else for (const q of JSON.parse(fs.readFileSync(statusFile, 'utf8')).unconfirmedFaq) problems.push(`FAQ not confirmed yet (已确认 is off): ${q}`);

fs.rmSync(dir, { recursive: true, force: true });
if (problems.length) {
  console.error(`✗ Production build has problems:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`✓ Production build: ${pages} pages. No preview-only labels (TBC / 初稿 / 待涵倪审阅 / 待取得转载许可); every page has an og:image; no canonical on example.com / workers.dev; sitemap.xml (${locs.length} URLs) matches the canonicals one to one; every FAQ answer is confirmed.`);
