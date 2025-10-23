/**
 * Dashboard 任务面板组件
 */

import React from 'react';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { DashboardTask } from '../../types/dashboard.types';

interface TasksPanelProps {
  tasks: DashboardTask[];
  onToggleTask: (taskId: number) => void;
  onViewAll: () => void;
  loading?: boolean;
}

export const TasksPanel: React.FC<TasksPanelProps> = ({
  tasks,
  onToggleTask,
  onViewAll,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 dark:bg-gray-800 animate-pulse">
        <div className="h-64"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">我的任务</h2>
        </div>
        <button 
          onClick={onViewAll}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
        >
          查看全部 <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-sm">暂无待办任务</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all group"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className="mt-1 flex-shrink-0"
              >
                <CheckCircle2 className={`w-5 h-5 ${
                  task.completed 
                    ? 'text-green-500 fill-green-500' 
                    : 'text-gray-300 dark:text-gray-600 group-hover:text-purple-400'
                } transition-colors`} />
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through opacity-50' : ''}`}>
                      {task.icon} {task.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {task.deadline && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          task.type === 'urgent' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        }`}>
                          {task.deadline}
                        </span>
                      )}
                      {task.count && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {task.count}条未读
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

