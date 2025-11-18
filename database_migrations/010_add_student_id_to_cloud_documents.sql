-- ============================================
-- 为云文档表添加学生关联字段
-- 迁移编号: 010
-- 创建日期: 2025-01-22
-- 说明: 为cloud_documents表添加student_id字段，支持关联学生
-- ============================================

-- 添加student_id字段
ALTER TABLE cloud_documents 
ADD COLUMN IF NOT EXISTS student_id INTEGER REFERENCES students(id) ON DELETE SET NULL;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_cloud_documents_student_id ON cloud_documents(student_id) WHERE student_id IS NOT NULL;

-- 完成提示
SELECT 'Student ID column added to cloud_documents table successfully!' as message;

