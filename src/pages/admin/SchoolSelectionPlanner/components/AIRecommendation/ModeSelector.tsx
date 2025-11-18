/**
 * 推荐模式选择组件
 */

import { Zap, Database } from 'lucide-react';
import type { AIMatchCriteria, AIRecommendationMode } from '../../types';

interface ModeSelectorProps {
  mode: AIRecommendationMode;
  onModeChange: (mode: AIRecommendationMode) => void;
  criteria: AIMatchCriteria;
  onCriteriaChange: (criteria: AIMatchCriteria) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange, criteria, onCriteriaChange }) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">🔍 推荐模式</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            onModeChange('quick');
            onCriteriaChange({ ...criteria, mode: 'quick' });
          }}
          className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
            mode === 'quick'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                mode === 'quick'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">快速推荐</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Quick Match</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            基于条件快速匹配，推荐时间约 2-3 秒，适合快速查看初步推荐结果
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>⚡ 快速</span>
            <span>•</span>
            <span>📊 约 20-30 项</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onModeChange('deep');
            onCriteriaChange({ ...criteria, mode: 'deep' });
          }}
          className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
            mode === 'deep'
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-gray-500'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                mode === 'deep'
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">深度检索</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Deep Search</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            查阅全量项目库进行筛选，推荐时间约 8-12 秒，提供更全面的匹配结果
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>🔬 全面</span>
            <span>•</span>
            <span>📚 全库检索</span>
          </div>
        </button>
      </div>
    </div>
  );
};
