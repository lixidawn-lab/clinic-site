import type { Locale } from '../i18n';

const dateLocale: Record<Locale, string> = { en: 'en-MY', zh: 'zh-Hans' };

/** "2024-07-16" → "16 July 2024" / "2024年7月16日". */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocale[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));
}

/** Plain text with blank-line-separated paragraphs → paragraphs. */
export function paragraphs(text: string): string[] {
  return text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

/** ["English", "Mandarin"] → "English, Mandarin" / ["华语", "英语"] → "华语、英语". */
export function listJoin(items: string[], locale: Locale): string {
  return items.join(locale === 'zh' ? '、' : ', ');
}

/** Fills "{name}" placeholders in UI copy. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}
