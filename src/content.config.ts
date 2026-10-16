// Content schemas. Field names mirror the future Sanity schema one-to-one (phase 3).
// Every field here is something Hanni will be able to edit in Sanity later.
import { defineCollection } from 'astro:content';
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
    registrations: z.array(localized),
    // Checklist 5.3: whether the MMC / NSR numbers are shown on the site.
    showRegistrations: z.boolean(),
    languages: z.array(localized),
    experience: localized,
    // Other practice location (MMC). Kept for reference; shown only when `show` is true.
    alsoPractises: z.object({ name: localized, show: z.boolean() }),
    // Hanni's own introduction. `lead` is the opening line, `body` the rest (paragraphs split by a blank line).
    bio: z.object({
      en: z.object({ lead: z.string().min(1), body: z.string().min(1) }),
      zh: z.object({ lead: z.string().min(1), body: z.string().min(1) }),
    }),
    // Areas of focus (PRD 3.1 / 3.2). Clinical interests only — never listed as services (CLAUDE.md rule 3).
    clinicalInterests: z.array(localized),
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
    // Where the article was first published (e.g. Hanni's blog).
    externalUrl: z.url().optional(),
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

export const collections = { settings, doctor, howWeBegin, services, faq, notes, noteBodies };
