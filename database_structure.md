# StudylandsEdu 项目数据库结构（2025-01-XX 更新）

> **数据来源**：通过 Supabase MCP 实时查询 `studylandsedu` 项目（Project ID `swyajeiqqewyckzbfkid`，Region `ap-southeast-1`）的最新元数据。本文档面向产品、设计、研发与数据治理团队，是后续迭代和排期的权威参考。

---

## 1. 总览

- **数据库引擎**：PostgreSQL 15.8（Supabase GA 渠道）
- **主要 Schema**：`public`（业务数据）、`auth`、`storage`、`realtime`、`pgsodium`、`vault`（系统 Schema）
- **行级安全 RLS**：部分表已启用 RLS 策略，详见第 4 节
- **高级特性**：大量使用 `UUID`、`JSONB`、数组列、`now()` 默认时间戳与枚举约束，需配套类型定义/JSON Schema
- **数据统计**：共 49 张业务表，数据行数从 0 到 195 不等

---

## 2. 业务域与表清单

### 2.1 学生与服务域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `students` | 学生基础信息 | `name`、`education_level`、`target_countries[]`、`status`、`auth_id` | ← `student_services.student_ref_id`、`finance_transactions.student_ref_id`、`tasks.related_student_id`、`student_profile.student_id`、`professor_match_records.student_id` | 34 |
| `student_profile` | 学生申请档案扩展 | `full_name`、`phone_number`、`application_email`、`undergraduate_*`、`graduate_*`、`document_files` JSONB、`work_experiences` JSONB、`standardized_tests` JSONB | → `students` | 3 |
| `student_services` | 学生签约服务 | `service_type_id`、`status`、`progress`、`detail_data` JSONB、`mentor_team` JSONB、`mentor_ref_id`、`student_ref_id` | → `students`、`service_types`、`mentors`；← `service_progress`、`student_service_relations` | 21 |
| `service_types` | 服务类型树 | `name`、`category`、`education_level`、`parent_id`（自关联） | ← `student_services`、`leads.interest`、`finance_transactions.service_type_id` | 16 |
| `service_progress` | 服务进度里程碑 | `student_service_id`、`progress_date`、`milestone`、`completed_items` JSONB、`next_steps` JSONB、`attachments` JSONB、`employee_ref_id` | → `student_services`、`employees` | 2 |
| `student_service_relations` | 学生-服务多对多 | `student_id`、`service_id` | → `students`、`student_services` | 0 |
| `final_university_choices` | 最终选校列表 | `student_id`、`school_name`、`program_name`、`submission_status`、`decision_result`、`priority_rank`、`application_account`、`application_password` | → `students`；← `application_documents_checklist.university_choice_id` | 16 |
| `application_documents_checklist` | 申请材料清单 | `student_id`、`university_choice_id`、`document_name`、`document_type`、`status`、`progress`、`file_url`、`due_date` | → `students`、`final_university_choices` | 0 |
| `student_meetings` | 学生会议记录 | `student_id`、`title`、`start_time`、`end_time`、`participants[]`、`meeting_documents` JSONB、`meeting_link`、`status` | → `students` | 0 |

### 2.2 导师与员工域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `mentors` | 导师档案 | `name`、`specializations[]`、`service_scope[]`、`expertise_level`、`hourly_rate`、`employee_id`、`location` | ← `student_services.mentor_ref_id` | 0 |
| `employees` | 员工/顾问/导师 | `name`、`email`、`department`、`position`、`skills[]`、`is_partner`、`is_mentor`、`auth_id` | 被任务、服务进度、财务、会议、知识库等大量引用 | 0 |
| `employee_roles` | 角色定义 | `name`（唯一）、`description` | ← `employee_role_assignments.role_id`、`role_permissions.role_id` | 0 |
| `employee_role_assignments` | 员工与角色绑定 | `employee_id`、`role_id` | → `employees`、`employee_roles` | 0 |
| `permissions` | 权限点定义 | `code`（唯一）、`description` | ← `role_permissions.permission_id` | 0 |
| `role_permissions` | 角色-权限映射 | `role_id`、`permission_id` | → `employee_roles`、`permissions` | 0 |
| `professors` | 海外教授主数据 | `name`、`university`、`country`、`school_id`、`research_tags[]`、`signature_projects[]`、`funding_options` JSONB、`match_score`、`intake`、`publications` JSONB、`phd_requirements` JSONB | → `schools`、`employees`（created_by/updated_by）；← `professor_favorites.professor_id`、`professor_match_records.professor_id` | 176 |
| `professor_favorites` | 顾问收藏教授 | `employee_id`、`professor_id`、`created_at` | → `employees`、`professors` | 0 |
| `professor_match_records` | 教授匹配记录 | `professor_id`、`student_id`、`employee_id`、`target_intake`、`status`、`custom_note` | → `professors`、`students`、`employees` | 0 |

### 2.3 项目任务域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `tasks` | 项目任务 | `title`、`status`（待处理/进行中/已完成/已取消）、`priority`（高/中/低）、`assigned_to[]`、`attachments` JSONB、`related_student_id`、`related_lead_id`、`meeting_id`、`task_domain`、`linked_entity_type`、`linked_entity_id` | → `employees`（created_by）、`leads`、`students`、`meetings`；← `subtasks`、`task_comments`、`task_attachments` | 33 |
| `subtasks` | 子任务 | `task_id`、`title`、`status`、`completed`、`due_date` | → `tasks` | 2 |
| `task_comments` | 评论 | `task_id`、`employee_id`、`content` | → `tasks`、`employees` | 0 |
| `task_attachments` | 附件 | `task_id`、`file_name`、`file_url`、`file_path`、`file_size`、`mime_type`、`uploaded_by` | → `tasks`、`employees` | 4 |
| `projects` | 合同/项目 | `name`、`status`、`client_id`、`start_date`、`end_date`、`total_amount` | ← `finance_transactions.project_id` | 0 |

### 2.4 财务域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `finance_accounts` | 财务账户 | `name`、`type`、`balance`、`is_active` | ← `finance_transactions.account_id` | 0 |
| `finance_categories` | 收支分类 | `name`、`description`、`direction`（收入/支出）、`is_active` | ← `finance_transactions.category_id` | 0 |
| `finance_transactions` | 收支流水 | `amount`、`direction`（收入/支出）、`status`（已完成/待收款/待支付/已取消）、`transaction_date`、`person_type`、`student_ref_id`、`employee_ref_id`、`project_id`、`service_type_id`、`account_id`、`category_id`、`notes` | → `students`、`employees`、`projects`、`service_types`、`finance_accounts`、`finance_categories` | 0 |

### 2.5 CRM / 销售域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `leads` | 销售线索 | `name`、`phone`、`email`、`status`（初次接触/跟进中/已转化/已放弃）、`priority`（高/中/低）、`risk_level`、`last_contact`、`interest`（服务类型）、`assigned_to`、`tags[]`、`ai_score`、`campaign`、`next_action` | → `service_types`、`employees`；← `lead_logs`、`tasks.related_lead_id` | 3 |
| `lead_logs` | 跟进记录 | `lead_id`、`employee_id`、`log_date`、`content`、`next_follow_up` | → `leads`、`employees` | 0 |

### 2.6 教育培训域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `courses` | 课程定义 | `name`、`description`、`level`、`subject`、`target_audience`、`prerequisites`、`duration`、`cost`、`materials`、`is_active` | ← `classes.course_id` | 0 |
| `classes` | 班级安排 | `course_id`、`name`、`start_date`、`end_date`、`schedule`、`capacity`、`location`、`instructor_id`、`status`（默认"未开始"）、`enrollment_count`、`is_active` | → `courses`、`employees` | 0 |

### 2.7 学校与项目域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `schools` | 学校库 | `cn_name`、`en_name`、`country`、`city`、`region`、`qs_rank_2024`、`qs_rank_2025`、`ranking`、`tags`、`website_url`、`logo_url`、`description`、`is_verified` | ← `programs`、`user_favorite_schools`、`professors.school_id` | 2 |
| `programs` | 院校项目 | `school_id`、`cn_name`、`en_name`、`duration`、`apply_requirements`、`language_requirements`、`category`、`tuition_fee`、`analysis`、`degree`、`career`、`entry_month`、`interview`、`url` | → `schools`；← `success_cases`、`user_favorite_programs` | 1 |
| `success_cases` | 成功案例 | `student_name`、`program_id`、`admission_year`、`gpa`、`language_scores`、`experiecnce`、`bachelor_university`、`bachelor_major`、`applied_program`、`school` | → `programs` | 1 |
| `user_favorite_schools` | 学校收藏 | `user_id`（UUID）、`school_id`、`created_at` | → `schools` | 0 |
| `user_favorite_programs` | 项目收藏 | `user_id`（UUID）、`program_id`、`created_at` | → `programs` | 0 |

### 2.8 知识库域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `knowledge_resources` | 知识资源 | `title`、`type`（document/video/article/template）、`category`、`tags[]`、`status`（draft/published/archived）、`views`、`downloads`、`author_id`、`created_by`、`updated_by`、`content`、`file_url`、`thumbnail_url` | → `employees`；← `knowledge_comments`、`knowledge_bookmarks` | 4 |
| `knowledge_comments` | 评论 | `resource_id`、`user_id`、`user_name`、`user_avatar`、`content`、`likes`、`parent_comment_id`（支持回复） | → `knowledge_resources`、`employees`；← `knowledge_comment_likes` | 0 |
| `knowledge_comment_likes` | 评论点赞 | `comment_id`、`user_id`、`created_at` | → `knowledge_comments`、`employees` | 0 |
| `knowledge_bookmarks` | 收藏 | `resource_id`、`user_id`、`created_at` | → `knowledge_resources`、`employees` | 0 |

### 2.9 会议与协同域

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `meetings` | 会议主表 | `title`、`meeting_type`、`status`（默认"待举行"）、`start_time`、`end_time`、`location`、`meeting_link`、`participants` JSONB、`agenda`、`minutes`（HTML格式）、`summary`、`attachments` JSONB、`created_by`、`lead_id` | → `employees`；← `tasks.meeting_id` | 5 |
| `meeting_documents` | 会议文档 | `title`、`content`（富文本HTML）、`created_by` | → `employees` | 0 |
| `student_meetings` | 学生会议 | 详见 2.1 | → `students` | 0 |
| `cloud_documents` | 云文档 | `title`、`content`（富文本HTML）、`status`（draft/published/archived）、`category`、`tags[]`、`location`、`is_favorite`、`views`、`last_accessed_at`、`created_by` | → `employees`；← `document_annotations.document_id` | 0 |
| `document_annotations` | 文档批注 | `document_id`、`created_by`、`content`、`selected_text`、`start_pos`、`end_pos`、`parent_id`（回复）、`is_resolved` | → `cloud_documents`、`employees`、`document_annotations`（自关联） | 0 |

### 2.10 消息与通知域（RLS 已启用）

| 表名 | RLS | 作用 | 数据行数 |
| --- | --- | --- | --- |
| `direct_messages` | ✅ | 一对一消息通道（`user_id_1`、`user_id_2`、`channel_id`） | 0 |
| `unread_messages` | ✅ | 未读计数（`user_id`、`channel_id`、`count`、`last_read_at`） | 0 |

### 2.11 PhD 职位域（新增）

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `phd_positions` | PhD 职位信息 | `source`、`source_id`、`title_en`、`title_zh`、`university`、`department`、`country`、`city`、`intake_term`、`deadline`、`deadline_status`、`employment_type`、`funding_level`、`supports_international`、`description_en/zh`、`requirements_en/zh`、`application_steps_en/zh`、`tags[]`、`match_score`、`raw_payload` JSONB | ← `phd_position_favorites.position_source_id` | 195 |
| `phd_position_favorites` | 员工收藏的 PhD 职位 | `position_source_id`、`employee_id`、`created_at` | → `phd_positions`、`employees` | 0 |

### 2.12 合作伙伴域（新增）

| 表名 | 作用 | 关键字段 | 关联 | 数据行数 |
| --- | --- | --- | --- | --- |
| `partners` | 合作伙伴主表 | `name`、`type`（university/professor/agency/company/other）、`status`（prospecting/negotiating/active/on_hold/closed）、`level`（strategic/key/regular/watch）、`country`、`city`、`website`、`logo_url`、`summary`、`rating`（1-5）、`tags[]`、`owner_id`、`owner_name`、`owner_title`、`highlight`、`internal_notes` | ← `partner_contacts`、`partner_engagements`、`partner_timelines`、`partner_favorites` | 0 |
| `partner_contacts` | 合作伙伴联系人 | `partner_id`、`name`、`role`、`email`、`phone`、`wechat`、`linkedin`、`is_primary` | → `partners` | 0 |
| `partner_engagements` | 合作伙伴合作项目 | `partner_id`、`title`、`category`、`related_student_id`（UUID）、`related_professor_id`（UUID）、`contract_status`（draft/reviewing/signed/expired）、`start_date`、`end_date`、`status`（planning/executing/completed/on_hold）、`next_action`、`owner_id`、`owner_name` | → `partners` | 0 |
| `partner_timelines` | 合作伙伴时间线记录 | `partner_id`、`note_type`（call/meeting/email/onsite/document/other）、`content`、`next_action`、`remind_at`、`attachments` JSONB、`created_by`、`created_by_name` | → `partners` | 0 |
| `partner_favorites` | 合作伙伴收藏 | `partner_id`、`user_id`（UUID）、`user_name`、`created_at` | → `partners` | 0 |

---

## 3. 关系图（文字版）

```
students ─┬─< student_services >─┬─ service_types
          │                     └─ mentors (mentor_ref_id)
          ├─< student_profile
          ├─< final_university_choices ─< application_documents_checklist
          ├─< student_meetings
          └─< professor_match_records

student_services ─< service_progress (employee_ref_id → employees)
student_services ─< student_service_relations >─ students

employees ─┬─< service_progress
           ├─< tasks (created_by) ─< subtasks / task_comments / task_attachments
           ├─< finance_transactions (employee_ref_id)
           ├─< lead_logs
           ├─< knowledge_resources (author_id / created_by / updated_by)
           ├─< meetings (created_by)
           ├─< meeting_documents (created_by)
           ├─< cloud_documents (created_by)
           ├─< document_annotations (created_by)
           ├─< professors (created_by / updated_by)
           ├─< professor_favorites
           ├─< professor_match_records
           ├─< phd_position_favorites
           ├─< direct_messages (user_id_1 / user_id_2)
           ├─< unread_messages
           ├─< classes (instructor_id)
           └─< employee_role_assignments >─ employee_roles ─< role_permissions >─ permissions

leads ─< lead_logs
leads ─< tasks.related_lead_id
leads ─< meetings.lead_id

courses ─< classes (instructor_id → employees)

schools ─┬─< programs ─< success_cases
        ├─< user_favorite_schools
        └─< professors (school_id)

programs ─< user_favorite_programs

projects ─< finance_transactions

finance_accounts / finance_categories ─< finance_transactions

phd_positions ─< phd_position_favorites (position_source_id)

partners ─┬─< partner_contacts
         ├─< partner_engagements
         ├─< partner_timelines
         └─< partner_favorites
```

---

## 4. 行级安全（RLS）现状

### 4.1 已启用 RLS 的表

| 表 | RLS 策略说明 | 策略类型 |
| --- | --- | --- |
| `direct_messages` | 用户只能访问自己的私聊（基于 `auth.uid()` 和 `employees.email` 匹配） | ALL |
| `unread_messages` | 用户只能访问自己的未读消息记录 | ALL |
| `professor_favorites` | 员工只能管理自己的教授收藏 | ALL |
| `professor_match_records` | 员工只能管理自己的教授匹配记录 | ALL |
| `phd_position_favorites` | 员工只能管理自己的 PhD 职位收藏 | ALL |

### 4.2 部分启用 RLS 策略的表

| 表 | RLS 策略说明 | 策略类型 |
| --- | --- | --- |
| `employees` | 管理员或本人可查看；本人或合作伙伴可更新 | SELECT, UPDATE |
| `employee_roles` | 所有人可查看；仅管理员可全部操作 | SELECT, ALL |
| `employee_role_assignments` | 所有人可查看；仅管理员可全部操作 | SELECT, ALL |
| `permissions` | 仅管理员可全部操作 | ALL |
| `finance_transactions` | 所有人可访问；管理员有额外权限 | ALL |
| `finance_accounts` | 允许公开访问 | ALL |
| `finance_categories` | 允许公开访问 | ALL |
| `leads` | 销售人员可查看/更新自己的线索；管理员有全部权限 | SELECT, INSERT, UPDATE, ALL |
| `lead_logs` | 销售人员可查看/插入自己相关的跟进记录；管理员有全部权限 | SELECT, INSERT, ALL |
| `mentors` | 仅管理员可全部操作 | ALL |
| `role_permissions` | 仅管理员可全部操作 | ALL |
| `service_types` | 允许公开访问 | ALL |
| `student_services` | 允许匿名插入/更新；认证用户可全部操作；管理员有额外权限 | INSERT, UPDATE, ALL |
| `students` | 仅管理员可全部操作 | ALL |
| `projects` | 允许公开访问 | ALL |

### 4.3 未启用 RLS 的表

以下表未启用 RLS，若需对运营/学生开放 API 或实现多租户隔离，需分阶段补齐策略：

- `student_profile`
- `service_progress`
- `student_service_relations`
- `final_university_choices`
- `application_documents_checklist`
- `student_meetings`
- `tasks`、`subtasks`、`task_comments`、`task_attachments`
- `courses`、`classes`
- `schools`、`programs`、`success_cases`
- `user_favorite_schools`、`user_favorite_programs`
- `knowledge_resources`、`knowledge_comments`、`knowledge_comment_likes`、`knowledge_bookmarks`
- `meetings`、`meeting_documents`、`cloud_documents`
- `professors`
- `phd_positions`
- `partners`、`partner_contacts`、`partner_engagements`、`partner_timelines`、`partner_favorites`

---

## 5. 详细字段说明

### 5.1 核心表字段详情

#### `students` 表
- **主键**：`id` (integer, 自增)
- **关键字段**：
  - `name` (varchar) - 学生姓名
  - `email` (varchar, 可空) - 邮箱
  - `contact` (varchar, 可空) - 联系方式
  - `education_level` (varchar, 可空) - 教育水平
  - `target_countries` (text[]) - 目标国家数组
  - `status` (varchar, 可空) - 学生状态（活跃/休学/毕业/退学等）
  - `auth_id` (uuid, 可空) - 关联认证用户 ID
- **时间戳**：`created_at`、`updated_at` (timestamptz, 默认 now())

#### `student_services` 表
- **主键**：`id` (integer, 自增)
- **关键字段**：
  - `student_id` (integer) - 学生 ID（旧字段）
  - `student_ref_id` (integer, 可空) - 学生引用 ID（新字段）
  - `service_type_id` (integer) - 服务类型 ID
  - `mentor_ref_id` (integer, 可空) - 导师引用 ID
  - `status` (varchar, 默认 '未开始') - 服务状态
  - `progress` (integer, 默认 0) - 进度百分比
  - `detail_data` (jsonb, 可空) - 详细数据 JSON
  - `mentor_team` (jsonb, 默认 '[]') - 导师团队 JSON 数组
- **外键**：→ `students`、`service_types`、`mentors`

#### `tasks` 表
- **主键**：`id` (integer, 自增)
- **关键字段**：
  - `title` (varchar) - 任务标题
  - `status` (varchar, 默认 '待处理') - 状态：待处理/进行中/已完成/已取消
  - `priority` (varchar, 默认 '中') - 优先级：高/中/低
  - `assigned_to` (int4[]) - 分配给（员工 ID 数组）
  - `attachments` (jsonb, 默认 '[]') - 附件 JSON 数组
  - `related_student_id` (integer, 可空) - 关联学生 ID
  - `related_lead_id` (integer, 可空) - 关联线索 ID
  - `meeting_id` (integer, 可空) - 关联会议 ID
  - `task_domain` (varchar, 默认 'general') - 任务域
  - `linked_entity_type` (varchar, 默认 'none') - 关联实体类型
  - `linked_entity_id` (integer, 可空) - 关联实体 ID
- **外键**：→ `employees`、`students`、`leads`、`meetings`

#### `professors` 表
- **主键**：`id` (bigint, 自增)
- **关键字段**：
  - `name` (text) - 教授姓名
  - `university` (text) - 大学名称
  - `school_id` (uuid, 可空) - 关联学校 ID
  - `country` (text) - 国家
  - `research_tags` (text[], 默认 '{}') - 研究标签数组
  - `publications` (jsonb, 默认 '[]') - 出版物 JSON
  - `funding_options` (jsonb, 默认 '[]') - 资助选项 JSON
  - `phd_requirements` (jsonb, 默认 '{}') - PhD 要求 JSON
  - `match_score` (integer, 默认 0) - 匹配分数
  - `intake` (text, 可空) - 入学时间
- **外键**：→ `schools`、`employees`（created_by/updated_by）

#### `phd_positions` 表
- **主键**：`id` (bigint, 自增)
- **关键字段**：
  - `source` (text) - 数据来源
  - `source_id` (text) - 来源 ID（唯一标识）
  - `title_en`、`title_zh` (text, 可空) - 职位标题（中英文）
  - `university`、`department` (text, 可空) - 大学和院系
  - `deadline` (timestamptz, 可空) - 截止日期
  - `description_en/zh`、`requirements_en/zh`、`application_steps_en/zh` (text, 可空) - 描述、要求、申请步骤（中英文）
  - `tags` (text[], 可空) - 标签数组
  - `raw_payload` (jsonb, 可空) - 原始数据 JSON
- **外键**：← `phd_position_favorites.position_source_id`

---

## 6. 维护与治理建议

1. **Schema 版本化**：结合 Supabase Migration/dbmate/Prisma Schema 做版本管理，避免环境漂移。
2. **JSONB/数组字段规范**：为 `mentor_team`、`detail_data`、`attachments`、`publications`、`funding_options` 等建立统一数据字典，前后端共享 JSON Schema。
3. **索引优化**：关注高频查询字段（如 `student_services.student_ref_id`、`tasks.status`、`leads.assigned_to`、`professors.school_id`、`phd_positions.source_id`），在 Supabase 控制台监控执行计划并按需加索引。
4. **RLS 策略规划**：面向学生端/顾问端开放能力前，需要梳理角色定义并设计策略函数。当前部分表已启用 RLS，但仍有大量表未启用。
5. **数据模拟**：当前实际数据行数差异较大（0~195 行），建议补充 Seed 脚本支撑前端演示和测试。
6. **监控与告警**：启用 Supabase Log Drains/APM，对慢查询、锁等待和 JSONB 大字段写入进行监控。
7. **字段命名一致性**：注意 `student_services` 表中同时存在 `student_id` 和 `student_ref_id`，建议统一使用 `student_ref_id` 并逐步废弃 `student_id`。
8. **UUID vs Integer**：部分表使用 UUID（如 `schools`、`programs`、`partners`），部分使用 Integer（如 `students`、`employees`），建议统一 ID 类型策略。

---

## 7. 更新日志

- **2025-01-22**：新增 `cloud_documents` 云文档表，支持文档的创建、编辑、状态管理、分类标签等功能。
- **2025-01-22**：新增 `document_annotations` 文档批注表，支持对文档内容进行批注、回复、标记已解决等功能。
- **2025-01-XX**：通过 Supabase MCP 实时查询更新，新增 `phd_positions`、`phd_position_favorites`、`partners` 及其相关表，更新 RLS 策略详情，补充字段说明。
- **2025-11-11**：首次通过 Supabase MCP 自动获取元数据并重写文档，补充课程/班级、任务体系、知识库、会议等新表，更新 RLS 与维护建议。

---

如需导出完整 DDL，可在 Supabase SQL 控制台执行 `pg_dump --schema-only --schema=public`，或导入 dbdiagram.io/DrawSQL 生成 ER 图。任何数据库结构调整（新增字段、索引、RLS）请同步更新本文档并在 PR 中附迁移脚本与回滚方案。
