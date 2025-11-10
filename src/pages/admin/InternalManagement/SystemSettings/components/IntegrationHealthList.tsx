import { ActivitySquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

import type { IntegrationHealth } from '../../types';

interface IntegrationHealthListProps {
  items: IntegrationHealth[];
}

const STATUS_ICON: Record<IntegrationHealth['status'], JSX.Element> = {
  正常: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  警告: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  失败: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

const STATUS_CLASS: Record<IntegrationHealth['status'], string> = {
  正常: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
  警告: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  失败: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-200',
};

export const IntegrationHealthList: React.FC<IntegrationHealthListProps> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-300">
                  {item.type}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{item.owner}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 font-semibold ${STATUS_CLASS[item.status]}`}>
                {STATUS_ICON[item.status]}
                {item.status}
              </span>
              <span className="text-gray-500 dark:text-gray-400">最近检查 {item.lastCheck}</span>
            </div>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

