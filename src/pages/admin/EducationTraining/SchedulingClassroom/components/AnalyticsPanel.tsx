import { ArrowDownRight, ArrowRight, ArrowUpRight, ThermometerSun } from 'lucide-react';
import type { JSX } from 'react';

import type { HeatmapSnapshot, MetricCard } from '../types';

interface SectionHeaderProps {
  title: string;
  description?: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  </div>
);

interface Props {
  metrics: MetricCard[];
  heatmap: HeatmapSnapshot[];
}

const trendIcon: Record<MetricCard['trend'], JSX.Element> = {
  up: <ArrowUpRight className="h-4 w-4 text-emerald-500" />,
  down: <ArrowDownRight className="h-4 w-4 text-rose-500" />,
  flat: <ArrowRight className="h-4 w-4 text-gray-400" />,
};

export const AnalyticsPanel = ({ metrics, heatmap }: Props) => {
  return (
    <section className="space-y-4">
      <SectionHeader title="运营指标与热力图" description="跟踪关键 KPI 及排课高峰时段，辅助制定资源调度策略。" />

      <div className="grid gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="space-y-2 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              <span>{metric.title}</span>
              {trendIcon[metric.trend]}
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            {metric.delta && (
              <p className={`text-xs ${metric.delta.startsWith('-') ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'}`}>
                同比 {metric.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {heatmap.map((item) => (
          <div key={item.id} className="space-y-2 rounded-xl border border-gray-100 bg-white/70 p-4 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
              <ThermometerSun className="h-4 w-4 text-amber-500" />
            </div>
            <div className="rounded-lg bg-gray-100 p-3 text-center text-xl font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
              {item.value}%
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">排课占用率</p>
          </div>
        ))}
      </div>
    </section>
  );
};
