# 项目状态徽章

## 可用徽章

### GitHub Actions状态

将以下代码添加到你的README.md中,显示构建和部署状态:

```markdown
<!-- GitHub Actions状态徽章 -->
![部署状态](https://github.com/你的用户名/你的仓库名/workflows/部署到Vercel/badge.svg)
![CI状态](https://github.com/你的用户名/你的仓库名/workflows/持续集成/badge.svg)
```

**替换说明:**
- `你的用户名` → 你的GitHub用户名
- `你的仓库名` → 你的仓库名称
- 工作流名称必须与 `.github/workflows/` 中的 `name:` 字段完全匹配

### 部署平台徽章

```markdown
<!-- Vercel部署状态 -->
[![部署状态](https://img.shields.io/badge/部署-Vercel-black?logo=vercel)](https://vercel.com)

<!-- 使用技术栈 -->
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
```

### 代码质量徽章

```markdown
<!-- 代码质量 -->
![代码质量](https://img.shields.io/badge/代码质量-良好-brightgreen)
![维护状态](https://img.shields.io/badge/维护状态-积极-green)
```

## 完整示例

在README.md顶部添加所有徽章:

```markdown
# Infinite.ai - 留学全周期服务平台

<!-- 构建和部署状态 -->
![部署状态](https://github.com/你的用户名/你的仓库名/workflows/部署到Vercel/badge.svg)
![CI状态](https://github.com/你的用户名/你的仓库名/workflows/持续集成/badge.svg)

<!-- 技术栈 -->
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
[![Vercel](https://img.shields.io/badge/部署-Vercel-black?logo=vercel)](https://vercel.com)

<!-- 项目信息 -->
![License](https://img.shields.io/badge/license-MIT-blue)
![维护状态](https://img.shields.io/badge/维护状态-积极-green)

> 专注于留学全周期服务的数字化平台...
```

## 自定义徽章

### Shields.io

使用 [shields.io](https://shields.io) 创建自定义徽章:

**基本格式:**
```
https://img.shields.io/badge/<左侧文字>-<右侧文字>-<颜色>
```

**示例:**
```markdown
![自定义](https://img.shields.io/badge/版本-1.0.0-blue)
![状态](https://img.shields.io/badge/状态-运行中-success)
```

### 动态徽章

显示实时数据:

```markdown
<!-- GitHub Stars -->
![Stars](https://img.shields.io/github/stars/你的用户名/你的仓库名?style=social)

<!-- 最后提交时间 -->
![Last Commit](https://img.shields.io/github/last-commit/你的用户名/你的仓库名)

<!-- 仓库大小 -->
![Repo Size](https://img.shields.io/github/repo-size/你的用户名/你的仓库名)
```

## 颜色参考

常用颜色代码:

| 颜色 | 代码 | 用途 |
|------|------|------|
| 🟢 成功 | `brightgreen`, `success`, `00ff00` | 构建成功、测试通过 |
| 🔵 信息 | `blue`, `informational`, `0000ff` | 版本号、一般信息 |
| 🟡 警告 | `yellow`, `warning`, `ffff00` | 需要注意的状态 |
| 🔴 错误 | `red`, `critical`, `ff0000` | 构建失败、错误 |
| ⚫ 中性 | `black`, `grey`, `lightgrey` | 平台标识 |
| 🟣 自定义 | `blueviolet`, `ff69b4` | 特殊标识 |

## 徽章样式

### 扁平风格 (默认)

```markdown
![默认](https://img.shields.io/badge/样式-默认-blue)
```

### 扁平方形

```markdown
![方形](https://img.shields.io/badge/样式-方形-blue?style=flat-square)
```

### 塑料风格

```markdown
![塑料](https://img.shields.io/badge/样式-塑料-blue?style=plastic)
```

### 社交风格

```markdown
![社交](https://img.shields.io/badge/样式-社交-blue?style=social)
```

## 实用徽章组合

### 开发者信息

```markdown
![作者](https://img.shields.io/badge/作者-YourName-blue)
![邮箱](https://img.shields.io/badge/邮箱-your%40email.com-green)
```

### 项目统计

```markdown
![提交数](https://img.shields.io/github/commit-activity/m/你的用户名/你的仓库名)
![贡献者](https://img.shields.io/github/contributors/你的用户名/你的仓库名)
![Issues](https://img.shields.io/github/issues/你的用户名/你的仓库名)
![PR](https://img.shields.io/github/issues-pr/你的用户名/你的仓库名)
```

### 依赖状态

```markdown
![依赖](https://img.shields.io/david/你的用户名/你的仓库名)
![开发依赖](https://img.shields.io/david/dev/你的用户名/你的仓库名)
```

## 徽章最佳实践

1. **适度使用** - 不要添加太多徽章,保持简洁
2. **相关性** - 只显示对用户有用的信息
3. **更新** - 确保徽章链接和信息是最新的
4. **对齐** - 使用表格或换行保持整洁
5. **分组** - 将相关徽章放在一起

## 示例布局

### 横向排列

```markdown
![Badge1](url1) ![Badge2](url2) ![Badge3](url3)
```

### 分组排列

```markdown
**构建状态**  
![CI](url1) ![Deploy](url2)

**技术栈**  
![React](url3) ![TypeScript](url4) ![Vite](url5)

**项目统计**  
![Stars](url6) ![Commits](url7)
```

## 相关资源

- [Shields.io](https://shields.io) - 徽章生成器
- [Simple Icons](https://simpleicons.org) - 品牌图标库
- [GitHub徽章指南](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [徽章风格指南](https://github.com/badges/shields/blob/master/spec/SPECIFICATION.md)

