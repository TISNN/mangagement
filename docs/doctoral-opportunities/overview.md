---
title: 全球博士岗位中心（Global PhD Opportunities Hub）
last_updated: 2025-11-14
owners:
  - 产品负责人：AI 助手
status: draft
---

# 最新进展（2025-11-14）

- ✅ `public.phd_positions` 表已在 Supabase `studylandsedu` 项目创建完成（采用 `bigserial` 主键 + `source/source_id` 唯一约束），并导入 195 条 AcademicTransfer 数据（含中文摘要）。
- ✅ 新增 Supabase Edge Function `phd-positions`，参数化支持 `status/funding/country/tags/search/source_id` 等筛选，React 前端直接调用 `https://<project>.supabase.co/functions/v1/phd-positions`。
- ✅ `/admin/phd-opportunities` 与详情页已改为实时读取数据库数据，展示真实的中文/英文摘要、资助、申请流程等内容。
- 🔜 下一步：开放收藏/导出/生成任务写入能力，并让 Edge Function 与爬虫/同步脚本联动。

---

# 这个功能是做什么的？（What Is This Page For?）

> 给运营老师和学生准备的“博士职位雷达站”。我们每天从 AcademicTransfer 抓取最新的博士岗位，让大家像逛教授库一样，快速找到适合的博士机会。

- **核心价值**
  - 实时同步全球博士岗位，避免错过申请窗口。
  - 用中文+英文摘要告诉学生岗位亮点，让不熟悉英文的同学也能看懂。
  - 支持收藏、导出 Excel、生成推荐清单，方便顾问和学生一起做决策。
  - 与“全球教授库”互通，岗位详情直接展示对应导师信息。

- **首批数据源**
  - AcademicTransfer PhD 职位列表（`https://www.academictransfer.com/en/jobs?function_types=1`）
  - 单个岗位详情页（示例：`https://www.academictransfer.com/en/jobs/356308/phd-position-on-integrated-planning-of-railway-rolling-stock-circulations-and-maintenance/`）

---

# 谁会用到？

| 用户 | 他们遇到的问题 | 这个页面怎么帮忙 |
| --- | --- | --- |
| 顾问老师 | 要每天搜遍各大高校官网，很浪费时间 | 自动抓取并整理好岗位信息，关键字段一眼就能看到 |
| 学生 | 英文岗位描述太长太难懂 | 提供中文摘要、入学季、奖学金标签，降低理解门槛 |
| 运营同学 | 不知道哪些岗位需要跟进任务 | 系统自动为选中的岗位生成“待跟进任务”，提醒团队行动 |

---

# 页面结构（Page Blueprint）

## 1. 列表页（Global View）

- **筛选条**：国家/地区、学校、学院、研究方向、奖学金类型（全奖/部分）、是否支持国际学生、入学季、更新时间区间。
- **搜索框**：岗位标题/关键词/导师姓名关键字搜索。
- **博士模式开关**：默认开启博士相关筛选（PhD、全职、在招）。
- **岗位卡片核心元素**
  - 岗位标题（英文原文）+ 中文摘要标题
  - 学校、学院、城市/国家
  - 截止日期倒计时（如果无数据显示“待公布”）
  - 奖学金标签（全额/部分/未说明）
  - 最近更新时间
  - 快捷操作按钮：收藏、加入推荐清单、查看详情
- **右侧侧栏**
  - 匹配洞察卡片：当前筛选下的岗位数量、全奖比例、距离最近截止的岗位提示
  - 收藏夹列表：勾选后即可生成推荐清单或导出 Excel

## 2. 岗位详情页（Detail Drawer）

- **顶部信息区**
  - 岗位标题（英文）+ 中文翻译
  - 学校/学院/城市、入学季、职位类型、工作时长
  - 截止日期强调提醒（显示剩余天数）
- **岗位简介（Job Description）**
  - 英文原文（保留强调字体）
  - 中文概要（自动生成 3~5 句摘要，重点讲研究主题、目标、合作环境）
- **申请要求（Job Requirements）**
  - 用中英文对照的 bullet 列表展示：学位、技能、语言、经验等
- **申请流程（Application Procedure）**
  - 清晰列出步骤：准备材料 → 在线申请 → 重要注意事项
  - `去官网申请` 主按钮（链接到官方页面）
- **推荐动作（Action Center）**
  - `收藏岗位`
  - `生成推荐清单`
  - `导出 Excel`
  - `加入学生方案并生成任务`
    - 选择学生 → 写备注 → 自动在“申请工作台”创建跟进任务（任务标题为“跟进博士岗位 - {学校/岗位名}”，默认截止日期为岗位 deadline 前 7 天）
  - `联系导师`（如果有相关导师，直接调用教授库信息）
- **关联教授（Professor Match）**
  - 展示爬虫匹配到的导师卡片（姓名、研究方向、招生状态、是否接受国际学生）
  - 点击跳转教授详情页
- **相似岗位推荐**
  - 根据研究方向、国家、奖学金标签推荐 2~3 个类似岗位

---

# 数据模型设计（Supabase Draft）

## 表：`public.phd_positions`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | bigserial | 主键，自增 |
| `source` | text | 数据来源（例：`academictransfer`） |
| `source_id` | text | 外部 Vacancy ID，确保 upsert |
| `title_en` | text | 岗位标题（英文） |
| `title_zh` | text | 岗位标题（中文摘要标题，自动生成，可人工修订） |
| `university` | text | 学校名称 |
| `department` | text | 学院/研究组 |
| `country` / `city` | text | 地理信息 |
| `intake_term` | text | 入学时间描述（例：`2026 Fall`） |
| `deadline` | timestamptz | 申请截止时间（若缺省可为空） |
| `deadline_status` | text | 枚举：`confirmed` / `estimated` / `unknown` |
| `employment_type` | text | 职位类型（Full-time/Temporary 等） |
| `workload_hours_per_week` | text | 每周工时描述 |
| `education_level` | text | 教育层级（PhD/Postgraduate 等） |
| `funding_level` | text | `full` / `partial` / `unspecified` |
| `supports_international` | boolean | 是否接受国际学生 |
| `description_en` / `description_zh` | text | Job Description 英中内容 |
| `requirements_en` / `requirements_zh` | text | 申请要求 |
| `application_steps_en` / `application_steps_zh` | text | 申请流程 |
| `tags` | text[] | 研究方向标签（例：`["Operations Research","Railway Logistics"]`） |
| `match_score` | int | 0-100，供排序（算法见下） |
| `last_scraped_at` | timestamptz | 最近爬取时间 |
| `status` | text | `open` / `closing_soon` / `expired` |
| `raw_payload` | jsonb | 原始爬虫数据（调试用，可选） |
| `created_at` / `updated_at` | timestamptz | 自动维护 |

索引与约束：
- `unique (source, source_id)`
- GIN 索引用于 `tags`
- index on `deadline`、`status`、`university`

## 表：`public.phd_position_favorites`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `position_id` | uuid | 岗位 ID |
| `user_id` | uuid | 顾问/学生 ID |
| `created_at` | timestamptz | 收藏时间 |

复合唯一约束 `(position_id, user_id)`，RLS：用户只能访问自己的收藏。

## 表：`public.phd_position_recommendations`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | uuid | 主键 |
| `creator_id` | uuid | 创建者（顾问/学生） |
| `title` | text | 推荐清单标题 |
| `note` | text | 备注 |
| `positions` | jsonb | 岗位 ID 列表与简单排序 |
| `shared_with_student_id` | uuid | 如果指定学生 |
| `status` | text | `draft` / `shared` / `archived` |
| `created_at` / `updated_at` | timestamptz | | 

## 学生方案任务自动生成

- 复用 `student_services` 相关接口：当顾问在岗位详情点击“加入学生方案”：
  1. 选择学生 + 添加备注。
  2. 写入 `professor_match_records`（新增 `resource_type = 'phd_position'` & `resource_id` 字段）。
  3. 在任务系统（若已存在统一任务表）创建一条任务：
     - 标题：`跟进博士岗位 - {university} {title_en}`
     - 截止日期：`deadline - 7 天`（若无 deadline，则默认 14 天后）
     - 关联学生 ID、岗位 ID、顾问 ID
     - 提醒渠道：沿用申请工作台的通知机制

---

# 爬虫与同步流程

1. **步骤概览**
   - Step 1：抓取列表页 → 获取岗位基础信息与链接。
   - Step 2：抓取详情页 → 解析 Job Description / Requirements / Procedure / Deadline。
   - Step 3：调用翻译服务（优先腾讯翻译/DeepL）生成中文摘要，支持后续人工校正。
   - Step 4：根据关键词与学校，匹配教授库里的导师 ID。
   - Step 5：Upsert 到 `phd_positions` 表 → 更新 `last_scraped_at`。
   - Step 6：发布事件（可选），提示运营查看新增岗位。

2. **调度策略**
   - 时程：每天凌晨 03:00（UTC+8）调用 Supabase Edge Function `sync_phd_positions`.
   - 并发：限制每分钟请求数，防止触发 AcademicTransfer 反爬。
   - 增量更新：使用 `source_id` 比对，若岗位已过 `deadline` → 标记为 `expired`。
   - 错误监控：记录失败链接到 `sync_logs` 表，超过 3 次失败发送邮件提醒。

3. **字段映射清单（AcademicTransfer → Supabase）**

| AcademicTransfer 字段 | Supabase 字段 | 说明 |
| --- | --- | --- |
| Vacancy ID | `source_id` | URL 上的数字 ID |
| Job title | `title_en` | |
| Location | `city` / `country` | 拆分城市与国家 |
| Deadline | `deadline` | 若显示“Open until filled” → `deadline_status = 'unknown'` |
| Job description | `description_en` | |
| Job requirements | `requirements_en` | |
| Application procedure | `application_steps_en` | |
| Job types | `tags` | 解析为 `["PhD"]` 等基础标签 |
| Academic fields | `tags` | 结合研究方向生成 |
| Weekly hours | `workload_hours_per_week` | |
| Education level | `requirements_en` | 附加到要求列表 |

4. **中文摘要算法建议**
   - Rule-based + 翻译 API：提取描述段落前 3~4 句并翻译。
   - 使用关键句模板：`该岗位聚焦 {研究领域}，由 {学校/学院} 提供，全职博士职位，主要任务包括 {核心职责}，欢迎具备 {技能要求} 的同学申请。`
   - 存储在 `description_zh`；允许运营手动修正并保留更新时间。

5. **匹配导师逻辑**
   - 正则从描述中抓取 “Supervisor(s)” 或 “Supervisors” 段落。
   - 若匹配到姓名与学校在教授表中存在 → 加入 `related_professor_ids`。
   - 匹配不到时，提醒运营在详情页选择教授关联。

---

# 前端实现检查表

- [ ] 导航添加“全球博士岗位”入口（路径 `/admin/phd-opportunities`，与教授库同组）。
- [ ] 创建 `PhDOpportunitiesPage`，复用教授库的布局，并抽象公共组件。
- [x] 列表页调用 `phd_positions` 表数据（Edge Function + 实时筛选）。
- [x] 详情页支持中英文内容展示（若有中文摘要优先显示）。
- [ ] 收藏/推荐/导出按钮与 Supabase 表写操作完成。
- [ ] “加入学生方案”弹窗复用教授库逻辑，但写 `resource_type = 'phd_position'`。
- [ ] Excel 导出：列出标题、学校、国家、截止日、奖学金、中文摘要、申请链接。
- [ ] 学生端界面复用组件，保留收藏/导出功能，隐藏管理字段（若未来需要差异化）。

---

# 开发里程碑（建议）

| 里程碑 | 目标 | 输出物 |
| --- | --- | --- |
| M0 | 方案确认 | 本文档 + 页面线框 + 数据字典 |
| M1 | 数据管道 MVP | 爬虫脚本、Supabase 表迁移、20 条样例数据 |
| M2 | 前端骨架 | 列表 + 详情 + 收藏（mock 数据） |
| M3 | 数据联通 | 前端接入 Supabase、导出、学生方案任务写入 |
| M4 | 自动同步 | Edge Function 定时任务、错误日志 |
| M5 | 体验优化 | 推荐算法、Excel 模板、美化、与教授库互跳 |

---

# 常见问题（FAQ）

- **Q：如果岗位没有明确截止日期怎么办？**  
  A：`deadline` 为空，`deadline_status` 记录为 `unknown`，前端显示“截止时间待更新”。任务默认截止日为创建后 14 天。

- **Q：中文摘要不准确怎么办？**  
  A：页面提供“编辑摘要”按钮，运营修改后写入数据库，爬虫下次更新时只覆盖英文原文，不覆盖人工编辑的中文字段。

- **Q：是否会对学生开放所有操作？**  
  A：学生可以浏览、收藏、导出。`加入学生方案` 与“生成任务”对学生隐藏或弹出提示（需由顾问执行）。

- **Q：Excel 导出包含哪些字段？**  
  A：岗位标题（中英文）、学校、国家、学院、截止日期、奖学金标签、中文摘要、申请链接、备注列（空白，方便顾问后续填写）。

---

# 下一步动作

1. 评审本方案（顾问团队 + 开发）并补充字段需求。
2. 中文摘要生成方式（自动翻译工具）。
3. 安排爬虫开发与 Supabase 表迁移。
4. 前端开始搭建页面框架，复用教授库组件。
5. 与申请工作台对接任务创建接口，测试“自动生成任务”流程。

准备就绪后，我们就可以正式启动开发，把全球博士岗位搬到系统里，让顾问和学生随时掌握最新机会。

