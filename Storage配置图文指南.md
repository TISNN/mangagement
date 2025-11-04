# Storage 配置图文指南 🎯

## 🚨 当前问题

**错误信息**: `new row violates row-level security policy`  
**原因**: Storage buckets 的 RLS（行级安全策略）阻止了上传

## ✅ 快速解决方案（3分钟）

### 方法 1: 在 Dashboard 禁用 RLS（最简单） ⭐

1. **打开 Supabase Dashboard**
   - 访问: https://supabase.com/dashboard
   - 选择你的项目

2. **进入 Storage 页面**
   - 点击左侧菜单 "Storage"

3. **配置 knowledge-files bucket**
   - 找到 `knowledge-files` bucket
   - 点击右侧的 **⚙️ (设置图标)**
   - 找到 "**RLS policies**" 或 "**Policies**" 部分
   - 点击 "**New policy**"
   - 选择 "**For full customization**"
   - 填写：
     ```
     Policy name: Allow public upload
     Allowed operation: INSERT ✓
     Policy definition: true
     WITH CHECK: true
     ```
   - 点击 "**Save policy**"

   - 再次点击 "**New policy**"
   - 填写：
     ```
     Policy name: Allow public read
     Allowed operation: SELECT ✓
     Policy definition: true
     ```
   - 点击 "**Save policy**"

4. **配置 knowledge-thumbnails bucket**
   - 重复步骤 3，为 `knowledge-thumbnails` 创建相同的策略

5. **完成！**

### 方法 2: 执行 SQL 策略（推荐） ⭐⭐

**更简单的方式**：在 SQL Editor 执行：

```sql
-- 允许所有人读取和上传 knowledge-files
CREATE POLICY "Public read files"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-files');

CREATE POLICY "Public upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-files');

-- 允许所有人读取和上传 knowledge-thumbnails
CREATE POLICY "Public read thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Public upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-thumbnails');
```

**或者执行我准备好的文件**：
```
database_migrations/006_configure_storage_policies.sql
```

## 📝 详细步骤（方法2 - SQL方式）

### 1. 打开 SQL Editor
- Supabase Dashboard → SQL Editor → New query

### 2. 复制粘贴 SQL
复制以下内容：

```sql
-- knowledge-files 访问策略
CREATE POLICY "Public read files"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-files');

CREATE POLICY "Public upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-files');

CREATE POLICY "Public update files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'knowledge-files')
WITH CHECK (bucket_id = 'knowledge-files');

CREATE POLICY "Public delete files"
ON storage.objects FOR DELETE
USING (bucket_id = 'knowledge-files');

-- knowledge-thumbnails 访问策略
CREATE POLICY "Public read thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Public upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Public update thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'knowledge-thumbnails')
WITH CHECK (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Public delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'knowledge-thumbnails');
```

### 3. 点击 "Run" 执行

### 4. 验证成功
应该看到类似的输出：
```
CREATE POLICY
CREATE POLICY
CREATE POLICY
...
```

### 5. 测试上传
- 返回知识库页面
- 点击"上传资源"
- 选择文件
- 点击"创建资源"
- ✅ 上传成功！

## 🎯 策略说明

### 创建的策略

| Bucket | 策略 | 作用 |
|--------|------|------|
| knowledge-files | Public read | 所有人可以查看/下载 |
| knowledge-files | Public upload | 所有人可以上传 |
| knowledge-files | Public delete | 所有人可以删除（可选） |
| knowledge-thumbnails | Public read | 所有人可以查看 |
| knowledge-thumbnails | Public upload | 所有人可以上传 |

### 为什么需要这些策略？

Supabase Storage 默认启用 RLS，任何操作都需要明确的策略授权：
- **SELECT** - 读取/下载文件
- **INSERT** - 上传新文件
- **UPDATE** - 更新文件
- **DELETE** - 删除文件

## 🔒 安全建议（生产环境）

如果是生产环境，建议使用更严格的策略：

### 仅认证用户可上传
```sql
CREATE POLICY "Authenticated users upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'knowledge-files');
```

### 仅作者可删除
```sql
CREATE POLICY "Authors delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-files' 
  AND auth.uid() = owner
);
```

但现在为了快速开始，使用公开策略完全可以。

## ⚠️ 常见问题

### Q: 执行 SQL 后仍然报错？
**A**: 
1. 检查策略是否真的创建成功
2. 查看 Storage → Policies 页面
3. 确认 bucket 名称拼写正确
4. 刷新浏览器缓存

### Q: 不想所有人都能上传？
**A**: 修改策略，将 `true` 改为 `auth.role() = 'authenticated'`

### Q: 如何查看已有策略？
**A**: 在 SQL Editor 执行：
```sql
SELECT * FROM storage.policies 
WHERE bucket_id IN ('knowledge-files', 'knowledge-thumbnails');
```

## 🎉 完成检查

执行 SQL 后，检查：

- [ ] SQL 执行无错误
- [ ] 在 Storage 页面能看到策略
- [ ] 刷新知识库页面
- [ ] 测试上传一个小文件（如 1MB PDF）
- [ ] 上传成功，能在列表中看到
- [ ] 点击可以下载

---

## 🚀 现在执行

### 最快方法（1分钟）

**在 Supabase Dashboard 的 SQL Editor 中执行这段代码**：

```sql
CREATE POLICY "Public read files" ON storage.objects FOR SELECT USING (bucket_id = 'knowledge-files');
CREATE POLICY "Public upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'knowledge-files');
CREATE POLICY "Public read thumbnails" ON storage.objects FOR SELECT USING (bucket_id = 'knowledge-thumbnails');
CREATE POLICY "Public upload thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'knowledge-thumbnails');
```

**点击 Run，等待执行完成，刷新知识库，再次尝试上传！** ✨

---

配置完成后，文件上传功能就完全可用了！🎊

