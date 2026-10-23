// Content schemas. Field names mirror the Sanity schema in studio/schemaTypes/ one-to-one.
// Where the content comes from (src/lib/sanity.ts):
// - default: Sanity (the source of truth since the batch 3 migration; Hanni edits it in the Studio).
// - CONTENT_SOURCE=local: the JSON / Markdown files in src/content/, for offline work. They are a snapshot from
//   the migration (2026-10) and do NOT follow later edits in Sanity.
// - CONTENT_SOURCE=<file>.ndjson: a Sanity export (`sanity dataset export`).
// The zod schemas below validate the data either way, so a bad value fails the build instead of reaching the site.
import { defineCollection, reference } from 'astro:content';
import { file, glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { sanityLoader } from './lib/sanity';
import { TBC_PATTERN } from './lib/tbc';

const local = (import.meta.env.CONTENT_SOURCE ?? process.env.CONTENT_SOURCE) === 'local';
const source = (collection: Parameters<typeof sanityLoader>[0], localLoader: () => Loader) =>
  local ? localLoader() : sanityLoader(collection);

const tbc = z.string().regex(TBC_PATTERN);
const orTbc = <T extends z.ZodType>(schema: T) => z.union([tbc, schema]);
/** Free text in both languages. Either side may be "TBC:x.x" (checklist item number). */
const localized = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const settings = defineCollection({
  loader: source('settings', () => file('src/content/settings.json')),
  schema: z.object({
    clinicName: localized,
    // Line under the logo name in the header.
    tagline: localized,
    address: localized,
    phone: orTbc(z.string().regex(/^\+?[\d -]{7,20}$/)),
    // International format, digits only, no "+" (what wa.me expects), e.g. 60123456789.
    whatsapp: orTbc(z.string().regex(/^[1-9]\d{7,14}$/)),
    hours: localized,
    mapUrl: orTbc(z.url()),
    parking: localized,
    fees: localized,
    payment: localized,
    mabApprovalNo: z.string().min(1),
    // Shown next to the clinic information (checklist 4.7).
    emergencyNotice: localized,
    // Appointments & Clinic blocks that have no copy yet (PRD 3.4): hidden in production while TBC.
    beforeYourVisit: localized,
    followUpCare: localized,
    bookingMessage: localized,
    // Footer links + JSON-LD sameAs.
    socialLinks: z.array(z.object({
      platform: z.enum(['instagram', 'youtube', 'facebook']),
      url: z.url(),
    })),
  }),
});

const doctor = defineCollection({
  loader: source('doctor', () => file('src/content/doctor.json')),
  schema: z.object({
    name: localized,
    title: localized,
    qualifications: z.array(localized),
    // `shortLabel` is used in the homepage credentials list ("MMC Reg. 59390").
    registrations: z.array(z.object({ label: localized, shortLabel: localized, number: z.string().min(1) })),
    // Checklist 5.3: whether the MMC / NSR numbers are shown on the site.
    showRegistrations: z.boolean().default(false),
    // Each language keeps its own order (zh: 华语、英语、粤语; en: English, Mandarin, Cantonese).
    languages: z.object({ en: z.array(z.string().min(1)), zh: z.array(z.string().min(1)) }),
    experience: localized,
    // Other practice location (MMC). Kept for reference; shown only when `show` is true.
    alsoPractises: z.object({ name: localized, show: z.boolean().default(false) }),
    // Hanni's own introduction. `lead` is the large opening line, `body` the rest (paragraphs split by a blank line).
    bio: z.object({
      en: z.object({ lead: z.string().min(1), body: z.string().min(1) }),
      zh: z.object({ lead: z.string().min(1), body: z.string().min(1) }),
    }),
    // Areas of focus (PRD 3.1 / 3.2). Clinical interests only — never listed as services (CLAUDE.md rule 3).
    // `id` is the anchor on the About page (/about/#<id>) that the homepage list links to.
    clinicalInterests: z.array(localized.extend({ id: z.string().regex(/^[a-z0-9-]+$/) })),
    approach: localized.optional(),
    publications: z.array(z.object({
      title: z.string().min(1),
      venue: z.string().min(1),
      date: isoDate,
      url: z.url().optional(),
      role: z.enum(['author', 'co-author', 'interviewee']),
      // Only verified publications are rendered (PRD 3.2).
      verified: z.boolean().default(false),
    })),
  }),
});

// Home "Common Concerns" (PRD 3.1): entry points, not diagnoses. For now they all link to Doctor's Notes.
const concerns = defineCollection({
  loader: source('concerns', () => file('src/content/concerns.json')),
  schema: z.object({ order: z.number().int(), label: localized }),
});

// Home "How We Begin" steps (PRD 3.1).
const howWeBegin = defineCollection({
  loader: source('howWeBegin', () => file('src/content/howWeBegin.json')),
  schema: z.object({ order: z.number().int(), title: localized, body: localized }),
});

const services = defineCollection({
  loader: source('services', () => file('src/content/services.json')),
  schema: z.object({
    order: z.number().int(),
    title: localized,
    // Confirmed by Hanni (checklist 4.1). Unconfirmed ones carry a "draft" marker on the preview site.
    confirmed: z.boolean().default(false),
  }),
});

const faq = defineCollection({
  loader: source('faq', () => file('src/content/faq.json')),
  schema: z.object({
    order: z.number().int(),
    question: localized,
    answer: localized,
    confirmed: z.boolean().default(false),
  }),
});

export const noteTopics = ['emotions', 'symptoms', 'family', 'clinical'] as const;

/**
 * Where an article comes from (decided 2026-10-16, see CLAUDE.md "文章来源规则"):
 * - original:   Hanni's own article, first published here. Full text, canonical = this site.
 * - blog:       from Hanni's old blog. Full text + source card, canonical = this site.
 * - chuangbian: from 窗边有光. Full text + source card, canonical = the 窗边有光 original.
 * - media:      press / institution. Full text only with `permission: true`; otherwise summary + "read the original".
 *               Canonical = the media original.
 */
export const noteSourceTypes = ['original', 'blog', 'chuangbian', 'media'] as const;

// One entry per source website: name and a one-or-two-sentence introduction, written once and shared by its articles.
const sources = defineCollection({
  loader: source('sources', () => file('src/content/sources.json')),
  schema: z.object({ name: localized, description: localized, url: z.url() }),
});

// Article metadata. The body lives in `noteBodies` (one Markdown file per language).
const notes = defineCollection({
  loader: source('notes', () => file('src/content/notes.json')),
  schema: z.object({
    title: localized,
    summary: localized,
    topic: z.enum(noteTopics),
    publishedAt: isoDate,
    // Last medical review by Hanni. Left out until she has reviewed the article.
    reviewedAt: isoDate.optional(),
    featured: z.boolean().default(false),
    // Preview site shows "待涵倪审阅" at the top of the article; production never does.
    needsReview: z.boolean().default(false),
    source: z.enum(noteSourceTypes),
    // Source website (src/content/sources.json); its name is the "sourceName" on the source card. Not needed for `original`.
    sourceSite: reference('sources').optional(),
    sourceUrl: z.url().optional(),
    sourceDate: isoDate.optional(),
    // Permission to republish the full text (matters for `media`).
    permission: z.boolean().default(false),
    // Note for the editors (open questions about the article). Never shown on the site.
    internalNote: z.string().optional(),
  }).refine((n) => n.source === 'original' || (n.sourceSite && n.sourceUrl && n.sourceDate), {
    message: 'Non-original articles need sourceSite, sourceUrl and sourceDate',
  }),
});

// Privacy notice (PRD 7.2), the legal page /<lang>/privacy/ linked from the footer. Malaysia's PDPA wants the notice
// in Malay and English, so both language pages also show the Malay version (`ms`). `body` is HTML
// (Sanity: Portable Text, converted in src/lib/sanity.ts).
const privacy = defineCollection({
  loader: source('privacy', () => file('src/content/privacy.json')),
  schema: z.object({
    lastUpdated: isoDate,
    body: z.object({ en: z.string().min(1), zh: z.string().min(1), ms: z.string().min(1) }),
  }),
});

// src/content/notes/<slug>/<lang>.md (or the Sanity article body) → id "<slug>/<lang>".
const noteBodies = defineCollection({
  loader: source('noteBodies', () => glob({
    pattern: '*/{en,zh}.md',
    base: './src/content/notes',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  })),
  schema: z.object({}),
});

export const collections = { settings, doctor, privacy, concerns, howWeBegin, services, faq, sources, notes, noteBodies };
