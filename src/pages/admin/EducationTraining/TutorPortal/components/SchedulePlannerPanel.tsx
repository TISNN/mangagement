import { AlertCircle, ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import type { AttendanceInsight, ScheduleSummary, TeacherScheduleSlot } from '../types';

interface SchedulePlannerPanelProps {
  lessons: TeacherScheduleSlot[];
  weeklySummary: ScheduleSummary[];
  insights: AttendanceInsight[];
}

export const SchedulePlannerPanel: React.FC<SchedulePlannerPanelProps> = ({ lessons, weeklySummary, insights }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">出勤与提醒</h3>
      <p className="mt-1 text-xs text灰-500 dark:text-gray-400">自动识别缺勤、迟到与课堂互动表现，触发提醒。</p>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">课程安排视图</h3>
          <p className="mt-1 text-xs text灰-500 dark:text-gray-400">查看所有课程安排，包括日期、时间、课程名称和教室。</p>

          <div className="mt-6 grid grid-cols-1 gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{lesson.course}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.className} · {lesson.date} · {lesson.timeRange}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">{lesson.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    {lesson.format}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg白 px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    {lesson.room}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">学生 {lesson.students} 人</span>
                  {lesson.actions.map((tag) => (
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
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">班课与教室分布</h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">支持线下教室与线上课堂混合排课，一键查看入口。</p>

          <div className="mt-6 grid grid-cols-1 gap-6">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{lesson.course}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.className} · {lesson.date} · {lesson.timeRange}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">{lesson.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <CalendarDays className="h-3.5 w-3.5 text-indigo-500" />
                    {lesson.format}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg白 px-3 py-1 shadow-sm dark:bg-gray-900/60">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                    {lesson.room}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">学生 {lesson.students} 人</span>
                  {lesson.actions.map((tag) => (
                    <span key={tag} className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-gray-900/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
