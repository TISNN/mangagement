/**
 * 任务弹窗状态管理Hook
 * 负责管理各种弹窗的开关状态
 */

import { useState, useCallback } from 'react';
import { UITask } from '../types/task.types';

export function useTaskModals() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<UITask | null>(null);

  /**
   * 打开创建任务弹窗
   */
  const openCreateModal = () => {
    setCurrentTask(null);
    setIsCreateModalOpen(true);
  };

  /**
   * 打开编辑任务弹窗
   */
  const openEditModal = (task: UITask) => {
    setCurrentTask(task);
    setIsEditModalOpen(true);
  };

  /**
   * 打开任务详情弹窗
   */
  const openDetailModal = useCallback((task: UITask) => {
    setCurrentTask(task);
    setIsDetailModalOpen(true);
  }, []);

  /**
   * 直接更新当前任务数据（用于同步最新数据）
   */
  const updateCurrentTask = useCallback((updatedTask: UITask) => {
    setCurrentTask(updatedTask);
  }, []);

  /**
   * 打开删除确认弹窗
   */
  const openDeleteConfirm = (task: UITask) => {
    console.log('[useTaskModals] openDeleteConfirm 被调用', task);
    setCurrentTask(task);
    setIsDeleteConfirmOpen(true);
  };

  /**
   * 关闭所有弹窗
   */
  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDetailModalOpen(false);
    setIsDeleteConfirmOpen(false);
    // 延迟清空当前任务,避免关闭动画时数据消失
    setTimeout(() => setCurrentTask(null), 300);
  };

  return {
    // 状态
    isCreateModalOpen,
    isEditModalOpen,
    isDetailModalOpen,
    isDeleteConfirmOpen,
    currentTask,
    
    // 操作
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteConfirm,
    closeAllModals,
    updateCurrentTask,
  };
}

