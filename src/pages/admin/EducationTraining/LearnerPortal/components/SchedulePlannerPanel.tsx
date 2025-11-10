import { AlertCircle, ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import type { AttendanceInsight, LessonEvent, ScheduleSummary } from '../types';

interface SchedulePlannerPanelProps {
  lessons: LessonEvent[];
  weeklySummary: ScheduleSummary[];
  insights: AttendanceInsight[];
}

export const SchedulePlannerPanel: React.FC<SchedulePlannerPanelProps> = ({ lessons, weeklySummary, insights }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">课程安排视图</h3>
          <button className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300">
            <ArrowRight className="h-3.5 w-3.5" />
            进入排课中心
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {weeklySummary.map((item) => (
            <div key={item.day} className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{item.day}</p>
              <div className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.lessons} 节课</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">学习时长 {item.studyHours} 小时</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">重点：{item.focus}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">班课与教室分布</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">支持线下教室与线上课堂混合排课，一键查看入口。</p>
          <div className="mt-4 space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{lesson.course}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.instructor} · {lesson.date} · {lesson.timeRange}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">{lesson.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    {lesson.mode}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    {lesson.location}
                  </span>
                  {lesson.resources.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">出勤与提醒</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">自动识别缺勤、迟到与课堂互动表现，触发提醒。</p>
          <div className="mt-4 space-y-3">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{insight.title}</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{insight.detail}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      insight.status === '良好'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : insight.status === '提醒'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                    }`}
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {insight.status}
                  </span>
                </div>
                {insight.actions.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insight.actions.map((action) => (
                      <button
                        key={action}
                        className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40"
                      >
                        {action}
                      </button>
                    ))}
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
