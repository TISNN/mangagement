# 案例库关联导师和学生功能

## 功能概述

案例库的案例现在可以关联到负责的导师和学生,实现案例与人员信息的关联管理。

## 数据库迁移

### ✅ 迁移已完成 (2025-01-XX)

已使用 Supabase MCP 成功执行数据库迁移,为 `success_cases` 表添加了关联字段和可选字段。

### 1. 迁移内容

以下 SQL 已成功执行:

```sql
-- 添加导师关联字段
ALTER TABLE success_cases
ADD COLUMN IF NOT EXISTS mentor_id INTEGER REFERENCES mentors(id) ON DELETE SET NULL;

-- 添加学生关联字段
ALTER TABLE success_cases
ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES students(id) ON DELETE SET NULL;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_success_cases_mentor_id ON success_cases(mentor_id);
CREATE INDEX IF NOT EXISTS idx_success_cases_student_id ON success_cases(student_id);

-- 添加注释说明字段用途
COMMENT ON COLUMN success_cases.mentor_id IS '关联到mentors表的导师ID,负责该案例的导师';
COMMENT ON COLUMN success_cases.student_id IS '关联到students表的学生ID,该案例对应的学生';
```

### 2. 字段说明

- `mentor_id`: 关联到 `mentors` 表的导师ID,可为空(ON DELETE SET NULL表示删除导师时不影响案例)
- `student_id`: 关联到 `students` 表的学生ID,可为空(ON DELETE SET NULL表示删除学生时不影响案例)

### 3. 验证结果

✅ 字段已成功添加:
- `mentor_id`: integer 类型,可为空
- `student_id`: integer 类型,可为空

✅ 索引已成功创建:
- `idx_success_cases_mentor_id`: B-tree 索引
- `idx_success_cases_student_id`: B-tree 索引

✅ 外键约束已正确设置:
- `success_cases_mentor_id_fkey`: 指向 `mentors.id`,删除规则为 SET NULL
- `success_cases_student_id_fkey`: 指向 `students.id`,删除规则为 SET NULL

✅ 可选字段已成功添加:
- `master_school`: text 类型,可为空（硕士院校）
- `master_major`: text 类型,可为空（硕士专业）
- `master_gpa`: text 类型,可为空（硕士GPA）
- `region`: text 类型,可为空（地区分类）
- `admission_result`: text 类型,可为空,默认值为 'accepted'（录取结果）
- `offer_type`: text 类型,可为空（录取类型）
- `scholarship`: text 类型,可为空（奖学金信息）
- `notes`: text 类型,可为空（备注说明）

## 功能实现

### 1. 类型定义 (`src/types/case.ts`)

- 添加了 `CaseMentor` 和 `CaseStudent` 接口用于表示关联的导师和学生信息
- 在 `CaseStudy` 接口中添加了 `mentor_id`、`student_id` 字段
- 添加了 `mentor` 和 `student` 字段用于存储关联的详细信息

### 2. 服务层 (`src/services/caseService.ts`)

- 实现了 `loadCaseRelations` 函数,用于批量加载案例的关联导师和学生信息
- 在 `getCaseStudies`、`getCaseStudyById`、`searchCaseStudies` 函数中自动加载关联信息
- 使用并行查询提高性能

### 3. 创建案例模态框 (`src/pages/admin/CaseStudies/components/CreateCaseModal.tsx`)

- 添加了导师选择下拉框,显示活跃导师列表和其专业方向
- 添加了学生选择下拉框,显示学生列表和教育水平
- 选择学生时自动填充学生姓名字段
- 支持不关联导师或学生(可选字段)

### 4. 案例详情面板 (`src/pages/admin/CaseStudies/components/CaseDetailPanel.tsx`)

- 在详情面板顶部显示关联的导师和学生信息卡片
- 导师卡片显示: 导师姓名、专业方向标签
- 学生卡片显示: 学生姓名、教育水平、邮箱

### 5. 案例显示组件

#### 网格视图 (`src/pages/admin/CaseStudies/components/CaseGridView.tsx`)

- 在案例卡片标签区域显示导师和学生的标识
- 使用图标和颜色区分导师(蓝色)和学生(绿色)

#### 列表视图 (`src/pages/admin/CaseStudies/components/CaseListView.tsx`)

- 在案例列表项中显示导师和学生的信息
- 使用标签样式清晰展示关联关系

## 使用说明

### 创建案例时关联导师和学生

1. 打开"新建案例"模态框
2. 在"录取信息"部分,找到"负责导师"和"关联学生"下拉框
3. 从下拉框中选择对应的导师或学生
   - 如果选择了学生,系统会自动填充"学生姓名"字段
   - 也可以选择"不关联导师"或"不关联学生"跳过关联
4. 填写其他案例信息后提交

### 查看案例关联信息

1. 在案例库页面,关联了导师或学生的案例会在卡片/列表中显示相应的标识
2. 点击案例打开详情面板,顶部会显示详细的导师和学生信息卡片
3. 导师卡片显示专业方向,学生卡片显示教育水平和联系方式

## 技术特点

1. **性能优化**: 使用批量查询和并行加载,减少数据库查询次数
2. **数据完整性**: 外键约束确保关联数据的完整性,ON DELETE SET NULL保证删除导师或学生时不影响历史案例
3. **用户体验**: 
   - 下拉框支持搜索(浏览器原生支持)
   - 选择学生时自动填充姓名
   - 清晰的可视化标识区分导师和学生
4. **容错处理**: 即使关联信息加载失败,案例数据仍可正常显示

## 后续优化建议

1. **搜索功能**: 在创建案例的下拉框中添加搜索功能,方便在大量导师或学生中快速定位
2. **多导师支持**: 考虑支持一个案例关联多个导师(导师团队)
3. **关联统计**: 在导师和学生详情页显示相关的案例数量
4. **数据同步**: 如果学生姓名改变,可以考虑同步更新案例中的 `student_name` 字段

## 更新日志

- **2025-01-XX**: 实现案例库关联导师和学生功能
  - 添加数据库字段 `mentor_id` 和 `student_id`
  - 更新类型定义和服务层
  - 实现创建、显示、详情页面的关联功能

