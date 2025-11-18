/**
 * 价值模型组件
 * 展示 RFM 模型、CLV 预测和价值象限
 */

import React, { useState } from 'react';
import { BarChart3, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { VALUE_QUADRANTS } from '../constants';

interface ValueModelsProps {
  onViewConfig?: () => void;
}

const ValueModels: React.FC<ValueModelsProps> = ({ onViewConfig }) => {
  const [isRFMExpanded, setIsRFMExpanded] = useState(true);
  const [isQuadrantsExpanded, setIsQuadrantsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      {/* RFM 汇总和预测指标 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">价值模型与象限</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">结合 RFM / CLV 算法，定位客户价值与风险</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsRFMExpanded(!isRFMExpanded)}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
            >
              {isRFMExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {isRFMExpanded ? '收起' : '展开'}
            </button>
            <button
              onClick={onViewConfig}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
            >
              <BarChart3 className="h-3.5 w-3.5" /> 查看模型配置
            </button>
          </div>
        </div>

        {isRFMExpanded && (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">RFM 汇总</div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Recency', value: '4.3', note: '平均 9 天' },
                    { label: 'Frequency', value: '3.8', note: '季度互动 6 次' },
                    { label: 'Monetary', value: '4.1', note: '平均贡献 22.6w' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-white/60 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                    >
                      <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{item.value}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
                      <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">预测指标</div>
                <ul className="mt-2 space-y-1 leading-5">
                  <li>• 续约成功率预测：72%（同比 +6pt）</li>
                  <li>• 追加购买概率：34%（主要集中在高潜力象限）</li>
                  <li>• 投诉发生率：3.2%（已纳入风险象限监控）</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">价值象限</span>
                <button
                  onClick={() => setIsQuadrantsExpanded(!isQuadrantsExpanded)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isQuadrantsExpanded ? '收起' : '展开'}
                </button>
              </div>
              {isQuadrantsExpanded &&
                VALUE_QUADRANTS.map((quadrant) => (
                  <div key={quadrant.id} className={`rounded-xl border p-4 shadow-sm ${quadrant.accent}`}>
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{quadrant.title}</span>
                      <span>{quadrant.ratio}</span>
                    </div>
                    <p className="mt-2 text-xs leading-5">{quadrant.description}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/60 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:border-white/20 dark:bg-white/10 dark:text-white/80">
                      <Sparkles className="h-3 w-3" /> {quadrant.highlight}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueModels;

