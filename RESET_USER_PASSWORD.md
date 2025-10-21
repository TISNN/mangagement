# 🔑 重置用户密码 - 最简单方法

## 问题

- Supabase Dashboard 没有直接"设置密码"的UI
- "Send password recovery" 需要配置邮件服务
- 用户已存在但密码未知

## ✅ 最简单的解决方案

### 方法 1: 删除并重新创建用户 (推荐)

#### 步骤:

1. **在 Supabase Dashboard → Authentication → Users**
   
   找到 `evanxu@studylandsedu.com` 用户

2. **点击用户行,滚动到底部 "Danger zone"**
   
   点击 **"Delete user"** 按钮删除该用户

3. **创建新用户**
   
   点击页面右上角 **"Add user"** → **"Create new user"**
   
   填写:
   ```
   Email: evanxu@studylandsedu.com
   Password: Admin123!
   ✅ Auto Confirm User (必须勾选!)
   ```
   
   点击 **"Create user"**

4. **复制新生成的 User ID**
   
   创建后会显示用户详情,复制 User ID (UUID)
   
   例如: `b07c1c73-2c83-4a1b-bf3f-9a9c069023eb`

5. **更新 employees 表**
   
   在 **SQL Editor** 运行:
   ```sql
   UPDATE employees
   SET auth_id = '新的-user-id'  -- 替换为刚才复制的 UUID
   WHERE email = 'evanxu@studylandsedu.com';
   
   -- 验证
   SELECT id, name, email, auth_id
   FROM employees
   WHERE email = 'evanxu@studylandsedu.com';
   ```

6. **测试登录**
   ```bash
   npm run dev
   # 访问 http://localhost:5173/login
   # 邮箱: evanxu@studylandsedu.com
   # 密码: Admin123!
   ```

---

### 方法 2: 使用 Magic Link (如果不想删除用户)

1. **在用户详情页面**
   
   点击 **"Send magic link"** 按钮

2. **这会生成一个特殊的登录链接**
   
   但这需要配置邮件服务...

**实际上方法1更简单!**

---

### 方法 3: 使用 SQL 直接更新密码 (高级)

Supabase 使用 bcrypt 加密密码,我们可以直接设置:

```sql
-- 为 evanxu@studylandsedu.com 设置密码为 Admin123!
UPDATE auth.users
SET 
  encrypted_password = crypt('Admin123!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmation_token = NULL
WHERE email = 'evanxu@studylandsedu.com';
```

在 **SQL Editor** 运行这个命令,密码就会被设置为 `Admin123!`

---

## 🎯 推荐: 使用方法 3 (SQL直接设置)

这是最快的方法!直接运行SQL:

```sql
-- 为所有4位员工设置相同的测试密码: Admin123!
UPDATE auth.users
SET 
  encrypted_password = crypt('Admin123!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmation_token = NULL,
  confirmation_sent_at = NULL
WHERE email IN (
  'evanxu@studylandsedu.com',
  'zoefan@studylandsedu.com',
  'kaynxu@studylandsedu.com',
  'jozhuang@studylandsedu.com'
);

-- 验证更新
SELECT 
  email, 
  email_confirmed_at,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ 密码已设置'
    ELSE '❌ 密码未设置'
  END as password_status
FROM auth.users
WHERE email LIKE '%@studylandsedu.com'
ORDER BY email;
```

运行后,所有4位员工的密码都会被设置为 `Admin123!`

---

## ✅ 快速操作步骤

1. **打开 Supabase Dashboard → SQL Editor**

2. **复制并运行以下SQL:**
   ```sql
   UPDATE auth.users
   SET 
     encrypted_password = crypt('Admin123!', gen_salt('bf')),
     email_confirmed_at = now(),
     confirmation_token = NULL
   WHERE email = 'evanxu@studylandsedu.com';
   ```

3. **点击 Run**

4. **测试登录:**
   - 访问 http://localhost:5173/login
   - 邮箱: evanxu@studylandsedu.com
   - 密码: Admin123!
   - 点击登录 ✅

---

## 🎉 完成!

现在你就可以用 `Admin123!` 登录了!

---

## 💡 关于邮件服务

"Send password recovery" 失败是因为没有配置 SMTP 邮件服务。

如果以后需要配置邮件:

1. **Dashboard → Project Settings → Auth**
2. **配置 SMTP 设置** (需要邮件服务器)
3. **或使用 SendGrid / Resend 等第三方服务**

但对于开发环境,直接用SQL设置密码就够了!

---

**推荐立即执行的命令:**

```sql
-- 一键设置所有员工密码为 Admin123!
UPDATE auth.users
SET 
  encrypted_password = crypt('Admin123!', gen_salt('bf')),
  email_confirmed_at = now(),
  confirmation_token = NULL
WHERE email IN (
  'evanxu@studylandsedu.com',
  'zoefan@studylandsedu.com',
  'kaynxu@studylandsedu.com',
  'jozhuang@studylandsedu.com'
);
```

**执行时间: 10秒**  
**难度: 复制粘贴**  

