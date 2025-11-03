# Supabase MCP 配置指南

## ✅ 数据库连接测试结果

通过测试脚本验证，你的 Supabase 数据库连接**完全正常**：

### 📊 数据库统计
- **学生表**: 34 条记录 ✅
- **任务表**: 31 条记录 ✅  
- **员工表**: 4 条记录 ✅
- **连接状态**: 正常 ✅
- **API访问**: 正常 ✅

### 🔗 连接信息
- **Supabase URL**: `https://swyajeiqqewyckzbfkid.supabase.co`
- **访问模式**: 匿名访问（使用 ANON_KEY）

---

## 🚀 如何在 Cursor 中配置 Supabase MCP

### 方法一：通过 Cursor 设置（推荐）

1. **打开 Cursor 设置**
   - macOS: `Cmd + ,`
   - Windows/Linux: `Ctrl + ,`

2. **搜索 "MCP"**
   - 在设置搜索框中输入 "MCP"
   - 找到 "Model Context Protocol" 相关设置

3. **添加 Supabase MCP 服务器**
   ```json
   {
     "mcpServers": {
       "supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@supabase/mcp-server",
           "--project-url",
           "https://swyajeiqqewyckzbfkid.supabase.co",
           "--anon-key",
           "${env:VITE_SUPABASE_ANON_KEY}"
         ]
       }
     }
   }
   ```

### 方法二：配置 Cursor 配置文件

1. **找到配置文件位置**
   - macOS: `~/Library/Application Support/Cursor/User/settings.json`
   - Windows: `%APPDATA%\Cursor\User\settings.json`
   - Linux: `~/.config/Cursor/User/settings.json`

2. **添加 MCP 配置**
   在 `settings.json` 中添加上述配置

3. **重启 Cursor**

---

## 🔧 安装 Supabase MCP Server

在项目目录运行：

```bash
npm install -g @supabase/mcp-server
```

或使用 npx（推荐，无需全局安装）：

```bash
npx @supabase/mcp-server --help
```

---

## 🎯 MCP 功能测试

配置完成后，你可以在 Cursor 中：

### 1. 数据库查询
```
# 直接用自然语言
请查询所有活跃的学生
```

### 2. 表结构查看
```
显示students表的结构
```

### 3. 数据修改
```
将学生ID为25的学生状态改为活跃
```

### 4. 数据分析
```
统计每个状态的任务数量
```

---

## ⚠️ 安全建议

由于 MCP 协议可能存在安全漏洞，建议：

### 1. 使用只读模式
创建一个只读的 API Key：

```sql
-- 在 Supabase SQL Editor 中创建只读角色
CREATE ROLE readonly;
GRANT CONNECT ON DATABASE postgres TO readonly;
GRANT USAGE ON SCHEMA public TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;
```

### 2. 限制访问权限
- 只授予必要的表访问权限
- 使用 Row Level Security (RLS)
- 定期审查访问日志

### 3. 环境变量保护
- 永远不要在代码中硬编码 API Key
- 使用环境变量 `${env:VITE_SUPABASE_ANON_KEY}`
- 不要将 `.env` 文件提交到版本控制

---

## 🧪 验证 MCP 是否工作

### 方法 1：在 Cursor 中测试
1. 打开 Cursor
2. 按 `Cmd/Ctrl + L` 打开 AI 聊天
3. 输入：`使用 MCP 查询学生表的前5条记录`
4. 如果 MCP 配置成功，AI 将直接调用 Supabase 查询

### 方法 2：查看 MCP 日志
在 Cursor 中：
- `View` → `Output` → 选择 "MCP"
- 查看是否有 Supabase 连接日志

### 方法 3：使用测试脚本
运行项目中的测试脚本：
```bash
node test_supabase_connection.js
```

---

## 📚 MCP 常用命令示例

### 数据查询
```typescript
// 查询学生
SELECT * FROM students WHERE is_active = true LIMIT 10;

// 查询任务
SELECT * FROM tasks WHERE status = '进行中';

// 关联查询
SELECT 
  t.title,
  s.name as student_name,
  e.name as assignee_name
FROM tasks t
LEFT JOIN students s ON t.related_student_id = s.id
LEFT JOIN employees e ON e.id = ANY(t.assigned_to);
```

### 数据统计
```typescript
// 任务统计
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status;

// 学生统计
SELECT 
  CASE WHEN is_active THEN '活跃' ELSE '非活跃' END as status,
  COUNT(*) as count
FROM students
GROUP BY is_active;
```

---

## 🐛 常见问题

### 1. MCP 无法连接
**解决方案**:
- 检查网络连接
- 确认 Supabase URL 和 API Key 正确
- 重启 Cursor

### 2. 权限不足
**解决方案**:
- 检查 RLS 策略
- 确认 API Key 权限
- 使用 service_role key（开发环境）

### 3. 查询超时
**解决方案**:
- 优化查询语句
- 添加索引
- 限制结果数量

---

## 🔗 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [Cursor MCP 文档](https://docs.cursor.sh/mcp)
- [@supabase/mcp-server NPM](https://www.npmjs.com/package/@supabase/mcp-server)

---

## ✅ 配置检查清单

- [ ] Supabase 连接测试通过
- [ ] 环境变量配置正确
- [ ] Cursor MCP 配置完成
- [ ] @supabase/mcp-server 已安装
- [ ] MCP 连接测试成功
- [ ] 数据库权限设置合理
- [ ] 安全措施已启用

---

**最后更新**: 2025-11-02  
**测试状态**: ✅ 通过  
**数据库连接**: ✅ 正常

