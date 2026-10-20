/*
 * 一次性迁移：把网站 src/content/ 里的内容转换成 Sanity 的导入文件 studio/.migration/content.ndjson。
 * 这一步只在本机生成文件，不连 Sanity。导入是另一步（见交接/回报_2026-10-16_批次3_Sanity后台.md）：
 *   cd studio && npx sanity dataset import .migration/content.ndjson production
 * 导入后后台里的内容才是正本；之后不要再导入（加 --replace 会覆盖涵倪在后台的修改）。
 *
 * 文档 ID：诊所资料 settings、医生资料 doctor，其余是「类型-原 ID」（例如 faq-first-visit）。
 * Sanity 的 ID 不能带点（带点的是私有文档）。
 * 文章正文 Markdown → Portable Text；引用块（>）变成「引用框」，里面可以有列表。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromMarkdown } from 'mdast-util-from-markdown';

const here = path.dirname(fileURLToPath(import.meta.url));
const content = path.resolve(here, '../../src/content');
const outDir = path.resolve(here, '../.migration');
const read = (f) => JSON.parse(fs.readFileSync(path.join(content, f), 'utf8'));

// 数组里的每一项都要有 _key（同一个数组里不重复）
const keyed = (items, key = (_, i) => `k${i}`) => items.map((item, i) => ({ _key: key(item, i), ...item }));

/* ---------- Markdown → Portable Text ---------- */

let keySeq = 0;
const nextKey = () => `b${(keySeq++).toString(36)}`;
const warnings = [];

function inline(nodes, marks, markDefs, where) {
  const spans = [];
  for (const n of nodes) {
    switch (n.type) {
      case 'text': {
        // Markdown 里没有两个空格结尾的换行（软换行）在网页上显示成空格
        if (n.value.includes('\n')) warnings.push(`${where}：软换行改成空格`);
        spans.push({ text: n.value.replace(/\n/g, ' '), marks });
        break;
      }
      case 'break':
        spans.push({ text: '\n', marks });
        break;
      case 'strong':
        spans.push(...inline(n.children, [...marks, 'strong'], markDefs, where));
        break;
      case 'emphasis':
        spans.push(...inline(n.children, [...marks, 'em'], markDefs, where));
        break;
      case 'link': {
        const _key = nextKey();
        markDefs.push({ _key, _type: 'link', href: n.url });
        spans.push(...inline(n.children, [...marks, _key], markDefs, where));
        break;
      }
      default:
        throw new Error(`${where}：不支持的行内格式「${n.type}」`);
    }
  }
  return spans;
}

/** 相邻、格式相同的文字合成一段 */
function mergeSpans(spans) {
  const out = [];
  for (const s of spans) {
    const last = out.at(-1);
    if (last && last.marks.join() === s.marks.join()) last.text += s.text;
    else out.push({ ...s });
  }
  return out.map((s) => ({ _type: 'span', _key: nextKey(), text: s.text, marks: s.marks }));
}

function block(children, where, extra = {}) {
  const markDefs = [];
  const spans = mergeSpans(inline(children, [], markDefs, where));
  return { _type: 'block', _key: nextKey(), style: 'normal', markDefs, children: spans, ...extra };
}

function blocks(nodes, where, { inCallout = false, level = 0 } = {}) {
  const out = [];
  for (const n of nodes) {
    switch (n.type) {
      case 'paragraph':
        out.push(block(n.children, where));
        break;
      case 'heading':
        if (inCallout) throw new Error(`${where}：引用框里不能有小标题`);
        out.push(block(n.children, where, { style: n.depth <= 2 ? 'h2' : 'h3' }));
        break;
      case 'list': {
        const type = n.ordered ? 'number' : 'bullet';
        for (const item of n.children) {
          const paragraphs = item.children.filter((c) => c.type === 'paragraph');
          if (paragraphs.length > 1) throw new Error(`${where}：列表的一项里有多段文字`);
          for (const c of item.children) {
            if (c.type === 'paragraph') out.push(block(c.children, where, { listItem: type, level: level + 1 }));
            else if (c.type === 'list') out.push(...blocks([c], where, { inCallout, level: level + 1 }));
            else throw new Error(`${where}：列表里不支持「${c.type}」`);
          }
        }
        break;
      }
      case 'blockquote':
        if (inCallout) throw new Error(`${where}：引用框里不能再有引用`);
        out.push({ _type: 'callout', _key: nextKey(), content: blocks(n.children, where, { inCallout: true }) });
        break;
      default:
        throw new Error(`${where}：不支持的格式「${n.type}」`);
    }
  }
  return out;
}

const markdownToBlocks = (md, where) => blocks(fromMarkdown(md).children, where);

/* ---------- 文档 ---------- */

const docs = [];

const settings = read('settings.json').site;
docs.push({ _id: 'settings', _type: 'settings', ...settings, socialLinks: keyed(settings.socialLinks, (l) => l.platform) });

const doctor = read('doctor.json').doctor;
docs.push({
  _id: 'doctor',
  _type: 'doctor',
  ...doctor,
  qualifications: keyed(doctor.qualifications),
  registrations: keyed(doctor.registrations),
  clinicalInterests: keyed(doctor.clinicalInterests, (c) => c.id),
  publications: keyed(doctor.publications),
});

const list = (file, type, prefix) => {
  for (const { id, ...data } of read(file)) docs.push({ _id: `${prefix}-${id}`, _type: type, ...data });
};
list('concerns.json', 'concern', 'concern');
list('howWeBegin.json', 'howWeBeginStep', 'step');
list('services.json', 'service', 'service');
list('faq.json', 'faq', 'faq');
list('sources.json', 'source', 'source');

for (const { id, sourceSite, ...data } of read('notes.json')) {
  const body = {};
  for (const lang of ['zh', 'en']) {
    const file = path.join(content, 'notes', id, `${lang}.md`);
    if (fs.existsSync(file)) body[lang] = markdownToBlocks(fs.readFileSync(file, 'utf8'), `${id}/${lang}.md`);
  }
  docs.push({
    _id: `note-${id}`,
    _type: 'note',
    ...data,
    slug: { _type: 'slug', current: id },
    ...(sourceSite ? { sourceSite: { _type: 'reference', _ref: `source-${sourceSite}` } } : {}),
    body,
  });
}

fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'content.ndjson');
fs.writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n');

const count = docs.reduce((m, d) => ({ ...m, [d._type]: (m[d._type] ?? 0) + 1 }), {});
console.log(`写好了 ${path.relative(process.cwd(), out)}：${docs.length} 个文档`);
console.log(Object.entries(count).map(([t, n]) => `  ${t}: ${n}`).join('\n'));
for (const w of new Set(warnings)) console.log(`注意：${w}`);
