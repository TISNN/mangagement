/**
 * 任务筛选器组件
 */

import React from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { TaskFilters as ITaskFilters } from '../../types/task.types';
import { STATUS_OPTIONS, TIME_VIEWS, PRIORITY_OPTIONS } from '../../utils/taskConstants';

interface TaskFiltersProps {
  filters: ITaskFilters;
  onFilterChange: (key: keyof ITaskFilters, value: any) => void;
  onReset: () => void;
  allTags: string[];
  quickTaskInput: string;
  onQuickTaskChange: (value: string) => void;
  onQuickTaskSubmit: () => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  allTags,
  quickTaskInput,
  onQuickTaskChange,
  onQuickTaskSubmit,
}) => {
  const hasActiveFilters = 
    filters.search || 
    filters.status || 
    filters.priority ||
    filters.assignee ||
    filters.tag || 
    filters.timeView !== 'all';

  return (
    <div className="space-y-3">
      {/* 搜索和快速创建 */}
      <div className="flex gap-3">
        {/* 搜索框 */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="搜索任务标题或描述..."
            className="w-full pl-10 pr-10 py-2.5 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-white dark:bg-white text-black dark:text-black placeholder-gray-500 dark:placeholder-gray-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* 快速创建 */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={quickTaskInput}
            onChange={(e) => onQuickTaskChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onQuickTaskSubmit();
              }
            }}
            placeholder="快速创建任务 (回车)"
            className="w-full px-4 py-2.5 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:border-transparent bg-white dark:bg-white text-black dark:text-black placeholder-gray-500 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* 筛选器 */}
      <div className="flex items-center gap-3 flex-wrap bg-white dark:bg-white p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">筛选:</span>
        </div>

        {/* 状态筛选 */}
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange('status', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部状态</option>
          {STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 优先级筛选 */}
        <select
          value={filters.priority || ''}
          onChange={(e) => onFilterChange('priority', e.target.value || null)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          <option value="">全部优先级</option>
          {PRIORITY_OPTIONS.map(option => (
            <option key={option.value} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 时间视图筛选 */}
        <select
          value={filters.timeView}
          onChange={(e) => onFilterChange('timeView', e.target.value as any)}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        >
          {TIME_VIEWS.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>

        {/* 标签筛选 */}
        {allTags.length > 0 && (
          <select
            value={filters.tag || ''}
            onChange={(e) => onFilterChange('tag', e.target.value || null)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <option value="">全部标签</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        )}

        {/* 重置按钮 */}
        {hasActiveFilters && (
          <>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置筛选</span>
            </button>
          </>
        )}
      </div>

      {/* 活动筛选标签 */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 dark:text-gray-400">已选筛选:</span>
          
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
              状态: {filters.status}
              <button
                onClick={() => onFilterChange('status', null)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.priority && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
              优先级: {filters.priority}
              <button
                onClick={() => onFilterChange('priority', null)}
                className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.tag && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs">
              标签: {filters.tag}
              <button
                onClick={() => onFilterChange('tag', null)}
                className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.timeView !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
              时间: {TIME_VIEWS.find(v => v.id === filters.timeView)?.name}
              <button
                onClick={() => onFilterChange('timeView', 'all')}
                className="hover:bg-orange-200 dark:hover:bg-orange-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskFilters;

