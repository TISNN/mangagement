import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { IntegrationTask, KpiMetric } from '../types';

interface Props {
  kpis: KpiMetric[];
  tasks: IntegrationTask[];
}

const trendIconMap = {
  up: <ArrowUpRight className="h-4 w-4 text-emerald-500" />,
  down: <ArrowDownRight className="h-4 w-4 text-rose-500" />,
  flat: <ArrowRight className="h-4 w-4 text-gray-400" />,
} as const;

export const OpsAndIntegrationPanel = ({ kpis, tasks }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">运营指标与系统集成</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">聚焦测评 KPI 与跨系统集成进度，保障数据闭环与流程自动化。</p>
        </div>
        <Badge className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-white">运营驾驶舱</Badge>
      </header>

      <Card className="border-gray-200/70 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">核心 KPI</CardTitle>
            <CardDescription>实时追踪测评闭环与自动化覆盖率，评估项目健康度。</CardDescription>
          </div>
          <Badge className="rounded-full border border-slate-500/40 bg-slate-50/80 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-500/30 dark:bg-slate-900/40 dark:text-slate-200">
            {kpis.length} 项指标
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.id} className="space-y-2 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <span>{kpi.label}</span>
                {trendIconMap[kpi.trend]}
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{kpi.value}</p>
              <p className={`text-xs ${kpi.change.includes('-') ? 'text-rose-600 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-300'}`}>
                同比 {kpi.change}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">系统集成任务</CardTitle>
            <CardDescription>统筹测评系统与 CRM / 教务 / AI 服务的打通动作。</CardDescription>
          </div>
          <Badge className="rounded-full bg-slate-600 px-3 py-1 text-xs font-medium text-white">优先推进</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{task.owner}</p>
                </div>
                <Badge
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-medium ${
                    task.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : task.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-300'
                  }`}
                >
                  {task.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
                  {task.status === 'in-progress' && <Loader2 className="h-4 w-4 animate-spin" />}
                  {task.status === 'pending' && <Activity className="h-4 w-4" />}
                  {task.status === 'completed' ? '已完成' : task.status === 'in-progress' ? '执行中' : '待启动'}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">{task.notes}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
