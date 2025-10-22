import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { CaseStudyFilters } from '../../../../types/case';

interface CaseFiltersProps {
  filters: CaseStudyFilters;
  onFilterChange: (key: keyof CaseStudyFilters, value: string) => void;
  onClearFilters: () => void;
}

const CaseFilters: React.FC<CaseFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = filters.region || filters.school || filters.major_type || filters.admission_result;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
      {/* 搜索框 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索学校、专业、本科院校..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        )}
      </div>

      {/* 筛选选项 */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">筛选:</span>
        </div>

        <select
          value={filters.region}
          onChange={(e) => onFilterChange('region', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
        >
          <option value="">所有地区</option>
          <option value="香港">香港</option>
          <option value="澳门">澳门</option>
          <option value="英国">英国</option>
          <option value="美国">美国</option>
          <option value="加拿大">加拿大</option>
          <option value="澳大利亚">澳大利亚</option>
          <option value="新加坡">新加坡</option>
        </select>

        <select
          value={filters.school}
          onChange={(e) => onFilterChange('school', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
        >
          <option value="">所有学校</option>
          <option value="香港中文大学">香港中文大学</option>
          <option value="香港大学">香港大学</option>
          <option value="澳门大学">澳门大学</option>
          <option value="澳门科技大学">澳门科技大学</option>
        </select>

        <select
          value={filters.major_type}
          onChange={(e) => onFilterChange('major_type', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
        >
          <option value="">所有专业类型</option>
          <option value="法学">法学</option>
          <option value="商科">商科</option>
          <option value="工程">工程</option>
          <option value="计算机">计算机</option>
          <option value="文科">文科</option>
          <option value="理科">理科</option>
        </select>

        <select
          value={filters.admission_result}
          onChange={(e) => onFilterChange('admission_result', e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
        >
          <option value="">所有结果</option>
          <option value="accepted">已录取</option>
          <option value="rejected">被拒绝</option>
          <option value="waiting">等待中</option>
          <option value="withdrawn">已撤回</option>
        </select>
      </div>
    </div>
  );
};

export default CaseFilters;

