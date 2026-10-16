// The ONLY place pages read content from. When we switch to Sanity (phase 3),
// only this file changes; components keep calling the same functions.
import { getCollection, getEntry, render } from 'astro:content';
import type { Locale } from '../i18n';

function missing(collection: string, id: string): never {
  throw new Error(`Missing entry "${id}" in src/content/${collection}.json`);
}

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export async function getSettings() {
  return (await getEntry('settings', 'site'))?.data ?? missing('settings', 'site');
}

export async function getDoctor() {
  return (await getEntry('doctor', 'doctor'))?.data ?? missing('doctor', 'doctor');
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
  const [notes, bodies] = await Promise.all([getCollection('notes'), getCollection('noteBodies')]);
  const bodyIds = new Set(bodies.map((b) => b.id));
  return notes
    .map((e) => ({
      slug: e.id,
      ...e.data,
      /** Languages that have a full article body. */
      bodyLocales: (['en', 'zh'] as const).filter((l) => bodyIds.has(`${e.id}/${l}`)),
    }))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
