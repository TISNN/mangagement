/**
 * Dashboard 快速创建任务模态框
 * 复用 TaskForm 组件
 */

import React from 'react';
import TaskForm from '../../../../../pages/admin/TaskManagement/components/TaskForm';
import { useTaskOperations } from '../../../../../pages/admin/TaskManagement/hooks/useTaskOperations';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createTask } = useTaskOperations(() => {
    onSuccess();
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <TaskForm
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={createTask}
      task={undefined}
      title="快速创建任务"
    />
  );
};

