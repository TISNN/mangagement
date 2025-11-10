import { ArrowRight, FileText } from 'lucide-react';

import { INSIGHT_ITEMS } from '../data';

export const InsightsView = () => (
  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">导师洞察与建议</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">AI 综合导师负载、评价、风险数据提供运营建议。</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
        <FileText className="h-4 w-4" />
        导出导师报告
      </button>
    </div>
    <div className="space-y-3">
      {INSIGHT_ITEMS.map((insight, index) => (
        <div key={index} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/80">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{insight.title}</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{insight.description}</p>
          {insight.action && (
            <button className="mt-3 inline-flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300">
              {insight.action}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
    </div>
    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
      分析图表占位：可接入折线/热力图展示导师利用率趋势与风险提示。
    </div>
  </div>
);
