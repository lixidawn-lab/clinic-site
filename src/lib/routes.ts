// The four main pages (CLAUDE.md rule 2). Slugs are shared by both languages.
export const routes = {
  home: '',
  about: 'about',
  notes: 'notes',
  appointments: 'appointments',
} as const;

// Legal pages (exception to rule 2, decided 2026-10-23): not in the main nav, linked from the footer only.
export const legalRoutes = {
  privacy: 'privacy',
} as const;

export type PageKey = keyof typeof routes;
// The logo links home, so the menu lists the other three (homepage design).
export const navOrder: PageKey[] = ['about', 'notes', 'appointments'];
