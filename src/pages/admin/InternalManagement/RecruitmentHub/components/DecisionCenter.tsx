import { AlertTriangle, CheckCircle2, Clock4, Users } from 'lucide-react';

import type { OfferDecisionItem } from '../data';

interface DecisionCenterProps {
  decisions: OfferDecisionItem[];
}

const RECOMMENDATION_MAP: Record<OfferDecisionItem['recommendation'], { text: string; className: string; icon: React.FC }> = {
  录用: {
    text: '推荐录用',
    className: 'text-emerald-600 bg-emerald-50 dark:text-emerald-200 dark:bg-emerald-900/30',
    icon: CheckCircle2,
  },
  备选: {
    text: '备选跟进',
    className: 'text-amber-600 bg-amber-50 dark:text-amber-200 dark:bg-amber-900/30',
    icon: Clock4,
  },
  拒绝: {
    text: '暂不匹配',
    className: 'text-rose-600 bg-rose-50 dark:text-rose-200 dark:bg-rose-900/30',
    icon: AlertTriangle,
  },
};

export const DecisionCenter: React.FC<DecisionCenterProps> = ({ decisions }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">决策与 Offer 中心</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            汇总待处理候选人与面试官建议，支持一键发起 Offer 审批或发送感谢信。
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[DecisionCenter] 导出评估总结')}
        >
          导出评估
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 text-left font-medium">候选人</th>
              <th className="px-5 py-3 text-left font-medium">面试官反馈</th>
              <th className="px-5 py-3 text-left font-medium">综合评分</th>
              <th className="px-5 py-3 text-left font-medium">下一步动作</th>
              <th className="px-5 py-3 text-left font-medium">截止时间</th>
              <th className="px-5 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {decisions.map((decision) => {
              const recommendationMeta = RECOMMENDATION_MAP[decision.recommendation];
              const RecommendationIcon = recommendationMeta.icon;

              return (
                <tr key={decision.id} className="text-gray-600 dark:text-gray-300">
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{decision.candidate}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{decision.position}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{decision.stage}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-2">
                      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${recommendationMeta.className}`}>
                        <RecommendationIcon className="h-3.5 w-3.5" />
                        {recommendationMeta.text}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <Users className="h-3.5 w-3.5" />
                        {decision.interviewers.join('、')}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                      {decision.score}
                      <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                        <div
                          className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
                          style={{ width: `${Math.min(decision.score, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{decision.nextAction}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">{decision.deadline}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                        onClick={() => console.info('[DecisionCenter] 查看面试详情', { decisionId: decision.id })}
                      >
                        详情
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                        onClick={() => console.info('[DecisionCenter] 启动 Offer 审批', { decisionId: decision.id })}
                      >
                        启动审批
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                        onClick={() => console.info('[DecisionCenter] 发送沟通邮件', { decisionId: decision.id })}
                      >
                        沟通候选人
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};


