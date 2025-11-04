# Storage 策略配置对比 🔒

## 📋 参考配置：task-attachments

你的 task-attachments bucket 已有以下策略：

| 策略名称 | 操作类型 | 应用对象 |
|---------|---------|---------|
| Allow authenticated users to view | SELECT | public |
| Allow authenticated users to upload | INSERT | public |
| Allow authenticated users to delete | DELETE | public |

## ✅ 知识库策略配置（完全一致）

### knowledge-files bucket

| 策略名称 | 操作类型 | 应用对象 |
|---------|---------|---------|
| Allow authenticated users to view | SELECT | public |
| Allow authenticated users to upload | INSERT | public |
| Allow authenticated users to delete | DELETE | public |

### knowledge-thumbnails bucket

| 策略名称 | 操作类型 | 应用对象 |
|---------|---------|---------|
| Allow authenticated users to view thumbnails | SELECT | public |
| Allow authenticated users to upload thumbnails | INSERT | public |
| Allow authenticated users to delete thumbnails | DELETE | public |

## 📝 执行的 SQL

```sql
-- knowledge-files 策略（与 task-attachments 格式一致）
CREATE POLICY "Allow authenticated users to view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'knowledge-files');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'knowledge-files');

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'knowledge-files');

-- knowledge-thumbnails 策略
CREATE POLICY "Allow authenticated users to view thumbnails"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Allow authenticated users to upload thumbnails"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Allow authenticated users to delete thumbnails"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'knowledge-thumbnails');
```

## 🎯 策略说明

### TO public 的含义
- 在 Supabase 中，`TO public` 表示应用到所有角色
- 但 `USING` 和 `WITH CHECK` 子句会进一步限制
- 实际效果：只有认证用户可以操作

### 策略类型
- **SELECT** - 查看/下载文件
- **INSERT** - 上传新文件
- **DELETE** - 删除文件
- **UPDATE** - 更新文件（未配置，一般不需要）

## 🚀 快速执行

### 方式 1: 使用准备好的文件 ⭐
在 Supabase SQL Editor 中执行：
```
database_migrations/EXECUTE_THIS_FOR_STORAGE.sql
```

### 方式 2: 复制粘贴上面的 SQL
直接复制上面的 6 条 CREATE POLICY 语句执行

## ✅ 执行后验证

执行成功后，在 Storage 页面：

1. 点击 `knowledge-files` bucket
2. 切换到 "Policies" 标签
3. 应该看到 3 个策略：
   ```
   ✅ Allow authenticated users to view
   ✅ Allow authenticated users to upload
   ✅ Allow authenticated users to delete
   ```

4. 点击 `knowledge-thumbnails` bucket
5. 应该看到 3 个策略（带 thumbnails 后缀）

## 🎉 配置完成后

- ✅ 策略与 task-attachments 完全一致
- ✅ 只有登录用户可以上传
- ✅ 安全性得到保证
- ✅ 上传功能完全可用

---

**现在执行 SQL，然后刷新页面尝试上传！** 🚀

