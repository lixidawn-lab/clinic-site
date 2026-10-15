// The ONLY place pages read content from. When we switch to Sanity (phase 3),
// only this file changes; components keep calling the same functions.
import { getEntry } from 'astro:content';

export async function getSettings() {
  const entry = await getEntry('settings', 'site');
  if (!entry) throw new Error('Missing settings entry "site" in src/content/settings.json');
  return entry.data;
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;
