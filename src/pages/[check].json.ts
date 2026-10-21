// Content status for `npm run check:production` (scripts/check-production.mjs): content that is not confirmed yet.
// Only generated when CHECK_CONTENT_STATUS=true (set by check:production), so it never ends up on the real site.
// Production pages hide the preview labels, so the check can't see "unconfirmed" in the HTML; it reads this file instead.
// Decided 2026-10-20 (灵晞): unconfirmed FAQ answers must fail the production check. FAQs whose answer is still TBC
// in both languages are left out: production hides them anyway.
import type { APIRoute } from 'astro';
import { getFaq } from '../lib/content';
import { isTbc } from '../lib/tbc';

export function getStaticPaths() {
  const on = (import.meta.env.CHECK_CONTENT_STATUS ?? process.env.CHECK_CONTENT_STATUS) === 'true';
  return on ? [{ params: { check: 'content-status' } }] : [];
}

export const GET: APIRoute = async () => {
  const faq = await getFaq();
  return Response.json({ unconfirmedFaq: faq.filter((f) => !f.confirmed && !(isTbc(f.answer.en) && isTbc(f.answer.zh))).map((f) => f.question.zh) });
};
