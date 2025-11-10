import { useMemo, useState } from 'react';

import { Clock4, LineChart, ListTree, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import { WORKFLOW_DEFINITIONS, WORKFLOW_INSIGHTS, WORKFLOW_TIMELINE } from './data';
import { WorkflowInsightsPanel } from './components/WorkflowInsightsPanel';
import { WorkflowSummaryGrid } from './components/WorkflowSummaryGrid';
import { WorkflowTimelineList } from './components/WorkflowTimelineList';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'summary', label: '流程概览', description: '版本状态 · 瓶颈节点', icon: ListTree },
  { key: 'insight', label: '优化洞察', description: '执行数据 · 改进计划', icon: Wand2 },
  { key: 'timeline', label: '执行追踪', description: '实时里程碑 · 风险提示', icon: Clock4 },
] as const;

export const ProcessCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  const onlineWorkflowCount = useMemo(
    () => WORKFLOW_DEFINITIONS.filter((workflow) => workflow.status === '启用').length,
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">流程中心</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              标准化招生、文书、教务与财务的执行流程，通过版本管理、数据洞察和风险追踪，持续迭代交付体验。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <ListTree className="h-4 w-4 text-blue-500" />
              已上线流程 {onlineWorkflowCount} 条
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <LineChart className="h-4 w-4 text-emerald-500" />
              本周优化建议 {WORKFLOW_INSIGHTS.length} 条
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Clock4 className="h-4 w-4 text-amber-500" />
              最新执行 {WORKFLOW_TIMELINE.length} 条
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[ProcessCenterPage] 新建流程')}
          >
            新建流程
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[ProcessCenterPage] 打开流程版本对比')}
          >
            版本对比
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

      {activeTab === 'summary' ? <WorkflowSummaryGrid workflows={WORKFLOW_DEFINITIONS} /> : null}

      {activeTab === 'insight' ? <WorkflowInsightsPanel insights={WORKFLOW_INSIGHTS} /> : null}

      {activeTab === 'timeline' ? <WorkflowTimelineList items={WORKFLOW_TIMELINE} /> : null}
    </div>
  );
};

