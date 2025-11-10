import { BadgeCheck, Clock, GitPullRequest } from 'lucide-react';

import type { ApprovalWorkflow } from '../../types';

interface ApprovalWorkflowBoardProps {
  workflows: ApprovalWorkflow[];
}

export const ApprovalWorkflowBoard: React.FC<ApprovalWorkflowBoardProps> = ({ workflows }) => {
  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{workflow.name}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{workflow.scenario}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              {workflow.autoRevokeHours ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 dark:bg-gray-800/60">
                  <Clock className="h-3.5 w-3.5 text-blue-500" />
                  自动撤销：{workflow.autoRevokeHours} h
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200">
                <BadgeCheck className="h-3.5 w-3.5" />
                上次优化：{workflow.lastOptimized}
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {workflow.steps.map((step, index) => (
              <div
                key={step.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40"
              >
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
                    <GitPullRequest className="h-4 w-4 text-blue-500" />
                    Step {index + 1}
                  </span>
                  <span> SLA {step.slaHours}h</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{step.role}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{step.action}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

