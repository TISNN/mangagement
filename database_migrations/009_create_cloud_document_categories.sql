-- ============================================
-- 云文档分类系统数据库表创建
-- 迁移编号: 009
-- 创建日期: 2025-01-22
-- 说明: 创建云文档分类表和文档分类关联表，支持独立的分类管理和多对多关系
-- ============================================

-- 1. 创建云文档分类表
-- ============================================
CREATE TABLE IF NOT EXISTS cloud_document_categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by INTEGER NOT NULL,
  CONSTRAINT cloud_document_categories_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE
);

-- 2. 创建文档分类关联表（多对多关系）
-- ============================================
CREATE TABLE IF NOT EXISTS cloud_document_category_relations (
  id BIGSERIAL PRIMARY KEY,
  document_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT cloud_document_category_relations_document_fkey 
    FOREIGN KEY (document_id) REFERENCES cloud_documents(id) ON DELETE CASCADE,
  CONSTRAINT cloud_document_category_relations_category_fkey 
    FOREIGN KEY (category_id) REFERENCES cloud_document_categories(id) ON DELETE CASCADE,
  CONSTRAINT cloud_document_category_relations_unique 
    UNIQUE(document_id, category_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_cloud_document_categories_name ON cloud_document_categories(name);
CREATE INDEX IF NOT EXISTS idx_cloud_document_categories_created_by ON cloud_document_categories(created_by);
CREATE INDEX IF NOT EXISTS idx_cloud_document_category_relations_document ON cloud_document_category_relations(document_id);
CREATE INDEX IF NOT EXISTS idx_cloud_document_category_relations_category ON cloud_document_category_relations(category_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_cloud_document_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cloud_document_categories_updated_at
  BEFORE UPDATE ON cloud_document_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_cloud_document_categories_updated_at();

-- 完成提示
SELECT 'Cloud document categories tables created successfully!' as message;

