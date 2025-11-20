# 文书老师工作区模块

## 📁 文件结构

```
DocumentWriterWorkspace/
├── components/                    # 组件目录
│   ├── StudentSelector.tsx        # 学生选择器组件
│   ├── DocumentListPanel.tsx      # 文档列表面板
│   ├── DocumentEditorArea.tsx     # 文档编辑区域
│   ├── RightPanel.tsx             # 右侧面板容器
│   └── panels/                    # 右侧面板子组件
│       ├── StudentInfoPanel.tsx   # 学生信息面板
│       ├── KnowledgeBasePanel.tsx # 知识库面板
│       ├── AIChatPanel.tsx       # AI问答面板
│       ├── MeetingRecordsPanel.tsx # 会议记录面板
│       └── RelatedDocumentsPanel.tsx # 相关文档面板
├── hooks/                         # 自定义Hooks
│   └── useWorkspaceData.ts       # 工作区数据管理Hook
├── services/                      # 服务层
│   └── documentService.ts         # 文档相关API服务
├── types/                         # 类型定义
│   └── index.ts                   # TypeScript类型定义
├── DocumentWriterWorkspacePage.tsx # 主页面组件
├── index.ts                       # 模块导出
└── README.md                       # 本文档
```

## 🎯 功能模块

### 1. 主页面 (DocumentWriterWorkspacePage.tsx)
- 整体布局管理
- 面板折叠状态管理
- 路由参数处理
- 创建文档模态框

### 2. 学生选择器 (StudentSelector.tsx)
- 学生列表展示
- 搜索功能
- 收藏功能
- 快速切换

### 3. 文档列表面板 (DocumentListPanel.tsx)
- 文档列表展示
- 筛选和搜索
- 文档操作（新建、删除）
- 文档状态显示

### 4. 文档编辑区域 (DocumentEditorArea.tsx)
- 文档编辑器集成
- 自动保存功能
- 手动保存和提交
- 状态栏显示

### 5. 右侧面板 (RightPanel.tsx)
- 多标签页切换
- 面板折叠功能
- 子面板路由

### 6. 子面板组件

#### 学生信息面板 (StudentInfoPanel.tsx)
- 显示学生基本信息
- 教育背景
- 申请目标
- 跳转到完整档案

#### 知识库面板 (KnowledgeBasePanel.tsx)
- 模板库浏览
- 案例库（开发中）
- 资料库（开发中）
- 模板插入功能

#### AI问答面板 (AIChatPanel.tsx)
- AI对话功能
- 快捷操作（润色、生成段落、内容建议）
- 对话历史

#### 会议记录面板 (MeetingRecordsPanel.tsx)
- 显示学生相关会议
- 会议详情查看
- 跳转到会议详情页

#### 相关文档面板 (RelatedDocumentsPanel.tsx)
- 显示学生其他文档
- 快速切换文档

## 🔧 使用方法

### 路由配置
已在 `AppRoutes.tsx` 中添加路由：
```typescript
<Route path="document-writer-workspace" element={<DocumentWriterWorkspacePage />} />
```

### 访问路径
```
/admin/document-writer-workspace
```

### URL参数
- `?student=123` - 指定学生ID
- `?document=456` - 指定文档ID

### 示例
```
/admin/document-writer-workspace?student=123&document=456
```

## 📝 数据服务

### documentService.ts
提供以下API方法：
- `getStudentDocuments()` - 获取学生文档列表
- `getDocument()` - 获取文档详情
- `createDocument()` - 创建文档
- `updateDocument()` - 更新文档
- `autosaveDocument()` - 自动保存
- `deleteDocument()` - 删除文档
- `getDocumentVersions()` - 获取版本列表
- `createDocumentVersion()` - 创建版本
- `getDocumentComments()` - 获取评论列表
- `addDocumentComment()` - 添加评论

## 🎨 组件特性

### 响应式设计
- 桌面端：三栏布局
- 平板端：面板可折叠
- 移动端：单栏布局（待实现）

### 状态管理
- 使用 `useWorkspaceData` Hook 管理全局状态
- 本地存储保存用户偏好（面板折叠状态、收藏学生等）

### 自动保存
- 每30秒自动保存
- 手动保存按钮
- 保存状态提示

## 🔄 待完善功能

1. **数据库表创建**
   - `application_documents` 表
   - `document_versions` 表
   - `document_comments` 表
   - `document_templates` 表

2. **AI功能集成**
   - 接入真实的AI API
   - 实现润色功能
   - 实现内容生成功能

3. **模板库功能**
   - 从数据库加载模板
   - 模板预览
   - 模板插入到编辑器

4. **版本管理**
   - 版本对比功能
   - 版本恢复功能

5. **评论系统**
   - 评论显示在编辑器中
   - 评论回复功能
   - @提醒功能

## 🐛 已知问题

1. 学生列表加载需要完善（当前使用模拟数据）
2. AI功能需要接入真实API
3. 模板库数据需要从数据库加载
4. 部分功能标记为"开发中"

## 📚 相关文档

- [产品设计文档](../../../../docs/document-writer-workspace.md)
- [申请工作台文档](../../../../docs/application-workbench.md)

## 👥 维护说明

### 代码规范
- 使用 TypeScript
- 组件使用函数式组件 + Hooks
- 遵循 React 最佳实践
- 代码注释完整

### 文件命名
- 组件文件使用 PascalCase
- 服务文件使用 camelCase
- 类型文件统一放在 types 目录

### 组件拆分原则
- 单一职责原则
- 可复用性
- 易于测试
- 代码量控制在合理范围（单个文件不超过500行）

