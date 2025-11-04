-- ============================================
-- 知识库 Storage 策略配置
-- 迁移编号: 006
-- 创建日期: 2025-11-03
-- 说明: 配置 Storage buckets 的访问策略（RLS）
-- ============================================

-- ============================================
-- 方案 A: 公开访问策略（推荐，最简单）
-- ============================================

-- 1. 为 knowledge-files bucket 设置策略

-- 允许所有人查看文件
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Public Access',
  'knowledge-files',
  'true'
)
ON CONFLICT DO NOTHING;

-- 允许所有人上传文件（或改为仅认证用户）
INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Anyone can upload',
  'knowledge-files',
  'true',
  'true'
)
ON CONFLICT DO NOTHING;

-- 允许所有人删除文件（可选，建议改为仅作者）
INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Anyone can delete',
  'knowledge-files',
  'true'
)
ON CONFLICT DO NOTHING;

-- 2. 为 knowledge-thumbnails bucket 设置策略

INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Public Access',
  'knowledge-thumbnails',
  'true'
)
ON CONFLICT DO NOTHING;

INSERT INTO storage.policies (name, bucket_id, definition, check_definition)
VALUES (
  'Anyone can upload',
  'knowledge-thumbnails',
  'true',
  'true'
)
ON CONFLICT DO NOTHING;

INSERT INTO storage.policies (name, bucket_id, definition)
VALUES (
  'Anyone can delete',
  'knowledge-thumbnails',
  'true'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 方案 B: 使用 SQL 创建策略（更规范）
-- ============================================

-- 如果上面的方案不工作，使用以下方式：

-- knowledge-files 策略
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-files');

DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
CREATE POLICY "Public upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-files');

DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
CREATE POLICY "Public delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'knowledge-files');

-- knowledge-thumbnails 策略
DROP POLICY IF EXISTS "Public thumbnail read" ON storage.objects;
CREATE POLICY "Public thumbnail read"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-thumbnails');

DROP POLICY IF EXISTS "Public thumbnail upload" ON storage.objects;
CREATE POLICY "Public thumbnail upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'knowledge-thumbnails');

DROP POLICY IF EXISTS "Public thumbnail delete" ON storage.objects;
CREATE POLICY "Public thumbnail delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'knowledge-thumbnails');

-- ============================================
-- 验证策略
-- ============================================

-- 查看所有 Storage 策略
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects'
ORDER BY policyname;

SELECT '✅ Storage 访问策略已配置！' as message;
SELECT '📦 现在可以上传文件了' as info;

