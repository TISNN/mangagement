import { Calendar, CheckCircle2, ClipboardList, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { AssessmentPlan, AssessmentTimelineEvent } from '../types';

interface Props {
  plans: AssessmentPlan[];
  timeline: AssessmentTimelineEvent[];
}

const riskBadgeMap: Record<AssessmentPlan['riskLevel'], string> = {
  low: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  medium: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  high: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

const statusLabel: Record<AssessmentPlan['status'], string> = {
  draft: '草稿',
  published: '已发布',
  'in-progress': '进行中',
};

export const AssessmentPlanBoard = ({ plans, timeline }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">测评计划总览</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            统一追踪入学测评与模考执行进度，掌握容量消耗与关键节点。
          </p>
        </div>
        <Badge className="rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white shadow-sm">测评运营工作流</Badge>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => {
          const capacityRate = Math.min(100, Math.round((plan.booked / plan.capacity) * 100));
          return (
            <Card key={plan.id} className="border-gray-200/80 bg-white transition hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:hover:border-blue-500/40">
              <CardHeader className="space-y-3 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-2 text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">
                      <ClipboardList className="h-4 w-4" />
                      {plan.examType}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <Badge className={`rounded-full px-2 py-0.5 ${riskBadgeMap[plan.riskLevel]}`}>{plan.riskLevel === 'low' ? '低风险' : plan.riskLevel === 'medium' ? '中风险' : '高风险'}</Badge>
                    <Badge className="rounded-full bg-gray-900/90 px-2 py-0.5 text-white dark:bg-gray-100 dark:text-gray-900">
                      {statusLabel[plan.status]}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {plan.window}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      容量
                    </span>
                    <span>
                      {plan.booked} / {plan.capacity}
                    </span>
                  </div>
                  <Progress value={capacityRate} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{plan.mode === 'hybrid' ? '混合模式' : plan.mode === 'online' ? '线上测评' : '线下面测'}</span>
                    <span>负责人：{plan.owner}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300">
                  <p className="mb-2 font-medium text-gray-700 dark:text-gray-200">关键看点</p>
                  <ul className="space-y-1">
                    {plan.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">执行时间轴</CardTitle>
            <CardDescription>跟进题库、监考、系统集成等关键节点，确保测评上线无阻。</CardDescription>
          </div>
          <Badge className="rounded-full border border-blue-500/30 bg-blue-50/80 px-3 py-1 text-xs font-medium text-blue-600 dark:border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-200">
            {timeline.length} 项任务
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="grid gap-3 md:grid-cols-4">
            {timeline.map((item) => (
              <li key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/70">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.date}</p>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">负责人：{item.owner}</p>
                <p className="mt-2 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800/80 dark:text-gray-300">
                  {item.status === 'completed' && '已完成'}
                  {item.status === 'ready' && '待上线'}
                  {item.status === 'pending' && '进行中'}
                  {item.status === 'live' && '实时执行'}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.notes}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
};
