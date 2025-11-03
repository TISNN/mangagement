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
    student: null, // 学生筛选
    meeting: null, // 会议筛选
    tag: null,
    timeView: 'all',
    domain: null, // 任务域筛选
    relatedEntityType: null, // 关联对象类型筛选
  });

  /**
   * 根据筛选条件过滤任务
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. 搜索过滤（标题、描述、学生人名）
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          (task.relatedStudent?.name && task.relatedStudent.name.toLowerCase().includes(searchLower));
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

      // 5. 学生过滤（新增）
      if (filters.student) {
        if (!task.relatedStudent || task.relatedStudent.id !== filters.student) {
          return false;
        }
      }

      // 6. 标签过滤
      if (filters.tag && !task.tags.includes(filters.tag)) {
        return false;
      }

      // 7. 任务域过滤（新增）
      if (filters.domain && task.domain !== filters.domain) {
        return false;
      }

      // 8. 关联对象类型过滤
      if (filters.relatedEntityType) {
        if (!task.relatedEntityType || task.relatedEntityType !== filters.relatedEntityType) {
          return false;
        }
      }

      // 9. 会议过滤（新增）
      if (filters.meeting) {
        if (!task.relatedMeeting || task.relatedMeeting.id !== filters.meeting) {
          return false;
        }
      }

      // 10. 时间视图过滤
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
      student: null, // 重置学生筛选
      meeting: null, // 重置会议筛选
      tag: null,
      timeView: 'all',
      domain: null, // 重置任务域筛选
      relatedEntityType: null, // 重置关联对象类型筛选
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

  /**
   * 获取所有已关联的学生（去重）
   */
  const relatedStudents = useMemo(() => {
    const studentMap = new Map<string, { id: string; name: string; avatar: string | null; status?: string; is_active?: boolean }>();
    
    tasks.forEach(task => {
      if (task.relatedStudent) {
        // 使用Map确保每个学生只出现一次
        if (!studentMap.has(task.relatedStudent.id)) {
          studentMap.set(task.relatedStudent.id, task.relatedStudent);
        }
      }
    });
    
    // 转换为数组并按名称排序
    return Array.from(studentMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  /**
   * 获取所有已关联的会议（去重）
   */
  const relatedMeetings = useMemo(() => {
    const meetingMap = new Map<string, { id: string; title: string; meeting_type?: string; start_time?: string; status?: string }>();
    
    tasks.forEach(task => {
      if (task.relatedMeeting) {
        if (!meetingMap.has(task.relatedMeeting.id)) {
          meetingMap.set(task.relatedMeeting.id, task.relatedMeeting);
        }
      }
    });
    
    // 按开始时间倒序排列（最近的在前）
    return Array.from(meetingMap.values()).sort((a, b) => {
      if (!a.start_time || !b.start_time) return 0;
      return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
    });
  }, [tasks]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredTasks,
    allTags,
    relatedStudents, // 返回已关联的学生列表
    relatedMeetings, // 返回已关联的会议列表
  };
}

