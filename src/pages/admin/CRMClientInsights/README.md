# 客户分群分析模块

## 📁 目录结构

```
CRMClientInsights/
├── README.md                    # 模块说明文档
├── index.ts                     # 模块导出
├── types.ts                     # TypeScript 类型定义
├── constants.ts                 # 数据常量
├── CRMClientInsightsPage.tsx    # 主页面组件（使用标签页切换）
└── components/                  # 子组件目录
    ├── index.ts                 # 组件统一导出
    ├── MetricsDashboard.tsx     # 指标看板组件
    ├── ProfileAndTags.tsx       # 客户画像与标签组件
    ├── SegmentationBuilder.tsx  # 分群引擎组件
    ├── ValueModels.tsx          # 价值模型组件
    ├── AutomationRules.tsx      # 自动化规则组件
    ├── ReportsAndExport.tsx     # 报表与导出组件
    ├── AlertsAndFocus.tsx       # 预警与重点关注组件
    └── dialogs/                 # 对话框组件目录
        ├── index.ts
        ├── CustomerSwitchDialog.tsx    # 切换客户对话框
        ├── TagManagementDialog.tsx     # 标签管理对话框
        └── PreviewDialog.tsx           # 预览样本对话框
```

## 🎯 功能模块

### 1. 总览（Overview）
- 展示核心指标看板（客户总量、活跃客户、流失风险、留存率）
- 提供快速入口，方便跳转到各个功能模块
- 显示预警与重点关注信息

### 2. 画像与标签（Profile & Tags）
- **客户画像卡片**：展示客户基本信息、旅程节点、最近互动等
- **标签体系**：按类别展示基础标签、行为标签、价值标签、风险标签
- **标签管理中心**：支持创建、编辑、删除标签，配置自动规则

### 3. 分群引擎（Segmentation Builder）
- **分群模板**：提供预设分群模板，快速创建分群
- **条件构建器**：拖拽式条件构建，支持 AND/OR 逻辑
- **实时统计**：显示匹配客户数、占比、流失风险等
- **AI 提示**：智能分析分群结果，提供运营建议

### 4. 价值模型（Value Models）
- **RFM 汇总**：展示 Recency、Frequency、Monetary 评分
- **预测指标**：续约成功率、追加购买概率、投诉发生率
- **价值象限**：高价值、潜力、沉睡、流失风险四个象限可视化

### 5. 自动化规则（Automation Rules）
- **规则列表**：展示所有自动化规则及其状态
- **规则详情**：展开查看触发条件、执行动作、成功率等
- **执行日志**：查看规则执行历史记录

### 6. 报表与导出（Reports & Export）
- **报表分类**：分群历史、活动归因、数据导出
- **报表列表**：展示报表标题、描述、更新时间、负责人
- **导出功能**：支持导出报表数据

### 7. 预警与关注（Alerts & Focus）
- **预警群组**：投诉高发群、续约临界群、支付滞后群
- **详情查看**：展开查看预警详情和推荐行动
- **预案管理**：查看和配置预警处理预案

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
- **切换客户对话框**：搜索和选择客户
- **标签管理对话框**：分类管理标签，支持新建、编辑、删除
- **预览样本对话框**：查看分群匹配的客户样本

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
- 组件文件使用 PascalCase：`MetricsDashboard.tsx`
- 类型定义使用 PascalCase：`MetricCard`
- 常量使用 UPPER_SNAKE_CASE：`METRICS`
- 函数使用 camelCase：`handleSwitchCustomer`

## 🔧 使用说明

### 导入组件
```typescript
import { CRMClientInsightsPage } from '@/pages/admin/CRMClientInsights';
```

### 添加新功能模块
1. 在 `components/` 目录创建新组件文件
2. 在 `types.ts` 中添加相关类型定义
3. 在 `constants.ts` 中添加示例数据（如需要）
4. 在 `CRMClientInsightsPage.tsx` 中添加新的标签页配置
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

## 📚 相关文档

- [CRM 客户分群分析设计文档](../../../../docs/crm-client-insights.md)
- [数据库结构文档](../../../../database_structure.md)

