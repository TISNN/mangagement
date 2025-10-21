# 环境变量配置指南

## 本地开发环境

在项目根目录创建 `.env` 文件,添加以下环境变量:

```bash
# Supabase配置
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 获取Supabase配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **API**
4. 复制以下信息:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## GitHub Actions环境

在GitHub仓库中配置Secrets,详细步骤请参考 [设置指南](./SETUP_GUIDE.md)

## Vercel部署环境

### 方法一: 通过Vercel Dashboard配置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. 选择应用环境: Production, Preview, Development

### 方法二: 通过Vercel CLI配置

```bash
# 添加生产环境变量
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# 添加预览环境变量
vercel env add VITE_SUPABASE_URL preview
vercel env add VITE_SUPABASE_ANON_KEY preview

# 查看所有环境变量
vercel env ls
```

## 环境变量说明

| 变量名 | 必需 | 说明 | 示例 |
|--------|------|------|------|
| `VITE_SUPABASE_URL` | ✅ 是 | Supabase项目URL | https://xxxxx.supabase.co |
| `VITE_SUPABASE_ANON_KEY` | ✅ 是 | Supabase公开匿名密钥 | eyJhbGc... |

## 安全注意事项

### ⚠️ 不要做:

- ❌ 不要将 `.env` 文件提交到Git仓库
- ❌ 不要在代码中硬编码敏感信息
- ❌ 不要在公开的Issue或PR中暴露密钥
- ❌ 不要将服务密钥(service_role key)暴露到前端

### ✅ 应该做:

- ✅ 使用 `.env` 文件管理本地环境变量
- ✅ 确保 `.env` 在 `.gitignore` 中
- ✅ 使用GitHub Secrets管理CI/CD环境变量
- ✅ 定期轮换密钥
- ✅ 只在前端使用 anon/public key

## 验证配置

### 本地开发验证

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 检查控制台是否有连接错误
# 如果能正常访问 http://localhost:5173 且无错误,说明配置正确
```

### GitHub Actions验证

```bash
# 推送代码触发Actions
git add .
git commit -m "test: 验证GitHub Actions配置"
git push origin main

# 访问 https://github.com/你的用户名/你的仓库/actions
# 查看工作流是否成功运行
```

### Vercel部署验证

访问你的Vercel部署URL,打开浏览器开发者工具:

1. 检查Network标签,查看对Supabase的API请求
2. 如果看到401或403错误,说明密钥配置有问题
3. 如果能正常加载数据,说明配置正确

## 常见问题

### Q: 为什么环境变量名要以 VITE_ 开头?

A: Vite只会将以 `VITE_` 开头的环境变量暴露给客户端代码。这是一个安全特性,防止意外暴露敏感的服务器端环境变量。

### Q: 本地开发时环境变量不生效?

A: 
1. 确保 `.env` 文件在项目根目录
2. 确保环境变量名以 `VITE_` 开头
3. 修改 `.env` 后需要重启开发服务器
4. 检查是否有语法错误(等号两边不要有空格)

### Q: GitHub Actions构建失败,提示环境变量未定义?

A:
1. 检查GitHub Secrets是否正确配置
2. 变量名要完全匹配(包括大小写)
3. 确保工作流文件中正确引用了这些Secrets

### Q: Vercel部署成功但应用报错?

A:
1. 检查Vercel的Environment Variables配置
2. 确保选择了正确的环境(Production/Preview)
3. 查看Vercel的Deployment Logs了解详细错误
4. 尝试重新部署: `vercel --prod --force`

## 环境变量最佳实践

1. **分离环境** - 为开发、预览、生产使用不同的Supabase项目
2. **最小权限** - 前端只使用anon key,后端使用service_role key
3. **定期审查** - 定期检查和更新密钥
4. **文档化** - 记录所有环境变量的用途和获取方式
5. **自动化** - 使用脚本或工具管理多环境配置

## 多环境管理

如果需要管理多个环境(开发、测试、生产):

```bash
# .env.development
VITE_SUPABASE_URL=https://dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=dev-anon-key

# .env.production  
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-anon-key
```

Vite会根据运行模式自动加载对应的文件:
- `npm run dev` → 加载 `.env.development`
- `npm run build` → 加载 `.env.production`

## 相关资源

- [Vite环境变量文档](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase API密钥说明](https://supabase.com/docs/guides/api#api-keys)
- [GitHub Actions Secrets文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Vercel环境变量文档](https://vercel.com/docs/concepts/projects/environment-variables)

