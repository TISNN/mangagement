# 定期会议功能设计文档

## 一、功能概述

针对学生设置定期会议任务，支持在会议管理和学生详情页面创建，并自动生成未来会议实例，集成到Dashboard的"即将到来"提醒中。

## 二、核心需求

1. **定期会议模板管理**
   - 创建定期会议模板（每周、每两周、每月等）
   - 设置会议基本信息（标题、类型、参会人、地点等）
   - 设置重复规则（频率、结束条件）
   - 关联学生（可选）

2. **自动生成会议实例**
   - 根据模板自动生成未来的会议实例
   - 支持提前生成（如提前1个月）
   - 生成的实例可以独立编辑和取消

3. **多入口创建**
   - 会议管理页面可以创建定期会议
   - 学生详情页面可以创建针对该学生的定期会议
   - 两个入口创建的数据完全同步

4. **提醒功能**
   - 定期会议生成的实例自动出现在Dashboard"即将到来"
   - 支持会议前提醒（如提前1天、提前1小时）

## 三、数据库设计

### 3.1 定期会议模板表 (recurring_meeting_templates)

```sql
CREATE TABLE recurring_meeting_templates (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  
  -- 重复规则
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'biweekly', 'monthly'
  interval_value INTEGER DEFAULT 1, -- 间隔值（如每2周、每3个月）
  day_of_week INTEGER[], -- 星期几 [0=周日, 1=周一, ..., 6=周六]
  day_of_month INTEGER, -- 每月第几天（1-31）
  week_of_month INTEGER, -- 每月第几周（1-4, -1=最后一周）
  
  -- 时间设置
  start_time TIME NOT NULL, -- 会议开始时间（如 14:00:00）
  duration_minutes INTEGER DEFAULT 60, -- 会议时长（分钟）
  
  -- 结束条件
  end_type TEXT NOT NULL, -- 'never', 'after_occurrences', 'on_date'
  end_after_occurrences INTEGER, -- 结束于N次后
  end_on_date DATE, -- 结束于指定日期
  
  -- 会议基本信息
  location TEXT,
  meeting_link TEXT,
  agenda TEXT,
  participants JSONB DEFAULT '[]'::jsonb,
  
  -- 关联
  student_id INTEGER REFERENCES students(id), -- 关联学生（可选）
  created_by BIGINT REFERENCES employees(id),
  
  -- 元数据
  is_active BOOLEAN DEFAULT true, -- 是否激活（激活的模板会继续生成实例）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_recurring_templates_student ON recurring_meeting_templates(student_id);
CREATE INDEX idx_recurring_templates_active ON recurring_meeting_templates(is_active);
CREATE INDEX idx_recurring_templates_created_by ON recurring_meeting_templates(created_by);
```

### 3.2 定期会议实例关联表 (recurring_meeting_instances)

```sql
CREATE TABLE recurring_meeting_instances (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT REFERENCES recurring_meeting_templates(id) ON DELETE CASCADE,
  meeting_id BIGINT REFERENCES meetings(id) ON DELETE CASCADE,
  instance_date DATE NOT NULL, -- 该实例的日期
  is_cancelled BOOLEAN DEFAULT false, -- 是否已取消
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(template_id, instance_date)
);

-- 索引
CREATE INDEX idx_recurring_instances_template ON recurring_meeting_instances(template_id);
CREATE INDEX idx_recurring_instances_meeting ON recurring_meeting_instances(meeting_id);
CREATE INDEX idx_recurring_instances_date ON recurring_meeting_instances(instance_date);
```

## 四、功能实现

### 4.1 定期会议服务层

**核心功能：**
1. `createRecurringMeetingTemplate()` - 创建定期会议模板
2. `generateMeetingInstances()` - 生成会议实例（定时任务或手动触发）
3. `updateRecurringMeetingTemplate()` - 更新模板
4. `deleteRecurringMeetingTemplate()` - 删除模板（级联删除实例）
5. `getRecurringTemplatesByStudent()` - 获取学生的定期会议模板

**实例生成逻辑：**
- 每天凌晨运行定时任务，检查所有激活的模板
- 为每个模板生成未来1个月的会议实例
- 避免重复生成（通过instance_date唯一约束）

### 4.2 UI组件

**1. 定期会议创建模态框**
- 复用现有的CreateMeetingModal
- 添加"定期会议"开关
- 选择重复频率（每周、每两周、每月）
- 选择星期几（如果是周重复）
- 设置结束条件

**2. 会议管理页面**
- 添加"创建定期会议"按钮
- 显示定期会议模板列表
- 可以查看模板生成的实例

**3. 学生详情页面**
- 在"会议记录"标签页添加"创建定期会议"按钮
- 自动关联当前学生
- 显示该学生的定期会议模板

### 4.3 Dashboard集成

- 定期会议生成的实例会自动出现在"即将到来"
- 通过现有的`getDashboardEvents()`函数获取
- 显示定期会议的特殊标识

## 五、数据同步机制

1. **统一数据源**：所有定期会议模板存储在`recurring_meeting_templates`表
2. **关联查询**：通过`student_id`字段关联学生
3. **实例生成**：所有实例都通过统一的生成逻辑创建
4. **实时同步**：模板更新后，已生成的实例不受影响，新生成的实例使用新配置

## 六、使用场景示例

### 场景1：每周学生进度会议
- 创建模板：每周一 14:00，持续60分钟
- 关联学生：张三
- 自动生成：未来12周的会议实例
- 提醒：每次会议前1天提醒

### 场景2：每月团队例会
- 创建模板：每月第一个周五 10:00
- 不关联学生（团队会议）
- 自动生成：未来6个月的会议实例

## 七、后续优化

1. **智能提醒**：支持多种提醒方式（邮件、短信、系统通知）
2. **实例编辑**：允许单独编辑某个实例而不影响模板
3. **冲突检测**：生成实例时检测时间冲突
4. **批量操作**：批量取消、批量修改定期会议

