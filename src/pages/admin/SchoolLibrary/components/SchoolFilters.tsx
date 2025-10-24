/**
 * 学校筛选组件
 */

import React from 'react';
import { Search } from 'lucide-react';
import { SchoolFilters as SchoolFiltersType } from '../types/school.types';

interface SchoolFiltersProps {
  filters: SchoolFiltersType;
  onFiltersChange: (filters: SchoolFiltersType) => void;
}

export const SchoolFilters: React.FC<SchoolFiltersProps> = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
      <div className="space-y-6">
        {/* 搜索框 */}
        <div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索院校名称、城市、标签..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({...filters, searchQuery: e.target.value})}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* 地区筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">地区：</span>
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

        {/* 排名筛选 */}
        <div className="flex items-start">
          <span className="mr-8 mt-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">排名：</span>
          <div className="flex-1">
            <div className="flex flex-wrap gap-3">
              {[
                { label: '不限', range: [1, 10000] as [number, number] },
                { label: 'Top 50', range: [1, 50] as [number, number] },
                { label: 'Top 100', range: [1, 100] as [number, number] },
                { label: 'Top 200', range: [1, 200] as [number, number] },
                { label: 'Top 300', range: [1, 300] as [number, number] },
                { label: 'Top 500', range: [1, 500] as [number, number] }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onFiltersChange({...filters, rankingRange: item.range})}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.rankingRange[0] === item.range[0] && filters.rankingRange[1] === item.range[1]
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              💡 提示: 未排名的学校在选择"不限"时会显示
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

