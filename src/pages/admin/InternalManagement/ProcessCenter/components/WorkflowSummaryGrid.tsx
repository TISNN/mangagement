import { AlertCircle, BarChart, GitMerge } from 'lucide-react';

import type { WorkflowDefinition } from '../../types';

interface WorkflowSummaryGridProps {
  workflows: WorkflowDefinition[];
}

const STATUS_STYLE: Record<WorkflowDefinition['status'], string> = {
  启用: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
  灰度中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  草稿: 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-300',
};

export const WorkflowSummaryGrid: React.FC<WorkflowSummaryGridProps> = ({ workflows }) => {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">适用范围：{workflow.scope}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-gray-500 dark:bg-gray-800/60 dark:text-gray-300">
                <GitMerge className="h-3.5 w-3.5 text-blue-500" />
                {workflow.version}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${STATUS_STYLE[workflow.status]}`}>
                {workflow.status}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-emerald-500" />
              平均耗时 {workflow.avgCompletionHours} h
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4 text-blue-500" />
              完成率 {(workflow.completionRate * 100).toFixed(0)}%
            </div>
            {workflow.bottleneckNode ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-200">
                <AlertCircle className="h-3.5 w-3.5" />
                瓶颈：{workflow.bottleneckNode}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

