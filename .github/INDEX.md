# GitHub Actions 文档索引

欢迎使用 Infinite.ai 项目的 GitHub Actions 自动化部署系统!

## 📚 文档导航

### 🚀 快速开始

**推荐阅读顺序:**

1. **[快速开始指南](./QUICK_START.md)** ⭐ 开始这里
   - 最快速的配置方法
   - 3步完成设置
   - 适合想立即使用的开发者

2. **[详细设置指南](./SETUP_GUIDE.md)**
   - 完整的配置步骤说明
   - 包含故障排查
   - 适合首次配置的开发者

3. **[环境变量配置](./ENV_SETUP.md)**
   - 环境变量详细说明
   - 多环境管理
   - 安全最佳实践

### 📖 工作流文档

4. **[工作流说明](./workflows/README.md)**
   - 工作流详细介绍
   - 自定义配置
   - 最佳实践

5. **[徽章配置](./BADGES.md)**
   - 如何添加状态徽章
   - 自定义徽章样式
   - 实用徽章组合

## 🗂️ 文件结构

```
.github/
├── INDEX.md                 # 本文件 - 文档索引
├── QUICK_START.md          # 快速开始指南 (推荐先读)
├── SETUP_GUIDE.md          # 详细设置指南
├── ENV_SETUP.md            # 环境变量配置说明
├── BADGES.md               # 状态徽章配置
└── workflows/
    ├── README.md           # 工作流详细说明
    ├── deploy.yml          # 自动部署工作流
    └── ci.yml              # 持续集成工作流
```

## 🎯 根据需求选择文档

### 我想...

#### 快速配置并开始使用
→ 阅读 [QUICK_START.md](./QUICK_START.md)

#### 了解详细的配置步骤
→ 阅读 [SETUP_GUIDE.md](./SETUP_GUIDE.md)

#### 配置环境变量
→ 阅读 [ENV_SETUP.md](./ENV_SETUP.md)

#### 了解工作流如何运作
→ 阅读 [workflows/README.md](./workflows/README.md)

#### 添加状态徽章到README
→ 阅读 [BADGES.md](./BADGES.md)

#### 解决配置问题
→ 阅读 [SETUP_GUIDE.md#故障排查](./SETUP_GUIDE.md#故障排查)

## 📋 配置检查清单

使用这个清单确保配置完整:

### 前置准备
- [ ] 已有GitHub仓库
- [ ] 已有Vercel账号和项目
- [ ] 已有Supabase项目
- [ ] 本地能正常运行项目

### GitHub Secrets配置
- [ ] `VERCEL_TOKEN` 已添加
- [ ] `VERCEL_ORG_ID` 已添加
- [ ] `VERCEL_PROJECT_ID` 已添加
- [ ] `VITE_SUPABASE_URL` 已添加
- [ ] `VITE_SUPABASE_ANON_KEY` 已添加

### 工作流文件
- [ ] `.github/workflows/deploy.yml` 已提交
- [ ] `.github/workflows/ci.yml` 已提交
- [ ] 工作流文件语法正确

### 验证
- [ ] 推送代码后Actions成功运行
- [ ] Vercel显示新的部署
- [ ] 部署的应用可以正常访问
- [ ] PR预览部署正常工作

## 🛠️ 可用工具

### 自动化配置脚本

项目根目录下提供了自动化配置脚本:

```bash
# 运行配置脚本
./setup-github-actions.sh

# 查看帮助
./setup-github-actions.sh --help
```

脚本会自动:
- 获取Vercel配置信息
- 读取Supabase配置
- 配置GitHub Secrets
- 验证配置完整性

### 命令行工具

推荐安装以下CLI工具提升效率:

```bash
# GitHub CLI - 管理GitHub操作
brew install gh

# Vercel CLI - 管理Vercel部署
npm install -g vercel
```

## 📊 工作流程图

```
代码推送到main分支
         ↓
    GitHub Actions触发
         ↓
    ┌─────────────┐
    │ 构建和测试   │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │  代码检查    │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │  项目构建    │
    └──────┬──────┘
           ↓
    ┌─────────────┐
    │ 部署到Vercel │
    └──────┬──────┘
           ↓
    ✅ 部署成功
```

## 🔄 典型工作流

### 开发新功能

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发和测试
npm run dev

# 3. 提交代码
git add .
git commit -m "feat: 添加新功能"

# 4. 推送分支
git push origin feature/new-feature

# 5. 创建Pull Request
# → GitHub Actions自动创建预览部署

# 6. 审查和合并到main
# → GitHub Actions自动部署到生产环境
```

### 紧急修复

```bash
# 1. 从main创建hotfix分支
git checkout main
git pull
git checkout -b hotfix/critical-bug

# 2. 修复问题
# ... 编辑代码 ...

# 3. 快速部署
git add .
git commit -m "fix: 修复紧急问题"
git push origin main

# → 自动触发生产部署
```

## 🆘 获取帮助

### 常见问题

查看各文档中的"故障排查"或"常见问题"章节:
- [SETUP_GUIDE.md - 故障排查](./SETUP_GUIDE.md#故障排查)
- [ENV_SETUP.md - 常见问题](./ENV_SETUP.md#常见问题)
- [workflows/README.md - 故障排查](./workflows/README.md#故障排查)

### 查看运行日志

```bash
# 使用GitHub CLI
gh run list              # 查看最近的运行
gh run view <run-id>     # 查看详细日志

# 或访问网页
# https://github.com/你的用户名/你的仓库/actions
```

### 联系支持

如果遇到无法解决的问题:

1. 查看GitHub Actions运行日志
2. 查看Vercel部署日志
3. 在仓库中创建Issue
4. 参考官方文档:
   - [GitHub Actions文档](https://docs.github.com/actions)
   - [Vercel文档](https://vercel.com/docs)

## 🎓 学习资源

### 官方文档
- [GitHub Actions官方文档](https://docs.github.com/cn/actions)
- [Vercel部署指南](https://vercel.com/docs/deployments/overview)
- [Supabase文档](https://supabase.com/docs)

### 社区资源
- [GitHub Actions示例](https://github.com/actions/starter-workflows)
- [Vercel示例项目](https://vercel.com/templates)
- [CI/CD最佳实践](https://www.gitops.tech/)

### 视频教程
- [GitHub Actions入门](https://www.youtube.com/results?search_query=github+actions+tutorial)
- [Vercel部署教程](https://www.youtube.com/results?search_query=vercel+deployment)

## 📝 更新日志

### 2024-10-20
- ✨ 初始版本
- 📝 创建完整的文档体系
- 🤖 添加自动化配置脚本
- 🔧 配置Vercel自动部署
- ✅ 添加持续集成工作流

## 🚀 下一步计划

- [ ] 添加自动化测试
- [ ] 集成代码质量检查
- [ ] 添加性能监控
- [ ] 配置自动依赖更新
- [ ] 添加部署通知

## 💡 贡献

欢迎改进这些文档和工作流!

如果你发现:
- 文档有误或不清楚的地方
- 工作流可以优化
- 缺少某些说明

请创建Issue或Pull Request。

---

**祝使用愉快!** 🎉

如有问题,请先查阅相关文档,或在项目中创建Issue。

