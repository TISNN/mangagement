/**
 * 学生端仪表盘实时数据 Hook
 * 提供实时同步和自动刷新功能
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getDashboardData, DashboardData } from '../services/studentDashboardService';

export function useDashboardRealtime(studentId?: number) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 获取学生ID
  const getStudentId = useCallback((): number | null => {
    if (studentId) return studentId;
    try {
      const stored = localStorage.getItem('currentStudent');
      if (stored) {
        const student = JSON.parse(stored);
        return student?.id || null;
      }
    } catch (error) {
      console.error('[useDashboardRealtime] 解析学生ID失败:', error);
    }
    return null;
  }, [studentId]);
  
  // 加载数据
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sid = getStudentId();
      if (!sid) {
        setError('无法获取学生ID');
        setLoading(false);
        return;
      }
      
      const dashboardData = await getDashboardData(sid);
      if (dashboardData) {
        setData(dashboardData);
      } else {
        setError('获取数据失败');
      }
    } catch (err) {
      console.error('[useDashboardRealtime] 加载数据失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  }, [getStudentId]);
  
  // 刷新任务统计 - 移除对 data 的依赖，使用函数式更新
  const refreshTaskStats = useCallback(async () => {
    const sid = getStudentId();
    if (!sid) return;
    
    try {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, status, priority, due_date')
        .contains('assigned_to', [sid])
        .in('status', ['待处理', '进行中', '已完成']);
      
      if (tasks) {
        // 转换状态格式
        const normalizedTasks = tasks.map(task => ({
          ...task,
          status: task.status === '待处理' ? 'pending' :
                  task.status === '进行中' ? 'in_progress' :
                  task.status === '已完成' ? 'completed' : task.status,
          priority: task.priority === '高' ? 'high' :
                    task.priority === '中' ? 'medium' :
                    task.priority === '低' ? 'low' : task.priority,
        }));
        
        // 重新聚合任务统计
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // 本周一
        
        const todayTasks = normalizedTasks.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        
        const weekTasks = normalizedTasks.filter(task => {
          if (!task.due_date) return false;
          const dueDate = new Date(task.due_date);
          return dueDate >= weekStart && dueDate <= today;
        });
        
        const overdueTasks = normalizedTasks.filter(task => {
          if (!task.due_date || task.status === 'completed') return false;
          const dueDate = new Date(task.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today;
        });
        
        const taskStats = {
          today: {
            total: todayTasks.length,
            highPriority: todayTasks.filter(t => t.priority === 'high').length,
            mediumPriority: todayTasks.filter(t => t.priority === 'medium').length,
            lowPriority: todayTasks.filter(t => t.priority === 'low').length,
          },
          thisWeek: {
            total: weekTasks.length,
            byStatus: {
              pending: weekTasks.filter(t => t.status === 'pending').length,
              inProgress: weekTasks.filter(t => t.status === 'in_progress').length,
              completed: weekTasks.filter(t => t.status === 'completed').length,
            },
          },
          overdue: {
            total: overdueTasks.length,
            items: overdueTasks.map(task => ({
              id: task.id,
              title: task.title,
              daysOverdue: Math.ceil((today.getTime() - new Date(task.due_date).getTime()) / (1000 * 60 * 60 * 24)),
            })),
          },
        };
        
        setData(prev => prev ? { ...prev, taskStats } : null);
      }
    } catch (err) {
      console.error('[useDashboardRealtime] 刷新任务统计失败:', err);
    }
  }, [getStudentId]);
  
  // 刷新材料统计 - 移除对 data 的依赖
  const refreshMaterialStats = useCallback(async () => {
    const sid = getStudentId();
    if (!sid) return;
    
    try {
      const { data: materials } = await supabase
        .from('application_documents_checklist')
        .select('id, document_name, status, due_date, progress')
        .eq('student_id', sid);
      
      if (materials) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const materialStats = {
          total: materials.length,
          pendingUpload: materials.filter(m => m.status === '未完成' || m.status === 'pending').length,
          pendingReview: materials.filter(m => m.status === '待审核' || m.status === 'under_review').length,
          completed: materials.filter(m => m.status === '已完成' || m.status === 'completed').length,
          urgent: materials
            .filter(m => {
              if (!m.due_date || m.status === '已完成' || m.status === 'completed') return false;
              const dueDate = new Date(m.due_date);
              const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return daysRemaining <= 3 && daysRemaining >= 0;
            })
            .map(m => ({
              id: m.id,
              name: m.document_name || '未知材料',
              dueDate: m.due_date,
              daysRemaining: Math.ceil((new Date(m.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
            })),
          completionRate: materials.length > 0
            ? Math.round((materials.filter(m => m.status === '已完成' || m.status === 'completed').length / materials.length) * 100)
            : 0,
        };
        
        setData(prev => prev ? { ...prev, materialStats } : null);
      }
    } catch (err) {
      console.error('[useDashboardRealtime] 刷新材料统计失败:', err);
    }
  }, [getStudentId]);
  
  // 刷新文书统计 - 从材料表中筛选文书类型，移除对 data 的依赖
  const refreshDocumentStats = useCallback(async () => {
    const sid = getStudentId();
    if (!sid) return;
    
    try {
      const { data: materials } = await supabase
        .from('application_documents_checklist')
        .select('id, document_name, document_type, status, updated_at')
        .eq('student_id', sid)
        .order('updated_at', { ascending: false }); // 按更新时间排序，获取最新的
      
      if (materials) {
        // 筛选文书类型的材料
        const docTypes = ['个人陈述', '推荐信', '简历', 'CV', 'PS', 'Essay', 'personal_statement', 'recommendation', 'resume'];
        const documents = materials.filter(m => {
          return docTypes.some(type => 
            (m.document_name && m.document_name.includes(type)) ||
            (m.document_type && m.document_type.includes(type))
          );
        });
        
        const documentStats = {
          total: documents.length,
          pendingFeedback: documents.filter(d => d.status === '待反馈' || d.status === 'pending_feedback' || d.status === '待审核').length,
          inProgress: documents.filter(d => d.status === '进行中' || d.status === 'in_progress' || d.status === '未完成').length,
          pendingReview: documents.filter(d => d.status === '待审核' || d.status === 'under_review').length,
          finalized: documents.filter(d => d.status === '已完成' || d.status === 'completed' || d.status === '已定稿').length,
          latestUpdate: documents.length > 0 && documents[0].updated_at
            ? {
                documentId: documents[0].id,
                documentType: documents[0].document_type || documents[0].document_name || '未知类型',
                updatedAt: documents[0].updated_at,
                minutesAgo: Math.floor((Date.now() - new Date(documents[0].updated_at).getTime()) / (1000 * 60)),
              }
            : (documents.length > 0 ? {
                documentId: documents[0].id,
                documentType: documents[0].document_name || '未知类型',
                updatedAt: documents[0].updated_at || new Date().toISOString(),
                minutesAgo: 0,
              } : null),
        };
        
        setData(prev => prev ? { ...prev, documentStats } : null);
      }
    } catch (err) {
      console.error('[useDashboardRealtime] 刷新文书统计失败:', err);
    }
  }, [getStudentId]);
  
  useEffect(() => {
    const sid = getStudentId();
    if (!sid) {
      setLoading(false);
      setError('无法获取学生ID');
      return;
    }
    
    // 初始加载
    loadDashboardData();
    
    // 订阅任务变化 - assigned_to 是数组，无法直接过滤，需要全量订阅后过滤
    const taskChannel = supabase
      .channel(`student-tasks-${sid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload) => {
          // 检查任务是否分配给当前学生
          const task = payload.new as any;
          if (task && Array.isArray(task.assigned_to) && task.assigned_to.includes(sid)) {
            console.log('[useDashboardRealtime] 任务变化:', payload);
            // 任务变化会影响待办列表、截止日期、活动时间线，重新加载全部数据
            loadDashboardData();
          }
        }
      )
      .subscribe();
    
    // 订阅材料变化
    const materialChannel = supabase
      .channel(`student-materials-${sid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'application_documents_checklist',
          filter: `student_id=eq.${sid}`,
        },
        (payload) => {
          console.log('[useDashboardRealtime] 材料变化:', payload);
          // 材料变化会影响材料统计、文书统计、截止日期、活动时间线、最近文件，重新加载全部数据
          loadDashboardData();
        }
      )
      .subscribe();
    
    // 订阅文书变化 - 文书数据在材料表中，通过材料表订阅
    // 文书变化会触发材料表更新，所以不需要单独订阅
    
    // 订阅选校变化
    const schoolChannel = supabase
      .channel(`student-schools-${sid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'final_university_choices',
          filter: `student_id=eq.${sid}`,
        },
        (payload) => {
          console.log('[useDashboardRealtime] 选校变化:', payload);
          loadDashboardData(); // 选校变化会影响多个数据，重新加载全部
        }
      )
      .subscribe();
    
    // 订阅会议变化
    const meetingChannel = supabase
      .channel(`student-meetings-${sid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_meetings',
          filter: `student_id=eq.${sid}`,
        },
        (payload) => {
          console.log('[useDashboardRealtime] 会议变化:', payload);
          loadDashboardData(); // 会议变化会影响活动时间线和会议列表，重新加载全部
        }
      )
      .subscribe();
    
    return () => {
      taskChannel.unsubscribe();
      materialChannel.unsubscribe();
      schoolChannel.unsubscribe();
      meetingChannel.unsubscribe();
    };
  }, [getStudentId, loadDashboardData, refreshTaskStats, refreshMaterialStats, refreshDocumentStats]); // 这些函数现在只依赖 getStudentId，不会导致无限循环
  
  return {
    data,
    loading,
    error,
    refresh: loadDashboardData,
  };
}

