// Search-engine indexing is OFF unless PUBLIC_ALLOW_INDEXING is exactly "true".
// Turning it on needs explicit sign-off from the site owner (CLAUDE.md rule 6).
export const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
