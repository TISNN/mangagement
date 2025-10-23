/**
 * Dashboard 数据管理 Hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardStats,
  getDashboardTasks,
  getDashboardActivities,
  getDashboardEvents,
  toggleTaskCompletion,
} from '../services/dashboardService';
import {
  DashboardStats,
  DashboardTask,
  DashboardActivity,
  DashboardEvent,
} from '../types/dashboard.types';

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载所有数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, tasksData, activitiesData, eventsData] = await Promise.all([
        getDashboardStats(),
        getDashboardTasks(),
        getDashboardActivities(5),
        getDashboardEvents(),
      ]);

      setStats(statsData);
      setTasks(tasksData);
      setActivities(activitiesData);
      setEvents(eventsData);
    } catch (err) {
      console.error('加载Dashboard数据失败:', err);
      setError('加载数据失败，请刷新重试');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 切换任务完成状态
  const handleToggleTask = useCallback(async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;
    
    // 乐观更新UI
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === taskId ? { ...t, completed: newCompleted } : t
      )
    );

    // 更新数据库
    const success = await toggleTaskCompletion(taskId, newCompleted);
    
    if (!success) {
      // 如果失败，回滚UI
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, completed: task.completed } : t
        )
      );
    }
  }, [tasks]);

  // 刷新统计数据
  const refreshStats = useCallback(async () => {
    const statsData = await getDashboardStats();
    setStats(statsData);
  }, []);

  // 刷新任务列表
  const refreshTasks = useCallback(async () => {
    const tasksData = await getDashboardTasks();
    setTasks(tasksData);
  }, []);

  // 刷新动态
  const refreshActivities = useCallback(async () => {
    const activitiesData = await getDashboardActivities(5);
    setActivities(activitiesData);
  }, []);

  return {
    stats,
    tasks,
    activities,
    events,
    loading,
    error,
    loadData,
    handleToggleTask,
    refreshStats,
    refreshTasks,
    refreshActivities,
  };
}

