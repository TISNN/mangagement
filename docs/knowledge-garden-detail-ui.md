 # 知识花园·知识详情页 UI 设计方案

> 本方案参考截图所示的 Knowledge Base 详情页，严格复刻整体视觉结构与交互体验，面向知识花园中的单个花园内容展示。适用于 `/knowledge-hub/market/:id`（管理端预览）与 `/knowledge-garden/doc/:id`（对外门户）。

## 1. 页面信息架构
```
┌──────────────────────────────────────────────────────┐
│ 顶部 Hero 区：封面图 + 标题 + 标签 + 创作者信息 + 返回 │
├──────────────────────────────────────────────────────┤
│ 主栏（左）                                           │
│ ├ About（文本介绍）                                 │
│ ├ Try this knowledge base（AI 对比模块）              │
│ │ ├ 问题选择 + Compare 卡片                        │
│ │ └ Enhanced AI vs Standard AI 对比面板             │
│ ├ Sources Preview（资源卡片）                        │
│ ├ Usage Guidance（使用指南）                         │
│ └ Features & Benefits（四栏标签）                    │
│                                                      │
│ 侧栏（右）                                           │
│ ├ About the Creator（头像、简介、社交按钮）          │
│ ├ Statistics（Active Users / Sources / Reviews / Rating）│
│ │ └ CTA：Add to my knowledge garden + Share         │
│ ├ Important Notes（支付、授权说明）                   │
│ └ Comments（用户评论列表）                           │
└──────────────────────────────────────────────────────┘
```

## 2. 视觉风格与布局
- **整体宽度**：内容区域 max-width 1320px，两列布局（主栏 65%，侧栏 35%）。
- **背景**：浅灰渐变 `#F7F8FF` → `#FFFFFF`，顶部 Hero 叠加半透明蒙版。
- **卡片**：圆角 24px，背景 `rgba(255,255,255,0.9)`，阴影 `0 20px 36px rgba(101,109,255,0.12)`。
- **字体**：`Inter` / `SF Pro`；标题 24-32px 粗体，正文 14-16px，标签 12px。
- **色彩基调**：品牌蓝紫 (#6652F4 → #9E68FF) + 互补绿色 (#22C55E) 和橙色用于提示。
- **暗色模式**：背景转 `#0F172A`，卡片 `#141E35`，边框 `#1F2A44`，文本 `#E2E8F0`。

## 3. 关键区块详解

### 3.1 顶部 Hero
| 元素 | 说明 |
| --- | --- |
| 返回按钮 | 左上角 `< Back` text button + 左箭头icon，悬浮时下划线 |
| 封面图 | 16:5 比例，支持缩放；左侧保留品牌 Logo/图案 |
| Title 区 | 白色蒙版上的标题（28px）、类型标签（Knowledge Base） |
| 创作者信息 | 头像 + 名称 + 角色标签（Creator / Team）|
| 次级指标 | 在创作者信息下方使用 Pills：点赞数、收藏等 |
|
### 3.2 About 区
- 使用卡片容器（padding 28px），标题“About”右侧可放置 `Edit` 按钮（管理端）。
- 正文支持 Markdown/富文本。

### 3.3 Try this knowledge base
- 顶部卡片 `Try this knowledge base` + 子标题 `Test the difference between AI with and without knowledge base`。
- 下方 Dropdown：允许选择问题，右侧按钮 `Compare in real-time`。
- 中部主卡片：左右并排对比。
  - 左：`Enhanced AI` badge（紫色渐变 + AI 图标）+ 文本输入结果。
  - 右：`Standard AI` badge（浅灰）+ 文本结果。
- 底部提示：输入框 placeholder “Type your question above to experience enhanced AI responses”。

### 3.4 Sources Preview
- 标题 + 副标题 `Preview first 3 sources in this knowledge base`。
- 卡片 4 个并排：
  - 头部图标（文档/链接）+ 标题 + 简述。
  - 底部标签：知识单位/章节数。
  - 最右一张为“Unlock Full Access”占位卡。
- 支持分页指示器（圆点）。

### 3.5 Usage Guidance
- 大卡片（圆角 32px）+ 渐变背景 `rgba(102,82,244,0.08)`。
- 包含 list（1. 前提准备 2. 深入了解 3. 实战技巧），使用 emoji 强调。

### 3.6 Features & Benefits
- 4 个 pill 卡片（浅色背景 + icon +标题+描述），横向排列。

### 3.7 About the Creator（侧栏）
- 白色卡片，顶部显示头像（渐变背景圆），姓名，角色标签。
- 社交按钮：Twitter / GitHub / LinkedIn / Website 圆角按钮。
- `Statistics` 区展示 4 组数据：Active Users、Sources、Reviews、Rating；右侧 price($0)。
- CTA `Add to my knowledge garden`（紫色按钮）+ `Share` Secondary 按钮。

### 3.8 Important Notes
- 列表形式，配合 icon（绿色/橙色）。

### 3.9 Comments
- 每条评论卡片：头像、用户名、日期、内容，使用浅灰背景。
- 底部分页器。

## 4. 组件规范
| 组件 | 规格 |
| --- | --- |
| Pill 标签 | 高 26px，padding 0 12，字体 12px |
| 按钮 | 主按钮圆角 9999px，padding 10/20；次按钮边框 1px |
| 卡片间距 | 24px 竖直间隔，内部 padding 24px |
| 图标 | Feather/Lucide 20-24px，主要颜色 #94A3B8 |

## 5. 响应式
- ≥1280：两列布局。
- 1024-1279：两列，但侧栏改为宽 30%，评论区单列。
- 768-1023：改为单列，侧栏内容顺序排列在主内容之后。
- <768：Hero 高度 260px，按钮全宽，卡片堆叠。

## 6. 交互细节
- Hero 返回按钮 hover -> underline。
- Cards hover -> 阴影提升 + slight translate (-4px)。
- Compare 模块下拉后，高亮当前问题。比较区 GPT 文本支持复制按钮。
- Sources Preview 右上角“View all”按钮（可选）。
- Comments 分页：按钮 + 数字 + 下一页。

## 7. 可扩展性
- 管理端可显示“Edit section”按钮（悬浮在右上角）。
- 若无 AI 对比数据，显示空状态占位插画。
- 支持多语言（中文/英文）。

---
此设计规范确保与截图保持一致，可作为 Figma 高保真制作与前端开发的参考。