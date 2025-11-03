/**
 * 任务侧边详情面板
 * 参照专业UI设计 - 右侧滑出式面板
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Maximize2, 
  ExternalLink,
  Calendar,
  Clock,
  Users,
  User,
  Flag,
  Paperclip,
  Plus,
  MoreVertical,
  Circle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { TaskDomain, TaskRelatedEntityType, UITask } from '../../types/task.types';
import CustomSelect from '../CustomSelect';
import CustomMultiSelect from '../CustomMultiSelect';
import TaskAttachmentUploader from '../../../../../components/TaskAttachmentUploader';
import TaskAttachmentList from '../../../../../components/TaskAttachmentList';
import QuickMeetingCreator from '../QuickMeetingCreator';
import { 
  getTaskAttachments, 
  deleteTaskAttachment, 
  TaskAttachment
} from '../../../../../services/taskAttachmentService';
import {
  getSubtasks,
  createSubtask,
  toggleSubtaskCompleted,
  deleteSubtask,
  Subtask
} from '../../../../../services/subtaskService';
import { toast } from 'react-hot-toast';
import { TASK_DOMAIN_META } from '../../utils/taskConstants';

interface Employee {
  id: number;
  name: string;
  avatar_url?: string;
  position?: string;
}

interface Student {
  id: number;
  name: string;
  avatar_url?: string;
  status?: string;
  is_active?: boolean;
}

interface Lead {
  id: number;
  name: string;
  status?: string;
}

interface Meeting {
  id: number;
  title: string;
  meeting_type?: string;
  status?: string;
  start_time?: string;
}

interface TaskSidePanelProps {
  isOpen: boolean;
  task: UITask | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdateField?: (taskId: string, field: string, value: string | number | number[] | string[] | null) => Promise<{ success: boolean; message: string }>;
  employees?: Employee[];
  students?: Student[];
  leads?: Lead[];
  meetings?: Meeting[];
}

const TaskSidePanel: React.FC<TaskSidePanelProps> = ({
  isOpen,
  task,
  onClose,
  // onEdit,  // 暂时未使用,保留接口
  // onDelete,  // 暂时未使用,保留接口
  onUpdateField,
  employees = [],
  students = [],
  leads = [],
  meetings = [],
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'subtasks' | 'activities' | 'files' | 'comments'>('subtasks');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 编辑状态
  const [editingField, setEditingField] = useState<'start_date' | 'due_date' | 'status' | 'assignee' | 'priority' | 'description' | 'title' | 'task_domain' | 'linked_entity_type' | 'linked_entity_id' | 'meeting_id' | null>(null);
  const [editValue, setEditValue] = useState<string | number | null>(null);
  const [showQuickMeetingCreator, setShowQuickMeetingCreator] = useState(false);
  
  // 附件状态
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();
  
  // 子任务状态
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // 获取当前用户ID
  useEffect(() => {
    const currentEmployee = localStorage.getItem('currentEmployee');
    if (currentEmployee) {
      try {
        const employee = JSON.parse(currentEmployee);
        setCurrentUserId(employee.id);
      } catch (error) {
        console.error('解析当前用户信息失败:', error);
      }
    }
  }, []);

  // 加载任务附件
  const loadAttachments = useCallback(async () => {
    if (!task) return;
    
    setAttachmentsLoading(true);
    try {
      const taskAttachments = await getTaskAttachments(Number(task.id));
      setAttachments(taskAttachments);
    } catch (error) {
      console.error('加载附件失败:', error);
      toast.error('加载附件失败');
    } finally {
      setAttachmentsLoading(false);
    }
  }, [task]);

  // 当任务改变时加载附件
  useEffect(() => {
    if (task && isOpen) {
      loadAttachments();
    }
  }, [task, isOpen, loadAttachments]);

  // 注意：存储桶检查已移除，因为我们知道 task-attachments 存储桶存在
  // 如果有问题，会在实际的附件操作中显示具体的错误信息

  // 处理附件上传成功
  const handleAttachmentUploadSuccess = () => {
    loadAttachments();
    toast.success('附件上传成功');
  };

  // 处理附件上传错误
  const handleAttachmentUploadError = (error: string) => {
    toast.error(`上传失败: ${error}`);
  };

  // 处理删除附件
  const handleDeleteAttachment = async (attachmentId: number) => {
    try {
      await deleteTaskAttachment(attachmentId);
      await loadAttachments();
      toast.success('附件删除成功');
    } catch (error) {
      console.error('删除附件失败:', error);
      toast.error('删除附件失败');
    }
  };

  // 加载子任务
  const loadSubtasks = useCallback(async () => {
    if (!task) return;
    
    setSubtasksLoading(true);
    try {
      const data = await getSubtasks(Number(task.id));
      setSubtasks(data);
    } catch (error) {
      console.error('加载子任务失败:', error);
      toast.error('加载子任务失败');
    } finally {
      setSubtasksLoading(false);
    }
  }, [task]);

  // 当任务改变时加载子任务
  useEffect(() => {
    if (task && isOpen && activeTab === 'subtasks') {
      loadSubtasks();
    }
  }, [task, isOpen, activeTab, loadSubtasks]);

  // 添加子任务
  const handleAddSubtask = async () => {
    if (!task || !newSubtaskTitle.trim()) return;
    
    try {
      await createSubtask({
        task_id: Number(task.id),
        title: newSubtaskTitle,
      });
      setNewSubtaskTitle('');
      setIsAddingSubtask(false);
      await loadSubtasks();
      toast.success('子任务添加成功');
    } catch (error) {
      console.error('添加子任务失败:', error);
      toast.error('添加子任务失败');
    }
  };

  // 切换子任务完成状态
  const handleToggleSubtask = async (subtaskId: number, completed: boolean) => {
    try {
      await toggleSubtaskCompleted(subtaskId, completed);
      await loadSubtasks();
    } catch (error) {
      console.error('更新子任务失败:', error);
      toast.error('更新子任务失败');
    }
  };

  // 删除子任务
  const handleDeleteSubtask = async (subtaskId: number) => {
    try {
      await deleteSubtask(subtaskId);
      await loadSubtasks();
      toast.success('子任务删除成功');
    } catch (error) {
      console.error('删除子任务失败:', error);
      toast.error('删除子任务失败');
    }
  };

  // 获取学生状态显示样式
  const getStudentStatusStyle = (student: Student) => {
    const status = student.status || '';
    const isActive = student.is_active;
    
    if (!isActive && status === '毕业') {
      return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', label: '毕业' };
    } else if (!isActive && status === '退学') {
      return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', label: '退学' };
    } else if (!isActive && status === '休学') {
      return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20', label: '休学' };
    } else if (isActive && status === '活跃') {
      return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', label: '活跃' };
    } else {
      return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20', label: status || '未知' };
    }
  };

  if (!isOpen || !task) return null;

  const domainMeta = TASK_DOMAIN_META[(task.domain || 'general') as TaskDomain];
  const entityTypeLabelMap: Record<TaskRelatedEntityType | 'unknown', string> = {
    student: '关联学生',
    lead: '关联潜在客户',
    employee: '关联员工',
    none: '未关联对象',
    unknown: '未关联对象',
  };

  const renderLinkedEntity = () => {
    if (task.relatedEntityType === 'student' && task.relatedStudent) {
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {task.relatedStudent.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {task.relatedStudent.status || '状态未知'}
            </span>
          </div>
        </div>
      );
    }

    if (task.relatedEntityType === 'lead' && task.relatedLead) {
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {task.relatedLead.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.relatedLead.status || '线索阶段未填写'}
          </span>
        </div>
      );
    }

    if (task.relatedEntityType === 'employee' && task.relatedEntityName) {
      return (
        <div className="text-sm font-semibold text-gray-900 dark:text-white">
          {task.relatedEntityName}
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {task.relatedEntityId ? `关联 ID: ${task.relatedEntityId}` : '尚未关联具体对象'}
      </div>
    );
  };

  // 开始编辑
  const startEdit = (field: 'start_date' | 'due_date' | 'status' | 'assignee' | 'priority' | 'description' | 'title' | 'task_domain' | 'linked_entity_type' | 'linked_entity_id' | 'meeting_id', value: string | number | undefined) => {
    setEditingField(field);
    setEditValue(value || '');
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue(null);
  };

  // 保存编辑
  const saveEdit = async () => {
    if (!task || !editingField || !onUpdateField || editValue === null) {
      console.error('缺少必要参数');
      return;
    }

    try {
      // 映射字段名到数据库字段
      const fieldMap: Record<string, string> = {
        'start_date': 'start_date',
        'due_date': 'due_date',
        'status': 'status',
        'priority': 'priority',
        'assignee': 'assigned_to',
        'description': 'description',
        'title': 'title',
        'task_domain': 'task_domain',
        'linked_entity_type': 'linked_entity_type',
        'linked_entity_id': 'linked_entity_id',
        'meeting_id': 'meeting_id'
      };

      const dbField = fieldMap[editingField];
      console.log('[TaskSidePanel] 保存编辑:', { editingField, dbField, editValue, taskId: task.id });
      const result = await onUpdateField(task.id, dbField, editValue);
      
      if (result.success) {
        console.log('保存成功:', editingField, editValue);
        // 成功后关闭编辑模式
        cancelEdit();
      } else {
        console.error('保存失败:', result.message);
        alert(result.message || '保存失败,请重试');
      }
    } catch (error) {
      console.error('保存时出错:', error);
      alert('保存失败,请重试');
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 标签页数据 (模拟)
  const tabs = [
    { id: 'subtasks', label: '子任务', count: 2 },
    { id: 'activities', label: '活动', count: 0 },
    { id: 'files', label: '文件', count: 2 },
    { id: 'comments', label: '评论', count: 0 },
  ];

  return (
    <>
      {/* 背景遮罩 - 全屏模式下不显示 */}
      {!isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 侧边面板 */}
      <div className={`fixed top-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen 
          ? 'left-0 right-0 w-full animate-expand-full' 
          : 'right-0 w-full max-w-2xl animate-slide-in-right'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {!isFullscreen && (
              <>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 transform rotate-180" />
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">任务详情</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={isFullscreen ? "退出全屏" : "全屏打开"}
            >
              <Maximize2 className={`w-5 h-5 transition-transform ${isFullscreen ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className={`px-6 py-6 pb-48 space-y-6 ${isFullscreen ? 'max-w-6xl mx-auto' : ''}`}>
            {/* Task Title */}
            <div>
              {editingField === 'title' ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editValue !== null ? editValue : task.title}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      // 处理回车键 - 保存编辑
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        saveEdit();
                      }
                      // 处理ESC键 - 取消编辑
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }}
                    className="w-full px-3 py-2 text-2xl font-semibold bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                    placeholder="请输入任务标题"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <h2 
                  className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 cursor-pointer group flex items-center justify-between"
                  onClick={() => startEdit('title', task.title)}
                >
                  <span className="group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {task.title}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit('title', task.title);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </h2>
              )}
            </div>

            {/* Domain & Linked Entity Summary - 可编辑 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 任务域 - 可编辑 */}
              <div className="p-4 bg-purple-50/70 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800 group cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
                onClick={() => startEdit('task_domain', task.domain || 'general')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-purple-800">
                    {domainMeta.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-purple-600 dark:text-purple-300 flex items-center justify-between">
                      <span>任务域</span>
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    {editingField === 'task_domain' ? (
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={editValue !== null ? editValue : (task.domain || 'general')}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-purple-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                          autoFocus
                        >
                          <option value="general">通用任务</option>
                          <option value="student_success">学生服务</option>
                          <option value="company_ops">公司运营</option>
                          <option value="marketing">市场营销</option>
                        </select>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit();
                            }}
                            className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                        {domainMeta.label}
                      </div>
                    )}
                  </div>
                </div>
                {editingField !== 'task_domain' && (
                  <p className="text-xs text-purple-700 dark:text-purple-200">
                    {domainMeta.description}
                  </p>
                )}
              </div>

              {/* 关联对象类型 - 可编辑 */}
              <div className="p-4 bg-blue-50/70 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 group cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                onClick={() => {
                  if (editingField !== 'linked_entity_type') {
                    startEdit('linked_entity_type', task.relatedEntityType || 'none');
                  }
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-xs text-blue-600 dark:text-blue-300 flex items-center justify-between">
                      <span>{entityTypeLabelMap[task.relatedEntityType || 'unknown']}</span>
                      <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    {editingField === 'linked_entity_type' ? (
                      <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={editValue !== null ? editValue : (task.relatedEntityType || 'none')}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                          autoFocus
                        >
                          <option value="none">无关联</option>
                          <option value="student">关联学生</option>
                          <option value="lead">关联线索</option>
                          <option value="employee">关联员工</option>
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEdit();
                            }}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEdit();
                            }}
                            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1">{renderLinkedEntity()}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 关联对象选择器（当有关联类型时显示） */}
            {task.relatedEntityType && task.relatedEntityType !== 'none' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    选择具体{task.relatedEntityType === 'student' ? '学生' : task.relatedEntityType === 'lead' ? '线索' : '员工'}
                  </div>
                </div>
                {editingField === 'linked_entity_id' ? (
                  <div className="space-y-2">
                    <select
                      value={editValue !== null ? editValue : (task.relatedEntityId || '')}
                      onChange={(e) => setEditValue(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                      autoFocus
                    >
                      <option value="">请选择...</option>
                      {task.relatedEntityType === 'student' && students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} {!student.is_active && '(非活跃)'}
                        </option>
                      ))}
                      {task.relatedEntityType === 'lead' && leads.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} {lead.status && `- ${lead.status}`}
                        </option>
                      ))}
                      {task.relatedEntityType === 'employee' && employees.map(employee => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} {employee.position && `- ${employee.position}`}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => startEdit('linked_entity_id', task.relatedEntityId ? parseInt(task.relatedEntityId) : undefined)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.relatedStudent?.name || task.relatedLead?.name || task.relatedEntityName || '未设置'}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* 会议关联选择器（新增） */}
            <div className="p-4 bg-green-50/70 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    关联会议
                  </div>
                </div>
                {!task.relatedMeeting && !showQuickMeetingCreator && (
                  <button
                    onClick={() => setShowQuickMeetingCreator(true)}
                    className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    创建会议
                  </button>
                )}
              </div>

              {/* 快速创建会议组件 */}
              {showQuickMeetingCreator && (
                <div className="mb-3">
                  <QuickMeetingCreator
                    taskTitle={task.title}
                    onMeetingCreated={(meetingId) => {
                      setShowQuickMeetingCreator(false);
                      if (onUpdateField) {
                        onUpdateField(task.id, 'meeting_id', meetingId);
                      }
                    }}
                    onCancel={() => setShowQuickMeetingCreator(false)}
                  />
                </div>
              )}

              {/* 会议选择或显示 */}
              {!showQuickMeetingCreator && (
                editingField === 'meeting_id' ? (
                  <div className="space-y-2">
                    <select
                      value={editValue !== null ? editValue : (task.relatedMeeting?.id || '')}
                      onChange={(e) => setEditValue(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
                      autoFocus
                    >
                      <option value="">无关联会议</option>
                      {meetings.map(meeting => (
                        <option key={meeting.id} value={meeting.id}>
                          {meeting.title} 
                          {meeting.start_time && ` (${new Date(meeting.start_time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })})`}
                          {meeting.status && ` - ${meeting.status}`}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex-1 cursor-pointer group"
                      onClick={() => startEdit('meeting_id', task.relatedMeeting?.id ? parseInt(task.relatedMeeting.id) : undefined)}
                    >
                      {task.relatedMeeting ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {task.relatedMeeting.title}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                            {task.relatedMeeting.meeting_type && (
                              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                                {task.relatedMeeting.meeting_type}
                              </span>
                            )}
                            {task.relatedMeeting.start_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(task.relatedMeeting.start_time).toLocaleString('zh-CN', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                            {task.relatedMeeting.status && (
                              <span className={`px-2 py-0.5 rounded ${
                                task.relatedMeeting.status === '已完成' ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' :
                                task.relatedMeeting.status === '进行中' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' :
                                'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300'
                              }`}>
                                {task.relatedMeeting.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">未关联会议</div>
                      )}
                      <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    {/* 跳转到会议详情按钮 */}
                    {task.relatedMeeting && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/meetings/${task.relatedMeeting.id}`);
                        }}
                        className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                        title="查看会议详情"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Task Info - Vertical Layout */}
            <div className="space-y-3">
              {/* Start Date - Editable */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">开始日期</div>
                </div>
                {editingField === 'start_date' ? (
                  <div className="ml-11 space-y-2">
                    <input
                      type="date"
                      value={editValue !== null ? editValue : (task.startDate || '')}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="ml-11 flex items-center justify-between cursor-pointer group"
                    onClick={() => startEdit('start_date', task.startDate)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.startDate ? formatDate(task.startDate) : '未设置'}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Due Date - Editable */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">截止日期</div>
                </div>
                {editingField === 'due_date' ? (
                  <div className="ml-11 space-y-2">
                    <input
                      type="date"
                      value={editValue !== null ? editValue : (task.dueDate || '')}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="ml-11 flex items-center justify-between cursor-pointer group"
                    onClick={() => startEdit('due_date', task.dueDate)}
                  >
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.dueDate ? formatDate(task.dueDate) : '未设置'}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Status - Custom Select */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">状态</div>
                </div>
                <div className="ml-11">
                  <CustomSelect
                    value={task.status}
                    onChange={async (newStatus) => {
                      if (onUpdateField && task) {
                        await onUpdateField(task.id, 'status', newStatus as string);
                      }
                    }}
                    options={[
                      { 
                        value: '待处理', 
                        label: '待处理',
                        icon: <Circle className="w-4 h-4 text-orange-500" />
                      },
                      { 
                        value: '进行中', 
                        label: '进行中',
                        icon: <PlayCircle className="w-4 h-4 text-blue-500" />
                      },
                      { 
                        value: '已完成', 
                        label: '已完成',
                        icon: <CheckCircle2 className="w-4 h-4 text-green-500" />
                      },
                      { 
                        value: '已取消', 
                        label: '已取消',
                        icon: <XCircle className="w-4 h-4 text-gray-500" />
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Assignee - Custom Select */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">负责人</div>
                </div>
                <div className="ml-11">
                  <CustomMultiSelect
                    value={task.assignees?.map(assignee => assignee.id) || []}
                    onChange={async (newAssigneeIds) => {
                      if (onUpdateField && task) {
                        console.log('[TaskSidePanel] 更新负责人:', newAssigneeIds);
                        // 将字符串ID转换为数字ID数组
                        const assigneeIds = newAssigneeIds.map(id => Number(id));
                        await onUpdateField(task.id, 'assigned_to', assigneeIds);
                      }
                    }}
                    options={employees.map((employee) => ({
                      value: String(employee.id),
                      label: employee.name,
                      icon: employee.avatar_url ? (
                        <img 
                          src={employee.avatar_url} 
                          alt={employee.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-400">
                          {employee.name.charAt(0)}
                        </div>
                      )
                    }))}
                    placeholder="选择负责人..."
                  />
                </div>
              </div>

              {/* Priority - Custom Select */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <Flag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">优先级</div>
                </div>
                <div className="ml-11">
                  <CustomSelect
                    value={task.priority}
                    onChange={async (newPriority) => {
                      if (onUpdateField && task) {
                        await onUpdateField(task.id, 'priority', newPriority as string);
                      }
                    }}
                    options={[
                      { 
                        value: '高', 
                        label: '高',
                        icon: <Flag className="w-4 h-4 text-red-500" />
                      },
                      { 
                        value: '中', 
                        label: '中',
                        icon: <Flag className="w-4 h-4 text-blue-500" />
                      },
                      { 
                        value: '低', 
                        label: '低',
                        icon: <Flag className="w-4 h-4 text-gray-500" />
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Related Student - Custom Select */}
              <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">关联学生</div>
                </div>
                <div className="ml-11">
                  <CustomSelect
                    value={task.relatedStudent?.id || ''}
                    onChange={async (newStudentId) => {
                      if (onUpdateField && task) {
                        console.log('[TaskSidePanel] 更新关联学生:', newStudentId);
                        await onUpdateField(task.id, 'related_student_id', newStudentId ? Number(newStudentId) : null);
                      }
                    }}
                    options={[
                      { 
                        value: '', 
                        label: '无关联学生',
                        icon: <User className="w-4 h-4 text-gray-400" />
                      },
                      ...students.map((student) => {
                        const statusStyle = getStudentStatusStyle(student);
                        return {
                          value: String(student.id),
                          label: (
                            <div className="flex items-center gap-2 w-full">
                              <span>{student.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.color} flex-shrink-0`}>
                                {statusStyle.label}
                              </span>
                            </div>
                          ),
                          icon: student.avatar_url ? (
                            <img 
                              src={student.avatar_url} 
                              alt={student.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                              {student.name.charAt(0)}
                            </div>
                          ),
                          // 添加搜索文本，用于搜索功能
                          searchText: student.name
                        };
                      })
                    ]}
                    placeholder="选择关联学生..."
                  />
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">任务描述</h3>
                {editingField !== 'description' && (
                  <button 
                    onClick={() => startEdit('description', task.description)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
              
              {editingField === 'description' ? (
                <div className="space-y-3">
                  <textarea
                    value={editValue !== null ? editValue : (task.description || '')}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      // 处理回车键 - 保存编辑
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        saveEdit();
                      }
                      // 处理ESC键 - 取消编辑
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelEdit();
                      }
                    }}
                    placeholder="请输入任务描述..."
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white resize-none"
                    rows={4}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors"
                  onClick={() => startEdit('description', task.description)}
                >
                  {task.description || '暂无描述，点击添加描述...'}
                </div>
              )}
            </div>

            {/* Attachments */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">附件</h3>
                  {attachments.length > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({attachments.length})
                    </span>
                  )}
                </div>
              </div>
              
              {/* 附件列表和上传 */}
              <div className="space-y-2">
                {attachmentsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                      <span className="text-sm">加载中...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <TaskAttachmentList
                      attachments={attachments}
                      onDeleteAttachment={handleDeleteAttachment}
                      currentUserId={currentUserId}
                    />
                    
                    <TaskAttachmentUploader
                      taskId={Number(task.id)}
                      onUploadSuccess={handleAttachmentUploadSuccess}
                      onError={handleAttachmentUploadError}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'subtasks' | 'activities' | 'files' | 'comments')}
                    className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content - Sub-tasks */}
              {activeTab === 'subtasks' && (
                <div className="mt-4 space-y-3">
                  {subtasksLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
                        <span className="text-sm">加载中...</span>
                      </div>
                    </div>
                  ) : subtasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p className="text-sm mb-4">暂无子任务</p>
                    </div>
                  ) : (
                    subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <input 
                          type="checkbox" 
                          checked={subtask.completed}
                          onChange={(e) => handleToggleSubtask(subtask.id, e.target.checked)}
                          className="mt-1 w-4 h-4 text-purple-600 rounded cursor-pointer" 
                        />
                        <div className="flex-1">
                          <div className={`text-sm font-medium mb-1 ${
                            subtask.completed 
                              ? 'line-through text-gray-500 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {subtask.title}
                          </div>
                          {subtask.description && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                              {subtask.description}
                            </div>
                          )}
                          {subtask.due_date && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(subtask.due_date).toLocaleDateString('zh-CN')}
                            </div>
                          )}
                          <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                            subtask.completed
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : subtask.status === '进行中'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                          }`}>
                            {subtask.completed ? '已完成' : subtask.status}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteSubtask(subtask.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="删除子任务"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}

                  {/* 添加子任务输入框 */}
                  {isAddingSubtask ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSubtask();
                          }
                        }}
                        placeholder="输入子任务标题..."
                        className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-purple-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                        autoFocus
                      />
                      <button
                        onClick={handleAddSubtask}
                        className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                      >
                        添加
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingSubtask(false);
                          setNewSubtaskTitle('');
                        }}
                        className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsAddingSubtask(true)}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      添加子任务
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default TaskSidePanel;
