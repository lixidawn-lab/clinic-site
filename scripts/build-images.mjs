// One-off: compresses the original logo and portrait (交接/设计稿/) into public/images/ as WebP + a fallback.
// Re-run only when an original changes: node scripts/build-images.mjs
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
