import React, { useState } from 'react';
import { Download, Filter, Search, Tag, Users } from 'lucide-react';
import { StudentStatus } from '../types';
import MultiSelectDropdown from './MultiSelectDropdown';

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  status: StudentStatus | '全部';
  setStatus: (value: StudentStatus | '全部') => void;
  onExportBasic: () => Promise<void> | void;
  onExportDetailed: () => Promise<void> | void;
  isExporting: boolean;
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableAdvisors: string[];
  selectedAdvisors: string[];
  onAdvisorsChange: (advisors: string[]) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  setSearch,
  status,
  setStatus,
  onExportBasic,
  onExportDetailed,
  isExporting,
  availableTags,
  selectedTags,
  onTagsChange,
  availableAdvisors,
  selectedAdvisors,
  onAdvisorsChange,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = async (type: 'basic' | 'detailed') => {
    setShowExportMenu(false);
    if (type === 'basic') {
      await onExportBasic();
    } else {
      await onExportDetailed();
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-700/60">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索学生姓名/邮箱/标签..."
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 dark:border-gray-600 dark:text-gray-300">
          <Filter className="h-4 w-4" />
          状态
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StudentStatus | '全部')}
            className="bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-200"
          >
            <option value="全部">全部学生</option>
            <option value="活跃">活跃</option>
            <option value="休学">休学</option>
            <option value="毕业">毕业</option>
            <option value="退学">退学</option>
          </select>
        </div>
        <MultiSelectDropdown
          label="标签"
          icon={<Tag className="h-4 w-4" />}
          options={availableTags}
          selected={selectedTags}
          onChange={onTagsChange}
          emptyText="暂无标签数据"
        />
        <MultiSelectDropdown
          label="顾问"
          icon={<Users className="h-4 w-4" />}
          options={availableAdvisors}
          selected={selectedAdvisors}
          onChange={onAdvisorsChange}
          emptyText="暂无顾问数据"
        />
        <div className="relative">
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            disabled={isExporting}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
              isExporting
                ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <Download className="h-4 w-4" />
            {isExporting ? '导出中...' : '导出数据'}
          </button>
          {showExportMenu && !isExporting && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleExport('basic')}
                className="w-full px-4 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
              >
                导出基础信息
              </button>
              <button
                onClick={() => handleExport('detailed')}
                className="w-full px-4 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
              >
                导出详细报表
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;

