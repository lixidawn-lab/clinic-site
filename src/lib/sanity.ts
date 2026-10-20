// Content from Sanity (phase 3). src/content.config.ts uses these loaders unless CONTENT_SOURCE=local.
// Each loader turns Sanity documents back into exactly the shape of the old src/content/*.json entries,
// so the zod schemas in content.config.ts still validate everything and pages don't change.
// The dataset is public: the build needs no token and only ever sees published documents (never drafts).
import fs from 'node:fs';
import type { Loader } from 'astro/loaders';
import { escapeHTML, toHTML, uriLooksSafe, type PortableTextComponents } from '@portabletext/to-html';

// The project ID is not a secret. SANITY_PROJECT_ID / SANITY_DATASET in .env override it.
const env = (key: string): string | undefined => import.meta.env[key] ?? process.env[key];
export const sanityProject = {
  projectId: env('SANITY_PROJECT_ID') || 'TODO_PROJECT_ID',
  dataset: env('SANITY_DATASET') || 'production',
};

type Doc = { _id: string; _type: string; [key: string]: any };
type Entry = { id: string; data: Record<string, unknown>; html?: string };

const TYPES = ['settings', 'doctor', 'concern', 'howWeBeginStep', 'service', 'faq', 'source', 'note'];

/**
 * All published documents, fetched once per build. Uses the live API, not the CDN, so a build started by the
 * "publish" webhook always sees what was just published.
 * CONTENT_SOURCE=<file>.ndjson reads a Sanity export (`sanity dataset export`) instead, e.g. offline.
 */
let docs: Promise<Doc[]> | undefined;
function allDocs(): Promise<Doc[]> {
  return (docs ??= (async () => {
    const file = env('CONTENT_SOURCE');
    if (file?.endsWith('.ndjson')) {
      return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as Doc)
        .filter((d) => TYPES.includes(d._type) && !d._id.startsWith('drafts.'));
    }
    const { projectId, dataset } = sanityProject;
    const url = new URL(`https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
    url.searchParams.set('query', '*[_type in $types]');
    url.searchParams.set('$types', JSON.stringify(TYPES));
    url.searchParams.set('perspective', 'published');
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
    return (await res.json()).result as Doc[];
  })());
}

/** Drops Sanity's own fields (_id, _type, _key, _rev, …) everywhere, leaving the plain JSON shape. */
function plain(value: unknown): any {
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([k]) => !k.startsWith('_')).map(([k, v]) => [k, plain(v)]));
  }
  return value;
}

/** Migrated documents are "<prefix>-<old id>" (e.g. faq-first-visit); new ones keep Sanity's random ID. */
const entryId = (id: string, prefix: string) => (id.startsWith(`${prefix}-`) ? id.slice(prefix.length + 1) : id);

/* ---------- Article body: Portable Text → HTML (same markup the Markdown files produced) ---------- */

/** Sanity image reference "image-<id>-<w>x<h>-<ext>" → CDN URL and size. */
function imageAsset(ref: string) {
  const m = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref);
  if (!m) throw new Error(`Unknown Sanity image reference "${ref}"`);
  const [, id, w, h, ext] = m;
  const { projectId, dataset } = sanityProject;
  return { url: `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${w}x${h}.${ext}`, width: Number(w), height: Number(h) };
}

const isExternal = (href: string) => /^https?:\/\//.test(href);
const components: PortableTextComponents = {
  block: {
    blockquote: ({ children }) => `<blockquote><p>${children}</p></blockquote>`,
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? '';
      if (!uriLooksSafe(href)) return children ?? '';
      const ext = isExternal(href) ? ' rel="noopener" target="_blank"' : '';
      return `<a href="${escapeHTML(href)}"${ext}>${children}</a>`;
    },
  },
  types: {
    // 引用框: a quote that may contain lists.
    callout: ({ value }) => `<blockquote>${toHTML(value.content ?? [], { components })}</blockquote>`,
    image: ({ value }) => {
      if (!value.asset?._ref) return '';
      const { url, width, height } = imageAsset(value.asset._ref);
      // Article text is at most 720px wide; 1440px covers 2x screens.
      const w = Math.min(width, 1440);
      const h = Math.round((height * w) / width);
      const img = `<img src="${url}?w=${w}&amp;fit=max&amp;auto=format" width="${w}" height="${h}" alt="${escapeHTML(value.alt ?? '')}" loading="lazy" decoding="async">`;
      return value.caption ? `<figure>${img}<figcaption>${escapeHTML(value.caption)}</figcaption></figure>` : `<figure>${img}</figure>`;
    },
  },
};

export const bodyToHtml = (body: unknown[]) => toHTML(body as any, { components, onMissingComponent: false });

/* ---------- Collections ---------- */

const collections: Record<string, (docs: Doc[]) => Entry[]> = {
  settings: (d) => d.filter((x) => x._id === 'settings').map((x) => ({ id: 'site', data: plain(x) })),
  doctor: (d) => d.filter((x) => x._id === 'doctor').map((x) => ({ id: 'doctor', data: plain(x) })),
  concerns: (d) => d.filter((x) => x._type === 'concern').map((x) => ({ id: entryId(x._id, 'concern'), data: plain(x) })),
  howWeBegin: (d) => d.filter((x) => x._type === 'howWeBeginStep').map((x) => ({ id: entryId(x._id, 'step'), data: plain(x) })),
  services: (d) => d.filter((x) => x._type === 'service').map((x) => ({ id: entryId(x._id, 'service'), data: plain(x) })),
  faq: (d) => d.filter((x) => x._type === 'faq').map((x) => ({ id: entryId(x._id, 'faq'), data: plain(x) })),
  sources: (d) => d.filter((x) => x._type === 'source').map((x) => ({ id: entryId(x._id, 'source'), data: plain(x) })),
  notes: (d) =>
    d.filter((x) => x._type === 'note').map(({ slug, body, sourceSite, ...x }) => ({
      id: slug?.current,
      data: { ...plain(x), ...(sourceSite?._ref ? { sourceSite: entryId(sourceSite._ref, 'source') } : {}) },
    })),
  // One entry per article and language that has a body: "<slug>/<lang>", like src/content/notes/<slug>/<lang>.md.
  noteBodies: (d) =>
    d.filter((x) => x._type === 'note').flatMap((x) =>
      (['en', 'zh'] as const)
        .filter((lang) => (x.body?.[lang]?.length ?? 0) > 0)
        .map((lang) => ({ id: `${x.slug?.current}/${lang}`, data: {}, html: bodyToHtml(x.body[lang]) }))),
};

/** Astro content loader for one collection, filled from Sanity. */
export function sanityLoader(collection: keyof typeof collections): Loader {
  return {
    name: `sanity-${collection}`,
    load: async ({ store, parseData }) => {
      const entries = collections[collection](await allDocs());
      store.clear();
      for (const { id, data, html } of entries) {
        if (!id) throw new Error(`Sanity: a document in "${collection}" has no ID / 网址别名`);
        if (store.has(id)) throw new Error(`Sanity: two documents in "${collection}" share the ID "${id}"`);
        store.set({ id, data: await parseData({ id, data }), ...(html !== undefined ? { rendered: { html } } : {}) });
      }
    },
  };
}
