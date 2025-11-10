import React from 'react';
import { Globe2, ShieldCheck } from 'lucide-react';
import { ALERTS, KEY_INSIGHTS, METRICS, PIPELINE_STEPS } from './serviceCenterData';

const ServiceCenterOverviewPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/70"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${metric.accent}`}>{metric.change}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">定制请求漏斗</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  追踪潜在 B 端项目，从需求到成交的关键路径。
                </p>
              </div>
              <Globe2 className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="mt-6 space-y-4">
              {PIPELINE_STEPS.map((item) => (
                <div key={item.stage} className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700/80">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{item.stage}</span>
                    <span>转化 {item.conversion}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-700/60">
                      <span
                        className="block h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400"
                        style={{ width: item.conversion }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.count} 单</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">关键 SLA 指标</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">实时监控响应、审批与智能推荐的执行情况。</p>
                </div>
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                {KEY_INSIGHTS.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-gray-700/70"
                  >
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{card.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
                    </div>
                    <card.icon className="h-4 w-4 text-indigo-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">风险与提醒</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">聚合 SLA 超时、审批积压、客户反馈异常等风险信号。</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {ALERTS.map((alert) => (
                  <div key={alert.title} className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700/70">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</p>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{alert.owner}</span>
                      <span className="rounded-full bg-rose-50 px-2 py-1 text-rose-500 dark:bg-rose-500/10 dark:text-rose-200">
                        优先级 {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">运营节奏建议</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• 每周例会回顾 SLA 指标与风险项，确保法务/交付及时介入。</li>
            <li>• 为漏斗阶段配置自动化提醒，提高方案报价与合同确认的转化率。</li>
            <li>• 聚焦高价值客户（NPS ≥ 60）的续约与交叉销售机会。</li>
            <li>• 定期梳理 AI 推荐命中率，反哺服务包组合策略。</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default ServiceCenterOverviewPage;
