# GitHub Actions 工作流配置说明

本项目使用GitHub Actions实现自动化构建、测试和部署。

## 工作流说明

### 1. deploy.yml - 自动部署工作流

这个工作流负责将代码自动部署到Vercel平台。

**触发条件:**
- 推送代码到 `main` 分支 → 部署到生产环境
- 创建Pull Request → 部署预览环境

**工作流程:**
1. **构建和测试** - 检查代码质量,运行构建
2. **生产部署** - 推送到main分支时,自动部署到Vercel生产环境
3. **预览部署** - PR时创建预览部署,方便测试

### 2. ci.yml - 持续集成工作流

这个工作流用于代码质量检查和构建验证。

**触发条件:**
- 推送代码到 `main` 或 `develop` 分支
- 创建Pull Request

**工作流程:**
1. 代码检查(Lint)
2. 项目构建
3. 安全审计

## 配置GitHub Secrets

要使工作流正常运行,需要在GitHub仓库中配置以下Secrets:

### 必需的Secrets

1. **Vercel相关** (用于自动部署)
   - `VERCEL_TOKEN` - Vercel访问令牌
   - `VERCEL_ORG_ID` - Vercel组织ID
   - `VERCEL_PROJECT_ID` - Vercel项目ID

2. **环境变量** (用于构建)
   - `VITE_SUPABASE_URL` - Supabase项目URL
   - `VITE_SUPABASE_ANON_KEY` - Supabase匿名密钥

### 如何获取Vercel配置信息

#### 1. 获取 VERCEL_TOKEN

1. 访问 [Vercel Dashboard](https://vercel.com/account/tokens)
2. 点击 "Create Token" 创建新令牌
3. 给令牌命名(如 "GitHub Actions")
4. 选择作用域(建议选择特定项目)
5. 复制生成的令牌(只会显示一次)

#### 2. 获取 VERCEL_ORG_ID 和 VERCEL_PROJECT_ID

方法一: 通过Vercel CLI
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录运行
vercel link

# 查看 .vercel/project.json 文件
cat .vercel/project.json
```

方法二: 从项目设置获取
1. 访问你的Vercel项目设置页面
2. 在URL中可以看到组织ID和项目ID
3. 或者在项目设置 → General 中查看

### 如何配置GitHub Secrets

1. 进入你的GitHub仓库
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. 依次添加上述所有Secrets

## 使用方法

### 自动部署到生产环境

```bash
# 1. 提交代码
git add .
git commit -m "feat: 添加新功能"

# 2. 推送到main分支
git push origin main

# 3. GitHub Actions会自动触发部署
# 可以在 Actions 标签页查看部署进度
```

### Pull Request预览部署

```bash
# 1. 创建新分支
git checkout -b feature/new-feature

# 2. 提交代码
git add .
git commit -m "feat: 新功能"

# 3. 推送分支
git push origin feature/new-feature

# 4. 在GitHub上创建Pull Request
# GitHub Actions会自动创建预览部署
# 预览链接会以评论形式出现在PR中
```

## 工作流状态徽章

你可以在README中添加工作流状态徽章:

```markdown
![部署状态](https://github.com/你的用户名/你的仓库名/workflows/部署到Vercel/badge.svg)
![CI状态](https://github.com/你的用户名/你的仓库名/workflows/持续集成/badge.svg)
```

## 故障排查

### 构建失败

**问题:** 构建时提示找不到环境变量
**解决:** 确保在GitHub Secrets中配置了 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`

### 部署失败

**问题:** Vercel部署失败
**解决方案:**
1. 检查 `VERCEL_TOKEN` 是否有效
2. 确认 `VERCEL_ORG_ID` 和 `VERCEL_PROJECT_ID` 配置正确
3. 查看Actions日志中的详细错误信息

### 代码检查失败

**问题:** Lint检查未通过
**解决:** 在本地运行 `npm run lint` 修复代码问题后再提交

## 自定义配置

### 修改触发分支

编辑 `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - develop  # 添加其他分支
```

### 添加通知

可以添加Slack、Discord等通知集成,在部署完成后发送通知。

### 添加测试步骤

如果项目有测试,可以在构建前添加测试步骤:

```yaml
- name: 运行测试
  run: npm test
```

## 最佳实践

1. **保护主分支** - 在GitHub设置中启用分支保护,要求PR通过CI检查才能合并
2. **代码审查** - 每个PR至少需要一人审查
3. **环境变量管理** - 敏感信息必须使用Secrets,不要硬编码
4. **定期更新依赖** - 使用Dependabot自动检查依赖更新
5. **监控构建时间** - 优化构建流程,减少等待时间

## 相关资源

- [GitHub Actions文档](https://docs.github.com/cn/actions)
- [Vercel部署文档](https://vercel.com/docs/deployments/overview)
- [Vercel CLI文档](https://vercel.com/docs/cli)

## 支持

如有问题,请查看:
1. GitHub Actions运行日志
2. Vercel部署日志
3. 项目README中的常见问题解答

