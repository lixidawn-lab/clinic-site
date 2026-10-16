// Content schemas. Field names mirror the future Sanity schema one-to-one (phase 3).
// Every field here is something Hanni will be able to edit in Sanity later.
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TBC_PATTERN } from './lib/tbc';

const tbc = z.string().regex(TBC_PATTERN);
const orTbc = <T extends z.ZodType>(schema: T) => z.union([tbc, schema]);
/** Free text in both languages. Either side may be "TBC:x.x" (checklist item number). */
const localized = z.object({ en: z.string().min(1), zh: z.string().min(1) });
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const settings = defineCollection({
  loader: file('src/content/settings.json'),
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
    // Footer privacy notice (PRD 7.2). Reuses the clinic's existing PDPA notice if there is one.
    privacyNotice: localized,
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
  loader: file('src/content/doctor.json'),
  schema: z.object({
    name: localized,
    title: localized,
    qualifications: z.array(localized),
    // `shortLabel` is used in the homepage credentials list ("MMC Reg. 59390").
    registrations: z.array(z.object({ label: localized, shortLabel: localized, number: z.string().min(1) })),
    // Checklist 5.3: whether the MMC / NSR numbers are shown on the site.
    showRegistrations: z.boolean(),
    // Each language keeps its own order (zh: 华语、英语、粤语; en: English, Mandarin, Cantonese).
    languages: z.object({ en: z.array(z.string().min(1)), zh: z.array(z.string().min(1)) }),
    experience: localized,
    // Other practice location (MMC). Kept for reference; shown only when `show` is true.
    alsoPractises: z.object({ name: localized, show: z.boolean() }),
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
      verified: z.boolean(),
    })),
  }),
});

// Home "Common Concerns" (PRD 3.1): entry points, not diagnoses. For now they all link to Doctor's Notes.
const concerns = defineCollection({
  loader: file('src/content/concerns.json'),
  schema: z.object({ order: z.number().int(), label: localized }),
});

// Home "How We Begin" steps (PRD 3.1).
const howWeBegin = defineCollection({
  loader: file('src/content/howWeBegin.json'),
  schema: z.object({ order: z.number().int(), title: localized, body: localized }),
});

const services = defineCollection({
  loader: file('src/content/services.json'),
  schema: z.object({
    order: z.number().int(),
    title: localized,
    // Confirmed by Hanni (checklist 4.1). Unconfirmed ones carry a "draft" marker on the preview site.
    confirmed: z.boolean(),
  }),
});

const faq = defineCollection({
  loader: file('src/content/faq.json'),
  schema: z.object({
    order: z.number().int(),
    question: localized,
    answer: localized,
    confirmed: z.boolean(),
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
  loader: file('src/content/sources.json'),
  schema: z.object({ name: localized, description: localized, url: z.url() }),
});

// Article metadata. The body lives in `noteBodies` (one Markdown file per language).
const notes = defineCollection({
  loader: file('src/content/notes.json'),
  schema: z.object({
    title: localized,
    summary: localized,
    topic: z.enum(noteTopics),
    publishedAt: isoDate,
    // Last medical review by Hanni. Left out until she has reviewed the article.
    reviewedAt: isoDate.optional(),
    featured: z.boolean(),
    // Preview site shows "待涵倪审阅" at the top of the article; production never does.
    needsReview: z.boolean().default(false),
    source: z.enum(noteSourceTypes),
    // Source website (src/content/sources.json); its name is the "sourceName" on the source card. Not needed for `original`.
    sourceSite: reference('sources').optional(),
    sourceUrl: z.url().optional(),
    sourceDate: isoDate.optional(),
    // Permission to republish the full text (matters for `media`).
    permission: z.boolean().default(false),
  }).refine((n) => n.source === 'original' || (n.sourceSite && n.sourceUrl && n.sourceDate), {
    message: 'Non-original articles need sourceSite, sourceUrl and sourceDate',
  }),
});

// src/content/notes/<slug>/<lang>.md → id "<slug>/<lang>".
const noteBodies = defineCollection({
  loader: glob({
    pattern: '*/{en,zh}.md',
    base: './src/content/notes',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({}),
});

export const collections = { settings, doctor, concerns, howWeBegin, services, faq, sources, notes, noteBodies };
