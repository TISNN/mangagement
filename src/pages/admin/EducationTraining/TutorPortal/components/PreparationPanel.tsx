import { FileText, Lightbulb, NotebookPen } from 'lucide-react';

import type { LessonPlan } from '../types';

interface PreparationPanelProps {
  plans: LessonPlan[];
}

export const PreparationPanel: React.FC<PreparationPanelProps> = ({ plans }) => {
  return (
    <section className="space-y-6">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                <NotebookPen className="h-4 w-4" />
                教案更新 {plan.resources[0]?.updatedAt ?? '未知'}
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{plan.course}</p>
            </div>
            <button className="text-xs text-blue-600 hover:underline dark:text-blue-300">进入备课中心</button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">课堂重点</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {plan.focusPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">课堂活动</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                {plan.activities.map((activity) => (
                  <li key={activity}>• {activity}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">备课资料</p>
            <div className="grid gap-3 md:grid-cols-2">
              {plan.resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{resource.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {resource.type} · {resource.version} · {resource.owner}
                    </p>
                  </div>
                  <FileText className="h-4 w-4 text-blue-500" />
                </div>
              ))}
            </div>
          </div>

          {plan.aiSuggestions?.length ? (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
              <div className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4" />
                AI 备课建议
              </div>
              <ul className="mt-2 space-y-1">
                {plan.aiSuggestions.map((suggestion) => (
                  <li key={suggestion}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
};
