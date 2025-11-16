-- ============================================
-- 云文档数据库表创建
-- 迁移编号: 007
-- 创建日期: 2025-01-22
-- 说明: 创建云文档相关的表
-- ============================================

-- 1. 创建云文档表
-- ============================================
CREATE TABLE IF NOT EXISTS cloud_documents (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  category VARCHAR(100),
  tags TEXT[],
  location TEXT, -- 文档位置/路径，如 '学屿教育 / 申研服务'
  is_favorite BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  CONSTRAINT cloud_documents_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cloud_documents_created_by ON cloud_documents(created_by);
CREATE INDEX IF NOT EXISTS idx_cloud_documents_created_at ON cloud_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cloud_documents_status ON cloud_documents(status);
CREATE INDEX IF NOT EXISTS idx_cloud_documents_category ON cloud_documents(category);
CREATE INDEX IF NOT EXISTS idx_cloud_documents_tags ON cloud_documents USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_cloud_documents_favorite ON cloud_documents(is_favorite) WHERE is_favorite = true;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_cloud_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cloud_documents_updated_at
  BEFORE UPDATE ON cloud_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_cloud_documents_updated_at();

-- 完成提示
SELECT 'Cloud documents table created successfully!' as message;

