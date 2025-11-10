import { AlertCircle, History } from 'lucide-react';

import type { PermissionAuditLog } from '../../types';

interface AuditLogPanelProps {
  logs: PermissionAuditLog[];
}

const RISK_TAG_CLASS: Record<PermissionAuditLog['riskLevel'], string> = {
  高: 'bg-red-50 text-red-600 dark:bg-red-900/40 dark:text-red-200',
  中: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  低: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ logs }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">敏感操作审计</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">跟踪权限变更与异常操作，便于快速复盘。</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[AuditLogPanel] 导出敏感操作日志')}
        >
          <History className="h-3.5 w-3.5" />
          导出日志
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${RISK_TAG_CLASS[log.riskLevel]}`}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {log.riskLevel}风险
                </span>
                <p className="font-medium text-gray-900 dark:text-gray-100">{log.user}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{log.createdAt}</span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{log.action}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{log.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

