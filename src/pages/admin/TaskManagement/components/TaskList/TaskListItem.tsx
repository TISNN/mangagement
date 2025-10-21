/**
 * 任务列表项组件
 */

import React from 'react';
import { Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { UITask } from '../../types/task.types';
import { PRIORITY_MAP, STATUS_MAP } from '../../utils/taskConstants';

interface TaskListItemProps {
  task: UITask;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (newStatus: string) => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  onClick,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const priorityInfo = PRIORITY_MAP[task.priority] || PRIORITY_MAP['中'];
  const statusInfo = STATUS_MAP[task.status] || STATUS_MAP['待处理'];

  // 格式化日期显示
  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '未设置';
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '明天';
    if (diffDays === -1) return '昨天';
    if (diffDays < 0) return `逾期${-diffDays}天`;
    if (diffDays <= 7) return `${diffDays}天后`;
    
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
  };

  return (
    <div 
      className="group p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <div className="flex items-start gap-4">
        {/* 复选框 */}
        <input
          type="checkbox"
          checked={task.status === '已完成'}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(e.target.checked ? '已完成' : '进行中');
          }}
          className="mt-1 w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
        />

        {/* 任务信息 */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-medium text-gray-900 dark:text-white ${
              task.status === '已完成' ? 'line-through opacity-60' : ''
            }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityInfo.style}`}>
              {priorityInfo.text}
            </span>
          </div>

          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {/* 截止日期 */}
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDueDate(task.dueDate)}</span>
              </div>
            )}

            {/* 负责人 */}
            {task.assignee && (
              <div className="flex items-center gap-1">
                <img 
                  src={task.assignee.avatar} 
                  alt={task.assignee.name}
                  className="w-4 h-4 rounded-full"
                />
                <span>{task.assignee.name}</span>
              </div>
            )}

            {/* 标签 */}
            {task.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {task.tags.slice(0, 2).map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {task.tags.length > 2 && (
                  <span className="text-xs">+{task.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 状态标签 */}
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${statusInfo.bgStyle} ${statusInfo.textStyle}`}>
            {statusInfo.text}
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="编辑"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskListItem;

