import { Gauge, ShieldCheck } from 'lucide-react';

import type { PerformanceMetric, QualityFeedback } from '../types';

interface PerformancePanelProps {
  metrics: PerformanceMetric[];
  feedbacks: QualityFeedback[];
}

const statusBadge = (status: PerformanceMetric['status']) => {
  switch (status) {
    case '良好':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
    case '需关注':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
    case '风险':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300';
  }
};

export const PerformancePanel: React.FC<PerformancePanelProps> = ({ metrics, feedbacks }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">教学绩效指标</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            <Gauge className="h-3.5 w-3.5" />
            KPI 追踪
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{metric.label}</p>
              <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">目标：{metric.benchmark}</p>
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadge(metric.status)}`}>{metric.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">教研质检反馈</h3>
          <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            填写改进计划
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{feedback.source}</span>
                <span>{feedback.date}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{feedback.summary}</p>
              {feedback.actionItems.length ? (
                <ul className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {feedback.actionItems.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
