import { BarChart3, DownloadCloud, TrendingDown, TrendingUp } from 'lucide-react';

import type { ReportMetric, ReportRecord } from '../data';

interface ReportCenterProps {
  metrics: ReportMetric[];
  records: ReportRecord[];
}

export const ReportCenter: React.FC<ReportCenterProps> = ({ metrics, records }) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">统计与报表</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            追踪入离职效率、试用期表现与风险指标，支持导出报表给财务与管理层。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[ReportCenter] 导出入职月报')}
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            导出入职月报
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hoverborder-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[ReportCenter] 导出离职分析')}
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            导出离职分析
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70 dark:hover:border-blue-500/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">{metric.title}</p>
              <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            {metric.trend ? (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-200">
                <TrendingUp className="h-3 w-3" />
                {metric.trend}
              </p>
            ) : null}
            {metric.change ? (
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-200">
                {metric.change.startsWith('-') ? (
                  <>
                    <TrendingDown className="h-3 w-3" />
                    {metric.change}
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    {metric.change}
                  </>
                )}
              </p>
            ) : null}
            {metric.description ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">报表历史</h4>
        <div className="mt-3 divide-y divide-gray-100 text-sm dark:divide-gray-800">
          {records.map((record) => (
            <div key={record.id} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{record.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {record.period} · 由 {record.generatedBy} 生成（{record.type}）
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-400 dark:text-gray-500">生成时间：{record.generatedAt}</span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => window.open(record.fileUrl, '_blank')}
                >
                  <DownloadCloud className="h-3.5 w-3.5" />
                  下载报表
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


