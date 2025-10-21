# 检查和管理 Supabase Auth 用户

## 🔍 检查现有用户

### 在 Supabase Dashboard:

1. 访问 https://supabase.com/dashboard
2. 选择项目: **swyajeiqqewyckzbfkid**
3. 点击 **Authentication** → **Users**

你会看到所有已创建的 Auth 用户列表。

---

## 👥 预期看到的用户

根据你的 employees 表,应该有以下用户:

| 邮箱 | 姓名 | Auth ID |
|------|------|---------|
| evanxu@studylandsedu.com | Evan Xu | b07c1c73-2c83-4a1b-bf3f-9a9c069023eb |
| zoefan@studylandsedu.com | Zoe Fan | e699dd0f-d121-4d65-919e-ebc9df2f458e |
| kaynxu@studylandsedu.com | Kayn Xu | c4acedc1-09ec-4631-a2ca-49f669e2cb16 |
| jozhuang@studylandsedu.com | Jo Zhuang | d99a6cc9-33a0-40d3-82c7-3ab2aa2c4ad9 |

---

## 🔑 设置/重置密码

### 为每个用户设置密码:

1. 点击用户行右侧的 **"..."** 菜单
2. 选择 **"Change Password"**
3. 输入新密码 (建议都用同一个测试密码方便记忆)
4. 保存

### 推荐的测试密码格式:

```
Admin123!
或
Test123456!
或
Studylands2025!
```

---

## ✅ 验证用户配置

### 检查清单:

运行以下 SQL 验证配置:

```sql
-- 检查所有员工及其 Auth ID
SELECT 
    e.id,
    e.name,
    e.email,
    e.auth_id,
    CASE 
        WHEN e.auth_id IS NOT NULL THEN '✅ 已关联'
        ELSE '❌ 未关联'
    END as auth_status
FROM employees e
WHERE e.is_active = true
ORDER BY e.id;
```

预期结果:
- 所有员工的 `auth_status` 应该是 '✅ 已关联'

---

## 🧪 测试登录

### 测试步骤:

1. 确保 RLS 已禁用:
   ```sql
   ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
   ALTER TABLE students DISABLE ROW LEVEL SECURITY;
   ```

2. 启动开发服务器:
   ```bash
   npm run dev
   ```

3. 访问登录页:
   ```
   http://localhost:5173/login
   ```

4. 测试登录:
   - 选择 "管理员"
   - 邮箱: `evanxu@studylandsedu.com`
   - 密码: (你刚才设置的密码)
   - 点击 "登录"

5. 成功标志:
   - ✅ 页面跳转到 `/admin/dashboard`
   - ✅ 控制台显示 `[LoginPage] 登录成功`
   - ✅ 没有错误提示

---

## ❓ 常见问题

### Q: 忘记设置的密码怎么办?

**A:** 在 Dashboard 重新设置即可,步骤:
1. Authentication → Users
2. 找到用户
3. ... → Change Password
4. 设置新密码

### Q: 用户列表是空的怎么办?

**A:** 需要创建用户:
1. 点击 "Add user" → "Create new user"
2. 填写邮箱和密码
3. ✅ 勾选 "Auto Confirm User"
4. 创建后复制 User ID
5. 在 SQL Editor 更新 employees 表的 auth_id

### Q: 如何批量重置所有用户密码?

**A:** 需要逐个重置,Supabase 不支持批量密码重置(安全原因)

---

## 📋 快速命令

### 查看 Auth 用户和 employees 的对应关系:

```sql
-- 检查哪些员工有 Auth 账号
SELECT 
    e.name,
    e.email,
    e.auth_id,
    CASE 
        WHEN e.auth_id IS NOT NULL 
        THEN '✅ 有Auth账号'
        ELSE '❌ 需要创建'
    END as status
FROM employees e
WHERE e.is_active = true;
```

### 清空某个员工的 auth_id (如需重新关联):

```sql
UPDATE employees 
SET auth_id = NULL 
WHERE email = 'example@email.com';
```

---

## 🎯 最佳实践

### 开发环境:
- 使用简单的测试密码 (如 `Admin123!`)
- 所有测试账号用同一个密码方便记忆
- ✅ Auto Confirm User (跳过邮箱验证)

### 生产环境:
- 使用强密码
- 启用邮箱验证
- 定期更换密码
- 启用 2FA (如可用)

---

## 💡 提示

1. **密码要求:**
   - 至少 6 个字符
   - 建议包含大小写字母、数字和特殊字符

2. **保存密码:**
   - 开发环境可以用简单密码
   - 建议记录在安全的地方 (密码管理器)

3. **测试建议:**
   - 先用一个账号测试登录
   - 成功后再配置其他账号

---

**现在去 Supabase Dashboard 设置密码,然后就可以登录了!** 🚀

