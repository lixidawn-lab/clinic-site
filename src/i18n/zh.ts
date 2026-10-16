// 简体中文界面文案。结构必须和 en.ts 完全一致（少一项会导致类型检查失败）。
import type { Dict } from './en';

export const zh: Dict = {
  langName: '简体中文',
  a11y: {
    skipToContent: '跳到正文',
    mainNav: '主导航',
    switchLanguage: '用简体中文阅读本页',
    bookingBar: '预约咨询',
  },
  nav: {
    home: '首页',
    about: '关于涵倪',
    notes: '涵倪的笔记',
    appointments: '预约与诊所',
  },
  cta: {
    book: '预约咨询',
    call: '致电',
  },
  footer: {
    address: '地址',
    phone: '电话',
    whatsapp: 'WhatsApp',
    hours: '营业时间',
    mabApprovalNo: 'MAB 批准编号',
    privacy: '私隐声明',
    social: '关注涵倪医生',
  },
  social: {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
  },
  tbc: {
    label: '待补充 · TBC',
  },
  draft: {
    label: '初稿 · 待确认 · Draft',
  },
  home: {
    areasOfFocus: '关注领域',
    howWeBegin: '如何开始',
    latestNotes: '最新文章',
    allNotes: '全部文章',
    clinicInfo: '诊所信息',
    aboutLink: '了解涵倪',
  },
  about: {
    background: '专业背景',
    qualifications: '学历与资格',
    registrations: '注册',
    experience: '经验',
    languages: '看诊语言',
    clinicalInterests: '专业关注领域',
    approach: '诊疗理念',
    publications: '研究与发表',
    stories: '从故事中学习',
  },
  notes: {
    featured: '精选文章',
    latest: '最新文章',
    topics: {
      emotions: '情绪与心理健康',
      symptoms: '理解症状与困扰',
      family: '儿童与家庭',
      clinical: '临床观察与思考',
    },
    byline: '文：',
    published: '发布日期',
    reviewed: '最后审阅',
    topic: '主题',
    inChinese: '中文文章',
    inChineseNotice: '本文目前只有中文版。',
    readInChinese: '阅读中文全文',
    disclaimer: '本文仅供一般参考，不构成诊断。如果你担心自己的状况，请咨询医生。',
    bookPrompt: '想和涵倪医生聊聊吗？',
  },
  appointments: {
    services: '诊疗服务',
    faq: '常见问题',
    clinicInfo: '诊所信息',
    map: '地图',
    parking: '停车与交通',
    fees: '费用',
    payment: '付款方式',
  },
  pages: {
    home: {
      title: '首页',
      description: '刘涵倪医生在马来西亚马六甲的精神科专科诊所。认识涵倪的专业背景与关注领域，阅读她的笔记，并预约咨询。',
    },
    about: {
      title: '关于涵倪',
      description: '刘涵倪医生的专业背景、专业关注领域与诊疗理念。',
    },
    notes: {
      title: '涵倪的笔记',
      description: '刘涵倪医生关于心理健康的专业写作与临床思考。',
    },
    appointments: {
      title: '预约与诊所',
      description: '如何预约刘涵倪医生：第一次就诊、持续照护、常见问题与诊所信息。',
    },
  },
};
