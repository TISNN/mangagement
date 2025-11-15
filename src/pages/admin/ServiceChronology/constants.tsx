import React from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, Target } from 'lucide-react';
import type {
  AnalyticsIndicator,
  ArchiveEntry,
  CollaborationPriority,
  CollaborationStatus,
  MilestoneItem,
  RiskItem,
  SummaryMetric,
  TimelineEvent,
} from './types';

export const EMPTY_SUMMARY_METRICS: SummaryMetric[] = [
  {
    title: '里程碑完成率',
    value: '—',
    trend: '暂无数据',
    accent: 'from-blue-500/10 to-blue-500/5',
    icon: <Target className="h-5 w-5 text-blue-500" />,
  },
  {
    title: '材料通过率',
    value: '—',
    trend: '暂无数据',
    accent: 'from-emerald-500/10 to-emerald-500/5',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: '风险评分',
    value: '—',
    trend: '暂无数据',
    accent: 'from-amber-500/10 to-amber-500/5',
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  {
    title: 'AI 建议采纳率',
    value: '—',
    trend: '暂无数据',
    accent: 'from-purple-500/10 to-purple-500/5',
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [];
export const MILESTONE_ITEMS: MilestoneItem[] = [];
export const RISK_ITEMS: RiskItem[] = [];
export const ANALYTICS_INDICATORS: AnalyticsIndicator[] = [];
export const ARCHIVE_DATA: ArchiveEntry[] = [];

export const COLLAB_STATUS_BADGE: Record<CollaborationStatus, string> = {
  待处理: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  进行中: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200',
  已完成: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200',
};

export const COLLAB_PRIORITY_TEXT: Record<CollaborationPriority, string> = {
  高: 'text-rose-500 dark:text-rose-300',
  中: 'text-blue-500 dark:text-blue-300',
  低: 'text-gray-500 dark:text-gray-400',
};

export const EDIT_STATUS_OPTIONS = ['待处理', '进行中', '已完成', '风险'] as const;

