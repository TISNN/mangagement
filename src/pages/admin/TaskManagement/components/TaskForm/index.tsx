/**
 * 任务表单弹窗组件
 * 支持任务域与关联对象的结构化选择
 */

import React, { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import {
  TaskDomain,
  TaskFormData,
  TaskRelatedEntityType,
  UITask,
} from '../../types/task.types';
import {
  PRIORITY_OPTIONS,
  TASK_DOMAIN_OPTIONS,
  TASK_DOMAIN_META,
  TASK_ENTITY_TYPE_OPTIONS,
} from '../../utils/taskConstants';
import CustomSelect from '../CustomSelect';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<{ success: boolean; message: string }>;
  task?: UITask | null;
  title: string;
  employees: Array<{ id: number; name: string; avatar_url?: string; position?: string }>;
  students: Array<{ id: number; name: string; avatar_url?: string | null; status?: string; is_active?: boolean }>;
  leads: Array<{ id: number; name: string; status?: string | null }>;
}

const getToday = () => new Date().toISOString().split('T')[0];

const BASE_FORM_DATA: TaskFormData = {
  title: '',
  description: '',
  assignee_id: '',
  dueDate: '',
  priority: 'medium',
  tags: '',
  domain: 'general',
  relatedEntityType: 'none',
  relatedEntityId: '',
};

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  title,
  employees,
  students,
  leads,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    ...BASE_FORM_DATA,
    dueDate: getToday(),
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDomainMeta = TASK_DOMAIN_META[formData.domain];

  const filteredEntityTypeOptions = useMemo(() => {
    return TASK_ENTITY_TYPE_OPTIONS.filter((option) => {
      if (option.value === 'student') return students.length > 0;
      if (option.value === 'lead') return leads.length > 0;
      if (option.value === 'employee') return employees.length > 0;
      return true;
    });
  }, [students.length, leads.length, employees.length]);

  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        value: String(employee.id),
        label: (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {employee.name}
              </span>
              {employee.position && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {employee.position}
                </span>
              )}
            </div>
          </div>
        ),
        searchText: `${employee.name} ${employee.position || ''}`,
      })),
    [employees]
  );

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        value: String(student.id),
        label: (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {student.name}
              </span>
              {student.status && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {student.status}
                </span>
              )}
            </div>
          </div>
        ),
        searchText: `${student.name} ${student.status || ''}`,
      })),
    [students]
  );

  const leadOptions = useMemo(
    () =>
      leads.map((lead) => ({
        value: String(lead.id),
        label: (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {lead.name}
              </span>
              {lead.status && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lead.status}
                </span>
              )}
            </div>
          </div>
        ),
        searchText: `${lead.name} ${lead.status || ''}`,
      })),
    [leads]
  );

  const relatedEntityOptions = useMemo(() => {
    switch (formData.relatedEntityType) {
      case 'student':
        return studentOptions;
      case 'lead':
        return leadOptions;
      case 'employee':
        return employeeOptions;
      default:
        return [];
    }
  }, [formData.relatedEntityType, studentOptions, leadOptions, employeeOptions]);

  useEffect(() => {
    if (task) {
      const domain = task.domain || 'general';
      const inferredEntityType: TaskRelatedEntityType =
        task.relatedEntityType && task.relatedEntityType !== 'none'
          ? task.relatedEntityType
          : task.relatedStudent
          ? 'student'
          : task.relatedLead
          ? 'lead'
          : 'none';

      const inferredEntityId =
        inferredEntityType === 'student'
          ? task.relatedStudent?.id || ''
          : inferredEntityType === 'lead'
          ? task.relatedLead?.id || ''
          : inferredEntityType === 'employee'
          ? task.relatedEntityId || ''
          : '';

      setFormData({
        title: task.title,
        description: task.description,
        assignee_id: task.assignee?.id || '',
        dueDate: task.dueDate || getToday(),
        priority:
          task.priority === '高' ? 'high' : task.priority === '低' ? 'low' : 'medium',
        tags: task.tags.join(', '),
        domain,
        relatedEntityType: inferredEntityType,
        relatedEntityId: inferredEntityId,
      });
    } else {
      setFormData({
        ...BASE_FORM_DATA,
        dueDate: getToday(),
      });
    }
    setError(null);
  }, [task, isOpen]);

  // 如果当前关联类型在可选项中消失（例如没有学生数据），回退到 none
  useEffect(() => {
    if (
      formData.relatedEntityType !== 'none' &&
      !filteredEntityTypeOptions.some((option) => option.value === formData.relatedEntityType)
    ) {
      setFormData((prev) => ({
        ...prev,
        relatedEntityType: 'none',
        relatedEntityId: '',
      }));
    }
  }, [filteredEntityTypeOptions, formData.relatedEntityType]);

  const handleDomainChange = (value: TaskDomain) => {
    const domainMeta = TASK_DOMAIN_META[value];
    setFormData((prev) => {
      const nextType =
        domainMeta?.defaultEntityType && filteredEntityTypeOptions.some((opt) => opt.value === domainMeta.defaultEntityType)
          ? domainMeta.defaultEntityType
          : prev.relatedEntityType;
      return {
        ...prev,
        domain: value,
        relatedEntityType: nextType,
        relatedEntityId:
          nextType === prev.relatedEntityType ? prev.relatedEntityId : '',
      };
    });
  };

  const handleEntityTypeChange = (value: TaskRelatedEntityType) => {
    setFormData((prev) => ({
      ...prev,
      relatedEntityType: value,
      relatedEntityId: '',
    }));
  };

  const handleRelatedEntityChange = (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      relatedEntityId: value ? String(value) : '',
    }));
  };

  const handleAssigneeChange = (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      assignee_id: value ? String(value) : '',
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError('请输入任务标题');
      return;
    }

    if (
      formData.relatedEntityType !== 'none' &&
      !formData.relatedEntityId.trim()
    ) {
      setError('请选择关联对象或将关联类型调整为“不关联对象”');
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await onSubmit(formData);
    setSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />

        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                先明确任务归属与关联对象，后续统计、筛选与自动化会更准确
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form id="task-form" onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                任务标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="请输入任务标题"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                任务描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                placeholder="补充背景、关键步骤或合作人 (可选)"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  任务域
                </label>
                <CustomSelect
                  value={formData.domain}
                  onChange={(value) => handleDomainChange(value as TaskDomain)}
                  options={TASK_DOMAIN_OPTIONS.map((option) => ({
                    value: option.value,
                    label: (
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5">{option.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {option.label}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    ),
                    searchText: `${option.label} ${option.description}`,
                  }))}
                  placeholder="选择任务域"
                />
                {selectedDomainMeta && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedDomainMeta.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  关联对象类型
                </label>
                <CustomSelect
                  value={formData.relatedEntityType}
                  onChange={(value) => handleEntityTypeChange(value as TaskRelatedEntityType)}
                  options={filteredEntityTypeOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                  placeholder="是否需要关联学生/线索/同事?"
                />
              </div>
            </div>

            {formData.relatedEntityType !== 'none' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  关联对象
                </label>
                <CustomSelect
                  value={formData.relatedEntityId}
                  onChange={handleRelatedEntityChange}
                  options={relatedEntityOptions}
                  placeholder={
                    {
                      student: '选择关联学生',
                      lead: '选择关联潜在客户',
                      employee: '选择关联内部员工',
                      none: '不关联对象',
                    }[formData.relatedEntityType]
                  }
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  优先级
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  截止日期
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value || getToday() })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    负责人
                  </label>
                  {formData.assignee_id && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, assignee_id: '' })}
                      className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      清除
                    </button>
                  )}
                </div>
                <CustomSelect
                  value={formData.assignee_id}
                  onChange={handleAssigneeChange}
                  options={employeeOptions}
                  placeholder="选择一位负责的同事 (可选)"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  标签
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="例如: 文书, 审核, 申请材料 (逗号分隔)"
                />
              </div>
            </div>
          </form>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              form="task-form"
              disabled={submitting}
              className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting ? '提交中...' : '确定'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
