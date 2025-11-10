import React, { useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarClock,
  ClipboardCheck,
  Filter,
  Flame,
  Mail,
  MapPin,
  MoveUpRight,
  PhoneCall,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Users,
} from 'lucide-react';

interface KpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'stable';
}

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  conversionRate: number;
  avgDuration: string;
  trend: 'up' | 'down' | 'stable';
}

interface ChannelPerformance {
  id: string;
  name: string;
  leads: number;
  deals: number;
  cost: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
  tag: string;
}

interface HotLead {
  id: string;
  name: string;
  program: string;
  heatLevel: '高' | '中' | '低';
  score: number;
  lastInteraction: string;
  owner: string;
  recommendedAction: string;
  tags: string[];
}

interface ActionItemGroup {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    id: string;
    title: string;
    owner: string;
    deadline: string;
    status: 'warning' | 'info' | 'success';
  }>;
}

const KPI_METRICS: KpiMetric[] = [
  { id: 'leads-total', label: '线索总量', value: '3,482', change: '+12.4% 较上月', changeType: 'up' },
  { id: 'new-today', label: '今日新增', value: '48', change: '较昨日 +6', changeType: 'up' },
  { id: 'conversion', label: '签约转化率', value: '28.7%', change: '+1.3% 环比', changeType: 'up' },
  { id: 'response-time', label: '平均响应时长', value: '2.6h', change: '-0.8h', changeType: 'down' },
  { id: 'sla-overdue', label: 'SLA 超时', value: '12', change: '待处理 6', changeType: 'stable' },
];

const FUNNEL_STAGES: FunnelStage[] = [
  { id: 'stage-1', name: '新增线索', count: 982, conversionRate: 100, avgDuration: '—', trend: 'up' },
  { id: 'stage-2', name: '初次沟通', count: 756, conversionRate: 77, avgDuration: '16h', trend: 'stable' },
  { id: 'stage-3', name: '深度沟通', count: 418, conversionRate: 55, avgDuration: '2.8d', trend: 'down' },
  { id: 'stage-4', name: '合同拟定', count: 162, conversionRate: 39, avgDuration: '4.1d', trend: 'up' },
  { id: 'stage-5', name: '签约&收款', count: 112, conversionRate: 28, avgDuration: '6.4d', trend: 'up' },
];

const CHANNEL_PERFORMANCE: ChannelPerformance[] = [
  { id: 'channel-1', name: '高校宣讲会', leads: 320, deals: 52, cost: 42000, roi: 4.2, trend: 'up', tag: '热' },
  { id: 'channel-2', name: '线上广告', leads: 680, deals: 84, cost: 56000, roi: 2.1, trend: 'stable', tag: '需优化' },
  { id: 'channel-3', name: '学员转介绍', leads: 210, deals: 68, cost: 9000, roi: 6.5, trend: 'up', tag: '高价值' },
  { id: 'channel-4', name: '内容运营', leads: 410, deals: 36, cost: 18000, roi: 2.4, trend: 'down', tag: '待观察' },
];

const HOT_LEADS: HotLead[] = [
  {
    id: 'lead-001',
    name: '赵思敏',
    program: '2025FALL 美国 CS 硕士',
    heatLevel: '高',
    score: 92,
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
    score: 88,
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
    score: 76,
    lastInteraction: '2025-11-05 20:12 微信',
    owner: '张寒',
    recommendedAction: '发送高校资料包，预约下周顾问深聊',
    tags: ['推荐人', '双非本科', '预算充足'],
  },
];

const ACTION_GROUPS: ActionItemGroup[] = [
  {
    title: '待分配线索 (12)',
    description: '需在 4 小时内完成分配，避免首响延迟。',
    icon: <Users className="h-4 w-4" />, 
    items: [
      { id: 'assign-01', title: '上海教育展 - 赵琳', owner: '未分配', deadline: '今日 12:00', status: 'warning' },
      { id: 'assign-02', title: '官微咨询 - 王博', owner: '未分配', deadline: '今日 15:30', status: 'warning' },
      { id: 'assign-03', title: 'TOEFL 105 咨询 - 李嫣', owner: '待确认', deadline: '今日 18:00', status: 'info' },
    ],
  },
  {
    title: '超时未跟进 (8)',
    description: '超过 SLA 24h 未响应，将自动升级给经理。',
    icon: <TimerReset className="h-4 w-4" />, 
    items: [
      { id: 'overdue-01', title: '张嘉琪 - 初次沟通', owner: '童瑶', deadline: '逾期 2h', status: 'warning' },
      { id: 'overdue-02', title: '周逸 - 深度沟通', owner: '汪洋', deadline: '逾期 6h', status: 'warning' },
      { id: 'overdue-03', title: '刘畅 - 资料评估', owner: '林骁', deadline: '逾期 14h', status: 'warning' },
    ],
  },
  {
    title: '客户新回复 (5)',
    description: '建议在 2 小时内回复，提升体验与热度。',
    icon: <Bell className="h-4 w-4" />, 
    items: [
      { id: 'reply-01', title: '赵思敏 邮件：咨询 MIT 推荐信', owner: '丁若楠', deadline: '2 小时内', status: 'info' },
      { id: 'reply-02', title: '贾晨 微信：想了解奖学金', owner: '张寒', deadline: '4 小时内', status: 'info' },
      { id: 'reply-03', title: '董蕾 邮件：预约文书顾问', owner: '赵婧怡', deadline: '4 小时内', status: 'info' },
    ],
  },
];

const SLA_OVERVIEW = [
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

const TREND_SUMMARY = [
  {
    title: '渠道趋势',
    icon: <TrendingUp className="h-4 w-4" />,
    content: '高校宣讲会贡献签约 +18%，学员转介绍转化率 32%，保持高位。线上广告 CPL 略高，建议优化投放素材。',
  },
  {
    title: '处理效率',
    icon: <TimerReset className="h-4 w-4" />,
    content: '首响平均 2.6 小时，深度沟通准备素材耗时上升，需补充自动化资料包与脚本。',
  },
  {
    title: '风险提醒',
    icon: <AlertTriangle className="h-4 w-4" />,
    content: '华东区域 SLA 下滑，部分顾问假期未交接；线上运营线索重复率高，影响评分。',
  },
];

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  switch (trend) {
    case 'up':
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    case 'down':
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-400" />;
  }
};

const crmTheme = {
  sectionTitle: 'text-lg font-semibold text-gray-900 dark:text-white',
  sectionDescription: 'text-sm text-gray-500 dark:text-gray-400',
  cardBase: 'rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60',
  subCard: 'rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60',
};

const StatusBadge: React.FC<{ type: 'warning' | 'info' | 'success' }> = ({ type }) => {
  const styleMap: Record<typeof type, string> = {
    warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
    info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${styleMap[type]}`}>SLA</span>;
};

const CRMLeadOverviewPage: React.FC = () => {
  const funnelTotals = useMemo(() => {
    const head = FUNNEL_STAGES[0]?.count ?? 0;
    const tail = FUNNEL_STAGES[FUNNEL_STAGES.length - 1]?.count ?? 1;
    const overallConversion = head === 0 ? 0 : Math.round((tail / head) * 1000) / 10;
    return {
      totalLeads: head,
      signedDeals: tail,
      overallConversion,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">线索总览</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Lead Overview · CRM Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            汇总所有渠道线索表现、漏斗转化、处理效率与 AI 优先级推荐，帮助销售团队聚焦高价值机遇，确保 SLA 合规，并为市场运营提供渠道策略依据。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Filter className="h-4 w-4" />
            保存视图
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            启动自动评分
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {KPI_METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.label}</span>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {metric.changeType === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
              {metric.changeType === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />}
              {metric.changeType === 'stable' && <Activity className="h-3.5 w-3.5 text-gray-400" />}
              <span
                className={
                  metric.changeType === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : metric.changeType === 'down'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className={`${crmTheme.cardBase} xl:col-span-2`}>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>漏斗表现</h2>
              <p className={crmTheme.sectionDescription}>实时跟踪各阶段转化与处理时长，识别瓶颈环节。</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1"><TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> 转化提升</span>
              <span className="inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-gray-400" /> 稳定</span>
              <span className="inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-orange-500" /> 风险</span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              {FUNNEL_STAGES.map((stage, index) => (
                <div key={stage.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{stage.name}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">平均处理时长：{stage.avgDuration}</div>
                    </div>
                    {getTrendIcon(stage.trend)}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>线索 {stage.count}</span>
                      <span>转化 {stage.conversionRate}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === FUNNEL_STAGES.length - 1 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.max(stage.conversionRate, 12)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-5 text-sm text-indigo-700 dark:border-indigo-900/30 dark:bg-indigo-900/20 dark:text-indigo-200">
                <div className="text-xs uppercase tracking-wide">综合表现</div>
                <div className="mt-3 text-2xl font-semibold text-indigo-900 dark:text-white">{funnelTotals.overallConversion}%</div>
                <div className="mt-1 text-xs text-indigo-600/80 dark:text-indigo-300/80">总转化率</div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-indigo-100/60 bg-white/70 p-3 dark:border-indigo-900/20 dark:bg-indigo-900/30">
                    <div className="text-indigo-500">总线索</div>
                    <div className="mt-1 text-base font-semibold text-indigo-900 dark:text-white">{funnelTotals.totalLeads}</div>
                  </div>
                  <div className="rounded-lg border border-indigo-100/60 bg-white/70 p-3 dark:border-indigo-900/20 dark:bg-indigo-900/30">
                    <div className="text-indigo-500">已签约</div>
                    <div className="mt-1 text-base font-semibold text-indigo-900 dark:text-white">{funnelTotals.signedDeals}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                {TREND_SUMMARY.map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-700/40 dark:text-gray-300">
                    <div className="text-blue-500">{item.icon}</div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                      <p className="mt-1 leading-5">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={crmTheme.cardBase}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>渠道洞察</h2>
              <p className={crmTheme.sectionDescription}>评估各渠道效率、成本与转化表现。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <MoveUpRight className="h-3.5 w-3.5" />
              查看报表
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {CHANNEL_PERFORMANCE.map((channel) => (
              <div key={channel.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{channel.name}</span>
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                        {channel.tag}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="h-3.5 w-3.5" /> {channel.leads} 线索
                      <Target className="h-3.5 w-3.5" /> {channel.deals} 签约
                      <MapPin className="h-3.5 w-3.5" /> ROI {channel.roi}x
                    </div>
                  </div>
                  {getTrendIcon(channel.trend)}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <div>
                    <div>获取成本</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">¥{channel.cost.toLocaleString()}</div>
                  </div>
                  <div>
                    <div>签约率</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{Math.round((channel.deals / channel.leads) * 100)}%</div>
                  </div>
                  <div>
                    <div>环比</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {channel.trend === 'up' ? '+13%' : channel.trend === 'down' ? '-6%' : '持平'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className={`${crmTheme.cardBase} xl:col-span-2`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>AI 热度优先级</h2>
              <p className={crmTheme.sectionDescription}>结合互动频次、意向程度、财务能力等多维数据生成热度与推荐动作。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              查看评分模型
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {HOT_LEADS.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{lead.name}</span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          lead.heatLevel === '高'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : lead.heatLevel === '中'
                              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300'
                        }`}
                      >
                        热度 {lead.heatLevel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{lead.program}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-blue-500 dark:text-blue-300">
                      {lead.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/30">
                          <Sparkles className="h-3 w-3" /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-semibold text-blue-600 dark:text-blue-300">{lead.score}</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">AI LQA 评分</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><PhoneCall className="h-3.5 w-3.5" /> {lead.owner}</span>
                  <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {lead.lastInteraction}</span>
                </div>
                <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                  <div className="font-medium text-blue-700 dark:text-blue-200">推荐动作</div>
                  <p className="mt-1">{lead.recommendedAction}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                    <PhoneCall className="h-3.5 w-3.5" /> 创建通话
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                    <Mail className="h-3.5 w-3.5" /> 发送资料
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                    <CalendarClock className="h-3.5 w-3.5" /> 预约会议
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={crmTheme.cardBase}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>今日动作中心</h2>
              <p className={crmTheme.sectionDescription}>聚焦需要立即处理的分配、响应与客户反馈事项。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <ClipboardCheck className="h-3.5 w-3.5" />
              生成待办
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {ACTION_GROUPS.map((group) => (
              <div key={group.title} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{group.title}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{group.description}</span>
                    </div>
                  </div>
                  <div className="text-blue-500">{group.icon}</div>
                </div>
                <div className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-700/40 dark:text-gray-300">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-medium text-gray-900 dark:text-white">{item.title}</div>
                        <StatusBadge type={item.status} />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {item.owner}</span>
                        <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {item.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={crmTheme.cardBase}>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className={crmTheme.sectionTitle}>SLA 与效率监控</h2>
            <p className={crmTheme.sectionDescription}>确保响应时效达标，并及时提示异常团队与改进建议。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Target className="h-3.5 w-3.5" />
              配置 SLA
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Activity className="h-3.5 w-3.5" />
              查看升级记录
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SLA_OVERVIEW.map((sla) => (
            <div key={sla.title} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{sla.title}</div>
              <div className={`mt-3 text-2xl font-bold ${sla.color}`}>{sla.value}</div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{sla.target}</div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-5">{sla.description}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <Flame className="mt-0.5 h-4 w-4 text-orange-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">建议动作</div>
              <ul className="mt-2 space-y-1 leading-5">
                <li>• 针对深度沟通阶段的资料准备，补充自动化资料包与顾问脚本。</li>
                <li>• 华东团队排班错峰，建立节假日线索转派机制，避免 SLA 断层。</li>
                <li>• 线上广告渠道进行 A/B 测试，优化表单体验与咨询路径。</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CRMLeadOverviewPage;
