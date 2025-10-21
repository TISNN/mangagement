# GitHub Actions 自动部署 - 完整使用说明

## 🎉 已完成的配置

我已经为你的项目配置了完整的 GitHub Actions 自动化部署系统!

### ✅ 已创建的文件

```
project/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml          # 自动部署工作流
│   │   ├── ci.yml              # 持续集成工作流
│   │   └── README.md           # 工作流详细说明
│   ├── QUICK_START.md          # 快速开始指南
│   ├── SETUP_GUIDE.md          # 完整设置指南
│   ├── ENV_SETUP.md            # 环境变量配置
│   ├── EXAMPLES.md             # 使用示例
│   ├── BADGES.md               # 状态徽章配置
│   └── INDEX.md                # 文档索引
├── setup-github-actions.sh     # 自动配置脚本
├── .gitignore                  # 已更新(排除.vercel)
└── README.md                   # 已更新(添加部署说明)
```

### 🚀 功能特性

1. **自动部署**
   - 推送到 main 分支 → 自动部署到 Vercel 生产环境
   - 创建 Pull Request → 自动创建预览部署
   - 部署成功后自动评论部署链接

2. **持续集成**
   - 代码质量检查 (ESLint)
   - 自动构建验证
   - 依赖安全审计

3. **完善文档**
   - 快速开始指南
   - 详细配置步骤
   - 故障排查方案
   - 实用示例

## 📋 下一步操作

### 第一步: 配置 GitHub Secrets

你需要在 GitHub 仓库中配置 5 个 Secrets:

| Secret 名称 | 说明 | 如何获取 |
|------------|------|---------|
| `VERCEL_TOKEN` | Vercel访问令牌 | [创建Token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel组织ID | 运行 `vercel link` 后查看 `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Vercel项目ID | 同上 |
| `VITE_SUPABASE_URL` | Supabase URL | [项目设置](https://supabase.com/dashboard) → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase密钥 | 同上 |

### 第二步: 选择配置方式

#### 方式 A: 使用自动化脚本 (推荐)

```bash
# 1. 安装必要工具
npm install -g vercel
brew install gh  # macOS

# 2. 运行配置脚本
cd /Users/evanxu/Downloads/project
./setup-github-actions.sh

# 脚本会自动:
# - 获取 Vercel 配置
# - 读取 Supabase 配置
# - 配置 GitHub Secrets
```

#### 方式 B: 手动配置

```bash
# 1. 获取 Vercel 配置
vercel link
cat .vercel/project.json

# 2. 在 GitHub 添加 Secrets
# 访问: https://github.com/你的用户名/你的仓库/settings/secrets/actions
# 依次添加上述 5 个 Secrets
```

### 第三步: 提交并推送代码

```bash
# 1. 查看变更
git status

# 2. 添加所有新文件
git add .github/
git add setup-github-actions.sh
git add .gitignore
git add README.md
git add GITHUB_ACTIONS_使用说明.md

# 3. 提交
git commit -m "ci: 添加 GitHub Actions 自动部署配置

- 配置 Vercel 自动部署工作流
- 添加持续集成工作流
- 创建完整的配置文档
- 添加自动化配置脚本"

# 4. 推送到 GitHub
git push origin main

# 5. 查看部署状态
# 访问: https://github.com/你的用户名/你的仓库/actions
```

## 🎯 验证配置

### 检查 GitHub Actions

1. 访问你的 GitHub 仓库
2. 点击 "Actions" 标签
3. 查看是否有工作流正在运行
4. 确认构建和部署都成功(绿色✅)

### 检查 Vercel 部署

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 查看是否有新的部署记录
4. 点击部署链接验证应用正常运行

## 📖 详细文档

如需了解更多信息,请查看以下文档:

### 快速参考

- **[快速开始](.github/QUICK_START.md)** ⭐ 最快的配置方法
- **[文档索引](.github/INDEX.md)** - 所有文档导航

### 详细指南

- **[完整设置指南](.github/SETUP_GUIDE.md)** - 详细配置步骤
- **[环境变量配置](.github/ENV_SETUP.md)** - 环境变量说明
- **[使用示例](.github/EXAMPLES.md)** - 实际使用场景
- **[工作流说明](.github/workflows/README.md)** - 工作流详解

### 附加资源

- **[状态徽章](.github/BADGES.md)** - 添加徽章到README

## 🎬 使用示例

### 日常开发

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发功能
# ... 编辑代码 ...
npm run dev  # 本地测试

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"

# 4. 推送并创建PR
git push origin feature/new-feature
# 在 GitHub 创建 Pull Request

# 5. 查看预览部署
# PR 中会自动显示预览链接

# 6. 合并到 main
# 自动部署到生产环境
```

### 紧急修复

```bash
# 1. 创建 hotfix 分支
git checkout -b hotfix/critical-bug

# 2. 快速修复
# ... 修复代码 ...

# 3. 直接合并到 main
git checkout main
git merge hotfix/critical-bug
git push origin main

# 4. 自动触发生产部署
# 5-10 分钟内完成
```

## 🔧 常见问题

### Q1: GitHub Actions 失败了怎么办?

**答:** 
1. 查看 Actions 日志找到错误原因
2. 常见问题:
   - Secrets 未配置 → 补充配置
   - Vercel Token 过期 → 重新创建
   - 构建错误 → 修复代码后重新推送

### Q2: 如何重新运行失败的工作流?

**答:**
```bash
# 方法 1: 使用 GitHub CLI
gh run rerun <run-id>

# 方法 2: 在 GitHub 网页
# Actions → 选择失败的运行 → 点击 "Re-run all jobs"
```

### Q3: 本地如何测试构建?

**答:**
```bash
npm run build
npm run preview
```

### Q4: 如何查看部署日志?

**答:**
```bash
# Vercel 日志
vercel logs <deployment-url>

# GitHub Actions 日志
gh run view <run-id>
```

## 💡 最佳实践

1. **频繁提交** - 小而频繁的提交更容易追踪问题
2. **使用 PR** - 重要更改通过 PR 审查
3. **测试预览** - 合并前充分测试预览部署
4. **监控部署** - 关注 Actions 和 Vercel 通知
5. **保护分支** - 设置 main 分支保护规则

## 🎉 完成!

现在你的项目已经配置好自动化部署了!

每次推送代码到 main 分支,GitHub Actions 会自动:
1. ✅ 检查代码质量
2. ✅ 构建项目
3. ✅ 部署到 Vercel
4. ✅ 评论部署链接

享受自动化部署带来的便利吧! 🚀

## 📞 需要帮助?

如果遇到问题:

1. 查看 [故障排查](.github/SETUP_GUIDE.md#故障排查)
2. 查看 [常见问题](.github/ENV_SETUP.md#常见问题)
3. 在 GitHub 创建 Issue
4. 查看官方文档:
   - [GitHub Actions](https://docs.github.com/actions)
   - [Vercel](https://vercel.com/docs)

---

**配置人:** AI Assistant  
**配置时间:** 2024-10-20  
**项目:** Infinite.ai - 留学全周期服务平台

祝使用愉快! 🎊

