import { CalendarClock, ClipboardCheck, Loader2 } from 'lucide-react';

import type { MaintenanceTask } from '../../types';

interface MaintenancePlanBoardProps {
  tasks: MaintenanceTask[];
}

const STATUS_THEME: Record<MaintenanceTask['status'], string> = {
  计划中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  进行中: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-200',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

const STATUS_ICON: Record<MaintenanceTask['status'], JSX.Element> = {
  计划中: <CalendarClock className="h-3.5 w-3.5" />,
  进行中: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
  已完成: <ClipboardCheck className="h-3.5 w-3.5" />,
};

export const MaintenancePlanBoard: React.FC<MaintenancePlanBoardProps> = ({ tasks }) => {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</span>
            <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_THEME[task.status]}`}>
              {STATUS_ICON[task.status]}
              {task.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">范围：{task.scope}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">排期：{task.schedule}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{task.owner}</p>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{task.notes}</p>
          {task.link ? (
            <a
              href={task.link}
              className="mt-3 inline-flex items-center gap-2 text-xs text-blue-600 hover:underline dark:text-blue-200"
              target="_blank"
              rel="noreferrer"
            >
              查看执行计划
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
};

