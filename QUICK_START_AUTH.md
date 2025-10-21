# 🚀 Supabase 认证快速开始

5分钟内启用真实用户登录!

## ⚡ 快速步骤

### 1. 在 Supabase 中启用 Email Auth (1分钟)

1. 访问 https://supabase.com/dashboard
2. 选择项目
3. **Authentication** → **Providers** → 确保 **Email** 已启用 ✅

### 2. 更新数据库表 (2分钟)

在 Supabase SQL Editor 中运行:

```sql
-- 添加 auth_id 字段
ALTER TABLE employees ADD COLUMN IF NOT EXISTS auth_id UUID;
ALTER TABLE students ADD COLUMN IF NOT EXISTS auth_id UUID;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_employees_auth_id ON employees(auth_id);
CREATE INDEX IF NOT EXISTS idx_students_auth_id ON students(auth_id);
```

### 3. 创建第一个管理员用户 (2分钟)

#### 步骤 A: 在 Supabase Auth 创建用户

1. **Authentication** → **Users** → **Add user**
2. 选择 **Create new user**
3. 输入邮箱: `your-email@example.com`
4. 输入密码: `your-password`
5. 点击 **Create user**
6. **复制用户的 UUID** (在用户列表中点击用户查看)

#### 步骤 B: 关联到 employees 表

在 SQL Editor 运行 (替换 UUID 和信息):

```sql
-- 插入或更新员工记录
INSERT INTO employees (name, email, position, is_active, auth_id)
VALUES (
  'Your Name',           -- 你的名字
  'your-email@example.com',  -- 邮箱 (必须与Auth用户一致)
  'Administrator',       -- 职位
  true,                  -- 激活状态
  'paste-user-uuid-here' -- 粘贴步骤A中复制的UUID
)
ON CONFLICT (email) 
DO UPDATE SET auth_id = EXCLUDED.auth_id;
```

### 4. 测试登录! (30秒)

1. 启动项目: `npm run dev`
2. 访问 http://localhost:5173/login
3. 选择"管理员"角色
4. 输入刚创建的邮箱和密码
5. 点击登录 → 成功! 🎉

## ✅ 验证清单

- [ ] Supabase Email Auth 已启用
- [ ] employees 和 students 表有 auth_id 字段
- [ ] 已创建至少一个管理员用户
- [ ] 管理员用户已关联到 employees 表
- [ ] 能成功登录到系统

## 📖 完整文档

需要更多信息?查看完整指南:

- **[SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md)** - 完整配置指南
- **[SUPABASE_AUTH_实现总结.md](./SUPABASE_AUTH_实现总结.md)** - 实现总结

## 🎯 快速命令

### 批量创建管理员

如果你有多个管理员需要创建:

```sql
-- 1. 先在 Supabase Auth Dashboard 手动创建这些用户
-- 2. 然后运行以下 SQL 自动关联

UPDATE employees
SET auth_id = (
  SELECT id FROM auth.users WHERE email = employees.email
)
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
) AND auth_id IS NULL;
```

### 查看已关联的用户

```sql
SELECT 
  e.name, 
  e.email, 
  e.auth_id,
  au.email as auth_email
FROM employees e
LEFT JOIN auth.users au ON e.auth_id = au.id
WHERE e.is_active = true;
```

## 🚨 遇到问题?

### 登录失败: "该邮箱未在员工系统中注册"

**原因:** employees 表中没有记录或 auth_id 未关联

**解决:**
```sql
-- 检查是否有员工记录
SELECT * FROM employees WHERE email = 'your-email@example.com';

-- 如果有记录但 auth_id 为空,更新它
UPDATE employees
SET auth_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com')
WHERE email = 'your-email@example.com';
```

### 找不到 Auth User 的 UUID?

1. **Authentication** → **Users**
2. 点击用户查看详情
3. UUID 显示在顶部

### 学生注册失败?

确保:
1. Email Auth 已启用
2. students 表有 auth_id 字段
3. 邮箱验证已配置 (或临时关闭验证)

## 💡 提示

### 开发环境

- 可以临时关闭邮箱验证: **Authentication** → **Email** → 取消勾选 "Confirm email"
- 这样注册后无需验证邮箱即可登录

### 生产环境

- ✅ 启用邮箱验证
- ✅ 配置自定义 SMTP
- ✅ 设置强密码策略
- ✅ 启用 RLS 策略

## 🎉 完成!

现在你的系统已经有了真实的用户认证!

- ✅ 管理员可以登录
- ✅ 学生可以注册和登录
- ✅ 支持密码重置
- ✅ 安全的认证流程

---

**需要帮助?** 查看完整文档或在项目中提 Issue

