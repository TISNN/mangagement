-- ============================================
-- 知识库 Storage Buckets 创建
-- 迁移编号: 006  
-- 创建日期: 2025-11-03
-- 说明: 创建知识库文件和缩略图的 Storage buckets
-- ============================================

-- 注意：此脚本需要在 Supabase Dashboard 的 Storage 页面手动创建
-- 或使用 Supabase CLI 执行

-- ============================================
-- 手动创建步骤（推荐）
-- ============================================

/*
1. 打开 Supabase Dashboard
2. 进入 Storage 菜单
3. 点击 "New bucket"
4. 创建第一个 bucket:
   - Name: knowledge-files
   - Public: ✓ (勾选)
   - File size limit: 100 MB
   - Allowed MIME types: 
     * application/pdf
     * application/msword
     * application/vnd.openxmlformats-officedocument.wordprocessingml.document
     * application/vnd.ms-powerpoint
     * application/vnd.openxmlformats-officedocument.presentationml.presentation
     * application/vnd.ms-excel  
     * application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
     * video/mp4
     * video/quicktime
     * video/x-msvideo

5. 创建第二个 bucket:
   - Name: knowledge-thumbnails
   - Public: ✓ (勾选)
   - File size limit: 5 MB
   - Allowed MIME types:
     * image/jpeg
     * image/png
     * image/gif
     * image/webp
*/

-- ============================================
-- 或使用 RLS 策略（可选）
-- ============================================

-- 如果需要更细粒度的权限控制，可以设置 RLS 策略：

-- 允许所有人读取文件
CREATE POLICY "Public Access for knowledge-files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'knowledge-files');

-- 允许认证用户上传文件
CREATE POLICY "Authenticated users can upload knowledge-files"
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'knowledge-files');

-- 允许文件作者删除自己的文件  
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'knowledge-files' AND owner = auth.uid());

-- 缩略图策略（相同）
CREATE POLICY "Public Access for knowledge-thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Authenticated users can upload knowledge-thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'knowledge-thumbnails');

CREATE POLICY "Users can delete own thumbnails"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'knowledge-thumbnails' AND owner = auth.uid());

-- ============================================
-- 验证
-- ============================================

-- 查看所有 buckets
SELECT * FROM storage.buckets WHERE name LIKE 'knowledge%';

SELECT '✅ 请在 Supabase Dashboard 的 Storage 页面创建 buckets' as message;
SELECT '📦 需要创建: knowledge-files (100MB) 和 knowledge-thumbnails (5MB)' as info;

