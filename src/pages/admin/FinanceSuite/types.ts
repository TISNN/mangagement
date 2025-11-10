import type { ComponentType, SVGProps } from 'react';

export interface KpiCardConfig {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone?: 'positive' | 'negative' | 'neutral';
  caption?: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface KpiAlertConfig {
  threshold: number;
  comparison: 'gt' | 'lt';
  description: string;
}

export interface RevenueStream {
  name: string;
  value: number;
  proportion: number;
  yoy: number;
}

export interface SpendSlice {
  name: string;
  value: number;
}

export interface TaxReminder {
  id: string;
  title: string;
  dueDate: string;
  severity: 'info' | 'warn' | 'critical';
  description: string;
  owner: string;
}

export interface LedgerFilterOption {
  label: string;
  value: string;
}

export interface LedgerTransaction {
  id: string;
  date: string;
  type: '收入' | '支出' | '转账' | '退款' | '税费';
  project: string;
  amount: number;
  channel: string;
  counterparty: string;
  status: '待确认' | '已核销' | '争议中';
  approval: '通过' | '待审批' | '驳回';
  tags: string[];
}

export interface InvoiceRecord {
  id: string;
  type: '增值税专用' | '增值税普通' | '跨境电子';
  client: string;
  project: string;
  amount: number;
  taxRate: number;
  issuedAt: string;
  status: '草稿' | '待审核' | '已开票' | '已寄出' | '作废';
  approver?: string;
  logistics?: {
    company: string;
    trackingNo: string;
    shippedAt: string;
  };
  relatedTransaction: string;
}

export interface InvoiceSummaryCard {
  label: string;
  value: string;
  tone: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface TaxKpi {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'steady';
  delta: string;
  description: string;
}

export interface TaxCalendarItem {
  id: string;
  date: string;
  taxType: '增值税' | '企业所得税' | '个人所得税';
  title: string;
  owner: string;
  status: '待处理' | '处理中' | '已完成';
  actions?: string[];
}

export interface TaxTask {
  id: string;
  title: string;
  owner: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: '待办' | '进行中' | '待审批' | '已完成';
  notes?: string;
}

export type PeriodOption = 'mom' | 'qoq' | 'yoy';
