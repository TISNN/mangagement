import { Award, Flag, Target } from 'lucide-react';

import type { GrowthMilestone, ProgressGoal } from '../types';

interface ProgressInsightPanelProps {
  goals: ProgressGoal[];
  milestones: GrowthMilestone[];
}

const statusBadge = (status: ProgressGoal['status']) => {
  switch (status) {
    case '按计划':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
    case '需关注':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
    case '风险':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300';
  }
};

export const ProgressInsightPanel: React.FC<ProgressInsightPanelProps> = ({ goals, milestones }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">学习目标追踪</h3>
          <button className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
            <Target className="h-3.5 w-3.5" />
            添加新目标
          </button>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {goals.map((goal) => (
            <div key={goal.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{goal.title}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadge(goal.status)}`}>{goal.status}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">节点：{goal.milestone}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">截止：{goal.dueDate}</p>
              {typeof goal.targetScore === 'number' && typeof goal.currentScore === 'number' ? (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    当前 {goal.currentScore} / 目标 {goal.targetScore}
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${Math.min(100, Math.round((goal.currentScore / goal.targetScore) * 100))}%` }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">成长与亮点</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">近期里程碑 {milestones.length} 条</span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Award className="h-4 w-4 text-indigo-500" />
                {milestone.category} · {milestone.achievedAt}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{milestone.title}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{milestone.description}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">佐证：{milestone.evidence}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
