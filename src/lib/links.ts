import { localizedPath, type Locale } from '../i18n';
import { routes } from './routes';
import { isTbc } from './tbc';

/** wa.me link with an optional prefilled message. Null when the number is still TBC. */
export function whatsappHref(number: string, message?: string): string | null {
  if (isTbc(number)) return null;
  const base = `https://wa.me/${number}`;
  return message && !isTbc(message) ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/**
 * How the WhatsApp number is shown on the page. The stored value is digits only (for wa.me), so when it is the
 * same number as the phone, show the phone's readable format ("+60 12-891 0219") instead of asking for it twice.
 */
export function whatsappDisplay(number: string, phone: string): string {
  if (isTbc(number)) return number;
  return !isTbc(phone) && phone.replace(/\D/g, '') === number ? phone : `+${number}`;
}

/** tel: link. Null when the phone number is still TBC. */
export function telHref(phone: string): string | null {
  if (isTbc(phone)) return null;
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Target of the site-wide "Book an Appointment" button: WhatsApp when the number is known, else the booking section. */
export function bookHref(whatsapp: string, message: string, locale: Locale): string {
  return whatsappHref(whatsapp, message) ?? `${localizedPath(locale, routes.appointments)}#book`;
}

/** Attributes for links that leave the site. */
export const external = { rel: 'noopener', target: '_blank' } as const;
