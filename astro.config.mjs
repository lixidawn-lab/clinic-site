// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
// Temporary domain under 窗边有光's bythewindow.org (CLAUDE.md「域名」). SITE_URL in .env overrides it.
const site = env.SITE_URL || 'https://clinic.bythewindow.org';

export default defineConfig({
  site,
  // 4401–4407 are taken by the Lixi Studio sites, 4321 by 窗边有光.
  server: { port: 4410 },
  trailingSlash: 'always',
  // Inline the (small) CSS so the first paint doesn't wait for extra requests.
  build: { format: 'directory', inlineStylesheets: 'always' },
  // `/` has no content of its own; it always goes to the English home page.
  // public/_redirects makes this a real 301 on Cloudflare Pages.
  redirects: { '/': '/en/' },
});
