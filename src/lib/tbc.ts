// Missing clinic information is stored as "TBC:<checklist no.>", e.g. "TBC:3.2"
// (item numbers from docs/checklist.md). Every TBC must carry its checklist number.
import { allowIndexing } from './indexing';

export const TBC_PATTERN = /^TBC:\d+\.\d+$/;

export function isTbc(value: unknown): boolean {
  return typeof value === 'string' && TBC_PATTERN.test(value);
}

/** "TBC:3.2" → "3.2". */
export function tbcRef(value: string): string {
  return value.slice('TBC:'.length);
}

/**
 * Plan A (decided 2026-10-15): the preview site shows empty fields as yellow TBC markers;
 * the production site hides them completely (the whole row / item / block disappears).
 * Default: follows PUBLIC_ALLOW_INDEXING — markers show while the site is noindex (preview)
 * and are hidden once indexing is on (production).
 * PUBLIC_SHOW_TBC=true / false overrides this, e.g. to preview the production look.
 */
const showTbcFlag = import.meta.env.PUBLIC_SHOW_TBC;
export const showTbc = showTbcFlag === 'true' ? true : showTbcFlag === 'false' ? false : !allowIndexing;

/** Whether a value should be rendered at all: real values always, TBC values only on the preview site. */
export function isShown(value: unknown): boolean {
  return !isTbc(value) || showTbc;
}

/** Value for structured data / meta tags: never a TBC placeholder. */
export function known(value: string): string | undefined {
  return isTbc(value) ? undefined : value;
}
