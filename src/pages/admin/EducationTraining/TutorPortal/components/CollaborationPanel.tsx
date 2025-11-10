import { MessageCircle } from 'lucide-react';

import type { CollaborationItem } from '../types';

interface CollaborationPanelProps {
  threads: CollaborationItem[];
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ threads }) => {
  return (
    <section className="space-y-4">
      {threads.map((thread) => (
        <div key={thread.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                <MessageCircle className="h-4 w-4" />
                {thread.channel}
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">{thread.subject}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">最近更新 {thread.lastUpdate}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${thread.unread ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
              {thread.unread ? `${thread.unread} 条未读` : '已处理'}
            </span>
          </div>
          {thread.quickActions.length ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {thread.quickActions.map((action) => (
                <button
                  key={action}
                  className="rounded-full border border-blue-200 px-3 py-1 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40"
                >
                  {action}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
};
