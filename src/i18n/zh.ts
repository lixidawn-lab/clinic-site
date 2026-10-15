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
  },
  tbc: {
    label: '待补充 · TBC',
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
  stub: {
    notice: '本页目前只是骨架，内容会在之后的批次加入。',
  },
};
