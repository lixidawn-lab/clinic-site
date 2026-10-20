/*
 * 涵倪诊所网站的后台（Sanity Studio）。字段和网站的 src/content.config.ts 一一对应。
 * 项目 ID 不是密码，直接写在这里；studio/.env 的 SANITY_STUDIO_PROJECT_ID 可以覆盖。
 */
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { zhHansLocale } from '@sanity/locale-zh-hans';
import { structure } from './structure';
import { schemaTypes, SINGLETONS } from './schemaTypes';
import { projectId, dataset } from './project';

export default defineConfig({
  name: 'clinic',
  title: '涵倪诊所网站',
  projectId,
  dataset,
  plugins: [structureTool({ title: '内容', structure }), zhHansLocale()],
  schema: {
    types: schemaTypes,
    // 诊所资料和医生资料只有一份，不能再新建
    templates: (prev) => prev.filter((t) => !SINGLETONS.includes(t.schemaType)),
  },
  document: {
    actions: (prev, ctx) =>
      SINGLETONS.includes(ctx.schemaType) ? prev.filter((a) => !['delete', 'duplicate', 'unpublish'].includes(a.action ?? '')) : prev,
    newDocumentOptions: (prev) => prev.filter((o) => !SINGLETONS.includes(o.templateId)),
  },
});
