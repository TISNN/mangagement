import React from 'react';
import { CaseLibraryType } from '../../../../types/case';

interface CaseLibraryTabsProps {
  activeTab: CaseLibraryType;
  onTabChange: (tab: CaseLibraryType) => void;
  myCasesCount?: number;
  publicCasesCount?: number;
}

const CaseLibraryTabs: React.FC<CaseLibraryTabsProps> = ({
  activeTab,
  onTabChange,
  myCasesCount = 0,
  publicCasesCount = 0,
}) => {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onTabChange('my')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'my'
            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        我的案例
        {myCasesCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
            {myCasesCount}
          </span>
        )}
      </button>
      <button
        onClick={() => onTabChange('public')}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          activeTab === 'public'
            ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
      >
        公共案例库
        {publicCasesCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            {publicCasesCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default CaseLibraryTabs;

