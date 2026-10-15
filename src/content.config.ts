// Content schemas. Field names mirror the future Sanity schema one-to-one (phase 3).
// The skeleton only defines `settings`; doctor / notes / services / faq come with the page batches.
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { TBC_PATTERN } from './lib/tbc';

const tbc = z.string().regex(TBC_PATTERN);
const orTbc = <T extends z.ZodType>(schema: T) => z.union([tbc, schema]);
/** Free text in both languages. Either side may be "TBC:x.x" (checklist item number). */
const localized = z.object({ en: z.string().min(1), zh: z.string().min(1) });

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
  }),
});

export const collections = { settings };
