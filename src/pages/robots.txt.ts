import type { APIRoute } from 'astro';
import { allowIndexing } from '../lib/indexing';

// Indexing off (default): block everything. On: allow all.
// The sitemap line is added in phase 2 when the sitemap exists.
export const GET: APIRoute = () => {
  const body = allowIndexing
    ? 'User-agent: *\nAllow: /\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
