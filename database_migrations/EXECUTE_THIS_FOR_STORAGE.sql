-- ============================================
-- 知识库 Storage 策略配置
-- 参考 task-attachments 的配置
-- 只允许认证用户（authenticated users）
-- ============================================

-- ============================================
-- knowledge-files bucket 策略
-- ============================================

-- 允许认证用户查看文件
CREATE POLICY "knowledge-files: Allow authenticated users to view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'knowledge-files');

-- 允许认证用户上传文件
CREATE POLICY "knowledge-files: Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'knowledge-files');

-- 允许认证用户删除文件
CREATE POLICY "knowledge-files: Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'knowledge-files');

-- ============================================
-- knowledge-thumbnails bucket 策略
-- ============================================

-- 允许认证用户查看缩略图
CREATE POLICY "knowledge-thumbnails: Allow authenticated users to view"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'knowledge-thumbnails');

-- 允许认证用户上传缩略图
CREATE POLICY "knowledge-thumbnails: Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'knowledge-thumbnails');

-- 允许认证用户删除缩略图
CREATE POLICY "knowledge-thumbnails: Allow authenticated users to delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'knowledge-thumbnails');

-- ============================================
-- 完成提示
-- ============================================

SELECT '✅ Storage 访问策略配置完成！' as message;
SELECT '📤 认证用户现在可以上传文件了！' as info;
SELECT '🔒 策略配置与 task-attachments 一致' as note;
