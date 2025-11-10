# CRM Center · 协同空间（Collaboration Hub）设计文档

## 1. 模块定位
- **所属导航**：`CRM Center / Collaboration Hub`
- **目标**：打造销售、市场、服务团队的协同枢纽，提升沟通透明度、目标对齐与知识沉淀。
- **角色**：销售顾问、销售经理、市场运营、客服、管理层、人力培训。

## 2. 信息架构
```
Collaboration Hub
├─ 目标与 KPI 看板（Goals & KPI）
│  ├ 团队目标进度条
│  ├ 个人 KPI 卡片
│  ├ Top Performer 与激励机制
├─ 团队动态（Team Feed）
│  ├ 系统通知
│  ├ 手动公告
│  ├ 协作评论区
├─ 协作任务与请求（Collaboration Tasks）
│  ├ 跨部门需求表单
│  ├ 处理进度追踪
│  └ SLA / 责任人
├─ 知识库与模板（Knowledge Base）
│  ├ 成功案例、话术库、标准流程
│  ├ AI 生成/推荐内容
│  └ 版本管理、评分反馈
└─ 培训与活动（Enablement）
   ├ 培训日历、报名
   ├ 课程资料、回放
   └ 考核与认证情况
```

## 3. 功能细化

### 3.1 目标与 KPI 看板
- 管理层配置团队季度、月度目标（签约金额、回款、续约率）。
- 实时数据显示完成度、环比、预测达成率。
- 个人 KPI 卡片展示顾问的跟进量、签约、回款、客户满意度，支持与团队平均值对比。
- Top Performer 模块突出表现优秀的成员，可配置激励规则（奖金、荣誉）。

### 3.2 团队动态
- Feed 流整合系统自动通知（新线索、合同状态、风险提醒）及手动公告（活动、策略更新）。
- 支持评论、点赞、@ 提醒、附件上传。
- 动态可设为仅团队可见或全公司可见，相关标签（#市场活动、#销售技巧）。
- 与时间轴联动：在动态中直接跳转到相关线索、合同、任务。

### 3.3 协作任务与请求
- 提供标准化表单，如“需求市场素材”“申请折扣审批”“请求客服介入”。
- 每个请求生成任务卡片，显示发起人、接收部门、负责人、截止时间、状态。
- 支持 SLA 设置（如市场 3 天内提供素材），超时自动提醒与升级。
- 任务看板按状态（待处理、处理中、完成）和部门分组，便于跟踪。

### 3.4 知识库与模板
- 内容类型：成功案例、话术脚本、异议处理、法律合规指南、操作手册、FAQ。
- 支持多级目录、标签、全文搜索，记录阅读次数、收藏、点赞。
- 文档版本管理：编辑提交后需审批（如合规部门），保留历史版本。
- AI 助手：可基于知识库快速生成邮件、话术、FAQ 回答；提供引用来源。
- 定期评审机制：管理员设定内容有效期，到期提醒更新或下线。

### 3.5 培训与活动
- 培训日历展示即将开展的培训/活动，支持报名、签到、回放观看。
- 课程资料（PPT、视频、文档）集中管理，支持权限控制。
- 培训完成后自动记录成绩与证书，更新顾问能力标签。
- 统计培训参与率、考核通过率，发现培训需求。

## 4. 数据模型
- `TeamGoal`：目标定义（id、name、period、target_value、metric、owner、status）。
- `GoalProgress`：目标进度（goal_id、actual_value、forecast_value、updated_at）。
- `KPIRecord`：个人指标（user_id、metric、period、value、target、trend）。
- `Feed`：动态（id、type、title、content、attachments、visibility、created_by、created_at）。
- `FeedComment`：评论（feed_id、user_id、content、reply_to、created_at）。
- `CollaborationRequest`：协作请求（id、category、description、department、assignee、status、priority、sla_due、history[]）。
- `KnowledgeArticle`：知识库文章（id、title、category、tags、content、status、version、approver、updated_at）。
- `TrainingEvent`：培训活动（id、title、type、start_time、end_time、location、materials、host、quota、status）。
- `TrainingRecord`：学习记录（event_id、user_id、attendance、score、certificate_link）。

## 5. API 草案
| 功能 | Method | Endpoint | 说明 |
|------|--------|----------|------|
| 获取目标与 KPI | GET | `/api/crm/collab/goals` | 支持按团队、时间过滤 |
| 更新目标 | POST/PATCH | `/api/crm/collab/goals` | 创建/修改目标、设置指标 |
| 获取动态 | GET | `/api/crm/collab/feeds` | 支持分页、标签过滤、搜索 |
| 发布动态 | POST | `/api/crm/collab/feeds` | 支持附件、提及、可见范围 |
| 创建协作请求 | POST | `/api/crm/collab/requests` | 表单提交，自动分派 |
| 更新协作进度 | PATCH | `/api/crm/collab/requests/:id` | 状态更新、协同记录 |
| 获取知识库 | GET | `/api/crm/collab/knowledge` | 多条件过滤、全文搜索 |
| 管理知识库 | POST/PATCH | `/api/crm/collab/knowledge` | 创建/编辑、提交审批 |
| 查询培训活动 | GET | `/api/crm/collab/trainings` | 日历、列表视图 |
| 报名/签到 | POST | `/api/crm/collab/trainings/:id/register` | 支持签到、回放记录 |

## 6. 交互与体验
- 目标看板：支持切换视图（柱状图、折线图、仪表盘）；鼠标悬停显示具体数据与预测。
- 动态 Feed：支持 Markdown/富文本、附件预览、置顶、关联对象（线索/合同）。
- 协作请求：表单支持动态字段（根据类别展示不同项），任务详情页展示沟通记录与 SLA 倒计时。
- 知识库：阅读后可一键生成“快速行动”（创建任务/模板），AI 推荐与当前客户相关的案例或话术。
- 培训板块：日历+列表切换，课程详情展示讲师、目标人群、所需准备、课后任务。

## 7. 自动化与通知
- KPI 低于阈值时推送预警，并附带改进建议链接。
- 协助请求超时自动升级给上级或改派其他部门。
- 重要公告支持强提醒（需确认阅读）；未确认用户会收到重复提醒。
- 培训报名截止/签到/考试提醒自动发送；完成后更新能力标签。
- 知识库文章到期提醒作者更新；高频搜索无结果时提示补充内容。

## 8. 指标与度量
- 目标达成率、预测准确度、目标滞后指标。
- 动态互动率（阅读、评论、点赞）、公告阅读率。
- 协作请求数量、处理时长、SLA 达成率、满意度评分。
- 知识库使用率：阅读量、收藏、评分、更新频次。
- 培训参与率、通过率、能力提升评分。

## 9. 权限策略
- 普通销售：查看团队目标、动态、知识库，提交协作请求、参加培训。
- 经理：配置团队目标、发布公告、审批知识库、分派协作请求。
- 市场/客服：访问与自身相关的目标、动态，可发起/处理协作请求，贡献知识库内容。
- 管理层：全局查看、审批跨部门请求、配置自动化规则。
- 所有操作记录审计日志，公告强提醒需记录确认时间。

## 10. 迭代计划
1. **MVP**：目标看板、动态发布、协作请求、知识库、培训日历基础功能。
2. **阶段二**：自动化提醒、AI 知识推荐、请求 SLA、个人 KPI 深入分析。
3. **阶段三**：跨模块联动（线索/合同通知）、培训考核体系、AI 辅助总结。
4. **阶段四**：OKR 管理、绩效激励规则、跨团队协同工作流、移动端优化。

---
未来可整合“战情室（War Room）”与“咨询直播”等实时协作能力，进一步提升大型 Campaign 的执行效率。
