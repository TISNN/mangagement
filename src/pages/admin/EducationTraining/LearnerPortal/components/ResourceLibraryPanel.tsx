import { Download, FolderOpen, RefreshCw } from 'lucide-react';

import type { ResourceFolder } from '../types';

interface ResourceLibraryPanelProps {
  folders: ResourceFolder[];
}

export const ResourceLibraryPanel: React.FC<ResourceLibraryPanelProps> = ({ folders }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">学习资料库</h3>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/60">
              <RefreshCw className="h-3.5 w-3.5" />
              同步更新
            </button>
            <button className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
              <Download className="h-3.5 w-3.5" />
              离线下载
            </button>
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">按课程与项目分类，支持版本跟踪与权限控制。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {folders.map((folder) => (
          <div key={folder.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                  <FolderOpen className="h-4 w-4" />
                  {folder.items.length} 个资源
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{folder.title}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{folder.description}</p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {folder.items.map((item) => (
                <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.format} · 更新 {item.updatedAt} · {item.owner}
                      </p>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline dark:text-blue-300">打开</button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white px-2 py-0.5 shadow-sm dark:bg-gray-900/60">
                        {tag}
                      </span>
                    ))}
                    {item.duration ? <span>时长 {item.duration}</span> : null}
                    {item.size ? <span>{item.size}</span> : null}
                    <span>版本 {item.version}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
