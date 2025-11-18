/**
 * 深度检索进度视图组件
 */

import { Loader2, CheckCircle2, Database } from 'lucide-react';
import type { DeepSearchProgress } from '../../types';

interface DeepSearchProgressViewProps {
  progress: DeepSearchProgress;
}

export const DeepSearchProgressView: React.FC<DeepSearchProgressViewProps> = ({ progress }) => {
  const stages = [
    { key: 'parsing', label: '解析条件', icon: '🔍', desc: '解析匹配条件' },
    { key: 'loading', label: '加载数据库', icon: '📚', desc: '加载项目数据库' },
    { key: 'initialFilter', label: '初步筛选', icon: '🔎', desc: '按条件初步筛选' },
    { key: 'conditionMatch', label: '条件匹配', icon: '✅', desc: '匹配申请条件' },
    { key: 'deepAnalysis', label: '深度分析', icon: '🧠', desc: '深度分析匹配度' },
    { key: 'scoring', label: 'AI评分', icon: '📊', desc: '计算匹配度分数' },
    { key: 'caseComparison', label: '案例对比', icon: '📖', desc: '对比历史案例' },
    { key: 'sorting', label: '排序整理', icon: '⭐', desc: '排序和整理结果' },
  ] as const;

  const stageKeys: DeepSearchProgress['stage'][] = [
    'parsing',
    'loading',
    'initialFilter',
    'conditionMatch',
    'deepAnalysis',
    'scoring',
    'caseComparison',
    'sorting',
  ];

  const currentStageIndex = stageKeys.indexOf(progress.stage);

  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* 标题 */}
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <Database className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">深度检索中...</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{progress.message}</p>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{progress.currentStep}</span>
            <span className="font-medium text-gray-900 dark:text-white">{progress.progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
        </div>

        {/* 阶段指示器（8阶段细化版） */}
        <div className="grid grid-cols-4 gap-2">
          {stages.map((stage, index) => {
            const isActive = index <= currentStageIndex;
            const isCurrent = progress.stage === stage.key;

            return (
              <div
                key={stage.key}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                    : isActive
                    ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30'
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40'
                }`}
              >
                <div className={`text-2xl ${isCurrent ? 'animate-pulse' : isActive ? '' : 'opacity-40'}`}>
                  {stage.icon}
                </div>
                <div
                  className={`text-xs font-medium ${
                    isCurrent
                      ? 'text-blue-600 dark:text-blue-400'
                      : isActive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-[10px] text-gray-400 dark:text-gray-500">{stage.desc}</div>
                {isCurrent && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />
                )}
                {isActive && !isCurrent && (
                  <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                )}
              </div>
            );
          })}
        </div>

        {/* 统计信息 */}
        {progress.totalCount && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {progress.totalCount.toLocaleString()}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">项目库总数</div>
              </div>
              {progress.filteredCount && (
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {progress.filteredCount.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">初步筛选</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {progress.matchedCount?.toLocaleString() || 0}
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">条件匹配</div>
              </div>
              {progress.analyzedCount && (
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {progress.analyzedCount.toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">深度分析</div>
                </div>
              )}
            </div>

            {/* 详细步骤信息 */}
            {progress.details && progress.details.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                <div className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">当前步骤详情:</div>
                <ul className="space-y-1">
                  {progress.details.map((detail, idx) => (
                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
