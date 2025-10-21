/**
 * 任务筛选Hook
 * 负责任务的搜索和过滤逻辑
 */

import { useState, useMemo } from 'react';
import { UITask, TaskFilters } from '../types/task.types';

export function useTaskFilters(tasks: UITask[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: null,
    priority: null,
    assignee: null,
    tag: null,
    timeView: 'all',
  });

  /**
   * 根据筛选条件过滤任务
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. 搜索过滤
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // 2. 状态过滤
      if (filters.status && task.status !== filters.status) {
        return false;
      }

      // 3. 优先级过滤
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // 4. 负责人过滤
      if (filters.assignee) {
        if (!task.assignee || task.assignee.id !== filters.assignee) {
          return false;
        }
      }

      // 5. 标签过滤
      if (filters.tag && !task.tags.includes(filters.tag)) {
        return false;
      }

      // 6. 时间视图过滤
      if (filters.timeView !== 'all' && task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        switch (filters.timeView) {
          case 'today':
            if (dueDate.getTime() !== today.getTime()) return false;
            break;
          
          case 'tomorrow':
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            if (dueDate.getTime() !== tomorrow.getTime()) return false;
            break;
          
          case 'week':
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            if (dueDate < today || dueDate >= nextWeek) return false;
            break;
          
          case 'expired':
            if (dueDate >= today || task.status === '已完成' || task.status === '已取消') {
              return false;
            }
            break;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  /**
   * 更新单个筛选条件
   */
  const updateFilter = <K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * 重置所有筛选条件
   */
  const resetFilters = () => {
    setFilters({
      search: '',
      status: null,
      priority: null,
      assignee: null,
      tag: null,
      timeView: 'all',
    });
  };

  /**
   * 获取所有唯一的标签
   */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredTasks,
    allTags,
  };
}

