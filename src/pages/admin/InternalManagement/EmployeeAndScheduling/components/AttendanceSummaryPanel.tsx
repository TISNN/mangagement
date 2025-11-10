import { TrendingUp } from 'lucide-react';

import type { AttendanceSummary } from '../../types';

interface AttendanceSummaryPanelProps {
  summaries: AttendanceSummary[];
  onInspect?: (month: string) => void;
}

export const AttendanceSummaryPanel: React.FC<AttendanceSummaryPanelProps> = ({ summaries, onInspect }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">出勤与工时趋势</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">掌握团队出勤表现与加班趋势，辅助排班策略调整。</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[AttendanceSummaryPanel] 导出出勤月报')}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          导出月报
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {summaries.map((summary) => (
          <button
            key={summary.month}
            type="button"
            onClick={() => onInspect?.(summary.month)}
            className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left text-sm transition hover:border-blue-200 hover:bg-white dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-blue-500/40"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400">月份</span>
            <span className="text-base font-semibold text-gray-900 dark:text-gray-100">{summary.month}</span>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p className="text-gray-500 dark:text-gray-400">出勤</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-200">{summary.present} 人次</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">请假</p>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-200">{summary.leave} 人次</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">加班</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-200">{summary.overtimeHours} h</p>
              </div>
            </div>

            <ul className="mt-3 space-y-1 text-xs text-gray-500 dark:text-gray-400">
              {summary.alerts.map((alert) => (
                <li key={alert} className="flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {alert}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
};

