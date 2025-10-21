# 🔧 修复 "Database error querying schema" 错误

## 🔴 错误信息

```
AuthApiError: Database error querying schema
```

## 🎯 问题原因

这个错误是由 **Row Level Security (RLS)** 策略引起的。Supabase Auth 尝试查询 `employees` 或 `students` 表时,RLS 策略阻止了访问。

## ✅ 快速解决方案 (推荐先尝试)

### 步骤 1: 在 Supabase Dashboard 执行 SQL

1. 访问 https://supabase.com/dashboard
2. 选择你的项目
3. 点击左侧 **SQL Editor**
4. 复制以下 SQL 并运行:

```sql
-- 临时禁用 RLS 以测试登录
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
```

5. 点击 **Run** 或按 `Ctrl/Cmd + Enter`

### 步骤 2: 测试登录

刷新你的浏览器并重新测试登录。

---

## 🔒 生产环境解决方案

如果你想保持 RLS 启用(更安全),使用以下策略:

### 在 SQL Editor 运行:

```sql
-- 1. 启用 RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 2. 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow anon select" ON employees;
DROP POLICY IF EXISTS "Allow anon select" ON students;
DROP POLICY IF EXISTS "Enable read for anon during auth" ON employees;
DROP POLICY IF EXISTS "Enable read for anon during auth" ON students;

-- 3. 为 employees 表添加策略
CREATE POLICY "Enable read access for authentication" ON employees
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view own record" ON employees
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own record" ON employees
  FOR UPDATE
  USING (auth.uid() = auth_id);

-- 4. 为 students 表添加策略
CREATE POLICY "Enable read access for authentication" ON students
  FOR SELECT
  USING (true);

CREATE POLICY "Students can view own record" ON students
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Students can update own record" ON students
  FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Enable insert for new students" ON students
  FOR INSERT
  WITH CHECK (auth.uid() = auth_id);
```

---

## 🔍 验证配置

运行以下 SQL 检查 RLS 状态:

```sql
-- 查看 RLS 状态
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename IN ('employees', 'students')
    AND schemaname = 'public';

-- 查看所有策略
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename IN ('employees', 'students');
```

预期结果:
- 如果 RLS 禁用: `rowsecurity = false`
- 如果 RLS 启用: 应该看到相应的策略

---

## 🧪 测试步骤

1. **执行 SQL** (选择快速方案或生产方案)
2. **清除浏览器缓存** 或使用无痕模式
3. **重启开发服务器**
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```
4. **测试登录**
   - 访问 http://localhost:5173/login
   - 选择"管理员"
   - 使用邮箱: `evanxu@studylandsedu.com`
   - 输入密码

---

## 📊 常见问题

### Q1: 执行 SQL 后还是报错?

**答:** 尝试以下步骤:
1. 清除浏览器 localStorage:
   ```javascript
   // 在浏览器控制台运行
   localStorage.clear();
   location.reload();
   ```
2. 重启开发服务器
3. 检查 Supabase Dashboard → Authentication → Users 中确实有用户

### Q2: 忘记了用户密码?

**答:** 在 Supabase Dashboard:
1. Authentication → Users
2. 点击用户
3. 点击 "Reset Password"
4. 或直接点击 "..." → "Change Password"

### Q3: 如何查看详细错误?

**答:** 在浏览器控制台(F12)查看完整的错误堆栈。

### Q4: 为什么会有这个问题?

**答:** Supabase 默认启用了 RLS,这是一个安全特性。但如果没有配置正确的策略,会阻止所有访问。我们的认证流程需要在用户登录前查询数据库,所以需要允许这种查询。

---

## 🎯 推荐配置

### 开发环境
- ✅ 禁用 RLS (快速方案)
- 优点: 简单快速
- 缺点: 不够安全

### 生产环境
- ✅ 启用 RLS + 正确的策略
- 优点: 安全
- 缺点: 配置稍复杂

---

## 🔄 如果需要重置

完全重置 RLS 配置:

```sql
-- 删除所有策略
DROP POLICY IF EXISTS "Enable read access for authentication" ON employees;
DROP POLICY IF EXISTS "Users can view own record" ON employees;
DROP POLICY IF EXISTS "Users can update own record" ON employees;
DROP POLICY IF EXISTS "Enable read access for authentication" ON students;
DROP POLICY IF EXISTS "Students can view own record" ON students;
DROP POLICY IF EXISTS "Students can update own record" ON students;
DROP POLICY IF EXISTS "Enable insert for new students" ON students;

-- 禁用 RLS
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
```

---

## ✅ 成功标志

登录成功后你应该看到:
- ✅ 浏览器控制台显示: `[LoginPage] 登录成功`
- ✅ 页面跳转到 `/admin/dashboard`
- ✅ 没有错误提示

---

## 📞 还有问题?

如果以上方法都不行:

1. 检查浏览器控制台的完整错误信息
2. 运行诊断脚本:
   ```bash
   python3 diagnose_auth_error.py
   ```
3. 查看 Supabase Dashboard → Logs 中的错误日志

---

**修复时间: 约 2-5 分钟**  
**难度: 简单 - 只需复制粘贴 SQL**

