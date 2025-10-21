# StudylandsEdu项目数据库结构文档

## 项目概述

StudylandsEdu是一个教育服务管理系统，主要用于管理留学教育服务相关的业务，包括学生管理、导师管理、服务管理、财务管理、学校和项目管理、以及销售线索管理等功能。该系统基于Supabase构建，位于AP-Southeast-1区域。

## 数据库结构

该数据库包含多个模式(Schema)，主要业务数据存储在public模式下，同时系统还包含auth、storage、realtime等Supabase预设模式。

### 核心业务表

#### 学生与服务管理

1. **students (学生表)**
   - 主键: id
   - 主要字段: name, email, contact, gender, education_level, school, major, target_countries, status
   - 功能: 存储学生基本信息

2. **service_types (服务类型表)**
   - 主键: id
   - 主要字段: name, description, is_active
   - 功能: 定义系统提供的服务类型

3. **mentors (导师表)**
   - 主键: id
   - 主要字段: name, email, contact, specializations, expertise_level, hourly_rate
   - 功能: 存储导师信息，包括专业领域和收费标准

4. **student_services (学生服务表)**
   - 主键: id
   - 外键: student_ref_id, service_type_id, mentor_ref_id
   - 主要字段: status, enrollment_date, end_date, progress, payment_status, detail_data
   - 功能: 记录学生购买的服务内容和状态

5. **service_progress (服务进度表)**
   - 主键: id
   - 外键: student_service_id, employee_ref_id
   - 主要字段: progress_date, milestone, description, completed_items, next_steps
   - 功能: 记录服务执行过程中的进度和里程碑

6. **student_service_relations (学生服务关系表)**
   - 主键: id
   - 外键: student_id, service_id
   - 功能: 建立学生和服务之间的多对多关系

#### 财务管理

1. **finance_accounts (财务账户表)**
   - 主键: id
   - 主要字段: name, type, balance, is_active
   - 功能: 管理系统中的财务账户

2. **finance_categories (财务类别表)**
   - 主键: id
   - 主要字段: name, description, direction
   - 功能: 定义财务收支的分类

3. **finance_transactions (财务交易表)**
   - 主键: id
   - 外键: student_ref_id, employee_ref_id, account_id, category_id, project_id, service_type_id
   - 主要字段: amount, direction, status, transaction_date, notes
   - 功能: 记录所有财务交易

4. **projects (项目表)**
   - 主键: id
   - 主要字段: name, status, client_id, start_date, end_date, total_amount
   - 功能: 管理项目信息和关联财务

#### 员工管理

1. **employees (员工表)**
   - 主键: id
   - 主要字段: name, email, contact, department, position, skills, is_active
   - 功能: 存储员工信息

#### 聊天系统

1. **chat_channels (聊天频道表)**
   - 主键: id
   - 外键: created_by
   - 主要字段: name, description, is_private, type
   - 功能: 定义系统中的聊天频道

2. **chat_messages (聊天消息表)**
   - 主键: id
   - 外键: channel_id, sender_id
   - 主要字段: content, attachments, is_edited
   - 功能: 存储聊天消息

3. **channel_members (频道成员表)**
   - 主键: channel_id, employee_id
   - 主要字段: joined_at, last_read_at
   - 功能: 记录频道成员和阅读状态

4. **direct_messages (直接消息表)**
   - 主键: id
   - 外键: user_id_1, user_id_2, channel_id
   - 功能: 管理用户间的一对一对话

5. **unread_messages (未读消息表)**
   - 主键: id
   - 外键: user_id, channel_id
   - 主要字段: count, last_read_at
   - 功能: 跟踪未读消息数量

#### 学校和项目管理

1. **schools (学校表)**
   - 主键: id
   - 主要字段: cn_name, en_name, logo_url, country, city, ranking, qs_rank_2024, qs_rank_2025
   - 功能: 存储学校信息

2. **programs (项目表)**
   - 主键: id
   - 外键: school_id
   - 主要字段: en_name, cn_name, duration, apply_requirements, language_requirements, curriculum
   - 功能: 存储学校项目/专业信息

3. **success_cases (成功案例表)**
   - 主键: id
   - 外键: program_id
   - 主要字段: student_name, admission_year, gpa, language_scores
   - 功能: 记录成功申请案例

4. **user_favorite_schools (用户收藏学校表)**
   - 主键: id
   - 外键: user_id, school_id
   - 功能: 记录用户收藏的学校

5. **user_favorite_programs (用户收藏项目表)**
   - 主键: id
   - 外键: user_id, program_id
   - 功能: 记录用户收藏的项目

#### 销售线索管理

1. **leads (销售线索表)**
   - 主键: id
   - 外键: assigned_to, interest
   - 主要字段: name, phone, source, status, priority, last_contact
   - 功能: 存储销售线索信息

2. **lead_logs (线索跟进记录表)**
   - 主键: id
   - 外键: lead_id, employee_id
   - 主要字段: log_date, content, next_follow_up
   - 功能: 记录线索跟进过程

### 系统表

系统还包含多个Supabase预设的表，主要位于以下Schema中：

- **auth**: 认证相关表，如users、identities、sessions等
- **storage**: 文件存储相关表，如buckets、objects等
- **realtime**: 实时更新相关表
- **pgsodium**: 加密相关表
- **vault**: 敏感信息存储相关表

## 主要表关系

### 学生服务关系

- 学生(students) ← 学生服务(student_services)：一个学生可以购买多个服务
- 服务类型(service_types) ← 学生服务(student_services)：每个服务对应一个服务类型
- 导师(mentors) ← 学生服务(student_services)：每个服务可以由一个导师负责
- 学生服务(student_services) ← 服务进度(service_progress)：每个服务可以有多个进度记录

### 财务关系

- 学生(students) ← 财务交易(finance_transactions)：交易可以关联到学生
- 员工(employees) ← 财务交易(finance_transactions)：交易可以关联到员工
- 账户(finance_accounts) ← 财务交易(finance_transactions)：交易发生在特定账户
- 类别(finance_categories) ← 财务交易(finance_transactions)：交易属于特定类别
- 项目(projects) ← 财务交易(finance_transactions)：交易可以关联到项目
- 服务类型(service_types) ← 财务交易(finance_transactions)：交易可以关联到服务类型

### 学校与项目关系

- 学校(schools) ← 项目(programs)：一个学校可以有多个项目
- 项目(programs) ← 成功案例(success_cases)：一个项目可以有多个成功案例
- 学校(schools) ← 用户收藏学校(user_favorite_schools)：用户可以收藏多个学校
- 项目(programs) ← 用户收藏项目(user_favorite_programs)：用户可以收藏多个项目

### 聊天系统关系

- 员工(employees) ← 聊天消息(chat_messages)：员工可以发送消息
- 频道(chat_channels) ← 聊天消息(chat_messages)：消息属于特定频道
- 频道(chat_channels) ↔ 员工(employees)：通过channel_members表建立多对多关系

### 销售线索关系

- 员工(employees) ← 销售线索(leads)：线索可以分配给员工
- 服务类型(service_types) ← 销售线索(leads)：线索可以对应感兴趣的服务类型
- 销售线索(leads) ← 线索跟进(lead_logs)：一个线索可以有多条跟进记录

## 数据库统计

- 总表数量: ~60个表
- 主要业务表: ~25个表
- 系统表: ~35个表
- 主要Schema: public, auth, storage, realtime

## 系统功能概述

1. **学生管理**：记录学生信息，教育背景，目标国家等
2. **服务管理**：定义服务类型，跟踪服务进度
3. **导师管理**：管理专业导师资源和专业领域
4. **财务管理**：记录收支，关联学生、项目和服务
5. **员工管理**：管理公司内部员工信息
6. **沟通系统**：支持频道和私聊的内部沟通
7. **学校数据库**：全球学校和项目信息库
8. **销售线索管理**：跟踪潜在客户和转化过程

## 数据关系图

```
students ←───┐
             │
mentors ←────┼── student_services ──→ service_progress
             │ 
service_types┘      
      │
      └──→ finance_transactions ←──┐ 
                  ↑                │
                  │                │
employees ────────┘                │
   │                               │
   │                               │
   ├──→ chat_messages              │
   │         ↑                     │
   │         │                     │
   └── channel_members             │
             ↑                     │
             │                     │
        chat_channels              │
                                   │
                                   │
finance_accounts ──────────────────┤
finance_categories ────────────────┤
projects ───────────────────────────┘

schools ──→ programs ──→ success_cases
   ↑           ↑
   │           │
   │           │
user_favorite_schools   user_favorite_programs

employees ──→ leads ──→ lead_logs
              ↑
              │
        service_types
```

## 安全性与权限

数据库使用Supabase的行级安全性(RLS)保护部分表。主要启用RLS的表包括：

- 认证相关表
- 聊天系统相关表
- 存储相关表
- 收藏相关表

## 数据库扩展和功能

该数据库利用了多种PostgreSQL功能和扩展：

- UUID生成
- JSONB数据类型
- 自动更新时间戳
- 外键约束和级联操作
- 行级安全策略

## 数据更新频率

根据表的设计和用途，不同表的数据更新频率预计如下：

- **高频更新**：聊天消息、财务交易、服务进度
- **中频更新**：学生服务、销售线索、线索跟进
- **低频更新**：学校信息、项目信息、员工信息

## 结论

StudylandsEdu项目的数据库设计全面覆盖了教育服务管理系统的各个方面，从学生和服务管理到财务管理、销售线索、学校信息库等。通过合理的表结构和关系设计，系统可以高效地管理教育服务流程和相关业务数据。 