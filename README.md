# Infinite.ai - 留学全周期服务平台

## 项目概述

Infinite.ai是一个专注于留学全周期服务的数字化平台，连接学生、顾问和机构的智能生态系统。通过专业知识库和数字化服务，重新定义留学申请体验。我们致力于解决留学申请过程中的痛点问题，让每一位学生都能获得高质量的留学咨询服务。

## 系统架构

本项目采用React + TypeScript + Tailwind CSS开发，使用Vite作为构建工具。项目结构清晰，代码模块化，便于维护和扩展。

### 主要功能模块

#### 学生端
- **总览仪表盘**：展示申请进度、待办事项和重要通知
- **数据分析**：提供申请数据的可视化分析
- **材料管理**：集中管理申请材料和文档
- **社区交流**：与其他申请者交流经验
- **学习资源**：提供留学相关的学习资料

#### 机构端
- **客户管理**：管理学生信息和申请进度
- **数据分析**：分析业务数据和市场趋势
- **团队协作**：支持团队成员之间的协作
- **运营管理**：优化业务流程和提升效率

## 技术栈

- **前端框架**：React 18
- **类型系统**：TypeScript
- **样式方案**：Tailwind CSS
- **构建工具**：Vite
- **状态管理**：React Context API
- **路由管理**：React Router
- **动画效果**：Framer Motion
- **图标库**：Lucide Icons

## 开发指南

### 环境要求
- Node.js 16+
- npm 8+

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目规划与改进

### 当前状态
目前项目已完成基础功能开发，包括学生端和机构端的核心功能。

### 未来规划
1. 优化用户体验，提升界面交互
2. 增强数据分析能力，提供更多洞察
3. 完善社区功能，促进用户交流
4. 扩展学习资源库，提供更多优质内容

## 注意事项

本项目中的学生端功能专注于提供基础的申请管理和学习资源服务，高级功能如文书优化、选校推荐等服务由留学机构的专业顾问提供，以保证服务质量和专业性。

## 联系方式

- **客服热线**：400-XXX-XXXX（7*24小时）
- **商务合作**：010-XXXX-XXXX
- **邮箱地址**：contact@infinite.ai 

# 教育咨询管理系统

这是一个专为教育咨询机构设计的管理系统，用于管理学生、财务、考勤和服务项目。系统基于React和Supabase构建，提供了直观的用户界面和强大的数据管理功能。

## 主要功能

### 1. 财务管理
- 记录所有收入和支出交易
- 支持按人员、项目、服务类型、分类和账户进行关联
- 提供Excel批量导入功能
- 财务报表和统计数据可视化

### 2. 学生管理
- 多服务类型支持（语言培训、标准化考试、学术辅导、研究指导、申请服务、作品集指导等）
- 服务开始和结束时间记录
- 学生信息详细页面
- 导师关系管理

### 3. 考勤系统
- 员工打卡功能
- 个人和团队考勤记录查看
- 考勤统计

### 4. 仪表盘
- 关键数据概览
- 待办事项
- 个人欢迎信息

## 技术栈

- 前端：React + TypeScript + Tailwind CSS
- 状态管理：React Hooks
- 数据库：Supabase (PostgreSQL)
- 数据可视化：自定义组件
- 文件处理：XLSX库

## 数据库结构

系统使用Supabase（基于PostgreSQL）作为数据库。主要数据表包括：

### 财务相关表
- `finance_transactions`: 存储交易记录
- `finance_categories`: 交易分类
- `finance_accounts`: 财务账户
- `finance_service_types`: 服务类型

### 人员和项目相关表
- `people`: 人员信息（学生、客户、合作伙伴等）
- `projects`: 项目信息

## 开始使用

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 使用说明

### 1. 财务管理
- 进入"财务管理"页面可以查看所有交易
- 点击"添加交易"按钮创建新交易
- 使用Excel批量导入功能可以一次导入多条交易记录
- 交易可以按日期、金额、类型等进行筛选

### 2. 学生管理
- 在"学生管理"页面可以查看所有学生
- 支持按服务类型和状态筛选学生
- 点击学生行可查看学生详细信息和服务记录
- 学生可以同时参与多种服务项目

### 3. 考勤系统
- 在首页的欢迎信息下方可以进行打卡
- "考勤管理"页面可查看考勤记录
- 可切换查看个人或团队考勤情况

## 系统需求

- Node.js 16+
- 现代浏览器（Chrome, Firefox, Safari, Edge）

## 授权协议

本项目为内部使用软件，未经授权不得分发或使用。

# 留学服务管理系统

本系统是一个专门为留学服务机构设计的全功能管理平台，用于管理学生、服务、导师和财务等各方面信息。

## 主要功能

### 学生管理模块

学生管理模块是系统的核心部分，提供了完整的学生信息管理功能，包括：

#### 1. 学生列表浏览
- 查看所有学生基本信息和服务状态
- 按状态分类：活跃、休学、毕业、退学等
- 快速搜索学生姓名或邮箱
- 按服务类型和状态进行筛选

#### 2. 学生信息管理
- 添加新学生：包含基本信息和服务选择
- 查看学生详情：个人信息、教育背景、服务情况
- 修改学生信息和状态

#### 3. 服务管理
- 为学生添加多种服务：语言培训、标化培训、全包申请等
- 跟踪服务进度和状态
- 分配导师并查看服务历史

#### 4. 数据导出
- 导出基础学生信息到CSV文件
- 导出详细学生和服务数据，包含服务详情和状态

### 如何使用学生管理模块

#### 浏览学生
1. 导航至管理后台的"学生管理"页面
2. 使用顶部的搜索框按名称或邮箱搜索学生
3. 使用筛选按钮打开高级筛选面板，按状态或服务类型筛选
4. 点击标签页切换不同状态的学生视图

#### 添加新学生
1. 点击页面右上角的"添加学生"按钮
2. 填写必要的学生基本信息（姓名为必填）
3. 选择至少一种服务类型
4. 点击"添加学生"按钮提交

#### 查看学生详情
1. 在学生列表中点击任意学生行
2. 查看学生的详细信息、服务记录和进度

#### 导出学生数据
1. 点击页面右上角的"导出"按钮
2. 选择导出基础信息或详细信息
3. 基础信息：包含学生基本信息和服务摘要
4. 详细信息：分别导出学生信息和服务详情两个CSV文件

## 技术栈

- 前端：React, TypeScript, TailwindCSS
- 后端：Supabase (PostgreSQL)
- 状态管理：React Hooks
- 数据可视化：适用的图表库

## 数据模型

### 主要实体

1. **Person**: 所有人员的基本信息
2. **StudentProfile**: 学生特有的信息和教育背景
3. **StudentService**: 学生接受的服务记录
4. **ServiceType**: 服务类型定义
5. **MentorProfile**: 导师信息和专业领域

## 开发与部署

### 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产部署
```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 未来计划

- 实现学生服务进度的可视化展示
- 添加导师分配和管理系统
- 整合财务模块，实现服务付款追踪
- 实现学生申请材料的在线管理和协作
- 提供数据分析和业务报表功能

## 服务进度跟踪功能

### 功能概述
服务进度跟踪功能允许管理员和导师记录和查看学生服务的进度情况。主要功能包括：

1. 进度更新
   - 通过进度条直观显示服务完成度
   - 支持0-100%的进度记录（以里程碑形式保存，如"25%"）
   - 可添加进度说明、已完成项目和下一步计划

2. 进度历史记录
   - 记录每次进度更新的详细信息
   - 包含更新时间、里程碑、进度说明等信息
   - 以时间线形式展示进度发展历程

3. 任务管理
   - 记录已完成的任务项目
   - 计划下一步的工作内容
   - 支持JSON格式存储结构化数据

### 使用方法

1. 更新服务进度
   - 在学生详情页面的服务卡片中点击"更新进度"按钮
   - 在弹出的模态框中设置新的进度值
   - 添加进度说明、已完成项目和下一步计划
   - 点击"更新进度"保存

2. 查看进度历史
   - 在学生详情页面点击任意服务卡片
   - 在页面下方查看该服务的进度历史记录
   - 历史记录按时间倒序排列，以时间线形式展示
   - 查看每个阶段的完成项目和下一步计划

### 数据库结构

系统使用现有的 `service_progress` 表记录进度历史：

```sql
-- 服务进度表结构
CREATE TABLE service_progress (
    id BIGSERIAL PRIMARY KEY,
    student_service_id BIGINT,
    recorded_by BIGINT,
    progress_date TIMESTAMP WITH TIME ZONE,
    milestone VARCHAR,         -- 进度里程碑，如 "25%"
    description TEXT,          -- 进度描述
    notes TEXT,                -- 额外备注
    completed_items JSONB,     -- 已完成项目，JSON格式
    next_steps JSONB,          -- 下一步计划，JSON格式
    attachments JSONB,         -- 附件，JSON格式
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    employee_ref_id BIGINT     -- 员工引用ID
);
```

在 `student_services` 表中，使用 `progress` 字段记录当前进度值。

### API接口

系统提供以下API接口用于服务进度管理：

1. 添加服务进度记录
   ```typescript
   addServiceProgress(progress: ServiceProgressRecord): Promise<void>
   ```

2. 获取服务进度历史记录
   ```typescript
   getServiceProgressHistory(studentServiceId: number): Promise<ServiceProgressHistory[]>
   ```

### 数据测试

系统提供了测试数据SQL脚本用于添加初始进度记录：
`service_progress_test_data.sql`

### 注意事项

1. 进度值以百分比形式存储（如"25%"）
2. 已完成项目和下一步计划使用JSON格式存储，每项包含"content"字段
3. 每次更新服务进度时会同时更新`student_services`表中的进度值
4. 若要上传附件，可以使用attachments字段（当前版本未实现） 

## 服务进度跟踪功能

### 功能概述
服务进度跟踪功能允许管理员和导师记录和查看学生服务的进度情况。主要功能包括：

1. 进度更新
   - 通过进度条直观显示服务完成度
   - 支持0-100%的进度记录（以里程碑形式保存，如"25%"）
   - 可添加进度说明、已完成项目和下一步计划

2. 进度历史记录
   - 记录每次进度更新的详细信息
   - 包含更新时间、里程碑、进度说明等信息
   - 以时间线形式展示进度发展历程

3. 任务管理
   - 记录已完成的任务项目
   - 计划下一步的工作内容
   - 支持JSON格式存储结构化数据

### 使用方法

1. 更新服务进度
   - 在学生详情页面的服务卡片中点击"更新进度"按钮
   - 在弹出的模态框中设置新的进度值
   - 添加进度说明、已完成项目和下一步计划
   - 点击"更新进度"保存

2. 查看进度历史
   - 在学生详情页面点击任意服务卡片
   - 在页面下方查看该服务的进度历史记录
   - 历史记录按时间倒序排列，以时间线形式展示
   - 查看每个阶段的完成项目和下一步计划

### 数据库结构

系统使用现有的 `service_progress` 表记录进度历史：

```sql
-- 服务进度表结构
CREATE TABLE service_progress (
    id BIGSERIAL PRIMARY KEY,
    student_service_id BIGINT,
    recorded_by BIGINT,
    progress_date TIMESTAMP WITH TIME ZONE,
    milestone VARCHAR,         -- 进度里程碑，如 "25%"
    description TEXT,          -- 进度描述
    notes TEXT,                -- 额外备注
    completed_items JSONB,     -- 已完成项目，JSON格式
    next_steps JSONB,          -- 下一步计划，JSON格式
    attachments JSONB,         -- 附件，JSON格式
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    employee_ref_id BIGINT     -- 员工引用ID
);
```

在 `student_services` 表中，使用 `progress` 字段记录当前进度值。

### API接口

系统提供以下API接口用于服务进度管理：

1. 添加服务进度记录
   ```typescript
   addServiceProgress(progress: ServiceProgressRecord): Promise<void>
   ```

2. 获取服务进度历史记录
   ```typescript
   getServiceProgressHistory(studentServiceId: number): Promise<ServiceProgressHistory[]>
   ```

### 数据测试

系统提供了测试数据SQL脚本用于添加初始进度记录：
`service_progress_test_data.sql`

### 注意事项

1. 进度值以百分比形式存储（如"25%"）
2. 已完成项目和下一步计划使用JSON格式存储，每项包含"content"字段
3. 每次更新服务进度时会同时更新`student_services`表中的进度值
4. 若要上传附件，可以使用attachments字段（当前版本未实现） 