import { Sparkles } from 'lucide-react';

import { SUMMARY_DATA } from '../data';

export const SummaryCards = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {SUMMARY_DATA.map((metric) => (
      <div
        key={metric.title}
        className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700/60 dark:bg-gray-800"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-purple-50/40 dark:from-gray-800/0 dark:via-gray-800/0 dark:to-purple-900/10" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            <p
              className={`mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium dark:border-gray-600 ${metric.positive ? 'text-emerald-500' : 'text-rose-500'}`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {metric.trend}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
            {metric.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);
