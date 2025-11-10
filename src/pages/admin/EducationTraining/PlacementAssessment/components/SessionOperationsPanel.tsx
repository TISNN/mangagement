import { AlarmClock, MapPin, ShieldCheck, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { AssessmentSession, CapacitySnapshot } from '../types';

interface Props {
  sessions: AssessmentSession[];
  capacities: CapacitySnapshot[];
}

const modeLabelMap: Record<AssessmentSession['mode'], string> = {
  online: '线上',
  offline: '线下',
  hybrid: '混合模式',
};

export const SessionOperationsPanel = ({ sessions, capacities }: Props) => {
  const totalSlots = capacities.reduce((acc, cur) => acc + cur.slots, 0);

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">测评执行与资源</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">统筹线上线下考场、AI 监考与监考老师排班，保障每一场测评顺利执行。</p>
        </div>
        <Badge className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">执行视图</Badge>
      </header>

      <Card className="border-gray-200/70 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">即将到来的测评场次</CardTitle>
            <CardDescription>关注报满率与监考保障，提前补位关键资源。</CardDescription>
          </div>
          <Badge className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">{sessions.length} 场</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessions.map((session) => {
            const rate = Math.min(100, Math.round((session.booked / session.capacity) * 100));
            return (
              <div
                key={session.id}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{session.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <AlarmClock className="h-4 w-4" />
                      {session.startTime} · {session.endTime}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {session.mode !== 'offline' ? (
                        <Video className="h-4 w-4 text-blue-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-amber-500" />
                      )}
                      {session.channel}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Badge className="rounded-full bg-gray-900/85 px-3 py-1 text-white dark:bg-gray-100 dark:text-gray-900">
                      {modeLabelMap[session.mode]}
                    </Badge>
                    <span>AI 监考：{session.hasAiProctor ? '已启用' : '暂未启用'}</span>
                    <span>监考：{session.invigilators.join('、')}</span>
                  </div>
                </div>
                <div className="grid gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span>报名情况</span>
                    <span>
                      {session.booked} / {session.capacity} · {rate}%
                    </span>
                  </div>
                  <Progress value={rate} className="h-2" />
                  {session.location && (
                    <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3.5 w-3.5" />
                      {session.location}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-gray-200/70 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">资源容量快照</CardTitle>
            <CardDescription>掌握区域资源使用率，为下一轮测评窗口预留空间。</CardDescription>
          </div>
          <Badge className="rounded-full border border-emerald-500/40 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-900/30 dark:text-emerald-200">
            总容量 {totalSlots}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {capacities.map((capacity) => {
            const rate = capacity.slots === 0 ? 0 : Math.round((capacity.booked / capacity.slots) * 100);
            return (
              <div
                key={capacity.id}
                className="space-y-3 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span>{capacity.region}</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>可用名额</span>
                    <span>{capacity.slots}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>已预约</span>
                    <span>{capacity.booked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>完成率</span>
                    <span>{Math.round(capacity.completionRate * 100)}%</span>
                  </div>
                </div>
                <Progress value={rate} className="h-1.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
};
