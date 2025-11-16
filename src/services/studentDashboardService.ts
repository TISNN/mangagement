/**
 * 学生端仪表盘数据服务
 * 提供仪表盘所需的所有数据查询和聚合功能
 */

import { supabase } from '../lib/supabase';

// 申请阶段枚举
export type ApplicationStage = 
  | 'evaluation' 
  | 'schoolSelection' 
  | 'preparation' 
  | 'submission' 
  | 'interview' 
  | 'decision' 
  | 'visa';

// 仪表盘数据类型定义
export interface DashboardData {
  // 申请进度
  applicationProgress: {
    currentStage: ApplicationStage;
    currentStageIndex: number;
    totalStages: number;
    progressPercentage: number;
    nextDeadline: {
      date: string;
      description: string;
      daysRemaining: number;
      isUrgent: boolean;
    } | null;
    blockingReasons: string[];
  };
  
  // 待办事项统计
  taskStats: {
    today: {
      total: number;
      highPriority: number;
      mediumPriority: number;
      lowPriority: number;
    };
    thisWeek: {
      total: number;
      byStatus: {
        pending: number;
        inProgress: number;
        completed: number;
      };
    };
    overdue: {
      total: number;
      items: Array<{
        id: number;
        title: string;
        daysOverdue: number;
      }>;
    };
  };
  
  // 材料状态统计
  materialStats: {
    total: number;
    pendingUpload: number;
    pendingReview: number;
    completed: number;
    urgent: Array<{
      id: number;
      name: string;
      dueDate: string;
      daysRemaining: number;
    }>;
    completionRate: number;
  };
  
  // 文书状态统计
  documentStats: {
    total: number;
    pendingFeedback: number;
    inProgress: number;
    pendingReview: number;
    finalized: number;
    latestUpdate: {
      documentId: number;
      documentType: string;
      updatedAt: string;
      minutesAgo: number;
    } | null;
  };
  
  // 选校列表统计
  schoolSelectionStats: {
    total: number;
    confirmed: number;
    byType: {
      reach: number;
      target: number;
      safety: number;
    };
    nearestDeadline: {
      schoolId: number;
      schoolName: string;
      programName: string;
      deadline: string;
      daysRemaining: number;
    } | null;
  };
  
  // 待办事项列表（最近5个）
  upcomingTasks: Array<{
    id: number;
    title: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string | null;
    daysRemaining: number;
    status: 'pending' | 'in_progress' | 'completed';
  }>;
  
  // 即将到来的截止日期（未来7天）
  upcomingDeadlines: Array<{
    id: number;
    type: 'task' | 'material' | 'school';
    title: string;
    deadline: string;
    daysRemaining: number;
    isUrgent: boolean;
    description?: string;
  }>;
  
  // 最近活动时间线
  recentActivities: Array<{
    id: string;
    type: 'task' | 'material' | 'document' | 'meeting' | 'school';
    action: string;
    description: string;
    timestamp: string;
    minutesAgo: number;
    link?: string;
  }>;
  
  // 最近上传的文件
  recentFiles: Array<{
    id: number;
    name: string;
    type: string;
    uploadedAt: string;
    minutesAgo: number;
    fileUrl: string | null;
    status: string;
  }>;
  
  // 最近会议记录
  recentMeetings: Array<{
    id: number;
    title: string;
    meetingType: string | null;
    startTime: string;
    endTime: string | null;
    status: string | null;
    participants: string[] | null;
    meetingLink: string | null;
    daysAgo: number;
  }>;
}

/**
 * 获取学生ID（从localStorage或auth context）
 */
function getStudentId(): number | null {
  try {
    const stored = localStorage.getItem('currentStudent');
    if (stored) {
      const student = JSON.parse(stored);
      return student?.id || null;
    }
  } catch (error) {
    console.error('[StudentDashboardService] 解析学生ID失败:', error);
  }
  return null;
}

/**
 * 计算进度百分比
 */
function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * 判断截止日期是否紧急（3天内）
 */
function isUrgentDeadline(deadline: string | null): boolean {
  if (!deadline) return false;
  const dueDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return daysRemaining <= 3 && daysRemaining >= 0;
}

/**
 * 计算剩余天数
 */
function getDaysRemaining(deadline: string | null): number {
  if (!deadline) return Infinity;
  const dueDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * 聚合任务统计
 */
function aggregateTaskStats(tasks: any[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // 本周一
  
  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime();
  });
  
  const weekTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = new Date(task.due_date);
    return dueDate >= weekStart && dueDate <= today;
  });
  
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  });
  
  return {
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
}

/**
 * 获取仪表盘数据
 */
export async function getDashboardData(studentId?: number): Promise<DashboardData | null> {
  try {
    const sid = studentId || getStudentId();
    if (!sid) {
      console.error('[StudentDashboardService] 无法获取学生ID');
      return null;
    }
    
    console.log('[StudentDashboardService] 开始获取仪表盘数据，学生ID:', sid);
    
    // 并行查询所有数据源
    const [
      tasksResult,
      materialsResult,
      schoolChoicesResult,
      meetingsResult
    ] = await Promise.all([
      // 任务统计 - assigned_to 是数组类型，使用 contains 查询
      supabase
        .from('tasks')
        .select('id, title, status, priority, due_date, updated_at')
        .contains('assigned_to', [sid])
        .in('status', ['待处理', '进行中', '已完成']),
      
      // 材料统计 - 包含所有需要的字段
      supabase
        .from('application_documents_checklist')
        .select('id, document_name, document_type, status, due_date, progress, updated_at, file_url')
        .eq('student_id', sid),
      
      // 选校统计
      supabase
        .from('final_university_choices')
        .select('id, school_name, program_name, application_type, application_deadline, submission_status, updated_at')
        .eq('student_id', sid),
      
      // 会议记录
      supabase
        .from('student_meetings')
        .select('id, title, meeting_type, start_time, end_time, status, participants, meeting_link')
        .eq('student_id', sid)
        .order('start_time', { ascending: false })
        .limit(5)
    ]);
    
    // 处理错误
    if (tasksResult.error) console.error('[StudentDashboardService] 任务查询失败:', tasksResult.error);
    if (materialsResult.error) console.error('[StudentDashboardService] 材料查询失败:', materialsResult.error);
    if (schoolChoicesResult.error) console.error('[StudentDashboardService] 选校查询失败:', schoolChoicesResult.error);
    if (meetingsResult.error) console.error('[StudentDashboardService] 会议查询失败:', meetingsResult.error);
    
    const tasks = tasksResult.data || [];
    const materials = materialsResult.data || [];
    const schoolChoices = schoolChoicesResult.data || [];
    const meetings = meetingsResult.data || [];
    
    // 文书统计：从材料表中筛选文书类型的材料
    const documents = materials.filter(m => {
      const docTypes = ['个人陈述', '推荐信', '简历', 'CV', 'PS', 'Essay', 'personal_statement', 'recommendation', 'resume'];
      return docTypes.some(type => 
        (m.document_name && m.document_name.includes(type)) ||
        (m.document_type && m.document_type.includes(type))
      );
    });
    
    // 聚合任务统计 - 需要转换状态格式
    const normalizedTasks = tasks.map(task => ({
      ...task,
      status: task.status === '待处理' ? 'pending' :
              task.status === '进行中' ? 'in_progress' :
              task.status === '已完成' ? 'completed' : task.status,
      priority: task.priority === '高' ? 'high' :
                task.priority === '中' ? 'medium' :
                task.priority === '低' ? 'low' : task.priority,
    }));
    const taskStats = aggregateTaskStats(normalizedTasks);
    
    // 聚合材料统计
    const materialStats = {
      total: materials.length,
      pendingUpload: materials.filter(m => m.status === '未完成' || m.status === 'pending').length,
      pendingReview: materials.filter(m => m.status === '待审核' || m.status === 'under_review').length,
      completed: materials.filter(m => m.status === '已完成' || m.status === 'completed').length,
      urgent: materials
        .filter(m => {
          if (!m.due_date || m.status === '已完成' || m.status === 'completed') return false;
          return isUrgentDeadline(m.due_date);
        })
        .map(m => ({
          id: m.id,
          name: m.document_name || '未知材料',
          dueDate: m.due_date,
          daysRemaining: getDaysRemaining(m.due_date),
        })),
      completionRate: materials.length > 0 
        ? calculateProgress(
            materials.filter(m => m.status === '已完成' || m.status === 'completed').length,
            materials.length
          )
        : 0,
    };
    
    // 聚合文书统计 - 从材料表中筛选文书类型
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
    
    // 聚合选校统计
    const schoolSelectionStats = {
      total: schoolChoices.length,
      confirmed: schoolChoices.filter(c => c.submission_status === '已投递' || c.submission_status === '已确认').length,
      byType: {
        reach: schoolChoices.filter(c => c.application_type === '冲刺' || c.application_type === 'reach').length,
        target: schoolChoices.filter(c => c.application_type === '目标' || c.application_type === 'target').length,
        safety: schoolChoices.filter(c => c.application_type === '保底' || c.application_type === 'safety').length,
      },
      nearestDeadline: (() => {
        const upcoming = schoolChoices
          .filter(c => c.application_deadline && (c.submission_status === '未投递' || !c.submission_status))
          .sort((a, b) => {
            const dateA = a.application_deadline ? new Date(a.application_deadline).getTime() : Infinity;
            const dateB = b.application_deadline ? new Date(b.application_deadline).getTime() : Infinity;
            return dateA - dateB;
          });
        
        if (upcoming.length === 0 || !upcoming[0].application_deadline) return null;
        
        const nearest = upcoming[0];
        return {
          schoolId: nearest.id,
          schoolName: nearest.school_name || '未知学校',
          programName: nearest.program_name || '未知专业',
          deadline: nearest.application_deadline,
          daysRemaining: getDaysRemaining(nearest.application_deadline),
        };
      })(),
    };
    
    // 计算申请进度（基于选校状态）
    const stages: ApplicationStage[] = [
      'evaluation',
      'schoolSelection',
      'preparation',
      'submission',
      'interview',
      'decision',
      'visa',
    ];
    
    // 简单的进度计算：基于选校状态
    let currentStageIndex = 0;
    if (schoolChoices.length > 0) {
      const hasSubmitted = schoolChoices.some(c => c.submission_status === '已投递' || c.submission_status === '审核中');
      const hasAccepted = schoolChoices.some(c => c.submission_status === '已录取');
      
      if (hasAccepted) {
        currentStageIndex = 5; // decision
      } else if (hasSubmitted) {
        currentStageIndex = 3; // submission
      } else if (schoolChoices.length > 0) {
        currentStageIndex = 2; // preparation
      } else {
        currentStageIndex = 1; // schoolSelection
      }
    }
    
    const applicationProgress = {
      currentStage: stages[currentStageIndex] as ApplicationStage,
      currentStageIndex,
      totalStages: stages.length,
      progressPercentage: calculateProgress(currentStageIndex + 1, stages.length),
      nextDeadline: schoolSelectionStats.nearestDeadline
        ? {
            date: schoolSelectionStats.nearestDeadline.deadline,
            description: `${schoolSelectionStats.nearestDeadline.schoolName} ${schoolSelectionStats.nearestDeadline.programName} 申请截止`,
            daysRemaining: schoolSelectionStats.nearestDeadline.daysRemaining,
            isUrgent: isUrgentDeadline(schoolSelectionStats.nearestDeadline.deadline),
          }
        : null,
      blockingReasons: [
        ...(materialStats.urgent.length > 0 ? [`${materialStats.urgent.length}个材料即将到期`] : []),
        ...(taskStats.overdue.total > 0 ? [`${taskStats.overdue.total}个任务已逾期`] : []),
      ],
    };
    
    // 生成待办事项列表（最近5个，按优先级和截止日期排序）
    const upcomingTasks = normalizedTasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => {
        // 先按优先级排序（高>中>低）
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        // 再按截止日期排序（早的在前）
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      })
      .slice(0, 5)
      .map(task => ({
        id: task.id,
        title: task.title,
        priority: task.priority as 'high' | 'medium' | 'low',
        dueDate: task.due_date,
        daysRemaining: task.due_date ? getDaysRemaining(task.due_date) : Infinity,
        status: task.status as 'pending' | 'in_progress' | 'completed',
      }));
    
    // 生成即将到来的截止日期（未来7天）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(today.getDate() + 7);
    
    const upcomingDeadlines: DashboardData['upcomingDeadlines'] = [];
    
    // 任务截止日期
    normalizedTasks.forEach(task => {
      if (task.due_date && task.status !== 'completed') {
        const dueDate = new Date(task.due_date);
        if (dueDate >= today && dueDate <= sevenDaysLater) {
          upcomingDeadlines.push({
            id: task.id,
            type: 'task',
            title: task.title,
            deadline: task.due_date,
            daysRemaining: getDaysRemaining(task.due_date),
            isUrgent: isUrgentDeadline(task.due_date),
            description: `任务：${task.title}`,
          });
        }
      }
    });
    
    // 材料截止日期
    materials.forEach(material => {
      if (material.due_date && material.status !== '已完成' && material.status !== 'completed') {
        const dueDate = new Date(material.due_date);
        if (dueDate >= today && dueDate <= sevenDaysLater) {
          upcomingDeadlines.push({
            id: material.id,
            type: 'material',
            title: material.document_name || '未知材料',
            deadline: material.due_date,
            daysRemaining: getDaysRemaining(material.due_date),
            isUrgent: isUrgentDeadline(material.due_date),
            description: `材料：${material.document_name}`,
          });
        }
      }
    });
    
    // 选校申请截止日期
    schoolChoices.forEach(choice => {
      if (choice.application_deadline && 
          (choice.submission_status === '未投递' || !choice.submission_status)) {
        const dueDate = new Date(choice.application_deadline);
        if (dueDate >= today && dueDate <= sevenDaysLater) {
          upcomingDeadlines.push({
            id: choice.id,
            type: 'school',
            title: `${choice.school_name} - ${choice.program_name}`,
            deadline: choice.application_deadline,
            daysRemaining: getDaysRemaining(choice.application_deadline),
            isUrgent: isUrgentDeadline(choice.application_deadline),
            description: `申请截止：${choice.school_name}`,
          });
        }
      }
    });
    
    // 按截止日期排序
    upcomingDeadlines.sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
    
    // 生成最近活动时间线
    const recentActivities: DashboardData['recentActivities'] = [];
    const now = Date.now();
    
    // 任务活动
    normalizedTasks.forEach(task => {
      if (task.updated_at) {
        const updatedAt = new Date(task.updated_at);
        const minutesAgo = Math.floor((now - updatedAt.getTime()) / (1000 * 60));
        if (minutesAgo < 7 * 24 * 60) { // 最近7天
          recentActivities.push({
            id: `task-${task.id}`,
            type: 'task',
            action: task.status === 'completed' ? '完成任务' : task.status === 'in_progress' ? '开始任务' : '创建任务',
            description: task.title,
            timestamp: task.updated_at,
            minutesAgo,
            link: `/student/tasks#${task.id}`,
          });
        }
      }
    });
    
    // 材料活动
    materials.forEach(material => {
      if (material.updated_at) {
        const updatedAt = new Date(material.updated_at);
        const minutesAgo = Math.floor((now - updatedAt.getTime()) / (1000 * 60));
        if (minutesAgo < 7 * 24 * 60) {
          let action = '更新材料';
          if (material.status === '已完成' || material.status === 'completed') {
            action = '完成材料';
          } else if (material.file_url) {
            action = '上传材料';
          }
          recentActivities.push({
            id: `material-${material.id}`,
            type: 'material',
            action,
            description: material.document_name || '未知材料',
            timestamp: material.updated_at,
            minutesAgo,
            link: `/student/materials#${material.id}`,
          });
        }
      }
    });
    
    // 选校活动
    schoolChoices.forEach(choice => {
      if (choice.updated_at) {
        const updatedAt = new Date(choice.updated_at);
        const minutesAgo = Math.floor((now - updatedAt.getTime()) / (1000 * 60));
        if (minutesAgo < 7 * 24 * 60) {
          recentActivities.push({
            id: `school-${choice.id}`,
            type: 'school',
            action: '更新选校',
            description: `${choice.school_name} - ${choice.program_name}`,
            timestamp: choice.updated_at,
            minutesAgo,
            link: `/student/school-selection#${choice.id}`,
          });
        }
      }
    });
    
    // 会议活动
    meetings.forEach(meeting => {
      const startTime = new Date(meeting.start_time);
      const minutesAgo = Math.floor((now - startTime.getTime()) / (1000 * 60));
      if (minutesAgo < 7 * 24 * 60) {
        recentActivities.push({
          id: `meeting-${meeting.id}`,
          type: 'meeting',
          action: meeting.status === '已完成' ? '完成会议' : meeting.status === '进行中' ? '进行会议' : '安排会议',
          description: meeting.title,
          timestamp: meeting.start_time,
          minutesAgo,
          link: `/student/meetings#${meeting.id}`,
        });
      }
    });
    
    // 按时间排序（最新的在前）
    recentActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // 生成最近上传的文件（最近5个）
    const recentFiles = materials
      .filter(m => m.file_url && m.updated_at)
      .sort((a, b) => 
        new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
      )
      .slice(0, 5)
      .map(material => {
        const updatedAt = new Date(material.updated_at || '');
        const minutesAgo = Math.floor((now - updatedAt.getTime()) / (1000 * 60));
        return {
          id: material.id,
          name: material.document_name || '未知文件',
          type: material.document_type || '未知类型',
          uploadedAt: material.updated_at || '',
          minutesAgo,
          fileUrl: material.file_url,
          status: material.status || '未知',
        };
      });
    
    // 生成最近会议记录（最近5个）
    const recentMeetings = meetings.map(meeting => {
      const startTime = new Date(meeting.start_time);
      const daysAgo = Math.floor((now - startTime.getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: meeting.id,
        title: meeting.title,
        meetingType: meeting.meeting_type,
        startTime: meeting.start_time,
        endTime: meeting.end_time,
        status: meeting.status,
        participants: meeting.participants,
        meetingLink: meeting.meeting_link,
        daysAgo,
      };
    });
    
    const dashboardData: DashboardData = {
      applicationProgress,
      taskStats,
      materialStats,
      documentStats,
      schoolSelectionStats,
      upcomingTasks,
      upcomingDeadlines: upcomingDeadlines.slice(0, 10), // 最多显示10个
      recentActivities: recentActivities.slice(0, 10), // 最多显示10个
      recentFiles,
      recentMeetings,
    };
    
    console.log('[StudentDashboardService] 仪表盘数据获取成功:', dashboardData);
    return dashboardData;
  } catch (error) {
    console.error('[StudentDashboardService] 获取仪表盘数据失败:', error);
    return null;
  }
}

