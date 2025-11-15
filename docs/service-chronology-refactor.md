# 服务进度中心模块化重构文档

## 概述

本次重构将原本超过 2400 行的 `ServiceChronologyPage.tsx` 进行模块化拆分，提升代码可维护性与复用性。

## 文件结构

```
src/pages/admin/ServiceChronology/
├── ServiceChronologyPage.tsx      # 主页面入口（2045行）
├── types.ts                       # TypeScript 类型定义
├── constants.ts                   # 常量与样式映射
├── utils.ts                       # 工具函数集合
└── components/                    # UI 组件目录
    ├── index.ts                  # 统一导出
    └── SectionHeader.tsx         # 区块标题组件
```

## 模块说明

### 1. types.ts - 类型定义

导出所有页面相关的 TypeScript 接口与类型：

- `ChronoTab`: 标签页类型
- `ServiceProject`: 服务项目信息
- `SummaryMetric`: 汇总指标
- `TimelineEvent`: 时间线事件
- `MilestoneItem`: 里程碑项目
- `RiskItem`: 风险事项
- `AnalyticsIndicator`: 分析指标
- `ArchiveEntry`: 档案条目
- `CollaborationStatus`, `CollaborationPriority`: 协同状态与优先级
- `CollaborationActionItem`: 协同待办
- `CollaborationLogEntry`: 协同动态

### 2. constants.ts - 常量配置

集中管理所有静态配置：

#### 空数据占位符
- `EMPTY_SUMMARY_METRICS`: 无数据时的汇总指标占位
- `TIMELINE_EVENTS`: 时间线事件空数组
- `MILESTONE_ITEMS`: 里程碑空数组
- `RISK_ITEMS`: 风险事项空数组
- `ANALYTICS_INDICATORS`: 分析指标空数组
- `ARCHIVE_DATA`: 档案空数组

#### 样式映射
- `STATUS_COLOR`: 状态标签颜色（完成、进行中、待处理、风险）
- `MIL_STATUS_COLOR`: 里程碑状态颜色
- `RISK_LEVEL_COLOR`: 风险等级颜色
- `COLLAB_STATUS_BADGE`: 协同状态徽章样式
- `COLLAB_PRIORITY_TEXT`: 协同优先级文字颜色

#### 编辑选项
- `EDIT_STATUS_OPTIONS`: 编辑时可选的状态列表

### 3. utils.ts - 工具函数

提供纯函数工具集：

#### 日期格式化
- `formatDateString(date)`: 格式化为 yyyy-MM-dd
- `formatDateTime(date)`: 格式化为 yyyy-MM-dd HH:mm

#### 字符串处理
- `extractString(value, fallback)`: 安全提取字符串

#### 数据解析
- `parseActionItemsFromLog(log)`: 从日志解析协同待办
- `parseCollaborationLogsFromLog(log)`: 从日志解析协同动态

#### 字段提取
- `getRecordContent(record)`: 提取记录内容
- `getRecordAssignee(record)`: 提取负责人
- `getRecordDueDate(record)`: 提取截止日期
- `getTimelineLogId(event)`: 获取时间线事件的日志ID

### 4. components/ - UI 组件

#### SectionHeader
通用区块标题组件，支持标题、描述与操作按钮。

**Props:**
- `title`: string - 标题文本
- `description?`: string - 可选描述
- `actions?`: ReactNode - 右侧操作区

**使用示例:**
```tsx
<SectionHeader
  title="服务时间线"
  description="按时间顺序展示所有进度记录"
  actions={
    <button onClick={handleAdd}>新增记录</button>
  }
/>
```

## 使用指南

### 导入类型

```typescript
import type {
  TimelineEvent,
  ServiceProject,
  CollaborationActionItem,
} from './types';
```

### 导入常量

```typescript
import {
  EMPTY_SUMMARY_METRICS,
  STATUS_COLOR,
  EDIT_STATUS_OPTIONS,
} from './constants';
```

### 导入工具函数

```typescript
import {
  formatDateString,
  parseActionItemsFromLog,
  getRecordContent,
} from './utils';
```

### 导入组件

```typescript
import { SectionHeader } from './components';
```

## 重构收益

1. **可维护性提升**
   - 主页面代码量减少 18%（2483 → 2045 行）
   - 职责清晰，易于定位问题

2. **类型安全增强**
   - 集中管理类型定义，避免重复与不一致
   - IDE 自动补全与类型检查更准确

3. **可复用性提高**
   - 工具函数可被其他模块引用
   - 组件可独立测试与迭代

4. **协作效率优化**
   - 多人开发时减少冲突
   - 新成员快速理解模块职责

## 后续优化方向

### UI 组件继续拆分
建议将以下部分抽取为独立组件：

1. **TimelineList** - 时间轴列表（~200行）
2. **TimelineDetailPanel** - 详情侧边栏（~400行）
3. **EditProgressDrawer** - 编辑抽屉（~200行）
4. **DeleteConfirmDialog** - 删除确认对话框（~50行）
5. **MilestoneTable** - 里程碑表格（~100行）
6. **RiskList** - 风险列表（~80行）
7. **AnalyticsDashboard** - 统计指标面板（~120行）
8. **ArchiveGrid** - 档案网格（~60行）

### 数据逻辑抽取
- 创建自定义 Hooks 管理数据获取与缓存
- 协同操作状态独立封装
- 表单验证逻辑模块化

### 测试覆盖
- 为工具函数添加单元测试
- 为组件添加快照测试与交互测试

## 注意事项

1. **导入路径**：确保从正确的模块导入，避免循环依赖
2. **类型一致性**：使用 types.ts 中的定义，不要在组件内重复声明
3. **常量引用**：样式类名统一使用 constants 中的映射，避免硬编码
4. **工具函数纯度**：utils 中的函数应保持纯函数特性，方便测试

## 变更历史

- **2025-11-13**: 初始重构，拆分 types/constants/utils，减少主文件约 18%

---

文档维护：开发团队  
最后更新：2025-11-13
