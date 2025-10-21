/**
 * 视图切换标签组件
 * Table | Kanban | Calendar
 */

import React from 'react';
import { ViewMode } from '../../types/task.types';

interface ViewTabsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ activeView, onViewChange }) => {
  const views: { id: ViewMode; label: string }[] = [
    { id: 'list', label: '表格' },
    { id: 'day', label: '看板' },
    { id: 'week', label: '日历' },
  ];

  return (
    <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`
            px-6 py-2 text-sm font-medium rounded-md transition-all
            ${
              activeView === view.id
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }
          `}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;

