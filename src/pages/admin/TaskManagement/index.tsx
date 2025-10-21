/**
 * 任务管理主页面
 * 重构版 - 结构清晰、易于维护
 */

import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTaskData } from './hooks/useTaskData';
import { useTaskOperations } from './hooks/useTaskOperations';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useTaskModals } from './hooks/useTaskModals';
import TaskForm from './components/TaskForm';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskTable from './components/TaskTable';
import TaskSidePanel from './components/TaskSidePanel';
import ViewTabs from './components/ViewTabs';
import KanbanView from './components/KanbanView';
import CalendarView from './components/CalendarView';
import { UITask } from './types/task.types';

const TaskManagementPage: React.FC = () => {
  // 数据层
  const { tasks, loading, error, reload } = useTaskData();
  const [employees, setEmployees] = useState<Array<{ id: number; name: string; avatar_url?: string; position?: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: number; name: string; avatar_url?: string; status?: string; is_active?: boolean }>>([]);
  const { 
    createTask, 
    updateTask, 
    updateTaskStatus, 
    deleteTask, 
    quickCreateTask 
  } = useTaskOperations(reload);
  const { filters, updateFilter, resetFilters, filteredTasks, allTags } = useTaskFilters(tasks);
  
  // UI状态层
  const {
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteConfirmOpen,
    currentTask,
    openCreateModal,
    openEditModal,
    openDetailModal,
    openDeleteConfirm,
    closeAllModals,
    updateCurrentTask,
  } = useTaskModals();

  const [quickTaskInput, setQuickTaskInput] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'day' | 'week'>('list');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // 加载员工列表
  React.useEffect(() => {
    const loadEmployees = async () => {
      try {
        const { supabase } = await import('../../../supabase');
        const { data, error } = await supabase
          .from('employees')
          .select('id, name, avatar_url, position')
          .order('name');
        
        if (error) throw error;
        setEmployees(data || []);
      } catch (err) {
        console.error('加载员工列表失败:', err);
      }
    };
    loadEmployees();
  }, []);

  // 加载学生列表
  React.useEffect(() => {
    const loadStudents = async () => {
      try {
        const { supabase } = await import('../../../supabase');
        const { data, error } = await supabase
          .from('students')
          .select('id, name, avatar_url, status, is_active')
          .order('name');
        
        if (error) throw error;
        setStudents(data || []);
      } catch (err) {
        console.error('加载学生列表失败:', err);
      }
    };
    loadStudents();
  }, []);

  // 当tasks更新时,同步更新侧边面板的currentTask
  React.useEffect(() => {
    if (currentTask && tasks.length > 0) {
      const updatedTask = tasks.find(t => t.id === currentTask.id);
      if (updatedTask) {
        // 详细比较主要字段，避免深度比较性能问题
        const statusChanged = updatedTask.status !== currentTask.status;
        const priorityChanged = updatedTask.priority !== currentTask.priority;
        const titleChanged = updatedTask.title !== currentTask.title;
        const descriptionChanged = updatedTask.description !== currentTask.description;
        const startDateChanged = updatedTask.startDate !== currentTask.startDate;
        const dueDateChanged = updatedTask.dueDate !== currentTask.dueDate;
        // 比较多个负责人的变化
        const currentAssignees = currentTask.assignees?.map(a => a.id).sort().join(',') || '';
        const updatedAssignees = updatedTask.assignees?.map(a => a.id).sort().join(',') || '';
        const assigneesChanged = currentAssignees !== updatedAssignees;
        
        // 比较关联学生的变化
        const currentStudentId = currentTask.relatedStudent?.id || '';
        const updatedStudentId = updatedTask.relatedStudent?.id || '';
        const studentChanged = currentStudentId !== updatedStudentId;
        
        const hasChanges = statusChanged || priorityChanged || titleChanged || descriptionChanged || startDateChanged || dueDateChanged || assigneesChanged || studentChanged;
        
        if (hasChanges) {
          console.log('[TaskManagement] 检测到任务数据变化，同步更新侧边面板:', {
            taskId: currentTask.id,
            changes: {
              status: statusChanged ? `${currentTask.status} -> ${updatedTask.status}` : 'no change',
              priority: priorityChanged ? `${currentTask.priority} -> ${updatedTask.priority}` : 'no change',
              title: titleChanged ? `${currentTask.title} -> ${updatedTask.title}` : 'no change',
              description: descriptionChanged ? `描述已更新` : 'no change',
              startDate: startDateChanged ? `${currentTask.startDate} -> ${updatedTask.startDate}` : 'no change',
              dueDate: dueDateChanged ? `${currentTask.dueDate} -> ${updatedTask.dueDate}` : 'no change',
              assignees: assigneesChanged ? `${currentAssignees} -> ${updatedAssignees}` : 'no change',
              student: studentChanged ? `${currentStudentId} -> ${updatedStudentId}` : 'no change'
            },
            oldTask: currentTask,
            newTask: updatedTask
          });
          updateCurrentTask(updatedTask);
        }
      }
    }
  }, [tasks, currentTask, updateCurrentTask]);

  // 快速创建任务
  const handleQuickCreate = async () => {
    if (quickTaskInput.trim()) {
      const result = await quickCreateTask(quickTaskInput);
      if (result.success) {
        setQuickTaskInput('');
      }
    }
  };

  // 处理删除确认
  const handleConfirmDelete = async () => {
    if (!currentTask) return;
    
    try {
      const result = await deleteTask(currentTask.id);
      if (result.success) {
        toast.success('任务删除成功');
        closeAllModals();
      } else {
        toast.error(result.message || '删除失败，请重试');
      }
    } catch (error) {
      console.error('[TaskManagement] 删除任务异常:', error);
      toast.error('删除失败，请检查网络连接或重试');
    }
  };

  // Loading状态
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">加载任务数据中...</p>
        </div>
      </div>
    );
  }

  // 处理任务点击 - 打开侧边面板
  const handleTaskClick = (task: UITask) => {
    setSelectedTaskId(task.id);
    setIsSidePanelOpen(true);
    openDetailModal(task);
  };

  // 处理删除任务 - 直接打开删除确认弹窗
  const handleDeleteTask = (task: UITask) => {
    console.log('[TaskManagement] handleDeleteTask 被调用', task);
    openDeleteConfirm(task);
  };

  // 更新任务字段
  const handleUpdateTaskField = async (taskId: string, field: string, value: string | number | number[] | string[] | null) => {
    try {
      console.log('[TaskManagement] 更新任务字段:', { taskId, field, value, valueType: typeof value });
      
      // 导入taskService并直接调用更新方法
      const taskServiceModule = await import('../../../services/taskService');
      const { updateTask: taskServiceUpdateTask } = taskServiceModule;
      
      // 构造更新数据，注意字段映射
      const updateData: Record<string, unknown> = {};
      
      if (field === 'status') {
        updateData.status = value as '待处理' | '进行中' | '已完成' | '已取消';
      } else if (field === 'priority') {
        updateData.priority = value as '高' | '中' | '低';
      } else if (field === 'assigned_to') {
        // 处理多选负责人
        if (Array.isArray(value)) {
          updateData.assigned_to = value.length > 0 ? value : null;
        } else {
          updateData.assigned_to = (value === '' || value === 0) ? null : (typeof value === 'number' ? [value] : [parseInt(value as string)]);
        }
      } else if (field === 'start_date') {
        updateData.start_date = value ? value as string : undefined;
      } else if (field === 'due_date') {
        updateData.due_date = value ? value as string : undefined;
      } else if (field === 'description') {
        updateData.description = value !== null ? value as string : undefined;
      } else if (field === 'title') {
        updateData.title = value !== null ? value as string : undefined;
      } else if (field === 'related_student_id') {
        updateData.related_student_id = (value === '' || value === null) ? null : (typeof value === 'number' ? value : parseInt(value as string));
      } else {
        updateData[field] = value;
      }

      // 调用service更新任务
      console.log('[TaskManagement] 调用service更新任务:', { taskId: parseInt(taskId), updateData });
      await taskServiceUpdateTask(parseInt(taskId), updateData);
      
      console.log('[TaskManagement] 任务字段更新成功，重新加载数据');
      
      // 重新加载数据，这会触发useEffect更新侧边面板
      await reload();
      
      return { success: true, message: '更新成功' };
    } catch (error) {
      console.error('[TaskManagement] 更新任务字段失败:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '更新失败'
      };
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-16">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              我的任务
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              在这里监控和管理所有任务
            </p>
          </div>
          
          {/* View Tabs */}
          <ViewTabs 
            activeView={viewMode} 
            onViewChange={(view) => setViewMode(view as 'list' | 'day' | 'week')} 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            新建任务
          </button>
        </div>
      </div>

      {/* Error提示 */}
      {error && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={reload}
            className="px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded text-sm font-medium transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {/* 统计面板 */}
      <TaskStats tasks={tasks} />

      {/* 筛选器 */}
      <TaskFilters
        filters={filters}
        onFilterChange={updateFilter}
        onReset={resetFilters}
        allTags={allTags}
        quickTaskInput={quickTaskInput}
        onQuickTaskChange={setQuickTaskInput}
        onQuickTaskSubmit={() => {
          if (quickTaskInput.trim()) {
            handleQuickCreate();
          }
        }}
      />

      {/* 任务列表/表格 */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'list' && (
          <TaskTable
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            onStatusChange={updateTaskStatus}
            onDeleteTask={handleDeleteTask}
            selectedTaskId={selectedTaskId || undefined}
          />
        )}
        
        {viewMode === 'day' && (
          <KanbanView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            selectedTaskId={selectedTaskId || undefined}
          />
        )}
        
        {viewMode === 'week' && (
          <CalendarView
            tasks={filteredTasks}
            onTaskClick={handleTaskClick}
            selectedTaskId={selectedTaskId || undefined}
          />
        )}
      </div>

      {/* 侧边详情面板 */}
      <TaskSidePanel
        isOpen={isSidePanelOpen}
        task={currentTask}
        onClose={() => {
          setIsSidePanelOpen(false);
          setSelectedTaskId(null);
          closeAllModals();
        }}
        onEdit={() => {
          if (currentTask) {
            setIsSidePanelOpen(false);
            setTimeout(() => openEditModal(currentTask), 100);
          }
        }}
        onDelete={() => {
          if (currentTask) {
            setIsSidePanelOpen(false);
            setTimeout(() => openDeleteConfirm(currentTask), 100);
          }
        }}
        onUpdateField={handleUpdateTaskField}
        employees={employees}
        students={students}
      />

      {/* 新建/编辑任务弹窗 */}
      <TaskForm
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={closeAllModals}
        onSubmit={isEditModalOpen && currentTask ? 
          (data) => updateTask(currentTask.id, data) : 
          createTask
        }
        task={currentTask}
        title={isCreateModalOpen ? '新建任务' : '编辑任务'}
      />

      {/* 删除确认弹窗 */}
      {isDeleteConfirmOpen && currentTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-30"
              onClick={closeAllModals}
            />
            
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                确认删除
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                确定要删除任务 "<span className="font-medium">{currentTask.title}</span>" 吗?此操作无法撤销。
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementPage;











