/**
 * Dashboard 快速创建学生模态框
 * 复用 StudentAddModal 组件
 */

import React from 'react';
import StudentAddModal from '../../../../../components/StudentAddModal';

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateStudentModal: React.FC<CreateStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleStudentAdded = () => {
    onSuccess();
    onClose();
  };

  return (
    <StudentAddModal
      isOpen={isOpen}
      onClose={onClose}
      onStudentAdded={handleStudentAdded}
    />
  );
};

