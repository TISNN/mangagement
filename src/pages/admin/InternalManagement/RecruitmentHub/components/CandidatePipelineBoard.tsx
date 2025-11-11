import { BadgeCheck, Mail, Timer } from 'lucide-react';

import type { CandidatePipelineColumn } from '../data';

interface CandidatePipelineBoardProps {
  pipeline: CandidatePipelineColumn[];
}

export const CandidatePipelineBoard: React.FC<CandidatePipelineBoardProps> = ({ pipeline }) => {
  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">候选人管道</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            多渠道候选人状态一览，支持快速推进和跨岗位推荐。
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[CandidatePipelineBoard] 导入候选人')}
          >
            导入候选人
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
            onClick={() => console.info('[CandidatePipelineBoard] 创建面试流程模板')}
          >
            流程模板
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-5">
        {pipeline.map((column) => (
          <div
            key={column.stage}
            className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{column.stage}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{column.description}</p>
              </div>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                {column.candidates.length}
              </span>
            </div>

            <div className="mt-3 flex-1 space-y-3">
              {column.candidates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  暂无候选人
                </div>
              ) : (
                column.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/70 p-3 text-sm shadow-sm transition hover:border-blue-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-blue-500/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{candidate.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{candidate.position}</span>
                      </div>
                      {typeof candidate.score === 'number' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                          <BadgeCheck className="h-3 w-3" />
                          {candidate.score}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {candidate.source}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        更新于 {candidate.updatedAt}
                      </span>
                      {candidate.owner ? <span>跟进人：{candidate.owner}</span> : null}
                    </div>

                    {candidate.tags && candidate.tags.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {candidate.tags.map((tag) => (
                          <span
                            key={`${candidate.id}-${tag}`}
                            className="rounded-full bg-white px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-900 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                        onClick={() => console.info('[CandidatePipelineBoard] 安排面试', { candidateId: candidate.id })}
                      >
                        安排面试
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
                        onClick={() => console.info('[CandidatePipelineBoard] 查看档案', { candidateId: candidate.id })}
                      >
                        查看档案
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


