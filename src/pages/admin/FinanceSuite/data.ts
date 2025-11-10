import {
  ArrowDownToLine,
  BarChart3,
  Clock,
  PieChart,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import type {
  InvoiceRecord,
  InvoiceSummaryCard,
  KpiAlertConfig,
  KpiCardConfig,
  LedgerFilterOption,
  LedgerTransaction,
  PeriodOption,
  RevenueStream,
  SpendSlice,
  TaxReminder,
  TaxCalendarItem,
  TaxKpi,
  TaxTask,
} from './types';

export const PERIOD_OPTIONS: { key: PeriodOption; label: string }[] = [
  { key: 'mom', label: '本月 vs 上月' },
  { key: 'qoq', label: '本季度 vs 上季度' },
  { key: 'yoy', label: '年度同比' },
];

export const KPI_CARDS: KpiCardConfig[] = [
  {
    id: 'revenue',
    label: '本月收入',
    value: '¥ 3,286,000',
    delta: '+18.4%',
    tone: 'positive',
    caption: '较上月',
    description: '课程服务、知识花园 GMV、企业授权等合计确认收入。',
    icon: TrendingUp,
  },
  {
    id: 'grossMargin',
    label: '毛利率',
    value: '57.2%',
    delta: '+2.1pp',
    tone: 'positive',
    caption: '目标线 55%',
    description: '按产品线统计，扣除可变成本后的利润率。',
    icon: BarChart3,
  },
  {
    id: 'cashDays',
    label: '现金储备天数',
    value: '62 天',
    delta: '-5 天',
    tone: 'negative',
    caption: '安全阈值 ≥ 45 天',
    description: '可用现金对比日均运营支出所得的缓冲期。',
    icon: Clock,
  },
  {
    id: 'receivable',
    label: '应收账款',
    value: '¥ 1,028,500',
    delta: '+6.3%',
    tone: 'negative',
    caption: '较上期',
    description: '已确认收入但尚未回款的总额，需要催收跟进。',
    icon: ArrowDownToLine,
  },
];

export const KPI_VARIATIONS: Record<PeriodOption, Record<string, Partial<KpiCardConfig>>> = {
  mom: {
    revenue: { value: '¥ 3,286,000', delta: '+18.4%', tone: 'positive' },
    grossMargin: { value: '57.2%', delta: '+2.1pp', tone: 'positive' },
    cashDays: { value: '62 天', delta: '-5 天', tone: 'negative' },
    receivable: { value: '¥ 1,028,500', delta: '+6.3%', tone: 'negative' },
  },
  qoq: {
    revenue: { value: '¥ 9,486,000', delta: '+11.2%', tone: 'positive', caption: '较上季度' },
    grossMargin: { value: '55.8%', delta: '+1.4pp', tone: 'positive', caption: '较上季度' },
    cashDays: { value: '65 天', delta: '-3 天', tone: 'negative', caption: '较上季度' },
    receivable: { value: '¥ 978,400', delta: '+4.8%', tone: 'negative', caption: '较上季度' },
  },
  yoy: {
    revenue: { value: '¥ 32,580,000', delta: '+26.3%', tone: 'positive', caption: '较去年同期' },
    grossMargin: { value: '54.1%', delta: '+3.6pp', tone: 'positive', caption: '较去年同期' },
    cashDays: { value: '68 天', delta: '-7 天', tone: 'negative', caption: '较去年同期' },
    receivable: { value: '¥ 1,142,800', delta: '+9.1%', tone: 'negative', caption: '较去年同期' },
  },
};

export const KPI_ALERTS: Record<string, KpiAlertConfig | undefined> = {
  cashDays: { threshold: 45, comparison: 'lt', description: '现金储备天数低于安全阈值' },
  receivable: { threshold: 1_000_000, comparison: 'gt', description: '应收账款突破风险阈值' },
};

export const REVENUE_PIPELINE: RevenueStream[] = [
  { name: '留学全案服务', value: 1_280_000, proportion: 0.39, yoy: 12.5 },
  { name: '语言培训', value: 720_000, proportion: 0.22, yoy: 21.3 },
  { name: '知识花园', value: 812_400, proportion: 0.25, yoy: 23.7 },
  { name: '企业培训 / 授权', value: 473_600, proportion: 0.14, yoy: 9.1 },
];

export const REVENUE_CHANNEL: RevenueStream[] = [
  { name: '线上渠道', value: 1_420_000, proportion: 0.43, yoy: 25.4 },
  { name: '线下校园活动', value: 610_000, proportion: 0.18, yoy: 8.6 },
  { name: '机构合作', value: 940_000, proportion: 0.28, yoy: 16.2 },
  { name: '渠道伙伴', value: 316_000, proportion: 0.11, yoy: 6.8 },
];

export const REVENUE_REGION: RevenueStream[] = [
  { name: '华东', value: 986_000, proportion: 0.3, yoy: 19.2 },
  { name: '华南', value: 812_000, proportion: 0.25, yoy: 14.5 },
  { name: '华北', value: 678_000, proportion: 0.21, yoy: 10.1 },
  { name: '海外/跨境', value: 450_000, proportion: 0.14, yoy: 27.8 },
  { name: '其他省份', value: 360_000, proportion: 0.1, yoy: 7.4 },
];

export const REVENUE_BY_DIMENSION: Record<'product' | 'channel' | 'region', RevenueStream[]> = {
  product: REVENUE_PIPELINE,
  channel: REVENUE_CHANNEL,
  region: REVENUE_REGION,
};

export const SPEND_STRUCTURE: SpendSlice[] = [
  { name: '人力成本', value: 38 },
  { name: '市场投放', value: 24 },
  { name: '合作方分成', value: 18 },
  { name: '办公与运营', value: 12 },
  { name: '技术与工具', value: 8 },
];

export const TAX_REMINDERS: TaxReminder[] = [
  {
    id: 'tax1',
    title: '增值税申报截止',
    dueDate: '11 月 15 日',
    severity: 'critical',
    description: '10 月发票勾选未完成，请在 11 月 13 日前完成认证。',
    owner: '财务会计 · Liu',
  },
  {
    id: 'tax2',
    title: '企业所得税季报',
    dueDate: '11 月 30 日',
    severity: 'warn',
    description: '补充海外收入合同，确认跨境收款合规凭证。',
    owner: '税务顾问 · Chen',
  },
  {
    id: 'tax3',
    title: '知识花园分润复核',
    dueDate: '12 月 5 日',
    severity: 'info',
    description: '确认作者佣金结算协议与代扣税票据齐备。',
    owner: '合规官 · May',
  },
];

export const LEDGER_FILTERS: LedgerFilterOption[] = [
  { label: '全部类型', value: 'all' },
  { label: '收入', value: 'income' },
  { label: '支出', value: 'expense' },
  { label: '退款', value: 'refund' },
  { label: '待审批', value: 'approval_pending' },
  { label: '知识花园收入', value: 'garden' },
];

export const LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'TRX-20241108-001',
    date: '2024-11-08',
    type: '收入',
    project: '知识花园 · 《加州文书实战营》',
    amount: 68_800,
    channel: '微信支付',
    counterparty: '批量订单 · 38 名',
    status: '已核销',
    approval: '通过',
    tags: ['知识花园', '线上课程'],
  },
  {
    id: 'TRX-20241107-017',
    date: '2024-11-07',
    type: '支出',
    project: '市场 · IELTS 社媒投放',
    amount: -42_600,
    channel: '支付宝企业',
    counterparty: '上海星火互动',
    status: '待确认',
    approval: '待审批',
    tags: ['市场投放', '广告'],
  },
  {
    id: 'TRX-20241106-009',
    date: '2024-11-06',
    type: '转账',
    project: '现金调拨',
    amount: -120_000,
    channel: '招行企业网银',
    counterparty: '境外备付账户',
    status: '已核销',
    approval: '通过',
    tags: ['资金调拨'],
  },
  {
    id: 'TRX-20241105-012',
    date: '2024-11-05',
    type: '退款',
    project: '留学全案（2025 Q1）',
    amount: -18_000,
    channel: 'Stripe',
    counterparty: '张* · 学生',
    status: '争议中',
    approval: '待审批',
    tags: ['退款', '留学服务'],
  },
  {
    id: 'TRX-20241104-021',
    date: '2024-11-04',
    type: '收入',
    project: '企业培训 · AI 招生工作坊',
    amount: 128_000,
    channel: '银行转账',
    counterparty: '启程教育集团',
    status: '已核销',
    approval: '通过',
    tags: ['B2B', '培训'],
  },
];

export const LEDGER_AGGREGATES = [
  { label: '本周新增收入', value: '¥ 456,800', tone: 'positive' as const },
  { label: '待审批支出', value: '¥ 92,600', tone: 'negative' as const },
  { label: '知识花园收入', value: '¥ 188,400', tone: 'positive' as const },
  { label: '对账完成率', value: '86%', tone: 'neutral' as const },
];

export const INVOICE_FILTERS: LedgerFilterOption[] = [
  { label: '全部发票', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '待寄出', value: 'shipping' },
  { label: '跨境', value: 'overseas' },
  { label: '作废', value: 'invalid' },
];

export const INVOICE_SUMMARY: InvoiceSummaryCard[] = [
  { label: '待开票金额', value: '¥ 186,400', tone: 'negative', description: '涉及 12 张待审核发票' },
  { label: '本月已开票', value: '¥ 912,800', tone: 'positive', description: '较上月 +16.8%' },
  { label: '跨境发票', value: '¥ 128,600', tone: 'neutral', description: '需额外合规复核' },
  { label: '作废率', value: '1.8%', tone: 'neutral', description: '目标 ≤ 3%' },
];

export const INVOICE_RECORDS: InvoiceRecord[] = [
  {
    id: 'INV-202411-001',
    type: '增值税专用',
    client: '广州启途教育科技有限公司',
    project: '知识花园 · 联合课程授权',
    amount: 86_400,
    taxRate: 0.13,
    issuedAt: '2024-11-05',
    status: '待审核',
    approver: '财务经理 · Li',
    relatedTransaction: 'TRX-20241104-021',
  },
  {
    id: 'INV-202411-004',
    type: '增值税普通',
    client: '深圳蓝峰高中',
    project: '留学全案服务 · 2025 候选班',
    amount: 128_000,
    taxRate: 0.06,
    issuedAt: '2024-11-06',
    status: '已开票',
    logistics: {
      company: '顺丰速运',
      trackingNo: 'SF1425367890',
      shippedAt: '2024-11-07',
    },
    relatedTransaction: 'TRX-20241107-017',
  },
  {
    id: 'INV-202411-007',
    type: '跨境电子',
    client: '香港星汇教育集团',
    project: 'AI 招生培训 · 企业版',
    amount: 76_200,
    taxRate: 0,
    issuedAt: '2024-11-09',
    status: '草稿',
    relatedTransaction: 'TRX-20241105-012',
  },
  {
    id: 'INV-202410-032',
    type: '增值税专用',
    client: '北京环亚教育科技有限公司',
    project: '语言培训 · IELTS 冲刺班',
    amount: 54_200,
    taxRate: 0.06,
    issuedAt: '2024-10-28',
    status: '已寄出',
    logistics: {
      company: '京东物流',
      trackingNo: 'JD9834124576',
      shippedAt: '2024-10-29',
    },
    relatedTransaction: 'TRX-20241025-015',
  },
];

export const TAX_KPIS: TaxKpi[] = [
  {
    id: 'vat-payable',
    label: '本月增值税应缴',
    value: '¥ 286,400',
    trend: 'up',
    delta: '+12.4%',
    description: '含一般纳税人销项税额，建议关注进项抵扣凭证收集进度。',
  },
  {
    id: 'cit-forecast',
    label: '季度企业所得税预估',
    value: '¥ 512,800',
    trend: 'steady',
    delta: '+1.5%',
    description: '按最新利润预测推算，需确认研发费用加计扣除资料是否齐备。',
  },
  {
    id: 'pit-withhold',
    label: '本月个税代扣',
    value: '¥ 146,900',
    trend: 'down',
    delta: '-4.7%',
    description: '人员调整后，薪酬结构变化导致代扣下降。',
  },
  {
    id: 'compliance-score',
    label: '合规完成率',
    value: '92%',
    trend: 'up',
    delta: '+3%',
    description: '申报资料及时上传，剩余任务集中在进项票认证。',
  },
];

export const TAX_CALENDAR: TaxCalendarItem[] = [
  {
    id: 'cal-1',
    date: '11-13',
    taxType: '增值税',
    title: '本月增值税发票勾选认证',
    owner: '税务会计 · Liu',
    status: '处理中',
    actions: ['查看凭证', '标记完成'],
  },
  {
    id: 'cal-2',
    date: '11-15',
    taxType: '增值税',
    title: '增值税申报提交（一般纳税人）',
    owner: '税务会计 · Liu',
    status: '待处理',
    actions: ['上传申报表'],
  },
  {
    id: 'cal-3',
    date: '11-25',
    taxType: '个人所得税',
    title: '个税月度申报',
    owner: '薪酬组 · Amy',
    status: '待处理',
    actions: ['导入薪酬表', '触发审批'],
  },
  {
    id: 'cal-4',
    date: '12-10',
    taxType: '企业所得税',
    title: '企业所得税季报（2024 Q4 预填）',
    owner: '税务顾问 · Chen',
    status: '处理中',
    actions: ['查看预填', '收集票据'],
  },
];

export const TAX_TASKS: TaxTask[] = [
  {
    id: 'task-1',
    title: '整理 11 月进项发票影像资料',
    owner: '财务会计 · Zoe',
    priority: 'high',
    dueDate: '11-12',
    status: '进行中',
    notes: '重点跟进供应商：上海星火互动、广州启途教育',
  },
  {
    id: 'task-2',
    title: '准备企业所得税加计扣除资料',
    owner: '税务顾问 · Chen',
    priority: 'medium',
    dueDate: '11-22',
    status: '待办',
    notes: '需研发部门提供新版费用分配表',
  },
  {
    id: 'task-3',
    title: '核对个税薪酬数据并生成个税申报表',
    owner: '薪酬组 · Amy',
    priority: 'high',
    dueDate: '11-23',
    status: '待审批',
    notes: '等待 HR 审批最新离职人员补税信息',
  },
  {
    id: 'task-4',
    title: '更新税务稽核检查清单',
    owner: '合规官 · May',
    priority: 'low',
    dueDate: '11-30',
    status: '待办',
  },
];
