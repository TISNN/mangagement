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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all group ${
              action.color === 'blue' 
                ? 'border-blue-100 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                : action.color === 'purple'
                ? 'border-purple-100 dark:border-purple-900/30 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/10'
                : action.color === 'orange'
                ? 'border-orange-100 dark:border-orange-900/30 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                : 'border-green-100 dark:border-green-900/30 hover:border-green-300 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/10'
            }`}
          >
            <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
              action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
              action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
              action.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
              'bg-green-100 dark:bg-green-900/30'
            }`}>
              <action.icon className={`w-6 h-6 ${
                action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                action.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                'text-green-600 dark:text-green-400'
              }`} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

