import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ArrowRight, ClipboardCheck, LayoutList, Sparkles } from 'lucide-react';

import { Button } from '../../../components/ui/button';

import LeadOverviewTab from './components/LeadOverviewTab';
import LeadTableTab from './components/LeadTableTab';
import LeadInsightsTab from './components/LeadInsightsTab';
import CreateLeadDialog from './components/CreateLeadDialog';
import {
  ACTION_GROUPS,
  CHANNEL_PERFORMANCE,
  CHANNEL_SHARE,
  ENGAGEMENT_TIMELINE,
  FUNNEL_STAGES,
  HOT_LEADS,
  KPI_METRICS,
  LEADS_DATA,
  QUALITY_CHECKS,
  QUICK_FILTERS,
  SAVED_VIEWS,
  SLA_OVERVIEW,
  STATUS_METRICS,
  TASK_LIST,
  TEMPLATE_SNIPPETS,
  TREND_SUMMARY,
} from './data';
import type { LeadFormValues, LeadRecord, LeadSection, LeadTableViewMode } from './types';

const PAGE_SECTIONS: Array<{ id: LeadSection; label: string; description: string; icon: ReactNode }> = [
  { id: 'overview', label: '线索概览', description: '关键指标与快捷筛选', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'table', label: '线索列表', description: '表格/看板双模式管理线索', icon: <LayoutList className="h-4 w-4" /> },
  { id: 'insights', label: '跟进洞察', description: '单条线索与 SLA 视图', icon: <Activity className="h-4 w-4" /> },
];

const formatNowForTimeline = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${date} ${hours}:${minutes} 表单创建`;
};

const CRMLeadListPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<LeadSection>('overview');
  const [leadRows, setLeadRows] = useState<LeadRecord[]>(LEADS_DATA);
  const [syncedLeads, setSyncedLeads] = useState<Record<string, { studentId: string }>>({});
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [tableViewMode, setTableViewMode] = useState<LeadTableViewMode>('table');
  const clearTimerRef = useRef<number | null>(null);

  const funnelTotals = useMemo(() => {
    const head = FUNNEL_STAGES[0]?.count ?? 0;
    const tail = FUNNEL_STAGES[FUNNEL_STAGES.length - 1]?.count ?? 0;
    const overallConversion = head === 0 ? 0 : Math.round((tail / head) * 1000) / 10;
    return {
      totalLeads: head,
      signedDeals: tail,
      overallConversion,
    };
  }, []);

  const channelTotal = useMemo(() => CHANNEL_SHARE.reduce((acc, channel) => acc + channel.percentage, 0), []);
  const totalTasks = useMemo(() => TASK_LIST.length, []);
  const overdueTasks = useMemo(() => TASK_LIST.filter((task) => task.status === 'warning').length, []);

  const handleCreateStudent = (lead: LeadRecord) => {
    const studentId = `STU-${lead.id.slice(-3).toUpperCase()}`;
    setSyncedLeads((prev) => ({
      ...prev,
      [lead.id]: { studentId },
    }));
    setLastSyncMessage(`已为线索「${lead.name}」生成学生档案 ${studentId}，请到学生管理中心补充细节。`);
  };

  useEffect(() => {
    if (!lastSyncMessage) return;
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
    }
    clearTimerRef.current = window.setTimeout(() => {
      setLastSyncMessage(null);
      clearTimerRef.current = null;
    }, 4200);

    return () => {
      if (clearTimerRef.current) {
        window.clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
    };
  }, [lastSyncMessage]);

  const handleCreateLeadSubmit = (values: LeadFormValues) => {
    const trimmedName = values.name.trim() || '新线索';
    const tags = values.tags
      .split(/[,，\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    const newLead: LeadRecord = {
      id: `lead-${Date.now()}`,
      name: trimmedName,
      project: values.project.trim() || '待确认项目',
      stage: values.stage,
      owner: values.owner.trim() || '待分配',
      score: Math.max(0, Math.min(100, Number(values.score) || 0)),
      channel: values.channel.trim() || '其他渠道',
      campaign: values.campaign.trim() || undefined,
      tags: tags.length ? tags : ['待整理'],
      lastTouch: formatNowForTimeline(),
      nextAction: values.nextAction.trim() || '请在 24 小时内完成首次跟进。',
      risk: values.stage === '新增' ? undefined : '需关注',
    };

    setLeadRows((prev) => [newLead, ...prev]);
    setLastSyncMessage(`已创建线索「${trimmedName}」，请及时安排负责人跟进。`);
    setActiveSection('table');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">线索列表</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lead List & Detail · CRM Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            通过高级筛选、视图管理与批量操作高效推进线索，详情页整合沟通记录、任务与 SLA，实现销售与市场协同。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <ClipboardCheck className="h-4 w-4" />
            批量导入
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            创建线索
          </Button>
        </div>
      </div>

      {lastSyncMessage && (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 p-4 text-sm text-indigo-700 shadow-sm transition dark:border-indigo-500/30 dark:bg-indigo-900/20 dark:text-indigo-200">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-300" />
              <p>{lastSyncMessage}</p>
            </div>
            <a
              href="/admin/students"
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/40 dark:text-indigo-200 dark:hover:border-indigo-400"
            >
              <ArrowRight className="h-3 w-3" />
              查看学生档案
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap gap-2">
          {PAGE_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
            <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`group flex min-w-[180px] flex-col rounded-xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-indigo-500 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200'
                }`}
              >
                <span className={`flex items-center gap-2 text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {section.icon}
                  {section.label}
              </span>
                <span className={`mt-1 text-xs ${isActive ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>{section.description}</span>
            </button>
            );
          })}
        </div>
      </div>

      {activeSection === 'overview' && (
        <LeadOverviewTab
          kpiMetrics={KPI_METRICS}
          quickFilters={QUICK_FILTERS}
          savedViews={SAVED_VIEWS}
          funnelStages={FUNNEL_STAGES}
          funnelTotals={funnelTotals}
          trendSummary={TREND_SUMMARY}
          channelPerformance={CHANNEL_PERFORMANCE}
          hotLeads={HOT_LEADS}
          actionGroups={ACTION_GROUPS}
          slaOverview={SLA_OVERVIEW}
        />
                    )}

      {activeSection === 'table' && (
        <LeadTableTab
          quickFilters={QUICK_FILTERS}
          leads={leadRows}
          syncedLeads={syncedLeads}
          onCreateStudent={handleCreateStudent}
          viewMode={tableViewMode}
          onChangeView={setTableViewMode}
        />
      )}

      {activeSection === 'insights' && (
        <LeadInsightsTab
          statusMetrics={STATUS_METRICS}
          channelShare={CHANNEL_SHARE}
          channelTotal={channelTotal}
          engagementTimeline={ENGAGEMENT_TIMELINE}
          taskList={TASK_LIST}
          totalTasks={totalTasks}
          overdueTasks={overdueTasks}
          templateSnippets={TEMPLATE_SNIPPETS}
          qualityChecks={QUALITY_CHECKS}
        />
      )}

      <CreateLeadDialog open={isCreateOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateLeadSubmit} />
    </div>
  );
};

export default CRMLeadListPage;
