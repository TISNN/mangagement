# 最近更新 (2025-10-25)

## 🎯 标化成绩功能上线

### 概述
将原有的"语言与考试账号"升级为功能更强大的"标化成绩"模块,支持记录完整的考试信息、多次考试记录和可选的账号密码管理。

### 主要变化

#### 1. 数据库更新
- ✅ 新增 `student_profile.standardized_tests` JSONB 字段
- ✅ 创建 GIN 索引优化查询性能
- ✅ 添加测试数据 (学生 ID 25)

#### 2. 支持的考试类型
- 雅思 (IELTS)
- 托福 (TOEFL)
- GRE
- GMAT
- 大学英语四级 (CET-4)
- 大学英语六级 (CET-6)
- 其他 (自定义)

#### 3. 新增功能
- 📊 **完整分数记录**: 总分 + 小分(听说读写/Verbal/Quantitative)
- 📅 **考试时间记录**: 可记录每次考试的具体日期
- ➕ **多次考试支持**: 可添加同一考试的多次成绩
- 🔐 **可选账号密码**: 根据需要选择是否保存
- 🎨 **展开/收起交互**: 避免信息过载,提升用户体验

#### 4. UI 优化
- 蓝色配色方案,与其他部分区分
- 卡片式设计,层次清晰
- 响应式布局,完整暗黑模式支持
- 图标辅助,直观易懂

### 访问路径
`/admin/applications/25/planning` → 学生档案 → 标化成绩

### 相关文档
- [功能详细文档](STANDARDIZED_TESTS_FEATURE.md)
- [实现总结](标化成绩功能实现总结.md)
- [数据库文档](DATABASE_COMPLETE.md#19-student_profile-学生申请档案表)

---

## 📋 其他更新

### 申请进度管理系统
- ✅ 完成 ApplicationsPage (申请进度列表)
- ✅ 完成 ApplicationDetailPage (学生申请详情)
- ✅ 完成 PlanningDetailPage (选校规划详情)
- ✅ 实现学生档案、会议记录、选校列表、材料清单功能
- ✅ 添加工作经历功能

### 数据库表
- `student_profile` - 学生申请档案
- `student_meetings` - 学生会议记录
- `final_university_choices` - 最终选校列表
- `application_documents_checklist` - 申请材料清单

### 文档更新
- ✅ 更新 DATABASE_COMPLETE.md
- ✅ 新增 APPLICATION_PROGRESS_IMPLEMENTATION.md
- ✅ 新增 STANDARDIZED_TESTS_FEATURE.md
- ✅ 新增 WORK_EXPERIENCE_FEATURE.md

---

**更新日期**: 2025-10-25  
**版本**: v2.3.0

