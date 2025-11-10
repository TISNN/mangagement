 # 知识花园（Knowledge Garden Marketplace）前端 UI 设计方案

> 目标：为知识花园打造类似“知识市场”的沉浸式浏览体验，兼顾学生、顾问/内部员工、B 端合作伙伴与第三方创作者。以下方案从信息架构、视觉风格、关键版块与交互细节入手，可直接指导设计/前端实现。

## 1. 顶层信息架构
```
/knowledge-garden
├─ 首页 Home（市场主页面）
│  ├ Hero Banner + 行动按钮（Start Publishing / Explore）
│  ├ 分类 Tab：Knowledge Garden / Earn from Sharing / Connected Insights / Growing Together
│  ├ Featured 区块：精选知识花园卡片轮播
│  ├ Discover 板块：分角色推荐卡片（学生 / 顾问 / B 端）
│  ├ Trending / New / Top Rated 列表
│  ├ Call-to-Action：创作者招募 & 加入社群
│  └ Footer：标签索引、常见问题、协议信息
├─ 分类页 Catalog（/knowledge-garden/catalog/:slug）
│  ├ 分类说明 + 关键词
│  ├ 筛选面板（价格、类型、受众、评分、时长）
│  └ 内容瀑布流列表
├─ 搜索页 Search（/knowledge-garden/search?q=）
├─ 知识详情页 Detail（/knowledge-garden/doc/:id）
├─ 课程包/专题页 Bundle（/knowledge-garden/bundle/:id）
├─ 学习仪表盘 Dashboard（/knowledge-garden/dashboard）
└─ 创作者中心 Creator Studio（/knowledge-garden/creator）
```

本文重点描述首页及列表类页面的 UI 细节，其余页面可复用组件。

## 2. 视觉与动效基调
- **色彩**：保持品牌蓝紫渐变（#4F46E5 → #9333EA），营造科技感；配合白色背景与淡灰分区，突出内容卡片。
- **字体**：标题使用 `SF Pro Display / Inter`，卡片与正文使用 `SF Pro Text`，字重 500-700 强调关键信息。
- **卡片样式**：
  - 圆角 16px，阴影 `0 14px 30px rgba(79,70,229,0.12)`。
  - 顶部展示封面图（16:9），底部栅格展示核心指标。
  - 交互动效：Hover 时轻微上浮（translateY -6px）+ 阴影加强 + CTA 按钮显现。
- **标签风格**：受众 / 价格 / 评分标签使用 pill 形态，颜色区分：
  - 免费 `bg-emerald-100 text-emerald-600`
  - 付费 `bg-indigo-100 text-indigo-600`
  - 订阅 `bg-purple-100 text-purple-600`
  - 企业授权 `bg-amber-100 text-amber-600`
- **动效**：
  - Banner 渐变背景 + 流动光束（CSS animation）。
  - Featured 区块采用自动切换 Carousel（3s Interval），提供左右切换与指示点。
  - 筛选操作提供微动效，切换时列表使用渐隐/缩放过渡。

## 3. 页面结构详解（首页）

### 3.1 Hero Banner
| 区块 | 内容 |
| --- | --- |
| 主标题 | Create and Flow（可定制文案） |
| 副标题 | with the community!（副线说明） |
| Tag Pills | Knowledge Garden / Earn from Sharing / Connected Insights / Growing Together（点击切换说明区域） |
| CTA 区域 | `Start Publishing`（按钮，面向创作者） + `Browse Knowledge`（按钮） |
| 背景元素 | 蓝紫渐变底图 + 轻微发光的流体形态，顶部右角展示收益提示 “Creators earned $1,000+ from sharing” |

### 3.2 导航 Tab
- 位于 Banner 下方，水平 Tab（`Knowledge Market` / `Agent Community` / …），当前激活 Tab 使用底部发光线条。
- Tab 切换驱动页面主体数据（默认为 Market）。

### 3.3 Featured Knowledge Gardens
- 标题：`Featured Knowledge Gardens`，副标题 `Popular and trending knowledge bases`。
- 卡片展示元素：
  - 封面图（可使用创作者上传图或 AI 生成封面）
  - 标题 + 简短描述（2 行截断）
  - 评分（使用微笑/星星 icon + 数值）
  - 统计指标：Sources（知识源）、Seeds（章节/节点）、Users（访问人数）
  - 价格标签（FREE / $0.50 / SUBSCRIBE / ENTERPRISE）
  - 作者头像 + 名称
- 卡片底部 CTA：`View Garden`，Hover 时浮现。

### 3.4 Discover 区块
- 水平 Tab：`For Students` / `For Advisors` / `For Partners`。
- 每个 Tab 下展示 4-6 个卡片。
- 右上角按钮 `See more` 跳转到相应分类列表。

### 3.5 Trending / New / Top Rated
- 三列布局，每列为一类榜单。
- 每个榜单显示 5 条：标题、作者、主要指标、`$` 标签。
- 底部 `View leaderboard` 链接。

### 3.6 CTA 区域（双栏）
- 左侧：`Become a Creator` 面向顾问/内部员工，提供步骤（创建 → 审核 → 上线 → 收益）。
- 右侧：`Join Community` 邀请用户加入社群或 Discord/企业微信，展示活跃数据。

### 3.7 Footer
- 「Explore by tags」：热门标签云（点击跳转搜索页）。
- 常见问题、支持中心、服务条款、隐私政策链接。

## 4. 列表页面（All Knowledge Gardens）
| 区块 | 说明 |
| --- | --- |
| 标题行 | 左侧标题 + 结果统计；右侧排序（热门 / 最新 / 评分）|
| 搜索栏 | 🪄 代表语义搜索提示，如“Search by keyword, author or topic”。|
| 筛选抽屉 | 左侧按钮 `Filters` 打开侧边抽屉，包含 Price、Audience、Content Type、Duration、Rating、Language。|
| 卡片布局 | 4 列响应式网格，和首页卡片一致。|
| 分页 | 使用分页或懒加载 + “Load more” 按钮。|

## 5. 详情页（Doc）关键构成
- 顶部 Hero：封面图 + 标题 + 标签 + 价格 + 评分 + CTA（立即购买 / 加入订阅 / 请求授权）。
- 作者信息：头像、简介、其他作品、关注按钮。
- 内容摘要：提供目录预览、试读段落、随机评价摘录。
- 购买弹窗：展示定价、分成、退款政策；支持优惠码输入。
- 受众提示：显著标记“面向顾问 / 学生 / 合作机构”，避免误读。
- 推荐模块：`Related knowledge` + `Users also viewed`。

## 6. 组件规范（简版）

| 组件 | 规格 | 状态 |
| --- | --- | --- |
| GardenCard | 288×320，圆角 16px | default / hover / loading skeleton |
| TagPill | 高 24px，左右 Padding 10px | primary（蓝）/ success / warning / neutral |
| RatingBadge | 圆角矩形，渐变背景 | 评分 0-10 对应颜色梯度 |
| Carousel | 3 个可见卡片，自动轮播，左右箭头 | 支持键盘导航 |
| FilterDrawer | 320px 宽，分组（Price / Audience / Type）| 复选框 + Slider + Toggle |

## 7. 响应式策略
- >=1280：四列卡片，Header 固定高度。
- 1024-1279：三列卡片，Banner Stack。
- 768-1023：两列卡片，Tab 改为横向滑动。
- <768：单列卡片，Banner 转为垂直布局，CTA 按钮全宽。

## 8. 角色视角差异
| 角色 | 首屏推荐策略 | 价格展示 | CTA |
| --- | --- | --- | --- |
| 学生 | 语言课程、申请工具、免费资源 | 显示免费/付费标记，提供试学券 | `Start learning` |
| 顾问/内部 | 案例库、服务 SOP、内部模板 | 显示内部/付费信息，禁止分享 | `Add to toolkit` |
| B 端合作伙伴 | 企业培训、授权资料 | 显示企业授权按钮，提供咨询 | `Request license` |

身份识别可基于登录信息动态渲染卡片标签与 CTA。

## 9. 交互与空状态
- Loading：使用 skeleton 卡片 + 渐变动画。
- 空列表：展示插画 + 引导按钮（去创作 / 修改筛选）。
- 错误：显示错误提示 + 重试按钮。
- 未登录访问付费内容：弹出登录/注册对话框。

## 10. 无障碍与国际化
- 所有卡片信息（标题、描述、价格、标签）需提供 `aria-label`。
- 支持键盘导航（Tab -> Card -> CTA）。
- 颜色对比度 ≥ 4.5:1，Hover 时同时展示边框变化。
- 文案通过 i18n 维护，货币格式化基于所在地。

## 11. 设计交付清单
1. **高保真稿**：桌面、平板、移动三套首页/列表/详情页面。
2. **组件库**：Card、Tag、Tab、Filter、Modal、Carousel、Footer。
3. **图标与插画**：保持与截图风格一致，可使用线性图标（Lucide/Feather）。
4. **设计规范文档**：颜色、字体、间距、阴影、动效说明。
5. **原型**：使用 Figma 制作交互原型，展示 Tab 切换、Hover、弹窗、筛选流程。

---
此方案严格参照截图风格并扩展为完整知识市场体验，后续可结合 `knowledge-garden-frontend.md` 中的路由规划与后台模块共同推进开发。