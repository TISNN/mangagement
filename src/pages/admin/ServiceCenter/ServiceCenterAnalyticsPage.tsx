import React from 'react';
import { BarChart3 } from 'lucide-react';
import { PERFORMANCE } from './serviceCenterData';

const ServiceCenterAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">服务表现洞察</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            从收入结构、满意度、复购率等维度评估服务包表现，为定价和资源分配提供依据。
          </p>
        </div>
        <BarChart3 className="h-6 w-6 text-indigo-400" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">收入结构</h3>
          <div className="mt-4 space-y-3">
            {PERFORMANCE.revenueMix.map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className={`h-2 w-12 rounded-full ${item.color}`} />
                <span className="flex-1">{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-400/10 to-emerald-400/10 px-3 py-2 text-xs text-indigo-500 dark:text-indigo-200">
            数字化建设与品牌营销贡献了 64% 的收入，可重点投入案例包装与追加服务。
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">满意度分布</h3>
          <div className="mt-4 space-y-3">
            {PERFORMANCE.satisfaction.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{item.label}</span>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-400/15 to-sky-400/15 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-200">
            满意度 ≥ 4.5 的客户复购率达到 41%，建议建立专属增值服务与证言营销。
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">财务预测</h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• 预测下季度收入 2.05M，重点来自定制开发与社媒代运营。</li>
            <li>• 毛利率保持在 46%，可通过资源池排班优化进一步提升。</li>
            <li>• 建议结合财务模块（finance-module）完成现金流与回款节奏分析。</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/70">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">策略建议</h3>
          <ul className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <li>• 高满意度客户优先引导续约 + 交叉销售法律合规或运营支持服务。</li>
            <li>• 低满意度客户（NPS &lt; 20）触发 CS 关怀工单，回溯交付体验。</li>
            <li>• 将服务表现数据同步至 CRM，驱动销售与市场制定目标。</li>
            <li>• 结合知识花园收益，探索套餐 + 内容订阅的商业模式。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceCenterAnalyticsPage;
