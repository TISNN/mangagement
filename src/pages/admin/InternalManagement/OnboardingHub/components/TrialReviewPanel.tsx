import { GaugeCircle, Stars } from 'lucide-react';

import type { TrialReviewItem } from '../data';

interface TrialReviewPanelProps {
  reviews: TrialReviewItem[];
}

const STATUS_BADGE: Record<TrialReviewItem['status'], string> = {
  待自评: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  待主管评估: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  '待 HR 审核': 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-200',
  已转正: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const TrialReviewPanel: React.FC<TrialReviewPanelProps> = ({ reviews }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">试用期与转正管理</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            汇总试用期目标进度与评估状态，支持自评、主管评估与 HR 审核协同。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[TrialReviewPanel] 导出评估表')}
          >
            导出评估表
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[TrialReviewPanel] 配置提醒')}
          >
            配置提醒
          </button>
        </div>
      </header>

      <div className="grid gap-4 px-5 py-4 lg:grid-cols-2">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{review.employee}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {review.position} · Mentor：{review.mentor}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[review.status]}`}>
                {review.status}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-3 text-xs text-gray-500 dark:bg-gray-900/70 dark:text-gray-300">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <GaugeCircle className="h-3.5 w-3.5 text-blue-500" />
                  试用期截止：{review.probationEnd}
                </span>
                <span>下一步：{review.status === '待自评' ? '提醒员工完成自评' : '督促主管评估'}</span>
              </div>

              <div className="mt-3 space-y-2">
                {review.objectives.map((objective) => (
                  <div key={objective.id}>
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{objective.title}</p>
                      <span>{objective.weight}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400"
                          style={{ width: `${objective.progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{objective.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[TrialReviewPanel] 查看评估详情', { reviewId: review.id })}
              >
                查看评估
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[TrialReviewPanel] 创建转正审批', { reviewId: review.id })}
              >
                创建转正审批
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[TrialReviewPanel] 发送提醒', { reviewId: review.id })}
              >
                发送提醒
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


