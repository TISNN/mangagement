# 案例库字段映射文档

## 数据库表：success_cases

### 数据库实际字段（从Supabase）
```
- id (uuid) - 主键
- student_name (text) - 学生姓名
- school (text) - 录取学校
- applied_program (text) - 申请的专业
- program_id (uuid) - 关联到programs表
- admission_year (integer) - 录取年份
- gpa (text) - GPA成绩
- language_scores (text) - 语言成绩
- experiecnce (text) - 经历（注意拼写错误）
- bachelor_university (text) - 本科院校
- bachelor_major (text) - 本科专业
- created_at (timestamptz)
- updated_at (timestamptz)
```

### 前端需要添加的字段（不在数据库中）
```
- master_school - 硕士院校
- master_major - 硕士专业  
- master_gpa - 硕士GPA
- region - 地区
- admission_result - 录取结果
- offer_type - 录取类型
- scholarship - 奖学金
- notes - 备注
```

### 字段映射关系

| 前端字段 | 数据库字段 | 说明 |
|---------|-----------|------|
| id | id | UUID |
| student_name | student_name | 学生姓名 |
| school_name → school | school | 学校名称 |
| major_name → applied_program | applied_program | 专业名称 |
| undergraduate_school → bachelor_university | bachelor_university | 本科院校 |
| undergraduate_major → bachelor_major | bachelor_major | 本科专业 |
| gpa | gpa | GPA成绩 |
| language_score → language_scores | language_scores | 语言成绩 |
| work_experience/其他经历 → experiecnce | experiecnce | 综合经历 |
| admission_year | admission_year | 录取年份 |
| program_id | program_id | 关联专业ID |

## 需要创建的数据库迁移

如果需要添加硕士背景等字段到数据库，需要执行以下SQL:

```sql
ALTER TABLE success_cases
ADD COLUMN IF NOT EXISTS master_school TEXT,
ADD COLUMN IF NOT EXISTS master_major TEXT,
ADD COLUMN IF NOT EXISTS master_gpa TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS admission_result TEXT,
ADD COLUMN IF NOT EXISTS offer_type TEXT,
ADD COLUMN IF NOT EXISTS scholarship TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;
```

