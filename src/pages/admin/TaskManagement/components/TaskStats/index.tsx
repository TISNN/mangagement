/**
 * 任务统计面板组件
 */

import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { TaskFilters, UITask } from '../../types/task.types';

interface TaskStatsProps {
  tasks: UITask[];
  currentStatusFilter?: TaskFilters['status'];
  onStatusFilterChange?: (status: TaskFilters['status']) => void;
  currentTimeFilter?: TaskFilters['timeView'];
  onTimeFilterChange?: (timeView: TaskFilters['timeView']) => void;
}

const TaskStats: React.FC<TaskStatsProps> = ({
  tasks,
  currentStatusFilter = null,
  onStatusFilterChange,
  currentTimeFilter = 'all',
  onTimeFilterChange,
}) => {
  // 计算统计数据
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === '待处理').length;
    const inProgress = tasks.filter(t => t.status === '进行中').length;
    const completed = tasks.filter(t => t.status === '已完成').length;
    const canceled = tasks.filter(t => t.status === '已取消').length;
    
    // 计算逾期任务
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(t => {
      if (!t.dueDate || t.status === '已完成' || t.status === '已取消') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    }).length;

    // 计算今天到期的任务
    const dueToday = tasks.filter(t => {
      if (!t.dueDate || t.status === '已完成' || t.status === '已取消') return false;
      const dueDate = new Date(t.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    }).length;

    // 计算完成率
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 按关联类型统计（新增）
    const byEntityType = {
      student: tasks.filter(t => t.relatedEntityType === 'student').length,
      lead: tasks.filter(t => t.relatedEntityType === 'lead').length,
      employee: tasks.filter(t => t.relatedEntityType === 'employee').length,
      none: tasks.filter(t => !t.relatedEntityType || t.relatedEntityType === 'none').length,
    };

    return {
      total,
      pending,
      inProgress,
      completed,
      canceled,
      overdue,
      dueToday,
      completionRate,
      byEntityType,
    };
  }, [tasks]);

  const statCards: Array<{
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    iconColor: string;
    textColor: string;
    highlight?: boolean;
    statusFilter?: TaskFilters['status'] | 'all';
    timeFilter?: TaskFilters['timeView'] | 'all';
  }> = [
    {
      label: '全部任务',
      value: stats.total,
      icon: Circle,
      color: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-white',
      statusFilter: 'all',
    },
    {
      label: '待处理',
      value: stats.pending,
      icon: Circle,
      color: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-white',
      statusFilter: '待处理',
    },
    {
      label: '进行中',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-300',
      statusFilter: '进行中',
    },
    {
      label: '已完成',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-300',
      statusFilter: '已完成',
    },
    {
      label: '今天到期',
      value: stats.dueToday,
      icon: Calendar,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-900 dark:text-orange-300',
      highlight: stats.dueToday > 0,
      timeFilter: 'today',
    },
    {
      label: '已逾期',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-300',
      highlight: stats.overdue > 0,
      timeFilter: 'expired',
    },
  ];

  return (
    <div className="space-y-4">
      {/* 主要统计卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const isStatusCard = typeof card.statusFilter !== 'undefined';
          const isTimeCard = typeof card.timeFilter !== 'undefined';
          const isInteractive = isStatusCard || isTimeCard;

          const isActive = (() => {
            if (isStatusCard) {
              if (card.statusFilter === 'all') {
                return currentStatusFilter === null;
              }
              return currentStatusFilter === card.statusFilter;
            }
            if (isTimeCard) {
              if (card.timeFilter === 'all') {
                return currentTimeFilter === 'all';
              }
              return currentTimeFilter === card.timeFilter;
            }
            return false;
          })();

          const handleCardClick = () => {
            if (isStatusCard && onStatusFilterChange) {
              if (card.statusFilter === 'all') {
                onStatusFilterChange(null);
              } else {
                onStatusFilterChange(card.statusFilter as TaskFilters['status']);
              }
              return;
            }

            if (isTimeCard && onTimeFilterChange) {
              if (card.timeFilter === 'all') {
                onTimeFilterChange('all');
              } else {
                const typedTimeFilter = card.timeFilter as TaskFilters['timeView'];
                onTimeFilterChange(
                  currentTimeFilter === typedTimeFilter ? 'all' : typedTimeFilter
                );
              }
            }
          };

          return (
            <div
              key={index}
              role={isInteractive ? 'button' : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              onClick={handleCardClick}
              onKeyDown={(event) => {
                if (!isInteractive) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleCardClick();
                }
              }}
              aria-pressed={isInteractive ? isActive : undefined}
              className={`${card.color} rounded-lg p-4 transition-all hover:shadow-md ${
                isInteractive
                  ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900'
                  : ''
              } ${
                isActive ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900 shadow-lg' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
                {card.highlight && (
                  <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                )}
              </div>
              <div className={`text-2xl font-bold ${card.textColor} mb-1`}>
                {card.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {card.label}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default TaskStats;

