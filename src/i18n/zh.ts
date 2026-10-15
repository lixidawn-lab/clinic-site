// 简体中文界面文案。结构必须和 en.ts 完全一致（少一项会导致类型检查失败）。
import type { Dict } from './en';

export const zh: Dict = {
  langName: '简体中文',
  a11y: {
    skipToContent: '跳到正文',
    mainNav: '主导航',
    switchLanguage: '用简体中文阅读本页',
    bookingBar: '预约',
  },
  nav: {
    home: '首页',
    about: '关于涵倪',
    notes: '医生手记',
    appointments: '预约与诊所',
  },
  cta: {
    whatsapp: 'WhatsApp 预约',
    call: '致电',
  },
  footer: {
    address: '地址',
    phone: '电话',
    hours: '营业时间',
    mabApprovalNo: 'MAB 广告批准号',
  },
  tbc: {
    label: '待补充 · TBC',
    unnumbered: '清单编号待定',
  },
  pages: {
    home: { title: '首页', description: '马来西亚马六甲的精神科诊所。' },
    about: { title: '关于涵倪', description: '关于刘涵倪医生（精神科）。' },
    notes: { title: '医生手记', description: '刘涵倪医生撰写的文章。' },
    appointments: { title: '预约与诊所', description: '如何预约，以及如何找到诊所。' },
  },
  stub: {
    notice: '本页目前只是骨架，内容将在阶段 2 加入。',
  },
};
