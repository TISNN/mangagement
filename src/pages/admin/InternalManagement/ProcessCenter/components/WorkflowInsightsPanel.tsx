import { Lightbulb, UserCircle } from 'lucide-react';

import type { WorkflowInsight } from '../../types';

interface WorkflowInsightsPanelProps {
  insights: WorkflowInsight[];
}

export const WorkflowInsightsPanel: React.FC<WorkflowInsightsPanelProps> = ({ insights }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">流程洞察与优化建议</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">结合执行数据与团队反馈，持续改进流程体验。</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[WorkflowInsightsPanel] 新增流程优化建议')}
        >
          <Lightbulb className="h-3.5 w-3.5" />
          提交建议
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-base font-semibold text-gray-900 dark:text-white">{insight.title}</p>
              <span className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <UserCircle className="h-4 w-4" />
                {insight.owner} · {insight.updatedAt}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{insight.description}</p>
            <p className="mt-2 rounded-xl bg-white p-3 text-sm font-medium text-blue-600 dark:bg-gray-900/60 dark:text-blue-200">
              下一步：{insight.improvement}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

