// Runs in front of the static files (wrangler.jsonc). The workers.dev backup address sends every request
// to the same page on the official domain with a 301, so search engines only ever index clinic.bythewindow.org.
// Everything else (the official domain) gets the static files from dist/ as before, _redirects included.
const OFFICIAL_HOST = 'clinic.bythewindow.org'; // keep in sync with `site` in astro.config.mjs

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname.endsWith('.workers.dev')) {
      url.protocol = 'https:';
      url.host = OFFICIAL_HOST;
      return Response.redirect(url.href, 301);
    }
    return env.ASSETS.fetch(request);
  },
};
