/**
 * AI推荐内容组件
 * 从Dialog中提取，用于独立页面
 */

import { useState } from 'react';
import * as React from 'react';
import { Loader2, CheckCircle2, ChevronDown, ChevronUp, Zap, Database } from 'lucide-react';
import type { StudentProfile, AIMatchCriteria, AIRecommendationResult, AIRecommendationMode, DeepSearchProgress } from '../../types';
import { ModeSelector } from './ModeSelector';
import { ConfigForm } from './ConfigForm';
import { DeepSearchProgressView } from './DeepSearchProgressView';
import { ResultsList } from './ResultsList';

interface AIRecommendationContentProps {
  student: StudentProfile;
  criteria: AIMatchCriteria;
  mode: AIRecommendationMode;
  step: 'config' | 'searching' | 'results';
  recommendations: AIRecommendationResult[];
  searchProgress: DeepSearchProgress | null;
  isGenerating: boolean;
  onModeChange: (mode: AIRecommendationMode) => void;
  onCriteriaChange: (criteria: AIMatchCriteria) => void;
  onGenerate: () => void;
  onAddToCandidates: (recommendations: AIRecommendationResult[]) => void;
}

export const AIRecommendationContent: React.FC<AIRecommendationContentProps> = ({
  student,
  criteria,
  mode,
  step,
  recommendations,
  searchProgress,
  isGenerating,
  onModeChange,
  onCriteriaChange,
  onGenerate,
  onAddToCandidates,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [localRecommendations, setLocalRecommendations] = useState<AIRecommendationResult[]>(recommendations);

  // 同步外部recommendations变化
  React.useEffect(() => {
    setLocalRecommendations(recommendations.map(r => ({ ...r, selected: r.selected || false })));
  }, [recommendations]);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleSelect = (id: string) => {
    setLocalRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const toggleSelectAll = () => {
    const allSelected = localRecommendations.every((item) => item.selected);
    setLocalRecommendations((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
  };

  const selectedCount = localRecommendations.filter((item) => item.selected).length;

  const stats = {
    冲刺: localRecommendations.filter((r) => r.level === '冲刺').length,
    匹配: localRecommendations.filter((r) => r.level === '匹配').length,
    保底: localRecommendations.filter((r) => r.level === '保底').length,
  };

  if (step === 'config') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">基于学生条件匹配推荐合适的学校/专业</h2>
          
          <ModeSelector mode={mode} onModeChange={onModeChange} criteria={criteria} onCriteriaChange={onCriteriaChange} />
          
          <ConfigForm 
            student={student}
            criteria={criteria}
            onCriteriaChange={onCriteriaChange}
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onGenerate}
            disabled={isGenerating || criteria.targetCountries.length === 0 || criteria.targetPrograms.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {mode === 'deep' ? '准备中...' : '生成中...'}
              </>
            ) : (
              <>
                {mode === 'deep' ? (
                  <>
                    <Database className="h-4 w-4" />
                    开始深度检索
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    开始快速推荐
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'searching' && searchProgress) {
    return <DeepSearchProgressView progress={searchProgress} />;
  }

  if (step === 'results') {
    return (
      <ResultsList
        recommendations={localRecommendations}
        stats={stats}
        expandedItems={expandedItems}
        selectedCount={selectedCount}
        onToggleExpand={toggleExpand}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onAddToCandidates={(selected) => {
          onAddToCandidates(selected);
        }}
      />
    );
  }

  return null;
};
