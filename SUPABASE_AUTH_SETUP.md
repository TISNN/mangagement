# Supabase 认证系统配置指南

## 📋 概述

本文档说明如何在Supabase中配置认证系统,使项目支持真实的用户登录、注册和密码管理功能。

## 🎯 实现的功能

1. ✅ **用户登录** - 使用Supabase Auth的邮箱密码登录
2. ✅ **用户注册** - 新用户注册(仅学生)
3. ✅ **忘记密码** - 发送密码重置邮件
4. ✅ **认证上下文** - 全局认证状态管理
5. ✅ **自动关联** - Auth用户自动关联employees/students表

## 📁 已创建的文件

```
src/
├── services/
│   └── authService.ts          # 认证服务(登录、注册、密码重置)
├── context/
│   └── AuthContext.tsx         # 认证上下文
├── pages/
│   ├── LoginPage.tsx           # 登录页(已更新)
│   ├── RegisterPage.tsx        # 注册页(新建)
│   └── ForgotPasswordPage.tsx  # 忘记密码页(新建)
└── AppRoutes.tsx               # 路由配置(已更新)
```

## 🔧 Supabase 配置步骤

### 步骤 1: 启用 Email Auth

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **Authentication** → **Providers**
4. 确保 **Email** provider 已启用
5. 配置以下选项:
   - ✅ Enable Email provider
   - ✅ Confirm email (建议开启邮箱验证)
   - ✅ Secure email change
   - ✅ Secure password change

### 步骤 2: 配置邮件模板

进入 **Authentication** → **Email Templates**,配置以下模板:

#### 1. Confirm signup (注册确认)
```html
<h2>确认您的注册</h2>
<p>感谢注册 Infinite.ai!</p>
<p>请点击下方链接确认您的邮箱:</p>
<p><a href="{{ .ConfirmationURL }}">确认邮箱</a></p>
```

#### 2. Reset password (密码重置)
```html
<h2>重置密码</h2>
<p>您请求重置密码。</p>
<p>请点击下方链接重置密码:</p>
<p><a href="{{ .ConfirmationURL }}">重置密码</a></p>
<p>如果您没有请求重置密码,请忽略此邮件。</p>
```

### 步骤 3: 更新数据库表结构

确保 `employees` 和 `students` 表有 `auth_id` 字段:

```sql
-- 为 employees 表添加 auth_id 字段(如果还没有)
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id);

-- 为 students 表添加 auth_id 字段(如果还没有)
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id);

-- 添加索引提高查询效率
CREATE INDEX IF NOT EXISTS idx_employees_auth_id ON employees(auth_id);
CREATE INDEX IF NOT EXISTS idx_students_auth_id ON students(auth_id);
```

### 步骤 4: 配置 RLS (Row Level Security) 策略

#### 1. employees 表的 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 允许用户查看自己的员工记录
CREATE POLICY "用户可以查看自己的员工信息" ON employees
  FOR SELECT
  USING (auth.uid() = auth_id);

-- 允许用户更新自己的员工记录
CREATE POLICY "用户可以更新自己的员工信息" ON employees
  FOR UPDATE
  USING (auth.uid() = auth_id);

-- 允许系统在注册时创建记录(需要service_role权限)
CREATE POLICY "允许系统创建员工记录" ON employees
  FOR INSERT
  WITH CHECK (true);
```

#### 2. students 表的 RLS 策略

```sql
-- 启用 RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 允许用户查看自己的学生记录
CREATE POLICY "用户可以查看自己的学生信息" ON students
  FOR SELECT
  USING (auth.uid() = auth_id);

-- 允许用户更新自己的学生记录
CREATE POLICY "用户可以更新自己的学生信息" ON students
  FOR UPDATE
  USING (auth.uid() = auth_id);

-- 允许在注册时创建学生记录
CREATE POLICY "允许创建学生记录" ON students
  FOR INSERT
  WITH CHECK (auth.uid() = auth_id);
```

### 步骤 5: 创建管理员用户

由于管理员不能自助注册,需要手动创建:

#### 方法 A: 通过 Supabase Dashboard

1. 进入 **Authentication** → **Users**
2. 点击 **Add user** → **Create new user**
3. 输入邮箱和密码
4. 创建后,复制 user 的 `id`
5. 在 SQL Editor 中运行:

```sql
-- 创建或更新员工记录,关联到 Auth 用户
INSERT INTO employees (name, email, position, department, is_active, auth_id)
VALUES (
  'Evan Xu',
  'evanxu@studylandsedu.com',
  'CEO',
  'Management',
  true,
  'b07c1c73-2c83-4a1b-bf3f-9a9c069023eb'
)
ON CONFLICT (email) 
DO UPDATE SET auth_id = EXCLUDED.auth_id;
```

#### 方法 B: 使用 SQL 批量创建

```sql
-- 1. 先在 Supabase Auth 中手动创建用户
-- 2. 然后运行以下 SQL 关联员工记录

-- 示例: 为已存在的员工添加 auth_id
UPDATE employees
SET auth_id = (
  SELECT id FROM auth.users WHERE email = employees.email
)
WHERE email IN (
  'evanxu@studylandsedu.com',
  'zoefan@studylandsedu.com',
  'kaynxu@studylandsedu.com',
  'jozhuang@studylandsedu.com'
);
```

### 步骤 6: 配置邮件发送服务

#### 使用 Supabase 内置邮件服务(开发环境)

默认情况下,Supabase 提供内置邮件服务,但有限制:
- 每小时最多 3 封邮件
- 仅用于测试

#### 配置自定义 SMTP(生产环境推荐)

1. 进入 **Project Settings** → **Authentication**
2. 滚动到 **SMTP Settings**
3. 配置你的 SMTP 服务器:
   - **Host**: smtp.gmail.com (Gmail 示例)
   - **Port**: 587
   - **User**: your-email@gmail.com
   - **Password**: your-app-password
   - **Sender email**: noreply@yourdomain.com
   - **Sender name**: Infinite.ai

推荐的邮件服务:
- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)
- [AWS SES](https://aws.amazon.com/ses/)
- [Resend](https://resend.com/)

### 步骤 7: 配置 URL 重定向

1. 进入 **Authentication** → **URL Configuration**
2. 添加允许的重定向 URL:
   ```
   http://localhost:5173/**
   https://yourdomain.com/**
   https://*.vercel.app/**
   ```

## 🧪 测试流程

### 1. 测试管理员登录

```bash
# 1. 确保在 Supabase 中创建了管理员用户
# 2. 确保 employees 表中的记录有正确的 auth_id
# 3. 访问 http://localhost:5173/login
# 4. 选择"管理员"角色
# 5. 输入邮箱和密码
# 6. 应该成功登录并跳转到管理后台
```

### 2. 测试学生注册

```bash
# 1. 访问 http://localhost:5173/register
# 2. 填写姓名、邮箱、密码
# 3. 提交注册
# 4. 检查邮箱,点击确认链接
# 5. 返回登录页面,使用新账号登录
```

### 3. 测试忘记密码

```bash
# 1. 访问 http://localhost:5173/login
# 2. 点击"忘记密码?"
# 3. 输入邮箱
# 4. 检查邮箱,点击重置链接
# 5. 设置新密码
# 6. 使用新密码登录
```

## 📊 数据流程

### 登录流程

```
用户输入邮箱密码
    ↓
authService.signIn()
    ↓
Supabase Auth 验证
    ↓
返回 Auth User
    ↓
查询 employees/students 表
    ↓
通过 auth_id 匹配记录
    ↓
返回完整用户信息
    ↓
保存到 AuthContext
    ↓
跳转到对应页面
```

### 注册流程

```
用户提交注册表单
    ↓
authService.signUp()
    ↓
Supabase Auth 创建用户
    ↓
在 students 表创建记录
    ↓
设置 auth_id 关联
    ↓
发送确认邮件
    ↓
用户点击邮件链接
    ↓
账号激活
    ↓
可以登录
```

## 🔒 安全注意事项

1. **密码强度**
   - 最少 6 个字符
   - 建议包含大小写字母、数字和特殊字符

2. **邮箱验证**
   - 生产环境应启用邮箱验证
   - 防止恶意注册

3. **Rate Limiting**
   - Supabase 自动提供基础的速率限制
   - 考虑添加额外的前端限制

4. **密钥管理**
   - 永远不要在代码中硬编码密钥
   - 使用环境变量
   - 前端只使用 `anon` key,不要使用 `service_role` key

5. **RLS 策略**
   - 确保所有敏感表都启用了 RLS
   - 定期审查策略

## 🚨 常见问题

### Q1: 登录时提示"该邮箱未在员工系统中注册"

**原因:** employees 表中没有对应的记录,或 auth_id 未关联

**解决:**
```sql
-- 检查员工记录
SELECT * FROM employees WHERE email = 'your-email@example.com';

-- 如果记录存在但 auth_id 为空,更新它
UPDATE employees
SET auth_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com')
WHERE email = 'your-email@example.com';
```

### Q2: 注册后收不到确认邮件

**原因:** SMTP 未配置或配置错误

**解决:**
1. 检查 Supabase Dashboard → Authentication → Email Templates
2. 配置自定义 SMTP 服务器
3. 检查垃圾邮件文件夹
4. 开发环境可以在 Dashboard 手动确认用户

### Q3: RLS 策略导致无法查询数据

**原因:** RLS 策略过于严格或配置错误

**解决:**
```sql
-- 临时禁用 RLS 进行测试
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- 测试完成后重新启用
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- 查看现有策略
SELECT * FROM pg_policies WHERE tablename = 'employees';
```

### Q4: 如何批量导入已有用户

**步骤:**
1. 在 Supabase Auth 中手动创建用户(或使用 Admin API)
2. 运行 SQL 关联到 employees/students 表
3. 发送欢迎邮件通知用户

## 📚 相关文档

- [Supabase Auth 文档](https://supabase.com/docs/guides/auth)
- [RLS 策略指南](https://supabase.com/docs/guides/auth/row-level-security)
- [邮件模板定制](https://supabase.com/docs/guides/auth/auth-email-templates)

## ✅ 配置完成检查清单

在开始使用前,确保完成以下配置:

- [ ] ✅ Email Auth Provider 已启用
- [ ] ✅ employees 和 students 表有 auth_id 字段
- [ ] ✅ RLS 策略已配置
- [ ] ✅ 邮件模板已配置
- [ ] ✅ SMTP 服务已配置(生产环境)
- [ ] ✅ 重定向 URL 已配置
- [ ] ✅ 管理员账号已创建并关联
- [ ] ✅ 测试登录注册流程通过

## 🎉 完成!

配置完成后,你的应用就拥有了完整的认证系统!

用户现在可以:
- ✅ 使用邮箱密码登录
- ✅ 注册新账号(学生)
- ✅ 重置忘记的密码
- ✅ 邮箱验证保证安全性

---

**最后更新:** 2024-10-20  
**作者:** AI Assistant  
**项目:** Infinite.ai - 留学全周期服务平台

