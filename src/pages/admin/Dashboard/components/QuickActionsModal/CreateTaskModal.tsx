/**
 * Dashboard 快速创建任务模态框
 * 复用 TaskForm 组件
 */

import React, { useEffect, useState } from 'react';
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
  const [employees, setEmployees] = useState<Array<{ id: number; name: string; avatar_url?: string; position?: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: number; name: string; avatar_url?: string | null; status?: string; is_active?: boolean }>>([]);
  const [leads, setLeads] = useState<Array<{ id: number; name: string; status?: string | null }>>([]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const { supabase } = await import('../../../../../supabase');
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, avatar_url, position')
          .order('name');

        if (error) throw error;
        setEmployees(data || []);
      } catch (error) {
        console.error('[CreateTaskModal] 加载员工失败:', error);
      }
    };

    const loadStudents = async () => {
      try {
        const { supabase } = await import('../../../../../supabase');
        const { data, error } = await supabase
          .from('students')
          .select('id, name, avatar_url, status, is_active')
          .order('name');

        if (error) throw error;
        setStudents(data || []);
      } catch (error) {
        console.error('[CreateTaskModal] 加载学生失败:', error);
      }
    };

    const loadLeads = async () => {
      try {
        const { supabase } = await import('../../../../../supabase');
        const { data, error } = await supabase
          .from('leads')
          .select('id, name, status')
          .order('name');

        if (error) throw error;
        setLeads(data || []);
      } catch (error) {
        console.error('[CreateTaskModal] 加载潜在客户失败:', error);
      }
    };

    loadEmployees();
    loadStudents();
    loadLeads();
  }, []);

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
      employees={employees}
      students={students}
      leads={leads}
    />
  );
};
