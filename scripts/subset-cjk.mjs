// Cuts Milky Han Mono (星汉等宽) down to the characters the site actually uses. See fonts/README.md.
//   node scripts/subset-cjk.mjs dist   → scans dist/**/*.html, writes dist/fonts/   (postbuild)
//   node scripts/subset-cjk.mjs src    → scans src/** text, writes public/fonts/    (predev)
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';
import { Blob, Face } from 'harfbuzzjs';
import fontverter from 'fontverter';

const mode = process.argv[2];
if (mode !== 'dist' && mode !== 'src') throw new Error('Usage: subset-cjk.mjs dist|src');
const scanDir = mode;
const scanExt = mode === 'dist' ? ['.html'] : ['.astro', '.ts', '.json', '.md'];
const outDir = mode === 'dist' ? 'dist/fonts' : 'public/fonts';
const weights = ['regular', 'bold'];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (scanExt.includes(path.extname(p))) yield p;
  }
}

// Only characters that the CSS unicode-range sends to this font (CJK blocks + fullwidth forms).
const isCjk = (cp) => (cp >= 0x2e80 && cp <= 0x9fff) || (cp >= 0xf900 && cp <= 0xfaff) || (cp >= 0xfe30 && cp <= 0xfe4f) || (cp >= 0xff00 && cp <= 0xffef);
const used = new Set();
for (const file of walk(scanDir)) {
  for (const ch of fs.readFileSync(file, 'utf8')) {
    const cp = ch.codePointAt(0);
    if (isCjk(cp)) used.add(cp);
  }
}

fs.mkdirSync(outDir, { recursive: true });
const text = String.fromCodePoint(...used);
for (const w of weights) {
  const src = fs.readFileSync(`fonts/src/milky-han-mono-${w}.woff2`);
  if (w === 'regular') {
    const covered = new Set(new Face(new Blob(await fontverter.convert(src, 'truetype')), 0).collectUnicodes());
    const missing = [...used].filter((cp) => !covered.has(cp)).map((cp) => String.fromCodePoint(cp));
    if (missing.length) console.warn(`[subset-cjk] ${missing.length} character(s) not in the font, they fall back to Noto Sans SC / system font: ${missing.join('')}`);
  }
  const out = await subsetFont(src, text, { targetFormat: 'woff2' });
  fs.writeFileSync(path.join(outDir, `milky-han-mono-${w}.woff2`), out);
  console.log(`[subset-cjk] ${used.size} characters → ${outDir}/milky-han-mono-${w}.woff2 (${(out.length / 1024).toFixed(1)} KB)`);
}
