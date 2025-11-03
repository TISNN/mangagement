/**
 * 看板视图组件
 * 按状态分组显示任务
 */

import React from 'react';
import { UITask } from '../../types/task.types';
import { Circle, PlayCircle, CheckCircle2, XCircle, Users, Building2, Megaphone, Briefcase } from 'lucide-react';

interface KanbanViewProps {
  tasks: UITask[];
  onTaskClick: (task: UITask) => void;
  selectedTaskId?: string;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  onTaskClick,
  selectedTaskId,
}) => {
  // 按状态分组任务
  const columns = [
    { 
      id: '待处理', 
      title: '待处理', 
      icon: Circle,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700'
    },
    { 
      id: '进行中', 
      title: '进行中', 
      icon: PlayCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    { 
      id: '已完成', 
      title: '已完成', 
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    { 
      id: '已取消', 
      title: '已取消', 
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    },
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
      case '中':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
      case '低':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30';
    }
  };

  // 获取任务域显示（新增）
  const getDomainDisplay = (domain?: string) => {
    const domainConfig = {
      'general': { icon: Briefcase, color: 'text-gray-600 dark:text-gray-400', label: '通用' },
      'student_success': { icon: Users, color: 'text-purple-600 dark:text-purple-400', label: '学生' },
      'company_ops': { icon: Building2, color: 'text-orange-600 dark:text-orange-400', label: '运营' },
      'marketing': { icon: Megaphone, color: 'text-pink-600 dark:text-pink-400', label: '市场' },
    };
    return domainConfig[domain as keyof typeof domainConfig] || domainConfig['general'];
  };

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 h-full min-w-max p-4">
        {columns.map((column) => {
          const Icon = column.icon;
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div
              key={column.id}
              className="flex-shrink-0 w-80 flex flex-col"
            >
              {/* Column Header */}
              <div className={`flex items-center justify-between p-4 ${column.bgColor} border ${column.borderColor} rounded-t-lg`}>
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${column.color}`} />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {column.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-medium bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg p-2 space-y-2">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
                    暂无任务
                  </div>
                ) : (
                  columnTasks.map((task) => {
                    const isSelected = selectedTaskId === task.id;
                    
                    return (
                      <div
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`
                          bg-white dark:bg-gray-800 border rounded-lg p-4 cursor-pointer 
                          transition-all hover:shadow-md
                          ${isSelected 
                            ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }
                        `}
                      >
                        {/* Task Domain Badge（新增） */}
                        {task.domain && (
                          <div className="mb-2">
                            {(() => {
                              const domainDisplay = getDomainDisplay(task.domain);
                              const DomainIcon = domainDisplay.icon;
                              return (
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                                  <DomainIcon className={`w-3 h-3 ${domainDisplay.color}`} />
                                  <span className={`text-xs ${domainDisplay.color}`}>
                                    {domainDisplay.label}
                                  </span>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Task Title */}
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {task.title}
                        </h4>

                        {/* Task Description */}
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Related Entity（新增） */}
                        {(task.relatedStudent || task.relatedLead) && (
                          <div className="mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                            {task.relatedStudent ? (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                                  {task.relatedStudent.name.charAt(0)}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                  {task.relatedStudent.name}
                                </span>
                              </div>
                            ) : task.relatedLead && (
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xs font-medium text-pink-600 dark:text-pink-400">
                                  {task.relatedLead.name.charAt(0)}
                                </div>
                                <span className="text-xs text-gray-700 dark:text-gray-300 truncate">
                                  {task.relatedLead.name}
                                </span>
                                <span className="px-1.5 py-0.5 text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded">
                                  线索
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Task Meta */}
                        <div className="flex items-center justify-between">
                          {/* Priority */}
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>

                          {/* Due Date */}
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(task.dueDate).toLocaleDateString('zh-CN', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>

                        {/* Assignee */}
                        {task.assignee && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            {task.assignee.avatar ? (
                              <img
                                src={task.assignee.avatar}
                                alt={task.assignee.name}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xs font-medium text-purple-600 dark:text-purple-300">
                                {task.assignee.name.charAt(0)}
                              </div>
                            )}
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {task.assignee.name}
                            </span>
                          </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500">
                                +{task.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanView;

