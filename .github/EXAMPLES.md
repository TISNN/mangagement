# GitHub Actions 使用示例

本文档提供了实际使用GitHub Actions自动部署的各种场景示例。

## 📝 基本工作流

### 场景 1: 开发新功能并部署

```bash
# 1. 从main分支创建新的功能分支
git checkout main
git pull origin main
git checkout -b feature/user-profile

# 2. 开发功能
# ... 编辑代码 ...
npm run dev  # 本地测试

# 3. 提交代码
git add .
git commit -m "feat: 添加用户个人资料页面"

# 4. 推送到远程仓库
git push origin feature/user-profile

# 5. 在GitHub上创建Pull Request
# → GitHub Actions 会自动:
#    - 运行代码检查 (lint)
#    - 构建项目
#    - 创建预览部署
#    - 在PR中评论预览链接

# 6. 审查预览部署
# 点击PR中的预览链接查看效果

# 7. 合并到main分支
# → GitHub Actions 会自动:
#    - 运行完整的CI流程
#    - 部署到生产环境
#    - 在commit下评论生产链接
```

**预期结果:**
- ✅ PR中出现预览部署链接
- ✅ 合并后自动部署到生产环境
- ✅ 可以在Actions标签查看运行状态

---

### 场景 2: 紧急修复生产问题

```bash
# 1. 创建hotfix分支
git checkout main
git pull
git checkout -b hotfix/login-bug

# 2. 快速修复
# ... 修复代码 ...

# 3. 提交并推送
git add .
git commit -m "fix: 修复登录页面错误"

# 4. 创建PR并快速审查
git push origin hotfix/login-bug
# 在GitHub创建PR

# 5. 审查通过后立即合并
# → 自动触发生产部署

# 6. 监控部署状态
gh run watch

# 7. 验证修复
# 访问生产环境URL验证问题已解决
```

**预期结果:**
- ✅ 5-10分钟内完成部署
- ✅ 问题在生产环境得到修复
- ✅ 有完整的部署记录

---

### 场景 3: 多人协作开发

**开发者A:**
```bash
# 开发功能A
git checkout -b feature/add-export
# ... 开发 ...
git push origin feature/add-export
# 创建PR-1
```

**开发者B:**
```bash
# 同时开发功能B
git checkout -b feature/add-filter
# ... 开发 ...
git push origin feature/add-filter
# 创建PR-2
```

**结果:**
- 每个PR都有独立的预览部署
- 可以并行测试不同功能
- 互不干扰

**项目负责人:**
```bash
# 审查PR-1
# 访问PR-1的预览链接测试

# 合并PR-1
# → 自动部署到生产环境

# 审查PR-2
# 访问PR-2的预览链接测试
# (基于最新的main分支,包含PR-1的更改)

# 合并PR-2
# → 自动部署到生产环境
```

---

## 🎯 高级场景

### 场景 4: 基于环境的部署

```bash
# 开发环境分支
git checkout develop
git pull
# ... 开发和测试 ...
git push origin develop
# → 部署到开发环境

# 测试通过后合并到main
git checkout main
git merge develop
git push origin main
# → 部署到生产环境
```

**配置方法:**

修改 `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main      # 生产环境
      - develop   # 开发环境
```

---

### 场景 5: 定时部署

自动在每天凌晨2点重新部署(清除缓存):

在 `.github/workflows/deploy.yml` 添加:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # 每天UTC 2:00
  push:
    branches:
      - main
```

---

### 场景 6: 手动触发部署

添加手动触发按钮:

```yaml
on:
  workflow_dispatch:  # 添加这一行
  push:
    branches:
      - main
```

使用方法:
```bash
# 通过GitHub CLI
gh workflow run deploy.yml

# 或在GitHub网页上
# Actions → 选择工作流 → Run workflow
```

---

## 🔍 调试场景

### 场景 7: 构建失败排查

```bash
# 1. 推送代码后构建失败
git push origin main
# ❌ GitHub Actions 显示失败

# 2. 查看详细日志
gh run list
gh run view <run-id>

# 3. 本地复现问题
npm run build
# 发现错误: TypeScript类型错误

# 4. 修复并重新推送
# ... 修复代码 ...
git add .
git commit -m "fix: 修复类型错误"
git push origin main
# ✅ 构建成功

# 5. 或者重新运行失败的工作流
gh run rerun <run-id>
```

---

### 场景 8: 部署成功但应用报错

```bash
# 1. 部署成功但应用500错误
# ✅ GitHub Actions 显示成功
# ❌ 访问应用时报错

# 2. 查看Vercel部署日志
vercel logs <deployment-url>

# 3. 检查环境变量
# 访问 Vercel Dashboard → Settings → Environment Variables
# 发现缺少 VITE_SUPABASE_ANON_KEY

# 4. 添加缺失的环境变量
vercel env add VITE_SUPABASE_ANON_KEY

# 5. 重新部署
git commit --allow-empty -m "chore: 触发重新部署"
git push origin main
```

---

## 📊 监控和通知

### 场景 9: 设置Slack通知

在 `.github/workflows/deploy.yml` 添加:

```yaml
jobs:
  deploy-production:
    # ... 其他步骤 ...
    
    - name: 通知Slack
      if: always()
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        text: '部署状态: ${{ job.status }}'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

配置:
```bash
# 在GitHub Secrets中添加
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/..."
```

---

### 场景 10: 邮件通知

```yaml
- name: 发送邮件通知
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: '⚠️ 部署失败: ${{ github.repository }}'
    body: '部署失败,请检查GitHub Actions日志'
    to: team@example.com
```

---

## 🧪 测试场景

### 场景 11: 添加自动化测试

修改 `.github/workflows/ci.yml`:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: 安装依赖
        run: npm ci
      
      - name: 运行单元测试
        run: npm test
      
      - name: 运行E2E测试
        run: npm run test:e2e
      
      - name: 生成测试报告
        uses: dorny/test-reporter@v1
        if: always()
        with:
          name: Test Results
          path: 'test-results/*.xml'
          reporter: jest-junit
```

---

## 🎨 自定义场景

### 场景 12: 构建优化 - 使用缓存

加速构建时间:

```yaml
- name: 缓存依赖
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

**效果:**
- 首次构建: 3-5分钟
- 使用缓存后: 1-2分钟

---

### 场景 13: 多环境部署

部署到不同环境:

```yaml
jobs:
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    # ... 部署到staging环境
    
  deploy-production:
    if: github.ref == 'refs/heads/main'
    # ... 部署到production环境
```

---

## 📈 性能优化场景

### 场景 14: 并行构建

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [...]
  
  test:
    runs-on: ubuntu-latest
    steps: [...]
  
  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps: [...]
```

**效果:**
- Lint和Test并行运行
- Build等待两者完成后执行
- 总时间减少约30-50%

---

## 💡 实用技巧

### 技巧 1: 跳过CI

某些提交不需要触发CI:

```bash
git commit -m "docs: 更新README [skip ci]"
git push origin main
# 不会触发GitHub Actions
```

### 技巧 2: 只在特定文件变更时构建

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - 'vite.config.ts'
```

### 技巧 3: 使用环境

```yaml
jobs:
  deploy:
    environment: production
    steps: [...]
```

在GitHub设置中配置环境保护规则。

---

## 🎯 最佳实践总结

1. **小而频繁的提交** - 更容易追踪问题
2. **有意义的commit消息** - 使用约定式提交
3. **本地先测试** - 避免在CI中发现简单错误
4. **使用PR预览** - 合并前充分测试
5. **监控部署** - 关注Actions通知
6. **定期审查工作流** - 优化构建时间

---

## 📚 参考命令

```bash
# 查看Actions运行状态
gh run list
gh run view <run-id>
gh run watch  # 实时监控

# 手动触发工作流
gh workflow run deploy.yml

# 重新运行失败的任务
gh run rerun <run-id>

# 查看Vercel部署
vercel ls
vercel logs <url>

# Git操作
git checkout -b feature/name
git commit -m "type: description"
git push origin branch-name
```

---

**提示:** 这些示例可以根据你的实际需求进行调整和组合使用。

