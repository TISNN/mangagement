import { AlertTriangle, CalendarClock } from 'lucide-react';

import type { ShiftConflict } from '../../types';

interface ShiftConflictListProps {
  conflicts: ShiftConflict[];
}

export const ShiftConflictList: React.FC<ShiftConflictListProps> = ({ conflicts }) => {
  if (conflicts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-400">
        <p>当前排班无冲突，请持续关注高峰期的班次分配。</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conflicts.map((conflict) => (
        <div
          key={conflict.id}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm shadow-sm dark:border-amber-900/30 dark:bg-amber-900/20"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-semibold">{conflict.staff}</span>
            </div>
            <span className="inline-flex items-center gap-2 text-xs text-amber-700/80 dark:text-amber-200/80">
              <CalendarClock className="h-3.5 w-3.5" />
              {conflict.detectedAt}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-800 dark:text-gray-100">{conflict.issue}</p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">影响：{conflict.impact}</p>
          <p className="mt-1 text-xs font-medium text-amber-800 dark:text-amber-100">建议：{conflict.suggestedAction}</p>
        </div>
      ))}
    </div>
  );
};

