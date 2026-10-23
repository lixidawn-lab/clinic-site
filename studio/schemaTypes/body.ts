import { defineArrayMember, defineField, defineType } from 'sanity';

/*
 * 文章正文（Portable Text）。网站在构建时把它转成 HTML（src/lib/sanity.ts 的 bodyToHtml），
 * 这里加了新的格式，那边也要一起加。
 */

const link = defineArrayMember({
  name: 'link',
  title: '链接',
  type: 'object',
  fields: [
    defineField({
      name: 'href',
      title: '网址',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['https', 'http', 'mailto', 'tel'] }),
    }),
  ],
});

const marks = {
  decorators: [
    { title: '加粗', value: 'strong' },
    { title: '斜体', value: 'em' },
  ],
  annotations: [link],
};
const lists = [
  { title: '项目符号', value: 'bullet' },
  { title: '编号', value: 'number' },
];

/** 引用框：左边一条绿线，里面可以有段落和列表（例如「拯救自己 · 第一步」那几段） */
export const callout = defineType({
  name: 'callout',
  title: '引用框',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: '内容',
      type: 'array',
      of: [defineArrayMember({ type: 'block', styles: [{ title: '正文', value: 'normal' }], lists, marks })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { content: 'content' },
    prepare: ({ content }) => {
      const first = (content ?? [])[0];
      const text = first?.children?.map((c: { text?: string }) => c.text ?? '').join('') ?? '';
      return { title: text || '（空的引用框）', subtitle: '引用框' };
    },
  },
});

export const noteBody = defineType({
  name: 'noteBody',
  title: '正文',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '正文', value: 'normal' },
        { title: '小标题', value: 'h2' },
        { title: '次级小标题', value: 'h3' },
        { title: '引用', value: 'blockquote' },
      ],
      lists,
      marks,
    }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({
      type: 'image',
      title: '图片',
      fields: [
        defineField({
          name: 'alt',
          title: '图片描述',
          type: 'string',
          description: '给看不见图片的读者（读屏软件）和搜索引擎看，一句话说明图片内容。',
          validation: (rule) => rule.required(),
        }),
        defineField({ name: 'caption', title: '图片说明', type: 'string', description: '显示在图片下面，可以不填。' }),
      ],
    }),
  ],
});

/** 法律页面（私隐声明）的正文：只有段落、小标题和列表 */
export const legalBody = defineType({
  name: 'legalBody',
  title: '正文',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '正文', value: 'normal' },
        { title: '小标题', value: 'h2' },
      ],
      lists,
      marks,
    }),
  ],
});
