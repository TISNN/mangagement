import type { LucideIcon } from 'lucide-react';

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  memberCount: number;
  lastUpdated: string;
  owners: string[];
  critical?: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  scenario: string;
  steps: Array<{
    id: string;
    role: string;
    slaHours: number;
    action: string;
  }>;
  autoRevokeHours?: number;
  lastOptimized: string;
}

export interface PermissionAuditLog {
  id: string;
  user: string;
  action: string;
  detail: string;
  createdAt: string;
  riskLevel: '低' | '中' | '高';
}

export interface StaffProfile {
  id: string;
  name: string;
  role: string;
  team: string;
  workload: number;
  skills: string[];
  avatarUrl?: string;
  avatarColor?: string;
  timezone: string;
  location: string;
  education?: {
    degree: string;
    school: string;
    year?: string;
  };
  availability: Array<{
    day: string;
    start: string;
    end: string;
    location: string;
  }>;
  status: '在岗' | '请假' | '培训';
}

export interface ShiftConflict {
  id: string;
  staff: string;
  issue: string;
  impact: string;
  suggestedAction: string;
  detectedAt: string;
}

export interface AttendanceSummary {
  month: string;
  present: number;
  leave: number;
  overtimeHours: number;
  alerts: string[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  scope: string;
  version: string;
  status: '启用' | '灰度中' | '草稿';
  avgCompletionHours: number;
  completionRate: number;
  bottleneckNode?: string;
}

export interface WorkflowInsight {
  id: string;
  title: string;
  description: string;
  improvement: string;
  owner: string;
  updatedAt: string;
}

export interface WorkflowTimelineItem {
  id: string;
  entity: string;
  state: string;
  handler: string;
  completedAt: string;
  duration: string;
  status: '正常' | '延迟' | '阻塞';
}

export interface ComplianceRisk {
  id: string;
  title: string;
  area: string;
  level: '低' | '中' | '高' | '严重';
  owner: string;
  dueDate: string;
  status: '处理中' | '已完成' | '待确认';
  tags: string[];
}

export interface PolicyUpdate {
  id: string;
  title: string;
  source: string;
  effectiveDate: string;
  impact: string;
  link?: string;
}

export interface ComplianceCaseLog {
  id: string;
  item: string;
  description: string;
  createdAt: string;
  assignee: string;
  progress: number;
  evidenceRequired: boolean;
}

export interface IntegrationHealth {
  id: string;
  name: string;
  type: string;
  status: '正常' | '警告' | '失败';
  lastCheck: string;
  owner: string;
  description: string;
}

export interface NotificationTemplate {
  id: string;
  channel: '邮件' | '短信' | '站内信';
  name: string;
  trigger: string;
  lastUpdated: string;
  enabled: boolean;
  metrics: {
    send: number;
    click: number;
  };
}

export interface MaintenanceTask {
  id: string;
  title: string;
  scope: string;
  schedule: string;
  owner: string;
  status: '计划中' | '进行中' | '已完成';
  notes: string;
  link?: string;
}

export interface TabDefinition {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

