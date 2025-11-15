import React from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Flame,
  ListChecks,
  MapPin,
  MoveUpRight,
  PhoneCall,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';

import type {
  ActionItemGroup,
  ChannelPerformance,
  FunnelStage,
  HotLead,
  KpiMetric,
  QuickFilter,
  SlaMetric,
  TrendInsight,
  ViewDefinition,
} from '../types';
import { crmTheme, getFunnelTrendIcon, heatBadgeMap, trendIndicator, StatusBadge } from '../utils';

interface FunnelTotals {
  totalLeads: number;
  signedDeals: number;
  overallConversion: number;
}

interface LeadOverviewTabProps {
  kpiMetrics: KpiMetric[];
  quickFilters: QuickFilter[];
  savedViews: ViewDefinition[];
  funnelStages: FunnelStage[];
  funnelTotals: FunnelTotals;
  trendSummary: TrendInsight[];
  channelPerformance: ChannelPerformance[];
  hotLeads: HotLead[];
  actionGroups: ActionItemGroup[];
  slaOverview: SlaMetric[];
}

const LeadOverviewTab: React.FC<LeadOverviewTabProps> = ({
  kpiMetrics,
  quickFilters,
  savedViews,
  funnelStages,
  funnelTotals,
  trendSummary,
  channelPerformance,
  hotLeads,
  actionGroups,
  slaOverview,
}) => {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiMetrics.map((item) => (
          <div key={item.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{item.label}</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {trendIndicator(item.changeType)}
              <span
                className={
                  item.changeType === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : item.changeType === 'down'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">快捷筛选</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">集中处理当天必做线索、待分配名单与高热度机会。</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <ListChecks className="h-3.5 w-3.5" />
            管理筛选器
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-600 hover:bg-blue-100 dark:border-blue-500/60 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <Sparkles className="h-3 w-3" />
              {filter.label}
              <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-800 dark:text-blue-200">
                {filter.value}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">预设视图</h3>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <ClipboardList className="h-3.5 w-3.5" /> 新建视图
            </button>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {savedViews.map((view) => (
              <div key={view.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{view.name}</div>
                    <div className="mt-1 text-gray-500 dark:text-gray-400">{view.description}</div>
                  </div>
                  {view.isShared && (
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Users className="mr-1 h-3 w-3" /> 共享
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

          <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="space-y-4">
              {funnelStages.map((stage, index) => (
                <div key={stage.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{stage.name}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">平均处理时长：{stage.avgDuration}</div>
                    </div>
                    {getFunnelTrendIcon(stage.trend)}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>线索 {stage.count}</span>
                      <span>转化 {stage.conversionRate}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === funnelStages.length - 1 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
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
                {trendSummary.map((item) => (
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
            {channelPerformance.map((channel) => (
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
                  {getFunnelTrendIcon(channel.trend)}
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
              <h2 className={crmTheme.sectionTitle}>重点线索推荐</h2>
              <p className={crmTheme.sectionDescription}>结合阶段、互动频次与风险等级，生成建议优先跟进的线索清单。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" /> 优先级设置
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {hotLeads.map((lead) => (
              <div key={lead.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{lead.name}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${heatBadgeMap[lead.heatLevel]}`}>
                        关注度 {lead.heatLevel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{lead.program}</div>
                    <div className="mt-2 text-[11px] text-blue-500 dark:text-blue-300">优先级 {lead.priorityLabel || '中'}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                      {lead.priorityLabel || '优先级中'}
                    </span>
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
              <ClipboardList className="h-3.5 w-3.5" /> 生成待办
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {actionGroups.map((group) => (
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
              <Target className="h-3.5 w-3.5" /> 配置 SLA
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Activity className="h-3.5 w-3.5" /> 查看升级记录
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {slaOverview.map((sla) => (
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
    </>
  );
};

export default LeadOverviewTab;
