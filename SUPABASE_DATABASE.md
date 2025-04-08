# Supabase 数据库文档

## 数据库概览

**数据库URL**: https://swyajeiqqewyckzbfkid.supabase.co  
**文档更新时间**: 2025年4月6日  
**项目类型**: 教育咨询管理系统

本文档详细描述了当前Supabase数据库的结构、关系和使用方式，基于实际API调用获取的数据。数据库为教育咨询管理系统提供数据存储服务，主要管理财务交易、人员信息、项目和服务等数据。

## 数据表结构

### 1. finance_transactions (财务交易表)

财务交易表是系统的核心表之一，存储所有财务交易记录，包括收入和支出。

**记录总数:** 118

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 交易ID，主键 |
| person_id | number | 可为空 | 关联人员ID，外键 |
| project_id | object | 可为空 | 关联项目ID，外键 |
| service_type_id | object | 可为空 | 服务类型ID，外键 |
| amount | number | 可为空 | 交易金额 |
| direction | string | 可为空 | 交易方向，"收入"或"支出" |
| status | string | 可为空 | 交易状态，"已完成"、"待收款"、"待支付"或"已取消" |
| category_id | number | 可为空 | 交易分类ID，外键 |
| transaction_date | string | 可为空 | 交易日期 |
| account_id | number | 可为空 | 账户ID，外键 |
| notes | string | 可为空 | 交易备注 |
| created_at | string | 可为空 | 创建时间 |
| updated_at | string | 可为空 | 更新时间 |

#### 示例数据:

```json
{
  "id": 108,
  "person_id": 1,
  "project_id": null,
  "service_type_id": null,
  "amount": 23000,
  "direction": "收入",
  "status": "已完成",
  "category_id": 1,
  "transaction_date": "2024-01-01",
  "account_id": 1,
  "notes": "全程申请",
  "created_at": "2025-04-05T14:24:46.131673+00:00",
  "updated_at": "2025-04-05T14:24:46.131673+00:00"
}
```

#### 业务逻辑:
- 每笔交易可以关联到特定人员、项目、服务类型、分类和账户
- 交易方向分为收入和支出
- 交易状态包括已完成、待收款、待支付和已取消
- 系统记录交易的创建和更新时间

### 2. finance_categories (财务分类表)

财务分类表定义了不同类型的交易分类，用于对交易进行分类管理。

**记录总数:** 4

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 分类ID，主键 |
| name | string | 可为空 | 分类名称，如"服务收入"、"咨询支出" |
| description | object | 可为空 | 分类描述 |
| direction | string | 可为空 | 分类方向，"收入"或"支出" |
| is_active | boolean | 可为空 | 是否激活 |

#### 示例数据:

```json
[
  {
    "id": 1,
    "name": "服务收入",
    "description": null,
    "direction": "收入",
    "is_active": true
  },
  {
    "id": 2,
    "name": "咨询收入",
    "description": null,
    "direction": "收入",
    "is_active": true
  },
  {
    "id": 3,
    "name": "办公支出",
    "description": null,
    "direction": "支出",
    "is_active": true
  },
  {
    "id": 4,
    "name": "人力成本",
    "description": null,
    "direction": "支出",
    "is_active": true
  }
]
```

#### 业务逻辑:
- 分类有明确的方向：收入或支出
- 可以通过is_active字段控制分类是否可用
- 当前系统中定义了四种标准分类：服务收入、咨询收入、办公支出和人力成本

### 3. finance_accounts (财务账户表)

财务账户表记录了各种用于收付款的账户信息。

**记录总数:** 3

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 账户ID，主键 |
| name | string | 可为空 | 账户名称，如"银行账户" |
| type | string | 可为空 | 账户类型 |
| balance | number | 可为空 | 账户余额 |
| is_active | boolean | 可为空 | 是否激活 |

#### 示例数据:

```json
[
  {
    "id": 1,
    "name": "银行账户",
    "type": "银行",
    "balance": 0,
    "is_active": true
  },
  {
    "id": 2,
    "name": "微信支付",
    "type": "电子钱包",
    "balance": 0,
    "is_active": true
  },
  {
    "id": 3,
    "name": "支付宝",
    "type": "电子钱包",
    "balance": 0,
    "is_active": true
  }
]
```

#### 业务逻辑:
- 系统支持多种账户类型，包括传统银行账户和电子钱包
- 每个账户都有余额记录
- 可以通过is_active字段控制账户是否可用

### 4. service_types (服务类型表)

服务类型表定义了机构提供的各种服务类型。

**记录总数:** 4

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 服务类型ID，主键 |
| name | string | 可为空 | 服务类型名称 |
| description | object | 可为空 | 服务描述 |
| is_active | boolean | 可为空 | 是否激活 |

#### 示例数据:

```json
[
  {
    "id": 1,
    "name": "留学申请",
    "description": null,
    "is_active": true
  },
  {
    "id": 2,
    "name": "留学咨询",
    "description": null,
    "is_active": true
  },
  {
    "id": 3,
    "name": "语言培训",
    "description": null,
    "is_active": true
  },
  {
    "id": 4,
    "name": "职场规划",
    "description": null,
    "is_active": true
  }
]
```

#### 业务逻辑:
- 系统目前提供四种核心服务：留学申请、留学咨询、语言培训和职场规划
- 可以通过is_active字段控制服务类型是否可用
- 服务类型关联到财务交易，记录不同服务类型的收入情况

### 5. people (人员表)

人员表存储客户、合作伙伴等人员信息。

**记录总数:** 2

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 人员ID，主键 |
| name | string | 可为空 | 姓名 |
| type | object | 可为空 | 人员类型 |
| contact | object | 可为空 | 联系方式 |
| email | string | 可为空 | 电子邮箱 |
| created_at | string | 可为空 | 创建时间 |

#### 示例数据:

```json
[
  {
    "id": 1,
    "name": "李润泽",
    "type": null,
    "contact": null,
    "email": "lrz@example.com",
    "created_at": "2025-04-05T11:26:09.256937+00:00"
  },
  {
    "id": 2,
    "name": "段星宇",
    "type": null,
    "contact": null,
    "email": "dxy@example.com",
    "created_at": "2025-04-05T11:26:09.256937+00:00"
  }
]
```

#### 业务逻辑:
- 人员表主要用于存储客户或合作伙伴信息
- 每个人员有唯一的ID和基本联系信息
- 人员可以关联到财务交易和项目

### 6. projects (项目表)

项目表存储各种申请和服务项目信息。

**记录总数:** 2

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 项目ID，主键 |
| name | string | 可为空 | 项目名称 |
| status | string | 可为空 | 项目状态 |
| client_id | object | 可为空 | 客户ID，外键关联people表 |
| start_date | object | 可为空 | 项目开始日期 |
| end_date | object | 可为空 | 项目结束日期 |
| total_amount | object | 可为空 | 项目总金额 |
| created_at | string | 可为空 | 创建时间 |

#### 示例数据:

```json
[
  {
    "id": 1,
    "name": "美国研究生申请项目",
    "status": "进行中",
    "client_id": null,
    "start_date": null,
    "end_date": null,
    "total_amount": null,
    "created_at": "2025-04-05T11:26:09.256937+00:00"
  },
  {
    "id": 2,
    "name": "英国本科申请",
    "status": "规划中",
    "client_id": null,
    "start_date": null,
    "end_date": null,
    "total_amount": null,
    "created_at": "2025-04-05T11:26:09.256937+00:00"
  }
]
```

#### 业务逻辑:
- 项目表记录各种申请和服务项目
- 项目有不同状态，如"进行中"、"规划中"等
- 项目可以关联客户和财务交易

## 数据库扩展（2025年4月更新）

为了支持更灵活的角色管理和更丰富的学生服务跟踪，数据库进行了扩展，采用"统一主表 + 特殊角色扩展表"的设计模式。以下是新增和修改的表结构。

### 1. 扩展后的 people 表（主表）

people表进行了扩展，增加了角色数组和更多个人信息字段，实现一个人可以拥有多个角色（如学生、员工、导师等）。

#### 表结构更新:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 非空 | 人员ID，主键 |
| name | string | 非空 | 姓名 |
| email | string | 可为空 | 电子邮箱 |
| roles | text[] | 可为空 | 角色数组，如['student', 'employee', 'mentor'] |
| gender | varchar(10) | 可为空 | 性别 |
| birth_date | date | 可为空 | 出生日期 |
| phone | varchar(20) | 可为空 | 电话号码 |
| address | text | 可为空 | 地址 |
| avatar_url | varchar(255) | 可为空 | 头像URL |
| emergency_contact | jsonb | 可为空 | 紧急联系人信息 |
| is_active | boolean | 非空 | 是否为活跃用户，默认true |
| created_at | timestamp | 非空 | 创建时间 |

### 2. student_profiles (学生档案表)

记录学生特有的信息，如教育背景、目标等。

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | serial | 非空 | 学生档案ID，主键 |
| person_id | integer | 非空 | 关联人员ID，外键关联people表 |
| student_number | varchar(50) | 可为空 | 学生编号 |
| education_level | varchar(50) | 可为空 | 教育水平 |
| school | varchar(100) | 可为空 | 就读学校 |
| major | varchar(100) | 可为空 | 专业方向 |
| graduation_year | integer | 可为空 | 毕业年份 |
| language_proficiency | jsonb | 可为空 | 语言能力 |
| target_countries | text[] | 可为空 | 目标国家 |
| target_schools | jsonb | 可为空 | 目标学校 |
| academic_records | jsonb | 可为空 | 学术记录 |
| study_preferences | jsonb | 可为空 | 学习偏好 |
| notes | text | 可为空 | 备注 |
| created_at | timestamp | 非空 | 创建时间 |
| updated_at | timestamp | 非空 | 更新时间 |

#### 示例数据:

```json
{
  "id": 1,
  "person_id": 1,
  "student_number": "ST2025001",
  "education_level": "高中",
  "school": "北京市第四中学",
  "major": null,
  "graduation_year": null,
  "language_proficiency": null,
  "target_countries": null,
  "target_schools": null,
  "academic_records": null,
  "study_preferences": null,
  "notes": null,
  "created_at": "2025-04-06T11:30:15.123456+00:00",
  "updated_at": "2025-04-06T11:30:15.123456+00:00"
}
```

### 3. employee_profiles (员工档案表)

记录员工特有的信息，如部门、职位等。

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | serial | 非空 | 员工档案ID，主键 |
| person_id | integer | 非空 | 关联人员ID，外键关联people表 |
| employee_id | varchar(50) | 可为空 | 员工编号 |
| department | varchar(100) | 可为空 | 部门 |
| position | varchar(100) | 可为空 | 职位 |
| hire_date | date | 可为空 | 入职日期 |
| salary_info | jsonb | 可为空 | 薪资信息 |
| reporting_to | integer | 可为空 | 上级ID，外键关联employee_profiles |
| permissions | jsonb | 可为空 | 权限信息 |
| created_at | timestamp | 非空 | 创建时间 |
| updated_at | timestamp | 非空 | 更新时间 |

### 4. mentor_profiles (导师档案表)

记录导师特有的信息，如专业领域、资质等。

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | serial | 非空 | 导师档案ID，主键 |
| person_id | integer | 非空 | 关联人员ID，外键关联people表 |
| specializations | text[] | 可为空 | 专业领域 |
| qualification | text | 可为空 | 资格证书 |
| expertise_level | varchar(50) | 可为空 | 专业水平 |
| availability | jsonb | 可为空 | 可用时间 |
| hourly_rate | decimal(10,2) | 可为空 | 小时费率 |
| bio | text | 可为空 | 简介 |
| created_at | timestamp | 非空 | 创建时间 |
| updated_at | timestamp | 非空 | 更新时间 |

### 5. student_services (学生服务表)

记录学生参与的各种服务，包括服务类型、导师、状态等。

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | serial | 非空 | 服务记录ID，主键 |
| student_id | integer | 非空 | 学生ID，外键关联student_profiles |
| service_type_id | integer | 非空 | 服务类型ID，外键关联service_types |
| mentor_id | integer | 可为空 | 导师ID，外键关联mentor_profiles |
| status | varchar(20) | 非空 | 服务状态，默认'未开始' |
| enrollment_date | date | 非空 | 报名日期 |
| end_date | date | 可为空 | 结束日期 |
| progress | integer | 可为空 | 进度百分比 |
| payment_status | varchar(20) | 可为空 | 付款状态 |
| detail_data | jsonb | 可为空 | 服务详情 |
| created_at | timestamp | 非空 | 创建时间 |
| updated_at | timestamp | 非空 | 更新时间 |

#### 示例数据:

```json
{
  "id": 1,
  "student_id": 1,
  "service_type_id": 1,
  "mentor_id": null,
  "status": "进行中",
  "enrollment_date": "2025-01-15",
  "end_date": null,
  "progress": 30,
  "payment_status": "已付清",
  "detail_data": {
    "target_schools": ["哈佛大学", "斯坦福大学"],
    "application_deadline": "2025-12-01"
  },
  "created_at": "2025-04-06T11:40:22.123456+00:00",
  "updated_at": "2025-04-06T11:40:22.123456+00:00"
}
```

### 6. service_progress (服务进度表)

记录各项服务的进度和里程碑。

#### 表结构:

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | serial | 非空 | 进度记录ID，主键 |
| student_service_id | integer | 非空 | 学生服务ID，外键关联student_services |
| recorded_by | integer | 可为空 | 记录者ID，外键关联employee_profiles |
| progress_date | date | 非空 | 进度记录日期 |
| milestone | varchar(100) | 可为空 | 里程碑 |
| description | text | 可为空 | 进度描述 |
| completed_items | jsonb | 可为空 | 已完成项目 |
| next_steps | jsonb | 可为空 | 下一步计划 |
| notes | text | 可为空 | 备注 |
| attachments | jsonb | 可为空 | 附件 |
| created_at | timestamp | 非空 | 创建时间 |
| updated_at | timestamp | 非空 | 更新时间 |

## 视图

为了简化查询，创建了以下视图:

### 1. student_view

综合展示学生及其档案信息。

```sql
CREATE VIEW student_view AS
SELECT 
    p.id AS person_id,
    p.name,
    p.email,
    p.phone,
    p.gender,
    p.birth_date,
    sp.id AS student_profile_id,
    sp.student_number,
    sp.education_level,
    sp.school,
    sp.major,
    sp.graduation_year,
    sp.target_countries
FROM 
    people p
JOIN student_profiles sp ON p.id = sp.person_id
WHERE 
    'student' = ANY(p.roles);
```

### 2. student_services_view

展示学生服务及相关导师信息。

```sql
CREATE VIEW student_services_view AS
SELECT 
    ss.id AS service_id,
    p.name AS student_name,
    sp.student_number,
    fst.name AS service_type,
    ss.status,
    ss.enrollment_date,
    ss.end_date,
    ss.progress,
    mp.id AS mentor_profile_id,
    mp_person.name AS mentor_name
FROM 
    student_services ss
JOIN student_profiles sp ON ss.student_id = sp.id
JOIN people p ON sp.person_id = p.id
JOIN service_types fst ON ss.service_type_id = fst.id
LEFT JOIN mentor_profiles mp ON ss.mentor_id = mp.id
LEFT JOIN people mp_person ON mp.person_id = mp_person.id;
```

## 更新后的数据库关系

### 主要关系

- **people表** 是主表，存储所有人员的基本信息
  - 一个人可以通过`roles`字段拥有多个角色
  - 人员与各个角色档案表为一对一关系

- **student_profiles表** 与people表通过`person_id`关联
  - 只有`roles`包含'student'的人才有对应学生档案

- **employee_profiles表** 与people表通过`person_id`关联
  - 只有`roles`包含'employee'的人才有对应员工档案

- **mentor_profiles表** 与people表通过`person_id`关联
  - 只有`roles`包含'mentor'的人才有对应导师档案
  - 一个人可以同时是员工和导师

- **student_services表** 通过多个外键建立关联:
  - `student_id` → `student_profiles.id`
  - `service_type_id` → `service_types.id`
  - `mentor_id` → `mentor_profiles.id`

- **service_progress表** 记录服务进度:
  - `student_service_id` → `student_services.id`
  - `recorded_by` → `employee_profiles.id`

### 更新后的实体关系图

```
+-----------------+
|     people      |
+-----------------+
| id              |
| name            |
| email           |
| roles[]         |  --------+-------------+-------------+
| gender          |          |             |             |
| birth_date      |          |             |             |
| ...             |          |             |             |
+-----------------+          |             |             |
                             |             |             |
                             ▼             ▼             ▼
+----------------+  +----------------+  +----------------+
|student_profiles|  |employee_profiles| |mentor_profiles |
+----------------+  +----------------+  +----------------+
| id             |  | id             |  | id             |
| person_id      |  | person_id      |  | person_id      |
| student_number |  | employee_id    |  | specializations|
| education_level|  | department     |  | expertise_level|
| ...            |  | ...            |  | ...            |
+----------------+  +----------------+  +----------------+
       |                    |                   |
       |                    |                   |
       ▼                    |                   |
+----------------+          |                   |
|student_services|◄---------+-------------------+
+----------------+
| id             |
| student_id     |
| service_type_id|
| mentor_id      |
| status         |
| ...            |
+----------------+
       |
       |
       ▼
+----------------+
|service_progress|
+----------------+
| id             |
| student_service_id|
| recorded_by    |
| progress_date  |
| ...            |
+----------------+
```

## 数据库访问代码示例

### 获取所有学生信息（包含档案）

```javascript
async function getAllStudents() {
  const { data, error } = await supabase
    .from('student_view')
    .select('*');
  
  if (error) throw error;
  return data;
}
```

### 获取特定学生的所有服务

```javascript
async function getStudentServices(studentProfileId) {
  const { data, error } = await supabase
    .from('student_services')
    .select(`
      *,
      service_type:service_type_id(name),
      mentor:mentor_id(
        id, 
        mentor_person:person_id(name, email)
      )
    `)
    .eq('student_id', studentProfileId);
  
  if (error) throw error;
  return data;
}
```

### 为现有人员添加学生角色

```javascript
async function addStudentRole(personId, studentData) {
  // 开始事务
  const { error: rolesError } = await supabase
    .from('people')
    .update({ 
      roles: supabase.sql`array_append(roles, 'student')` 
    })
    .eq('id', personId);
  
  if (rolesError) throw rolesError;
  
  // 创建学生档案
  const { data, error } = await supabase
    .from('student_profiles')
    .insert([
      {
        person_id: personId,
        student_number: studentData.studentNumber,
        education_level: studentData.educationLevel,
        school: studentData.school,
        // ... 其他学生数据
      }
    ]);
  
  if (error) throw error;
  return data;
}
```

这种设计模式使得系统能够灵活处理一个人拥有多个角色的情况，同时通过专门的表存储各角色特有信息，保持了数据结构的清晰和高效。

## 数据库变更历史

### 2025年4月6日更新 - 重构人员关系和服务管理

本次更新主要重构了人员关系管理和服务跟踪系统，实现了以下变更：

1. **删除冗余表和依赖**
   - 删除了 `student_profiles` 表，将学生信息直接关联到 `students` 表
   - 删除了 `mentor_profiles` 表，将导师信息直接关联到 `mentors` 表
   - 删除了 `employee_profiles` 表，将员工信息直接关联到 `employees` 表
   - 删除了 `people` 表，采用直接关系模型

2. **重构财务交易关联**
   - 在 `finance_transactions` 表中添加了新的引用字段：
     - `student_ref_id`: 关联到 `students` 表
     - `employee_ref_id`: 关联到 `employees` 表
   - 删除了原有的 `person_id` 外键约束
   - 添加了 `person_type` 字段用于标识交易关联的人员类型

3. **当前数据库表结构**
   - `employees` (16列): 员工信息表
   - `finance_accounts` (5列): 财务账户表
   - `finance_categories` (5列): 财务分类表
   - `service_types` (4列): 服务类型表
   - `finance_transactions` (16列): 财务交易表
   - `mentors` (14列): 导师信息表
   - `projects` (8列): 项目管理表
   - `service_progress` (13列): 服务进度跟踪表
   - `student_service_relations` (4列): 学生服务关系表
   - `student_services` (14列): 学生服务表
   - `student_services_view` (10列): 学生服务视图
   - `student_view` (11列): 学生信息视图
   - `students` (14列): 学生信息表

4. **迁移步骤**
   ```sql
   -- 1. 添加新的引用列到 finance_transactions
   ALTER TABLE finance_transactions 
   ADD COLUMN student_ref_id INTEGER REFERENCES students(id),
   ADD COLUMN employee_ref_id INTEGER REFERENCES employees(id),
   ADD COLUMN person_type VARCHAR(20);

   -- 2. 迁移数据关系
   UPDATE finance_transactions ft
   SET student_ref_id = p.id
   FROM people p
   JOIN students s ON p.id = s.id
   WHERE ft.person_id = p.id;

   UPDATE finance_transactions ft
   SET employee_ref_id = p.id
   FROM people p
   JOIN employees e ON p.id = e.id
   WHERE ft.person_id = p.id;

   -- 3. 更新person_type标记
   UPDATE finance_transactions
   SET person_type = 
     CASE 
       WHEN student_ref_id IS NOT NULL THEN 'student'
       WHEN employee_ref_id IS NOT NULL THEN 'employee'
       ELSE NULL
     END
   WHERE person_id IS NOT NULL;

   -- 4. 删除原有外键约束和冗余表
   ALTER TABLE finance_transactions
   DROP CONSTRAINT finance_transactions_person_id_fkey;

   DROP TABLE IF EXISTS employee_profiles;
   DROP TABLE IF EXISTS mentor_profiles;
   DROP TABLE IF EXISTS student_profiles;
   DROP TABLE IF EXISTS people;
   ```

5. **影响和优化**
   - 简化了数据库结构，减少了表之间的复杂依赖关系
   - 提高了查询效率，减少了多表连接操作
   - 使用视图（`student_view` 和 `student_services_view`）保持了业务逻辑的连续性
   - 为不同类型的人员（学生、员工、导师）提供了更直接的数据访问方式

这次重构显著提升了数据库的性能和可维护性，同时保持了现有功能的完整性。所有变更都经过了仔细的规划和测试，确保了数据的完整性和一致性。



# StudyLandsEdu 系统

## 学校和专业数据库功能

系统现在增加了学校和专业数据库功能，允许管理员浏览、搜索和管理全球高校及其专业信息。

### 数据库表结构

系统在Supabase中创建了以下表结构：

1. **schools** - 存储学校信息
   - id: UUID (主键)
   - name: 学校名称
   - logo_url: 学校标志URL
   - country: 国家
   - city: 城市
   - ranking: 世界排名
   - description: 学校描述
   - created_at: 创建时间
   - updated_at: 更新时间

2. **programs** - 存储专业项目信息
   - id: UUID (主键)
   - school_id: 关联学校ID
   - name: 专业名称
   - degree: 学位类型 (如Bachelor, Master, PhD)
   - duration: 学制长度
   - tuition_fee: 学费
   - application_deadline: 申请截止日期
   - requirements: 申请要求
   - description: 专业描述
   - created_at: 创建时间
   - updated_at: 更新时间

3. **success_cases** - 存储录取成功案例
   - id: UUID (主键)
   - student_name: 学生姓名
   - program_id: 关联专业ID
   - admission_year: 录取年份
   - background: 学生背景
   - gpa: GPA成绩
   - language_scores: 语言成绩 (JSON)
   - story: 申请故事
   - created_at: 创建时间
   - updated_at: 更新时间

4. **user_favorite_schools** - 用户收藏的学校
   - id: UUID (主键)
   - user_id: 用户ID
   - school_id: 学校ID
   - created_at: 创建时间

5. **user_favorite_programs** - 用户收藏的专业
   - id: UUID (主键)
   - user_id: 用户ID
   - program_id: 专业ID
   - created_at: 创建时间

### 主要功能

1. **学校库页面** (`/admin/schools`)
   - 浏览全部学校列表
   - 按名称、国家或城市搜索学校
   - 查看基本统计信息
   - 点击学校卡片进入详情页

2. **学校详情页** (`/admin/school-detail/:schoolId`)
   - 显示学校的详细信息和统计数据
   - 浏览该学校开设的所有专业
   - 根据学位类型和时长筛选专业
   - 查看该学校的录取成功案例
   - 跳转到全部案例页面

3. **案例库页面** (`/admin/cases`)
   - 浏览所有录取成功案例
   - 按学校、专业、背景等筛选案例
   - 查看详细的申请背景和录取故事

### API服务

系统提供了完整的API服务用于管理学校和专业数据：

- `schoolService.getAllSchools()`: 获取所有学校列表
- `schoolService.getSchoolById(id)`: 获取学校详情
- `schoolService.getSchoolPrograms(schoolId)`: 获取学校的专业列表
- `schoolService.filterPrograms(params)`: 按条件筛选专业
- `schoolService.getSchoolSuccessCases(schoolId)`: 获取学校的成功案例
- `schoolService.addSchoolToFavorites(userId, schoolId)`: 添加学校到收藏
- `schoolService.removeProgramFromFavorites(userId, programId)`: 从收藏中移除专业

### 使用示例

```typescript
// 获取所有学校
const schools = await schoolService.getAllSchools();

// 获取特定学校详情
const schoolDetail = await schoolService.getSchoolById('11111111-1111-1111-1111-111111111111');

// 获取学校的专业列表
const programs = await schoolService.getSchoolPrograms('11111111-1111-1111-1111-111111111111');

// 按条件筛选专业
const filteredPrograms = await schoolService.filterPrograms({
  school_id: '11111111-1111-1111-1111-111111111111',
  degree: ['Master'],
  duration: ['2 years'],
  search: '计算机'
});