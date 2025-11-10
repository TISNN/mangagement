import { Activity, Mic, Radio, Video } from 'lucide-react';

import type { ClassroomInteraction, ClassroomLog } from '../types';

interface ClassroomManagementPanelProps {
  interactions: ClassroomInteraction[];
  logs: ClassroomLog[];
}

const trendColor = (trend: ClassroomInteraction['trend']) => {
  switch (trend) {
    case 'up':
      return 'text-emerald-500';
    case 'down':
      return 'text-rose-500';
    default:
      return 'text-gray-500';
  }
};

export const ClassroomManagementPanel: React.FC<ClassroomManagementPanelProps> = ({ interactions, logs }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">课堂互动监测</h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">实时统计举手、答题、投票等互动</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {interactions.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.type}</p>
                <Activity className={`h-4 w-4 ${trendColor(item.trend)}`} />
              </div>
              <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{item.count}</div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                趋势：{item.trend === 'up' ? '上升' : item.trend === 'down' ? '下降' : '持平'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">课堂记录 & 点评</h3>
          <button className="text-xs text-blue-600 hover:underline dark:text-blue-300">查看全部课堂日志</button>
        </div>
        <div className="mt-4 space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Mic className="h-4 w-4 text-indigo-500" />
                {log.attendance}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
                {log.highlights.map((highlight) => (
                  <span key={highlight} className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    {highlight}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                {log.assignments.map((assignment) => (
                  <span key={assignment} className="rounded-full border border-gray-200 px-3 py-1 dark:border-gray-700">
                    {assignment}
                  </span>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm dark:bg-gray-900/60 dark:text-gray-300">
                <Video className="h-4 w-4 text-emerald-500" />
                录播状态：{log.recordingStatus}
              </div>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">下一步：{log.nextActions.join('；')}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
