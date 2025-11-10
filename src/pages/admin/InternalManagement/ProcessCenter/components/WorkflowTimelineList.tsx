import { Clock, Timer, Zap } from 'lucide-react';

import type { WorkflowTimelineItem } from '../../types';

interface WorkflowTimelineListProps {
  items: WorkflowTimelineItem[];
}

const STATUS_CLASS: Record<WorkflowTimelineItem['status'], string> = {
  正常: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/30 dark:text-emerald-200',
  延迟: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/30 dark:text-amber-200',
  阻塞: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/30 dark:text-red-200',
};

export const WorkflowTimelineList: React.FC<WorkflowTimelineListProps> = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-2xl border p-4 text-sm shadow-sm ${STATUS_CLASS[item.status]}`}
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-semibold">{item.entity}</p>
            <span className="inline-flex items-center gap-2 text-xs opacity-80">
              <Clock className="h-3.5 w-3.5" />
              {item.completedAt}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-current dark:bg-white/10">
              <Timer className="h-3.5 w-3.5" />
              耗时 {item.duration}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-2.5 py-1 text-current dark:bg-white/10">
              <Zap className="h-3.5 w-3.5" />
              处理人 {item.handler}
            </span>
            <span className="rounded-full bg-white/70 px-2.5 py-1 text-current dark:bg-white/10">状态 {item.state}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

