import type React from 'react';
import type { Attachment, NextStep, ServiceProgressLog } from '../../../types/people';

export type ChronoTab = 'timeline' | 'milestone' | 'risk' | 'analytics' | 'archives';

export interface ServiceProject {
  id: string;
  student: string;
  serviceName: string;
  status: '进行中' | '待启动' | '已完成';
  startDate: string;
  endDate?: string;
  progress: number;
  primaryAdvisor: string;
  phase: string;
}

export interface SummaryMetric {
  title: string;
  value: string;
  trend: string;
  accent: string;
  icon: React.ReactNode;
}

export type TimelineType = '里程碑' | '任务' | '材料' | '文书' | '网申' | '风险' | '反馈';

export type CollaborationStatus = '待处理' | '进行中' | '已完成';
export type CollaborationPriority = '高' | '中' | '低';

export interface CollaborationActionItem {
  id: string;
  owner: string;
  content: string;
  dueDate?: string;
  status: CollaborationStatus;
  priority: CollaborationPriority;
  source?: string;
}

export interface CollaborationLogEntry {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  details?: string;
  relatedActionItemId?: string;
}

export interface TimelineEvent {
  id: string;
  type: TimelineType;
  title: string;
  description: string;
  owner: string;
  timestamp: string;
  attachments?: number;
  tags?: string[];
  aiInsight?: string;
  status?: '完成' | '已完成' | '进行中' | '待处理' | '风险';
  milestone?: string;
  notes?: string;
  completedItems?: Record<string, unknown>[];
  nextSteps?: (Record<string, unknown> | NextStep)[];
  attachmentsList?: Attachment[];
  rawLog?: ServiceProgressLog;
  actionItems?: CollaborationActionItem[];
  collaborationLogs?: CollaborationLogEntry[];
}

export interface MilestoneItem {
  id: string;
  name: string;
  stage: string;
  owner: string;
  plannedDate: string;
  dueDate: string;
  status: '按计划' | '延迟' | '完成';
  completion: number;
  weight: number;
}

export interface RiskItem {
  id: string;
  category: '材料' | '文书' | '网申' | '学生配合' | '外部因素' | '其它';
  level: '高' | '中' | '低';
  score: number;
  summary: string;
  mitigation: string;
  updatedAt: string;
}

export interface AnalyticsIndicator {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

export interface ArchiveEntry {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  author: string;
}

