/**
 * 推荐结果列表组件
 */

import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIRecommendationResult } from '../../types';

const LEVEL_COLOR_MAP = {
  冲刺: 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800',
  匹配: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-800',
  保底: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800',
};

interface ResultsListProps {
  recommendations: AIRecommendationResult[];
  stats: { 冲刺: number; 匹配: number; 保底: number };
  expandedItems: Set<string>;
  selectedCount: number;
  onToggleExpand: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onAddToCandidates: (recommendations: AIRecommendationResult[]) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  recommendations,
  stats,
  expandedItems,
  selectedCount,
  onToggleExpand,
  onToggleSelect,
  onToggleSelectAll,
  onAddToCandidates,
}) => {
  const handleToggleSelect = (id: string) => {
    onToggleSelect(id);
  };

  const handleToggleSelectAll = () => {
    onToggleSelectAll();
  };

  const handleAddToCandidates = () => {
    const selected = recommendations.filter((r) => r.selected);
    if (selected.length === 0) {
      alert('请至少选择一个推荐项目');
      return;
    }
    onAddToCandidates(selected);
  };

  return (
    <div className="space-y-4">
      {/* 推荐统计 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center dark:border-rose-900/30 dark:bg-rose-900/20">
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.冲刺}</div>
          <div className="text-xs text-rose-600 dark:text-rose-400">冲刺</div>
        </div>
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center dark:border-indigo-900/30 dark:bg-indigo-900/20">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.匹配}</div>
          <div className="text-xs text-indigo-600 dark:text-indigo-400">匹配</div>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-900/30 dark:bg-emerald-900/20">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.保底}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400">保底</div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800/60">
        <button
          onClick={handleToggleSelectAll}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {selectedCount === recommendations.length ? '取消全选' : '全选'}
        </button>
        <button
          onClick={handleAddToCandidates}
          disabled={selectedCount === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          加入候选池({selectedCount}项)
        </button>
      </div>

      {/* 推荐列表 */}
      <div className="space-y-3">
        {(['冲刺', '匹配', '保底'] as const).map((level) => {
          const levelItems = recommendations.filter((item) => item.level === level);
          if (levelItems.length === 0) return null;

          return (
            <div key={level} className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {level}档位 ({levelItems.length}所)
              </h4>
              {levelItems.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-lg border p-4 transition ${
                    item.selected
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => handleToggleSelect(item.id)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{item.school}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.program}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR_MAP[item.level]}`}>
                            {item.level}
                          </span>
                          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            匹配度: {item.matchScore}分
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.matchReason}</div>

                      <button
                        onClick={() => onToggleExpand(item.id)}
                        className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {expandedItems.has(item.id) ? (
                          <>
                            <ChevronUp className="h-3 w-3" />
                            收起详情
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            展开详情
                          </>
                        )}
                      </button>

                      {expandedItems.has(item.id) && (
                        <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                          <div>
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300">推荐理由:</div>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.rationale}</div>
                          </div>
                          {item.requirements && item.requirements.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">需补充材料:</div>
                              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                                {item.requirements.map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {item.similarCases && item.similarCases.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">相似案例:</div>
                              <div className="mt-1 space-y-1">
                                {item.similarCases.map((caseItem) => (
                                  <div key={caseItem.id} className="text-sm text-gray-600 dark:text-gray-400">
                                    {caseItem.studentName} ({caseItem.admissionYear}) - {caseItem.gpa}, {caseItem.languageScores}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
