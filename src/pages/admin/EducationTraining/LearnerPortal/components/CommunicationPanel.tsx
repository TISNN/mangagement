import { BellRing, MessageCircle } from 'lucide-react';

import type { CommunicationCard, GuardianAlert } from '../types';

interface CommunicationPanelProps {
  threads: CommunicationCard[];
  alerts: GuardianAlert[];
}

export const CommunicationPanel: React.FC<CommunicationPanelProps> = ({ threads, alerts }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">沟通中心</h3>
          <button className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
            <MessageCircle className="h-3.5 w-3.5" />
            发起新会话
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">为班主任、家长与顾问建立统一消息流，支持快捷操作。</p>

        <div className="mt-4 space-y-3">
          {threads.map((thread) => (
            <div key={thread.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{thread.topic}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {thread.channel} · 最近更新 {thread.lastActivity}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{thread.lastMessage}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${thread.unread ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'}`}>
                  {thread.unread ? `${thread.unread} 条未读` : '全部已读'}
                </span>
              </div>
              {thread.quickActions.length ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
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
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">家长提醒面板</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            <BellRing className="h-3.5 w-3.5" />
            待处理 {alerts.length}
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.message}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    alert.level === '高'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                      : alert.level === '中'
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {alert.type}
                </span>
              </div>
              {alert.actionLabel ? (
                <div className="mt-3">
                  <button className="rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
                    {alert.actionLabel}
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
