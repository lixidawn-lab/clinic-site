// One-off: compresses the original logo and portrait (交接/设计稿/) into public/images/ as WebP + a fallback,
// and makes the site icons from the logo.
// Re-run only when an original changes: node scripts/build-images.mjs
import fs from 'node:fs';
import sharp from 'sharp';

const SRC = '交接/设计稿';
const OUT = 'public/images';

// Portrait: shown at up to ~350 CSS px wide (×3 on phones). JPEG fallback for old browsers.
for (const w of [480, 720, 960]) {
  const img = sharp(`${SRC}/hanni-portrait-original.jpg`).resize({ width: w });
  await img.clone().webp({ quality: 78 }).toFile(`${OUT}/hanni-portrait-${w}.webp`);
  await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/hanni-portrait-${w}.jpg`);
}

// Logo (transparent PNG): header 48/36 px, footer 28 px, article card 120 px.
for (const w of [96, 144, 240]) {
  const img = sharp(`${SRC}/clinic-logo-original.png`).resize({ width: w });
  await img.clone().webp({ quality: 85, alphaQuality: 90 }).toFile(`${OUT}/clinic-logo-${w}.webp`);
  await img.clone().png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/clinic-logo-${w}.png`);
}

// Site icons (favicon, Apple touch icon, web manifest icons) → public/.
const logo = `${SRC}/clinic-logo-original.png`;
const TINT = { r: 220, g: 236, b: 200 }; // the logo's own light green circle (#DCECC8)

// 16 px: only the chaise. The thin heart line is painted over with the circle colour, otherwise it turns to mush.
// The heart (#239242) and the chaise (#419538 + dark brown) never come within 20 px of each other in the original,
// so every heart pixel plus a 10 px margin (its anti-aliased edge) can be repainted safely.
const { data, info } = await sharp(logo).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, R = 10;
const isHeart = (i) => data[i + 3] >= 250 && data[i] < 50 && data[i + 1] > 110 && data[i + 1] - data[i] > 80;
const mask = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  if (!isHeart((y * W + x) * 4)) continue;
  for (let yy = Math.max(0, y - R); yy <= Math.min(H - 1, y + R); yy++)
    for (let xx = Math.max(0, x - R); xx <= Math.min(W - 1, x + R); xx++) mask[yy * W + xx] = 1;
}
for (let p = 0; p < W * H; p++) if (mask[p]) { data[p * 4] = TINT.r; data[p * 4 + 1] = TINT.g; data[p * 4 + 2] = TINT.b; }
const chaiseOnly = sharp(data, { raw: info });

const png = (img, size) => img.clone().resize(size, size).png({ compressionLevel: 9 }).toBuffer();
const icon16 = await png(chaiseOnly, 16);
const icon32 = await png(sharp(logo), 32);
await sharp(icon16).toFile('public/favicon-16.png');
await sharp(icon32).toFile('public/favicon-32.png');
for (const size of [192, 512]) await sharp(logo).resize(size, size).png({ compressionLevel: 9 }).toFile(`public/icon-${size}.png`);
// iOS needs an opaque square (it rounds the corners itself): the circle colour fills the whole tile.
await sharp(logo).resize(180, 180).flatten({ background: TINT }).png({ compressionLevel: 9 }).toFile('public/apple-touch-icon.png');

// favicon.ico (browsers and crawlers ask for it at the root): the 16 and 32 px PNGs in one file.
const entries = [[16, icon16], [32, icon32]];
const header = Buffer.alloc(6 + 16 * entries.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach(([size, buf], n) => {
  const e = 6 + 16 * n;
  header.writeUInt8(size, e); header.writeUInt8(size, e + 1); header.writeUInt8(0, e + 2); header.writeUInt8(0, e + 3);
  header.writeUInt16LE(1, e + 4); header.writeUInt16LE(32, e + 6); header.writeUInt32LE(buf.length, e + 8); header.writeUInt32LE(offset, e + 12);
  offset += buf.length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...entries.map(([, b]) => b)]));
