/**
 * 客户分群分析模块 - 类型定义
 */

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  note: string;
}

export interface TagCategory {
  id: string;
  title: string;
  description: string;
  colorClass: string;
  tags: string[];
}

export interface SegmentationCondition {
  id: string;
  type: '标签' | '字段' | '行为' | '模型';
  field: string;
  operator: string;
  value: string;
  relation?: 'AND' | 'OR';
}

export interface SegmentTemplate {
  id: string;
  name: string;
  description: string;
  population: string;
  growth: string;
  isDynamic: boolean;
}

export interface ValueQuadrant {
  id: string;
  title: string;
  description: string;
  ratio: string;
  highlight: string;
  accent: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  owner: string;
  successRate: string;
  status: 'active' | 'draft';
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  owner: string;
  type: 'history' | 'attribution' | 'export';
}

export interface AlertGroup {
  title: string;
  value: string;
  detail: string;
  action: string;
}

export interface CustomerProfile {
  name: string;
  project: string;
  region: string;
  advisor: string;
  stage: string;
  source: string;
  lastInteraction: string;
  lastConsumption: string;
  satisfaction: string;
}

export type TabKey = 'overview' | 'profile' | 'segmentation' | 'value' | 'automation' | 'reports' | 'alerts';

