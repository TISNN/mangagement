/**
 * 任务详情弹窗组件
 */

import React from 'react';
import { X, Calendar, Clock, User, Tag, CheckCircle2 } from 'lucide-react';
import { UITask } from '../../types/task.types';
import { PRIORITY_MAP, STATUS_MAP } from '../../utils/taskConstants';

interface TaskDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: UITask | null;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !task) return null;

  const priorityInfo = PRIORITY_MAP[task.priority] || PRIORITY_MAP['中'];
  const statusInfo = STATUS_MAP[task.status] || STATUS_MAP['待处理'];

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '未设置';
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  // 计算剩余天数
  const getDaysRemaining = (dateStr: string) => {
    if (!dateStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(task.dueDate);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
          onClick={onClose}
        />
        
        {/* 弹窗内容 */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <input
                type="checkbox"
                checked={task.status === '已完成'}
                readOnly
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <h2 className={`text-xl font-semibold text-gray-900 dark:text-white truncate ${
                task.status === '已完成' ? 'line-through opacity-60' : ''
              }`}>
                {task.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 状态和优先级 */}
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${statusInfo.bgStyle} ${statusInfo.textStyle}`}>
                {statusInfo.text}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${priorityInfo.style}`}>
                {priorityInfo.text}优先级
              </span>
            </div>

            {/* 描述 */}
            {task.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  任务描述
                </h3>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                  {task.description}
                </p>
              </div>
            )}

            {/* 任务信息网格 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 截止日期 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">截止日期</span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.dueDate)}
                </p>
                {daysRemaining !== null && (
                  <p className={`text-sm mt-1 ${
                    daysRemaining < 0 ? 'text-red-600 dark:text-red-400' :
                    daysRemaining === 0 ? 'text-orange-600 dark:text-orange-400' :
                    daysRemaining <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {daysRemaining < 0 ? `逾期${-daysRemaining}天` :
                     daysRemaining === 0 ? '今天截止' :
                     `还剩${daysRemaining}天`}
                  </p>
                )}
              </div>

              {/* 负责人 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">负责人</span>
                </div>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={task.assignee.avatar} 
                      alt={task.assignee.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {task.assignee.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {task.assignee.role}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">未分配</p>
                )}
              </div>

              {/* 创建时间 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">创建时间</span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.createdAt)}
                </p>
              </div>

              {/* 更新时间 */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">更新时间</span>
                </div>
                <p className="text-gray-900 dark:text-white font-medium">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>

            {/* 标签 */}
            {task.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                  <Tag className="w-4 h-4" />
                  <span className="text-sm font-medium">标签</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer - 操作按钮 */}
          <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
            >
              关闭
            </button>
            <div className="flex gap-3">
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors"
                >
                  编辑任务
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    onClose();
                    onDelete();
                  }}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors"
                >
                  删除任务
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;

