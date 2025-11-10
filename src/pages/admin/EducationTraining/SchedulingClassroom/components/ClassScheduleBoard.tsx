import { CalendarRange, Clock, GraduationCap, ListChecks, MapPin, Users } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type {
  ClassProfile,
  ConstraintRule,
  OptimizationSuggestion,
  ScheduleSlot,
} from '../types';

interface Props {
  classes: ClassProfile[];
  slots: ScheduleSlot[];
  constraints: ConstraintRule[];
  optimizations: OptimizationSuggestion[];
}

const statusBadgeMap: Record<ClassProfile['scheduleStatus'], string> = {
  draft: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
  published: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  'in-progress': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const slotStatusLabel: Record<ScheduleSlot['status'], string> = {
  scheduled: '已排课',
  adjusted: '已调整',
  pending: '待确认',
};

const slotStatusStyle: Record<ScheduleSlot['status'], string> = {
  scheduled: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
  adjusted: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300',
};

export const ClassScheduleBoard = ({ classes, slots, constraints, optimizations }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">班级档案与排课概览</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">掌握班级容量、进度状态与关键课程节点，快速评估排课健康度。</p>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        {classes.map((cls) => {
          const fillRate = cls.capacity === 0 ? 0 : Math.round((cls.enrolled / cls.capacity) * 100);
          return (
            <Card key={cls.id} className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <CardDescription className="mt-1 text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
                      {cls.program}
                    </CardDescription>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeMap[cls.scheduleStatus]}`}>
                    {cls.scheduleStatus === 'draft' && '草稿'}
                    {cls.scheduleStatus === 'published' && '已发布'}
                    {cls.scheduleStatus === 'in-progress' && '执行中'}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <CalendarRange className="h-4 w-4" /> {cls.startDate} ~ {cls.endDate}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    班级容量
                  </span>
                  <span>
                    {cls.enrolled} / {cls.capacity}
                  </span>
                </div>
                <Progress value={fillRate} className="h-2" />
                <div className="grid gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>班主任：{cls.advisor}</span>
                  <span>主讲老师：{cls.leadTeacher}</span>
                  <span>助教团队：{cls.assistants.join('、') || '待配置'}</span>
                  <span>授课模式：{cls.mode === 'hybrid' ? '线上 + 线下' : cls.mode === 'online' ? '线上' : '线下'}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">排课日历（本周重点）</CardTitle>
            <CardDescription>快速检视本周课程安排、授课老师与场地状态，及时发现冲突。</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  <th className="py-2 pr-4">班级</th>
                  <th className="py-2 pr-4">课程主题</th>
                  <th className="py-2 pr-4">授课老师</th>
                  <th className="py-2 pr-4">时间</th>
                  <th className="py-2 pr-4">地点 / 形式</th>
                  <th className="py-2">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {slots.map((slot) => {
                  const classInfo = classes.find((cls) => cls.id === slot.classId);
                  return (
                    <tr key={slot.id} className="align-top text-sm text-gray-700 dark:text-gray-200">
                      <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{classInfo?.name ?? slot.classId}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">{slot.topic}</td>
                      <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{slot.teacher}</td>
                      <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{slot.startTime} ~ {slot.endTime}</td>
                      <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-blue-500" />
                          {slot.room}
                        </span>
                      </td>
                      <td className="py-3 text-xs">
                        <span className={`rounded-full px-2 py-0.5 font-medium ${slotStatusStyle[slot.status]}`}>
                          {slotStatusLabel[slot.status]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">排课约束与冲突预警</CardTitle>
            <CardDescription>实时捕捉教师时长、教室容量等硬性约束，辅助教务快速调整。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {constraints.map((item) => (
              <div key={item.id} className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200">
                <div className="flex items-start gap-2">
                  <ListChecks className={`mt-1 h-4 w-4 ${item.severity === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      影响班级：{item.impactedClasses.join('、')}
                    </p>
                    {item.resolution && <p className="text-xs text-blue-600 dark:text-blue-300">建议：{item.resolution}</p>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">智能调度建议</CardTitle>
            <CardDescription>汇总算法和教务经验生成的排课优化方案，标注影响程度与责任人。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {optimizations.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white/80 p-4 dark:border-gray-800 dark:bg-gray-900/70">
                <GraduationCap className="mt-1 h-5 w-5 text-blue-500" />
                <div className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
                  <p className="font-medium text-gray-900 dark:text-white">{item.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">责任人：{item.actionOwner}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">影响：{item.impact === 'high' ? '高' : item.impact === 'medium' ? '中' : '低'}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
