# GitHub Actions 快速设置指南

按照以下步骤配置GitHub Actions自动部署功能。

## 📋 前置要求

- [x] 已有GitHub账号和仓库
- [x] 已有Vercel账号和项目
- [x] 已有Supabase项目

## 🚀 设置步骤

### 步骤 1: 获取Vercel配置信息

#### 方法一: 使用Vercel CLI (推荐)

```bash
# 1. 全局安装Vercel CLI
npm install -g vercel

# 2. 登录Vercel
vercel login

# 3. 在项目目录中链接项目
cd /Users/evanxu/Downloads/project
vercel link

# 4. 查看配置信息
cat .vercel/project.json
```

你会看到类似这样的内容:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

- `orgId` 就是 `VERCEL_ORG_ID`
- `projectId` 就是 `VERCEL_PROJECT_ID`

#### 方法二: 从Vercel Dashboard获取

1. 访问 https://vercel.com/dashboard
2. 选择你的项目
3. 进入 Settings → General
4. 在页面中找到 Project ID
5. Organization ID 可以从URL中看到: `https://vercel.com/[org-id]/[project-name]`

### 步骤 2: 创建Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 点击 **"Create Token"** 按钮
3. 设置Token名称: `GitHub Actions Deploy`
4. 选择Scope: 
   - 如果是个人项目,选择"Full Account"
   - 如果是团队项目,选择对应的团队
5. 设置过期时间(建议选择"No Expiration")
6. 点击 **"Create"** 
7. **立即复制Token** (只会显示一次!)

### 步骤 3: 获取Supabase配置

这些信息可能已经在你的 `.env` 文件中:

1. 访问 https://supabase.com/dashboard
2. 选择你的项目
3. 进入 Settings → API
4. 复制:
   - Project URL → 这是 `VITE_SUPABASE_URL`
   - anon/public key → 这是 `VITE_SUPABASE_ANON_KEY`

或者直接从项目的 `.env` 文件中查看(不要提交到Git!)

### 步骤 4: 配置GitHub Secrets

1. 访问你的GitHub仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **"New repository secret"** 按钮
4. 依次添加以下Secrets:

| Secret名称 | 值 | 说明 |
|-----------|-----|------|
| `VERCEL_TOKEN` | 从步骤2获取 | Vercel访问令牌 |
| `VERCEL_ORG_ID` | 从步骤1获取 | Vercel组织ID (以team_开头) |
| `VERCEL_PROJECT_ID` | 从步骤1获取 | Vercel项目ID (以prj_开头) |
| `VITE_SUPABASE_URL` | 从步骤3获取 | Supabase项目URL |
| `VITE_SUPABASE_ANON_KEY` | 从步骤3获取 | Supabase匿名密钥 |

### 步骤 5: 验证配置

推送代码测试自动部署:

```bash
# 1. 提交GitHub Actions配置
git add .github/
git commit -m "ci: 添加GitHub Actions自动部署配置"

# 2. 推送到main分支
git push origin main

# 3. 在GitHub查看Actions运行情况
# 访问: https://github.com/你的用户名/你的仓库/actions
```

## ✅ 配置检查清单

完成以下检查,确保配置正确:

- [ ] ✅ Vercel Token已创建并添加到GitHub Secrets
- [ ] ✅ VERCEL_ORG_ID已添加到GitHub Secrets
- [ ] ✅ VERCEL_PROJECT_ID已添加到GitHub Secrets  
- [ ] ✅ VITE_SUPABASE_URL已添加到GitHub Secrets
- [ ] ✅ VITE_SUPABASE_ANON_KEY已添加到GitHub Secrets
- [ ] ✅ `.github/workflows/` 目录已提交到仓库
- [ ] ✅ 推送代码后GitHub Actions成功运行
- [ ] ✅ 在Vercel看到新的部署记录

## 🔍 故障排查

### 问题 1: "VERCEL_TOKEN" not found

**原因:** GitHub Secrets中未配置VERCEL_TOKEN

**解决:** 返回步骤2创建Token,并在步骤4中添加到GitHub Secrets

### 问题 2: 构建失败 - 环境变量未定义

**原因:** Supabase环境变量未配置

**解决:** 确保 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已添加到GitHub Secrets

### 问题 3: Vercel部署失败 - Project not found

**原因:** VERCEL_ORG_ID 或 VERCEL_PROJECT_ID 配置错误

**解决:** 
1. 检查 `.vercel/project.json` 文件
2. 确认ID格式正确(orgId以team_开头,projectId以prj_开头)
3. 重新运行 `vercel link` 命令

### 问题 4: Actions一直不触发

**原因:** 可能是GitHub Actions未启用

**解决:**
1. 访问仓库的 Settings → Actions → General
2. 确保 "Actions permissions" 设置为 "Allow all actions and reusable workflows"
3. 确保推送的分支是main分支

## 📚 常用命令

```bash
# 查看当前Vercel项目信息
vercel ls

# 查看环境变量
vercel env ls

# 手动触发部署
vercel --prod

# 查看部署日志
vercel logs

# 取消链接项目(重新配置时使用)
rm -rf .vercel
vercel link
```

## 🎯 下一步

配置完成后,你可以:

1. **创建开发分支**
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

2. **创建Pull Request测试预览部署**
   ```bash
   git checkout -b feature/test-pr
   git push origin feature/test-pr
   # 在GitHub上创建PR,查看自动生成的预览部署链接
   ```

3. **设置分支保护规则**
   - 进入 Settings → Branches
   - 添加 main 分支保护规则
   - 要求PR通过CI检查才能合并

## 💡 最佳实践

1. **保护敏感信息**
   - 永远不要将Token提交到代码仓库
   - 使用 `.env` 文件管理本地环境变量
   - 确保 `.env` 在 `.gitignore` 中

2. **定期更新Token**
   - 定期轮换Vercel Token
   - 记录Token的创建时间和用途

3. **监控部署**
   - 订阅GitHub Actions通知
   - 在Vercel Dashboard监控部署状态
   - 设置错误告警

4. **团队协作**
   - 文档化部署流程
   - 确保团队成员了解CI/CD工作流
   - 定期审查和优化构建时间

## 📞 需要帮助?

如果遇到问题:

1. 查看 [GitHub Actions运行日志](../../actions)
2. 查看 [Vercel部署日志](https://vercel.com/dashboard)
3. 阅读 [故障排查文档](./README.md#故障排查)
4. 在项目Issues中提问

---

**配置完成后,记得删除本地的 `.vercel` 文件夹,避免提交到Git:**

```bash
echo ".vercel" >> .gitignore
```

