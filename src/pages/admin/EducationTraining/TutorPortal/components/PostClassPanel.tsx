import { ClipboardList, Send } from 'lucide-react';

import type { PostClassAction, RequestItem } from '../types';

interface PostClassPanelProps {
  actions: PostClassAction[];
  requests: RequestItem[];
}

const statusClass = (status: PostClassAction['status']) => {
  switch (status) {
    case '待处理':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300';
    case '进行中':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300';
    case '完成':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300';
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300';
  }
};

const requestClass = (status: RequestItem['status']) => {
  switch (status) {
    case '待审批':
      return 'text-amber-600 dark:text-amber-300';
    case '已通过':
      return 'text-emerald-600 dark:text-emerald-300';
    case '已驳回':
      return 'text-rose-600 dark:text-rose-300';
    default:
      return 'text-gray-600 dark:text-gray-300';
  }
};

export const PostClassPanel: React.FC<PostClassPanelProps> = ({ actions, requests }) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">课后任务看板</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
            <ClipboardList className="h-3.5 w-3.5" />
            {actions.length} 项待跟进
          </span>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {actions.map((action) => (
            <div key={action.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.title}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{action.assignee}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(action.status)}`}>{action.status}</span>
              </div>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">截止时间：{action.deadline}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button className="rounded-full border border-blue-200 px-3 py-1 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
                  查看详情
                </button>
                <button className="rounded-full border border-gray-200 px-3 py-1 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900/40">
                  标记完成
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">审批与请求</h3>
          <button className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900/40">
            <Send className="h-3.5 w-3.5" />
            提交新请求
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{request.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{request.detail}</p>
                </div>
                <span className={`text-xs font-medium ${requestClass(request.status)}`}>{request.status}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">提交时间：{request.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
