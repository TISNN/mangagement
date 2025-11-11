# StudylandsEdu 项目数据库结构（2025-11-11 更新）

> **数据来源**：通过 Supabase MCP 实时查询 `studylandsedu` 项目（Project ID `swyajeiqqewyckzbfkid`，Region `ap-southeast-1`）的最新元数据。本文档面向产品、设计、研发与数据治理团队，是后续迭代和排期的权威参考。

---

## 1. 总览

- **数据库引擎**：PostgreSQL 15.8.1（Supabase GA 渠道）
- **主要 Schema**：`public`（业务数据）、`auth`、`storage`、`realtime`、`pgsodium`、`vault`（系统 Schema）
- **行级安全 RLS**：仅 `direct_messages` 与 `unread_messages` 默认开启，其余业务表未启用，需要在对外开放 API 前补齐策略
- **高级特性**：大量使用 `UUID`、`JSONB`、数组列、`now()` 默认时间戳与枚举约束，需配套类型定义/JSON Schema

---

## 2. 业务域与表清单

### 2.1 学生与服务域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `students` | 学生基础信息 | `name`、`education_level`、`target_countries[]`、`status`、`auth_id` | ← `student_services.student_ref_id`、`finance_transactions.student_ref_id`、`tasks.related_student_id`、`student_profile.student_id` |
| `student_profile` | 学生申请档案扩展 | 联系方式、教育背景、`document_files` JSONB、`work_experiences` JSONB、`standardized_tests` JSONB | → `students` |
| `student_services` | 学生签约服务 | `service_type_id`、`status`、`progress`、`detail_data` JSONB、`mentor_team` JSONB、`mentor_ref_id` | → `students`、`service_types`、`mentors`；← `service_progress` |
| `service_types` | 服务类型树 | `category`、`education_level`、`parent_id`（自关联） | ← `student_services`、`leads.interest`、`finance_transactions.service_type_id` |
| `service_progress` | 服务进度里程碑 | `completed_items` JSONB、`next_steps` JSONB、`attachments` JSONB、`employee_ref_id` | → `student_services`、`employees` |
| `student_service_relations` | 学生-服务多对多 | `student_id`、`service_id` | → `students`、`student_services` |
| `final_university_choices` | 最终选校列表 | `submission_status`、`decision_result`、`priority_rank` | ← `application_documents_checklist.university_choice_id` |
| `application_documents_checklist` | 申请材料清单 | `document_name`、`status`、`progress`、`file_url` | → `students`、`final_university_choices` |
| `student_meetings` | 学生会议记录 | `meeting_documents` JSONB、`participants[]`、`meeting_link` | → `students` |

### 2.2 导师与员工域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `mentors` | 导师档案 | `specializations[]`、`service_scope[]`、`expertise_level`、`employee_id` | ← `student_services.mentor_ref_id` |
| `employees` | 员工/顾问/导师 | `department`、`position`、`skills[]`、`is_partner`、`is_mentor`、`auth_id` | 被任务、服务进度、财务、会议、知识库等大量引用 |
| `employee_roles` | 角色定义 | `name`、`description` | ← `employee_role_assignments.role_id` |
| `employee_role_assignments` | 员工与角色绑定 | `employee_id`、`role_id` | → `employees`、`employee_roles` |
| `permissions` | 权限点定义 | `code` 唯一、`description` | ← `role_permissions.permission_id` |
| `role_permissions` | 角色-权限映射 | `role_id`、`permission_id` | → `employee_roles`、`permissions` |

### 2.3 项目任务域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `tasks` | 项目任务 | `status`（待处理/进行中/已完成/已取消）、`priority`、`assigned_to[]`、`attachments` JSONB、`related_student_id`、`related_lead_id`、`meeting_id` | → `employees`、`leads`、`students`、`meetings` |
| `subtasks` | 子任务 | `task_id`、`status`、`completed`、`due_date` | → `tasks` |
| `task_comments` | 评论 | `task_id`、`employee_id`、`content` | → `tasks`、`employees` |
| `task_attachments` | 附件 | `file_url`、`uploaded_by`、`file_size` | → `tasks`、`employees` |
| `projects` | 合同/项目 | `status`、`client_id`、`total_amount` | ← `finance_transactions.project_id` |

### 2.4 财务域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `finance_accounts` | 财务账户 | `name`、`type`、`balance` | ← `finance_transactions.account_id` |
| `finance_categories` | 收支分类 | `direction`（收入/支出） | ← `finance_transactions.category_id` |
| `finance_transactions` | 收支流水 | `amount`、`direction`、`status`、`transaction_date`、`person_type`、`notes` | → `students`、`employees`、`projects`、`service_types`、`finance_accounts`、`finance_categories` |

### 2.5 CRM / 销售域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `leads` | 销售线索 | `status`、`priority`、`last_contact`、`interest`（服务类型） | → `service_types`、`employees` |
| `lead_logs` | 跟进记录 | `log_date`、`next_follow_up`、`employee_id` | → `leads`、`employees` |

### 2.6 教育培训域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `courses` | 课程定义 | `level`、`subject`、`prerequisites`、`duration`、`cost` | ← `classes.course_id` |
| `classes` | 班级安排 | `schedule`、`capacity`、`location`、`instructor_id`、`status`（默认“未开始”） | → `courses`、`employees` |

### 2.7 学校与项目域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `schools` | 学校库 | `cn_name`、`en_name`、`country`、`qs_rank_2024/2025`、`tags`、`website_url` | ← `programs`、`user_favorite_schools` |
| `programs` | 院校项目 | `duration`、`apply_requirements`、`language_requirements`、`category`、`tuition_fee`、`analysis` | → `schools`、`success_cases`、`user_favorite_programs` |
| `success_cases` | 成功案例 | `student_name`、`admission_year`、`language_scores`、`experiecnce` | → `programs` |
| `user_favorite_schools` / `user_favorite_programs` | 收藏关系 | `user_id`、目标 ID、`created_at` | → `schools`、`programs` |

### 2.8 知识库域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `knowledge_resources` | 知识资源 | `type`（document/video/article/template）、`category`、`tags[]`、`status`（draft/published/archived）、`views`、`downloads`、`author_id` | → `employees` |
| `knowledge_comments` | 评论 | `content`、`likes`、`parent_comment_id` | → `knowledge_resources`、`employees` |
| `knowledge_comment_likes` | 评论点赞 | `comment_id`、`user_id` | → `knowledge_comments`、`employees` |
| `knowledge_bookmarks` | 收藏 | `resource_id`、`user_id` | → `knowledge_resources`、`employees` |

### 2.9 会议与协同域

| 表名 | 作用 | 关键字段 | 关联 |
| --- | --- | --- | --- |
| `meetings` | 会议主表 | `meeting_type`、`status`、`participants` JSONB、`agenda`、`minutes`、`meeting_link` | ← `tasks.meeting_id`，→ `employees` |
| `meeting_documents` | 会议文档 | `title`、`content`、`created_by` | → `employees` |
| `student_meetings` | 学生会议 | 详见 2.1 | → `students` |

### 2.10 消息与通知域（RLS 已启用）

| 表名 | RLS | 作用 |
| --- | --- | --- |
| `direct_messages` | ✅ | 一对一消息通道（`user_id_1`、`user_id_2`、`channel_id`） |
| `unread_messages` | ✅ | 未读计数（`user_id`、`channel_id`、`count`、`last_read_at`） |

> 备注：旧版 `chat_channels` / `chat_messages` / `channel_members` 未在本次查询结果中返回，如仍使用请在迁移记录中确认。

---

## 3. 关系图（文字版）

```
students ─┬─< student_services >─┬─ service_types
          │                     └─ mentors (mentor_ref_id)
          ├─< student_profile
          ├─< final_university_choices ─< application_documents_checklist
          └─< student_meetings

student_services ─< service_progress (employee_ref_id → employees)
student_services ─< student_service_relations >─ students

employees ─┬─< service_progress
           ├─< tasks (created_by) ─< subtasks / task_comments / task_attachments
           ├─< finance_transactions (employee_ref_id)
           ├─< lead_logs
           ├─< knowledge_resources (author_id / created_by / updated_by)
           ├─< meetings (created_by)
           └─< employee_role_assignments >─ employee_roles ─< role_permissions >─ permissions

leads ─< lead_logs
leads ─< tasks.related_lead_id

courses ─< classes (instructor_id → employees)

schools ─< programs ─< success_cases
schools ─< user_favorite_schools
programs ─< user_favorite_programs

projects ─< finance_transactions
finance_accounts / finance_categories ─< finance_transactions
```

---

## 4. 行级安全（RLS）现状

| 表 | 状态 | 建议 |
| --- | --- | --- |
| `direct_messages` | 已开启 | 基于 `auth.uid()` 校验参与者身份 |
| `unread_messages` | 已开启 | 同上 |
| 其余业务表 | 未开启 | 若需对运营/学生开放 API 或实现多租户隔离，需分阶段补齐策略 |

---

## 5. 维护与治理建议

1. **Schema 版本化**：结合 Supabase Migration/dbmate/Prisma Schema 做版本管理，避免环境漂移。
2. **JSONB/数组字段规范**：为 `mentor_team`、`detail_data`、`attachments` 等建立统一数据字典，前后端共享 JSON Schema。
3. **索引优化**：关注高频查询字段（如 `student_services.student_ref_id`、`tasks.status`、`leads.assigned_to`），在 Supabase 控制台监控执行计划并按需加索引。
4. **RLS 策略规划**：面向学生端/顾问端开放能力前，需要梳理角色定义并设计策略函数。
5. **数据模拟**：当前实际数据行数较少（0~33 行），建议补充 Seed 脚本支撑前端演示和测试。
6. **监控与告警**：启用 Supabase Log Drains/APM，对慢查询、锁等待和 JSONB 大字段写入进行监控。

---

## 6. 更新日志

- **2025-11-11**：首次通过 Supabase MCP 自动获取元数据并重写文档，补充课程/班级、任务体系、知识库、会议等新表，更新 RLS 与维护建议。

---

如需导出完整 DDL，可在 Supabase SQL 控制台执行 `pg_dump --schema-only --schema=public`，或导入 dbdiagram.io/DrawSQL 生成 ER 图。任何数据库结构调整（新增字段、索引、RLS）请同步更新本文档并在 PR 中附迁移脚本与回滚方案。

