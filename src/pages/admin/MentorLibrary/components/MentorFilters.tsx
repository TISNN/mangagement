// 导师筛选组件

import React from 'react';
import { Search, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';
import type { MentorFilters as MentorFiltersType } from '../types/mentor.types';

interface MentorFiltersProps {
  filters: MentorFiltersType;
  onFiltersChange: (filters: MentorFiltersType) => void;
  locationOptions?: string[];
  specializationOptions?: string[];
}

/**
 * MentorFilters - 导师筛选器组件
 */
export const MentorFilters: React.FC<MentorFiltersProps> = ({
  filters,
  onFiltersChange,
  locationOptions = [],
  specializationOptions = []
}) => {
  // 服务范围选项
  const serviceScopeOptions = ['全部', '留学申请', '课业辅导', '科研', '语言培训'];

  // 专业级别选项
  const expertiseLevelOptions = ['全部', '初级', '中级', '高级', '专家'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="space-y-6">
        {/* 搜索框 */}
        <div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索导师名称、专业方向..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* 服务范围筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <Briefcase className="h-4 w-4 mr-1.5" />
            服务范围：
          </span>
          <div className="flex flex-wrap gap-3">
            {serviceScopeOptions.map((scope) => (
              <button
                key={scope}
                onClick={() => onFiltersChange({ ...filters, serviceScope: scope })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.serviceScope === scope
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* 地理位置筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <MapPin className="h-4 w-4 mr-1.5" />
            地理位置：
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onFiltersChange({ ...filters, location: '全部' })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filters.location === '全部'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              不限
            </button>
            {locationOptions.map((loc) => (
              <button
                key={loc}
                onClick={() => onFiltersChange({ ...filters, location: loc })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.location === loc
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* 专业级别筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <Award className="h-4 w-4 mr-1.5" />
            专业级别：
          </span>
          <div className="flex flex-wrap gap-3">
            {expertiseLevelOptions.map((level) => (
              <button
                key={level}
                onClick={() => onFiltersChange({ ...filters, expertiseLevel: level })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.expertiseLevel === level
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {level === '全部' ? '不限' : level}
              </button>
            ))}
          </div>
        </div>

        {/* 专业方向筛选 */}
        {specializationOptions.length > 0 && (
          <div className="flex items-start">
            <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
              <GraduationCap className="h-4 w-4 mr-1.5" />
              专业方向：
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onFiltersChange({ ...filters, specialization: '全部' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.specialization === '全部'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                不限
              </button>
              {specializationOptions.slice(0, 10).map((spec) => (
                <button
                  key={spec}
                  onClick={() => onFiltersChange({ ...filters, specialization: spec })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.specialization === spec
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

