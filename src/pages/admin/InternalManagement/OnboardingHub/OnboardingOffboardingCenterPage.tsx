import { useMemo, useState } from 'react';

import { BarChart3, ClipboardList, FileText, LogIn, LogOut, Rocket } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import {
  DOCUMENT_ITEMS,
  OFFBOARDING_CASES,
  ONBOARDING_CASES,
  PROCESS_TEMPLATES,
  REPORT_METRICS,
  REPORT_RECORDS,
  TRIAL_REVIEWS,
} from './data';
import { DocumentCenter } from './components/DocumentCenter';
import { OffboardingBoard } from './components/OffboardingBoard';
import { OnboardingCaseBoard } from './components/OnboardingCaseBoard';
import { ReportCenter } from './components/ReportCenter';
import { TemplateBoard } from './components/TemplateBoard';
import { TrialReviewPanel } from './components/TrialReviewPanel';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'templates', label: '流程模板', description: '模板版本 · 适用范围', icon: ClipboardList },
  { key: 'onboarding', label: '入职执行', description: '日程协同 · Buddy 跟进', icon: LogIn },
  { key: 'trial', label: '试用期跟进', description: '目标进度 · 转正审批', icon: Rocket },
  { key: 'offboarding', label: '离职交接', description: '资产回收 · 风险控制', icon: LogOut },
  { key: 'documents', label: '资料签署', description: '合同文件 · 电子签名', icon: FileText },
  { key: 'reports', label: '统计报表', description: '效率指标 · 趋势洞察', icon: BarChart3 },
] as const;

export const OnboardingOffboardingCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('templates');

  const totalOnboarding = ONBOARDING_CASES.length;
  const upcomingOffboarding = OFFBOARDING_CASES.filter((item) => item.status !== '已完成').length;
  const pendingTrial = TRIAL_REVIEWS.filter((review) => review.status !== '已转正').length;

  const progressAverage = useMemo(() => {
    if (ONBOARDING_CASES.length === 0) return 0;
    return Math.round(ONBOARDING_CASES.reduce((sum, item) => sum + item.progress, 0) / ONBOARDING_CASES.length);
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">入职与离职中心</h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
              管理团队成员的入职、试用期、岗位调整与离职全流程，模板化流程协同 HR、部门主管、Buddy 与 IT、行政、财务等跨部门角色，确保体验与风控双达标。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <LogIn className="h-4 w-4 text-blue-500" />
              本周入职流程 {totalOnboarding} 单 · 平均完成 {progressAverage}%
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Rocket className="h-4 w-4 text-emerald-500" />
              待办理转正 {pendingTrial} 人
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <LogOut className="h-4 w-4 text-amber-500" />
              进行中离职 {upcomingOffboarding} 单
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[OnboardingOffboardingCenterPage] 发起入职流程')}
          >
            发起入职流程
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[OnboardingOffboardingCenterPage] 新建离职单')}
          >
            发起离职流程
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

      {activeTab === 'templates' ? <TemplateBoard templates={PROCESS_TEMPLATES} /> : null}

      {activeTab === 'onboarding' ? <OnboardingCaseBoard cases={ONBOARDING_CASES} /> : null}

      {activeTab === 'trial' ? <TrialReviewPanel reviews={TRIAL_REVIEWS} /> : null}

      {activeTab === 'offboarding' ? <OffboardingBoard cases={OFFBOARDING_CASES} /> : null}

      {activeTab === 'documents' ? <DocumentCenter documents={DOCUMENT_ITEMS} /> : null}

      {activeTab === 'reports' ? <ReportCenter metrics={REPORT_METRICS} records={REPORT_RECORDS} /> : null}
    </div>
  );
};


