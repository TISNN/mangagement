# 🚀 GitHub Actions 快速开始

只需3步,即可启用自动部署!

## 准备工作

确保你已经有:
- ✅ GitHub账号和仓库
- ✅ Vercel账号和项目  
- ✅ Supabase项目

## 方法一: 使用自动化脚本 (推荐)

### 1. 安装必要工具

```bash
# 安装Vercel CLI
npm install -g vercel

# 安装GitHub CLI (macOS)
brew install gh

# 登录
vercel login
gh auth login
```

### 2. 运行配置脚本

```bash
cd /Users/evanxu/Downloads/project
./setup-github-actions.sh
```

脚本会自动:
- 🔗 链接Vercel项目并获取配置
- 📝 从.env读取Supabase配置
- 🔐 配置GitHub Secrets
- ✅ 验证配置完整性

### 3. 推送代码测试

```bash
git add .github/
git commit -m "ci: 添加GitHub Actions自动部署"
git push origin main
```

完成! 🎉 访问 `https://github.com/你的用户名/你的仓库/actions` 查看部署状态。

---

## 方法二: 手动配置

### 1. 获取配置信息

**Vercel配置:**

```bash
# 链接项目
vercel link

# 查看配置
cat .vercel/project.json
```

记下 `orgId` (VERCEL_ORG_ID) 和 `projectId` (VERCEL_PROJECT_ID)

创建Token: https://vercel.com/account/tokens

**Supabase配置:**

访问项目 Settings → API 获取:
- Project URL
- anon/public key

### 2. 配置GitHub Secrets

访问: `https://github.com/你的用户名/你的仓库/settings/secrets/actions`

点击 "New repository secret" 添加:

| Secret名称 | 值 |
|-----------|-----|
| VERCEL_TOKEN | 从Vercel获取 |
| VERCEL_ORG_ID | 从.vercel/project.json |
| VERCEL_PROJECT_ID | 从.vercel/project.json |
| VITE_SUPABASE_URL | 从Supabase Dashboard |
| VITE_SUPABASE_ANON_KEY | 从Supabase Dashboard |

### 3. 推送代码

```bash
git add .
git commit -m "ci: 添加GitHub Actions"
git push origin main
```

---

## 验证配置

### ✅ 检查清单

配置完成后,确认:

- [ ] 所有5个Secrets已添加到GitHub
- [ ] `.github/workflows/deploy.yml` 已提交
- [ ] 推送代码后GitHub Actions开始运行
- [ ] Vercel显示新的部署记录

### 🔍 查看运行状态

```bash
# 使用GitHub CLI查看
gh run list

# 或访问网页
# https://github.com/你的用户名/你的仓库/actions
```

---

## 🎯 使用工作流

### 自动部署到生产环境

```bash
# 在main分支上提交任何代码都会触发部署
git checkout main
git add .
git commit -m "feat: 新功能"
git push origin main
```

部署完成后,会在commit下方显示评论,包含部署链接。

### 预览部署 (PR)

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 提交代码
git add .
git commit -m "feat: 添加新功能"
git push origin feature/new-feature

# 3. 在GitHub创建Pull Request
# Actions会自动创建预览部署
# 预览链接会显示在PR评论中
```

---

## 🔧 故障排查

### GitHub Actions失败

**检查步骤:**
1. 访问Actions标签,点击失败的运行
2. 查看详细日志找到错误原因
3. 常见问题:
   - ❌ Secrets未配置或配置错误
   - ❌ Vercel Token过期
   - ❌ 构建错误(检查代码)

### 快速修复

```bash
# 重新运行失败的工作流
gh run rerun <run-id>

# 或在GitHub网页上点击 "Re-run all jobs"
```

### 需要帮助?

查看详细文档:
- [完整设置指南](./SETUP_GUIDE.md)
- [环境变量配置](./ENV_SETUP.md)
- [工作流说明](./workflows/README.md)

---

## 💡 提示

### 测试配置

创建一个测试PR来验证预览部署:

```bash
git checkout -b test/github-actions
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: 测试GitHub Actions"
git push origin test/github-actions

# 在GitHub创建PR,查看是否生成预览部署
```

### 优化构建时间

如果构建太慢,考虑:
1. 使用缓存加速依赖安装
2. 减少不必要的构建步骤
3. 并行运行独立的任务

### 监控和通知

在工作流中添加Slack或邮件通知:

```yaml
- name: 通知部署结果
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📚 下一步

配置完成后,你可以:

1. **设置分支保护** - 要求PR通过CI才能合并
2. **配置代码审查** - 团队协作最佳实践  
3. **添加测试步骤** - 在部署前运行自动化测试
4. **优化工作流** - 根据项目需求调整配置

享受自动化部署带来的便利! 🎉

