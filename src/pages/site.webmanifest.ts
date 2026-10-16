// Web app manifest: name and icons for "Add to Home Screen". Values come from the content files.
import type { APIRoute } from 'astro';
import { defaultLocale, htmlLang, localizedPath } from '../i18n';
import { getDoctor, getSettings } from '../lib/content';
import { known } from '../lib/tbc';

export const GET: APIRoute = async () => {
  const [settings, doctor] = await Promise.all([getSettings(), getDoctor()]);
  const manifest = {
    name: known(settings.clinicName[defaultLocale]) ?? doctor.name[defaultLocale],
    short_name: doctor.name[defaultLocale],
    lang: htmlLang[defaultLocale],
    start_url: localizedPath(defaultLocale, ''),
    display: 'browser',
    // --bg in src/styles/tokens.css
    background_color: '#F8F7F2',
    theme_color: '#F8F7F2',
    icons: [192, 512].map((size) => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
  };
  return new Response(JSON.stringify(manifest, null, 2), { headers: { 'Content-Type': 'application/manifest+json' } });
};
