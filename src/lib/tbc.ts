// Missing clinic information is stored as "TBC:<checklist no.>", e.g. "TBC:3.2".
// "TBC:?" means the checklist number hasn't been assigned yet.
export const TBC_PATTERN = /^TBC:(\?|\d+(\.\d+)*)$/;

export function isTbc(value: unknown): boolean {
  return typeof value === 'string' && TBC_PATTERN.test(value);
}

/** "TBC:3.2" → "3.2"; "TBC:?" → null. */
export function tbcRef(value: string): string | null {
  const ref = value.slice('TBC:'.length);
  return ref === '?' ? null : ref;
}
