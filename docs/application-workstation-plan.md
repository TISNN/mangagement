# 申请工作台一体化方案（Draft v1.2）

> 面向 Infinite.ai 申请顾问与运营团队，打造“一个页面完成所有申请协作”的核心工作台。本文涵盖业务动机、信息架构、UI 设计语言、交互流程、数据映射与迭代节奏，指导后续原型与开发。

---

## 1. 背景与目标

| 维度 | 现状痛点 | 工作台要解决的问题 |
| --- | --- | --- |
| 多页面跳转 | 顾问需要在「申请学生列表」「服务进度中心」「任务」「材料库」之间来回切换 | 将学生切换、阶段进度、任务与材料整合在单页，减少上下文切换 |
| 阶段信息分散 | 服务阶段、阶段任务、文档存放在不同模块，缺少统一视图 | 以阶段卡片为承载单位，聚合任务/文件/备注/AI 建议 |
| 文档难追踪 | 同一材料在阶段上传后，还需手动同步到学生档案 | 引入“阶段视图 + 材料库”双视角，自动同步标签与归档 |
| 网申表单重复输入 | 每次填写第三方门户都要重新整理资料 | 创建网申助手模板，结构化展示字段，支持一键复制 |
| 决策缺少看板 | 无法快速知道每个学生当前阻塞点与下一步动作 | 顶部指标 + 阶段卡“阻塞/待办/风险”标签，提供一目了然的指挥信号 |

**总体目标**：提供一个 Smart Console，三步掌握学生进度——选学生、看阶段、点操作；所有材料与表单信息自动沉淀，真正做到“信息一次录入，多点复用”。

---

## 2. 现有系统资产与复用策略

| 既有模块/资源 | 当前能力 | 在申请工作台的复用/增强方式 |
| --- | --- | --- |
| `ApplicationsPage` + `useApplicationOverviews()` | 已聚合学生申请统计、导师、下个截止日期 | 顶栏学生切换器直接复用 overview 数据；指标卡使用同一 Hook 的扩展字段（如 `urgent_tasks_count`） |
| `ServiceChronology` 模块 | 记录阶段时间线、AI 建议、附件 | 阶段卡点击「详情」时拉取 chrono 数据；阶段动作写回同一表保持历史一致 |
| `student_services` 表 | 存储阶段状态、负责人、预计时间 | 阶段矩阵的主数据；新增 `stage_progress`、`blocking_reason` 字段实现可视化 |
| 任务中心 (`tasks` 模块) | 已支持任务 CRUD、提醒、看板/日历视图 | 阶段卡任务区通过 `linked_stage_id` 字段引用；勾选任务触发任务中心 Webhook，保持双向同步 |
| `application_documents_checklist` | 管理材料清单与状态 | 作为材料库的「结构化 Checklist」来源；与新建的 `application_files` 做一对多关联 |
| `student_profile` & 学生详情抽屉 | 基础档案、家长联系方式、考试成绩 | 右侧档案抽屉直接调用现有接口，仅补充风险提示字段 |
| 会议模块 (`student_meetings`) | 记录会议纪要与提醒 | 「创建会议」快捷操作直接复用该 API，带入当前学生及阶段上下文 |
| Edge Functions：`/phd-positions`、`/service-chronology` 等 | 统一鉴权与过滤逻辑 | 申请工作台新增 `/application-workstation/metrics`、`/application-files` 等接口时复用相同鉴权模式 |
| 通知与提醒（站内信/邮件） | 任务到期提醒、会议提醒 | 指标卡触发的自动化（如阻塞 3 天）调用现有通知服务，确保提醒体系一致 |

> **整合原则**：优先复用现有数据结构与 API，必要时以「新增字段/Edge Function」补齐，避免重复造轮子；所有写操作都需同步更新时间线与任务，确保跨模块可追溯。

---

## 3. 用户角色与场景

| 角色 | 典型需求 | 设计响应 |
| --- | --- | --- |
| 申请顾问（Primary） | 快速切换学生查看阶段、更新任务、上传材料、填网申 | 关键操作保持单击/双击完成，支持键盘快捷键（上下切换学生，左右切换阶段） |
| 运营主管（Secondary） | 关注全局指标、定位风险学生、安排资源 | 顶部指标区显示预警，阶段卡附带风险标签，支持导出行动列表 |
| 学生协作伙伴（Optional） | 补充文书、选校或材料 | 可通过权限受控的分享链接查看特定阶段清单，避免暴露全部信息 |

---

## 4. 功能范围概览

1. **学生切换与全局指标**
   - 搜索 / 筛选（阶段、服务、顾问）
   - 收藏、最近访问、紧急标记
   - 全局指标：待补材料、即将到期、阻塞阶段
2. **阶段矩阵视图**
   - 默认 6 大阶段（可配置）：背景评估、选校规划、材料准备、网申提交、录取管理、签证行前
   - 每阶段卡片包含：状态、进度条、关键任务、材料、AI 建议、下一步操作
3. **材料与表双视角**
   - 阶段内上传/引用文件
   - 自动同步到“材料库”聚合视图（按类型/阶段/更新时间筛选）
4. **网申填写助手**
   - 模板字段：账号信息、Essay、推荐人、问答、上传链接
   - 一键复制 / 导出 Markdown / 自动生成任务
5. **学生档案抽屉**
   - 基本信息、联系方式、考试成绩、家长信息、风险提示
   - 快捷操作：创建会议、添加任务、发送提醒
6. **自动化与提醒**
   - 阶段动作写入服务时间线
   - 触发任务中心通知（如材料缺失、deadline 48 小时提醒）

---

## 5. 信息架构（IA）

```
申请工作台
├── 顶栏
│   ├── 学生切换器（搜索/收藏/筛选）
│   └── 全局指标卡（待提交/阻塞/风险）
├── 阶段矩阵（水平滚动 / 快捷锚点）
│   ├── 阶段卡
│   │   ├── Header：阶段状态、负责人、权重
│   │   ├── “下一步”按钮区
│   │   ├── 任务列表（2 条展开 + 更多）
│   │   ├── 文件区（上传/关联）
│   │   ├── 网申字段摘录
│   │   └── AI Insight 标签
│   └── 阶段详情抽屉（时间线 + 备注）
└── 右侧竖向抽屉
    ├── 学生档案
    ├── 材料库（列表/分组显示）
    └── 网申助手（模板 + 复制按钮）
```

---

## 6. 跨模块业务流程与自动化

### 6.1 阶段驱动的端到端链路

1. **状态来源**：`student_services` 提供阶段状态与负责人；阶段卡展示并允许更新，写回同表。
2. **任务联动**：阶段卡内任务勾选 → 调用 `tasks.updateStatus` → Webhook 返回成功后刷新卡片，并在 `ServiceChronology` 追加「任务完成」日志。
3. **材料同步**：任一阶段上传文件 → `storage` 上传成功 → `application_files` 记录 + `application_documents_checklist` 状态更新 → 材料库聚合。
4. **AI Insight**：利用现有 AI 建议生成器（服务进度中心使用的 prompt），依据阶段数据实时刷新标签。

### 6.2 自动化触发逻辑

| 触发条件 | 数据来源 | 自动动作 | 影响模块 |
| --- | --- | --- | --- |
| Deadline ≤ 48 小时且阶段状态非完成 | `student_services.deadline` | 在任务中心生成「加急任务」，并在通知中心推送提醒 | 任务中心、通知中心 |
| 阻塞状态超过 3 天 | `blocking_reason` + `updated_at` | 顶栏指标高亮 + 向负责人发送提醒邮件 | 指标卡、消息中心 |
| 材料上传后 Checklist 未同步 | `application_files` 上传记录 | 自动创建 Checklist 更新任务，要求标记材料状态 | Checklist、任务中心 |
| 网申模板导出后 24h 未更新 | `application_form_snapshots.last_exported_at` | 弹出提醒，建议重新同步第三方门户 | 网申助手 |

### 6.3 跨模块页面跳转与回写

- **任务中心 ↔ 申请工作台**：任务详情中可点击「跳转到阶段」，Deep Link 格式 `/admin/application-workstation?student=xxx&stage=yyy`。
- **会议模块 ↔ 工作台**：在工作台创建会议即预填学生/阶段信息；会议纪要完成后写入 `ServiceChronology`，阶段卡显示“最新会议”气泡。
- **知识库模板**：材料准备阶段可直接引用知识库中的模板（通过已有知识库 API），引用后在卡片显示来源。

---

## 7. 关键模块与交互细节（扩展）

### 5.1 顶栏（Global Header）

- **布局**：左侧学生切换器，右侧指标卡组。
- **学生切换器**
  - 输入即搜索（Debounce 200ms），支持模糊匹配姓名/服务/顾问。
  - 下拉分组：收藏、最近访问、全部。
  - 键盘导航：`↑/↓` 切换，`Enter` 选中，`Cmd+K` 打开。
- **指标卡**
  - “待提交网申”“待补材料”“阻塞阶段”三张卡，数字 + 状态徽标。
  - 点击指标卡自动过滤阶段视图并滚动到第一张对应阶段卡。

### 5.2 阶段矩阵（Stage Matrix）

- **展示形态**：横向卡片栅格，默认 3 列，支持拖动 / 鼠标滚轮，移动端切换为纵向折叠。
- **顶部锚点条**：显示阶段名称与进度，点击锚点平滑滚动到对应卡片。
- **阶段卡结构**
  1. **Header**：阶段名 + 状态 Pill（未开始/进行中/阻塞/完成/暂停）。
  2. **Progress Bar**：展示阶段完成百分比。
  3. **负责人与时间**：显示负责顾问、阶段起止时间。
  4. **任务区**：
     - 显示优先级最高的 2 条任务；点击“展开全部”跳转抽屉。
     - 勾选任务直接触发任务中心 API。
  5. **文件区**：
     - 列出最近 2 个文件，含文件类型、更新时间、上传人。
     - “上传”按钮支持拖拽/粘贴，上传成功后自动写入材料库。
  6. **网申字段摘要**：
     - 关键字段（如 Essay 题目、学校 portal 链接）展示为 Tag。
     - 鼠标悬浮显示详情，点击复制。
  7. **AI Insight**（可选）：
     - 例如“背景材料缺少实习证明，建议 3 天内补齐”。
  8. **操作区**：
     - “记录进展”“生成任务”“添加备注”“打开阶段详情”按钮。

### 5.3 阶段详情抽屉

- 右侧滑出，展示时间线（ServiceChronology 数据）+ 备注 + 历史文件。
- 支持编辑状态、补充备注、查看历史操作日志。
- 关闭方式：Esc / 点击遮罩 / 顶部关闭按钮。

### 5.4 材料库 & 网申助手抽屉

- **材料库**
  - 列表模式（带类型图标、阶段、更新时间、标签、来源）。
  - 支持多选导出 / 分享链接。
  - 过滤条件：阶段、类型（材料、Essay、财务、补充问卷）、更新时间、上传人。
- **网申助手**
  - 以 Tab 展示不同院校的表单模板。
  - 每个字段块支持“一键复制”“标记已完成”。
  - 可生成“表单清单”任务并推送到任务模块。

### 5.5 快捷操作

- 顶栏按钮：“创建会议”“发送提醒”“生成任务”。
- 支持针对当前阶段一键生成任务模版（例如“上传护照扫描件”）。
- 与任务系统联动：创建任务后，阶段卡即时刷新任务状态。

### 5.6 交互状态与反馈

| 状态 | 表现 | 技术要点 |
| --- | --- | --- |
| Loading | 阶段卡内骨架屏 + 顶栏淡入动画 | 启动时并行请求 overview、services、tasks，使用 Suspense fallback |
| 乐观提交 | 阶段状态切换、任务勾选即时变化，右上角出现“已保存”Toast | 若 API 失败，回滚 UI 并提示错误详情 |
| 冲突处理 | 其他顾问已修改阶段信息 | 展示冲突提示条，提供“覆盖/同步”选项，底层依赖 `updated_at` 乐观锁 |
| 离线模式 | 读取最近缓存数据，提示“正在尝试重新连接” | 复用 ServiceChronology 的离线兜底逻辑 |

---

## 8. UI 设计语言

| 设计原则 | 表现方式 |
| --- | --- |
| 简洁高级 | 使用低饱和度底色 + 品牌渐变强调重要 CTA；空白留足呼吸感 |
| 智能反馈 | 卡片内嵌 AI Insight 标签，状态变化实时过渡动画 |
| 语义色控 | 状态 Pill：灰（未开始）、蓝（进行中）、橙（阻塞/风险）、绿（完成）、玫红（暂停/取消） |
| 多尺寸自适应 | ≥1280px：3 列矩阵；1024-1280px：2 列 + 折叠；移动端：折叠面板 + 下方抽屉 |
| 手势友好 | 允许触控拖拽、长按调出操作菜单；提供 `Cmd+Enter` 记录进展快捷方式 |

**组件库复用**：沿用现有 Tailwind + Shadcn 组件，阶段卡可基于 `Card` 组件扩展，指标卡沿用 `StatCard` 样式但增加状态 Pill。

---

## 9. 数据与接口映射（含接口示例）

| 模块 | 现有表 / 接口 | 新增需求 |
| --- | --- | --- |
| 学生基本信息 | `student_profile`、`application_overviews` | 增补 `overview` Edge Function 支持 `urgent_tasks_count`、`has_blocking_stage` |
| 服务阶段 | `student_services`（status、stage、owner） | 增加 `stage_progress`、`blocking_reason`、`ai_insight_hash` 字段 |
| 时间线 | `service_chronology` Edge Function | 直接复用，新增 `source=application-workstation` 标记 |
| 任务 | `tasks` 模块 API | 在任务表新增 `linked_student_id`、`linked_stage_id`，便于跨模块筛选 |
| 材料库 | `application_documents_checklist` | 新增 `application_files` 表，写明 `stage_id`、`source`、`file_meta`、`checklist_item_id` |
| 网申助手 | 无 | 新建 `application_form_snapshots`（字段名、内容、状态、last_synced_at、external_link） |
| 指标统计 | Edge Function（待新增） | `/application-workstation/metrics` 聚合待提交/阻塞数量 |

### 9.1 新增 Edge Function 设计

#### `/application-workstation/metrics`

```http
GET /application-workstation/metrics?student_id=uuid
```

响应：

```json
{
  "student_id": "uuid",
  "pending_forms": 2,
  "pending_documents": 3,
  "blocking_stages": [
    {
      "stage_id": "uuid",
      "stage_name": "网申提交",
      "blocking_reason": "等待 Essay 最终稿",
      "days_blocked": 4
    }
  ],
  "upcoming_deadlines": [
    {
      "stage_id": "uuid",
      "deadline": "2025-11-20",
      "school": "UCLA MSCS",
      "risk_level": "high"
    }
  ]
}
```

#### `/application-files`

```http
POST /application-files
{
  "student_id": "uuid",
  "stage_id": "uuid",
  "file_url": "https://...",
  "file_type": "passport",
  "tags": ["材料准备", "PDF"],
  "checklist_item_id": "uuid"
}
```

返回写入的记录，并触发 Supabase Function 更新 `application_documents_checklist.status`。

### 9.2 数据模型关联图（文字描述）

```
student_profile 1---n student_services
student_services 1---n tasks (via linked_stage_id)
student_services 1---n application_files
application_documents_checklist 1---n application_files
application_form_snapshots n---1 student_profile
service_chronology entries reference student_services + tasks/application_files via metadata
```

**交互数据流示例：上传材料**
1. 用户在阶段卡上传文件。
2. 前端调用 `storage` 上传文件 -> 返回文件 URL。
3. 调用 `application_files` upsert，写入 `stage_id`、`student_id`、`tags`。
4. 写入成功后，阶段卡文件区与材料库同步刷新；触发时间线记录（“上传护照扫描件”）。

---

## 10. 关键用户流程（User Flows）

### Flow A：快速了解学生状态
1. 顾问打开工作台，默认显示“最近访问”学生。
2. 顶栏指标显示“2 个网申待提交”，点击后过滤阶段卡。
3. 查看“网申提交”阶段卡，看到阻塞原因“缺 Essay 答案”，点击“网申助手”复制草稿。
4. 在阶段卡记录进展，状态从“阻塞”切换到“进行中”，顶部指标实时更新。

### Flow B：上传新文件并同步档案
1. 在“材料准备”阶段点击“上传”。
2. 拖入文件 -> 选择标签“护照”“PDF”。
3. 上传完成后，卡片显示新文件，材料库自动新增记录，档案抽屉提示“新增 1 个材料”。
4. 若该材料影響任务，系统自动将相关任务标记为已完成。

### Flow C：填写第三方网申
1. 顾问打开“网申助手 Tab”，选择学校/项目。
2. 页面展示结构化字段，勾选“标记为已填”。
3. 点击“复制全部”后，系统记录 `last_exported_at`，并在阶段时间线写入“完成网申资料整理”。

### Flow D：阻塞预警到行动
1. `student_services` 中“材料准备”阶段被标记 `blocking_reason=等待推荐信`。
2. Edge Function 监控到阻塞时间超过 3 天 → 向负责人推送提醒，并在指标卡高亮。
3. 顾问在工作台打开该阶段，使用快捷操作“生成提醒邮件”，系统调用通知服务发送模板邮件给学生/推荐人。
4. 完成跟进后，顾问在阶段卡里取消阻塞，所有提示自动解除。

### Flow E：Checklist 自动同步
1. 顾问上传“银行存款证明”文件。
2. 系统校验 Checklist 中存在对应条目 → 自动更新状态为“已提交”，并在阶段卡/材料库显示“已同步”标签。
3. 若对应 Checklist 条目不存在，系统提示创建新条目或关联已有条目。

---

## 11. 技术实现要点

1. **状态管理**
   - 页面级数据：`useApplicationWorkstation(studentId)` Hook，聚合 Supabase 多接口。
   - 乐观更新：任务勾选、状态切换、文件上传均采用乐观 UI。
2. **性能优化**
   - 学生切换时预加载相邻学生数据。
   - 阶段卡按需渲染：进入视窗才初始化内部 Hook。
   - 文件列表分页，避免一次性加载所有附件。
3. **可观测性**
   - 埋点：学生切换次数、阶段展开率、网申助手复制次数、文件上传失败率。
   - 告警：指标卡的阻塞状态超过 3 天自动推送提醒。

---

## 12. 里程碑与迭代计划

| 阶段 | 范围 | 输出 |
| --- | --- | --- |
| M1：原型验证（1 周） | Figma 低保真 + 可交互原型；确定阶段卡结构 | 原型文件 + 可用性评审纪要 |
| M2：数据层铺设（1.5 周） | 新增 `application_files`、`application_form_snapshots` + Edge Function（metrics、files） | 数据脚本、接口文档、API Postman 集合 |
| M3：前端实现（2 周） | 工作台主界面、阶段卡交互、材料库抽屉、网申助手 Beta、指标卡 | `/admin/application-workstation` 页面 + Figma 原型 |
| M4：打磨与联动（1 周） | 与任务/提醒/时间线联动、埋点、权限控制、Deep Link | 上线 Checklist + 埋点仪表板 + 用户培训文档 |

---

## 13. 后续展望

- 与 AI 助手联动：阶段卡可直接生成下一步建议或材料清单。
- 多人协作：阶段卡支持指派、评论 @ 同事。
- 学生视图：为学生提供精简版材料清单视图，保持信息对称。
- 自动提醒策略：基于 deadline 自动触发邮件/站内信提醒。

---

## 14. AI Agent 延伸设想

> 基于现有工作台数据与接口，构建自治 AI Agent，覆盖“诊断 → 规划 → 执行”链路。

### 14.1 Agent 角色

| Agent | 依赖数据/接口 | 核心能力 | 输出位置 |
| --- | --- | --- | --- |
| `ProgressAnalystAgent` | `student_services`、`tasks`、`service_chronology` | 自动诊断阻塞、排序优先级、生成行动建议 | 顶栏“AI 诊断”面板 + 时间线 |
| `FilingAssistantAgent` | `application_form_snapshots`、`application_files` | 生成网申问答、Essay 草稿、材料引用 | 网申助手 Tab |
| `CommunicationAgent` | `student_profile`、任务、通知服务 | 生成提醒邮件/站内信草稿并附材料链接 | 快捷操作弹窗 + 通知日志 |
| `SyncAgent` | `student_services`、外部 CRM API | 自动同步状态到第三方系统 | 同步日志表 |

### 14.2 工具（Tools）清单

| Tool | 功能 | 风险控制 |
| --- | --- | --- |
| `getStudentContext` | 聚合档案/阶段/任务/材料，供 Agent 检索 | 按用户权限裁剪字段，输出结构化 JSON |
| `createTaskFromTemplate` | 基于模板创建并关联阶段任务 | 默认草稿状态，需人工确认发布 |
| `updateStageStatus` | 修改阶段状态/阻塞原因 | 使用 `updated_at` 乐观锁并记录审计日志 |
| `sendNotification` | 调用站内信/邮件服务 | 强制人工确认 + 模板校验 |
| `generateFormDraft` | 结合材料库生成网申草稿 | 草稿标记“AI 生成”，必须人工审核 |

### 14.3 交互体验

1. 顶栏新增“AI 诊断”按钮，Agent 输出风险列表（含理由、建议动作、影响程度）。
2. 顾问可勾选建议一键创建任务或发送提醒，执行记录自动写入时间线并标注“由 AI 建议”。
3. 网申助手增加“AI 草稿”区，展示结构化问答与引用来源，支持一键复制/推送到外部门户。
4. 所有 Agent 动作需人工确认并可回滚，确保透明与可追溯。

### 14.4 实施路线

| 阶段 | 范围 | 验收标准 |
| --- | --- | --- |
| A1：上下文封装 | 完成 `getStudentContext`、标准化 prompt 模板 | 单次调用耗时 < 500ms，字段覆盖核心场景 |
| A2：诊断 Agent MVP | 自动生成风险/建议列表并创建任务草稿 | 顾问采纳率 ≥ 70%，误报率 < 10% |
| A3：文案/沟通 Agent | 输出网申草稿、提醒邮件、会议纪要草稿 | 90% 内容无需大幅修改即可发送 |
| A4：自动执行编排 | Agent 串行执行“诊断→任务→提醒→同步”，支持一键确认 | 平均节省顾问 30% 操作时间 |

---

## 15. 附录：组件与状态清单

1. **组件对照表**
   - `StudentSwitcher`：复用 `ApplicationsPage` 的 List 逻辑，新增收藏分组
   - `StageCard`：新建组件，组合 `Card + Progress + TaskList + FileList`
   - `MaterialDrawer`：复用知识库文件列表组件，调整字段
   - `FormAssistant`：自定义 `Tabs + Collapse + CopyButton`
2. **状态枚举**
   - 阶段状态：`not_started | in_progress | blocked | completed | paused`
   - 任务优先级：`high | medium | low`
   - 文件类型：`essay | resume | transcript | passport | financial | other`
3. **权限矩阵**
   - 顾问：可编辑所负责学生全部阶段
   - 运营主管：只读全量学生 + 指标导出
   - 协作伙伴：仅访问共享阶段的材料清单（受 share token 限制）

---

**作者**：产品团队  
**日期**：2025-11-15  
**文件**：`docs/application-workstation-plan.md`

