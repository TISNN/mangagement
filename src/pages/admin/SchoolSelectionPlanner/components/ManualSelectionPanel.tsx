import { Filter, ArrowRight, Sparkles } from 'lucide-react';

import type { CandidateProgram, ManualFilterPreset, StudentProfile } from '../types';
import { CandidateBadge, ICON_COLOR_MAP, SectionHeader } from './shared';

interface ManualSelectionPanelProps {
  student: StudentProfile;
  studentId: string;
  presets: ManualFilterPreset[];
  candidates: CandidateProgram[];
  onCandidatesChange?: (candidates: CandidateProgram[]) => void;
}

const STAGE_ACCENT_MAP: Record<CandidateProgram['stage'], Parameters<typeof CandidateBadge>[0]['accent']> = {
  冲刺: 'rose',
  匹配: 'indigo',
  保底: 'emerald',
};

const STATUS_ACCENT_MAP: Record<CandidateProgram['status'], Parameters<typeof CandidateBadge>[0]['accent']> = {
  待讨论: 'amber',
  通过: 'emerald',
  淘汰: 'rose',
};

export const ManualSelectionPanel = ({ 
  student,
  studentId,
  presets, 
  candidates, 
  onCandidatesChange 
}: ManualSelectionPanelProps) => {
  // 打开AI推荐新标签页
  const handleOpenAIRecommendation = () => {
    const url = `/admin/school-selection-planner/ai-recommendation/${studentId}`;
    window.open(url, '_blank');
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="人工筛选工作台"
        description="结合筛选器与候选池，将院校项目分配到冲刺/匹配/保底策略中。"
        action={(
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenAIRecommendation}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <Sparkles className="h-4 w-4" />
              AI智能推荐
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Filter className="h-3.5 w-3.5" />
              保存筛选方案
            </button>
          </div>
        )}
      />


      <div className="grid gap-4 lg:grid-cols-3">
        {presets.map((preset) => (
          <div key={preset.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{preset.name}</div>
              <span className="text-xs text-gray-400">#{preset.id}</span>
            </div>
            <p className="mt-2 text-sm leading-5 text-gray-600 dark:text-gray-300">{preset.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {preset.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600 dark:bg-gray-700/60 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {candidates.map((candidate) => {
          const stageAccent = STAGE_ACCENT_MAP[candidate.stage];
          const statusAccent = STATUS_ACCENT_MAP[candidate.status];
          const sourceAccent = candidate.source === 'AI推荐' ? 'indigo' : 'cyan';

          return (
            <div
              key={candidate.id}
              className={`grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:bg-gray-800/60 lg:grid-cols-5 ${
                stageAccent === 'rose'
                  ? 'border-rose-100 hover:border-rose-200 dark:border-rose-900/30 dark:hover:border-rose-800/40'
                  : stageAccent === 'indigo'
                  ? 'border-indigo-100 hover:border-indigo-200 dark:border-indigo-900/30 dark:hover:border-indigo-800/40'
                  : 'border-emerald-100 hover:border-emerald-200 dark:border-emerald-900/30 dark:hover:border-emerald-800/40'
              }`}
            >
              <div className="lg:col-span-2">
                <div className="font-medium text-gray-900 dark:text-white">{candidate.school}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{candidate.program}</div>
              </div>
              <div className="flex items-center gap-2">
                <CandidateBadge value={candidate.source} accent={sourceAccent} />
                <CandidateBadge value={candidate.stage} accent={stageAccent} />
                <CandidateBadge value={candidate.status} accent={statusAccent} />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 lg:col-span-2">
                {candidate.notes}
                {candidate.source === 'AI推荐' && candidate.matchScore && (
                  <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    匹配度: {candidate.matchScore}分
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between lg:col-span-5">
                <div className="text-xs text-gray-500 dark:text-gray-400">负责人：{candidate.owner}</div>
                <div className="flex items-center gap-2">
                  {candidate.source === 'AI推荐' && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                      ✨ AI推荐
                    </span>
                  )}
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  查看详情
                  <ArrowRight className={`h-3.5 w-3.5 ${ICON_COLOR_MAP.indigo}`} />
                </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
