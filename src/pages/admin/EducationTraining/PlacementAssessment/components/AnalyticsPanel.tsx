import { ArrowDownRight, ArrowUpRight, LineChart, Target } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import type { ScoreInsight, SkillRadarEntry } from '../types';

interface Props {
  scoreInsights: ScoreInsight[];
  skillRadar: SkillRadarEntry[];
}

export const AnalyticsPanel = ({ scoreInsights, skillRadar }: Props) => {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">成绩分析与能力雷达</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">聚合班级成绩趋势、目标差距与能力项表现，指导精准的教学干预。</p>
        </div>
        <Badge className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">教学决策</Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {scoreInsights.map((insight) => {
          const diff = insight.averageScore - insight.targetScore;
          const isAhead = diff >= 0;
          return (
            <Card
              key={insight.id}
              className="border-gray-200/80 bg-white shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-900/60 dark:hover:border-indigo-500/40"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base">{insight.cohort}</CardTitle>
                  <Badge
                    className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                      insight.riskLevel === 'high'
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                        : insight.riskLevel === 'medium'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}
                  >
                    {insight.riskLevel === 'high' ? '高风险' : insight.riskLevel === 'medium' ? '关注中' : '健康'}
                  </Badge>
                </div>
                <CardDescription>平均分 {insight.averageScore} · 目标 {insight.targetScore}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-900/40 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-indigo-500" />
                    分位区间
                  </span>
                  <span>
                    P75 {insight.percentile75} / P25 {insight.percentile25}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-gray-900 dark:text-white">
                  <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Target className="h-4 w-4 text-indigo-500" />
                    距目标
                  </span>
                  <span className={`inline-flex items-center gap-1 text-sm ${isAhead ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                    {isAhead ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {Math.abs(diff).toFixed(1)} 分
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
                  <p className="font-medium text-gray-700 dark:text-gray-200">重点关注</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {insight.focusAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-gray-200/70 bg-white dark:border-gray-700 dark:bg-gray-900/60">
        <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base">能力雷达条目</CardTitle>
            <CardDescription>记录听说读写等核心能力的当前表现与目标差距。</CardDescription>
          </div>
          <Badge className="rounded-full border border-indigo-500/40 bg-indigo-50/80 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-900/30 dark:text-indigo-200">
            {skillRadar.length} 个能力项
          </Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <th className="py-2 pr-4">能力项</th>
                <th className="py-2 pr-4">当前表现</th>
                <th className="py-2 pr-4">目标值</th>
                <th className="py-2 pr-4">提升幅度</th>
                <th className="py-2">进度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {skillRadar.map((entry) => {
                const progress = entry.target === 0 ? 0 : Math.min(100, Math.round((entry.current / entry.target) * 100));
                return (
                  <tr key={entry.skill} className="text-sm text-gray-700 dark:text-gray-200">
                    <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">{entry.skill}</td>
                    <td className="py-3 pr-4">{entry.current.toFixed(1)}</td>
                    <td className="py-3 pr-4">{entry.target.toFixed(1)}</td>
                    <td className="py-3 pr-4 text-xs text-gray-500 dark:text-gray-400">{entry.change >= 0 ? '+' : ''}{entry.change.toFixed(1)}</td>
                    <td className="py-3">
                      <Progress value={progress} className="h-1.5" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
};
