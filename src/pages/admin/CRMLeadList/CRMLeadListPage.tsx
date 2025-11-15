import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ArrowRight, ClipboardCheck, LayoutList, NotebookPen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../../../components/ui/button';
import { leadService, mentorService, serviceTypeService } from '../../../services';
import type { Lead, LeadPriority, LeadStatus } from '../../../types/lead';
import type { ServiceType } from '../../../services/serviceTypeService';
import type { Mentor } from '../../../services/mentorService';

import LeadOverviewTab from './components/LeadOverviewTab';
import LeadTableTab from './components/LeadTableTab';
import LeadInsightsTab from './components/LeadInsightsTab';
import CreateLeadDialog from './components/CreateLeadDialog';
import {
  ACTION_GROUPS,
  CHANNEL_PERFORMANCE,
  CHANNEL_SHARE,
  ENGAGEMENT_TIMELINE,
  KPI_METRICS,
  QUALITY_CHECKS,
  SAVED_VIEWS,
  SLA_OVERVIEW,
  STATUS_METRICS,
  TASK_LIST,
  TREND_SUMMARY,
} from './data';
import type { HotLead, LeadFormValues, LeadRecord, LeadSection, LeadStage, LeadTableViewMode, QuickFilter } from './types';

const PAGE_SECTIONS: Array<{ id: LeadSection; label: string; description: string; icon: ReactNode }> = [
  { id: 'overview', label: '线索概览', description: '关键指标与快捷筛选', icon: <Sparkles className="h-4 w-4" /> },
  { id: 'table', label: '线索列表', description: '表格/看板双模式管理线索', icon: <LayoutList className="h-4 w-4" /> },
  { id: 'insights', label: '跟进洞察', description: '单条线索与 SLA 视图', icon: <Activity className="h-4 w-4" /> },
];

type LeadAnalytics = {
  createdAt?: string;
  lastContact?: string;
  daysSinceLastContact: number;
  status: LeadStatus;
  priority: LeadPriority;
  assigned: boolean;
};

const stageMapping: Record<LeadStatus, LeadStage> = {
  new: '新增',
  contacted: '初次沟通',
  qualified: '深度沟通',
  converted: '签约',
  closed: '合同拟定',
};

const stageToStatusMap: Record<LeadStage, LeadStatus> = {
  新增: 'new',
  初次沟通: 'contacted',
  深度沟通: 'qualified',
  合同拟定: 'qualified',
  签约: 'converted',
};

const stagePriorityMap: Record<LeadStage, LeadPriority> = {
  新增: 'medium',
  初次沟通: 'medium',
  深度沟通: 'high',
  合同拟定: 'high',
  签约: 'high',
};

const priorityLabelMap: Record<LeadPriority, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const channelAccentPalette: string[] = [
  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300',
];

const funnelStageDefinitions: Array<{ id: string; stage: LeadStage; name: string; avgDuration: string }> = [
  { id: 'stage-new', stage: '新增', name: '新增线索', avgDuration: '—' },
  { id: 'stage-contact', stage: '初次沟通', name: '初次沟通', avgDuration: '16h' },
  { id: 'stage-deep', stage: '深度沟通', name: '深度沟通', avgDuration: '2.8d' },
  { id: 'stage-contract', stage: '合同拟定', name: '合同拟定', avgDuration: '4.1d' },
  { id: 'stage-sign', stage: '签约', name: '签约&收款', avgDuration: '6.4d' },
];

const riskReminderMap: Record<string, LeadRecord['risk']> = {
  high: '高风险',
  medium_high: '需关注',
  needs_attention: '需关注',
  medium: '需关注',
  low: undefined,
};

const formatDateTime = (isoString?: string | null) => {
  if (!isoString) return '暂无跟进记录';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  const datePart = date.toLocaleDateString('zh-CN');
  const timePart = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePart} ${timePart}`;
};

const calculateDaysSince = (isoString?: string | null) => {
  if (!isoString) return Number.POSITIVE_INFINITY;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return Number.POSITIVE_INFINITY;
  }
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const resolveRisk = (daysSinceLastContact: number, priority: LeadPriority, status: LeadStatus): LeadRecord['risk'] => {
  if (status === 'converted' || status === 'closed') {
    return undefined;
  }
  if (!Number.isFinite(daysSinceLastContact)) {
    return priority === 'high' ? '需关注' : undefined;
  }
  if (daysSinceLastContact >= 14) {
    return '高风险';
  }
  if (daysSinceLastContact >= 7 || priority === 'high') {
    return '需关注';
  }
  return undefined;
};

interface TransformResult {
  record: LeadRecord;
  meta: LeadAnalytics;
}

const transformLead = (
  lead: Lead,
  serviceTypeNameById: Map<number, string>,
  mentorNameById: Map<number, string>,
): TransformResult => {
  const interestId = Number.isFinite(Number(lead.interest)) ? Number(lead.interest) : NaN;
  const serviceTypeName = Number.isFinite(interestId) ? serviceTypeNameById.get(Number(interestId)) : undefined;
  const ownerId = Number.isFinite(Number(lead.assignedTo)) ? Number(lead.assignedTo) : NaN;
  const ownerName = Number.isFinite(ownerId) ? mentorNameById.get(ownerId) ?? `顾问 ${ownerId}` : '待分配';
  const daysSinceLastContact = calculateDaysSince(lead.lastContact);
  const stage = stageMapping[lead.status] ?? '新增';
  const inferredRisk = resolveRisk(daysSinceLastContact, lead.priority, lead.status);
  const risk = lead.riskLevel ? riskReminderMap[lead.riskLevel] ?? inferredRisk : inferredRisk;
  const sourceTag = lead.source || '其他渠道';
  const notes = lead.notes?.trim() ?? '';
  const nextAction = lead.nextAction?.trim() ?? '';
  const campaignName = lead.campaign?.trim() || undefined;
  const noteTags = notes
    ? notes
        .split(/[,，|｜；;、\n]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item.length <= 16)
        .slice(0, 3)
    : [];

  const projectName = serviceTypeName || noteTags[0] || campaignName || '待确认项目';

  const record: LeadRecord = {
    id: lead.id,
    name: lead.name || '未命名线索',
    avatar: lead.avatar,
    project: projectName,
    stage,
    owner: ownerName,
    priority: lead.priority,
    channel: lead.source || '其他渠道',
    campaign: campaignName,
    lastTouch: formatDateTime(lead.lastContact),
    nextAction: nextAction || '待补充下一步动作',
    risk,
  };

  const meta: LeadAnalytics = {
    createdAt: lead.createdAt ?? lead.date,
    lastContact: lead.lastContact,
    daysSinceLastContact,
    status: lead.status,
    priority: lead.priority,
    assigned: Number.isFinite(ownerId),
  };

  return { record, meta };
};

const CRMLeadListPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<LeadSection>('overview');
  const [leadRows, setLeadRows] = useState<LeadRecord[]>([]);
  const [leadAnalytics, setLeadAnalytics] = useState<Record<string, LeadAnalytics>>({});
  const [syncedLeads, setSyncedLeads] = useState<Record<string, { studentId: string }>>({});
  const [lastSyncMessage, setLastSyncMessage] = useState<string | null>(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [tableViewMode, setTableViewMode] = useState<LeadTableViewMode>('table');
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const clearTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [leadsData, serviceTypeData, mentorData] = await Promise.all([
        leadService.getAllLeads(),
        serviceTypeService.getAllServiceTypes(),
        mentorService.getAllMentors(),
      ]);

      setServiceTypes(serviceTypeData);
      setMentors(mentorData);

      const serviceTypeMap = new Map<number, string>(serviceTypeData.map((item) => [item.id, item.name]));
      const mentorMap = new Map<number, string>(mentorData.map((item) => [item.id, item.name]));

      const transformed = leadsData.map((lead) => transformLead(lead, serviceTypeMap, mentorMap));
      const nextRows = transformed.map((item) => item.record);
      const analytics: Record<string, LeadAnalytics> = {};
      transformed.forEach(({ record, meta }) => {
        analytics[record.id] = meta;
      });

      setLeadRows(nextRows);
      setLeadAnalytics(analytics);
    } catch (error) {
      console.error('加载线索数据失败', error);
      setLoadError(error instanceof Error ? error.message : '加载线索数据失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const { quickFilters: derivedQuickFilters, stats: quickFilterStats } = useMemo<{
    quickFilters: QuickFilter[];
    stats: { todayCount: number; highPriorityCount: number; unassignedCount: number; overdueCount: number };
  }>(() => {
    const analytics = Object.values(leadAnalytics);
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = analytics.filter((meta) => meta.createdAt?.startsWith(todayStr)).length;
    const highPriorityCount = analytics.filter((meta) => meta.priority === 'high').length;
    const unassignedCount = analytics.filter((meta) => !meta.assigned).length;
    const overdueCount = analytics.filter(
      (meta) =>
        meta.status !== 'converted' &&
        meta.status !== 'closed' &&
        Number.isFinite(meta.daysSinceLastContact) &&
        meta.daysSinceLastContact > 7,
    ).length;

    return {
      quickFilters: [
        { id: 'today', label: '今日必办', value: String(todayCount) },
        { id: 'high', label: '高优先级', value: String(highPriorityCount) },
        { id: 'unassigned', label: '待分配', value: String(unassignedCount) },
        { id: 'overdue', label: '超时未跟进', value: String(overdueCount) },
      ],
      stats: {
        todayCount,
        highPriorityCount,
        unassignedCount,
        overdueCount,
      },
    };
  }, [leadAnalytics]);

  const funnelStages = useMemo(() => {
    const total = Math.max(leadRows.length, 1);
    return funnelStageDefinitions.map((definition) => {
      const count = leadRows.filter((lead) => lead.stage === definition.stage).length;
      const conversionRate = Math.round((count / total) * 100);
      const trend: 'up' | 'down' | 'stable' = count > 0 ? 'up' : 'stable';
      return {
        id: definition.id,
        name: definition.name,
        count,
        conversionRate,
        avgDuration: definition.avgDuration,
        trend,
      };
    });
  }, [leadRows]);

  const funnelTotals = useMemo(() => {
    const totalLeads = leadRows.length;
    const signedDeals = leadRows.filter((lead) => lead.stage === '签约').length;
    const overallConversion = totalLeads === 0 ? 0 : Math.round((signedDeals / totalLeads) * 1000) / 10;
    return {
      totalLeads,
      signedDeals,
      overallConversion,
    };
  }, [leadRows]);

  const kpiMetrics = useMemo(() => {
    const metrics = KPI_METRICS.map((metric) => ({ ...metric }));
    const { todayCount, overdueCount } = quickFilterStats;
    const totalMetric = metrics.find((metric) => metric.id === 'leads-total');
    if (totalMetric) {
      totalMetric.value = leadRows.length.toLocaleString();
      totalMetric.change = leadRows.length > 0 ? '实时更新' : '尚无数据';
      totalMetric.changeType = leadRows.length > 0 ? 'up' : 'stable';
    }
    const newMetric = metrics.find((metric) => metric.id === 'new-today');
    if (newMetric) {
      newMetric.value = todayCount.toString();
      newMetric.change = todayCount > 0 ? `新增 ${todayCount}` : '等待新线索';
      newMetric.changeType = todayCount > 0 ? 'up' : 'stable';
    }
    const conversionMetric = metrics.find((metric) => metric.id === 'conversion');
    if (conversionMetric) {
      conversionMetric.value = `${funnelTotals.overallConversion}%`;
      conversionMetric.change = '动态计算';
      conversionMetric.changeType = funnelTotals.overallConversion >= 30 ? 'up' : 'stable';
    }
    const slaMetric = metrics.find((metric) => metric.id === 'sla-overdue');
    if (slaMetric) {
      slaMetric.value = overdueCount.toString();
      slaMetric.change = overdueCount > 0 ? '请尽快处理' : '全部达标';
      slaMetric.changeType = overdueCount > 0 ? 'down' : 'up';
    }
    return metrics;
  }, [leadRows.length, quickFilterStats, funnelTotals.overallConversion]);

  const hotLeads = useMemo<HotLead[]>(() => {
    if (!leadRows.length) return [];
    const priorityWeight: Record<LeadPriority, number> = { high: 3, medium: 2, low: 1 };
    return [...leadRows]
      .sort((a, b) => {
        const metaA = leadAnalytics[a.id];
        const metaB = leadAnalytics[b.id];
        const weightA = metaA ? priorityWeight[metaA.priority] ?? 0 : 0;
        const weightB = metaB ? priorityWeight[metaB.priority] ?? 0 : 0;
        if (weightA !== weightB) return weightB - weightA;
        const daysA = metaA?.daysSinceLastContact ?? Number.POSITIVE_INFINITY;
        const daysB = metaB?.daysSinceLastContact ?? Number.POSITIVE_INFINITY;
        return daysA - daysB;
      })
      .slice(0, 3)
      .map((lead) => {
        const meta = leadAnalytics[lead.id];
        const priority = meta?.priority ?? 'medium';
        return {
          id: lead.id,
          name: lead.name,
          program: lead.project,
          heatLevel: priority === 'high' ? '高' : priority === 'medium' ? '中' : '低',
          priorityLabel: `优先级${priorityLabelMap[priority]}`,
          lastInteraction: lead.lastTouch,
          owner: lead.owner,
          recommendedAction: lead.nextAction && lead.nextAction.trim().length > 0 ? lead.nextAction : '待补充下一步动作',
        };
      });
  }, [leadAnalytics, leadRows]);

  const channelShare = useMemo(() => {
    if (!leadRows.length) {
      return CHANNEL_SHARE;
    }
    const total = leadRows.length;
    const counts = leadRows.reduce<Record<string, number>>((acc, lead) => {
      const key = lead.channel || '其他渠道';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([label, count], index) => ({
      id: `channel-${index}`,
      label,
      percentage: Math.max(1, Math.round((count / total) * 100)),
      accent: channelAccentPalette[index % channelAccentPalette.length],
    }));
  }, [leadRows]);

  const channelTotal = useMemo(() => channelShare.reduce((acc, channel) => acc + channel.percentage, 0), [channelShare]);

  const statusMetrics = useMemo(() => {
    const metrics = STATUS_METRICS.map((metric) => ({ ...metric }));
    const signedDeals = leadRows.filter((lead) => lead.stage === '签约').length;

    const todoMetric = metrics.find((metric) => metric.id === 'todo');
    if (todoMetric) {
      todoMetric.value = quickFilterStats.todayCount.toString();
      todoMetric.subLabel = '今日必跟进';
      todoMetric.change = quickFilterStats.todayCount > 0 ? `新增 ${quickFilterStats.todayCount}` : '暂无新增';
      todoMetric.trend = quickFilterStats.todayCount > 0 ? 'up' : 'stable';
    }

    const completedMetric = metrics.find((metric) => metric.id === 'completed');
    if (completedMetric) {
      completedMetric.value = signedDeals.toString();
      const conversion = leadRows.length === 0 ? 0 : Math.round((signedDeals / leadRows.length) * 100);
      completedMetric.subLabel = `签约率 ${conversion}%`;
      completedMetric.change = signedDeals > 0 ? '持续推进' : '等待跟进';
      completedMetric.trend = signedDeals > 0 ? 'up' : 'stable';
    }

    const overdueMetric = metrics.find((metric) => metric.id === 'overdue');
    if (overdueMetric) {
      overdueMetric.value = quickFilterStats.overdueCount.toString();
      overdueMetric.subLabel = '超时待处理';
      overdueMetric.change = quickFilterStats.overdueCount > 0 ? '请尽快处置' : '全部按 SLA 执行';
      overdueMetric.trend = quickFilterStats.overdueCount > 0 ? 'down' : 'up';
    }

    return metrics;
  }, [leadRows, quickFilterStats]);

  const totalTasks = useMemo(() => TASK_LIST.length, []);
  const overdueTasks = useMemo(
    () => (quickFilterStats.overdueCount > 0 ? quickFilterStats.overdueCount : TASK_LIST.filter((task) => task.status === 'warning').length),
    [quickFilterStats],
  );

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

  const handleCreateLeadSubmit = async (values: LeadFormValues) => {
    const trimmedName = values.name.trim() || '新线索';
    const ownerName = values.owner.trim();
    const projectValue = values.project.trim();
    const matchedMentor = ownerName ? mentors.find((mentor) => mentor.name === ownerName) : undefined;
    const matchedServiceType =
      projectValue.length > 0
        ? serviceTypes.find((type) => projectValue.includes(type.name) || type.name.includes(projectValue))
        : undefined;
    const priority: LeadPriority = stagePriorityMap[values.stage] ?? 'medium';
    const trimmedNextAction = values.nextAction.trim();
    const trimmedCampaign = values.campaign.trim();
    const noteSegments: string[] = [];
    if (projectValue) noteSegments.push(`意向：${projectValue}`);
    if (trimmedCampaign) noteSegments.push(`活动：${trimmedCampaign}`);
    const notes = noteSegments.length ? noteSegments.join(' | ') : undefined;

    try {
      const createdLead = await leadService.createLead({
        name: trimmedName,
        source: values.channel.trim() || '其他渠道',
        priority,
        interest: matchedServiceType ? String(matchedServiceType.id) : undefined,
        assigned_to: matchedMentor ? String(matchedMentor.id) : undefined,
        notes,
        nextAction: trimmedNextAction || undefined,
        campaign: trimmedCampaign || undefined,
      });

      const targetStatus = stageToStatusMap[values.stage];
      if (targetStatus && targetStatus !== 'new') {
        await leadService.updateLeadStatus(createdLead.id, targetStatus);
      }

      setLastSyncMessage(`已创建线索「${trimmedName}」，请及时安排负责人跟进。`);
      setActiveSection('table');
      await loadLeads();
    } catch (error) {
      console.error('创建线索失败', error);
      setLastSyncMessage(`创建线索失败：${error instanceof Error ? error.message : '请稍后再试'}`);
    }
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
          <Button
            variant="outline"
            onClick={() => navigate('/admin/crm-template-library')}
            className="gap-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <NotebookPen className="h-4 w-4" />
            模板与话术库
          </Button>
          <Button onClick={() => setCreateOpen(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            创建线索
          </Button>
        </div>
      </div>

      {loadError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200">
          <span>加载线索数据失败：{loadError}</span>
          <Button
            variant="outline"
            onClick={loadLeads}
            className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700 dark:border-red-500/60 dark:text-red-200"
          >
            重试
          </Button>
        </div>
      )}

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
          kpiMetrics={kpiMetrics}
          quickFilters={derivedQuickFilters}
          savedViews={SAVED_VIEWS}
          funnelStages={funnelStages}
          funnelTotals={funnelTotals}
          trendSummary={TREND_SUMMARY}
          channelPerformance={CHANNEL_PERFORMANCE}
          hotLeads={hotLeads}
          actionGroups={ACTION_GROUPS}
          slaOverview={SLA_OVERVIEW}
        />
      )}

      {activeSection === 'table' && (
        isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-16 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">正在加载线索...</p>
          </div>
        ) : (
          <LeadTableTab
            quickFilters={derivedQuickFilters}
            leads={leadRows}
            syncedLeads={syncedLeads}
            onCreateStudent={handleCreateStudent}
            viewMode={tableViewMode}
            onChangeView={setTableViewMode}
          />
        )
      )}

      {activeSection === 'insights' && (
        <LeadInsightsTab
          statusMetrics={statusMetrics}
          channelShare={channelShare}
          channelTotal={channelTotal}
          engagementTimeline={ENGAGEMENT_TIMELINE}
          taskList={TASK_LIST}
          totalTasks={totalTasks}
          overdueTasks={overdueTasks}
          qualityChecks={QUALITY_CHECKS}
        />
      )}

      <CreateLeadDialog open={isCreateOpen} onOpenChange={setCreateOpen} onSubmit={handleCreateLeadSubmit} />
    </div>
  );
};

export default CRMLeadListPage;
