/**
 * Dashboard 搜索头部组件
 */

import React from 'react';
import { Search } from 'lucide-react';

interface SearchHeaderProps {
  userName: string;
  greeting: string;
  timeMessage: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  userName,
  greeting,
  timeMessage,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold dark:text-white">
          {greeting}, {userName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          欢迎回到工作台，{timeMessage}
        </p>
      </div>
      
      {/* 全局搜索框 */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索学生、任务、院校..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>
    </div>
  );
};

