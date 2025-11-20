import { useState, useMemo } from 'react';
import { Filter, ArrowRight, Sparkles, Search, X, ChevronDown } from 'lucide-react';

import type { CandidateProgram, ManualFilterPreset, StudentProfile } from '../types';
import { CandidateBadge, ICON_COLOR_MAP, SectionHeader } from './shared';
import { CandidateDetailPanel } from './CandidateDetailPanel';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState<CandidateProgram['stage'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<CandidateProgram['status'] | 'all'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'AI推荐' | '人工添加'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProgram | null>(null);

  // 打开AI推荐新标签页
  const handleOpenAIRecommendation = () => {
    const url = `/admin/school-selection-planner/ai-recommendation/${studentId}`;
    window.open(url, '_blank');
  };

  // 筛选和搜索候选项目
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          candidate.school.toLowerCase().includes(query) ||
          candidate.program.toLowerCase().includes(query) ||
          candidate.notes.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      // 阶段过滤
      if (filterStage !== 'all' && candidate.stage !== filterStage) return false;
      // 状态过滤
      if (filterStatus !== 'all' && candidate.status !== filterStatus) return false;
      // 来源过滤
      if (filterSource !== 'all' && candidate.source !== filterSource) return false;
      return true;
    });
  }, [candidates, searchQuery, filterStage, filterStatus, filterSource]);

  // 统计信息
  const stats = useMemo(() => {
    const total = candidates.length;
    const sprint = candidates.filter(c => c.stage === '冲刺').length;
    const match = candidates.filter(c => c.stage === '匹配').length;
    const safety = candidates.filter(c => c.stage === '保底').length;
    const aiRecommended = candidates.filter(c => c.source === 'AI推荐').length;
    const passed = candidates.filter(c => c.status === '通过').length;
    return { total, sprint, match, safety, aiRecommended, passed };
  }, [candidates]);

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

      {/* 统计信息和筛选栏 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        {/* 统计信息 */}
        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">总项目</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{stats.sprint}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">冲刺</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{stats.match}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">匹配</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.safety}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">保底</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.aiRecommended}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">AI推荐</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.passed}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">已通过</div>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="space-y-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索学校、项目或备注..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-10 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 筛选按钮 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">筛选：</span>
            
            {/* 阶段筛选 */}
            <div className="relative">
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value as CandidateProgram['stage'] | 'all')}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-500"
              >
                <option value="all">全部阶段</option>
                <option value="冲刺">冲刺</option>
                <option value="匹配">匹配</option>
                <option value="保底">保底</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* 状态筛选 */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as CandidateProgram['status'] | 'all')}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-500"
              >
                <option value="all">全部状态</option>
                <option value="待讨论">待讨论</option>
                <option value="通过">通过</option>
                <option value="淘汰">淘汰</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* 来源筛选 */}
            <div className="relative">
              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value as 'all' | 'AI推荐' | '人工添加')}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-xs text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-500"
              >
                <option value="all">全部来源</option>
                <option value="AI推荐">AI推荐</option>
                <option value="人工添加">人工添加</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            {/* 清除筛选 */}
            {(searchQuery || filterStage !== 'all' || filterStatus !== 'all' || filterSource !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStage('all');
                  setFilterStatus('all');
                  setFilterSource('all');
                }}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                清除筛选
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 候选项目列表 */}
      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
            <Filter className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600" />
            <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              {candidates.length === 0 ? '暂无候选项目' : '未找到匹配的项目'}
            </p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              {candidates.length === 0 ? '点击"AI智能推荐"开始添加项目' : '请尝试调整搜索条件或筛选选项'}
            </p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => {
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
                <button 
                  onClick={() => setSelectedCandidate(candidate)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                >
                  查看详情
                  <ArrowRight className={`h-3.5 w-3.5 ${ICON_COLOR_MAP.indigo}`} />
                </button>
                </div>
              </div>
            </div>
          );
        })
        )}
      </div>

      {/* 详情面板 */}
      {selectedCandidate && (
        <CandidateDetailPanel
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={(updated) => {
            if (onCandidatesChange) {
              const updatedCandidates = candidates.map(c =>
                c.id === updated.id ? updated : c
              );
              onCandidatesChange(updatedCandidates);
            }
            setSelectedCandidate(null);
          }}
        />
      )}
    </section>
  );
};
