-- ============================================
-- 任务模块数据库迁移 - 添加任务域和关联实体字段
-- 迁移编号: 001
-- 创建日期: 2025-11-02
-- 作者: AI Assistant
-- ============================================

-- 1. 添加新字段到 tasks 表
-- ============================================

-- 添加任务域字段
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS task_domain VARCHAR(50) DEFAULT 'general' 
CHECK (task_domain IN ('general', 'student_success', 'company_ops', 'marketing'));

-- 添加关联实体类型字段
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS linked_entity_type VARCHAR(20) DEFAULT 'none'
CHECK (linked_entity_type IN ('student', 'lead', 'employee', 'none'));

-- 添加关联实体ID字段
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS linked_entity_id INTEGER;

-- 添加关联会议字段
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS related_meeting_id INTEGER REFERENCES meetings(id) ON DELETE SET NULL;

-- 添加字段注释
COMMENT ON COLUMN tasks.task_domain IS '任务域：general-通用任务, student_success-学生服务, company_ops-公司运营, marketing-市场营销';
COMMENT ON COLUMN tasks.linked_entity_type IS '关联实体类型：student-学生, lead-线索, employee-员工, none-无关联';
COMMENT ON COLUMN tasks.linked_entity_id IS '关联实体ID，配合linked_entity_type使用';
COMMENT ON COLUMN tasks.related_meeting_id IS '关联会议ID，用于任务与会议的关联';

-- 2. 创建索引以提升查询性能
-- ============================================

-- 为任务域创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_domain ON tasks(task_domain);

-- 为关联实体创建复合索引
CREATE INDEX IF NOT EXISTS idx_tasks_linked_entity ON tasks(linked_entity_type, linked_entity_id);

-- 为常用组合查询创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_domain_status ON tasks(task_domain, status);

-- 为会议关联创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_meeting ON tasks(related_meeting_id);

-- 3. 历史数据回填策略
-- ============================================

-- 3.1 将有关联学生的任务设置为 student_success 域
UPDATE tasks 
SET 
  task_domain = 'student_success',
  linked_entity_type = 'student',
  linked_entity_id = related_student_id
WHERE 
  related_student_id IS NOT NULL 
  AND task_domain = 'general';

-- 3.2 将有关联线索的任务设置为 marketing 域
UPDATE tasks 
SET 
  task_domain = 'marketing',
  linked_entity_type = 'lead',
  linked_entity_id = related_lead_id
WHERE 
  related_lead_id IS NOT NULL 
  AND task_domain = 'general';

-- 3.3 根据任务标题关键词智能分类（可选）
-- 包含"运营"、"管理"等关键词的任务归类为 company_ops
UPDATE tasks 
SET task_domain = 'company_ops'
WHERE 
  task_domain = 'general'
  AND (
    title ILIKE '%运营%' OR 
    title ILIKE '%管理%' OR 
    title ILIKE '%会议%' OR
    title ILIKE '%培训%' OR
    description ILIKE '%内部%'
  );

-- 包含"市场"、"推广"等关键词的任务归类为 marketing
UPDATE tasks 
SET task_domain = 'marketing'
WHERE 
  task_domain = 'general'
  AND (
    title ILIKE '%市场%' OR 
    title ILIKE '%推广%' OR 
    title ILIKE '%宣传%' OR
    title ILIKE '%活动%' OR
    description ILIKE '%市场%'
  );

-- 4. 数据完整性约束
-- ============================================

-- 当 linked_entity_type 不为 none 时，linked_entity_id 必须有值
ALTER TABLE tasks 
ADD CONSTRAINT check_linked_entity_consistency 
CHECK (
  (linked_entity_type = 'none' AND linked_entity_id IS NULL) 
  OR 
  (linked_entity_type != 'none' AND linked_entity_id IS NOT NULL)
);

-- 5. 更新 updated_at 触发器（如果还没有）
-- ============================================

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 tasks 表添加触发器
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at 
BEFORE UPDATE ON tasks 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- 6. 创建视图以简化查询
-- ============================================

-- 创建任务统计视图
CREATE OR REPLACE VIEW task_stats_by_domain AS
SELECT 
  task_domain,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = '待处理' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN status = '进行中' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN status = '已完成' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN status = '已取消' THEN 1 END) as cancelled_tasks,
  COUNT(CASE WHEN priority = '高' THEN 1 END) as high_priority_tasks,
  COUNT(CASE WHEN due_date < NOW() AND status NOT IN ('已完成', '已取消') THEN 1 END) as overdue_tasks
FROM tasks
GROUP BY task_domain;

-- 创建关联实体统计视图
CREATE OR REPLACE VIEW task_stats_by_entity_type AS
SELECT 
  linked_entity_type,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = '待处理' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN status = '进行中' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN status = '已完成' THEN 1 END) as completed_tasks
FROM tasks
GROUP BY linked_entity_type;

-- 7. 验证数据迁移
-- ============================================

-- 检查迁移后的数据分布
SELECT 
  'task_domain 分布' as check_name,
  task_domain,
  COUNT(*) as count
FROM tasks
GROUP BY task_domain
UNION ALL
SELECT 
  'linked_entity_type 分布' as check_name,
  linked_entity_type,
  COUNT(*) as count
FROM tasks
GROUP BY linked_entity_type;

-- 检查是否有数据不一致的情况
SELECT 
  'linked_entity 一致性检查' as check_name,
  COUNT(*) as inconsistent_count
FROM tasks
WHERE 
  (linked_entity_type = 'none' AND linked_entity_id IS NOT NULL)
  OR
  (linked_entity_type != 'none' AND linked_entity_id IS NULL);

-- 8. 回滚脚本（紧急情况使用）
-- ============================================

/*
-- 如需回滚，执行以下脚本：

-- 删除约束
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS check_linked_entity_consistency;

-- 删除索引
DROP INDEX IF EXISTS idx_tasks_domain;
DROP INDEX IF EXISTS idx_tasks_linked_entity;
DROP INDEX IF EXISTS idx_tasks_domain_status;

-- 删除视图
DROP VIEW IF EXISTS task_stats_by_domain;
DROP VIEW IF EXISTS task_stats_by_entity_type;

-- 删除字段
ALTER TABLE tasks DROP COLUMN IF EXISTS task_domain;
ALTER TABLE tasks DROP COLUMN IF EXISTS linked_entity_type;
ALTER TABLE tasks DROP COLUMN IF EXISTS linked_entity_id;
*/

-- ============================================
-- 迁移完成
-- ============================================

SELECT 'Tasks表字段迁移完成！' as message;
SELECT '已添加: task_domain, linked_entity_type, linked_entity_id' as fields;
SELECT '已创建索引和视图以优化查询性能' as optimization;
SELECT '历史数据已根据 related_student_id 和 related_lead_id 自动回填' as data_backfill;

