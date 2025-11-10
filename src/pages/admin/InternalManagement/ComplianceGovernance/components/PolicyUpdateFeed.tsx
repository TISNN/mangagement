import { ExternalLink, Newspaper } from 'lucide-react';

import type { PolicyUpdate } from '../../types';

interface PolicyUpdateFeedProps {
  policies: PolicyUpdate[];
}

export const PolicyUpdateFeed: React.FC<PolicyUpdateFeedProps> = ({ policies }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">政策动态速递</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">跟踪留学、教育、数据相关监管要求，快速评估影响。</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200"
          onClick={() => console.info('[PolicyUpdateFeed] 订阅政策动态')}
        >
          <Newspaper className="h-3.5 w-3.5" />
          订阅提醒
        </button>
      </div>

      <ul className="mt-4 space-y-3">
        {policies.map((policy) => (
          <li
            key={policy.id}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm dark:border-gray-800 dark:bg-gray-900/40"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{policy.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  来源：{policy.source} · 生效日期 {policy.effectiveDate}
                </p>
              </div>
              {policy.link ? (
                <a
                  href={policy.link}
                  className="inline-flex items-center gap-2 text-xs text-blue-600 hover:underline dark:text-blue-200"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => console.info('[PolicyUpdateFeed] 打开政策链接', { policyId: policy.id })}
                >
                  查看原文
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{policy.impact}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

