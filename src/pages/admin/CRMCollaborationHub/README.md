# 协同空间模块

## 📁 目录结构

```
CRMCollaborationHub/
├── README.md                    # 模块说明文档
├── index.ts                     # 模块导出
├── types.ts                     # TypeScript 类型定义
├── constants.ts                 # 数据常量
├── CRMCollaborationHubPage.tsx  # 主页面组件（使用标签页切换）
└── components/                  # 子组件目录
    ├── index.ts                 # 组件统一导出
    ├── GoalsKPIDashboard.tsx    # 目标与KPI看板组件
    ├── TeamFeed.tsx             # 团队动态组件
    ├── CollaborationTasks.tsx   # 协作任务与请求组件
    ├── KnowledgeBase.tsx        # 知识库与模板组件
    ├── TrainingEvents.tsx       # 培训与活动组件
    ├── AlertsPanel.tsx          # 即时提醒面板组件
    └── dialogs/                 # 对话框组件目录
        ├── index.ts
        ├── AnnouncementDialog.tsx           # 发布公告对话框
        └── CollaborationRequestDialog.tsx   # 新建协作请求对话框
```

## 🎯 功能模块

### 1. 总览（Overview）
- 展示目标与KPI看板、团队动态、即时提醒
- 显示协作任务、知识库和培训活动的概览
- 提供快速入口，方便跳转到各个功能模块

### 2. 目标与KPI（Goals & KPI）
- **团队目标看板**：展示Q4签约目标、续约率、回款达成率、客户满意度等关键指标
- **进度可视化**：进度条显示完成度，预测达成率
- **个人KPI榜**：展示Top Performer和Rising Star，突出优秀表现
- **趋势分析**：环比数据展示，支持向上/向下/稳定趋势

### 3. 团队动态（Team Feed）
- **动态流**：整合公告、系统通知和协作讨论
- **互动功能**：支持评论、点赞、附件查看
- **可见范围**：团队可见或全公司可见
- **标签系统**：支持标签分类和筛选

### 4. 协作任务（Collaboration Tasks）
- **任务列表**：按状态（待处理、进行中、已完成）筛选
- **进度追踪**：显示需求部门、发起人、负责人、截止时间、SLA
- **历史记录**：完整的任务处理历史
- **优先级管理**：高、中、低优先级标识

### 5. 知识库（Knowledge Base）
- **文档管理**：成功案例、话术脚本、流程手册等
- **搜索筛选**：支持标题、标签搜索和分类筛选
- **使用统计**：阅读量、评分、收藏数
- **版本管理**：文档版本号和更新记录
- **AI功能**：AI生成话术、提交更新

### 6. 培训活动（Training Events）
- **活动列表**：展示培训标题、类型、时间、地点、主讲人
- **状态管理**：报名中、已满、回放三种状态
- **报名功能**：支持报名/签到和查看资料
- **状态筛选**：按活动状态筛选

## 🎨 UI/UX 优化

### 标签页切换
- 使用标签页（Tabs）组织各个功能模块
- 清晰的导航结构，提升用户体验
- 支持快速切换，避免页面过长

### 折叠展开
- 各个组件支持折叠/展开功能
- 减少页面初始加载时的视觉负担
- 用户可按需展开感兴趣的内容

### 对话框交互
- **发布公告对话框**：支持标题、内容、可见范围、标签设置
- **新建协作请求对话框**：完整的请求表单，包括类别、部门、优先级、SLA等

### 按钮交互
- 主要操作按钮使用醒目的颜色和图标
- 次要操作使用边框样式
- 悬停效果提供良好的交互反馈

## 📝 代码规范

### 组件拆分原则
1. **单一职责**：每个组件只负责一个功能模块
2. **可复用性**：通用组件提取到 `components` 目录
3. **类型安全**：使用 TypeScript 定义清晰的类型
4. **数据分离**：常量和类型定义独立文件

### 文件组织
- **types.ts**：所有 TypeScript 类型定义
- **constants.ts**：所有数据常量（示例数据）
- **components/**：功能组件目录
- **components/dialogs/**：对话框组件目录

### 命名规范
- 组件文件使用 PascalCase：`GoalsKPIDashboard.tsx`
- 类型定义使用 PascalCase：`GoalMetric`
- 常量使用 UPPER_SNAKE_CASE：`GOAL_METRICS`
- 函数使用 camelCase：`handlePublishAnnouncement`

## 🔧 使用说明

### 导入组件
```typescript
import { CRMCollaborationHubPage } from '@/pages/admin/CRMCollaborationHub';
```

### 添加新功能模块
1. 在 `components/` 目录创建新组件文件
2. 在 `types.ts` 中添加相关类型定义
3. 在 `constants.ts` 中添加示例数据（如需要）
4. 在 `CRMCollaborationHubPage.tsx` 中添加新的标签页配置
5. 在 `components/index.ts` 中导出新组件

### 添加对话框
1. 在 `components/dialogs/` 目录创建对话框组件
2. 在 `components/dialogs/index.ts` 中导出
3. 在主页面中引入并使用状态控制显示/隐藏

## 🚀 后续优化建议

1. **数据对接**：将示例数据替换为真实 API 调用
2. **状态管理**：考虑使用 Context 或 Redux 管理全局状态
3. **性能优化**：对大数据列表使用虚拟滚动
4. **权限控制**：根据用户角色显示/隐藏功能
5. **国际化**：支持多语言切换
6. **单元测试**：为关键组件添加测试用例
7. **实时更新**：使用 WebSocket 实现实时动态更新
8. **文件上传**：支持公告和知识库的附件上传功能

## 📚 相关文档

- [CRM 协同空间设计文档](../../../../docs/crm-collaboration-hub.md)
- [数据库结构文档](../../../../database_structure.md)

