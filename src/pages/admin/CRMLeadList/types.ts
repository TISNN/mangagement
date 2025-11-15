import type { ReactNode } from 'react';
import type { LeadPriority } from '../../../types/lead';

export type LeadStage = '新增' | '初次沟通' | '深度沟通' | '合同拟定' | '签约';

export interface LeadRecord {
  id: string;
  name: string;
  avatar?: string;
  project: string;
  stage: LeadStage;
  owner: string;
  priority: LeadPriority;
  channel: string;
  campaign?: string;
  lastTouch: string;
  nextAction: string;
  risk?: '高风险' | '需关注';
}

export interface QuickFilter {
  id: string;
  label: string;
  value: string;
}

export interface ViewDefinition {
  id: string;
  name: string;
  description: string;
  isShared: boolean;
}

export type LeadSection = 'overview' | 'table' | 'insights';
export type LeadTableViewMode = 'table' | 'kanban';

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'stable';
}

export interface FunnelStage {
  id: string;
  name: string;
  count: number;
  conversionRate: number;
  avgDuration: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ChannelPerformance {
  id: string;
  name: string;
  leads: number;
  deals: number;
  cost: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
  tag: string;
}

export interface HotLead {
  id: string;
  name: string;
  program: string;
  heatLevel: '高' | '中' | '低';
  lastInteraction: string;
  owner: string;
  recommendedAction: string;
  priorityLabel: string;
}

export interface ActionItemGroup {
  title: string;
  description: string;
  icon: ReactNode;
  items: Array<{
    id: string;
    title: string;
    owner: string;
    deadline: string;
    status: 'warning' | 'info' | 'success';
  }>;
}

export interface SlaMetric {
  title: string;
  value: string;
  target: string;
  description: string;
  color: string;
}

export interface TrendInsight {
  title: string;
  icon: ReactNode;
  content: string;
}

export type EngagementChannel = '电话' | '邮件' | '微信' | '会议' | '面访';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type RiskLevel = '高' | '中' | '低';

export interface StatusMetric {
  id: string;
  title: string;
  value: string;
  subLabel: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ChannelShare {
  id: string;
  label: string;
  percentage: number;
  accent: string;
}

export interface EngagementRecord {
  id: string;
  time: string;
  channel: EngagementChannel;
  summary: string;
  owner: string;
  sentiment: Sentiment;
  hasAttachment: boolean;
  aiSummary: {
    highlights: string[];
    todo: string[];
    risk: RiskLevel | null;
  };
}

export interface TaskCard {
  id: string;
  title: string;
  owner: string;
  due: string;
  channel?: EngagementChannel;
  status: 'warning' | 'info' | 'success';
}

export interface QualityCheck {
  id: string;
  target: string;
  score: number;
  issues: string[];
  reviewer: string;
  status: '待处理' | '已反馈' | '已完成';
  createdAt: string;
}

export interface LeadFormValues {
  name: string;
  project: string;
  stage: LeadStage;
  owner: string;
  channel: string;
  campaign: string;
  nextAction: string;
}

export const LEAD_STAGE_OPTIONS: LeadStage[] = ['新增', '初次沟通', '深度沟通', '合同拟定', '签约'];
