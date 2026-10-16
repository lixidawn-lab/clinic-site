# Fonts (self-hosted, no Google Fonts / font CDN)

All fonts are under the SIL Open Font License 1.1 (web self-hosting and subsetting allowed).
License texts ship next to the font files (`public/fonts/OFL-*.txt`, `fonts/og/OFL-*.txt`).

## Web pages

| Font | Use | Source | Files |
|---|---|---|---|
| Poppins 500/600/700 | headings, logo name, hero intro | github.com/google/fonts `ofl/poppins` | `public/fonts/poppins-*.woff2` (Latin subset, committed) |
| Palanquin 400/500/600 | English body text | github.com/google/fonts `ofl/palanquin` | `public/fonts/palanquin-*.woff2` (Latin subset, committed) |

Chinese text uses the visitor's system font (decided 2026-10-16), no Chinese web font is downloaded.
Fallback order (`--font-cjk` in `src/styles/tokens.css`): PingFang SC, Hiragino Sans GB, Noto Sans SC,
Source Han Sans SC, Microsoft YaHei, sans-serif.

## Share images (og:image), build time only

`src/pages/og/[lang].jpg.ts` draws the share images with these fonts. They are never sent to visitors.

| Font | Files |
|---|---|
| Poppins 500/700 | `fonts/og/poppins-{500,700}.ttf`: Latin-1 + quotes/dashes, from `ofl/poppins/Poppins-{Medium,Bold}.ttf` |
| Noto Sans SC 500/700 | `fonts/og/noto-sans-sc-{500,700}.ttf`: only the Chinese characters on the cards, from `ofl/notosanssc/NotoSansSC[wght].ttf` (instanced at wght 500 / 700) |

The Chinese files contain just the characters of the doctor's Chinese name and the card line
(刘涵倪医生, 马六甲精神科专科医生). If either text changes and a character is missing, the build prints a
warning and the Chinese card falls back to the English name. To add characters, cut the files again from
the source font with any subsetting tool (e.g. `pyftsubset` or the `subset-font` npm package, with the
`wght` axis pinned to 500 / 700), keeping TrueType output.
