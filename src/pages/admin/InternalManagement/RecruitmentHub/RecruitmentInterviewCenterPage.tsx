import { useMemo, useState } from 'react';

import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Sparkles,
  Users2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import {
  CANDIDATE_PIPELINE,
  CANDIDATE_PROFILES,
  INTERVIEW_SCHEDULE,
  OFFER_DECISIONS,
  POSITION_SUMMARIES,
  REPORT_INSIGHTS,
  REPORT_METRICS,
} from './data';
import { CandidateListTable } from './components/CandidateListTable';
import { CandidatePipelineBoard } from './components/CandidatePipelineBoard';
import { CandidateProfilePanel } from './components/CandidateProfilePanel';
import { DecisionCenter } from './components/DecisionCenter';
import { InterviewSchedulePanel } from './components/InterviewSchedulePanel';
import { PositionOverview } from './components/PositionOverview';
import { RecruitingReportsPanel } from './components/RecruitingReportsPanel';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'positions', label: '职位需求', description: '预算编制 · 进度跟踪', icon: Briefcase },
  { key: 'candidate-list', label: '候选人库', description: '简历信息 · 联系方式', icon: Users2 },
  { key: 'pipeline', label: '候选人管道', description: '来源渠道 · 阶段推进', icon: LayoutDashboard },
  { key: 'interviews', label: '面试排期', description: '日程同步 · 面试官分配', icon: CalendarDays },
  { key: 'decisions', label: '决策与 Offer', description: '反馈汇总 · 审批流程', icon: ClipboardList },
  { key: 'reports', label: '报表洞察', description: '招聘漏斗 · 渠道分析', icon: BarChart3 },
] as const;

export const RecruitmentInterviewCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('positions');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const openPositions = useMemo(
    () => POSITION_SUMMARIES.filter((position) => position.status === '开放中').length,
    []
  );

  const upcomingInterviews = useMemo(
    () => INTERVIEW_SCHEDULE.filter((interview) => interview.status === '待开始').length,
    []
  );

  const offerReady = useMemo(
    () => OFFER_DECISIONS.filter((decision) => decision.recommendation === '录用').length,
    []
  );

  const selectedCandidate = useMemo(
    () => CANDIDATE_PROFILES.find((candidate) => candidate.id === selectedCandidateId) ?? null,
    [selectedCandidateId],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">招聘与面试中心</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
              统一管理职位需求、候选人面试与 Offer 流程，协同 HR 与用人部门快速推进招聘目标，并与入职流程无缝衔接。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Briefcase className="h-4 w-4 text-blue-500" />
              开放职位 {openPositions} 个
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              待进行面试 {upcomingInterviews} 场
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Sparkles className="h-4 w-4 text-amber-500" />
              待发 Offer {offerReady} 位候选人
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[RecruitmentInterviewCenterPage] 创建职位需求')}
          >
            <LayoutDashboard className="h-4 w-4" />
            创建职位需求
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[RecruitmentInterviewCenterPage] 导出招聘月报')}
          >
            导出月报
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto md:flex-row md:items-center md:gap-3 ${
                activeTab === tab.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'positions' ? <PositionOverview positions={POSITION_SUMMARIES} /> : null}

      {activeTab === 'candidate-list' ? (
        <div className="space-y-4">
          <CandidateListTable candidates={CANDIDATE_PROFILES} onSelect={setSelectedCandidateId} />
          <CandidateProfilePanel candidate={selectedCandidate} onClose={() => setSelectedCandidateId(null)} />
        </div>
      ) : null}

      {activeTab === 'pipeline' ? <CandidatePipelineBoard pipeline={CANDIDATE_PIPELINE} /> : null}

      {activeTab === 'interviews' ? <InterviewSchedulePanel schedule={INTERVIEW_SCHEDULE} /> : null}

      {activeTab === 'decisions' ? <DecisionCenter decisions={OFFER_DECISIONS} /> : null}

      {activeTab === 'reports' ? (
        <RecruitingReportsPanel metrics={REPORT_METRICS} insights={REPORT_INSIGHTS} />
      ) : null}
    </div>
  );
};


