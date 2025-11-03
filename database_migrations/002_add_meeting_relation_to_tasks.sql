-- ============================================
-- 任务与会议关联 - 数据库迁移
-- 迁移编号: 002
-- 创建日期: 2025-11-02
-- 说明: 为tasks表添加会议关联字段
-- ============================================

-- 1. 添加会议关联字段
-- ============================================

-- 添加关联会议ID字段
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS meeting_id INTEGER;

-- 添加外键约束（关联到meetings表）
ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_meeting 
FOREIGN KEY (meeting_id) 
REFERENCES meetings(id) 
ON DELETE SET NULL;  -- 会议删除时，任务的meeting_id设为NULL

-- 添加字段注释
COMMENT ON COLUMN tasks.meeting_id IS '关联的会议ID，任务可以关联到一个会议';

-- 2. 创建索引优化查询
-- ============================================

-- 为meeting_id创建索引
CREATE INDEX IF NOT EXISTS idx_tasks_meeting_id ON tasks(meeting_id);

-- 为常用组合查询创建索引（任务域+会议）
CREATE INDEX IF NOT EXISTS idx_tasks_domain_meeting ON tasks(task_domain, meeting_id);

-- 3. 创建反向查询视图
-- ============================================

-- 创建会议关联任务统计视图
CREATE OR REPLACE VIEW meeting_tasks_stats AS
SELECT 
  m.id as meeting_id,
  m.title as meeting_title,
  m.meeting_type,
  m.status as meeting_status,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = '待处理' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN t.status = '进行中' THEN 1 END) as in_progress_tasks,
  COUNT(CASE WHEN t.status = '已完成' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN t.status = '已取消' THEN 1 END) as cancelled_tasks
FROM meetings m
LEFT JOIN tasks t ON t.meeting_id = m.id
GROUP BY m.id, m.title, m.meeting_type, m.status;

-- 查看有任务的会议
CREATE OR REPLACE VIEW meetings_with_tasks AS
SELECT 
  m.*,
  COUNT(t.id) as task_count
FROM meetings m
LEFT JOIN tasks t ON t.meeting_id = m.id
GROUP BY m.id
HAVING COUNT(t.id) > 0;

-- 4. 添加触发器自动同步状态
-- ============================================

-- 当会议取消时，自动取消关联的任务
CREATE OR REPLACE FUNCTION cancel_meeting_tasks()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = '已取消' AND OLD.status != '已取消' THEN
    UPDATE tasks 
    SET status = '已取消'
    WHERE meeting_id = NEW.id 
      AND status NOT IN ('已完成', '已取消');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器
DROP TRIGGER IF EXISTS trigger_cancel_meeting_tasks ON meetings;
CREATE TRIGGER trigger_cancel_meeting_tasks
AFTER UPDATE ON meetings
FOR EACH ROW
EXECUTE FUNCTION cancel_meeting_tasks();

-- 5. 验证数据完整性
-- ============================================

-- 检查外键约束
SELECT 
  'meeting_id 外键检查' as check_name,
  COUNT(*) as invalid_count
FROM tasks t
LEFT JOIN meetings m ON t.meeting_id = m.id
WHERE t.meeting_id IS NOT NULL AND m.id IS NULL;

-- 6. 辅助查询函数
-- ============================================

-- 获取任务的会议信息
CREATE OR REPLACE FUNCTION get_task_meeting(task_id_param INTEGER)
RETURNS TABLE (
  meeting_id INTEGER,
  meeting_title TEXT,
  meeting_type TEXT,
  meeting_status TEXT,
  start_time TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.title,
    m.meeting_type,
    m.status,
    m.start_time
  FROM tasks t
  LEFT JOIN meetings m ON t.meeting_id = m.id
  WHERE t.id = task_id_param;
END;
$$ LANGUAGE plpgsql;

-- 获取会议的所有任务
CREATE OR REPLACE FUNCTION get_meeting_tasks(meeting_id_param INTEGER)
RETURNS TABLE (
  task_id INTEGER,
  task_title TEXT,
  task_status TEXT,
  task_priority TEXT,
  task_due_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id::INTEGER,
    t.title,
    t.status,
    t.priority,
    t.due_date
  FROM tasks t
  WHERE t.meeting_id = meeting_id_param
  ORDER BY t.due_date NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- 7. 示例数据（可选）
-- ============================================

-- 示例：将某些任务关联到会议
/*
-- 假设有一个会议 ID = 1
UPDATE tasks 
SET meeting_id = 1 
WHERE id IN (3, 14, 18);  -- 关联3个任务到这个会议
*/

-- 8. 回滚脚本（紧急情况使用）
-- ============================================

/*
-- 如需回滚，执行以下脚本：

-- 删除触发器和函数
DROP TRIGGER IF EXISTS trigger_cancel_meeting_tasks ON meetings;
DROP FUNCTION IF EXISTS cancel_meeting_tasks();
DROP FUNCTION IF EXISTS get_task_meeting(INTEGER);
DROP FUNCTION IF EXISTS get_meeting_tasks(INTEGER);

-- 删除视图
DROP VIEW IF EXISTS meeting_tasks_stats;
DROP VIEW IF EXISTS meetings_with_tasks;

-- 删除索引
DROP INDEX IF EXISTS idx_tasks_meeting_id;
DROP INDEX IF EXISTS idx_tasks_domain_meeting;

-- 删除外键约束
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_tasks_meeting;

-- 删除字段
ALTER TABLE tasks DROP COLUMN IF EXISTS meeting_id;
*/

-- ============================================
-- 迁移完成
-- ============================================

SELECT 'Tasks表会议关联字段迁移完成！' as message;
SELECT '已添加: meeting_id' as field;
SELECT '已创建索引和视图以优化查询性能' as optimization;
SELECT '已添加触发器自动同步会议取消状态' as trigger_info;

