import { defineField, defineType } from 'sanity';
import { dateOptions } from './fields';

/*
 * 私隐声明（全站只有一份）。网址 /en/privacy/ 和 /zh/privacy/，只在页脚链接。
 * 马来西亚《个人资料保护法》要求通知同时有国语（马来文）和英文，所以两种语言的页面都会同时显示马来文版本。
 * 对应网站的 src/content/privacy.json。页面标题和「最后更新」这几个字在网站的 src/i18n/ 里，这里只写正文。
 */
const body = (name: 'zh' | 'en' | 'ms', title: string) =>
  defineField({ name, title, type: 'legalBody', validation: (rule) => rule.required().min(1) });

export const privacyNotice = defineType({
  name: 'privacyNotice',
  title: '私隐声明',
  type: 'document',
  fields: [
    defineField({
      name: 'lastUpdated',
      title: '最后更新',
      type: 'date',
      options: dateOptions,
      description: '页面顶部显示「最后更新：…」。改了正文就把日期改成发布那天。',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: '正文',
      type: 'object',
      description: '三种语言都必填。中文页面显示中文和马来文，英文页面显示英文和马来文。',
      fields: [body('zh', '中文'), body('en', 'English'), body('ms', 'Bahasa Malaysia（马来文）')],
    }),
  ],
  preview: { prepare: () => ({ title: '私隐声明' }) },
});
