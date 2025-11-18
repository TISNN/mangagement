/**
 * 协同空间模块 - 数据常量
 */

import {
  GoalMetric,
  PersonalKPI,
  FeedItem,
  CollaborationTask,
  KnowledgeArticle,
  TrainingEvent,
  AlertItem,
} from './types';

export const GOAL_METRICS: GoalMetric[] = [
  {
    id: 'gm-1',
    label: 'Q4 签约目标达成率',
    target: '¥12,000,000',
    progress: 68,
    forecast: '预计达成 94%',
    trend: '+6.2% 环比',
    trendType: 'up',
  },
  {
    id: 'gm-2',
    label: '续约率',
    target: '85%',
    progress: 72,
    forecast: '预测 82%',
    trend: '+3.8pt',
    trendType: 'up',
  },
  {
    id: 'gm-3',
    label: '回款达成率',
    target: '¥8,500,000',
    progress: 61,
    forecast: '预计达成 88%',
    trend: '-2.1% 环比',
    trendType: 'down',
  },
  {
    id: 'gm-4',
    label: '客户满意度（CSAT）',
    target: '4.7 / 5',
    progress: 83,
    forecast: '预测 4.6',
    trend: '+0.3',
    trendType: 'up',
  },
];

export const KPI_CARDS: PersonalKPI[] = [
  {
    id: 'kpi-1',
    name: '赵婧怡',
    role: '销售顾问 · 北美组',
    avatar: 'https://i.pravatar.cc/150?img=5',
    metrics: [
      { label: '本月签约金额', value: '¥860k', target: '目标 720k', trend: '+18%' },
      { label: '跟进完成率', value: '94%', target: '目标 90%', trend: '+4pt' },
      { label: '客户满意度', value: '4.9', target: '目标 4.6', trend: '+0.2' },
    ],
    badge: 'top',
  },
  {
    id: 'kpi-2',
    name: '王磊',
    role: '市场运营 · Campaign',
    avatar: 'https://i.pravatar.cc/150?img=12',
    metrics: [
      { label: '活动报名数', value: '312', target: '目标 280', trend: '+9%' },
      { label: '线索转化率', value: '27%', target: '目标 25%', trend: '+1.5pt' },
      { label: '内容上线效率', value: '96%', target: '目标 92%', trend: '+2pt' },
    ],
    badge: 'rising',
  },
  {
    id: 'kpi-3',
    name: '张寒',
    role: '客服主管 · 服务团队',
    avatar: 'https://i.pravatar.cc/150?img=25',
    metrics: [
      { label: '工单一次解决率', value: '89%', target: '目标 86%', trend: '+2pt' },
      { label: '响应时长', value: '12m', target: '目标 15m', trend: '-3m' },
      { label: '满意度', value: '4.7', target: '目标 4.5', trend: '+0.1' },
    ],
  },
];

export const FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'announcement',
    author: '刘珂 · 销售经理',
    avatar: 'https://i.pravatar.cc/150?img=45',
    time: '2 小时前',
    visibility: 'org',
    tags: ['#Strategy', '#季度目标'],
    title: 'Q4 北美市场攻坚计划发布',
    content: '已在知识库同步新版作战手册，重点聚焦高价值院校的案例打法与折扣审批流程优化，请相关团队本周内阅读确认。',
    attachments: ['Q4-NorthAmerica-Playbook.pdf'],
    comments: 12,
    likes: 38,
  },
  {
    id: 'feed-2',
    type: 'system',
    author: '系统通知',
    avatar: 'https://i.pravatar.cc/150?img=66',
    time: '今天 10:15',
    visibility: 'team',
    tags: ['#合同', '#风险预警'],
    title: '合同 C-20251108-13 审批逾期提醒',
    content: '负责团队：北美销售一部；SLA 超时 6 小时。请核对审批节点并在 2 小时内更新进度。',
    comments: 3,
    likes: 9,
  },
  {
    id: 'feed-3',
    type: 'commentary',
    author: '市场活动协同群',
    avatar: 'https://i.pravatar.cc/150?img=22',
    time: '昨天 19:20',
    visibility: 'team',
    tags: ['#市场活动', '#协同'],
    title: '北美说明会素材需求已完成',
    content: '素材包与报名页已上线，访问路径：Marketing Cloud / Campaign / 2025-NA-Roadshow。欢迎销售团队提供演讲反馈。',
    attachments: ['设计稿.fig', '报名页链接'],
    comments: 6,
    likes: 21,
  },
];

export const COLLAB_TASKS: CollaborationTask[] = [
  {
    id: 'task-1',
    title: '申请市场部制作 MIT 录取海报',
    department: '市场运营',
    requester: '赵婧怡',
    assignee: '王磊',
    due: '2025-11-10',
    sla: '72h 内交付',
    status: '进行中',
    priority: '高',
    history: ['2025-11-07 09:30 提交需求', '2025-11-07 10:05 市场部确认需求', '2025-11-08 14:00 设计初稿完成'],
  },
  {
    id: 'task-2',
    title: '请求客服参与高风险客户沟通',
    department: '客服支持',
    requester: '丁若楠',
    assignee: '张寒',
    due: '2025-11-09',
    sla: '48h 内响应',
    status: '待处理',
    priority: '中',
    history: ['2025-11-08 11:20 提交，附上通话记录'],
  },
  {
    id: 'task-3',
    title: '折扣审批：北美说明会报名双人套餐',
    department: '管理层审批',
    requester: '王磊',
    assignee: '刘珂',
    due: '2025-11-08',
    sla: '24h 内完成',
    status: '已完成',
    priority: '高',
    history: [
      '2025-11-07 15:50 提交审批',
      '2025-11-07 16:40 补充案例证明',
      '2025-11-07 18:10 批准并通知销售团队',
    ],
  },
];

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-1',
    title: '北美高价值院校案例打法 3.0',
    category: '成功案例',
    updatedAt: '2025-11-07',
    owner: '合规审核：陈航',
    version: 'v3.0',
    usage: { views: 186, rating: 4.8, favorites: 46 },
    tags: ['#北美', '#案例打法', '#高价值'],
  },
  {
    id: 'kb-2',
    title: '高压家长沟通话术模板（含风险提醒）',
    category: '话术脚本',
    updatedAt: '2025-11-06',
    owner: '客服团队 · 张寒',
    version: 'v1.6',
    usage: { views: 254, rating: 4.6, favorites: 63 },
    tags: ['#话术', '#风险客户'],
  },
  {
    id: 'kb-3',
    title: '合同折扣审批标准流程（内控版）',
    category: '流程手册',
    updatedAt: '2025-11-05',
    owner: '法务 · 宋意',
    version: 'v2.1',
    usage: { views: 198, rating: 4.9, favorites: 72 },
    tags: ['#合同', '#审批', '#法务'],
  },
];

export const TRAINING_EVENTS: TrainingEvent[] = [
  {
    id: 'train-1',
    title: '2025 Q4 北美市场攻坚训练营',
    type: '专题培训',
    start: '2025-11-12 14:00',
    end: '2025-11-12 17:00',
    location: '线上 · Zoom',
    host: '市场运营 · 王磊',
    status: '报名中',
    focus: '覆盖北美高价值院校案例打法、折扣审批策略与私域跟进 SOP。',
  },
  {
    id: 'train-2',
    title: '高压家长沟通 & 风险处理工作坊',
    type: '能力提升',
    start: '2025-11-15 10:00',
    end: '2025-11-15 12:00',
    location: '上海 · 培训中心 A3',
    host: '客服主管 · 张寒',
    status: '已满',
    focus: '场景演练 + AI 话术演示，帮助顾问应对高压沟通场景。',
  },
  {
    id: 'train-3',
    title: 'SaaS 产品演示 & Demo 实战复盘',
    type: '经验复盘',
    start: '2025-11-18 16:00',
    end: '2025-11-18 18:00',
    location: '线上 · 回放',
    host: '销售 Enablement 团队',
    status: '回放',
    focus: '拆解 Demo 演示结构、问答引导以及异议处理技巧，提供可下载脚本。',
  },
];

export const ALERT_ITEMS: AlertItem[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: '北美高风险客户跟进超时',
    content: '共 6 位客户超过 SLA，请客服团队今日内完成回访。',
    icon: 'Clock',
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'Q4 北美训练营报名截止提醒',
    content: '报名截止 11/10 18:00，当前报名 46 / 60，未报名成员将收到自动提醒。',
    icon: 'Calendar',
  },
  {
    id: 'alert-3',
    type: 'success',
    title: '知识库内容到期提醒',
    content: '3 篇流程类文档将于 11/20 到期，请对应负责人完成更新审批。',
    icon: 'ShieldCheck',
  },
];

