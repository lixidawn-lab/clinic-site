// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Placeholder domain until the real one is confirmed. Set SITE_URL in .env.
const site = env.SITE_URL || 'https://example.com';

export default defineConfig({
  site,
  // 4401–4407 are taken by the Lixi Studio sites, 4321 by 窗边有光.
  server: { port: 4410 },
  trailingSlash: 'always',
  build: { format: 'directory' },
  // `/` has no content of its own; it always goes to the English home page.
  // public/_redirects makes this a real 301 on Cloudflare Pages.
  redirects: { '/': '/en/' },
});
