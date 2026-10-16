interface ImportMetaEnv {
  readonly PUBLIC_ALLOW_INDEXING?: string;
  readonly PUBLIC_SHOW_PREVIEW_LABELS?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// opentype.js 1.x ships no types; only what src/lib/og-image.ts uses.
declare module 'opentype.js' {
  export interface Glyph { advanceWidth?: number; getPath(x: number, y: number, fontSize: number): { toPathData(decimals?: number): string } }
  export interface Font { unitsPerEm: number; charToGlyphIndex(char: string): number; charToGlyph(char: string): Glyph }
  export function parse(buffer: ArrayBuffer): Font;
  const opentype: { parse: typeof parse };
  export default opentype;
}
