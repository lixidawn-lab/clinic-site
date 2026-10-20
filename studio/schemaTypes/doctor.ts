import { defineArrayMember, defineField, defineType } from 'sanity';
import { dateOptions, localized, localizedList, tbcCheck } from './fields';

/* 医生资料（全站只有一份）。对应网站的 src/content/doctor.json */

const bioLang = (name: 'zh' | 'en', title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      defineField({ name: 'lead', title: '开头大字', type: 'text', rows: 2, description: '首页和「关于涵倪」页最上面的一句大字。', validation: (rule) => rule.required() }),
      defineField({ name: 'body', title: '其余介绍', type: 'text', rows: 12, description: '段落之间空一行。', validation: (rule) => rule.required() }),
    ],
  });

export const doctor = defineType({
  name: 'doctor',
  title: '医生资料',
  type: 'document',
  groups: [
    { name: 'profile', title: '基本资料', default: true },
    { name: 'credentials', title: '资历与注册' },
    { name: 'bio', title: '介绍与关注领域' },
    { name: 'publications', title: '外部发表' },
  ],
  fields: [
    localized({ name: 'name', title: '名字', group: 'profile', description: '全站统一用这个写法（资料清单 5.1）。' }),
    localized({ name: 'title', title: '头衔', group: 'profile', tbc: '1.3', description: '名字下面的一行，必须和注册信息一致。' }),
    localizedList({ name: 'languages', title: '看诊语言', group: 'profile', description: '每种语言各自排序，例如中文「华语、英语、粤语」，英文「English, Mandarin, Cantonese」。' }),
    localized({ name: 'experience', title: '经验', group: 'profile', description: '例如「10 年以上，公立及私立医院」。' }),
    defineField({
      name: 'alsoPractises',
      title: '其他执业地点',
      group: 'profile',
      type: 'object',
      fields: [
        localized({ name: 'name', title: '名称' }),
        defineField({ name: 'show', title: '在网站上显示', type: 'boolean', initialValue: false }),
      ],
    }),
    defineField({
      name: 'qualifications',
      title: '学历与专业资格',
      group: 'credentials',
      type: 'array',
      description: '完整正式写法，包括颁发机构和年份（资料清单 5.2）。可以拖动排序。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'qualification',
          title: '资格',
          fields: [
            defineField({ name: 'zh', title: '中文', type: 'string', validation: (rule) => rule.required().custom(tbcCheck) }),
            defineField({ name: 'en', title: 'English', type: 'string', validation: (rule) => rule.required().custom(tbcCheck) }),
          ],
          preview: { select: { title: 'zh', subtitle: 'en' } },
        }),
      ],
    }),
    defineField({
      name: 'registrations',
      title: '注册编号',
      group: 'credentials',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'registration',
          title: '注册',
          fields: [
            localized({ name: 'label', title: '名称', description: '「关于涵倪」页用的完整名称，例如「马来西亚医药理事会正式注册号」。' }),
            localized({ name: 'shortLabel', title: '简称', description: '首页资历条用的短名称，例如「MMC 注册号」。' }),
            defineField({ name: 'number', title: '编号', type: 'string', validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: 'label.zh', subtitle: 'number' } },
        }),
      ],
    }),
    defineField({
      name: 'showRegistrations',
      title: '在网站上显示注册编号',
      group: 'credentials',
      type: 'boolean',
      initialValue: true,
      description: '资料清单 5.3。',
    }),
    defineField({
      name: 'bio',
      title: '自我介绍',
      group: 'bio',
      type: 'object',
      fields: [bioLang('zh', '中文'), bioLang('en', 'English')],
    }),
    defineField({
      name: 'clinicalInterests',
      title: '关注领域',
      group: 'bio',
      type: 'array',
      description: '首页和「关于涵倪」页的「关注领域」列表。这里只写临床兴趣，不写成服务项目。可以拖动排序。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'clinicalInterest',
          title: '领域',
          fields: [
            defineField({ name: 'zh', title: '中文', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'en', title: 'English', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'id',
              title: '网址锚点',
              type: 'string',
              description: '首页的链接会跳到「关于涵倪」页的这一项。只用小写英文、数字和减号，例如 tf-cbt。改了它，旧的链接就跳不到这里了。',
              validation: (rule) => rule.required().regex(/^[a-z0-9-]+$/, { name: '小写英文、数字和减号' }),
            }),
          ],
          preview: { select: { title: 'zh', subtitle: 'en' } },
        }),
      ],
      validation: (rule) =>
        rule.custom((items?: { id?: string }[]) => {
          const ids = (items ?? []).map((i) => i.id).filter(Boolean);
          return new Set(ids).size === ids.length || '每一项的「网址锚点」不能重复';
        }),
    }),
    localized({ name: 'approach', title: '诊疗理念', group: 'bio', rows: 5, required: false, description: '可以不填。' }),
    defineField({
      name: 'publications',
      title: '外部发表',
      group: 'publications',
      type: 'array',
      description: '研究、文章、受访报道（资料清单 5.6）。只有打开「已核实」的才会显示在网站上。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'publication',
          title: '发表',
          fields: [
            defineField({ name: 'title', title: '标题', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'venue', title: '刊物或平台', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'date', title: '日期', type: 'date', options: dateOptions, validation: (rule) => rule.required() }),
            defineField({ name: 'url', title: '链接', type: 'url', description: '可以不填。' }),
            defineField({
              name: 'role', title: '我的角色', type: 'string',
              options: { list: [{ title: '第一作者', value: 'author' }, { title: '共同作者', value: 'co-author' }, { title: '受访者', value: 'interviewee' }], layout: 'radio', direction: 'horizontal' },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'verified', title: '已核实', type: 'boolean', initialValue: false, description: '确认署名和资料无误后再打开。' }),
          ],
          preview: {
            select: { title: 'title', venue: 'venue', date: 'date', verified: 'verified' },
            prepare: ({ title, venue, date, verified }) => ({ title, subtitle: [venue, date, verified ? '已核实' : '未核实（不显示）'].filter(Boolean).join(' · ') }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: '医生资料' }) },
});
