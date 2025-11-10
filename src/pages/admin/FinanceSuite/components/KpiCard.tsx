import type { FC } from 'react';

import { ArrowUpRight } from 'lucide-react';

import type { KpiCardConfig } from '../types';

interface Props {
  config: KpiCardConfig;
}

export const KpiCard: FC<Props> = ({ config }) => {
  const Icon = config.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900/70">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{config.label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">{config.value}</span>
            {config.delta && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  config.tone === 'positive'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : config.tone === 'negative'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <ArrowUpRight className="h-3 w-3" />
                {config.delta}
              </span>
            )}
          </div>
          {config.caption && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{config.caption}</p>}
        </div>
        <span className="rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 text-blue-600 dark:text-blue-300">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{config.description}</p>
    </div>
  );
};
