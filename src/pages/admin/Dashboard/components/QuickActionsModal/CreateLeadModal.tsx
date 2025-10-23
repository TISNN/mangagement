/**
 * Dashboard 快速新增线索模态框
 * 复用 AddLeadModal 组件
 */

import React from 'react';
import AddLeadModal from '../../../../../components/AddLeadModal';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleLeadAdded = () => {
    onSuccess();
    onClose();
  };

  return (
    <AddLeadModal
      isOpen={isOpen}
      onClose={onClose}
      onLeadAdded={handleLeadAdded}
    />
  );
};

