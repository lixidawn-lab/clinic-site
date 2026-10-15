# 涵倪诊所网站 · Clinic Website

Dr. Lau Harn Ni（刘涵倪）在马来西亚马六甲的精神科专科诊所官网。

## 角色
- 用户是产品负责人，主导产品、UX、视觉和内容方向。你负责实现。
- 用户自己负责视觉设计。你只按下方的设计令牌做干净、克制的基础样式，不要自创视觉风格。
- 不要擅自扩大范围。需要做决定时，给出 2–3 个选项并推荐其中一个。

## 唯一依据
- `docs/PRD.md`：需求（PRD v1.1）
- `docs/checklist.md`：待诊所确认的事项
- 两份文件冲突时以 PRD 为准。PRD 没有写到的内容，先问再做。

## 硬性规则
1. **绝不编造**诊所名称、地址、电话、营业时间、收费、服务、资历、政策。缺失的信息一律用 `<TBC>` 组件显示（醒目的黄色「待补充 · TBC」标记，并附清单编号，例如 `TBC 3.2`）。
2. 只有 4 个主页面：Home、About Hanni、Doctor's Notes（含文章详情页 `/notes/[slug]`）、Appointments & Clinic。不增加其他页面。
3. 临床兴趣（DBT、TF-CBT 等）只放在「关注领域」，不写成服务。
4. 不放患者评价、疗效描述、治疗前后对比。
5. 不设表单，不收集个人资料。预约只用 WhatsApp `wa.me` 链接（预填中英文问候）和 `tel:` 链接。
6. 默认 noindex：只有当 `PUBLIC_ALLOW_INDEXING=true` 时才允许收录，否则全站输出 `<meta name="robots" content="noindex,nofollow">`，robots.txt 设为 `Disallow: /`。上线需用户明确确认。
7. 不复制「窗边有光」的内容。

## 技术栈
- Astro（最新稳定版）+ TypeScript，全站静态生成，正文不依赖 JS。
- 样式：原生 CSS + CSS 变量。不使用 Tailwind 和 UI 框架。依赖越少越好。
- 内容：Astro Content Collections，放在 `src/content/`。schema 用 zod 定义，字段与将来的 Sanity schema 一一对应（第 3 阶段切换）。内容读取统一走 `src/lib/content.ts`，切换 CMS 时只需改这一层。
- 部署：Cloudflare Pages（第 4 阶段）。

## 双语与 SEO
- 路由：`/en/...`、`/zh/...`（简体），两种语言共用英文 slug；根路径 `/` 重定向到 `/en/`。
- 每页都要有：hreflang（`en`、`zh-Hans`，`x-default` 指向 en）、自引用 canonical、唯一的 title 和 description、OG 标签。
- 语言切换器链接到对应的另一语言页面。
- JSON-LD：全站 `MedicalClinic`，About 页 `Physician`，文章页 `Article`（author 指向 Physician），FAQ 用 `FAQPage`。数据只取自内容文件，值为 TBC 的字段直接省略。
- 自动生成包含两种语言的 sitemap。
- 文章页包含：作者署名（链接到 About）、发布日期、审阅日期、「不构成诊断」提示、预约 CTA。
- 所有 UI 文案放在 `src/i18n/{en,zh}.ts`，组件里不写死文字。

## 内容模型（src/content）
- `settings`（单例）：clinicName{en,zh}、address、phone、whatsapp、hours、mapUrl、parking、fees、payment、mabApprovalNo、bookingMessage{en,zh}。缺失的值统一写 `"TBC:x.x"`。
- `doctor`（单例）：name、titles、qualifications[]、languages[]、bio{en,zh}（使用涵倪提供的原文，不改写）、approach、publications[]{title,venue,date,url,role,verified}。只渲染 `verified:true` 的发表。
- `notes`：title{en,zh}、summary、body（en/zh 各一个 md 文件）、topic、publishedAt、reviewedAt、featured、externalUrl。
- `services`、`faq`：带 `confirmed` 布尔值；未确认的显示 TBC。

## 设计令牌（基础，等待用户的视觉稿）
--green:#1F863F（品牌）  --bg:#F8F7F2  --tint:#DCE8DD  --ink:#344237
白字放在 --green 上的对比度约 4.6:1（AA），不要再调浅。移动端优先，触控目标 ≥ 44px，焦点状态清晰可见。

## 分阶段（每阶段结束后停下来，汇报并等用户确认）
1. **骨架**：脚手架、令牌、Base 布局、页头/页脚（含固定的预约 CTA）、i18n 路由、SEO head 组件、TBC 组件、noindex 开关。
2. **页面**：按 PRD 第 3 节做出 4 个页面和文章详情页，加 1 篇明确标注的示例文章、JSON-LD、sitemap。
3. **Sanity**：Studio 和 schema、替换 content.ts、发布时用 webhook 重建、文章两种语言都填写才能发布。
4. **上线前检查**：死链、hreflang 配对、结构化数据验证、Lighthouse 移动端 ≥ 90、对比度；部署 noindex 预览站。

## 协作方式（交接/）
所有任务和汇报都通过 `交接/` 目录进行。

- **任务**：每批任务写在 `交接/日期_主题.md`（日期格式 `YYYY-MM-DD`）。只做文件里写明的事。
- **每批完成后**：
  1. 写 `交接/回报_日期_主题.md`，**不超过一页**：做了什么、改了哪些地方、结果如何、遗留问题。
  2. 截图 3–5 张，放在 `交接/截图/`，文件名以对应批次开头（如 `2026-10-15_主题_1.png`），并在回报里引用。
  3. 更新 `交接/进度.md`：总体进度、已知问题、下一步，以及「**等灵晞决定**」一节。每个待决定事项都写出选项（2–4 个，注明对用户体验的影响）和推荐项及理由。
- **每批开一个新会话**。一批做完就停下来，不在同一个会话里接着做下一批。
- **不做没被要求的实验**：不试做替代方案，不顺手加功能。有想法写进回报或「等灵晞决定」。
- **额度快用完时**：把当前进度提交并推送到 `wip/日期_主题` 分支，在 `进度.md` 写明停在哪一步。**不推 `main`**。
- **进度表只有一份：`交接/进度.md`**（取代原来的 `docs/STATUS.md`）。不要另建其他进度文件。
