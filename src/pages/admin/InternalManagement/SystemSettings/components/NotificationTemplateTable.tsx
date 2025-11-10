import { ToggleLeft, ToggleRight } from 'lucide-react';

import type { NotificationTemplate } from '../../types';

interface NotificationTemplateTableProps {
  templates: NotificationTemplate[];
  onToggle?: (id: string, enabled: boolean) => void;
}

export const NotificationTemplateTable: React.FC<NotificationTemplateTableProps> = ({ templates, onToggle }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">模板名称</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">触发事件</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">渠道</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">最近更新</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">互动数据</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">状态</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {templates.map((template) => (
            <tr key={template.id} className="text-gray-600 dark:text-gray-300">
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{template.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">ID: {template.id}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">{template.trigger}</td>
              <td className="px-4 py-3 text-xs">{template.channel}</td>
              <td className="px-4 py-3 text-xs">{template.lastUpdated}</td>
              <td className="px-4 py-3 text-xs">
                <div className="flex gap-3">
                  <span>发送 {template.metrics.send}</span>
                  {template.metrics.click > 0 ? <span>点击 {template.metrics.click}</span> : <span>点击 -</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                    template.enabled
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 dark:border-emerald-900/30 dark:bg-emerald-900/30 dark:text-emerald-200'
                      : 'border-gray-200 bg-gray-100 text-gray-500 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400'
                  }`}
                  onClick={() => onToggle?.(template.id, !template.enabled)}
                >
                  {template.enabled ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  {template.enabled ? '启用' : '停用'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

