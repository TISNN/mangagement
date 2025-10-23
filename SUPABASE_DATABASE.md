# Supabase 数据库文档

## 数据库概览

数据库URL: https://swyajeiqqewyckzbfkid.supabase.co

本文档基于实际API调用，描述了当前Supabase数据库的结构和关系。
文档生成时间: 2025/10/23 09:14:56

## 数据表结构

### 表: finance_categories

财务分类表 - 定义交易的分类

**记录总数:** 4

**表结构:**

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 分类ID，主键 |
| name | string | 可为空 | 分类名称，如"服务收入"、"咨询支出" |
| description | object | 可为空 | 分类描述 |
| direction | string | 可为空 | 分类方向，"收入"或"支出" |
| is_active | boolean | 可为空 | 是否激活 |

**样例数据:**

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

---

### 表: finance_accounts

财务账户表 - 记录各种财务账户

**记录总数:** 3

**表结构:**

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | 账户ID，主键 |
| name | string | 可为空 | 账户名称，如"银行账户" |
| type | string | 可为空 |  |
| balance | number | 可为空 | 账户余额 |
| is_active | boolean | 可为空 | 是否激活 |

**样例数据:**

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

---

### 表: finance_service_types

获取信息出错: Could not find the table 'public.finance_service_types' in the schema cache

---

### 表: people

获取信息出错: Could not find the table 'public.people' in the schema cache

---

### 表: persons

获取信息出错: Could not find the table 'public.persons' in the schema cache

---

### 表: projects

项目表 - 存储各种申请和服务项目

**记录总数:** 2

**表结构:**

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | ID，主键 |
| name | string | 可为空 |  |
| status | string | 可为空 |  |
| client_id | object | 可为空 |  |
| start_date | object | 可为空 |  |
| end_date | object | 可为空 |  |
| total_amount | object | 可为空 |  |
| created_at | string | 可为空 | 创建时间 |

**样例数据:**

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

---

### 表: students

学生表 - 存储学生相关信息

**记录总数:** 34

**表结构:**

| 字段名 | 数据类型 | 是否为空 | 描述 |
|--------|----------|----------|------|
| id | number | 可为空 | ID，主键 |
| name | string | 可为空 |  |
| email | string | 可为空 |  |
| contact | string | 可为空 |  |
| gender | string | 可为空 |  |
| avatar_url | object | 可为空 |  |
| student_number | object | 可为空 |  |
| education_level | string | 可为空 |  |
| school | string | 可为空 |  |
| major | string | 可为空 |  |
| target_countries | object | 可为空 |  |
| is_active | boolean | 可为空 |  |
| created_at | string | 可为空 | 创建时间 |
| updated_at | string | 可为空 | 更新时间 |
| status | string | 可为空 |  |
| location | string | 可为空 |  |
| address | string | 可为空 |  |
| auth_id | object | 可为空 |  |

**样例数据:**

```json
[
  {
    "id": 25,
    "name": "谢东恒",
    "email": "477616626@qq.com",
    "contact": "18180690891",
    "gender": "男",
    "avatar_url": null,
    "student_number": null,
    "education_level": "本科",
    "school": "中国矿业大学（北京）",
    "major": "采矿工程",
    "target_countries": null,
    "is_active": true,
    "created_at": "2025-03-26T09:23:25.604689+00:00",
    "updated_at": "2025-04-07T09:23:25.604689+00:00",
    "status": "活跃",
    "location": "北京市",
    "address": "北京市海淀区学院路丁11号（邮编100083）",
    "auth_id": null
  },
  {
    "id": 28,
    "name": "黄嘉乐",
    "email": null,
    "contact": null,
    "gender": "男",
    "avatar_url": null,
    "student_number": null,
    "education_level": null,
    "school": null,
    "major": null,
    "target_countries": null,
    "is_active": false,
    "created_at": "2025-04-07T09:25:11.439673+00:00",
    "updated_at": "2025-04-07T09:25:11.439673+00:00",
    "status": "休学",
    "location": null,
    "address": null,
    "auth_id": null
  },
  {
    "id": 2,
    "name": "段星宇",
    "email": "dxy@example.com",
    "contact": null,
    "gender": "女",
    "avatar_url": null,
    "student_number": "ST002",
    "education_level": "高中",
    "school": "",
    "major": "视觉传达设计",
    "target_countries": null,
    "is_active": false,
    "created_at": "2024-03-23T11:26:09.256937+00:00",
    "updated_at": "2025-04-06T15:48:31.26785+00:00",
    "status": "毕业",
    "location": "上海市",
    "address": "上海市浦东新区XX路XX号",
    "auth_id": null
  },
  {
    "id": 3,
    "name": "曾佳怡",
    "email": null,
    "contact": null,
    "gender": "女",
    "avatar_url": null,
    "student_number": "ST003",
    "education_level": "高中",
    "school": "高中",
    "major": null,
    "target_countries": null,
    "is_active": false,
    "created_at": "2025-04-06T16:30:53.95742+00:00",
    "updated_at": "2025-04-06T16:30:53.95742+00:00",
    "status": "毕业",
    "location": "上海市",
    "address": "上海市浦东新区XX路XX号",
    "auth_id": null
  },
  {
    "id": 9,
    "name": "苏洁",
    "email": null,
    "contact": null,
    "gender": "女",
    "avatar_url": null,
    "student_number": null,
    "education_level": null,
    "school": null,
    "major": null,
    "target_countries": null,
    "is_active": false,
    "created_at": "2025-04-07T08:53:14.06545+00:00",
    "updated_at": "2025-04-07T08:53:14.06545+00:00",
    "status": "毕业",
    "location": null,
    "address": null,
    "auth_id": null
  }
]
```

---

### 表: services

获取信息出错: Could not find the table 'public.services' in the schema cache

---

## 数据库关系

根据表结构分析，数据库表之间存在以下关系:

- `finance_transactions` 表通过外键关联到以下表：
  - `person_id` -> `people` 或 `persons`表
  - `project_id` -> `projects`表
  - `service_type_id` -> `finance_service_types`表
  - `category_id` -> `finance_categories`表
  - `account_id` -> `finance_accounts`表

- `projects` 表通过 `client_id` 关联到 `people` 或 `persons` 表

## 访问方式

数据库通过Supabase提供的API进行访问，使用JavaScript客户端库。

### 初始化客户端

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 查询示例

```javascript
// 获取所有交易记录（包含关联数据）
async function getAllTransactions() {
  const { data, error } = await supabase
    .from('finance_transactions')
    .select(`
      *,
      person:person_id(*),
      project:project_id(*),
      service_type:service_type_id(*),
      category:category_id(*),
      account:account_id(*)
    `)
    .order('transaction_date', { ascending: false });

  if (error) throw error;
  return data;
}
```

