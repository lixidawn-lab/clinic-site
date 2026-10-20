import { defineField, defineType, type SlugRule } from 'sanity';
import { dateOptions, localized } from './fields';

/*
 * 文章（Doctor's Notes）。网址 /en/notes/<别名>/ 和 /zh/notes/<别名>/。
 * 对应网站的 src/content/notes.json 和 src/content/notes/<别名>/<语言>.md。
 * 来源规则见 CLAUDE.md「文章来源规则」。
 */

type NoteDoc = { source?: string; permission?: boolean };
const isOriginal = (doc?: NoteDoc) => !doc?.source || doc.source === 'original';

// 转载的文章（不是原创）必须填来源网站、原文链接、原文日期
const sourceRequired = <R extends { custom: (fn: (v: unknown, ctx: { document?: unknown }) => true | string) => R }>(rule: R) =>
  rule.custom((v, ctx) => isOriginal(ctx.document as NoteDoc | undefined) || !!v || '转载的文章要填这一项');

export const note = defineType({
  name: 'note',
  title: '文章',
  type: 'document',
  groups: [
    { name: 'content', title: '内容', default: true },
    { name: 'settings', title: '设置' },
    { name: 'source', title: '来源' },
  ],
  fields: [
    localized({ name: 'title', title: '标题', group: 'content', description: '英文标题也必填。' }),
    defineField({
      name: 'slug',
      title: '网址别名',
      type: 'slug',
      group: 'content',
      description: '文章网址的最后一段，中英文共用，例如 the-second-glass-of-water。只用小写英文、数字和减号。点「生成」会按英文标题自动填。文章发布后不要再改，不然旧链接会打不开。',
      options: { source: 'title.en', maxLength: 80 },
      validation: (rule: SlugRule) =>
        rule.required().custom((v) => !v?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.current) || '只用小写英文、数字和减号，例如 my-first-note'),
    }),
    localized({ name: 'summary', title: '摘要', group: 'content', rows: 4, description: '文章列表和搜索结果里显示的一两句话。英文摘要也必填：英文页面没有英文正文时，会显示英文摘要并引导读者看中文原文。' }),
    defineField({
      name: 'body',
      title: '正文',
      type: 'object',
      group: 'content',
      description: '中文正文必填（没有转载许可的媒体文章除外）；英文正文可以先不写。',
      fields: [
        defineField({
          name: 'zh',
          title: '中文正文',
          type: 'noteBody',
          validation: (rule) =>
            rule.custom((v: unknown[] | undefined, ctx) =>
              (ctx.document as NoteDoc | undefined)?.source === 'media' || (v?.length ?? 0) > 0 || '中文正文必填'),
        }),
        defineField({ name: 'en', title: 'English body', type: 'noteBody', description: '可以不填。' }),
      ],
    }),
    defineField({
      name: 'topic',
      title: '主题',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: '情绪与心理健康', value: 'emotions' },
          { title: '理解症状与困扰', value: 'symptoms' },
          { title: '儿童与家庭', value: 'family' },
          { title: '临床观察与思考', value: 'clinical' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'publishedAt', title: '发布日期', type: 'date', group: 'settings', options: dateOptions, validation: (rule) => rule.required() }),
    defineField({
      name: 'reviewedAt',
      title: '审阅日期',
      type: 'date',
      group: 'settings',
      options: dateOptions,
      description: '涵倪最后一次从医学角度审阅这篇文章的日期，文章页会显示「最后审阅」。还没审阅就留空。',
    }),
    defineField({
      name: 'featured',
      title: '精选',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: '打开后放在首页和文章列表最上面的大卡片里。只开一篇。',
    }),
    defineField({
      name: 'needsReview',
      title: '待审阅',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: '打开时，预览站的文章开头会标「待涵倪审阅」，提醒还没看过；正式站不显示。审阅完关掉，并填上「审阅日期」。',
    }),
    defineField({
      name: 'source',
      title: '来源',
      type: 'string',
      group: 'source',
      initialValue: 'original',
      options: {
        list: [
          { title: '涵倪原创（第一次发表在这个网站）', value: 'original' },
          { title: '旧博客', value: 'blog' },
          { title: '媒体或机构报道', value: 'media' },
          { title: '窗边有光', value: 'chuangbian' },
        ],
        layout: 'radio',
      },
      description: '不是原创的文章，开头会有来源卡片：「本文原载于 …」和「阅读原文」按钮。',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceSite',
      title: '来源网站',
      type: 'reference',
      to: [{ type: 'source' }],
      group: 'source',
      description: '在「来源网站」里先建好，这里选它。',
      hidden: ({ document }) => isOriginal(document as NoteDoc),
      validation: sourceRequired,
    }),
    defineField({
      name: 'sourceUrl',
      title: '原文链接',
      type: 'url',
      group: 'source',
      hidden: ({ document }) => isOriginal(document as NoteDoc),
      validation: (rule) => sourceRequired(rule.uri({ scheme: ['https', 'http'] })),
    }),
    defineField({
      name: 'sourceDate',
      title: '原文发表日期',
      type: 'date',
      group: 'source',
      options: dateOptions,
      hidden: ({ document }) => isOriginal(document as NoteDoc),
      validation: sourceRequired,
    }),
    defineField({
      name: 'permission',
      title: '已取得转载许可',
      type: 'boolean',
      group: 'source',
      initialValue: false,
      description: '媒体或机构的文章，要取得对方同意才能放全文。没打开时，网站上只显示摘要和「阅读原文」按钮，预览站另外标「待取得转载许可」。',
      hidden: ({ document }) => isOriginal(document as NoteDoc),
    }),
    defineField({
      name: 'internalNote',
      title: '内部备注',
      type: 'text',
      rows: 4,
      group: 'settings',
      description: '给编辑看的备注（例如待确认的问题），网站上不会显示。不要写患者资料。',
    }),
  ],
  orderings: [{ title: '发布日期（新→旧）', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.zh', date: 'publishedAt', featured: 'featured', needsReview: 'needsReview', hasEn: 'body.en' },
    prepare: ({ title, date, featured, needsReview, hasEn }) => ({
      title: title || '（未填标题）',
      subtitle: [date?.replace(/-/g, '.'), featured && '精选', needsReview && '待审阅', !hasEn?.length && '无英文正文'].filter(Boolean).join(' · '),
    }),
  },
});
