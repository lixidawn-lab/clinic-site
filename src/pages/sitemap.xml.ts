// sitemap.xml: every page (including the legal pages) in both languages, each with its hreflang alternates (PRD 8.1, 8.2).
// Articles whose canonical is on another site (窗边有光 / media, CLAUDE.md「文章来源规则」) are left out:
// the sitemap lists exactly the pages whose canonical is on this site (checked by `npm run check:production`).
import type { APIRoute } from 'astro';
import { defaultLocale, htmlLang, locales, localizedPath } from '../i18n';
import { getNotes, noteSourceRules } from '../lib/content';
import { legalRoutes, routes } from '../lib/routes';

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const notes = await getNotes();
  const pages: { route: string; lastmod?: string }[] = [
    ...[...Object.values(routes), ...Object.values(legalRoutes)].map((route) => ({ route })),
    ...notes
      .filter((note) => !noteSourceRules(note).externalCanonical)
      .map((note) => ({ route: `${routes.notes}/${note.slug}`, lastmod: note.reviewedAt ?? note.publishedAt })),
  ];
  const alternates = (route: string) => [
    ...locales.map((l) => `    <xhtml:link rel="alternate" hreflang="${htmlLang[l]}" href="${abs(localizedPath(l, route))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(localizedPath(defaultLocale, route))}"/>`,
  ];
  const urls = pages.flatMap(({ route, lastmod }) => locales.map((l) => [
    '  <url>',
    `    <loc>${abs(localizedPath(l, route))}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    ...alternates(route),
    '  </url>',
  ].join('\n')));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
