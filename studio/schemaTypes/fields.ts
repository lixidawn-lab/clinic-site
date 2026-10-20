/*
 * 字段工具：中英文字段、「待补充」(TBC) 写法检查。
 * 字段名和网站的 src/content.config.ts 一一对应，改名要两边一起改。
 */
import { defineField } from 'sanity';

// 网站的规则（src/lib/tbc.ts）：还没有的资料写成 TBC:清单编号，例如 TBC:3.4
const TBC = /^TBC:\d+\.\d+$/;
const TBC_MESSAGE = '「待补充」的写法是 TBC:编号，例如 TBC:3.4（编号见资料清单）';

/** 以 TBC 开头的内容必须是 TBC:编号 的写法 */
export const tbcCheck = (v: unknown) => typeof v !== 'string' || !/^\s*tbc/i.test(v) || TBC.test(v) || TBC_MESSAGE;

export const isTbc = (v: unknown) => typeof v === 'string' && TBC.test(v);

/** 字段说明后面加上「待补充」的用法 */
export const tbcHint = (no?: string) =>
  no ? `还没有资料时填「TBC:${no}」（资料清单 ${no}）：预览站显示黄色「待补充」，正式站不显示这一项。` : '';

const join = (...parts: (string | undefined)[]) => parts.filter(Boolean).join(' ');

type LocalizedOptions = {
  name: string;
  title: string;
  description?: string;
  /** 多行文字框的行数；不写就是单行 */
  rows?: number;
  /** 默认必填（中英文都要填）。false：可以都不填，但不能只填一种语言 */
  required?: boolean;
  /** 资料清单编号：说明里提示可以填 TBC:编号 */
  tbc?: string;
  group?: string;
  hidden?: boolean;
};

/** 中英文各一份的文字。数据里是 { en, zh }，后台里中文排在前面 */
export function localized({ name, title, description, rows, required = true, tbc, group, hidden }: LocalizedOptions) {
  const lang = (key: 'zh' | 'en', label: string) =>
    defineField({
      name: key,
      title: label,
      type: rows ? 'text' : 'string',
      ...(rows ? { rows } : {}),
      validation: (rule) => {
        const r = rule.custom(tbcCheck);
        return required ? r.required() : r;
      },
    });
  return defineField({
    name,
    title,
    type: 'object',
    group,
    hidden,
    description: join(description, tbcHint(tbc)),
    fields: [lang('zh', '中文'), lang('en', 'English')],
    validation: required
      ? undefined
      : (rule) => rule.custom((v?: { zh?: string; en?: string }) => !v || !!v.zh === !!v.en || '中文和英文要么都填，要么都不填'),
  });
}

/** 中英文各一组字符串（例如看诊语言），每种语言有自己的顺序 */
export function localizedList({ name, title, description, group }: Omit<LocalizedOptions, 'rows' | 'required' | 'tbc'>) {
  const lang = (key: 'zh' | 'en', label: string) =>
    defineField({ name: key, title: label, type: 'array', of: [{ type: 'string' }], validation: (rule) => rule.required().min(1) });
  return defineField({ name, title, type: 'object', group, description, fields: [lang('zh', '中文'), lang('en', 'English')] });
}

type TextOptions = {
  name: string;
  title: string;
  description?: string;
  tbc?: string;
  /** 不是 TBC 时要符合的格式 */
  pattern?: RegExp;
  patternMessage?: string;
  group?: string;
};

/** 不分语言的一行字（电话、编号等），可以填 TBC:编号 */
export function plainText({ name, title, description, tbc, pattern, patternMessage, group }: TextOptions) {
  return defineField({
    name,
    title,
    type: 'string',
    group,
    description: join(description, tbcHint(tbc)),
    validation: (rule) =>
      rule.required().custom((v?: string) => {
        if (!v) return true;
        const t = tbcCheck(v);
        if (t !== true) return t;
        if (isTbc(v) || !pattern) return true;
        return pattern.test(v) || patternMessage || '格式不对';
      }),
  });
}

/** 列表里的排序数字（小的在前） */
export const orderField = defineField({
  name: 'order',
  title: '排序',
  type: 'number',
  description: '数字小的排在前面，例如 1、2、3。',
  validation: (rule) => rule.required().integer(),
});

/** 日期都存成 YYYY-MM-DD，后台显示成 2026.10.16 */
export const dateOptions = { dateFormat: 'YYYY.MM.DD' };
