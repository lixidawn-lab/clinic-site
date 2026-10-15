// The four main pages (CLAUDE.md rule 2). Slugs are shared by both languages.
export const routes = {
  home: '',
  about: 'about',
  notes: 'notes',
  appointments: 'appointments',
} as const;

export type PageKey = keyof typeof routes;
export const navOrder: PageKey[] = ['home', 'about', 'notes', 'appointments'];
