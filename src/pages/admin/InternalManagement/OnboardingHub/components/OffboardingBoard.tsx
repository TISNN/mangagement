import { AlertTriangle, Box, FileCheck, LogOut, ShieldCheck } from 'lucide-react';

import type { OffboardingCase } from '../data';

interface OffboardingBoardProps {
  cases: OffboardingCase[];
}

const STATUS_BADGE: Record<OffboardingCase['status'], string> = {
  办理中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  等待交接: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const OffboardingBoard: React.FC<OffboardingBoardProps> = ({ cases }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <header className="flex flex-col gap-2 border-b border-gray-200 px-5 py-4 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">离职流程执行</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            快速掌握离职交接进度、资产回收与访谈安排，确保风险可控。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[OffboardingBoard] 新建离职单')}
          >
            创建离职单
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[OffboardingBoard] 导出交接清单')}
          >
            导出交接清单
          </button>
        </div>
      </header>

      <div className="space-y-4 px-5 py-4">
        {cases.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800/60"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.employeeName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.position} · {item.department}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE[item.status]}`}>{item.status}</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  最后工作日 {item.lastWorkDay}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5 text-rose-500" />
                离职原因：{item.reason}
              </span>
              <span>交接负责人：{item.handoverOwner}</span>
              <span>进度 {item.progress}%</span>
            </div>

            <div className="space-y-2 rounded-2xl bg-white p-3 text-xs text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
              <p className="text-gray-400 dark:text-gray-500">关键交接任务</p>
              <div className="space-y-2">
                {item.checklist.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/80"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {task.owner} · 截止 {task.dueAt}
                      </p>
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{task.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OffboardingBoard] 查看交接详情', { caseId: item.id })}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                查看详情
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OffboardingBoard] 资产回收', { caseId: item.id })}
              >
                <Box className="h-3.5 w-3.5" />
                资产回收
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OffboardingBoard] 完成结算', { caseId: item.id })}
              >
                <FileCheck className="h-3.5 w-3.5" />
                完成结算
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                onClick={() => console.info('[OffboardingBoard] 安排访谈', { caseId: item.id })}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                离职访谈
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


