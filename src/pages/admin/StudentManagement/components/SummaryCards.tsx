import React from 'react';
import { Activity, Sparkles, Star, Users } from 'lucide-react';
import { SummaryMetric, SummaryMetricIcon } from '../types';

interface SummaryCardsProps {
  metrics: SummaryMetric[];
}

const ICON_MAP: Record<SummaryMetricIcon, React.ReactNode> = {
  users: <Users className="h-5 w-5 text-blue-500" />,
  activity: <Activity className="h-5 w-5 text-emerald-500" />,
  sparkles: <Sparkles className="h-5 w-5 text-amber-500" />,
  star: <Star className="h-5 w-5 text-purple-500" />,
};

const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {metrics.map((item) => (
      <div
        key={item.title}
        className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-blue-50/40 dark:from-gray-800/0 dark:via-gray-800/0 dark:to-blue-900/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p
              className={`mt-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
                item.positive
                  ? 'border-emerald-200 text-emerald-600 dark:border-emerald-900/40 dark:text-emerald-300'
                  : 'border-rose-200 text-rose-600 dark:border-rose-900/40 dark:text-rose-300'
              }`}
            >
              {item.trend}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
            {ICON_MAP[item.icon]}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default SummaryCards;

