-- ============================================
-- 文档批注数据库表创建
-- 迁移编号: 008
-- 创建日期: 2025-01-22
-- 说明: 创建文档批注表，支持对文档内容进行批注和评论
-- ============================================

-- 创建文档批注表
CREATE TABLE IF NOT EXISTS document_annotations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  document_id BIGINT NOT NULL,
  created_by INTEGER NOT NULL,
  content TEXT NOT NULL,
  selected_text TEXT, -- 选中的文本内容
  start_pos INTEGER, -- 在文档中的起始位置（字符位置）
  end_pos INTEGER, -- 在文档中的结束位置（字符位置）
  parent_id BIGINT, -- 父批注ID，用于回复功能
  is_resolved BOOLEAN DEFAULT false, -- 是否已解决
  CONSTRAINT document_annotations_document_id_fkey 
    FOREIGN KEY (document_id) REFERENCES cloud_documents(id) ON DELETE CASCADE,
  CONSTRAINT document_annotations_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE CASCADE,
  CONSTRAINT document_annotations_parent_id_fkey 
    FOREIGN KEY (parent_id) REFERENCES document_annotations(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_document_annotations_document_id ON document_annotations(document_id);
CREATE INDEX IF NOT EXISTS idx_document_annotations_created_by ON document_annotations(created_by);
CREATE INDEX IF NOT EXISTS idx_document_annotations_parent_id ON document_annotations(parent_id);
CREATE INDEX IF NOT EXISTS idx_document_annotations_created_at ON document_annotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_annotations_resolved ON document_annotations(is_resolved) WHERE is_resolved = false;

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_document_annotations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_document_annotations_updated_at
  BEFORE UPDATE ON document_annotations
  FOR EACH ROW
  EXECUTE FUNCTION update_document_annotations_updated_at();

-- 添加注释
COMMENT ON TABLE document_annotations IS '文档批注表，存储对文档内容的批注和评论';
COMMENT ON COLUMN document_annotations.document_id IS '关联的文档ID';
COMMENT ON COLUMN document_annotations.created_by IS '批注创建人（员工ID）';
COMMENT ON COLUMN document_annotations.content IS '批注内容';
COMMENT ON COLUMN document_annotations.selected_text IS '选中的文本内容';
COMMENT ON COLUMN document_annotations.start_pos IS '选中文本在文档中的起始位置';
COMMENT ON COLUMN document_annotations.end_pos IS '选中文本在文档中的结束位置';
COMMENT ON COLUMN document_annotations.parent_id IS '父批注ID，用于回复功能';
COMMENT ON COLUMN document_annotations.is_resolved IS '批注是否已解决';

-- 完成提示
SELECT 'Document annotations table created successfully!' as message;

