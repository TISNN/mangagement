import { Box, CheckSquare, FileText } from 'lucide-react';

import type { ComplianceCaseLog } from '../../types';

interface ComplianceCaseTableProps {
  cases: ComplianceCaseLog[];
}

export const ComplianceCaseTable: React.FC<ComplianceCaseTableProps> = ({ cases }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900/60">
          <tr className="text-left">
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">检查项</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">创建日期</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">负责人</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">进度</th>
            <th className="px-4 py-3 font-medium text-gray-500 dark:text-gray-400">佐证材料</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {cases.map((item) => (
            <tr key={item.id} className="text-gray-600 dark:text-gray-300">
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{item.item}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.description}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">{item.createdAt}</td>
              <td className="px-4 py-3 text-xs">{item.assignee}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className="h-2.5 rounded-full bg-blue-500 transition-all"
                      style={{ width: `${item.progress * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(item.progress * 100)}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">
                {item.evidenceRequired ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-2.5 py-1 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200">
                    <FileText className="h-3.5 w-3.5" />
                    待上传
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                    <CheckSquare className="h-3.5 w-3.5" />
                    无需
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[ComplianceCaseTable] 查看工单详情', { caseId: item.id })}
                >
                  <Box className="h-3.5 w-3.5" />
                  工单详情
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

