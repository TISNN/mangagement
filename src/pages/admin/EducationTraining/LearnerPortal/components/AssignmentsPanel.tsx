import { ClipboardCheck, Loader2, Sparkles } from 'lucide-react';

import type { LearningTask } from '../types';

interface AssignmentsPanelProps {
  tasks: LearningTask[];
}

const statusBadgeClass = (status: LearningTask['status']) => {
  switch (status) {
    case '待提交':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300';
    case '已提交':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200';
    case '批改中':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
    case '已完成':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300';
  }
};

export const AssignmentsPanel: React.FC<AssignmentsPanelProps> = ({ tasks }) => {
  const inProgress = tasks.filter((task) => task.status === '待提交').length;
  const completed = tasks.filter((task) => task.status === '已完成').length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
          <ClipboardCheck className="h-4 w-4 text-blue-500" />
          本周任务 {tasks.length} 项
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
          <Loader2 className="h-4 w-4 text-amber-500" />
          待完成 {inProgress}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
          <Sparkles className="h-4 w-4 text-emerald-500" />
          已完成 {completed}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {tasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{task.course} · {task.type}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">截止 {task.dueDate}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(task.status)}`}>{task.status}</span>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${task.completion}%` }} />
            </div>

            {task.aiHighlights?.length ? (
              <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-200">
                <span className="font-medium">AI 高亮：</span>
                {task.aiHighlights.join('；')}
              </div>
            ) : null}

            {task.nextSteps?.length ? (
              <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <span className="font-medium">下一步：</span>
                {task.nextSteps.join('；')}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <button className="rounded-full border border-blue-200 px-3 py-1 text-blue-600 transition hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
                查看详情
              </button>
              <button className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/40">
                提交记录
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
