/**
 * 资源筛选器组件
 * 提供搜索、分类、类型等筛选功能
 */

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { KnowledgeFilters } from '../../types/knowledge.types';
import { 
  RESOURCE_CATEGORIES, 
  SORT_OPTIONS, 
  DATE_RANGE_OPTIONS,
  RESOURCE_TYPE_CONFIG 
} from '../../utils/knowledgeConstants';

interface ResourceFiltersProps {
  filters: KnowledgeFilters;
  categories: string[];
  authors: string[];
  tags: string[];
  showAdvancedFilters: boolean;
  onFilterChange: (key: keyof KnowledgeFilters, value: any) => void;
  onToggleAdvanced: () => void;
  onReset: () => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  filters,
  categories,
  authors,
  tags,
  showAdvancedFilters,
  onFilterChange,
  onToggleAdvanced,
  onReset
}) => {
  return (
    <div className="space-y-4">
      {/* 搜索和基本操作 */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索资源..."
            className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-300"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <button 
          onClick={onToggleAdvanced}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
            showAdvancedFilters
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-gray-300'
          }`}
        >
          <Filter className="h-4 w-4" />
          筛选
        </button>
      </div>

      {/* 高级筛选面板 */}
      {showAdvancedFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium dark:text-white">筛选条件</h3>
            <button
              onClick={onReset}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <X className="h-4 w-4" />
              重置
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 资源分类 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">资源分类</label>
              <select 
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 资源类型 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">资源类型</label>
              <select 
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                <option value="all">全部类型</option>
                {Object.entries(RESOURCE_TYPE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            {/* 上传者 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">上传者</label>
              <select 
                value={filters.author}
                onChange={(e) => onFilterChange('author', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                {authors.map((author) => (
                  <option key={author} value={author === '全部作者' ? '' : author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">标签</label>
              <select 
                value={filters.tag}
                onChange={(e) => onFilterChange('tag', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                <option value="">全部标签</option>
                {tags.slice(0, 20).map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>

            {/* 更新时间 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">更新时间</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => onFilterChange('dateRange', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                {DATE_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* 排序方式 */}
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">排序方式</label>
              <select 
                value={filters.sortBy}
                onChange={(e) => onFilterChange('sortBy', e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm dark:text-gray-300"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 激活的筛选标签 */}
          {(filters.category !== '全部分类' || filters.type !== 'all' || filters.tag || filters.dateRange !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {filters.category !== '全部分类' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-xs font-medium">
                  {filters.category}
                  <button onClick={() => onFilterChange('category', '全部分类')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-lg text-xs font-medium">
                  {RESOURCE_TYPE_CONFIG[filters.type].label}
                  <button onClick={() => onFilterChange('type', 'all')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.tag && (
                <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg text-xs font-medium">
                  {filters.tag}
                  <button onClick={() => onFilterChange('tag', '')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-lg text-xs font-medium">
                  {DATE_RANGE_OPTIONS.find(o => o.value === filters.dateRange)?.label}
                  <button onClick={() => onFilterChange('dateRange', 'all')}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

