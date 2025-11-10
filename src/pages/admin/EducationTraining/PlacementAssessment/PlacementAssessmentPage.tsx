import { useMemo, useState } from 'react';

import { CalendarRange, ClipboardList, Download, Settings2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AnalyticsPanel } from './components/AnalyticsPanel';
import { AssessmentPlanBoard } from './components/AssessmentPlanBoard';
import { OpsAndIntegrationPanel } from './components/OpsAndIntegrationPanel';
import { PlacementGovernancePanel } from './components/PlacementGovernancePanel';
import { QuestionBankPanel } from './components/QuestionBankPanel';
import { SessionOperationsPanel } from './components/SessionOperationsPanel';
import {
  ASSESSMENT_PLANS,
  ASSESSMENT_SESSIONS,
  CAPACITY_SNAPSHOTS,
  INTEGRATION_TASKS,
  INTERVENTION_ALERTS,
  KPI_METRICS,
  PLACEMENT_RULES,
  QUESTION_BANK_CATEGORIES,
  QUESTION_BANK_GAPS,
  SCORE_INSIGHTS,
  SKILL_RADAR,
  TIMELINE_EVENTS,
} from './data';

const TABS = [
  {
    key: 'planning',
    label: '测评计划',
    description: '窗口、容量与执行节点总览',
  },
  {
    key: 'content',
    label: '题库资产',
    description: '题库覆盖与缺口管理',
  },
  {
    key: 'execution',
    label: '场次执行',
    description: '场次排期与资源调度',
  },
  {
    key: 'analysis',
    label: '成绩分析',
    description: '成绩趋势与能力雷达',
  },
  {
    key: 'operations',
    label: '运营治理',
    description: '分班规则、预警与集成任务',
  },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const PlacementAssessmentPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('planning');

  const summary = useMemo(() => {
    const totalCapacity = ASSESSMENT_PLANS.reduce((acc, cur) => acc + cur.capacity, 0);
    const totalBooked = ASSESSMENT_PLANS.reduce((acc, cur) => acc + cur.booked, 0);
    const utilization = totalCapacity === 0 ? 0 : Math.round((totalBooked / totalCapacity) * 100);

    return {
      plans: ASSESSMENT_PLANS.length,
      sessions: ASSESSMENT_SESSIONS.length,
      alerts: INTERVENTION_ALERTS.length,
      utilization,
    };
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">测评中心</h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Placement & Assessment</p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              统一规划入学测评、模考与分班策略，沉淀题库资产与干预机制，让教学与招生拥有共同语言。
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
              <ClipboardList className="h-4 w-4 text-blue-500" />
              {summary.plans} 个测评方案在管控
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
              <CalendarRange className="h-4 w-4 text-emerald-500" />
              {summary.sessions} 场即将执行的场次
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              容量利用率 {summary.utilization}%
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
              <Settings2 className="h-4 w-4 text-rose-500" />
              {summary.alerts} 个高优先级干预
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-900">
            <Download className="h-4 w-4" />
            导出测评规划
          </Button>
          <Button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            生成智能排期
          </Button>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto md:flex-row md:items-center md:gap-3 ${
                activeTab === tab.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
              }`}
            >
              <span className="font-semibold">{tab.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'planning' && <AssessmentPlanBoard plans={ASSESSMENT_PLANS} timeline={TIMELINE_EVENTS} />}

      {activeTab === 'content' && <QuestionBankPanel categories={QUESTION_BANK_CATEGORIES} gaps={QUESTION_BANK_GAPS} />}

      {activeTab === 'execution' && (
        <SessionOperationsPanel sessions={ASSESSMENT_SESSIONS} capacities={CAPACITY_SNAPSHOTS} />
      )}

      {activeTab === 'analysis' && <AnalyticsPanel scoreInsights={SCORE_INSIGHTS} skillRadar={SKILL_RADAR} />}

      {activeTab === 'operations' && (
        <div className="space-y-6">
          <PlacementGovernancePanel rules={PLACEMENT_RULES} alerts={INTERVENTION_ALERTS} />
          <OpsAndIntegrationPanel kpis={KPI_METRICS} tasks={INTEGRATION_TASKS} />
        </div>
      )}
    </div>
  );
};
