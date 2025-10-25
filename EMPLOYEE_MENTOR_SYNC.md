# 员工-导师关联与自动同步功能

## 📋 概述

实现了员工与导师的关联机制,允许员工同时作为导师,并自动同步共享字段的数据。

---

## 🎯 核心功能

### 1. 员工导师标识
- **新增字段**: `employees.is_mentor` (boolean)
- **用途**: 标识该员工是否同时是导师
- **默认值**: `false`
- **当前状态**: 4位员工(ID: 3, 4, 5, 6)都设置为导师

### 2. 自动数据同步
当员工的`is_mentor = true`时,以下字段会自动同步到`mentors`表:
- ✅ `name` - 姓名
- ✅ `gender` - 性别
- ✅ `avatar_url` - 头像URL
- ✅ `location` - 地理位置
- ✅ `is_active` - 是否活跃

### 3. 独立字段
以下字段在`mentors`表中独立维护,不会被同步覆盖:
- 📝 `bio` - 个人简介(导师专属)
- 📝 `specializations` - 专业方向(导师专属)
- 📝 `expertise_level` - 专业级别(导师专属)
- 📝 `hourly_rate` - 时薪(导师专属)
- 📝 `service_scope` - 服务范围(导师专属)

---

## 🗂️ 数据库结构

### Employees表新增字段

```sql
-- 字段定义
is_mentor BOOLEAN DEFAULT false

-- 注释
COMMENT ON COLUMN employees.is_mentor IS '是否为导师(如果是,则关联mentors表)';
```

### 表关系

```
┌──────────────────┐
│    employees     │
│   (员工表)       │
├──────────────────┤
│ id (PK)          │
│ name             │──┐
│ gender           │  │
│ avatar_url       │  │  自动同步
│ location         │  │  (触发器)
│ is_active        │  │
│ is_mentor (NEW!) │  │
└──────────────────┘  │
                       │
                       ▼
┌──────────────────┐
│     mentors      │
│   (导师表)       │
├──────────────────┤
│ id (PK)          │
│ employee_id (FK) │◄─┘ 关联
│ name             │
│ gender           │
│ avatar_url       │
│ location         │
│ is_active        │
│ bio              │  导师专属字段
│ specializations  │  不会被同步覆盖
│ expertise_level  │
│ hourly_rate      │
│ service_scope    │
└──────────────────┘
```

---

## 🔧 技术实现

### Migration 1: `add_employee_mentor_sync`

#### 1. 添加is_mentor字段
```sql
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS is_mentor BOOLEAN DEFAULT false;
```

#### 2. 设置现有员工为导师
```sql
UPDATE employees 
SET is_mentor = true 
WHERE id IN (3, 4, 5, 6);
```

#### 3. 创建同步函数
```sql
CREATE OR REPLACE FUNCTION sync_employee_to_mentor()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_mentor = true THEN
    -- 如果导师记录已存在,更新
    IF EXISTS (SELECT 1 FROM mentors WHERE employee_id = NEW.id) THEN
      UPDATE mentors SET
        name = NEW.name,
        gender = NEW.gender,
        avatar_url = NEW.avatar_url,
        location = NEW.location,
        is_active = NEW.is_active,
        updated_at = NOW()
      WHERE employee_id = NEW.id;
    ELSE
      -- 否则创建新导师记录
      INSERT INTO mentors (
        employee_id, name, gender, avatar_url, 
        location, is_active, created_at, updated_at
      ) VALUES (
        NEW.id, NEW.name, NEW.gender, NEW.avatar_url,
        NEW.location, NEW.is_active, NOW(), NOW()
      );
    END IF;
  ELSE
    -- 如果不再是导师,停用导师记录
    UPDATE mentors 
    SET is_active = false, updated_at = NOW() 
    WHERE employee_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### 4. 创建触发器
```sql
CREATE TRIGGER trigger_sync_employee_to_mentor
  AFTER INSERT OR UPDATE OF 
    name, gender, avatar_url, location, is_active, is_mentor
  ON employees
  FOR EACH ROW
  EXECUTE FUNCTION sync_employee_to_mentor();
```

#### 5. 防止删除导师员工
```sql
CREATE OR REPLACE FUNCTION prevent_mentor_employee_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM mentors 
    WHERE employee_id = OLD.id AND is_active = true
  ) THEN
    RAISE EXCEPTION '无法删除员工:该员工是活跃导师,请先在导师库中停用';
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_mentor_employee_delete
  BEFORE DELETE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION prevent_mentor_employee_delete();
```

#### 6. 创建关联视图
```sql
CREATE OR REPLACE VIEW employee_mentor_view AS
SELECT 
  e.id as employee_id,
  e.name,
  e.email,
  e.location as employee_location,
  e.position,
  e.department,
  e.is_mentor,
  e.is_active as employee_is_active,
  m.id as mentor_id,
  m.bio,
  m.specializations,
  m.expertise_level,
  m.hourly_rate,
  m.service_scope,
  m.is_active as mentor_is_active
FROM employees e
LEFT JOIN mentors m ON e.id = m.employee_id
WHERE e.is_mentor = true;
```

---

## 📊 当前数据状态

### 员工-导师关联情况

| 员工ID | 姓名 | 职位 | 地理位置 | is_mentor | 导师ID | 服务范围 |
|--------|------|------|----------|-----------|--------|----------|
| 3 | Evan Xu | CEO | 珠海 | ✅ | 3 | 留学申请, 课业辅导 |
| 4 | Zoe Fan | CMO | 柏林 | ✅ | 4 | 留学申请, 科研 |
| 5 | Kayn Xu | 国际课程负责人 | 重庆 | ✅ | 5 | 课业辅导, 语言培训 |
| 6 | Jo Zhuang | 运营负责人 | 珠海 | ✅ | 6 | 留学申请, 语言培训 |

---

## 🔄 数据同步流程

### 场景1: 更新员工基本信息

```sql
-- 更新员工地理位置
UPDATE employees SET location = '北京' WHERE id = 3;

-- 自动触发同步
-- ✅ mentors表中employee_id=3的记录location也更新为'北京'
```

### 场景2: 新员工设置为导师

```sql
-- 添加新员工并设置为导师
INSERT INTO employees (name, is_mentor, location) 
VALUES ('新导师', true, '上海');

-- 自动触发同步
-- ✅ mentors表中自动创建关联记录
```

### 场景3: 取消导师身份

```sql
-- 取消员工的导师身份
UPDATE employees SET is_mentor = false WHERE id = 3;

-- 自动触发同步
-- ✅ mentors表中该员工的is_active设置为false
```

### 场景4: 防止误删导师

```sql
-- 尝试删除活跃导师
DELETE FROM employees WHERE id = 3;

-- ❌ 触发器阻止删除
-- 错误: '无法删除员工:该员工是活跃导师,请先在导师库中停用'
```

---

## 🎨 同步字段说明

### 自动同步的字段

这些字段在employees表中是"源头",更新后会自动同步到mentors表:

| 字段 | 说明 | 同步方向 |
|------|------|----------|
| `name` | 姓名 | employees → mentors |
| `gender` | 性别 | employees → mentors |
| `avatar_url` | 头像URL | employees → mentors |
| `location` | 地理位置 | employees → mentors |
| `is_active` | 是否活跃 | employees → mentors |

### 导师专属字段

这些字段只在mentors表中存在,不会被同步覆盖:

| 字段 | 说明 | 管理位置 |
|------|------|----------|
| `bio` | 个人简介 | 导师库 |
| `specializations` | 专业方向 | 导师库 |
| `expertise_level` | 专业级别 | 导师库 |
| `hourly_rate` | 时薪 | 导师库 |
| `service_scope` | 服务范围 | 导师库 |

---

## 📈 使用场景

### 1. 员工管理系统
- 查看员工是否为导师: `WHERE is_mentor = true`
- 统计导师数量: `SELECT COUNT(*) FROM employees WHERE is_mentor = true`
- 更新员工信息时,导师信息自动同步

### 2. 导师库管理
- 导师信息与员工信息保持一致(共享字段)
- 导师专属信息独立管理
- 通过`employee_id`可以追溯到员工记录

### 3. 数据查询
使用视图快速查询员工-导师信息:
```sql
-- 查询所有导师员工的完整信息
SELECT * FROM employee_mentor_view;

-- 查询特定员工的导师信息
SELECT * FROM employee_mentor_view WHERE employee_id = 3;
```

---

## 🔍 查询示例

### 查询所有导师员工
```sql
SELECT id, name, position, location 
FROM employees 
WHERE is_mentor = true;
```

### 查询员工-导师关联详情
```sql
SELECT 
  e.id,
  e.name,
  e.position,
  e.location,
  m.id as mentor_id,
  m.bio,
  m.service_scope
FROM employees e
JOIN mentors m ON e.id = m.employee_id
WHERE e.is_mentor = true;
```

### 使用视图查询
```sql
-- 查询所有导师员工的完整信息
SELECT * FROM employee_mentor_view;

-- 查询特定服务范围的导师员工
SELECT name, position, service_scope 
FROM employee_mentor_view
WHERE '留学申请' = ANY(service_scope);
```

---

## ⚠️ 注意事项

### 1. 数据一致性
- ✅ 共享字段(name, gender, avatar_url, location, is_active)由employees表控制
- ✅ 更新employees表时,mentors表自动同步
- ❌ 不要直接更新mentors表的这些字段,会被下次同步覆盖

### 2. 删除保护
- ✅ 活跃导师员工不能直接删除
- ✅ 必须先在导师库中停用(is_active = false)
- ✅ 或者先取消导师身份(is_mentor = false)

### 3. 字段管理
**在员工管理中更新**:
- name, gender, avatar_url, location, is_active

**在导师库中更新**:
- bio, specializations, expertise_level, hourly_rate, service_scope

---

## 🚀 后续扩展建议

### 1. 前端界面优化
- 员工管理页面显示"导师"标识
- 员工详情页显示导师信息(如果是导师)
- 点击"导师"标识可跳转到导师详情页

### 2. 双向导航
- 导师库页面可跳转到员工详情
- 员工页面可跳转到导师详情

### 3. 批量操作
- 批量设置/取消员工的导师身份
- 批量同步数据

### 4. 审计日志
- 记录导师身份变更历史
- 记录数据同步历史

---

## 📚 相关文档

- `MENTOR_LIBRARY_REFACTOR.md` - 导师库功能重构文档
- `DATABASE_COMPLETE.md` - 数据库完整文档

---

## 🎉 总结

成功实现员工-导师关联与自动同步功能:
- ✅ 添加`is_mentor`字段标识员工是否为导师
- ✅ 自动同步共享字段(name, gender, avatar_url, location, is_active)
- ✅ 导师专属字段独立管理
- ✅ 触发器自动处理新增/更新/停用
- ✅ 防止误删活跃导师
- ✅ 创建便捷视图方便查询
- ✅ 当前4位员工都设置为导师

**现在员工和导师数据可以无缝关联和自动同步!** 🚀

