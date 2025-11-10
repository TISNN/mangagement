import { Calendar, Settings } from 'lucide-react';

import { AVAILABILITY_DATA, MENTOR_TEAM } from '../data';
import type { AvailabilityStatus } from '../types';

const AVAILABILITY_CLASS: Record<AvailabilityStatus, string> = {
  可用: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  忙碌: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  请假: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

export const AvailabilityView = () => (
  <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-700/60 dark:bg-gray-800">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">排班与可用性</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">管理导师可用时段，支持拖拽、请假和提醒设置。</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
          <Settings className="h-4 w-4" />
          排班设置
        </button>
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
          <Calendar className="h-4 w-4" />
          导入日历
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {MENTOR_TEAM.map((mentor) => (
        <div key={mentor.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{mentor.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">主职：{mentor.primaryRole} · 时区 {mentor.timezone}</p>
            </div>
            <span className="text-xs text-gray-400">上次更新 {mentor.lastActivity}</span>
          </div>
          <div className="mt-3 space-y-2">
            {AVAILABILITY_DATA.filter((slot) => slot.mentorId === mentor.id).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/60">
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {slot.day} · {slot.startTime} - {slot.endTime}
                  {slot.note && <span className="ml-2 text-gray-400">({slot.note})</span>}
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${AVAILABILITY_CLASS[slot.status]}`}>{slot.status}</span>
              </div>
            ))}
            {AVAILABILITY_DATA.every((slot) => slot.mentorId !== mentor.id) && (
              <div className="rounded-lg border border-dashed border-gray-200 px-3 py-4 text-center text-xs text-gray-400 dark:border-gray-600">
                暂无排班信息，点击排班设置配置可用时间。
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
      日历组件占位：后续接入真正的周/月视图，支持拖拽排班。
    </div>
  </div>
);
