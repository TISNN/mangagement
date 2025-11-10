import React from 'react';
import { Users, Calendar } from 'lucide-react';
import { MILESTONES, SERVICE_ORDERS } from './serviceCenterData';

const ServiceCenterProjectsPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">项目工单总览</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              监控服务订单的阶段、负责人、截止日期与健康状况，便于 CSM 快速调度资源。
            </p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-emerald-300 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-400 dark:hover:text-emerald-200">
            <Users className="h-3.5 w-3.5" /> 分配专家
          </button>
        </div>
        <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700/70">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700/70">
            <thead className="bg-gray-50/80 dark:bg-gray-800/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">订单编号</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">客户</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">服务内容</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">阶段</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">负责人</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">截止</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">健康度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white/40 dark:divide-gray-800/70 dark:bg-transparent">
              {SERVICE_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{order.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{order.client}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.service}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200">
                      {order.stage}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{order.csm}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600 dark:text-gray-300">{order.deadline}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        order.health === '稳定'
                          ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-200'
                          : order.health === '风险'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
                            : 'bg-amber-50 text-amber-500 dark:bg-amber-500/10 dark:text-amber-200'
                      }`}
                    >
                      {order.health}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">关键里程碑</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">结合甘特视图掌握项目节点与责任人。</p>
            </div>
            <Calendar className="h-5 w-5 text-sky-400" />
          </div>
          <div className="mt-5 space-y-4">
            {MILESTONES.map((milestone) => (
              <div key={milestone.label} className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700/70">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">{milestone.label}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      milestone.status === '完成'
                        ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/10 dark:text-emerald-200'
                        : milestone.status === '进行中'
                          ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300'
                    }`}
                  >
                    {milestone.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{milestone.owner}</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">计划完成：{milestone.due}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">交付作战手册</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• 设定工单 SLA（响应 12h、交付节点分解）并可视化在甘特图中。</li>
            <li>• 定义风险升级机制：红色项目自动抄送交付负责人与法务。</li>
            <li>• 项目回顾模板沉淀至知识花园，便于复盘与案例复用。</li>
            <li>• 将客户反馈同步至 CRM，触发 Cross-sell 或 Referral 跟进。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterProjectsPage;
