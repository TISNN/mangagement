import React from 'react';
import { LayoutGrid, List, Table } from 'lucide-react';
import { ViewMode } from '../../../../types/case';

interface ViewTabsProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewTabs: React.FC<ViewTabsProps> = ({ activeView, onViewChange }) => {
  const views: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: 'grid', label: '卡片', icon: LayoutGrid },
    { id: 'list', label: '列表', icon: List },
    { id: 'table', label: '表格', icon: Table },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
      {views.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeView === view.id
              ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <view.icon className="w-4 h-4" />
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewTabs;

