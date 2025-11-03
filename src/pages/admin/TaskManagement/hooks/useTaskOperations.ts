/**
 * 任务操作Hook
 * 负责任务的增删改查操作
 */

import { useState } from 'react';
import taskService from '../../../../services/taskService';
import { TaskFormData } from '../types/task.types';
import { convertUiPriorityToDb, convertUiStatusToDb } from '../utils/taskMappers';

export function useTaskOperations(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const parseAssigneeId = (assigneeId: string) => {
    if (!assigneeId?.trim()) return undefined;
    const parsed = parseInt(assigneeId, 10);
    return Number.isNaN(parsed) ? undefined : parsed;
  };

  const parseLinkedEntity = (formData: TaskFormData) => {
    const type = formData.relatedEntityType && formData.relatedEntityType !== 'none'
      ? formData.relatedEntityType
      : null;

    if (!type) {
      return { type: null, id: null };
    }

    const parsedId = formData.relatedEntityId ? parseInt(formData.relatedEntityId, 10) : NaN;
    return {
      type,
      id: Number.isNaN(parsedId) ? null : parsedId,
    };
  };

  const parseTags = (tags: string) =>
    tags
      ? tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean)
      : [];

  /**
   * 创建新任务
   */
  const createTask = async (formData: TaskFormData) => {
    try {
      setLoading(true);
      console.log('[useTaskOperations] 创建任务:', formData);
      const assigneeId = parseAssigneeId(formData.assignee_id);
      const { type: linkedEntityType, id: linkedEntityId } = parseLinkedEntity(formData);

      await taskService.createTask({
        title: formData.title,
        description: formData.description,
        assigned_to: assigneeId !== undefined ? [assigneeId] : undefined,
        priority: convertUiPriorityToDb(formData.priority),
        due_date: formData.dueDate || undefined,
        tags: parseTags(formData.tags),
        task_domain: formData.domain,
        linked_entity_type: linkedEntityType,
        linked_entity_id: linkedEntityId,
        related_student_id: linkedEntityType === 'student' ? linkedEntityId ?? null : null,
        related_lead_id: linkedEntityType === 'lead' ? linkedEntityId ?? null : null,
      });
      
      console.log('[useTaskOperations] 创建成功');
      onSuccess?.();
      return { success: true, message: '任务创建成功' };
    } catch (error) {
      console.error('[useTaskOperations] 创建失败:', error);
      return { success: false, message: '创建任务失败,请重试' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新任务状态
   */
  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      setLoading(true);
      console.log('[useTaskOperations] 更新状态:', taskId, newStatus);
      
      await taskService.updateTaskStatus(
        parseInt(taskId),
        convertUiStatusToDb(newStatus)
      );
      
      console.log('[useTaskOperations] 状态更新成功');
      onSuccess?.();
      return { success: true, message: '状态更新成功' };
    } catch (error) {
      console.error('[useTaskOperations] 更新失败:', error);
      return { success: false, message: '更新状态失败' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 更新任务信息
   */
  const updateTask = async (taskId: string, formData: TaskFormData) => {
    try {
      setLoading(true);
      console.log('[useTaskOperations] 更新任务:', taskId, formData);
      const assigneeId = parseAssigneeId(formData.assignee_id);
      const { type: linkedEntityType, id: linkedEntityId } = parseLinkedEntity(formData);

      await taskService.updateTask(parseInt(taskId), {
        title: formData.title,
        description: formData.description,
        assigned_to: assigneeId !== undefined ? [assigneeId] : undefined,
        priority: convertUiPriorityToDb(formData.priority),
        due_date: formData.dueDate || undefined,
        tags: parseTags(formData.tags),
        task_domain: formData.domain,
        linked_entity_type: linkedEntityType,
        linked_entity_id: linkedEntityId,
        related_student_id: linkedEntityType === 'student' ? linkedEntityId ?? null : null,
        related_lead_id: linkedEntityType === 'lead' ? linkedEntityId ?? null : null,
      });
      
      console.log('[useTaskOperations] 更新成功');
      onSuccess?.();
      return { success: true, message: '任务更新成功' };
    } catch (error) {
      console.error('[useTaskOperations] 更新失败:', error);
      return { success: false, message: '更新任务失败' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除任务
   */
  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      console.log('[useTaskOperations] 删除任务:', taskId);
      
      await taskService.deleteTask(parseInt(taskId));
      
      console.log('[useTaskOperations] 删除成功');
      onSuccess?.();
      return { success: true, message: '任务已删除' };
    } catch (error) {
      console.error('[useTaskOperations] 删除失败:', error);
      const errorMessage = error instanceof Error ? error.message : '删除任务失败，请检查网络连接';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 快速创建任务
   */
  const quickCreateTask = async (title: string) => {
    try {
      setLoading(true);
      console.log('[useTaskOperations] 快速创建:', title);
      
      await taskService.createTask({
        title: title.trim(),
        priority: '中',
        status: '待处理',
        task_domain: 'general',
        linked_entity_type: null,
        linked_entity_id: null,
        related_student_id: null,
        related_lead_id: null,
      });
      
      console.log('[useTaskOperations] 快速创建成功');
      onSuccess?.();
      return { success: true, message: '任务创建成功' };
    } catch (error) {
      console.error('[useTaskOperations] 快速创建失败:', error);
      return { success: false, message: '快速创建失败' };
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    quickCreateTask,
    loading,
  };
}
