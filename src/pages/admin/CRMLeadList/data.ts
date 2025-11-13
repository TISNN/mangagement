import React from 'react';
import {
  AlertTriangle,
  BadgePercent,
  Bell,
  CalendarClock,
  Flame,
  MoveUpRight,
  PhoneCall,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Users,
} from 'lucide-react';

import type {
  ActionItemGroup,
  ChannelPerformance,
  ChannelShare,
  EngagementRecord,
  HotLead,
  KpiMetric,
  LeadRecord,
  QuickFilter,
  QualityCheck,
  ViewDefinition,
  FunnelStage,
  SlaMetric,
  StatusMetric,
  TaskCard,
  TemplateSnippet,
  TrendInsight,
} from './types';

export const QUICK_FILTERS: QuickFilter[] = [
  { id: 'today', label: '今日必办', value: '12' },
  { id: 'high', label: '高热度', value: '24' },
  { id: 'unassigned', label: '待分配', value: '8' },
  { id: 'overdue', label: '超时未跟进', value: '5' },
];

export const SAVED_VIEWS: ViewDefinition[] = [
  { id: 'my-leads', name: '我的线索', description: '默认视图，按热度排序', isShared: false },
  { id: 'high-score', name: '高优先级 & 高预算', description: '重点跟进的高价值线索', isShared: true },
  { id: 'campaign', name: '北美宣讲会', description: '来自 2025 北美宣讲会的线索', isShared: true },
];

export const LEADS_DATA: LeadRecord[] = [
  {
    id: 'lead-001',
    name: '赵思敏',
    project: '2025FALL 美国 CS 硕士',
    stage: '深度沟通',
    owner: '丁若楠',
    channel: '高校宣讲会',
    campaign: '2025 北美宣讲会',
    tags: ['托福110', '高预算', '意向强', '优先级高'],
    lastTouch: '2025-11-08 09:40 电话',
    nextAction: '48 小时内安排 Demo 并发送案例资料',
  },
  {
    id: 'lead-002',
    name: '陈奕辰',
    project: '2025FALL 英国 商科硕士',
    stage: '合同拟定',
    owner: '赵婧怡',
    channel: '线上广告',
    campaign: 'LinkedIn 投放',
    tags: ['奖学金意向', '说明会报名', '优先级高'],
    lastTouch: '2025-11-08 08:20 邮件',
    nextAction: '确认报名说明会并准备奖学金方案',
  },
  {
    id: 'lead-003',
    name: '李雨衡',
    project: '2026FALL 加拿大 EE 硕士',
    stage: '初次沟通',
    owner: '张寒',
    channel: '学员转介绍',
    tags: ['推荐人', '签证关注', '优先级中'],
    lastTouch: '2025-11-07 21:10 微信',
    nextAction: '推送签证 FAQ，预约顾问深聊',
  },
  {
    id: 'lead-004',
    name: '贾晨',
    project: '2025FALL 新加坡 金融硕士',
    stage: '新增',
    owner: '待分配',
    channel: '官网表单',
    tags: ['奖学金', '高潜', '优先级中'],
    lastTouch: '2025-11-08 07:45 表单提交',
    nextAction: '2 小时内安排首次电话沟通',
  },
  {
    id: 'lead-005',
    name: '董蕾',
    project: '2025FALL 美国 文书指导',
    stage: '深度沟通',
    owner: '赵婧怡',
    channel: '公众号咨询',
    tags: ['文书顾问', '资料已提交', '优先级高'],
    lastTouch: '2025-11-07 19:15 邮件',
    nextAction: '发送文书顾问介绍，预约周三会议',
  },
  {
    id: 'lead-006',
    name: '王鑫',
    project: '2025FALL 加拿大 EE 快速通道',
    stage: '深度沟通',
    owner: '王磊',
    channel: '家长推荐',
    tags: ['家长关注安全', '需要材料清单', '优先级高'],
    lastTouch: '2025-11-07 18:55 电话',
    nextAction: '补充安全保障方案，邀请家长参加说明会',
    risk: '高风险',
  },
];

export const KPI_METRICS: KpiMetric[] = [
  { id: 'leads-total', label: '线索总量', value: '3,482', change: '+12.4% 较上月', changeType: 'up' },
  { id: 'new-today', label: '今日新增', value: '48', change: '+6 较昨日', changeType: 'up' },
  { id: 'conversion', label: '签约转化率', value: '28.7%', change: '+1.3% 环比', changeType: 'up' },
  { id: 'response-time', label: '平均响应时长', value: '2.6h', change: '-0.8h', changeType: 'down' },
  { id: 'sla-overdue', label: 'SLA 超时', value: '12', change: '待处理 6', changeType: 'stable' },
];

export const FUNNEL_STAGES: FunnelStage[] = [
  { id: 'stage-1', name: '新增线索', count: 982, conversionRate: 100, avgDuration: '—', trend: 'up' },
  { id: 'stage-2', name: '初次沟通', count: 756, conversionRate: 77, avgDuration: '16h', trend: 'stable' },
  { id: 'stage-3', name: '深度沟通', count: 418, conversionRate: 55, avgDuration: '2.8d', trend: 'down' },
  { id: 'stage-4', name: '合同拟定', count: 162, conversionRate: 39, avgDuration: '4.1d', trend: 'up' },
  { id: 'stage-5', name: '签约&收款', count: 112, conversionRate: 28, avgDuration: '6.4d', trend: 'up' },
];

export const CHANNEL_PERFORMANCE: ChannelPerformance[] = [
  { id: 'channel-1', name: '高校宣讲会', leads: 320, deals: 52, cost: 42_000, roi: 4.2, trend: 'up', tag: '热' },
  { id: 'channel-2', name: '线上广告', leads: 680, deals: 84, cost: 56_000, roi: 2.1, trend: 'stable', tag: '需优化' },
  { id: 'channel-3', name: '学员转介绍', leads: 210, deals: 68, cost: 9_000, roi: 6.5, trend: 'up', tag: '高价值' },
  { id: 'channel-4', name: '内容运营', leads: 410, deals: 36, cost: 18_000, roi: 2.4, trend: 'down', tag: '待观察' },
];

export const HOT_LEADS: HotLead[] = [
  {
    id: 'lead-001',
    name: '赵思敏',
    program: '2025FALL 美国 CS 硕士',
    heatLevel: '高',
    priorityLabel: '优先级高',
    lastInteraction: '2025-11-07 21:30 电话',
    owner: '丁若楠',
    recommendedAction: '安排 48 小时内 Demo，发送 MIT 案例资料',
    tags: ['高预算', 'TOEFL 110', '父母支持'],
  },
  {
    id: 'lead-002',
    name: '陈奕辰',
    program: '2025FALL 英国 商科硕士',
    heatLevel: '高',
    priorityLabel: '优先级高',
    lastInteraction: '2025-11-07 09:10 邮件回复',
    owner: '赵婧怡',
    recommendedAction: '邀请参加周末商科说明会，准备奖学金方案',
    tags: ['GPA3.8', '活动参与', '奖学金意向'],
  },
  {
    id: 'lead-003',
    name: '李雨衡',
    program: '2026FALL 加拿大 EE 硕士',
    heatLevel: '中',
    priorityLabel: '优先级中',
    lastInteraction: '2025-11-05 20:12 微信',
    owner: '张寒',
    recommendedAction: '发送高校资料包，预约下周顾问深聊',
    tags: ['推荐人', '双非本科', '预算充足'],
  },
];

export const ACTION_GROUPS: ActionItemGroup[] = [
  {
    title: '待分配线索 (12)',
    description: '需在 4 小时内完成分配，避免首响延迟。',
    icon: React.createElement(Users, { className: 'h-4 w-4' }),
    items: [
      { id: 'assign-01', title: '上海教育展 - 赵琳', owner: '未分配', deadline: '今日 12:00', status: 'warning' },
      { id: 'assign-02', title: '官微咨询 - 王博', owner: '未分配', deadline: '今日 15:30', status: 'warning' },
      { id: 'assign-03', title: 'TOEFL 105 咨询 - 李嫣', owner: '待确认', deadline: '今日 18:00', status: 'info' },
    ],
  },
  {
    title: '超时未跟进 (8)',
    description: '超过 SLA 24h 未响应，将自动升级给经理。',
    icon: React.createElement(TimerReset, { className: 'h-4 w-4' }),
    items: [
      { id: 'overdue-01', title: '张嘉琪 - 初次沟通', owner: '童瑶', deadline: '逾期 2h', status: 'warning' },
      { id: 'overdue-02', title: '周逸 - 深度沟通', owner: '汪洋', deadline: '逾期 6h', status: 'warning' },
      { id: 'overdue-03', title: '刘畅 - 资料评估', owner: '林骁', deadline: '逾期 14h', status: 'warning' },
    ],
  },
  {
    title: '客户新回复 (5)',
    description: '建议在 2 小时内回复，提升体验与热度。',
    icon: React.createElement(Bell, { className: 'h-4 w-4' }),
    items: [
      { id: 'reply-01', title: '赵思敏 邮件：咨询 MIT 推荐信', owner: '丁若楠', deadline: '2 小时内', status: 'info' },
      { id: 'reply-02', title: '贾晨 微信：想了解奖学金', owner: '张寒', deadline: '4 小时内', status: 'info' },
      { id: 'reply-03', title: '董蕾 邮件：预约文书顾问', owner: '赵婧怡', deadline: '4 小时内', status: 'info' },
    ],
  },
];

export const SLA_OVERVIEW: SlaMetric[] = [
  {
    title: '首响 SLA',
    value: '93%',
    target: '目标 ≥ 95%',
    description: '未达标团队：华东、线上运营',
    color: 'text-blue-600 dark:text-blue-300',
  },
  {
    title: '深度沟通完成率',
    value: '62%',
    target: '目标 ≥ 70%',
    description: '需加强资料准备与顾问跟进节奏',
    color: 'text-emerald-600 dark:text-emerald-300',
  },
  {
    title: '签约周期均值',
    value: '27.4d',
    target: '目标 ≤ 25d',
    description: '北美 CS 产品延长 3.6d，建议复盘流程',
    color: 'text-orange-500 dark:text-orange-300',
  },
];

export const TREND_SUMMARY: TrendInsight[] = [
  {
    title: '渠道趋势',
    icon: React.createElement(TrendingUp, { className: 'h-4 w-4' }),
    content: '高校宣讲会贡献签约 +18%，学员转介绍转化率 32%，保持高位。线上广告 CPL 略高，建议优化投放素材。',
  },
  {
    title: '处理效率',
    icon: React.createElement(TimerReset, { className: 'h-4 w-4' }),
    content: '首响平均 2.6 小时，深度沟通准备素材耗时上升，需补充自动化资料包与脚本。',
  },
  {
    title: '风险提醒',
    icon: React.createElement(AlertTriangle, { className: 'h-4 w-4' }),
    content: '华东区域 SLA 下滑，部分顾问假期未交接；线上运营线索重复率高，影响评分。',
  },
];

export const STATUS_METRICS: StatusMetric[] = [
  { id: 'todo', title: '今日待办', value: '18', subLabel: '待完成跟进', change: '+6 新增', trend: 'up' },
  { id: 'completed', title: '今日已完成', value: '32', subLabel: '完成率 78%', change: '+12 比昨日', trend: 'up' },
  { id: 'overdue', title: '延迟跟进', value: '5', subLabel: 'SLA 超时', change: '-2 已处理', trend: 'down' },
];

export const CHANNEL_SHARE: ChannelShare[] = [
  { id: 'phone', label: '电话', percentage: 42, accent: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' },
  { id: 'mail', label: '邮件', percentage: 28, accent: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { id: 'wechat', label: '微信', percentage: 19, accent: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { id: 'meeting', label: '会议', percentage: 7, accent: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' },
  { id: 'visit', label: '面访', percentage: 4, accent: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300' },
];

export const ENGAGEMENT_TIMELINE: EngagementRecord[] = [
  {
    id: 'eng-01',
    time: '2025-11-08 09:40',
    channel: '电话',
    summary: '确认课程匹配度，并解答托福补习疑问。',
    owner: '丁若楠',
    sentiment: 'positive',
    tags: ['首席顾问', '主动联系'],
    hasAttachment: true,
    aiSummary: {
      highlights: ['学生对北美 CS 项目兴趣高', '托福 110，GPA 3.7'],
      todo: ['安排 48h 内 Demo', '发送 MIT 成功案例资料'],
      risk: null,
    },
  },
  {
    id: 'eng-02',
    time: '2025-11-08 08:20',
    channel: '邮件',
    summary: '发送奖学金方案与导师介绍，等待学生确认。',
    owner: '赵婧怡',
    sentiment: 'neutral',
    tags: ['邮件模板', '奖学金'],
    hasAttachment: true,
    aiSummary: {
      highlights: ['学生关注英国项目奖学金', '计划报名周末说明会'],
      todo: ['48h 内跟进报名结果', '准备商科导师介绍'],
      risk: '中',
    },
  },
  {
    id: 'eng-03',
    time: '2025-11-07 21:10',
    channel: '微信',
    summary: '发送院校资料，小程序浏览 6 次，学生希望了解签证流程。',
    owner: '张寒',
    sentiment: 'positive',
    tags: ['微信', '高互动度'],
    hasAttachment: false,
    aiSummary: {
      highlights: ['学生关注加拿大签证政策', '家庭支持预算充足'],
      todo: ['推送签证 FAQ', '预约下周一顾问深聊'],
      risk: null,
    },
  },
  {
    id: 'eng-04',
    time: '2025-11-07 18:55',
    channel: '电话',
    summary: '家长反馈担忧疫情影响，需提供安全保障方案。',
    owner: '王鑫',
    sentiment: 'negative',
    tags: ['家长沟通', '风险'],
    hasAttachment: false,
    aiSummary: {
      highlights: ['家长对安全问题敏感', '需展示学校防疫体系'],
      todo: ['发送安全保障方案', '邀请参加家长说明会'],
      risk: '高',
    },
  },
];

export const TASK_LIST: TaskCard[] = [
  { id: 'task-01', title: '赵思敏 - 发送 MIT 案例与 Demo 链接', owner: '丁若楠', due: '今日 12:00', channel: '邮件', status: 'warning' },
  { id: 'task-02', title: '陈奕辰 - 确认商科说明会报名', owner: '赵婧怡', due: '今日 14:00', channel: '电话', status: 'info' },
  { id: 'task-03', title: '李雨衡 - 安排加拿大签证顾问沟通', owner: '张寒', due: '明日 09:30', channel: '微信', status: 'info' },
  { id: 'task-04', title: '王鑫 - 家长安全方案回访', owner: '王鑫', due: '今日 17:00', channel: '电话', status: 'warning' },
];

export const TEMPLATE_SNIPPETS: TemplateSnippet[] = [
  {
    id: 'tpl-01',
    title: 'MIT CS 高完成度电话脚本',
    description: '用于高水平理工背景学生的深度沟通，包含推荐信与科研点位提示。',
    channel: '电话',
    tags: ['高端', '北美', '冲刺'],
    rating: 4.9,
    usage: 126,
  },
  {
    id: 'tpl-02',
    title: '商科奖学金邮件模板',
    description: '适用于英国/新加坡商科项目的奖学金说明与案例介绍。',
    channel: '邮件',
    tags: ['商科', '奖学金'],
    rating: 4.7,
    usage: 214,
  },
  {
    id: 'tpl-03',
    title: '家长安全保障 FAQ',
    description: '针对家长常见疑虑的标准回答，覆盖防疫、安全、服务流程。',
    channel: '会议',
    tags: ['家长', '风险'],
    rating: 4.5,
    usage: 168,
  },
];

export const QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'qc-01',
    target: '王鑫 - 家长电话',
    score: 72,
    issues: ['未提供可落地的安全措施细节', '语速偏快，未确认家长重点关注点'],
    reviewer: '刘蓉（质检）',
    status: '已反馈',
    createdAt: '2025-11-07 22:10',
  },
  {
    id: 'qc-02',
    target: '赵婧怡 - 奖学金邮件',
    score: 88,
    issues: ['模板使用合规，建议补充活动 CTA'],
    reviewer: '刘蓉（质检）',
    status: '已完成',
    createdAt: '2025-11-06 18:25',
  },
];
