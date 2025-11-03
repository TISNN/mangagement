-- ============================================
-- 知识库 RPC 函数
-- 迁移编号: 005
-- 创建日期: 2025-11-03
-- 说明: 创建用于增加浏览次数的 RPC 函数（可选）
-- ============================================

-- 增加资源浏览次数
CREATE OR REPLACE FUNCTION increment_resource_views(resource_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE knowledge_resources
  SET views = views + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

-- 增加资源下载次数
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE knowledge_resources
  SET downloads = downloads + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

-- 添加注释
COMMENT ON FUNCTION increment_resource_views(INTEGER) IS '原子性地增加资源浏览次数';
COMMENT ON FUNCTION increment_resource_downloads(INTEGER) IS '原子性地增加资源下载次数';

SELECT '✅ 知识库 RPC 函数创建完成！' as message;

