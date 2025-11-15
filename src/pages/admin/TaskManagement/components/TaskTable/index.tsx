/**
 * 任务表格视图组件
 * 参照专业UI设计
 */

import React, { useState, useRef, useEffect } from 'react';
import { Flag, Calendar, MoreVertical, Trash2 } from 'lucide-react';
import { UITask } from '../../types/task.types';

interface TaskTableProps {
  tasks: UITask[];
  onTaskClick: (task: UITask) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onDeleteTask?: (task: UITask) => void;
  selectedTaskId?: string;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onTaskClick,
  onStatusChange,
  onDeleteTask,
  selectedTaskId,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 调试：检查 onDeleteTask 是否正确传递
  console.log('[TaskTable] onDeleteTask:', typeof onDeleteTask, onDeleteTask);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId) return;
      const activeMenu = menuRefs.current[openMenuId];
      if (activeMenu && !activeMenu.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {};
  }, [openMenuId]);
  // 优先级图标和样式映射
  const getPriorityDisplay = (priority: string) => {
    const priorityConfig = {
      '高': { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: '高' },
      '中': { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: '中' },
      '低': { color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-700/50', label: '低' },
    };
    return priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['中'];
  };

  // 状态样式映射
  const getStatusDisplay = (status: string) => {
    const statusConfig = {
      '待处理': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', label: '待处理' },
      '进行中': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', label: '进行中' },
      '已完成': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', label: '已完成' },
      '已取消': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', label: '已取消' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig['待处理'];
  };

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                任务名称
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                负责人
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                关联对象
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                优先级
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                开始日期
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                截止日期
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                状态
              </th>
              <th className="w-12"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => {
              const priorityDisplay = getPriorityDisplay(task.priority);
              const statusDisplay = getStatusDisplay(task.status);
              const isSelected = selectedTaskId === task.id;

              return (
                <tr
                  key={task.id}
                  onClick={(e) => {
                    // 检查点击是否来自菜单区域
                    const target = e.target as HTMLElement;
                    const isMenuClick = target.closest('[data-menu]') || target.closest('button');
                    if (!isMenuClick) {
                      onTaskClick(task);
                    }
                  }}
                  className={`
                    transition-colors cursor-pointer
                    hover:bg-gray-50 dark:hover:bg-gray-700/30
                    ${isSelected ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                    ${task.status === '已完成' ? 'opacity-60' : ''}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={task.status === '已完成'}
                      onChange={(e) => {
                        e.stopPropagation();
                        onStatusChange(task.id, e.target.checked ? '已完成' : '进行中');
                      }}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    />
                  </td>

                  {/* Task Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`font-medium text-gray-900 dark:text-white ${
                        task.status === '已完成' ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </div>
                      {task.relatedMeeting && (
                        <div 
                          className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
                          title={`关联会议: ${task.relatedMeeting.title}`}
                        >
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs">会议</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Assignees */}
                  <td className="px-4 py-4">
                    {task.assignees && task.assignees.length > 0 ? (
                      <div className="flex items-center gap-1 flex-wrap">
                        {task.assignees.slice(0, 5).map((assignee) => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name}
                            className="w-6 h-6 rounded-full border border-white dark:border-gray-800"
                            title={assignee.name}
                          />
                        ))}
                        {task.assignees.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            +{task.assignees.length - 5}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  {/* Related Entity（更新为通用关联对象） */}
                  <td className="px-4 py-4">
                    {task.relatedStudent ? (
                      <div className="flex items-center gap-2">
                        {task.relatedStudent.avatar ? (
                          <img
                            src={task.relatedStudent.avatar}
                            alt={task.relatedStudent.name}
                            className="w-6 h-6 rounded-full border border-white dark:border-gray-800 object-cover"
                            title={task.relatedStudent.name}
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-white dark:border-gray-800 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            {task.relatedStudent.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex items-center max-w-[150px]">
                          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {task.relatedStudent.name}
                          </span>
                        </div>
                      </div>
                    ) : task.relatedLead ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-white dark:border-gray-800 bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xs font-medium text-pink-600 dark:text-pink-400">
                          {task.relatedLead.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                          {task.relatedLead.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                          线索
                        </span>
                      </div>
                    ) : task.relatedEntityName ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                          {task.relatedEntityName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${priorityDisplay.bg}`}>
                      <Flag className={`w-3.5 h-3.5 ${priorityDisplay.color}`} />
                      <span className={`text-xs font-medium ${priorityDisplay.color}`}>
                        {priorityDisplay.label}
                      </span>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.startDate)}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(task.dueDate)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.bg} ${statusDisplay.text}`}>
                      {statusDisplay.label}
                    </span>
                  </td>

                  {/* More Options */}
                  <td className="px-4 py-4">
                    <div className="relative" ref={el => menuRefs.current[task.id] = el}>
                      <button
                        onClick={(e) => {
                          console.log('[TaskTable] 三个点按钮被点击', task.id, '当前openMenuId:', openMenuId);
                          e.stopPropagation();
                          const newMenuId = openMenuId === task.id ? null : task.id;
                          console.log('[TaskTable] 设置新的openMenuId:', newMenuId);
                          setOpenMenuId(newMenuId);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* 下拉菜单 */}
                      {openMenuId === task.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999]"
                          data-menu="true"
                        >
                          <div className="py-1">
                            {/* 菜单渲染调试 */}
                            <button
                              onClick={(e) => {
                                console.log('[TaskTable] 删除按钮被点击', task);
                                e.preventDefault();
                                e.stopPropagation();
                                
                                setOpenMenuId(null);
                                if (onDeleteTask) {
                                  console.log('[TaskTable] 调用 onDeleteTask');
                                  setTimeout(() => {
                                    onDeleteTask(task);
                                  }, 0);
                                } else {
                                  console.error('[TaskTable] onDeleteTask 函数未定义！');
                                }
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                              disabled={!onDeleteTask}
                            >
                              <Trash2 className="w-4 h-4" />
                              删除任务
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium mb-1">暂无任务</p>
          <p className="text-sm">点击"新建任务"按钮创建第一个任务</p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
