import { BookOpenCheck, FileText, FolderGit2 } from 'lucide-react';

import { SHARED_RESOURCES } from '../data';

const iconMap = {
  指南: <BookOpenCheck className="h-4 w-4" />,
  模板: <FileText className="h-4 w-4" />,
  案例: <FolderGit2 className="h-4 w-4" />,
} as const;

export const SharedResources = () => (
  <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">共享资源中心</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">沉淀导师服务经验，支持内部与市场导师共享使用。</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
        上传资源
      </button>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {SHARED_RESOURCES.map((resource) => (
        <a
          key={resource.id}
          href={resource.link}
          className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800/80"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-700/70 dark:text-gray-300">
            {iconMap[resource.type]}
            {resource.type}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{resource.title}</h3>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{resource.description}</p>
          </div>
        </a>
      ))}
    </div>
  </div>
);
