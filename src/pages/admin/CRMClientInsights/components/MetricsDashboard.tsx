/**
 * 指标看板组件
 * 展示客户总量、活跃客户、流失风险、留存率等核心指标
 */

import React from 'react';
import { ArrowDownRight, ArrowUpRight, Activity, PieChart } from 'lucide-react';
import { MetricCard } from '../types';
import { METRICS } from '../constants';

interface MetricsDashboardProps {
  metrics?: MetricCard[];
}

const renderTrendIcon = (trend: MetricCard['trend']) => {
  if (trend === 'up') {
    return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
  }
  if (trend === 'down') {
    return <ArrowDownRight className="h-4 w-4 text-rose-500" />;
  }
  return <Activity className="h-4 w-4 text-gray-400" />;
};

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ metrics = METRICS }) => {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60"
        >
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{metric.label}</span>
            <PieChart className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium">
            {renderTrendIcon(metric.trend)}
            <span
              className={
                metric.trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-300'
                  : metric.trend === 'down'
                    ? 'text-rose-500 dark:text-rose-300'
                    : 'text-gray-500 dark:text-gray-400'
              }
            >
              {metric.change}
            </span>
            <span className="text-gray-400 dark:text-gray-500">· {metric.note}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MetricsDashboard;

