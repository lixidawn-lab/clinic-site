// The ONLY place pages read content from. The data comes from Sanity (or, offline, from src/content/):
// the source is picked in src/content.config.ts, see src/lib/sanity.ts. Pages and components never notice which.
import { getCollection, getEntry, render } from 'astro:content';
import type { Locale } from '../i18n';

function missing(collection: string, id: string): never {
  throw new Error(`Missing entry "${id}" in "${collection}" (Sanity: is the document published?)`);
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getSettings() {
  return (await getEntry('settings', 'site'))?.data ?? missing('settings', 'site');
}

export async function getDoctor() {
  return (await getEntry('doctor', 'doctor'))?.data ?? missing('doctor', 'doctor');
}

/** Privacy notice: last-updated date and the HTML body in en / zh / ms. */
export async function getPrivacyNotice() {
  return (await getEntry('privacy', 'privacy'))?.data ?? missing('privacy', 'privacy');
}

export async function getConcerns() {
  return (await getCollection('concerns')).map((e) => e.data).sort(byOrder);
}

export async function getHowWeBegin() {
  return (await getCollection('howWeBegin')).map((e) => e.data).sort(byOrder);
}

export async function getServices() {
  return (await getCollection('services')).map((e) => e.data).sort(byOrder);
}

export async function getFaq() {
  return (await getCollection('faq')).map((e) => e.data).sort(byOrder);
}

/** All notes, newest first. `slug` is shared by both languages. */
export async function getNotes() {
  const [notes, bodies, sources] = await Promise.all([getCollection('notes'), getCollection('noteBodies'), getCollection('sources')]);
  const bodyIds = new Set(bodies.map((b) => b.id));
  const sourceById = new Map(sources.map((s) => [s.id, s.data]));
  return notes
    .map((e) => {
      const { sourceSite, ...data } = e.data;
      const site = sourceSite ? sourceById.get(sourceSite.id) : undefined;
      if (sourceSite && !site) throw new Error(`Note "${e.id}": unknown sourceSite "${sourceSite.id}" (is that 来源网站 published?)`);
      return {
        slug: e.id,
        ...data,
        /** The source website (name, introduction, homepage), or undefined for original articles. */
        sourceSite: site,
        /** Languages that have a full article body. */
        bodyLocales: (['en', 'zh'] as const).filter((l) => bodyIds.has(`${e.id}/${l}`)),
      };
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Article source rules (CLAUDE.md「文章来源规则」).
 * - fullText: whether the full article may be shown (media only with permission).
 * - externalCanonical: the URL search engines should treat as the original, or null for this site.
 */
export function noteSourceRules(note: Note) {
  const fullText = note.source !== 'media' || note.permission;
  const externalCanonical = note.source === 'chuangbian' || note.source === 'media' ? (note.sourceUrl ?? null) : null;
  return { fullText, externalCanonical };
}

/** Rendered article body in one language, or null if that language has none yet. */
export async function getNoteBody(note: Note, locale: Locale) {
  if (!note.bodyLocales.includes(locale)) return null;
  const entry = await getEntry('noteBodies', `${note.slug}/${locale}`);
  return entry ? (await render(entry)).Content : null;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;
export type Doctor = Awaited<ReturnType<typeof getDoctor>>;
export type Note = Awaited<ReturnType<typeof getNotes>>[number];
