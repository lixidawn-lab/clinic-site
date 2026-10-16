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
- 部署：GitHub 私有仓库 `lixidawn-lab/clinic-site` → Cloudflare（以 Worker 静态资源形式部署），推送 `main` 后自动部署（构建 `npm run build`，部署 `npx wrangler deploy`，配置在 `wrangler.jsonc`，输出 `dist`）。预览站：https://clinic-site.lixi-dawn5.workers.dev ，不设 `PUBLIC_ALLOW_INDEXING`。

## 双语与 SEO
- 路由：`/en/...`、`/zh/...`（简体），两种语言共用英文 slug；根路径 `/` 重定向到 `/en/`。
- 每页都要有：hreflang（`en`、`zh-Hans`，`x-default` 指向 en）、自引用 canonical、唯一的 title 和 description、OG 标签。
- 语言切换器链接到对应的另一语言页面。
- JSON-LD：全站 `MedicalClinic`，About 页 `Physician`，文章页 `Article`（author 指向 Physician），FAQ 用 `FAQPage`。数据只取自内容文件，值为 TBC 的字段直接省略。
- 自动生成包含两种语言的 sitemap。
- 文章页包含：作者署名（链接到 About）、发布日期、审阅日期、「不构成诊断」提示、预约 CTA。
- 所有 UI 文案放在 `src/i18n/{en,zh}.ts`，组件里不写死文字。

## 内容模型（src/content）
- `settings`（单例）：clinicName{en,zh}、tagline（页头名字下的一行）、address、phone、whatsapp、hours、mapUrl、parking、fees、payment、mabApprovalNo、privacyNotice{en,zh}、emergencyNotice、beforeYourVisit、followUpCare、bookingMessage{en,zh}、socialLinks（涵倪之后换成诊所账号）。缺失的值统一写 `"TBC:x.x"`（x.x 是 `docs/checklist.md` 的编号，必须写）。
- `doctor`（单例）：name、title、qualifications[]、registrations[]、languages{en[],zh[]}（各自的顺序）、experience、bio{en,zh}（lead 是首屏大字；中文使用涵倪提供的原文，不改写）、clinicalInterests[]（带 id，About 页锚点 `/about/#<id>`）、approach、publications[]{title,venue,date,url,role,verified}。只渲染 `verified:true` 的发表。
- `notes`：title{en,zh}、summary、body（en/zh 各一个 md 文件）、topic、publishedAt、reviewedAt、featured、needsReview，以及来源字段（见「文章来源规则」）。
- `sources`：来源网站的 name{en,zh}、description{en,zh}、url。
- `concerns`：首页「常见困扰」标签，目前都链接到 Doctor's Notes。
- `services`、`faq`：带 `confirmed` 布尔值；未确认的显示 TBC。

## 设计令牌（首页定稿，2026-10-16；代码在 `src/styles/tokens.css`）
- 颜色：品牌绿 `--green:#239242`（大字、图标、线条）；`--green-dark:#1B7A35`（按钮、链接、小字，白字对比 5.4:1）；`--green-deep:#155F29`（链接悬停；浅绿底上的小字，保证 ≥4.5:1）；浅绿底 `--tint:#DCECC8`；暖白 `--bg:#F8F7F2`；正文 `--ink:#344237`；辅助文字 `--muted:#5A6A5E`；`#419538` 只用于插画和装饰。
- 字体（全部自托管，SIL OFL 1.1，见 `fonts/README.md`）：标题 Poppins（Logo 名字 700，标题和卡片标题 600，首屏介绍 500）；英文正文 Palanquin 400；中文星汉等宽 Milky Han Mono（Regular/Bold，构建时按全站实际用字子集化），备用 Noto Sans SC 和系统字体。
- 字号（桌面 / 手机）：正文 18/17，行高 1.7（中文 1.8），每行 ≤ 640px；H1 44/32（700）；首屏介绍 28/24；栏目标题 32/24（600）；精选文章标题 26，列表标题 20；步骤标题 19、说明 17；按钮 17px，高 ≥ 44px；元信息 ≥ 14px。
- 间距：版块上下 88–104px（手机 56px）；按钮全站圆角（胶囊形）。移动端优先，触控目标 ≥ 44px，焦点状态清晰可见。
- 手机端（< 1100px）：顶部吸顶栏（logo、语言、菜单）；底部固定预约栏（WhatsApp + 致电，没有号码就隐藏）。

## 文章来源规则（灵晞 2026-10-16 决定；Sanity 字段照此建立）
- 每篇文章有 `source`：`original`（涵倪原创）/ `blog`（旧博客）/ `media`（媒体或机构报道）/ `chuangbian`（窗边有光）。另有 `sourceSite`（来源网站，名称和一两句介绍写在 `src/content/sources.json`，每个来源只写一次）、`sourceUrl`、`sourceDate`、`permission`（是否取得转载许可）。
- 除 `original` 外，文章开头显示来源卡片：「本文原载于 〈来源名称〉，〈日期〉」+ 来源介绍 + 醒目的「阅读原文 →」按钮。

| 来源 | 正文 | canonical |
|---|---|---|
| original | 全文 | 诊所网站 |
| blog | 全文，来源卡片指向旧博客原文 | 诊所网站 |
| chuangbian | 全文 | 指向窗边有光原文（这时不输出 hreflang） |
| media | `permission: true` 才显示全文；否则只显示摘要和「阅读原文」（预览站标注「待取得转载许可」） | 指向媒体原文 |

- ⚠️ `chuangbian` 允许放全文，与硬性规则 7「不复制窗边有光的内容」冲突，待灵晞决定（见 `交接/进度.md`）。在决定之前，不放窗边有光的文章。

## 预览站标签（只有一个开关）
- TBC、「初稿 · 待确认」、「待涵倪审阅」（文章 `needsReview: true`）、「待取得转载许可」都只在预览站显示，统一由 `src/lib/preview.ts` 控制：没开收录时显示，开了收录时（正式站）全部不出现。`PUBLIC_SHOW_PREVIEW_LABELS=true/false` 可以强制显示或隐藏。
- `npm run check:production` 按正式站方式构建并检查：只要页面里还有任何一个这类标签，就报错。

## 分阶段（与 lixi-project-workflow 一致；每批结束后停下来，汇报并等用户确认）
1. **骨架（Code）**：脚手架、令牌、Base 布局、页头/页脚（含固定的预约 CTA）、i18n 路由、SEO head 组件、TBC 组件、noindex 开关；部署 noindex 预览站（GitHub → Cloudflare Pages，推送后自动部署）。
2. **首页设计（灵晞 + Chat，Code 不参与）**：在 Chat 的设计画布上定首页高保真和设计系统。Code 不做页面视觉设计。
3. **页面批次（Code）**：首页设计定稿后，套用设计系统，按 PRD 第 3 节分批做出 4 个页面和文章详情页，加 1 篇明确标注的示例文章、JSON-LD、sitemap。每批都部署到预览站。
4. **Sanity（Code）**：Studio 和 schema、替换 content.ts、发布时用 webhook 重建、文章两种语言都填写才能发布。
5. **验收上线**：死链、hreflang 配对、结构化数据验证、Lighthouse 移动端 ≥ 90、对比度、跨设备测试。获得 MAB 批准（清单 1.1）并经用户明确确认后，才打开收录，提交 Google Search Console 和 Bing。

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
