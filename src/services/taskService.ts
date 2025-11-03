/**
 * 任务管理服务
 * 连接Supabase tasks和task_comments表
 */

import { supabase } from '../lib/supabase';

/**
 * 辅助函数：为任务数据添加员工信息
 */
async function enrichTasksWithAssignees(tasksData: any[]): Promise<Task[]> {
  if (!tasksData || tasksData.length === 0) return [];

  // 获取所有任务涉及到的员工ID
  const allAssigneeIds = new Set<number>();
  tasksData.forEach(task => {
    if (task.assigned_to && Array.isArray(task.assigned_to)) {
      task.assigned_to.forEach(id => allAssigneeIds.add(id));
    }
  });

  // 批量获取员工信息
  let employeesData: any[] = [];
  if (allAssigneeIds.size > 0) {
    const { data: employees, error: employeesError } = await supabase
      .from('employees')
      .select('id, name, avatar_url, position')
      .in('id', Array.from(allAssigneeIds));

    if (employeesError) {
      console.error('[TaskService] 获取员工信息失败:', employeesError);
    } else {
      employeesData = employees || [];
    }
  }

  // 将员工信息映射到任务数据中
  return tasksData.map(task => {
    const assignees = task.assigned_to && Array.isArray(task.assigned_to) 
      ? task.assigned_to
          .map(assigneeId => employeesData.find(emp => emp.id === assigneeId))
          .filter(Boolean)
      : [];

    return {
      ...task,
      assignees: assignees.length > 0 ? assignees : undefined
    };
  });
}

// 任务接口定义
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: '待处理' | '进行中' | '已完成' | '已取消';
  priority: '高' | '中' | '低';
  assigned_to: number[] | null;
  created_by: number | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  tags: string[] | null;
  related_student_id: number | null;
  related_lead_id: number | null;
  task_domain: string | null;
  linked_entity_type: string | null;
  linked_entity_id: number | null;
  meeting_id: number | null; // 关联会议ID
  created_at: string;
  updated_at: string;
  
  // 关联数据
  assignees?: Array<{
    id: number;
    name: string;
    avatar_url: string | null;
    position: string | null;
  }>;
  creator?: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
  student?: {
    id: number;
    name: string;
    avatar_url: string | null;
    status: string | null;
    is_active: boolean | null;
  };
  lead?: {
    id: number;
    name: string;
    status?: string | null;
  };
  meeting?: {
    id: number;
    title: string;
    meeting_type: string;
    status: string;
    start_time: string;
  };
}

// 任务评论接口
export interface TaskComment {
  id: number;
  task_id: number;
  employee_id: number | null;
  content: string;
  created_at: string;
  
  // 关联数据
  employee?: {
    id: number;
    name: string;
    avatar_url: string | null;
  };
}

// 新建任务表单
export interface CreateTaskForm {
  title: string;
  description?: string;
  status?: '待处理' | '进行中' | '已完成' | '已取消';
  priority?: '高' | '中' | '低';
  assigned_to?: number[];
  start_date?: string;
  due_date?: string;
  tags?: string[];
  related_student_id?: number;
  related_lead_id?: number;
  task_domain?: string;
  linked_entity_type?: string | null;
  linked_entity_id?: number | null;
}

// 更新任务表单
export interface UpdateTaskForm extends Partial<CreateTaskForm> {
  completed_at?: string;
}

/**
 * 获取所有任务(带关联数据)
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    // 先获取任务数据
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error('[TaskService] 获取任务列表失败:', tasksError);
      throw tasksError;
    }

    return await enrichTasksWithAssignees(tasksData || []);
  } catch (error) {
    console.error('[TaskService] 获取任务列表异常:', error);
    throw error;
  }
}

/**
 * 根据状态获取任务
 */
export async function getTasksByStatus(status: string): Promise<Task[]> {
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error('[TaskService] 获取任务列表失败:', tasksError);
      throw tasksError;
    }

    return await enrichTasksWithAssignees(tasksData || []);
  } catch (error) {
    console.error('[TaskService] 获取任务列表异常:', error);
    throw error;
  }
}

/**
 * 根据负责人获取任务
 */
export async function getTasksByAssignee(employeeId: number): Promise<Task[]> {
  try {
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .contains('assigned_to', [employeeId])
      .order('created_at', { ascending: false });

    if (tasksError) {
      console.error('[TaskService] 获取任务列表失败:', tasksError);
      throw tasksError;
    }

    return await enrichTasksWithAssignees(tasksData || []);
  } catch (error) {
    console.error('[TaskService] 获取任务列表异常:', error);
    throw error;
  }
}

/**
 * 获取单个任务详情
 */
export async function getTaskById(taskId: number): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .eq('id', taskId)
      .single();

    if (error) {
      console.error('[TaskService] 获取任务详情失败:', error);
      throw error;
    }

    if (!data) return null;

    const [enrichedTask] = await enrichTasksWithAssignees([data]);
    return enrichedTask;
  } catch (error) {
    console.error('[TaskService] 获取任务详情异常:', error);
    throw error;
  }
}

/**
 * 创建新任务
 */
export async function createTask(taskData: CreateTaskForm): Promise<Task> {
  try {
    // 获取当前登录用户ID
    const currentEmployee = localStorage.getItem('currentEmployee');
    const createdBy = currentEmployee ? JSON.parse(currentEmployee).id : null;
    const payload: Record<string, unknown> = {
      ...taskData,
      created_by: createdBy,
      status: taskData.status || '待处理',
      priority: taskData.priority || '中',
      task_domain: taskData.task_domain || 'general',
    };

    const linkedType = taskData.linked_entity_type ?? null;
    const linkedId = linkedType ? taskData.linked_entity_id ?? null : null;

    payload.linked_entity_type = linkedType;
    payload.linked_entity_id = linkedId;

    if (linkedType === 'student') {
      payload.related_student_id = linkedId;
      payload.related_lead_id = null;
    } else if (linkedType === 'lead') {
      payload.related_lead_id = linkedId;
      payload.related_student_id = null;
    } else {
      payload.related_student_id = taskData.related_student_id ?? null;
      payload.related_lead_id = taskData.related_lead_id ?? null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(payload)
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .single();

    if (error) {
      console.error('[TaskService] 创建任务失败:', error);
      throw error;
    }

    if (!data) throw new Error('创建任务失败：未返回数据');

    const [enrichedTask] = await enrichTasksWithAssignees([data]);
    return enrichedTask;
  } catch (error) {
    console.error('[TaskService] 创建任务异常:', error);
    throw error;
  }
}

/**
 * 更新任务
 */
export async function updateTask(taskId: number, taskData: UpdateTaskForm): Promise<Task> {
  try {
    const payload: Record<string, unknown> = {
      ...taskData,
    };

    if (taskData.task_domain !== undefined) {
      payload.task_domain = taskData.task_domain;
    }

    const linkedType = taskData.linked_entity_type ?? null;
    const linkedId = linkedType ? taskData.linked_entity_id ?? null : null;

    payload.linked_entity_type = linkedType;
    payload.linked_entity_id = linkedId;

    if (linkedType === 'student') {
      payload.related_student_id = linkedId;
      payload.related_lead_id = null;
    } else if (linkedType === 'lead') {
      payload.related_student_id = null;
      payload.related_lead_id = linkedId;
    } else {
      if (taskData.related_student_id !== undefined) {
        payload.related_student_id = taskData.related_student_id;
      } else if (linkedType === null) {
        payload.related_student_id = null;
      }

      if (taskData.related_lead_id !== undefined) {
        payload.related_lead_id = taskData.related_lead_id;
      } else if (linkedType === null) {
        payload.related_lead_id = null;
      }
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .single();

    if (error) {
      console.error('[TaskService] 更新任务失败:', error);
      throw error;
    }

    if (!data) throw new Error('更新任务失败：未返回数据');

    const [enrichedTask] = await enrichTasksWithAssignees([data]);
    return enrichedTask;
  } catch (error) {
    console.error('[TaskService] 更新任务异常:', error);
    throw error;
  }
}

/**
 * 删除任务
 */
export async function deleteTask(taskId: number): Promise<void> {
  try {
    console.log('[TaskService] 开始删除任务:', taskId);

    // 验证任务是否存在
    const { data: existingTask, error: checkError } = await supabase
      .from('tasks')
      .select('id, title')
      .eq('id', taskId)
      .single();

    if (checkError) {
      console.error('[TaskService] 检查任务是否存在失败:', checkError);
      throw new Error(`无法找到任务 ID: ${taskId}`);
    }

    if (!existingTask) {
      throw new Error(`任务 ID ${taskId} 不存在`);
    }

    console.log('[TaskService] 找到任务:', existingTask.title);

    // 1. 先删除任务相关的附件
    try {
      const { data: attachments, error: attachmentsError } = await supabase
        .from('task_attachments')
        .select('id, file_path')
        .eq('task_id', taskId);

      if (attachmentsError) {
        console.error('[TaskService] 获取任务附件失败:', attachmentsError);
        // 即使获取附件失败，也继续尝试删除
      } else if (attachments && attachments.length > 0) {
        console.log('[TaskService] 找到', attachments.length, '个附件需要删除');
        
        // 删除附件数据库记录（必须在删除存储文件之前）
        const { error: deleteAttachmentsError } = await supabase
          .from('task_attachments')
          .delete()
          .eq('task_id', taskId);

        if (deleteAttachmentsError) {
          console.error('[TaskService] 删除附件记录失败:', deleteAttachmentsError);
          throw new Error(`删除附件失败: ${deleteAttachmentsError.message}`);
        }

        // 删除存储中的文件
        const filePaths = attachments
          .map(att => att.file_path)
          .filter(Boolean);
        
        if (filePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('task-attachments')
            .remove(filePaths);
          
          if (storageError) {
            console.error('[TaskService] 删除存储文件失败:', storageError);
            // 存储文件删除失败不影响主流程
          }
        }
      }
    } catch (attachmentError) {
      console.error('[TaskService] 删除附件异常:', attachmentError);
      throw attachmentError; // 如果附件删除失败，我们不应该继续
    }

    // 2. 删除任务相关的评论
    try {
      const { error: commentsError } = await supabase
        .from('task_comments')
        .delete()
        .eq('task_id', taskId);

      if (commentsError) {
        console.error('[TaskService] 删除任务评论失败:', commentsError);
        throw new Error(`删除评论失败: ${commentsError.message}`);
      }
    } catch (commentError) {
      console.error('[TaskService] 删除评论异常:', commentError);
      throw commentError; // 如果评论删除失败，我们不应该继续
    }

    // 3. 最后删除任务本身
    const { error, count } = await supabase
      .from('tasks')
      .delete({ count: 'exact' })
      .eq('id', taskId);

    if (error) {
      console.error('[TaskService] 删除任务失败:', error);
      throw new Error(`删除任务失败: ${error.message}`);
    }

    if (count === 0) {
      throw new Error(`没有找到要删除的任务 ID: ${taskId}`);
    }

    console.log('[TaskService] 任务删除成功:', taskId, '删除了', count, '条记录');
  } catch (error) {
    console.error('[TaskService] 删除任务异常:', error);
    throw error;
  }
}

/**
 * 更新任务状态
 */
export async function updateTaskStatus(
  taskId: number, 
  status: '待处理' | '进行中' | '已完成' | '已取消'
): Promise<Task> {
  try {
    const updateData: UpdateTaskForm = {
      status,
      updated_at: new Date().toISOString(),
    };

    // 如果状态是已完成,记录完成时间
    if (status === '已完成') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select(`
        *,
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .single();

    if (error) {
      console.error('[TaskService] 更新任务状态失败:', error);
      throw error;
    }

    if (!data) throw new Error('更新任务状态失败：未返回数据');

    const [enrichedTask] = await enrichTasksWithAssignees([data]);
    return enrichedTask;
  } catch (error) {
    console.error('[TaskService] 更新任务状态异常:', error);
    throw error;
  }
}

/**
 * 获取任务的所有评论
 */
export async function getTaskComments(taskId: number): Promise<TaskComment[]> {
  try {
    const { data, error } = await supabase
      .from('task_comments')
      .select(`
        *,
        employee:employee_id(id, name, avatar_url)
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[TaskService] 获取任务评论失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[TaskService] 获取任务评论异常:', error);
    throw error;
  }
}

/**
 * 添加任务评论
 */
export async function addTaskComment(
  taskId: number, 
  content: string
): Promise<TaskComment> {
  try {
    // 获取当前登录用户ID
    const currentEmployee = localStorage.getItem('currentEmployee');
    const employeeId = currentEmployee ? JSON.parse(currentEmployee).id : null;

    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        task_id: taskId,
        employee_id: employeeId,
        content,
      })
      .select(`
        *,
        employee:employee_id(id, name, avatar_url)
      `)
      .single();

    if (error) {
      console.error('[TaskService] 添加任务评论失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('[TaskService] 添加任务评论异常:', error);
    throw error;
  }
}

/**
 * 获取任务统计数据
 */
export async function getTaskStats() {
  try {
    const { data: allTasks, error } = await supabase
      .from('tasks')
      .select('status, priority');

    if (error) {
      console.error('[TaskService] 获取任务统计失败:', error);
      throw error;
    }

    const stats = {
      total: allTasks?.length || 0,
      pending: allTasks?.filter(t => t.status === '待处理').length || 0,
      inProgress: allTasks?.filter(t => t.status === '进行中').length || 0,
      completed: allTasks?.filter(t => t.status === '已完成').length || 0,
      canceled: allTasks?.filter(t => t.status === '已取消').length || 0,
      high: allTasks?.filter(t => t.priority === '高').length || 0,
      medium: allTasks?.filter(t => t.priority === '中').length || 0,
      low: allTasks?.filter(t => t.priority === '低').length || 0,
    };

    return stats;
  } catch (error) {
    console.error('[TaskService] 获取任务统计异常:', error);
    throw error;
  }
}

/**
 * 搜索任务
 */
export async function searchTasks(keyword: string): Promise<Task[]> {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        assignee:assigned_to(id, name, avatar_url, position),
        creator:created_by(id, name, avatar_url),
        student:related_student_id(id, name, avatar_url, status, is_active),
        lead:related_lead_id(id, name),
        meeting:meeting_id(id, title, meeting_type, status, start_time)
      `)
      .or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[TaskService] 搜索任务失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[TaskService] 搜索任务异常:', error);
    throw error;
  }
}

export default {
  getAllTasks,
  getTasksByStatus,
  getTasksByAssignee,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  getTaskComments,
  addTaskComment,
  getTaskStats,
  searchTasks,
};
