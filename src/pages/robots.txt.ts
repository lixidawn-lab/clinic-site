import type { APIRoute } from 'astro';
import { allowIndexing } from '../lib/indexing';

// Indexing off (default, preview site): block everything. On (production): allow all and point to the sitemap.
export const GET: APIRoute = ({ site }) => {
  const body = allowIndexing
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
