import { CalendarClock, ClipboardCheck, TrendingDown, TrendingUp, Users } from 'lucide-react';

import type { ClassBrief, TeacherKpi, TeacherScheduleSlot } from '../types';

interface OverviewPanelProps {
  kpis: TeacherKpi[];
  schedule: TeacherScheduleSlot[];
  classes: ClassBrief[];
}

const trendIcon = (positive: boolean) => (positive ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />);

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ kpis, schedule, classes }) => {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{kpi.label}</p>
              {trendIcon(kpi.positive)}
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</div>
            <p className={`mt-2 text-xs ${kpi.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-300'}`}>{kpi.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">今日/本周课程</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
              <CalendarClock className="h-3.5 w-3.5" />
              {schedule.length} 场安排
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {schedule.map((slot) => (
              <div key={slot.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{slot.date}</span>
                  <span>{slot.timeRange}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{slot.course}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {slot.className} · {slot.format} · {slot.room}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    {slot.students} 人
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                    {slot.status}
                  </span>
                  {slot.actions.map((action) => (
                    <span key={action} className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">班级总览</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">查看班级目标、提醒与剩余课时。</p>
          <div className="mt-4 space-y-3">
            {classes.map((classItem) => (
              <div key={classItem.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{classItem.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{classItem.level}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-600 shadow-sm dark:bg-gray-900/60 dark:text-gray-300">
                    剩余 {classItem.remainingHours} 课时
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">目标：{classItem.objectives.join(' · ')}</div>
                {classItem.alerts?.length ? (
                  <div className="mt-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/10 dark:text-rose-300">
                    提醒：{classItem.alerts.join('；')}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
