-- ============================================
-- 任务完成时同步会议状态 - 数据库触发器
-- 迁移编号: 003
-- 创建日期: 2025-11-02
-- 说明: 当任务完成时，自动检查并更新会议状态
-- ============================================

-- 1. 创建同步函数
-- ============================================

-- 当任务状态更新时，检查会议的所有任务状态
CREATE OR REPLACE FUNCTION sync_meeting_status_on_task_completion()
RETURNS TRIGGER AS $$
DECLARE
  related_meeting_id INTEGER;
  total_tasks INTEGER;
  completed_tasks INTEGER;
  cancelled_tasks INTEGER;
  in_progress_tasks INTEGER;
  pending_tasks INTEGER;
BEGIN
  -- 获取任务关联的会议ID
  related_meeting_id := NEW.meeting_id;
  
  -- 如果任务没有关联会议，直接返回
  IF related_meeting_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- 统计该会议的所有任务状态
  SELECT 
    COUNT(*),
    COUNT(CASE WHEN status = '已完成' THEN 1 END),
    COUNT(CASE WHEN status = '已取消' THEN 1 END),
    COUNT(CASE WHEN status = '进行中' THEN 1 END),
    COUNT(CASE WHEN status = '待处理' THEN 1 END)
  INTO 
    total_tasks,
    completed_tasks,
    cancelled_tasks,
    in_progress_tasks,
    pending_tasks
  FROM tasks
  WHERE meeting_id = related_meeting_id;
  
  -- 决定会议的新状态
  -- 逻辑：
  -- 1. 如果所有任务都完成 → 会议状态改为"已完成"
  -- 2. 如果所有任务都取消 → 会议状态改为"已取消"
  -- 3. 如果有任务在进行中 → 会议状态改为"进行中"
  -- 4. 如果只有待处理的任务 → 会议状态改为"待举行"
  
  IF total_tasks > 0 THEN
    IF completed_tasks = total_tasks THEN
      -- 所有任务都完成了
      UPDATE meetings 
      SET status = '已完成',
          updated_at = NOW()
      WHERE id = related_meeting_id 
        AND status != '已完成';  -- 避免重复更新
        
    ELSIF cancelled_tasks = total_tasks THEN
      -- 所有任务都取消了
      UPDATE meetings 
      SET status = '已取消',
          updated_at = NOW()
      WHERE id = related_meeting_id 
        AND status != '已取消';
        
    ELSIF in_progress_tasks > 0 THEN
      -- 有任务在进行中
      UPDATE meetings 
      SET status = '进行中',
          updated_at = NOW()
      WHERE id = related_meeting_id 
        AND status NOT IN ('进行中', '已完成');  -- 保护已完成的会议
        
    ELSIF pending_tasks > 0 AND completed_tasks = 0 AND in_progress_tasks = 0 THEN
      -- 只有待处理的任务
      UPDATE meetings 
      SET status = '待举行',
          updated_at = NOW()
      WHERE id = related_meeting_id 
        AND status NOT IN ('已完成', '进行中');
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 创建触发器
-- ============================================

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS trigger_sync_meeting_status ON tasks;

-- 创建新触发器
CREATE TRIGGER trigger_sync_meeting_status
AFTER INSERT OR UPDATE OF status, meeting_id ON tasks
FOR EACH ROW
EXECUTE FUNCTION sync_meeting_status_on_task_completion();

-- 3. 添加注释
-- ============================================

COMMENT ON FUNCTION sync_meeting_status_on_task_completion() IS 
'自动同步会议状态：当任务完成时，检查会议的所有任务，如果都完成则将会议状态改为已完成';

-- 4. 创建手动同步函数（可选）
-- ============================================

-- 手动同步指定会议的状态
CREATE OR REPLACE FUNCTION manual_sync_meeting_status(meeting_id_param INTEGER)
RETURNS TEXT AS $$
DECLARE
  total_tasks INTEGER;
  completed_tasks INTEGER;
  cancelled_tasks INTEGER;
  in_progress_tasks INTEGER;
  pending_tasks INTEGER;
  new_status TEXT;
BEGIN
  -- 统计任务状态
  SELECT 
    COUNT(*),
    COUNT(CASE WHEN status = '已完成' THEN 1 END),
    COUNT(CASE WHEN status = '已取消' THEN 1 END),
    COUNT(CASE WHEN status = '进行中' THEN 1 END),
    COUNT(CASE WHEN status = '待处理' THEN 1 END)
  INTO 
    total_tasks,
    completed_tasks,
    cancelled_tasks,
    in_progress_tasks,
    pending_tasks
  FROM tasks
  WHERE meeting_id = meeting_id_param;
  
  -- 没有任务，不更新
  IF total_tasks = 0 THEN
    RETURN '该会议没有关联任务，状态保持不变';
  END IF;
  
  -- 决定新状态
  IF completed_tasks = total_tasks THEN
    new_status := '已完成';
  ELSIF cancelled_tasks = total_tasks THEN
    new_status := '已取消';
  ELSIF in_progress_tasks > 0 THEN
    new_status := '进行中';
  ELSE
    new_status := '待举行';
  END IF;
  
  -- 更新会议状态
  UPDATE meetings 
  SET status = new_status,
      updated_at = NOW()
  WHERE id = meeting_id_param;
  
  RETURN format('会议状态已更新为: %s (共%s个任务: %s已完成, %s进行中, %s待处理, %s已取消)',
    new_status, total_tasks, completed_tasks, in_progress_tasks, pending_tasks, cancelled_tasks);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION manual_sync_meeting_status(INTEGER) IS 
'手动同步指定会议的状态，基于关联任务的完成情况';

-- 5. 使用示例
-- ============================================

/*
-- 手动同步某个会议的状态
SELECT manual_sync_meeting_status(123);  -- 123 是会议ID

-- 查看会议和任务状态
SELECT 
  m.id as meeting_id,
  m.title as meeting_title,
  m.status as meeting_status,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = '已完成' THEN 1 END) as completed_tasks,
  COUNT(CASE WHEN t.status = '进行中' THEN 1 END) as in_progress_tasks
FROM meetings m
LEFT JOIN tasks t ON t.meeting_id = m.id
WHERE m.id = 123
GROUP BY m.id, m.title, m.status;
*/

-- 6. 回滚脚本（紧急情况使用）
-- ============================================

/*
-- 如需回滚，执行以下脚本：

-- 删除触发器
DROP TRIGGER IF EXISTS trigger_sync_meeting_status ON tasks;

-- 删除函数
DROP FUNCTION IF EXISTS sync_meeting_status_on_task_completion();
DROP FUNCTION IF EXISTS manual_sync_meeting_status(INTEGER);
*/

-- ============================================
-- 迁移完成
-- ============================================

SELECT '✅ 任务完成同步会议状态功能已添加！' as message;
SELECT '触发器将在任务状态变更时自动执行' as info;

