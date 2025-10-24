/**
 * 专业筛选组件 - 参考院校库设计优化
 */

import React from 'react';
import { Search, Clock, MapPin, Bookmark } from 'lucide-react';
import { ProgramFilters as ProgramFiltersType } from '../types/program.types';

interface ProgramFiltersProps {
  filters: ProgramFiltersType;
  onFiltersChange: (filters: ProgramFiltersType) => void;
  onSearch: () => void;
  onReset: () => void;
}

export const ProgramFilters: React.FC<ProgramFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const getSubCategories = (category: string): string[] => {
    switch (category) {
      case '商科':
        return ['金融', '会计', '管理', '市场营销', '商业分析', '经济学'];
      case '工科':
        return ['计算机', '电子', '机械', '土木工程', '化学工程', '材料科学'];
      case '社科':
        return ['教育', '心理', '社会学', '传媒', '法律', '政治'];
      case '理科':
        return ['数学', '物理', '化学', '生物', '统计学', '环境科学'];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="space-y-6">
        {/* 搜索框 */}
        <div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索专业名称、院校名称..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({...filters, searchQuery: e.target.value})}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* 地区筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <MapPin className="h-4 w-4 mr-1.5" />
            地区：
          </span>
          <div className="flex flex-wrap gap-3">
            {['全部', '英国', '美国', '欧陆', '中国香港', '中国澳门', '新加坡', '澳大利亚'].map((country) => (
              <button
                key={country}
                onClick={() => onFiltersChange({...filters, country})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.country === country
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {country === '全部' ? '不限' : country}
              </button>
            ))}
          </div>
        </div>

        {/* 专业类型筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <Bookmark className="h-4 w-4 mr-1.5" />
            类型：
          </span>
          <div className="flex flex-wrap gap-3">
            {['全部', '商科', '社科', '工科', '理科'].map((category) => (
              <button
                key={category}
                onClick={() => onFiltersChange({
                  ...filters, 
                  category,
                  subCategory: '全部'
                })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.category === category
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 子分类筛选 */}
        {filters.category !== '全部' && getSubCategories(filters.category).length > 0 && (
          <div className="flex items-start pl-4 border-l-2 border-blue-200 dark:border-blue-800">
            <span className="mr-8 mt-2 text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap text-sm">
              子类：
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onFiltersChange({...filters, subCategory: '全部'})}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  filters.subCategory === '全部'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                全部
              </button>
              {getSubCategories(filters.category).map(subCategory => (
                <button
                  key={subCategory}
                  onClick={() => onFiltersChange({...filters, subCategory})}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    filters.subCategory === subCategory
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {subCategory}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 学位类型筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <Bookmark className="h-4 w-4 mr-1.5" />
            学位：
          </span>
          <div className="flex flex-wrap gap-3">
            {['全部', '本科', '硕士', '博士', 'MBA'].map((degree) => (
              <button
                key={degree}
                onClick={() => onFiltersChange({...filters, degree})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.degree === degree
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {degree === '全部' ? '不限' : degree}
              </button>
            ))}
          </div>
        </div>

        {/* 学制长度筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            学制：
          </span>
          <div className="flex flex-wrap gap-3">
            {['全部', '1年', '1.5年', '2年', '3年', '4年'].map((duration) => (
              <button
                key={duration}
                onClick={() => onFiltersChange({...filters, duration})}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filters.duration === duration
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {duration === '全部' ? '不限' : duration}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

