/**
 * Dashboard 快捷操作组件
 */

import React from 'react';
import { QuickAction } from '../../types/dashboard.types';

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">快捷操作</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex items-center gap-3 p-4 rounded-xl transition-all group ${
              action.color === 'blue' 
                ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                : action.color === 'purple'
                ? 'bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                : action.color === 'orange'
                ? 'bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                : 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            <div className={`p-2 rounded-lg transition-transform group-hover:scale-110 ${
              action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-800/50' :
              action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-800/50' :
              action.color === 'orange' ? 'bg-orange-100 dark:bg-orange-800/50' :
              'bg-green-100 dark:bg-green-800/50'
            }`}>
              <action.icon className={`w-5 h-5 ${
                action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                action.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }`} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

