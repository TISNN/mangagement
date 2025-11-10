import { Building2, Globe2, Sparkles } from 'lucide-react';

import { MentorRoster } from './MentorRoster';
import type { MentorRecord } from '../types';

interface MentorMarketplaceProps {
  mentors: MentorRecord[];
  selectedMarketIds: Set<string>;
  onToggleCandidate: (mentorId: string) => void;
  onViewDetail: (mentorId: string) => void;
}

export const MentorMarketplace = ({ mentors, selectedMarketIds, onToggleCandidate, onViewDetail }: MentorMarketplaceProps) => {
  return (
    <div className="max-h-[92vh] overflow-y-auto bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 p-12 text-white">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest">Mentor Marketplace</p>
            <h2 className="text-3xl font-bold leading-tight lg:text-4xl">全球导师人才库</h2>
            <p className="max-w-2xl text-sm text-white/80">
              精选海内外导师资源，支持多语言、多专业背景，一键加入合作候选，随时发起合约。
            </p>
          </div>
        </div>
      </section>

      <section className="-mt-4 space-y-10 px-14 pb-16">
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-white px-8 py-5 shadow-md dark:border-indigo-500/40 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>AI 会结合导师经验、时区及语言自动推荐最适合的 3 位导师</span>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-indigo-700">
              智能匹配导师
            </button>
          </div>
        </div>

        <MentorRoster
          mentors={mentors}
          selectedIds={selectedMarketIds}
          onToggleSelect={onToggleCandidate}
          selectLabel="加入合作候选"
          className="lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
          onViewDetail={onViewDetail}
        />

        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-10 py-10 text-center text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400">
          合作流程占位：支持一键发起合约、签署保密协议、同步排班。
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mentors.map((mentor) => (
            <div key={`${mentor.id}-summary`} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/70">
              <div className="flex items-center gap-3">
                <img src={mentor.avatar} alt={mentor.name} className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{mentor.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">主职：{mentor.primaryRole}</p>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                  <Globe2 className="h-3.5 w-3.5" /> 时区 {mentor.timezone}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700/70 dark:text-gray-300">
                  <Building2 className="h-3.5 w-3.5" /> 经验 {mentor.experienceYears ?? 0} 年
                </span>
                <p>语言：{mentor.languages.join(' / ')}</p>
                <p>专长标签：{mentor.tags.join(' / ')}</p>
              </div>
              <button
                onClick={() => onViewDetail(mentor.id)}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 px-3 py-2 text-xs font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
              >
                查看详情
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
