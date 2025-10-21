/**
 * 子任务服务
 * 处理子任务的CRUD操作
 */

import { supabase } from '../lib/supabase';

export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  description?: string;
  status: string;
  completed: boolean;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSubtaskData {
  task_id: number;
  title: string;
  description?: string;
  status?: string;
  due_date?: string;
}

export interface UpdateSubtaskData {
  title?: string;
  description?: string;
  status?: string;
  completed?: boolean;
  due_date?: string;
}

/**
 * 获取任务的所有子任务
 */
export async function getSubtasks(taskId: number): Promise<Subtask[]> {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[SubtaskService] 获取子任务失败:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('[SubtaskService] 获取子任务异常:', error);
    throw error;
  }
}

/**
 * 创建子任务
 */
export async function createSubtask(subtaskData: CreateSubtaskData): Promise<Subtask> {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .insert({
        task_id: subtaskData.task_id,
        title: subtaskData.title,
        description: subtaskData.description,
        status: subtaskData.status || '待处理',
        due_date: subtaskData.due_date,
      })
      .select()
      .single();

    if (error) {
      console.error('[SubtaskService] 创建子任务失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('[SubtaskService] 创建子任务异常:', error);
    throw error;
  }
}

/**
 * 更新子任务
 */
export async function updateSubtask(
  subtaskId: number,
  updates: UpdateSubtaskData
): Promise<Subtask> {
  try {
    const { data, error } = await supabase
      .from('subtasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', subtaskId)
      .select()
      .single();

    if (error) {
      console.error('[SubtaskService] 更新子任务失败:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('[SubtaskService] 更新子任务异常:', error);
    throw error;
  }
}

/**
 * 切换子任务完成状态
 */
export async function toggleSubtaskCompleted(
  subtaskId: number,
  completed: boolean
): Promise<Subtask> {
  return updateSubtask(subtaskId, { completed });
}

/**
 * 删除子任务
 */
export async function deleteSubtask(subtaskId: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('subtasks')
      .delete()
      .eq('id', subtaskId);

    if (error) {
      console.error('[SubtaskService] 删除子任务失败:', error);
      throw error;
    }
  } catch (error) {
    console.error('[SubtaskService] 删除子任务异常:', error);
    throw error;
  }
}

export default {
  getSubtasks,
  createSubtask,
  updateSubtask,
  toggleSubtaskCompleted,
  deleteSubtask,
};

