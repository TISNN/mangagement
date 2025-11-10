import { AlertTriangle, ClipboardCheck, Shield } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import type { InterventionAlert, PlacementRule } from '../types';

interface Props {
  rules: PlacementRule[];
  alerts: InterventionAlert[];
}

export const PlacementGovernancePanel = ({ rules, alerts }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">分班规则与学员预警</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">构建自动分班策略与干预闭环，确保学员得到及时的个性化支持。</p>
        </div>
        <Badge className="rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white">风险防控</Badge>
      </header>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">自动规则</CardTitle>
            <CardDescription>根据成绩与目标自动推送补课、排班与课程推荐任务。</CardDescription>
          </div>
          <Badge className="rounded-full border border-rose-500/40 bg-rose-50/80 px-3 py-1 text-xs font-medium text-rose-600 dark:border-rose-500/30 dark:bg-rose-900/30 dark:text-rose-200">
            {rules.length} 条规则
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {rules.map((rule) => (
            <div key={rule.id} className="space-y-3 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Shield className="h-4 w-4 text-rose-500" />
                {rule.ruleName}
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">触发条件：</span>
                  {rule.criteria}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">自动动作：</span>
                  {rule.autoAction}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">是否人工审核：</span>
                  {rule.manualReview ? '需要人工复核' : '全自动执行'}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">高优学员预警</CardTitle>
            <CardDescription>集中管理触发补救动作的学员案例，确保任务闭环。</CardDescription>
          </div>
          <Badge className="rounded-full bg-rose-500 px-3 py-1 text-xs font-medium text-white">{alerts.length} 个待处理</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{alert.studentName}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">所属：{alert.cohort}</p>
                </div>
                <Badge
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    alert.severity === 'high'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {alert.severity === 'high' ? '高风险' : alert.severity === 'medium' ? '需关注' : '轻度'}
                </Badge>
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  <span>{alert.trigger}</span>
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">责任人：</span>
                  {alert.owner}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">截止时间：</span>
                  {alert.dueDate}
                </p>
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">下一步：</span>
                  {alert.nextStep}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
