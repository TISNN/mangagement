# SkyOffice 线上会议室集成设计方案

## 1. 背景与目标
- **业务背景**：`Infinite.ai` 管理系统目前覆盖招生、教务、导师、财务等流程，但缺乏沉浸式线上会议能力。`SkyOffice` 具备可视化虚拟办公场景、邻近音视频、看板与白板等功能，可作为线上会议室核心能力。
- **集成目标**：在管理系统中提供无缝的线上会议体验，支撑教务排课、导师协同、内部运营会议等场景，实现用户单点登录、会议信息回写与权限控制。
- **设计原则**：低耦合、渐进式上线、充分复用现有模块，优先保障安全与体验一致性。

## 2. 用户角色与关键场景
- **学生/家长**：通过课表或活动日历点击进入指定会议室，参加课程、汇报或沟通。
- **导师/顾问**：在导师工作台或排班模块中发起会议，主持课堂、工作坊或内部例会。
- **运营/教务人员**：在内部管理套件中配置会议室模板、查看使用统计、管理权限。
- **系统管理员**：负责域名、身份、日志与安全策略配置。

典型流程：
1. 在 `教育培训 · 排课中心` 或 `导师工作台` 中创建课程/会议。
2. 系统自动生成 SkyOffice 房间并写入会议链接、访问令牌。
3. 用户在日历/待办中点击入口 → 通过 SSO 校验 → 跳转虚拟会议室。
4. 会议信息（出勤、录制、纪要）回写到管理系统，支持后续复盘。

## 3. 功能范围与版本规划
| 阶段 | 能力范围 | 说明 |
| ---- | -------- | ---- |
| **MVP（2 周）** | 单点登录、课程会议入口、基础出勤同步 | 内嵌 SkyOffice Web 客户端（iframe），通过管理系统生成一次性访问令牌；会话结束回写出勤。 |
| **增强版（4-6 周）** | 会议管理后台、房间模板、预定/预约流程、白板与材料同步 | 在内部管理加入房间模板配置、支持排课同步创建会议，接入文档库/白板。 |
| **高级版（>8 周）** | 实时数据监控、AI 助理、录制存档、跨系统通知 | 引入消息总线，支持会议事件触发 CRM 跟进、学习档案更新等。 |

## 4. 集成架构概览
```
┌───────────────────────────── 管理系统（React + Supabase） ─────────────────────────────┐
│  前端 SPA                                                             │
│  ├─ 教育培训/导师工作台页面：嵌入会议入口组件                         │
│  ├─ 内部管理·团队成员中心：SkyOffice 配置抽屉                         │
│  └─ 全局状态：会议元数据、用户信息                                    │
│                                                                         │
│  后端（Supabase Functions / Edge Functions）                           │
│  ├─ /api/meetings/create        → 调用 SkyOffice 房间创建 API          │
│  ├─ /api/meetings/token         → 生成临时访问令牌                    │
│  └─ /api/meetings/webhook       → 接收 SkyOffice 事件并写回数据库     │
└─────────────────────────────────────────────────────────────────────────┘
                │                                       ▲
                │ REST / Webhook                        │ 事件回传
                ▼                                       │
┌───────────────────────────── SkyOffice ────────────────────────────────┐
│  Gateway (Node + Colyseus)                                             │
│  ├─ Auth Adapter：校验 Supabase 签发的 JWT                              │
│  ├─ Room Manager：创建/销毁房间、分配 Peer ID                           │
│  └─ Event Dispatcher：出勤、录制、白板事件回调                          │
│                                                                         │
│  Client (React + Phaser + PeerJS)                                      │
│  ├─ iframe / 新窗口嵌入                                                │
│  └─ 提供虚拟场景、音视频、聊天、白板                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## 5. 前端集成设计
- **入口组件**：在 `src/pages/education-training/SchedulingClassroom`、`TutorPortal` 以及团队管理相关排班页面扩展 `MeetingEntryCard`，展示会议时间、主持人、入口按钮。
- **渲染模式**：
  - MVP 阶段使用 `<iframe>` 在抽屉或全屏对话框中加载 `SkyOffice` 客户端，保持原系统导航。
  - 提供“打开独立窗口”选项，满足多人协作时的多屏需求。
- **令牌获取**：入口组件在点击前调用 `/api/meetings/token`，返回包含房间 ID、角色、临时 JWT 的 URL。
- **状态同步**：使用 React Query/SWR 缓存会议数据；当 webhook 推送出勤结果时，通过 Supabase Realtime 触发前端刷新。
- **异常处理**：若 SkyOffice 无法加载，显示降级策略（跳转备用 Zoom/Teams 链接），并上报 `Monitoring.logEvent('meeting_fail', ...)`。

## 6. 后端与服务改造
- **会议元数据表**（Supabase PostgreSQL）：
  - `meeting_sessions`：`id`、`title`、`host_id`、`room_id`、`start_time`、`end_time`、`status`。
  - `meeting_participants`：`session_id`、`user_id`、`role`、`attendance_status`、`entered_at`、`left_at`。
  - 与 `scheduling_classes`、`tutor_assignments` 建立外键，用于课程/导师关联。
- **API 边界**：
  - `POST /api/meetings`：根据课程/会议配置调用 SkyOffice Admin API 创建房间，写入 `meeting_sessions`。
  - `POST /api/meetings/token`：校验当前用户权限 → 请求 SkyOffice Gateway 生成一次性 token → 返回访问 URL。
  - `POST /api/meetings/webhook`：接收房间事件（用户加入/离开、录制链接），更新数据库并触发通知。
- **身份与 SSO**：
  - 管理系统使用 Supabase JWT；SkyOffice 新增 `SupabaseJwtStrategy`，通过共享密钥或 JWK 验证。
  - 令牌中包含 `sub` (user_id)、`role`、`displayName`、`avatarUrl`，映射到 SkyOffice 的 Presence 服务。
- **权限控制**：内部管理模块提供会议模板（如试听课、导师例会）与角色权限（主持人、参与者、访客）。

## 7. 数据与监控策略
- **数据同步**：SkyOffice webhook 回写出勤、录制、聊天纪要，写入 `meeting_participants` 与 `meeting_artifacts`。
- **BI 与报表**：在 `operations-dashboard` 增加会议参与率、平均时长、网络质量指标等图卡。
- **监控与告警**：
  - 前端接入 Sentry/Datadog RUM，捕获 iframe 加载异常。
  - 后端记录令牌签发与房间创建日志，设置失败重试与 Slack 告警。
  - SkyOffice 服务器指标纳入 Prometheus（CPU、WebRTC 连接数、房间数）。

## 8. 安全与合规要求
- 所有通信使用 HTTPS/WSS，SkyOffice 部署在专用子域 `meet.infinite.ai`，启用 HSTS。
- 会议令牌有效期 ≤ 5 分钟，仅限一次使用，加入房间后立即失效。
- 聊天、录制数据存储遵循所在地区隐私法规（GDPR/《个人信息保护法》），提供数据导出与删除接口。
- 对外来宾需经过主持人二次确认，避免未经授权接入。

## 9. 部署与运维
- **环境区分**：开发、预发布、生产三套环境，SkyOffice 客户端使用 `NEXT_PUBLIC_SKYOFFICE_BASE_URL` 控制。
- **CI/CD**：在管理系统 Vercel Pipeline 中新增 `.github/workflows/skyoffice-integration.yml`，部署后运行端到端冒烟测试（通过 Playwright 检查 iframe 加载与令牌签发）。
- **回滚策略**：保留原有第三方会议链接配置，SkyOffice 服务状态异常时快速切换。

## 10. 迭代里程碑与资源评估
- **团队投入**：前端 1 人、后端 1 人、SkyOffice 服务维护 1 人、产品/QA 各 0.5 人月。
- **关键里程碑**：
  1. 第 1 周：完成接口设计、数据库迁移、SkyOffice Auth 适配。
  2. 第 2 周：完成前端入口组件、MVP 提测与用户培训。
  3. 第 4 周：上线会议模板、排课自动化、统计报表。
  4. 第 8 周：实现录制/纪要回写、AI 助理 PoC。

## 11. 风险与应对
- **网络兼容性**：弱网环境下 WebRTC 体验劣化 → 提供音频优先模式、带宽自适应策略。
- **身份同步失败**：SSO 令牌失效导致无法进入房间 → 在令牌接口增加重签发与缓存。
- **数据一致性**：Webhook 丢失导致出勤缺失 → 使用消息队列（如 Supabase Functions → Queue）与补偿任务。
- **用户培训成本**：虚拟办公界面复杂 → 提供 5 分钟引导视频与 FAQ。

## 12. 下一步行动建议
1. 与 `SkyOffice` 团队确认 Admin API、部署资源、Auth 接口细节。
2. 在管理系统 `System Settings` 中新增“线上会议”配置页，支持开关与域名/密钥管理。
3. 基于 `education training/scheduling-classroom.md` 流程更新，加上会议创建步骤与通知。
4. 准备 MVP 原型演示，邀请教务/导师试用收集反馈。

## 13. 实施进展记录
- 2025-11-10：管理端新增 `SkyOffice 会议室` 导航入口与嵌入页，支持通过 iframe 先行体验官方部署版本；待后续接入 SSO 与房间模板后，再切换至自建域名。
- 2025-11-11：导航入口升级为“新窗口打开”模式，直接跳转配置的 `SkyOffice` 域名（默认官方站点），保障沉浸式体验；iframe 页保留用于后续深度集成开发。


