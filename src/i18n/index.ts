import { en, type Dict } from './en';
import { zh } from './zh';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { en: 'en', zh: 'zh-Hans' };
/** Value for og:locale. */
export const ogLocale: Record<Locale, string> = { en: 'en_MY', zh: 'zh_MY' };

const dicts: Record<Locale, Dict> = { en, zh };

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function useTranslations(locale: Locale): Dict {
  return dicts[locale];
}

/** Both languages share the English slug: route "about" → /en/about/ and /zh/about/. */
export function localizedPath(locale: Locale, route: string): string {
  const clean = route.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function otherLocales(locale: Locale): Locale[] {
  return locales.filter((l) => l !== locale);
}

/** getStaticPaths() helper for pages under src/pages/[lang]/. */
export function localeStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

/** Read the locale from the [lang] route param. Throws on anything unexpected. */
export function localeFromParams(params: Record<string, string | undefined>): Locale {
  if (!isLocale(params.lang)) throw new Error(`Unknown locale: ${params.lang}`);
  return params.lang;
}
