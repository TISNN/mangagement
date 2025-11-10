import { BarChart3, Clock, MonitorSmartphone, UserCheck, Wrench } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { RoomResource, TeacherAvailability } from '../types';

interface Props {
  teachers: TeacherAvailability[];
  rooms: RoomResource[];
}

export const ResourceOverviewPanel = ({ teachers, rooms }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">师资与教室资源</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">对比教师工作时长与教室利用率，提前识别资源瓶颈，保障排课连续性。</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">教师可用性</CardTitle>
            <CardDescription>关注教师工作负载与偏好时段，合理分配课程，避免过载。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {teachers.map((teacher) => {
              const loadRate = teacher.weeklyHours === 0 ? 0 : Math.round((teacher.bookedHours / teacher.weeklyHours) * 100);
              return (
                <div key={teacher.id} className="rounded-xl border border-gray-100 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-900/70">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{teacher.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{teacher.subjects.join(' · ')}</p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        teacher.status === 'available'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : teacher.status === 'busy'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {teacher.status === 'available' ? '可排课' : teacher.status === 'busy' ? '紧张' : '超负荷'}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span className="inline-flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-500" /> 已排课时
                      </span>
                      <span>
                        {teacher.bookedHours} / {teacher.weeklyHours} 小时
                      </span>
                    </div>
                    <Progress value={Math.min(100, loadRate)} className="h-2" />
                    <p>偏好时段：{teacher.preferredSlots.join('、')}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">教室与教具资源</CardTitle>
            <CardDescription>统计不同类型教室的容量利用情况，协助调配线下与线上资源。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rooms.map((room) => (
              <div key={room.id} className="rounded-xl border border-gray-100 bg-white/70 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{room.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">类型：{room.type === 'virtual' ? '线上教室' : room.type === 'lab' ? '实验室' : '面授教室'}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Wrench className="h-4 w-4 text-blue-500" /> {room.equipment.join(' / ')}
                  </span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <MonitorSmartphone className="h-4 w-4 text-emerald-500" /> 可容纳人数
                    </span>
                    <span>{room.capacity} 人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>可用时段</span>
                    <span>{room.availableHours.join('，')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <BarChart3 className="h-4 w-4 text-indigo-500" /> 利用率
                    </span>
                    <span>{Math.round(room.utilization * 100)}%</span>
                  </div>
                  <Progress value={Math.min(100, Math.round(room.utilization * 100))} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
