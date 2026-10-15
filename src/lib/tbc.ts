// Missing clinic information is stored as "TBC:<checklist no.>", e.g. "TBC:3.2"
// (item numbers from docs/checklist.md). Every TBC must carry its checklist number.
export const TBC_PATTERN = /^TBC:\d+\.\d+$/;

export function isTbc(value: unknown): boolean {
  return typeof value === 'string' && TBC_PATTERN.test(value);
}

/** "TBC:3.2" → "3.2". */
export function tbcRef(value: string): string {
  return value.slice('TBC:'.length);
}
