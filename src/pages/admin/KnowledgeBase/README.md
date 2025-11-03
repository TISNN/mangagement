# 知识库模块文档

## 📁 目录结构

```
KnowledgeBase/
├── components/              # UI组件
│   ├── ResourceCard/       # 资源卡片
│   ├── ResourceFilters/    # 筛选器
│   ├── ResourceDetailPage/ # 资源详情页
│   └── StatsCards/         # 统计卡片
├── hooks/                   # 自定义Hooks
│   ├── useKnowledgeData.ts          # 数据管理
│   ├── useKnowledgeFilters.ts       # 筛选逻辑
│   ├── useKnowledgeOperations.ts    # CRUD操作
│   └── useKnowledgeComments.ts      # 评论管理
├── types/                   # TypeScript类型定义
│   └── knowledge.types.ts
├── utils/                   # 工具函数
│   ├── knowledgeConstants.ts  # 常量配置
│   └── knowledgeMappers.ts    # 数据映射
├── index.tsx               # 主入口页面
└── README.md              # 本文档

```

## 🎯 功能特性

### 1. 资源管理
- ✅ 资源列表展示（网格视图）
- ✅ 资源详情查看
- ✅ 资源创建和编辑（使用hooks提供）
- ✅ 资源删除（使用hooks提供）
- ✅ 资源类型：文档、视频、文章、模板

### 2. 筛选和搜索
- ✅ 全文搜索（标题、描述、标签）
- ✅ 按分类筛选
- ✅ 按类型筛选
- ✅ 按作者筛选
- ✅ 按标签筛选
- ✅ 按时间范围筛选
- ✅ 多种排序方式

### 3. 收藏和互动
- ✅ 收藏/取消收藏资源
- ✅ 查看我的收藏
- ✅ 浏览统计
- ✅ 下载统计

### 4. 评论系统
- ✅ 发表评论
- ✅ 回复评论（支持嵌套）
- ✅ 点赞评论
- ✅ 编辑和删除评论

### 5. 统计功能
- ✅ 总资源数统计
- ✅ 各类型资源数量
- ✅ 浏览量统计
- ✅ 下载量统计

## 🗄️ 数据库表结构

### 1. knowledge_resources（资源表）
```sql
- id: 资源ID
- title: 标题
- type: 类型（document/video/article/template）
- category: 分类
- description: 描述
- content: 内容（文章类型）
- file_url: 文件URL
- file_size: 文件大小
- thumbnail_url: 缩略图URL
- author_id: 作者ID
- author_name: 作者名称
- tags: 标签数组
- is_featured: 是否精选
- views: 浏览次数
- downloads: 下载次数
- status: 状态（draft/published/archived）
- created_at/updated_at: 时间戳
```

### 2. knowledge_comments（评论表）
```sql
- id: 评论ID
- resource_id: 资源ID
- user_id: 用户ID
- user_name: 用户名
- user_avatar: 用户头像
- content: 评论内容
- likes: 点赞数
- parent_comment_id: 父评论ID（支持回复）
- created_at/updated_at: 时间戳
```

### 3. knowledge_bookmarks（收藏表）
```sql
- id: 收藏ID
- resource_id: 资源ID
- user_id: 用户ID
- created_at: 创建时间
```

### 4. knowledge_comment_likes（评论点赞表）
```sql
- id: 点赞ID
- comment_id: 评论ID
- user_id: 用户ID
- created_at: 创建时间
```

## 🔧 使用方法

### 主页面使用
```tsx
import KnowledgeBase from './pages/admin/KnowledgeBase';

function App() {
  return <KnowledgeBase />;
}
```

### 详情页使用
```tsx
import ResourceDetailPage from './pages/admin/KnowledgeBase/components/ResourceDetailPage';

// 在路由中配置
<Route path="/knowledge/detail/:id" element={<ResourceDetailPage />} />
```

### 使用自定义Hooks

#### 1. 数据加载
```tsx
import { useKnowledgeData } from './hooks/useKnowledgeData';

function MyComponent() {
  const { 
    resources,        // 资源列表
    stats,           // 统计数据
    loading,         // 加载状态
    refreshData      // 刷新函数
  } = useKnowledgeData();

  return (
    // 你的组件
  );
}
```

#### 2. 筛选功能
```tsx
import { useKnowledgeFilters } from './hooks/useKnowledgeFilters';

function MyComponent() {
  const resources = [...]; // 从useKnowledgeData获取

  const {
    filteredResources,  // 筛选后的资源
    filters,            // 当前筛选条件
    updateFilter,       // 更新筛选条件
    resetFilters        // 重置筛选
  } = useKnowledgeFilters(resources);

  return (
    // 你的组件
  );
}
```

#### 3. 资源操作
```tsx
import { useKnowledgeOperations } from './hooks/useKnowledgeOperations';

function MyComponent() {
  const {
    handleCreateResource,    // 创建资源
    handleUpdateResource,    // 更新资源
    handleDeleteResource,    // 删除资源
    handleToggleBookmark,    // 切换收藏
    handleViewResource,      // 查看资源
    handleDownloadResource   // 下载资源
  } = useKnowledgeOperations();

  return (
    // 你的组件
  );
}
```

#### 4. 评论管理
```tsx
import { useKnowledgeComments } from './hooks/useKnowledgeComments';

function MyComponent() {
  const resourceId = 123;

  const {
    comments,              // 评论列表（树形结构）
    handleAddComment,      // 添加评论
    handleUpdateComment,   // 更新评论
    handleDeleteComment,   // 删除评论
    handleToggleLike       // 切换点赞
  } = useKnowledgeComments(resourceId);

  return (
    // 你的组件
  );
}
```

## 🎨 组件使用

### ResourceCard（资源卡片）
```tsx
import { ResourceCard } from './components/ResourceCard';

<ResourceCard
  resource={resource}
  onView={(id) => console.log('查看', id)}
  onBookmark={(id, isBookmarked) => console.log('收藏', id)}
  onDownload={(id, fileUrl) => console.log('下载', id)}
/>
```

### ResourceFilters（筛选器）
```tsx
import { ResourceFilters } from './components/ResourceFilters';

<ResourceFilters
  filters={filters}
  categories={categories}
  authors={authors}
  tags={tags}
  showAdvancedFilters={showAdvanced}
  onFilterChange={(key, value) => console.log('筛选', key, value)}
  onToggleAdvanced={() => setShowAdvanced(!showAdvanced)}
  onReset={() => console.log('重置')}
/>
```

### StatsCards（统计卡片）
```tsx
import { StatsCards } from './components/StatsCards';

<StatsCards stats={stats} />
```

## 🚀 部署步骤

### 1. 执行数据库迁移
在Supabase Dashboard的SQL Editor中执行：
```bash
database_migrations/004_create_knowledge_base_tables.sql
```

### 2. 验证表创建
确认以下表已创建：
- knowledge_resources
- knowledge_comments
- knowledge_bookmarks
- knowledge_comment_likes

### 3. 配置权限（RLS）
根据需要在Supabase中配置行级安全策略（Row Level Security）。

### 4. 测试功能
- 访问 `/admin/knowledge` 查看资源列表
- 访问 `/admin/knowledge/detail/:id` 查看资源详情
- 测试搜索、筛选、收藏、评论等功能

## 📝 待实现功能

以下功能的hooks和service层已实现，但UI还需完善：

1. **资源上传表单** - 需要创建上传组件
2. **资源编辑表单** - 需要创建编辑组件
3. **文件上传到Supabase Storage** - 需要集成Storage API
4. **管理员权限控制** - 需要添加权限检查

## 🔗 相关文件

- **服务层**: `/src/services/knowledgeService.ts`
- **路由配置**: `/src/AppRoutes.tsx`
- **数据库迁移**: `/database_migrations/004_create_knowledge_base_tables.sql`

## 💡 最佳实践

1. **数据加载**: 使用 `useKnowledgeData` hook集中管理数据
2. **筛选逻辑**: 使用 `useKnowledgeFilters` hook处理复杂筛选
3. **操作封装**: 使用 `useKnowledgeOperations` hook统一处理CRUD操作
4. **类型安全**: 所有数据使用TypeScript类型，避免运行时错误
5. **错误处理**: 所有操作都有错误处理和用户提示
6. **乐观更新**: 部分操作（如点赞）使用乐观更新提升用户体验

## 🐛 故障排除

### 问题：资源列表为空
- 检查数据库是否有数据
- 检查Supabase连接配置
- 检查RLS策略是否正确

### 问题：无法收藏资源
- 检查用户是否已登录
- 检查 `knowledge_bookmarks` 表是否创建
- 检查RLS策略

### 问题：评论无法显示
- 检查 `knowledge_comments` 表是否创建
- 检查评论数据是否正确关联到资源

## 📄 License

本模块遵循项目整体的许可证协议。

