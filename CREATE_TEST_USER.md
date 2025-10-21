# 🔐 创建测试用户指南

## 当前状态

✅ **数据库配置完美:**
- employees 表有 4 位员工,都已关联 Auth ID
- students 表有 auth_id 字段
- RLS 已禁用
- 所有必需字段齐全

❓ **唯一问题: 需要设置已知的密码**

---

## 🎯 解决方案: 在 Supabase Dashboard 设置密码

### 方法 1: 重置现有用户密码 (推荐)

#### 步骤:

1. **访问 Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/swyajeiqqewyckzbfkid
   ```

2. **进入 Authentication → Users**
   
   你应该能看到这4个用户(基于 auth_id):
   - b07c1c73-2c83-4a1b-bf3f-9a9c069023eb (Evan Xu)
   - e699dd0f-d121-4d65-919e-ebc9df2f458e (Zoe Fan)
   - c4acedc1-09ec-4631-a2ca-49f669e2cb16 (Kayn Xu)
   - d99a6cc9-33a0-40d3-82c7-3ab2aa2c4ad9 (Jo Zhuang)

3. **为 Evan Xu 设置密码**
   - 找到 email 为 `evanxu@studylandsedu.com` 的用户
   - 点击右侧的 **"..."** 菜单
   - 选择 **"Change Password"**
   - 设置新密码: `Admin123!` (或你喜欢的)
   - 点击保存

4. **测试登录**
   ```bash
   npm run dev
   # 访问 http://localhost:5173/login
   # 邮箱: evanxu@studylandsedu.com
   # 密码: Admin123!
   ```

---

### 方法 2: 如果用户不存在,创建新用户

#### 如果 Authentication → Users 列表是空的:

1. **点击 "Add user" → "Create new user"**

2. **填写信息:**
   ```
   Email: evanxu@studylandsedu.com
   Password: Admin123!
   ✅ Auto Confirm User (勾选此项,跳过邮箱验证)
   ```

3. **创建后,复制生成的 User ID (UUID)**

4. **关联到 employees 表:**
   
   在 **SQL Editor** 运行:
   ```sql
   -- 更新 Evan Xu 的 auth_id
   UPDATE employees
   SET auth_id = 'paste-the-user-id-here'  -- 替换为刚才复制的 UUID
   WHERE email = 'evanxu@studylandsedu.com';
   
   -- 验证
   SELECT id, name, email, auth_id
   FROM employees
   WHERE email = 'evanxu@studylandsedu.com';
   ```

---

## 🧪 快速测试步骤

### 完整测试流程:

1. **确认 Auth 用户存在并设置密码**
   - Dashboard → Authentication → Users
   - 重置密码为 `Admin123!`

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **测试登录**
   - 访问: http://localhost:5173/login
   - 选择: "管理员"
   - 邮箱: evanxu@studylandsedu.com
   - 密码: Admin123!
   - 点击: 登录

4. **成功标志:**
   - ✅ 页面跳转到 `/admin/dashboard`
   - ✅ 浏览器控制台显示: `[LoginPage] 登录成功`
   - ✅ 看到管理后台界面

---

## 📊 当前 Auth ID 映射

根据数据库查询结果:

| 邮箱 | 姓名 | Auth ID | 需要操作 |
|------|------|---------|----------|
| evanxu@studylandsedu.com | Evan Xu | b07c1c73-2c83-4a1b-bf3f-9a9c069023eb | 设置密码 |
| zoefan@studylandsedu.com | Zoe Fan | e699dd0f-d121-4d65-919e-ebc9df2f458e | 设置密码 |
| kaynxu@studylandsedu.com | Kayn Xu | c4acedc1-09ec-4631-a2ca-49f669e2cb16 | 设置密码 |
| jozhuang@studylandsedu.com | Jo Zhuang | d99a6cc9-33a0-40d3-82c7-3ab2aa2c4ad9 | 设置密码 |

---

## ❓ 常见问题

### Q: 如何确认用户是否存在?

**A:** 在 Dashboard → Authentication → Users 中查看。如果看到用户,说明存在。

### Q: 用户列表为空怎么办?

**A:** 使用方法 2 创建新用户,然后更新 employees 表的 auth_id。

### Q: 忘记刚设置的密码怎么办?

**A:** 再次在 Dashboard 中 Change Password 即可。

### Q: 密码有什么要求?

**A:** Supabase 默认要求:
- 至少 6 个字符
- 建议: 包含大小写字母、数字、特殊字符

推荐测试密码:
- `Admin123!`
- `Test123456!`
- `Studylands2025!`

---

## ✅ 检查清单

在测试登录前确认:

- [ ] 访问了 Supabase Dashboard
- [ ] 进入了 Authentication → Users
- [ ] 找到了 evanxu@studylandsedu.com 用户
- [ ] 设置了密码 (例如 Admin123!)
- [ ] 记住了密码
- [ ] 开发服务器正在运行 (npm run dev)

---

## 🎯 预期结果

执行以上步骤后:

1. **登录成功**
   - 输入邮箱和密码
   - 点击登录
   - 跳转到管理后台

2. **控制台输出**
   ```
   [LoginPage] 开始登录 - 类型: admin
   [AuthService] 开始登录: evanxu@studylandsedu.com (admin)
   [AuthService] Supabase Auth 登录成功
   [AuthService] 查询到员工资料: Evan Xu
   [AuthService] 登录流程完成
   [LoginPage] 登录成功: {name: "Evan Xu", ...}
   ```

3. **页面跳转**
   - 从 `/login` → `/admin/dashboard`
   - 显示管理后台界面

---

**完成时间: 2-3 分钟**  
**难度: 非常简单**

只需在 Dashboard 设置密码,就可以登录了! 🚀

