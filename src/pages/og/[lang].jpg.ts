// Share images /og/en.jpg and /og/zh.jpg (og:image on every page of that language, articles included).
import type { APIRoute } from 'astro';
import { localeFromParams, localeStaticPaths, useTranslations } from '../../i18n';
import { getDoctor } from '../../lib/content';
import { renderOgImage } from '../../lib/og-image';

export const getStaticPaths = localeStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const locale = localeFromParams(params);
  const doctor = await getDoctor();
  const jpg = await renderOgImage({
    name: doctor.name[locale],
    fallbackName: doctor.name.en,
    line: useTranslations(locale).share.cardLine,
    fallbackLine: useTranslations('en').share.cardLine,
  });
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
