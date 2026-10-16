# Fonts (self-hosted, no Google Fonts / font CDN)

All fonts are under the SIL Open Font License 1.1 (web self-hosting and subsetting allowed).
License texts ship next to the font files in `public/fonts/OFL-*.txt`.

| Font | Use | Source | Files |
|---|---|---|---|
| Poppins 500/600/700 | headings, logo name, hero intro | github.com/google/fonts `ofl/poppins` | `public/fonts/poppins-*.woff2` (Latin subset, committed) |
| Palanquin 400/500/600 | English body text | github.com/google/fonts `ofl/palanquin` | `public/fonts/palanquin-*.woff2` (Latin subset, committed) |
| Milky Han Mono 星汉等宽 Regular/Bold | Chinese | github.com/milky-han/mhm release v0.1.1, `milky-cn-minimal`, `ttf/milky-mono-cn-{regular,bold}.ttf` | see below |

Noto Sans SC is only named as a fallback in the font stack (used if a visitor's device has it); it is not hosted.

## Milky Han Mono subsetting

1. `fonts/src/milky-han-mono-*.woff2` (committed): the original 17 MB TTFs cut down once to the
   GB2312 character set (6,763 common simplified characters) plus ASCII, Latin-1 and CJK/fullwidth punctuation (~1.5 MB each).
2. At build time `scripts/subset-cjk.mjs` scans the finished HTML in `dist/` and writes
   `dist/fonts/milky-han-mono-{regular,bold}.woff2` containing only the characters the site actually uses.
   `npm run dev` does the same from the text in `src/` into `public/fonts/` (git-ignored).
3. A character that is not in `fonts/src` is listed as a warning; it then falls back to Noto Sans SC / the system font.
   If that happens with a common character, re-run step 1 with a larger character set.
