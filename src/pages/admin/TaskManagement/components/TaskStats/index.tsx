/**
 * 任务统计面板组件
 */

import React, { useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Circle, 
  AlertCircle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { UITask } from '../../types/task.types';

interface TaskStatsProps {
  tasks: UITask[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
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

    return {
      total,
      pending,
      inProgress,
      completed,
      canceled,
      overdue,
      dueToday,
      completionRate,
    };
  }, [tasks]);

  const statCards = [
    {
      label: '全部任务',
      value: stats.total,
      icon: Circle,
      color: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-white',
    },
    {
      label: '待处理',
      value: stats.pending,
      icon: Circle,
      color: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      textColor: 'text-gray-900 dark:text-white',
    },
    {
      label: '进行中',
      value: stats.inProgress,
      icon: Clock,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-300',
    },
    {
      label: '已完成',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-300',
    },
    {
      label: '今天到期',
      value: stats.dueToday,
      icon: Calendar,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textColor: 'text-orange-900 dark:text-orange-300',
      highlight: stats.dueToday > 0,
    },
    {
      label: '已逾期',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'bg-red-50 dark:bg-red-900/20',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-300',
      highlight: stats.overdue > 0,
    },
  ];

  return (
    <div className="space-y-4">
      {/* 统计卡片网格 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`${card.color} rounded-lg p-4 transition-all hover:shadow-md ${
                card.highlight ? 'ring-2 ring-offset-2 ring-current' : ''
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

