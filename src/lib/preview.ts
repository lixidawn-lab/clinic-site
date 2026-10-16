// ONE switch for every preview-only label: TBC (empty field), 初稿 (draft), 待涵倪审阅 (pending review),
// 待取得转载许可 (pending republishing permission). The production build renders none of them
// (checked by `npm run check:production`).
// Default: follows PUBLIC_ALLOW_INDEXING — labels show while the site is noindex (preview site) and
// disappear once indexing is on (production). PUBLIC_SHOW_PREVIEW_LABELS=true / false overrides this,
// e.g. to look at the production version locally.
import { allowIndexing } from './indexing';

const flag = import.meta.env.PUBLIC_SHOW_PREVIEW_LABELS;
export const showPreviewLabels = flag === 'true' ? true : flag === 'false' ? false : !allowIndexing;
