import { useMemo } from 'react';

import { CalendarCheck, CheckCircle2, ClipboardList, Users } from 'lucide-react';

import type { OnboardingCase } from '../data';

interface OnboardingCaseBoardProps {
  cases: OnboardingCase[];
}

export const OnboardingCaseBoard: React.FC<OnboardingCaseBoardProps> = ({ cases }) => {
  const averageProgress = useMemo(() => {
    if (cases.length === 0) return 0;
    return Math.round(cases.reduce((sum, item) => sum + item.progress, 0) / cases.length);
  }, [cases]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">入职流程执行</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            追踪即将入职成员的准备进度，跨部门任务与 Buddy 协同一目了然。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            <Users className="h-3.5 w-3.5" />
            本周入职成员 {cases.length} 人
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300">
            <ClipboardList className="h-3.5 w-3.5" />
            平均完成度 {averageProgress}%
          </span>
        </div>
      </header>

      <div className="grid gap-4 px-5 py-4 lg:grid-cols-2">
        {cases.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm transition hover:border-blue-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-blue-500/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.employeeName}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.position} · {item.department}
                </p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                {item.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-2">
                <CalendarCheck className="h-3.5 w-3.5" />
                入职日期 {item.startDate}
              </span>
              <span>HR Owner：{item.owner}</span>
              <span>Buddy：{item.buddy}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>入职准备进度</span>
                <span>{item.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800/80">
                <div className="h-full rounded-full bg-emerald-500 transition-all dark:bg-emerald-400" style={{ width: `${item.progress}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">跨部门任务清单</p>
              <div className="space-y-2 text-xs">
                {item.checklist.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900/60"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-gray-500 dark:text-gray-400">{task.owner}</p>
                    </div>
                    <div className="text-right text-[11px] text-gray-400 dark:text-gray-500">
                      <p>{task.status}</p>
                      <p>截止 {task.dueAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OnboardingCaseBoard] 查看详情', { caseId: item.id })}
              >
                查看详情
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OnboardingCaseBoard] 发送提醒', { caseId: item.id })}
              >
                发送提醒
              </button>
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OnboardingCaseBoard] 导出清单', { caseId: item.id })}
              >
                导出清单
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


