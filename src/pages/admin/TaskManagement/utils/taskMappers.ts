/**
 * 任务数据转换工具函数
 */

import { Task as DbTask } from '../../../../services/taskService';
import { TaskDomain, TaskRelatedEntityType, UITask } from '../types/task.types';

/**
 * 将数据库任务格式转换为UI任务格式
 */
export function convertDbTaskToUiTask(dbTask: DbTask): UITask {
  // 处理多个负责人
  const assignees = dbTask.assignees && dbTask.assignees.length > 0 
    ? dbTask.assignees.map(assignee => ({
        id: String(assignee.id),
        name: assignee.name,
        avatar: assignee.avatar_url || 'https://via.placeholder.com/150',
        role: assignee.position || '员工'
      }))
    : [];

  const relatedStudent = dbTask.student ? {
    id: String(dbTask.student.id),
    name: dbTask.student.name,
    avatar: dbTask.student.avatar_url, // 保持原始值，让组件层处理默认值
    status: dbTask.student.status || undefined,
    is_active: dbTask.student.is_active || undefined
  } : null;

  const relatedLead = dbTask.lead ? {
    id: String(dbTask.lead.id),
    name: dbTask.lead.name,
    status: dbTask.lead.status || undefined,
  } : null;

  const relatedMeeting = dbTask.meeting ? {
    id: String(dbTask.meeting.id),
    title: dbTask.meeting.title,
    meeting_type: dbTask.meeting.meeting_type,
    status: dbTask.meeting.status,
    start_time: dbTask.meeting.start_time,
  } : null;

  const domain = (dbTask.task_domain as TaskDomain) ||
    (dbTask.related_student_id ? 'student_success' :
      dbTask.related_lead_id ? 'marketing' : 'general');

  const linkedEntityType = (dbTask.linked_entity_type as TaskRelatedEntityType) ||
    (relatedStudent ? 'student' : relatedLead ? 'lead' : 'none');

  const linkedEntityId = dbTask.linked_entity_id !== null && dbTask.linked_entity_id !== undefined
    ? String(dbTask.linked_entity_id)
    : linkedEntityType === 'student'
      ? relatedStudent?.id || null
      : linkedEntityType === 'lead'
        ? relatedLead?.id || null
        : null;

  const linkedEntityName =
    linkedEntityType === 'student'
      ? relatedStudent?.name || null
      : linkedEntityType === 'lead'
        ? relatedLead?.name || null
        : null;

  // 为了向后兼容，保留第一个负责人作为assignee
  const firstAssignee = assignees.length > 0 ? assignees[0] : null;

  return {
    id: String(dbTask.id),
    title: dbTask.title,
    description: dbTask.description || '',
    assignees,
    assignee: firstAssignee, // 向后兼容
    relatedStudent,
    relatedLead,
    relatedMeeting, // 添加会议关联
    domain,
    relatedEntityType: linkedEntityType,
    relatedEntityId: linkedEntityId,
    relatedEntityName: linkedEntityName,
    startDate: dbTask.start_date ? dbTask.start_date.split('T')[0] : '', // 开始日期使用start_date字段
    dueDate: dbTask.due_date ? dbTask.due_date.split('T')[0] : '',        // 截止日期
    priority: dbTask.priority,
    status: dbTask.status,
    tags: dbTask.tags || [],
    createdAt: dbTask.created_at.split('T')[0],
    updatedAt: dbTask.updated_at.split('T')[0],
  };
}

/**
 * 将UI优先级转换为数据库优先级
 */
export function convertUiPriorityToDb(priority: string): '高' | '中' | '低' {
  if (priority === 'high' || priority === 'urgent') return '高';
  if (priority === 'medium') return '中';
  return '低';
}

/**
 * 将UI状态转换为数据库状态
 */
export function convertUiStatusToDb(status: string): '待处理' | '进行中' | '已完成' | '已取消' {
  if (status === 'pending') return '待处理';
  if (status === 'in_progress') return '进行中';
  if (status === 'completed') return '已完成';
  if (status === 'canceled') return '已取消';
  // 如果已经是中文,直接返回
  return status as '待处理' | '进行中' | '已完成' | '已取消';
}
