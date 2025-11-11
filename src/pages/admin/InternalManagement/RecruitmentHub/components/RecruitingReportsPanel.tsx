import { BarChart3, DownloadCloud, TrendingDown, TrendingUp } from 'lucide-react';

import type { RecruitingReportInsight, RecruitingReportMetric } from '../data';

interface RecruitingReportsPanelProps {
  metrics: RecruitingReportMetric[];
  insights: RecruitingReportInsight[];
}

const IMPACT_BADGE: Record<RecruitingReportInsight['impact'], string> = {
  高: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-200',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const RecruitingReportsPanel: React.FC<RecruitingReportsPanelProps> = ({ metrics, insights }) => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">招聘报表与洞察</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            追踪招聘效率、渠道表现与风险点，一键导出汇报材料。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[RecruitingReportsPanel] 导出月报')}
          >
            <DownloadCloud className="h-3.5 w-3.5" />
            导出月报
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[RecruitingReportsPanel] 订阅周报')}
          >
            订阅周报
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
                <TrendingUp className="h-3 w-3" />
                {metric.change}
              </p>
            ) : null}
            {metric.description ? (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">洞察与行动建议</h4>
          <span className="text-xs text-gray-500 dark:text-gray-400">根据数据生成提醒，辅助招聘策略调整</span>
        </div>

        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/60"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{insight.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${IMPACT_BADGE[insight.impact]}`}>
                  影响度 · {insight.impact}
                </span>
              </div>
              <p className="text-xs leading-5 text-gray-600 dark:text-gray-300">{insight.detail}</p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                <span>责任人：{insight.owner}</span>
                <span>更新时间：{insight.updatedAt}</span>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[RecruitingReportsPanel] 查看详情', { insightId: insight.id })}
                >
                  查看详情
                </button>
                <button
                  type="button"
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                  onClick={() => console.info('[RecruitingReportsPanel] 创建行动', { insightId: insight.id })}
                >
                  创建行动
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


