# 文书老师工作区（Document Writer Workspace）产品设计文档

## 📋 目录

1. [模块定位与目标](#1-模块定位与目标)
2. [用户角色与使用场景](#2-用户角色与使用场景)
3. [功能架构设计](#3-功能架构设计)
4. [页面布局与交互设计](#4-页面布局与交互设计)
5. [核心功能详细设计](#5-核心功能详细设计)
6. [数据模型设计](#6-数据模型设计)
7. [API接口设计](#7-api接口设计)
8. [交互流程设计](#8-交互流程设计)
9. [技术实现要点](#9-技术实现要点)
10. [迭代计划](#10-迭代计划)

---

## 1. 模块定位与目标

### 1.1 定位
**文书老师工作区**是一个专为文书老师设计的集成化工作平台，将文档编写、知识查阅、AI辅助、学生信息查看等功能整合在一个界面中，提升文书老师的工作效率和协作体验。

### 1.2 核心目标
- **一站式工作环境**：在一个页面完成所有文书相关工作，减少页面跳转
- **信息快速获取**：快速查看学生档案、历史文档、会议记录等上下文信息
- **智能辅助写作**：集成AI问答、模板库、知识库，提供写作支持
- **高效协作**：支持多人协作、版本管理、评论反馈
- **知识沉淀**：将优秀文书案例、模板、经验沉淀到知识库

### 1.3 与现有模块的关系
- **继承自**：ApplicationWorkbench（申请工作台）的文书工作台功能
- **整合**：学生档案、会议记录、知识库、云文档、AI助手
- **增强**：在原有基础上增加侧边栏信息面板、快速切换等功能

---

## 2. 用户角色与使用场景

### 2.1 主要用户
- **文书老师**：核心用户，负责撰写和修改各类申请文书
- **文书主管**：负责审核、分配任务、查看团队工作状态
- **顾问**：需要查看文书进度、提供反馈

### 2.2 典型使用场景

#### 场景1：开始撰写新文书
1. 文书老师收到任务通知，点击进入工作区
2. 选择学生，系统自动加载该学生的档案信息
3. 查看学生的教育背景、标化成绩、实习经历等
4. 查看该学生之前的文书和会议记录，了解背景
5. 从模板库选择合适的文书模板
6. 开始撰写，使用AI助手进行润色和优化

#### 场景2：修改已有文书
1. 在工作区左侧文档列表中选择要修改的文书
2. 查看版本历史，了解之前的修改记录
3. 查看评论和反馈意见
4. 根据反馈进行修改
5. 使用AI助手检查语法和逻辑
6. 提交新版本并通知相关人员

#### 场景3：查阅资料和模板
1. 在撰写过程中需要参考优秀案例
2. 打开右侧知识库面板，搜索相关文书案例
3. 查看模板库，选择合适的段落模板
4. 将模板内容插入到当前文档中
5. 根据学生情况调整模板内容

#### 场景4：与学生/顾问协作
1. 收到学生或顾问的反馈意见
2. 查看评论中的具体建议
3. 使用AI助手分析反馈，生成改进建议
4. 进行修改并回复评论
5. 标记为待审核状态

---

## 3. 功能架构设计

### 3.1 整体架构

```
文书老师工作区
├─ 顶部导航栏
│  ├─ 学生选择器（快速切换学生）
│  ├─ 当前文书信息（类型、状态、截止日期）
│  └─ 快捷操作（保存、提交、分享）
├─ 左侧面板（可折叠）
│  ├─ 文档列表（当前学生的所有文书）
│  ├─ 版本历史
│  └─ 评论与反馈
├─ 中央编辑区
│  ├─ 文档编辑器（富文本/Markdown）
│  ├─ 工具栏（格式化、插入、AI助手）
│  └─ 状态栏（字数统计、保存状态）
├─ 右侧面板（可折叠，多标签页）
│  ├─ 学生档案（基本信息、教育背景、标化成绩等）
│  ├─ 知识库（模板、案例、资料）
│  ├─ AI问答助手
│  ├─ 会议记录
│  └─ 相关文档
└─ 底部状态栏
   ├─ 协作信息（当前编辑者、最后修改时间）
   └─ 快捷操作（全屏、设置）
```

### 3.2 功能模块清单

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| **文档编辑** | 富文本编辑器、Markdown支持、自动保存、版本管理 | P0 |
| **学生信息** | 学生档案查看、快速切换学生、收藏学生 | P0 |
| **知识库** | 模板库、案例库、资料库、搜索与筛选 | P0 |
| **AI助手** | 智能问答、文书润色、语法检查、内容建议 | P0 |
| **会议记录** | 查看会议记录、会议文档、会议笔记 | P1 |
| **文档管理** | 文档列表、版本历史、差异对比 | P0 |
| **协作功能** | 评论系统、@提醒、任务指派 | P1 |
| **快捷操作** | 模板插入、片段库、常用短语 | P1 |

---

## 4. 页面布局与交互设计

### 4.1 整体布局

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 顶部导航栏（固定）                                                       │
│ [← 返回] [学生选择器 ▼] [文书类型: PS] [状态: 撰写中] [💾 保存] [📤 提交] │
├──────────┬──────────────────────────────────────────────┬───────────────┤
│          │                                              │               │
│ 左侧面板  │              中央编辑区                      │  右侧面板     │
│ (可折叠)  │                                              │  (可折叠)     │
│          │  ┌────────────────────────────────────────┐  │               │
│ 📄 文档  │  │  文档标题输入框                        │  │ 👤 学生档案   │
│ 列表     │  ├────────────────────────────────────────┤  │ 📚 知识库     │
│          │  │  [B] [I] [U] [H1] [H2] [•] [1.] ...  │  │ 🤖 AI问答    │
│ • PS     │  ├────────────────────────────────────────┤  │ 📅 会议记录   │
│ • Essay  │  │                                         │  │ 📁 相关文档   │
│ • CV     │  │  文档编辑区域                           │  │               │
│ • RL     │  │  （富文本编辑器）                        │  │               │
│          │  │                                         │  │               │
│ 📝 版本  │  │                                         │  │               │
│ 历史     │  │                                         │  │               │
│          │  └────────────────────────────────────────┘  │               │
│ 💬 评论  │  字数: 1234 | 最后保存: 2分钟前              │               │
│          │                                              │               │
└──────────┴──────────────────────────────────────────────┴───────────────┘
```

### 4.2 响应式布局

- **桌面端（≥1280px）**：三栏布局，左右面板默认展开
- **平板端（768px-1279px）**：左右面板可折叠，默认收起
- **移动端（<768px）**：单栏布局，左右面板以抽屉形式展示

### 4.3 面板折叠交互

- **左侧面板折叠**：点击面板边缘的折叠按钮，或使用快捷键 `Ctrl/Cmd + B`
- **右侧面板折叠**：点击面板边缘的折叠按钮，或使用快捷键 `Ctrl/Cmd + K`
- **面板宽度调整**：支持拖拽调整左右面板宽度（桌面端）
- **面板状态记忆**：用户的面板折叠状态保存在本地存储中

---

## 5. 核心功能详细设计

### 5.1 顶部导航栏

#### 5.1.1 学生选择器
**功能描述**：快速切换当前工作的学生

**交互设计**：
- 显示当前学生姓名和头像
- 点击下拉框，显示搜索框和最近使用的学生列表
- 支持按姓名、服务类型、阶段搜索
- 支持收藏学生，收藏的学生显示在顶部
- 显示学生状态标签（如：待反馈、进行中、已完成）

**UI组件**：
```
[👤 张三] [▼]
  ↓ 点击展开
┌─────────────────────────┐
│ 🔍 搜索学生...           │
├─────────────────────────┤
│ ⭐ 收藏学生              │
│   • 李四 (PS撰写中)      │
│   • 王五 (待审核)        │
├─────────────────────────┤
│ 📋 最近使用              │
│   • 赵六                 │
│   • 孙七                 │
└─────────────────────────┘
```

#### 5.1.2 当前文书信息
**显示内容**：
- 文书类型（PS、Essay、CV、RL等）
- 文书状态（撰写中、待审核、已定稿等）
- 截止日期（如有）
- 负责人信息

**状态标签颜色**：
- 撰写中：蓝色
- 待审核：橙色
- 已定稿：绿色
- 已逾期：红色

#### 5.1.3 快捷操作按钮
- **保存**：手动保存（自动保存每30秒）
- **提交**：提交审核或请求反馈
- **分享**：分享给其他成员
- **设置**：编辑器设置、快捷键设置

### 5.2 左侧面板

#### 5.2.1 文档列表
**功能**：显示当前学生的所有文书

**列表项显示**：
- 文书类型图标和名称
- 状态标签
- 最后修改时间
- 字数统计
- 未读评论数量（如有）

**操作**：
- 点击切换文档
- 右键菜单：重命名、删除、复制、导出
- 拖拽排序（自定义顺序）

**筛选和排序**：
- 按类型筛选
- 按状态筛选
- 按修改时间排序

#### 5.2.2 版本历史
**功能**：查看文档的所有版本

**显示内容**：
- 版本号和时间
- 创建者
- 版本说明（如有）
- 版本差异预览

**操作**：
- 查看版本内容
- 对比两个版本
- 恢复到指定版本
- 下载版本

#### 5.2.3 评论与反馈
**功能**：查看和管理文档的评论

**显示内容**：
- 评论列表（按时间倒序）
- 评论者头像和姓名
- 评论内容
- 评论位置（如：第3段）
- 回复和@提醒

**操作**：
- 添加新评论
- 回复评论
- 标记评论为已读
- 将评论转为任务

### 5.3 中央编辑区

#### 5.3.1 文档编辑器
**编辑器类型**：富文本编辑器（基于Tiptap）

**核心功能**：
- 富文本编辑（加粗、斜体、下划线、标题、列表等）
- Markdown模式切换
- 自动保存（每30秒）
- 字数统计
- 拼写检查
- 语法高亮（代码块）

**工具栏功能**：
- 文本格式化（B、I、U、H1-H6）
- 列表（有序、无序）
- 链接和图片插入
- 表格插入
- 代码块
- 引用块
- 分隔线
- 撤销/重做
- 全屏编辑

**特殊功能**：
- **模板插入**：从模板库快速插入段落
- **片段库**：保存常用段落，快速插入
- **AI润色**：选中文本，使用AI进行润色
- **智能补全**：输入时提供智能建议

#### 5.3.2 状态栏
**显示信息**：
- 当前字数/总字数
- 最后保存时间
- 自动保存状态（保存中/已保存）
- 当前编辑者（多人协作时）
- 文档阅读时间估算

### 5.4 右侧面板（多标签页）

#### 5.4.1 学生档案标签页
**功能**：快速查看当前学生的详细信息

**显示内容**：
- **基本信息**：姓名、性别、出生日期、联系方式等
- **教育背景**：本科/硕士学校、专业、GPA、毕业时间等
- **标化成绩**：IELTS、TOEFL、GRE、GMAT等
- **实习/工作经历**：公司、职位、时间、描述
- **项目经历**：项目名称、角色、时间、成果
- **获奖经历**：奖项名称、时间、级别
- **语言能力**：各语言水平
- **申请目标**：目标国家、学校、专业

**交互**：
- 信息以卡片形式展示，可折叠展开
- 点击"查看完整档案"跳转到学生详情页
- 支持快速编辑（部分字段）

#### 5.4.2 知识库标签页
**功能**：查阅模板、案例、资料

**功能模块**：
1. **模板库**
   - 按文书类型分类（PS、Essay、CV等）
   - 按专业分类
   - 按国家分类
   - 搜索功能
   - 模板预览
   - 一键插入到编辑器

2. **案例库**
   - 成功案例展示
   - 按学校、专业、结果筛选
   - 案例详情查看
   - 参考借鉴功能

3. **资料库**
   - 写作指南
   - 常见问题
   - 参考资料
   - 下载功能

**交互设计**：
- 顶部搜索框，支持全文搜索
- 左侧分类树，快速筛选
- 中间内容列表，卡片式展示
- 点击卡片，右侧显示详情预览
- "插入到文档"按钮，快速插入内容

#### 5.4.3 AI问答助手标签页
**功能**：智能问答和写作辅助

**功能模块**：
1. **智能问答**
   - 输入问题，AI回答
   - 支持上下文理解（基于当前学生和文档）
   - 历史对话记录
   - 常用问题快捷按钮

2. **文书润色**
   - 选中文本，点击"润色"按钮
   - AI提供润色建议
   - 可选择应用或忽略

3. **内容建议**
   - 根据学生背景，AI生成段落建议
   - 支持多版本对比
   - 可插入到文档

4. **语法检查**
   - 实时检查语法错误
   - 提供修改建议
   - 一键修复

**交互设计**：
```
┌─────────────────────────┐
│ 🤖 AI助手                │
├─────────────────────────┤
│ 💬 对话历史              │
│                         │
│ [用户] 如何写PS开头？    │
│ [AI]  PS开头可以...      │
│                         │
├─────────────────────────┤
│ 📝 快捷操作              │
│ [润色选中文本] [生成段落] │
│ [语法检查] [内容建议]    │
├─────────────────────────┤
│ 🔍 输入问题...           │
│ [发送]                   │
└─────────────────────────┘
```

#### 5.4.4 会议记录标签页
**功能**：查看与该学生相关的会议记录

**显示内容**：
- 会议列表（按时间倒序）
- 会议标题、类型、时间
- 参会人员
- 会议摘要
- 会议文档链接

**交互**：
- 点击会议项，展开详情
- 查看会议笔记和文档
- 跳转到完整会议详情页

#### 5.4.5 相关文档标签页
**功能**：查看该学生的其他相关文档

**显示内容**：
- 该学生的所有文档（包括其他文书类型）
- 会议文档
- 申请材料
- 其他云文档

**交互**：
- 点击文档，在新标签页打开
- 支持快速切换
- 显示文档状态和最后修改时间

### 5.5 协作功能

#### 5.5.1 评论系统
**功能**：
- 在文档中选中文本，添加评论
- 支持@提醒其他成员
- 评论回复和讨论
- 评论状态管理（待处理、已处理、已解决）

#### 5.5.2 实时协作
**功能**：
- 多人同时编辑（显示其他编辑者的光标位置）
- 编辑者列表显示
- 冲突解决机制

#### 5.5.3 任务管理
**功能**：
- 将评论转为任务
- 任务指派和跟踪
- 任务状态更新

---

## 6. 数据模型设计

### 6.1 核心数据表

#### 6.1.1 文书文档表（application_documents）
```sql
CREATE TABLE application_documents (
  id BIGSERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id),
  project_id INTEGER REFERENCES application_projects(id),
  document_type VARCHAR(50) NOT NULL, -- PS, Essay, CV, RL等
  title VARCHAR(500) NOT NULL,
  content TEXT, -- 文档内容（HTML格式）
  status VARCHAR(50) DEFAULT 'draft', -- draft, writing, review, finalized
  word_count INTEGER DEFAULT 0,
  deadline DATE,
  assigned_to INTEGER REFERENCES employees(id), -- 负责人
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  is_favorite BOOLEAN DEFAULT false
);
```

#### 6.1.2 文档版本表（document_versions）
```sql
CREATE TABLE document_versions (
  id BIGSERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES application_documents(id),
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,
  change_summary TEXT, -- 版本变更说明
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);
```

#### 6.1.3 文档评论表（document_comments）
```sql
CREATE TABLE document_comments (
  id BIGSERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES application_documents(id),
  version_id INTEGER REFERENCES document_versions(id), -- 关联到特定版本
  parent_comment_id INTEGER REFERENCES document_comments(id), -- 回复的父评论
  content TEXT NOT NULL,
  selected_text TEXT, -- 选中的文本
  start_position INTEGER, -- 选中文本的起始位置
  end_position INTEGER, -- 选中文本的结束位置
  mentioned_user_ids INTEGER[], -- @的用户ID列表
  status VARCHAR(50) DEFAULT 'open', -- open, resolved, closed
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by INTEGER REFERENCES employees(id)
);
```

#### 6.1.4 文档协作表（document_collaborators）
```sql
CREATE TABLE document_collaborators (
  id BIGSERIAL PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES application_documents(id),
  user_id INTEGER NOT NULL REFERENCES employees(id),
  role VARCHAR(50) NOT NULL, -- owner, editor, viewer
  invited_by INTEGER REFERENCES employees(id),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  last_accessed_at TIMESTAMPTZ,
  UNIQUE(document_id, user_id)
);
```

#### 6.1.5 文档模板表（document_templates）
```sql
CREATE TABLE document_templates (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  category VARCHAR(100), -- 专业、国家等分类
  content TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_by INTEGER REFERENCES employees(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6.1.6 文档片段表（document_snippets）
```sql
CREATE TABLE document_snippets (
  id BIGSERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES employees(id),
  name VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 关联数据表（已存在）

- `students` - 学生表
- `student_profiles` - 学生档案表
- `student_meetings` - 学生会议表
- `meeting_documents` - 会议文档表
- `cloud_documents` - 云文档表
- `knowledge_resources` - 知识库资源表

---

## 7. API接口设计

### 7.1 文档管理接口

#### 7.1.1 获取学生文档列表
```
GET /api/documents/student/:studentId
Query参数:
  - document_type: 文档类型筛选
  - status: 状态筛选
  - sort: 排序方式（updated_at, created_at, title）

响应:
{
  "documents": [
    {
      "id": 1,
      "document_type": "PS",
      "title": "Personal Statement",
      "status": "writing",
      "word_count": 1200,
      "updated_at": "2025-01-20T10:30:00Z",
      "unread_comments_count": 2
    }
  ]
}
```

#### 7.1.2 获取文档详情
```
GET /api/documents/:id

响应:
{
  "id": 1,
  "student_id": 123,
  "document_type": "PS",
  "title": "Personal Statement",
  "content": "<p>...</p>",
  "status": "writing",
  "word_count": 1200,
  "deadline": "2025-02-01",
  "assigned_to": {
    "id": 5,
    "name": "张老师"
  },
  "versions": [...],
  "comments": [...],
  "collaborators": [...]
}
```

#### 7.1.3 创建文档
```
POST /api/documents
Body:
{
  "student_id": 123,
  "project_id": 456,
  "document_type": "PS",
  "title": "Personal Statement",
  "template_id": 10  // 可选，使用模板创建
}

响应:
{
  "id": 1,
  "document": {...}
}
```

#### 7.1.4 更新文档
```
PATCH /api/documents/:id
Body:
{
  "title": "Updated Title",
  "content": "<p>...</p>",
  "status": "review"
}

响应:
{
  "id": 1,
  "document": {...}
}
```

#### 7.1.5 自动保存
```
PUT /api/documents/:id/autosave
Body:
{
  "content": "<p>...</p>",
  "word_count": 1200
}

响应:
{
  "saved_at": "2025-01-20T10:30:00Z"
}
```

### 7.2 版本管理接口

#### 7.2.1 创建版本
```
POST /api/documents/:id/versions
Body:
{
  "content": "<p>...</p>",
  "change_summary": "修改了第二段内容"
}

响应:
{
  "version": {
    "id": 1,
    "version_number": 2,
    "created_at": "2025-01-20T10:30:00Z"
  }
}
```

#### 7.2.2 获取版本列表
```
GET /api/documents/:id/versions

响应:
{
  "versions": [
    {
      "id": 1,
      "version_number": 1,
      "created_at": "2025-01-20T10:30:00Z",
      "created_by": {...},
      "word_count": 1100,
      "change_summary": "初始版本"
    }
  ]
}
```

#### 7.2.3 版本对比
```
GET /api/documents/:id/versions/compare
Query参数:
  - version1: 版本1的ID
  - version2: 版本2的ID

响应:
{
  "diff": {
    "added": [...],
    "removed": [...],
    "modified": [...]
  }
}
```

### 7.3 评论接口

#### 7.3.1 添加评论
```
POST /api/documents/:id/comments
Body:
{
  "content": "这段需要修改",
  "selected_text": "原文内容",
  "start_position": 100,
  "end_position": 150,
  "mentioned_user_ids": [5, 6]
}

响应:
{
  "comment": {
    "id": 1,
    "content": "...",
    "created_by": {...},
    "created_at": "2025-01-20T10:30:00Z"
  }
}
```

#### 7.3.2 获取评论列表
```
GET /api/documents/:id/comments

响应:
{
  "comments": [
    {
      "id": 1,
      "content": "...",
      "selected_text": "...",
      "created_by": {...},
      "replies": [...],
      "status": "open"
    }
  ]
}
```

### 7.4 模板和片段接口

#### 7.4.1 获取模板列表
```
GET /api/templates
Query参数:
  - document_type: 文档类型
  - category: 分类
  - search: 搜索关键词

响应:
{
  "templates": [
    {
      "id": 1,
      "name": "PS模板-计算机科学",
      "document_type": "PS",
      "category": "计算机科学",
      "preview": "...",
      "usage_count": 150
    }
  ]
}
```

#### 7.4.2 插入模板
```
POST /api/documents/:id/insert-template
Body:
{
  "template_id": 1,
  "position": 0  // 插入位置
}

响应:
{
  "success": true,
  "updated_content": "<p>...</p>"
}
```

### 7.5 AI助手接口

#### 7.5.1 AI问答
```
POST /api/ai/chat
Body:
{
  "question": "如何写好PS的开头？",
  "context": {
    "student_id": 123,
    "document_id": 1,
    "document_type": "PS"
  }
}

响应:
{
  "answer": "...",
  "suggestions": [...]
}
```

#### 7.5.2 AI润色
```
POST /api/ai/polish
Body:
{
  "text": "原文内容",
  "style": "academic",  // academic, creative, formal
  "language": "en"
}

响应:
{
  "polished_text": "润色后的内容",
  "changes": [
    {
      "type": "grammar",
      "original": "...",
      "suggested": "...",
      "reason": "..."
    }
  ]
}
```

#### 7.5.3 内容建议
```
POST /api/ai/suggest
Body:
{
  "student_id": 123,
  "document_type": "PS",
  "section": "introduction",  // introduction, body, conclusion
  "context": "已有内容..."
}

响应:
{
  "suggestions": [
    {
      "content": "...",
      "reason": "..."
    }
  ]
}
```

---

## 8. 交互流程设计

### 8.1 新建文书流程

```
1. 用户点击"新建文书"按钮
   ↓
2. 弹出创建对话框
   - 选择学生（如未选择）
   - 选择文书类型（PS、Essay等）
   - 选择模板（可选）
   - 输入标题
   ↓
3. 点击"创建"
   ↓
4. 系统创建文档，跳转到编辑页面
   ↓
5. 如果选择了模板，自动填充模板内容
   ↓
6. 用户开始编辑
   ↓
7. 自动保存（每30秒）
   ↓
8. 用户手动保存或提交
```

### 8.2 使用模板流程

```
1. 用户在编辑器中点击"插入模板"按钮
   ↓
2. 右侧面板切换到"知识库"标签页
   ↓
3. 用户浏览或搜索模板
   ↓
4. 点击模板卡片，查看预览
   ↓
5. 点击"插入到文档"按钮
   ↓
6. 模板内容插入到光标位置
   ↓
7. 用户根据实际情况修改模板内容
```

### 8.3 AI润色流程

```
1. 用户在编辑器中选择一段文本
   ↓
2. 点击工具栏的"AI润色"按钮
   ↓
3. 右侧面板切换到"AI问答"标签页
   ↓
4. 显示润色中状态
   ↓
5. AI返回润色结果和建议
   ↓
6. 用户查看润色后的文本
   ↓
7. 用户选择：
   - 应用润色结果
   - 查看详细修改说明
   - 忽略建议
   ↓
8. 如果应用，文本自动替换
```

### 8.4 添加评论流程

```
1. 用户在编辑器中选择一段文本
   ↓
2. 弹出快捷菜单，点击"添加评论"
   ↓
3. 弹出评论输入框
   ↓
4. 用户输入评论内容
   ↓
5. 可选择@提醒其他成员
   ↓
6. 点击"提交"
   ↓
7. 评论保存，在选中文本处显示评论标记
   ↓
8. 被@的用户收到通知
   ↓
9. 其他协作者可以看到评论
```

### 8.5 版本对比流程

```
1. 用户在左侧面板点击"版本历史"
   ↓
2. 显示版本列表
   ↓
3. 用户选择两个版本
   ↓
4. 点击"对比"按钮
   ↓
5. 弹出对比窗口，显示：
   - 左侧：版本1
   - 右侧：版本2
   - 差异高亮显示
   ↓
6. 用户可以：
   - 查看详细差异
   - 恢复到某个版本
   - 关闭对比窗口
```

---

## 9. 技术实现要点

### 9.1 前端技术栈

- **框架**：React + TypeScript
- **路由**：React Router
- **状态管理**：React Context + Hooks（或Zustand）
- **编辑器**：Tiptap（富文本编辑器）
- **UI组件库**：Tailwind CSS + Headless UI
- **数据获取**：React Query（用于数据缓存和同步）
- **实时协作**：WebSocket（可选，用于多人实时编辑）

### 9.2 关键组件设计

#### 9.2.1 DocumentWorkspace组件（主容器）
```typescript
interface DocumentWorkspaceProps {
  studentId?: number;
  documentId?: number;
  initialDocumentType?: string;
}

// 功能：
// - 管理整体布局
// - 处理面板折叠状态
// - 管理当前学生和文档状态
// - 处理路由和导航
```

#### 9.2.2 DocumentEditor组件（编辑器）
```typescript
interface DocumentEditorProps {
  documentId: number;
  content: string;
  onContentChange: (content: string) => void;
  onSave: () => Promise<void>;
  readOnly?: boolean;
}

// 功能：
// - 富文本编辑
// - 自动保存
// - 字数统计
// - 工具栏操作
```

#### 9.2.3 StudentInfoPanel组件（学生信息面板）
```typescript
interface StudentInfoPanelProps {
  studentId: number;
  onStudentChange?: (studentId: number) => void;
}

// 功能：
// - 显示学生档案信息
// - 支持快速编辑
// - 跳转到完整档案页
```

#### 9.2.4 KnowledgeBasePanel组件（知识库面板）
```typescript
interface KnowledgeBasePanelProps {
  documentType?: string;
  onInsertTemplate?: (templateId: number) => void;
  onInsertSnippet?: (snippetId: number) => void;
}

// 功能：
// - 模板库浏览
// - 案例库查看
// - 资料搜索
// - 内容插入
```

#### 9.2.5 AIChatPanel组件（AI助手面板）
```typescript
interface AIChatPanelProps {
  studentId?: number;
  documentId?: number;
  selectedText?: string;
  onPolish?: (text: string) => void;
  onSuggest?: (suggestion: string) => void;
}

// 功能：
// - AI问答
// - 文本润色
// - 内容建议
// - 语法检查
```

### 9.3 状态管理设计

#### 9.3.1 全局状态（Context）
```typescript
interface WorkspaceContext {
  // 当前学生
  currentStudent: Student | null;
  setCurrentStudent: (student: Student | null) => void;
  
  // 当前文档
  currentDocument: Document | null;
  setCurrentDocument: (document: Document | null) => void;
  
  // 面板状态
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  rightPanelActiveTab: string;
  
  // 编辑器状态
  isSaving: boolean;
  lastSavedAt: Date | null;
  
  // 协作状态
  collaborators: Collaborator[];
  comments: Comment[];
}
```

#### 9.3.2 本地状态（组件内）
- 编辑器内容
- 搜索关键词
- 筛选条件
- UI交互状态（展开/折叠等）

### 9.4 性能优化

1. **虚拟滚动**：文档列表和版本历史使用虚拟滚动
2. **内容分页**：长文档分段加载
3. **防抖保存**：自动保存使用防抖，避免频繁请求
4. **缓存策略**：使用React Query缓存学生信息、模板等数据
5. **懒加载**：右侧面板内容按需加载
6. **代码分割**：按路由和功能模块进行代码分割

### 9.5 错误处理

1. **网络错误**：自动重试机制
2. **保存失败**：提示用户，保存到本地存储
3. **冲突处理**：多人编辑冲突时，提示用户选择版本
4. **权限错误**：提示用户无权限操作

---

## 10. 迭代计划

### 10.1 MVP版本（Sprint 1-2，4周）

**目标**：实现核心功能，满足基本使用需求

**功能清单**：
- ✅ 学生选择器
- ✅ 文档列表和切换
- ✅ 富文本编辑器
- ✅ 自动保存
- ✅ 学生档案查看
- ✅ 基础模板库
- ✅ 简单AI问答

**交付物**：
- 工作区主页面
- 文档编辑器
- 学生信息面板
- 基础API接口

### 10.2 增强版本（Sprint 3-4，4周）

**目标**：增强协作和AI功能

**功能清单**：
- ✅ 版本管理
- ✅ 评论系统
- ✅ AI润色和内容建议
- ✅ 完整模板库和案例库
- ✅ 会议记录查看
- ✅ 相关文档查看

**交付物**：
- 版本历史功能
- 评论系统
- AI助手增强
- 知识库完整功能

### 10.3 优化版本（Sprint 5-6，4周）

**目标**：优化体验和性能

**功能清单**：
- ✅ 实时协作（多人编辑）
- ✅ 高级搜索和筛选
- ✅ 快捷键支持
- ✅ 移动端适配
- ✅ 性能优化
- ✅ 数据分析面板

**交付物**：
- 实时协作功能
- 移动端版本
- 性能优化报告
- 用户使用数据分析

### 10.4 未来规划

**可能的扩展功能**：
- 语音输入和转写
- 多语言支持
- 离线编辑
- 插件系统
- 自定义工作流
- 智能推荐系统

---

## 11. 成功指标（KPI）

### 11.1 使用指标
- **日活跃用户数**：文书老师每日使用工作区的人数
- **平均使用时长**：每次使用工作区的平均时长
- **文档创建数量**：通过工作区创建的文档数量
- **模板使用率**：模板被使用的频率

### 11.2 效率指标
- **文档完成时间**：平均完成一篇文书的时间
- **修改轮次**：平均每篇文书的修改轮次
- **AI使用率**：使用AI功能的频率
- **协作效率**：评论响应时间、任务完成时间

### 11.3 质量指标
- **一次通过率**：文书一次审核通过的比例
- **用户满意度**：文书老师对工作区的满意度评分
- **错误率**：文档中的语法和拼写错误率

### 11.4 业务指标
- **学生满意度**：学生对文书质量的满意度
- **申请成功率**：使用工作区撰写的文书对应的申请成功率
- **知识沉淀**：新增模板和案例的数量

---

## 12. 注意事项

### 12.1 数据安全
- 文档内容加密存储
- 访问权限严格控制
- 操作日志完整记录
- 定期数据备份

### 12.2 用户体验
- 加载速度优化（首屏<2秒）
- 操作反馈及时（保存状态、错误提示）
- 快捷键支持（提高效率）
- 帮助文档和引导

### 12.3 兼容性
- 浏览器兼容（Chrome、Firefox、Safari、Edge）
- 响应式设计（桌面、平板、手机）
- 不同屏幕尺寸适配

### 12.4 可维护性
- 代码注释完整
- 组件化设计
- 类型定义完善
- 单元测试覆盖

---

## 附录

### A. 快捷键列表

| 功能 | 快捷键 |
|------|--------|
| 保存 | Ctrl/Cmd + S |
| 全屏编辑 | F11 |
| 折叠左侧面板 | Ctrl/Cmd + B |
| 折叠右侧面板 | Ctrl/Cmd + K |
| 切换文档 | Ctrl/Cmd + Tab |
| 搜索 | Ctrl/Cmd + F |
| 插入模板 | Ctrl/Cmd + T |
| AI润色 | Ctrl/Cmd + P |
| 添加评论 | Ctrl/Cmd + M |

### B. 状态定义

**文档状态**：
- `draft` - 草稿
- `writing` - 撰写中
- `review` - 待审核
- `revision` - 修改中
- `finalized` - 已定稿
- `archived` - 已归档

**评论状态**：
- `open` - 待处理
- `resolved` - 已解决
- `closed` - 已关闭

### C. 参考资源

- [ApplicationWorkbench设计文档](./application-workbench.md)
- [知识库设计文档](./knowledge-garden.md)
- [云文档功能说明](../README.md#云文档功能)

---

**文档版本**：v1.0  
**创建日期**：2025-01-20  
**最后更新**：2025-01-20  
**作者**：AI助手

