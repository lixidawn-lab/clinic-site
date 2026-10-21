import { defineField, defineType } from 'sanity';
import { localized, orderField } from './fields';

/* 服务、FAQ、如何开始、常见困扰、来源网站。对应网站 src/content/ 里同名的 JSON 文件 */

const confirmedField = (description: string) =>
  defineField({ name: 'confirmed', title: '已确认', type: 'boolean', initialValue: false, description });

const ordered = (title: string) => [{ title: '按排序数字', name: 'order', by: [{ field: 'order', direction: 'asc' as const }] }];

export const service = defineType({
  name: 'service',
  title: '服务',
  type: 'document',
  description: '「预约与诊所」页的服务列表。只写诊所实际提供的服务（资料清单 4.1）。',
  fields: [
    localized({ name: 'title', title: '服务名称' }),
    orderField,
    confirmedField('涵倪确认诊所实际提供这项服务后打开。没打开时，预览站在旁边标「初稿 · 待确认」；网站正式开放前，所有服务都要确认。'),
  ],
  orderings: ordered('服务'),
  preview: {
    select: { title: 'title.zh', order: 'order', confirmed: 'confirmed' },
    prepare: ({ title, order, confirmed }) => ({ title, subtitle: [order, confirmed ? '已确认' : '初稿 · 待确认'].join(' · ') }),
  },
});

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  description: '「预约与诊所」页的常见问题。',
  fields: [
    localized({ name: 'question', title: '问题' }),
    localized({ name: 'answer', title: '回答', rows: 5, description: '还没有答案时填「TBC:清单编号」，例如 TBC:2.5：预览站显示黄色「待补充」，正式站不显示这一题。' }),
    orderField,
    confirmedField('涵倪确认这条回答后打开。没打开时，预览站在问题旁边标「初稿 · 待确认」；网站正式开放前，每一条都要确认。'),
  ],
  orderings: ordered('FAQ'),
  preview: {
    select: { title: 'question.zh', order: 'order', confirmed: 'confirmed' },
    prepare: ({ title, order, confirmed }) => ({ title, subtitle: [order, confirmed ? '已确认' : '初稿 · 待确认'].join(' · ') }),
  },
});

export const howWeBeginStep = defineType({
  name: 'howWeBeginStep',
  title: '如何开始',
  type: 'document',
  description: '首页和「预约与诊所」页的「如何开始」步骤。',
  fields: [
    localized({ name: 'title', title: '步骤标题' }),
    localized({ name: 'body', title: '说明', rows: 3 }),
    orderField,
  ],
  orderings: ordered('步骤'),
  preview: {
    select: { title: 'title.zh', order: 'order' },
    prepare: ({ title, order }) => ({ title: `${order ?? '?'}. ${title ?? ''}` }),
  },
});

export const concern = defineType({
  name: 'concern',
  title: '常见困扰',
  type: 'document',
  description: '首页「常见困扰」的标签，目前都链接到文章列表。只是入口，不是诊断。',
  fields: [
    localized({ name: 'label', title: '标签文字' }),
    orderField,
  ],
  orderings: ordered('标签'),
  preview: {
    select: { title: 'label.zh', subtitle: 'label.en', order: 'order' },
    prepare: ({ title, subtitle, order }) => ({ title: `${order ?? '?'}. ${title ?? ''}`, subtitle }),
  },
});

export const source = defineType({
  name: 'source',
  title: '来源网站',
  type: 'document',
  description: '转载文章的原出处。每个网站只写一次，文章里选它就行。',
  fields: [
    localized({ name: 'name', title: '网站名称', description: '来源卡片上「本文原载于 …」的名称。' }),
    localized({ name: 'description', title: '介绍', rows: 3, description: '一两句话，显示在来源卡片上。' }),
    defineField({ name: 'url', title: '网站首页', type: 'url', validation: (rule) => rule.required().uri({ scheme: ['https', 'http'] }) }),
  ],
  preview: { select: { title: 'name.zh', subtitle: 'url' } },
});
