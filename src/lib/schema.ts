// schema.org objects (PRD 8.3). Only values that are on the page and not TBC; everything else is left out.
import { defaultLocale, htmlLang, localizedPath, otherLocales, type Locale } from '../i18n';
import { routes } from './routes';
import { known } from './tbc';
import type { Doctor, Note, Settings } from './content';

const abs = (site: URL, path: string) => new URL(path, site).href;
/** Stable ids, always on the default-language URL, so both languages describe the same entity. */
export const clinicId = (site: URL) => `${abs(site, localizedPath(defaultLocale, routes.home))}#clinic`;
export const physicianId = (site: URL) => `${abs(site, localizedPath(defaultLocale, routes.about))}#physician`;

/** Drops undefined values and empty arrays. */
function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)),
  ) as Partial<T>;
}

export function medicalClinic(settings: Settings, locale: Locale, site: URL) {
  const other = otherLocales(locale)[0];
  return clean({
    '@type': 'MedicalClinic',
    '@id': clinicId(site),
    name: known(settings.clinicName[locale]),
    alternateName: known(settings.clinicName[other]),
    url: abs(site, localizedPath(locale, routes.home)),
    address: known(settings.address[locale]),
    telephone: known(settings.phone),
    hasMap: known(settings.mapUrl),
    medicalSpecialty: 'Psychiatric',
    sameAs: settings.socialLinks.map((s) => s.url),
  });
}

export function physician(doctor: Doctor, settings: Settings, locale: Locale, site: URL) {
  const other = otherLocales(locale)[0];
  return clean({
    '@type': 'Physician',
    '@id': physicianId(site),
    name: doctor.name[locale],
    alternateName: doctor.name[other],
    url: abs(site, localizedPath(locale, routes.about)),
    medicalSpecialty: 'Psychiatric',
    knowsLanguage: doctor.languages.en,
    hasCredential: doctor.qualifications.map((q) => ({ '@type': 'EducationalOccupationalCredential', name: q[locale] })),
    address: known(settings.address[locale]),
    sameAs: settings.socialLinks.map((s) => s.url),
  });
}

export function article(note: Note, doctor: Doctor, locale: Locale, site: URL) {
  return clean({
    '@type': 'Article',
    headline: note.title[locale],
    description: note.summary[locale],
    inLanguage: htmlLang[locale],
    datePublished: note.publishedAt,
    dateModified: note.reviewedAt,
    url: abs(site, localizedPath(locale, `${routes.notes}/${note.slug}`)),
    author: { '@type': 'Physician', '@id': physicianId(site), name: doctor.name[locale], url: abs(site, localizedPath(locale, routes.about)) },
    publisher: { '@id': clinicId(site) },
  });
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  };
}
