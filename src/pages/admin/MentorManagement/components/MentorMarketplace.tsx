import {
  ArrowLeft,
  Building2,
  CalendarClock,
  ClipboardList,
  FileSignature,
  Globe2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

import { MentorRoster } from './MentorRoster';
import { FilterBar } from './FilterBar';
import type { MentorRecord } from '../types';

interface MentorMarketplaceProps {
  mentors: MentorRecord[];
  selectedMarketIds: Set<string>;
  onToggleCandidate: (mentorId: string) => void;
  onViewDetail: (mentorId: string) => void;
  onBack: () => void;
  search: string;
  setSearch: (value: string) => void;
}

export const MentorMarketplace = ({
  mentors,
  selectedMarketIds,
  onToggleCandidate,
  onViewDetail,
  onBack,
  search,
  setSearch,
}: MentorMarketplaceProps) => {
  const totalMentors = mentors.length;
  const languages = Array.from(new Set(mentors.flatMap((mentor) => mentor.languages))).slice(0, 4);
  const timezones = Array.from(new Set(mentors.map((mentor) => mentor.timezone))).slice(0, 4);
  const tags = Array.from(
    new Set(
      mentors
        .flatMap((mentor) => mentor.tags)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 6);

  const cooperationSteps = [
    {
      title: '提交合作需求',
      description: '从候选导师列表勾选目标导师，填写项目类型、服务阶段与学生画像，系统自动生成合作请求。',
      icon: ClipboardList,
    },
    {
      title: '排期与匹配',
      description: '运营根据导师时区与排班空档发起排期邀请，可一键同步到内部排班表和 SkyOffice 会议室。',
      icon: CalendarClock,
    },
    {
      title: '签署合约',
      description: '确认合作条款后，通过电子合同模板生成《外部导师合作协议》，支持在线签名与版本留存。',
      icon: FileSignature,
    },
    {
      title: '启动交付',
      description: '合同生效后，自动创建交付任务与沟通群组，沉淀面谈纪要、交付里程碑与绩效反馈。',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white shadow-md">
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              返回导师管理中心
            </button>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest">
              Mentor Marketplace
            </p>
            <h2 className="text-2xl font-bold leading-tight lg:text-3xl">全球导师人才库</h2>
            <p className="max-w-2xl text-sm text-white/80">
              精选海内外导师资源，支持多语言、多专业背景，一键加入合作候选，随时发起合约，助力弹性排班与跨学科辅导。
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs font-semibold text-white/90">
            <Users className="h-4 w-4" />
            已加入候选：{selectedMarketIds.size}
          </span>
        </div>
      </section>

      <section className="-mt-4 space-y-8">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-gray-700 shadow-sm shadow-indigo-50 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-gray-100">
            <p className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-300">导师库规模</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">{totalMentors}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">位专家导师</span>
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-gray-700 shadow-sm shadow-indigo-50 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-gray-100">
            <p className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-300">覆盖语言</p>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              {languages.length > 0 ? languages.join(' · ') : '暂未录入语言信息'}
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-gray-700 shadow-sm shadow-indigo-50 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-gray-100">
            <p className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-300">支持时区</p>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              {timezones.length > 0 ? timezones.join(' / ') : '待补充'}
            </div>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-gray-700 shadow-sm shadow-indigo-50 dark:border-indigo-500/40 dark:bg-slate-900 dark:text-gray-100">
            <p className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-300">热门标签</p>
            <div className="mt-2 text-sm text-gray-700 dark:text-gray-200">
              {tags.length > 0 ? tags.join(' · ') : '暂无热门标签'}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <FilterBar search={search} setSearch={setSearch} />
        </div>

        <div className="mx-auto max-w-6xl rounded-3xl border border-indigo-100 bg-white px-6 py-5 shadow-sm shadow-indigo-100 dark:border-indigo-500/40 dark:bg-slate-900">
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

        <div className="mx-auto max-w-6xl space-y-8">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-indigo-100 dark:border-gray-700/60 dark:bg-gray-900">
            <MentorRoster
              mentors={mentors}
              selectedIds={selectedMarketIds}
              onToggleSelect={onToggleCandidate}
              selectLabel="加入合作候选"
              className="grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
              onViewDetail={onViewDetail}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => (
              <div
                key={`${mentor.id}-summary`}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-800/70"
              >
                <div className="flex items-center gap-3">
                  <img src={mentor.avatar} alt={mentor.name} className="h-10 w-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{mentor.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">主职：{mentor.primaryRole}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <Globe2 className="h-3.5 w-3.5" /> 时区 {mentor.timezone}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-gray-600 dark:bg-gray-700/70 dark:text-gray-300">
                    <Building2 className="h-3.5 w-3.5" /> 经验 {mentor.experienceYears ?? 0} 年
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200">
                    <Users className="h-3.5 w-3.5" /> 当前服务学生：{mentor.studentsCount ?? 0}
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
        </div>
      </section>

      <section className="space-y-6">
        <div className="mx-auto max-w-6xl grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-indigo-100 bg-white px-8 py-8 shadow-sm shadow-indigo-100 dark:border-indigo-500/40 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">合作流程</h3>
              <span className="text-xs font-medium text-indigo-500 dark:text-indigo-300">平均周期约 5-7 个工作日</span>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {cooperationSteps.map((step) => (
                <div
                  key={step.title}
                  className="flex gap-3 rounded-2xl border border-gray-100 bg-white/70 p-4 shadow-[0_8px_24px_rgba(79,70,229,0.08)] dark:border-gray-700/50 dark:bg-gray-800/70"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</p>
                    <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 px-6 py-6 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100">
            <div>
              <h4 className="text-sm font-semibold">签约提醒</h4>
              <p className="mt-1 text-xs leading-relaxed">
                合作前请确认导师已完成身份认证与保密协议，避免涉及学生敏感信息时出现合规风险。
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">排期建议</h4>
              <p className="mt-1 text-xs leading-relaxed">
                时区相差超过 8 小时时，系统会推荐异步交付模式，可结合录屏、文档批注等形式推进。
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">绩效反馈</h4>
              <p className="mt-1 text-xs leading-relaxed">
                交付结束后可在导师详情页提交满意度与复用建议，形成外部导师库的信用权重。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
