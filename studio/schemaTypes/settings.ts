import { defineArrayMember, defineField, defineType } from 'sanity';
import { localized, plainText } from './fields';

/* 诊所资料（全站只有一份）。对应网站的 src/content/settings.json */
export const settings = defineType({
  name: 'settings',
  title: '诊所资料',
  type: 'document',
  groups: [
    { name: 'basic', title: '基本资料', default: true },
    { name: 'visit', title: '看诊与收费' },
    { name: 'notices', title: '说明文字' },
    { name: 'links', title: '社交账号' },
  ],
  fields: [
    localized({ name: 'clinicName', title: '诊所名称', group: 'basic', tbc: '3.1', description: '和执业证上的正式名称一致。网页标题、页脚和搜索结果都会用。' }),
    localized({ name: 'tagline', title: '页头副标题', group: 'basic', description: '网站左上角名字下面的一行小字。' }),
    localized({ name: 'address', title: '地址', group: 'basic', rows: 3, tbc: '3.2', description: '完整地址，包括邮编。' }),
    plainText({
      name: 'phone', title: '电话', group: 'basic', tbc: '3.3',
      description: '例如 +60 6-123 4567。网站上的「致电」按钮会拨这个号码。',
      pattern: /^\+?[\d -]{7,20}$/, patternMessage: '电话只能有数字、空格、减号，开头可以有 +',
    }),
    plainText({
      name: 'whatsapp', title: 'WhatsApp 号码', group: 'basic', tbc: '2.1',
      description: '国际格式，只写数字，不要 + 号和空格，例如 60123456789。网站上的「WhatsApp 预约」按钮会打开这个号码。',
      pattern: /^[1-9]\d{7,14}$/, patternMessage: '只写数字（8–15 位），开头是国家代码，例如 60123456789',
    }),
    localized({ name: 'hours', title: '营业时间', group: 'basic', rows: 4, tbc: '3.4', description: '可以分几行写，例如每天一行；包括午休和公共假期。' }),
    plainText({
      name: 'mapUrl', title: '地图链接', group: 'basic', tbc: '6.4',
      description: 'Google 地图上诊所页面的分享链接，网站上的「查看路线」会打开它。',
      pattern: /^https?:\/\/\S+$/, patternMessage: '要以 https:// 开头',
    }),
    localized({ name: 'parking', title: '停车与交通', group: 'visit', rows: 3, tbc: '3.5' }),
    localized({ name: 'fees', title: '收费', group: 'visit', rows: 3, tbc: '3.6', description: '不想公开具体金额，可以写「请联系诊所」。' }),
    localized({ name: 'payment', title: '付款方式', group: 'visit', rows: 3, tbc: '3.7', description: '包括是否接受保险或公司 panel。' }),
    localized({ name: 'beforeYourVisit', title: '就诊前须知', group: 'visit', rows: 5, tbc: '2.6', description: '「预约与诊所」页的一段说明，例如取消和改期的规定。' }),
    localized({ name: 'followUpCare', title: '持续照护', group: 'visit', rows: 5, tbc: '4.1', description: '「预约与诊所」页的一段说明：复诊和之后的照护。' }),
    localized({
      name: 'bookingMessage', title: 'WhatsApp 预填问候语', group: 'notices', rows: 3,
      description: '访客点「WhatsApp 预约」后，对话框里自动填好的第一句话。',
    }),
    localized({ name: 'emergencyNotice', title: '紧急求助说明', group: 'notices', rows: 4, tbc: '4.7', description: '显示在诊所资料旁边。' }),
    plainText({
      name: 'mabApprovalNo', title: 'MAB 批准编号', group: 'notices', tbc: '1.5',
      description: '网站获得 MAB（医疗广告委员会）批准后的编号，显示在页脚。',
    }),
    defineField({
      name: 'socialLinks',
      title: '社交账号',
      group: 'links',
      type: 'array',
      description: '显示在页脚，也会告诉搜索引擎这些账号属于诊所。',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: '账号',
          fields: [
            defineField({
              name: 'platform', title: '平台', type: 'string',
              options: { list: [{ title: 'Instagram', value: 'instagram' }, { title: 'YouTube', value: 'youtube' }, { title: 'Facebook', value: 'facebook' }], layout: 'radio', direction: 'horizontal' },
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'url', title: '链接', type: 'url', validation: (rule) => rule.required().uri({ scheme: ['https'] }) }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: '诊所资料' }) },
});
