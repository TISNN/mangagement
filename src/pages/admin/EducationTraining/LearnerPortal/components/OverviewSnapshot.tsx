import { CalendarClock, CheckCircle2, Clock, PlayCircle, TrendingDown, TrendingUp } from 'lucide-react';

import type { LearnerKpi, LearningTask, LessonEvent } from '../types';

interface OverviewSnapshotProps {
  kpis: LearnerKpi[];
  lessons: LessonEvent[];
  tasks: LearningTask[];
}

const trendIcon = (positive: boolean) => (positive ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />);

export const OverviewSnapshot: React.FC<OverviewSnapshotProps> = ({ kpis, lessons, tasks }) => {
  const pendingTasks = tasks.filter((task) => task.status === '待提交').length;
  const reviewingTasks = tasks.filter((task) => task.status === '批改中').length;
  const completedPercent = Math.round(
    tasks.length === 0 ? 0 : (tasks.filter((task) => task.status === '已完成' || task.status === '已提交').length / tasks.length) * 100,
  );

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{kpi.label}</p>
              {trendIcon(kpi.positive)}
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</div>
            <p className={`mt-2 text-xs ${kpi.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-300'}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">本周课程计划</h3>
            <a className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-300" href="#">查看课表</a>
          </div>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="rounded-xl border border-dashed border-gray-200 p-4 hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{lesson.date}</span>
                  <span>{lesson.timeRange}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{lesson.course}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.instructor} · {lesson.mode}</p>
                  </div>
                  <button className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200">
                    <PlayCircle className="h-4 w-4" />
                    进入
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800/60">
                    <CalendarClock className="h-3.5 w-3.5 text-blue-500" />
                    {lesson.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800/60">
                    <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    {lesson.location}
                  </span>
                  {lesson.resources.map((resource) => (
                    <span key={resource} className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800/60">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">作业任务状态</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">完成率 {completedPercent}%</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <CheckCircle2 className="h-4 w-4 text-sky-500" />
              待提交 {pendingTasks} 项
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Clock className="h-4 w-4 text-amber-500" />
              批改中 {reviewingTasks} 项
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.course} · 截止 {task.dueDate}</p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-900/70 dark:text-gray-300">
                    {task.status}
                  </span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${task.completion}%` }} />
                </div>
                {task.aiHighlights?.length ? (
                  <div className="mt-3 text-xs text-blue-600 dark:text-blue-300">
                    AI 建议：{task.aiHighlights.join('；')}
                  </div>
                ) : null}
                {task.nextSteps?.length ? (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">下一步：{task.nextSteps.join('；')}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
