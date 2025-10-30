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

  const loadTasks = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
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
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  /**
   * 乐观更新单个任务
   * 先更新本地状态，后台同步到服务器
   */
  const optimisticUpdateTask = (taskId: string, updates: Partial<UITask>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates }
          : task
      )
    );
  };

  /**
   * 乐观添加任务
   */
  const optimisticAddTask = (newTask: UITask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  /**
   * 乐观删除任务
   */
  const optimisticDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  /**
   * 静默刷新（后台刷新，不显示loading）
   */
  const silentReload = () => loadTasks(false);

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    setTasks,
    loading,
    error,
    reload: loadTasks,
    silentReload,
    optimisticUpdateTask,
    optimisticAddTask,
    optimisticDeleteTask,
  };
}

