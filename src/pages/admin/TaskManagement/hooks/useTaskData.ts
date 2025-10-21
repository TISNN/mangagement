/**
 * 任务数据管理Hook
 * 负责从Supabase加载任务数据
 */

import { useState, useEffect } from 'react';
import taskService from '../../../../services/taskService';
import { convertDbTaskToUiTask } from '../utils/taskMappers';
import { UITask } from '../types/task.types';

export function useTaskData() {
  const [tasks, setTasks] = useState<UITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[useTaskData] 开始加载任务...');
      
      const dbTasks = await taskService.getAllTasks();
      console.log('[useTaskData] 加载到任务数量:', dbTasks.length);
      
      const uiTasks = dbTasks.map(convertDbTaskToUiTask);
      setTasks(uiTasks);
      
      console.log('[useTaskData] 任务加载成功');
    } catch (err) {
      console.error('[useTaskData] 加载任务失败:', err);
      setError('加载任务失败,请刷新重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    reload: loadTasks,
  };
}

