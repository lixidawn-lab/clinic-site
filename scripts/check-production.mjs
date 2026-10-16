// Verifies a production build (indexing on, so preview labels off) contains no preview-only labels:
// TBC, 初稿 (draft), 待涵倪审阅 (pending review), 待取得转载许可 (pending permission).
// Usage: npm run check:production
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const patterns = [/data-preview-label/, /TBC/, /待补充/, /初稿/, /待涵倪审阅/, /待取得转载许可/, /Pending Hanni/, /Permission pending/];
const problems = [];
let pages = 0;
function* walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (p.endsWith('.html')) yield p;
  }
}
for (const file of walk(dir)) {
  pages++;
  const html = fs.readFileSync(file, 'utf8');
  for (const re of patterns) if (re.test(html)) problems.push(`${file}: ${re}`);
}
fs.rmSync(dir, { recursive: true, force: true });
if (problems.length) {
  console.error(`✗ Preview-only labels found in the production build:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`✓ Production build: ${pages} pages, no preview-only labels (TBC / 初稿 / 待涵倪审阅 / 待取得转载许可).`);
