import React from 'react';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  PhoneCall,
  Sparkles,
  UserCircle,
} from 'lucide-react';

import type {
  ChannelShare,
  EngagementChannel,
  FunnelStage,
  LeadRecord,
  RiskLevel,
  Sentiment,
  StatusMetric,
} from './types';

export const stageColorMap: Record<LeadRecord['stage'], string> = {
  新增: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300',
  初次沟通: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  深度沟通: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  合同拟定: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  签约: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export const trendIndicator = (type: 'up' | 'down' | 'stable') => {
  if (type === 'up') return React.createElement(ArrowUpRight, { className: 'h-4 w-4 text-emerald-500' });
  if (type === 'down') return React.createElement(ArrowDownRight, { className: 'h-4 w-4 text-red-500' });
  return React.createElement(Activity, { className: 'h-4 w-4 text-gray-400' });
};

export const crmTheme = {
  sectionTitle: 'text-lg font-semibold text-gray-900 dark:text-white',
  sectionDescription: 'text-sm text-gray-500 dark:text-gray-400',
  cardBase: 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60',
};

export const StatusBadge: React.FC<{ type: 'warning' | 'info' | 'success' }> = ({ type }) => {
  const styleMap: Record<typeof type, string> = {
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return React.createElement(
    'span',
    {
      className: `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${styleMap[type]}`,
    },
    'SLA',
  );
};

export const CHANNEL_ICON_MAP: Record<EngagementChannel, React.ReactNode> = {
  电话: React.createElement(PhoneCall, { className: 'h-4 w-4 text-blue-500' }),
  邮件: React.createElement(Sparkles, { className: 'h-4 w-4 text-indigo-500' }),
  微信: React.createElement(Sparkles, { className: 'h-4 w-4 text-emerald-500' }),
  会议: React.createElement(UserCircle, { className: 'h-4 w-4 text-orange-500' }),
  面访: React.createElement(UserCircle, { className: 'h-4 w-4 text-purple-500' }),
};

export const sentimentTextMap: Record<Sentiment, { label: string; className: string }> = {
  positive: { label: '情绪良好', className: 'text-emerald-600 dark:text-emerald-300' },
  neutral: { label: '情绪平稳', className: 'text-blue-500 dark:text-blue-300' },
  negative: { label: '情绪紧张', className: 'text-red-500 dark:text-red-400' },
};

export const heatBadgeMap: Record<RiskLevel, string> = {
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

export const getFunnelTrendIcon = (trend: FunnelStage['trend']) => {
  switch (trend) {
    case 'up':
      return React.createElement(ArrowUpRight, { className: 'h-4 w-4 text-emerald-500' });
    case 'down':
      return React.createElement(ArrowDownRight, { className: 'h-4 w-4 text-red-500' });
    default:
      return React.createElement(Activity, { className: 'h-4 w-4 text-gray-400' });
  }
};

export const getStatusTrendIcon = (trend: StatusMetric['trend']) => {
  switch (trend) {
    case 'up':
      return React.createElement(ArrowUpRight, { className: 'h-4 w-4 text-emerald-500' });
    case 'down':
      return React.createElement(ArrowDownRight, { className: 'h-4 w-4 text-red-500' });
    default:
      return React.createElement(Activity, { className: 'h-4 w-4 text-gray-400' });
  }
};

// helper to derive channel progress width safely
export const calculateChannelWidth = (channel: ChannelShare, total: number) => {
  if (!total) return 0;
  return (channel.percentage / total) * 100;
};
