/* 后台左侧菜单（顺序见交接 2026-10-16 批次 3 第 5 条） */
import type { StructureBuilder } from 'sanity/structure';

// 每个 list / listItem 都要写英文 id：Sanity 从标题推导 id，中文标题推不出来会报错（窗边有光踩过）
const singleton = (S: StructureBuilder, id: string, title: string) =>
  S.listItem().id(id).title(title).child(S.document().schemaType(id).documentId(id).title(title));

const list = (S: StructureBuilder, type: string, title: string, field: string, direction: 'asc' | 'desc' = 'asc') =>
  S.listItem().id(type).title(title).schemaType(type).child(
    S.documentTypeList(type).id(type).title(title).defaultOrdering([{ field, direction }]));

export const structure = (S: StructureBuilder) =>
  S.list().id('content').title('内容').items([
    singleton(S, 'settings', '诊所资料'),
    singleton(S, 'doctor', '医生资料'),
    singleton(S, 'privacyNotice', '私隐声明'),
    S.divider(),
    list(S, 'note', '文章', 'publishedAt', 'desc'),
    list(S, 'service', '服务', 'order'),
    list(S, 'faq', 'FAQ', 'order'),
    list(S, 'howWeBeginStep', '如何开始', 'order'),
    list(S, 'concern', '常见困扰', 'order'),
    S.divider(),
    list(S, 'source', '来源网站', 'name.zh'),
  ]);
