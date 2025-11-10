import { ListFilter } from 'lucide-react';

import { MENTOR_TASKS } from '../data';
import type { MentorTask } from '../types';

const STATUS_COLORS: Record<MentorTask['status'], string> = {
  待开始: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  进行中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  待审核: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const PRIORITY_COLORS: Record<MentorTask['priority'], string> = {
  高: 'text-rose-500',
  中: 'text-amber-500',
  低: 'text-slate-400',
};

const formatDate = (value: string) => value;

export const MissionPerformanceView = () => (
  <div className="space-y-4">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">任务与绩效</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">聚合导师当前任务、状态与关键绩效指标，支持批量操作。</p>
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
        <ListFilter className="h-4 w-4" />
        筛选任务
      </button>
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-700">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">任务</th>
              <th className="px-4 py-3">导师</th>
              <th className="px-4 py-3">学生</th>
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">优先级</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">截止</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {MENTOR_TASKS.map((task) => (
              <tr key={task.id} className="transition-colors hover:bg-blue-50/60 dark:hover:bg-blue-900/20">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{task.title}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.mentor}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.student}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{task.type}</td>
                <td className="px-4 py-3 text-sm font-semibold">
                  <span className={PRIORITY_COLORS[task.priority]}>{task.priority}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(task.deadline)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
                    查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">绩效指标一览</h3>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300 md:grid-cols-4">
        <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/60">
          <p className="text-xs text-gray-400">平均响应时长</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">7.2h</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/60">
          <p className="text-xs text-gray-400">任务准时率</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">92%</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/60">
          <p className="text-xs text-gray-400">AI 建议采纳率</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">68%</p>
        </div>
        <div className="rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-700/60">
          <p className="text-xs text-gray-400">学生满意度</p>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">4.7/5</p>
        </div>
      </div>
    </div>
  </div>
);
