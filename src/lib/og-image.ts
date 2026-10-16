// Share image (og:image, 1200×630), drawn at build time (batch 2 task, item 3):
// light green background, rounded portrait on the left; logo, doctor's name (Poppins 700) and one line
// (#1B7A35) on the right. Text is turned into outlines with the fonts in fonts/og/ (see fonts/README.md),
// so the result never depends on fonts installed on the build machine.
import fs from 'node:fs';
import path from 'node:path';
import opentype, { type Font } from 'opentype.js';
import sharp from 'sharp';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Colours from src/styles/tokens.css.
const TINT = '#DCECC8';
const INK = '#344237';
const GREEN_DARK = '#1B7A35';

const root = process.cwd();
const loadFont = (file: string): Font => {
  const buf = fs.readFileSync(path.join(root, 'fonts/og', file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
};
const fonts = {
  bold: [loadFont('poppins-700.ttf'), loadFont('noto-sans-sc-700.ttf')],
  medium: [loadFont('poppins-500.ttf'), loadFont('noto-sans-sc-500.ttf')],
};

/** First font (Poppins, then Noto Sans SC) that has the character, or null. */
const fontFor = (stack: Font[], ch: string) => stack.find((f) => f.charToGlyphIndex(ch) > 0) ?? null;
const canDraw = (stack: Font[], text: string) => [...text].every((ch) => ch === ' ' || fontFor(stack, ch));

function textWidth(stack: Font[], text: string, size: number) {
  return [...text].reduce((w, ch) => {
    const font = fontFor(stack, ch) ?? stack[0];
    return w + ((font.charToGlyph(ch).advanceWidth ?? 0) * size) / font.unitsPerEm;
  }, 0);
}

/** SVG path data for one line of text, character by character so Latin and Chinese can mix. */
function textPath(stack: Font[], text: string, x: number, baseline: number, size: number) {
  let d = '';
  for (const ch of text) {
    const font = fontFor(stack, ch) ?? stack[0];
    const glyph = font.charToGlyph(ch);
    d += glyph.getPath(x, baseline, size).toPathData(2);
    x += ((glyph.advanceWidth ?? 0) * size) / font.unitsPerEm;
  }
  return d;
}

/** Largest size ≤ max at which the text fits the width. */
const fit = (stack: Font[], text: string, max: number, width: number) =>
  Math.min(max, Math.floor((max * width) / Math.max(1, textWidth(stack, text, max))));

export async function renderOgImage({ name, fallbackName, line, fallbackLine }: {
  name: string;
  /** Used when a character of `name` is not in fonts/og (see fonts/README.md). */
  fallbackName: string;
  line: string;
  fallbackLine: string;
}) {
  for (const [text, stack] of [[name, fonts.bold], [line, fonts.medium]] as const) {
    if (!canDraw(stack, text)) console.warn(`[og-image] "${text}" has characters missing from fonts/og/, using the English text instead. See fonts/README.md.`);
  }
  const nameText = canDraw(fonts.bold, name) ? name : fallbackName;
  const lineText = canDraw(fonts.medium, line) ? line : fallbackLine;

  // Layout: 72 px margins; portrait 440×486 on the left, text column from x = 584 to 1128.
  const margin = 72;
  const photo = { w: 440, h: OG_HEIGHT - 2 * margin, r: 32 };
  const colX = margin + photo.w + 72;
  const colW = OG_WIDTH - margin - colX;
  const logoSize = 120;
  const nameSize = fit(fonts.bold, nameText, 60, colW);
  const lineSize = fit(fonts.medium, lineText, 34, colW);
  const gapLogo = 40;
  const gapLine = 18;
  const blockH = logoSize + gapLogo + nameSize + gapLine + lineSize * 1.2;
  const top = Math.round((OG_HEIGHT - blockH) / 2);
  const nameBaseline = top + logoSize + gapLogo + nameSize * 0.78;
  const lineBaseline = nameBaseline + gapLine + lineSize * 1.15;

  const portrait = await sharp(path.join(root, 'public/images/hanni-portrait-960.jpg'))
    .resize(photo.w, photo.h, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(`<svg width="${photo.w}" height="${photo.h}"><rect width="100%" height="100%" rx="${photo.r}" ry="${photo.r}"/></svg>`), blend: 'dest-in' }])
    .png()
    .toBuffer();
  const logo = await sharp(path.join(root, 'public/images/clinic-logo-240.png')).resize(logoSize, logoSize).png().toBuffer();
  const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}">
    <path fill="${INK}" d="${textPath(fonts.bold, nameText, colX, nameBaseline, nameSize)}"/>
    <path fill="${GREEN_DARK}" d="${textPath(fonts.medium, lineText, colX, lineBaseline, lineSize)}"/>
  </svg>`);

  return sharp({ create: { width: OG_WIDTH, height: OG_HEIGHT, channels: 3, background: TINT } })
    .composite([
      { input: portrait, left: margin, top: margin },
      { input: logo, left: colX - 4, top },
      { input: text, left: 0, top: 0 },
    ])
    // JPEG keeps it around 100 KB (WhatsApp skips share images over ~300 KB).
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
}
