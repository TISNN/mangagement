import React from 'react';
import { BadgePercent, CalendarClock, ClipboardCheck, Filter, Headphones, NotebookPen, ShieldCheck, Sparkles, Users, FileText } from 'lucide-react';

import type { ChannelShare, EngagementRecord, QualityCheck, StatusMetric, TaskCard } from '../types';
import { CHANNEL_ICON_MAP, calculateChannelWidth, crmTheme, getStatusTrendIcon, heatBadgeMap, sentimentTextMap, StatusBadge } from '../utils';

interface LeadInsightsTabProps {
  statusMetrics: StatusMetric[];
  channelShare: ChannelShare[];
  channelTotal: number;
  engagementTimeline: EngagementRecord[];
  taskList: TaskCard[];
  totalTasks: number;
  overdueTasks: number;
  qualityChecks: QualityCheck[];
}

const LeadInsightsTab: React.FC<LeadInsightsTabProps> = ({
  statusMetrics,
  channelShare,
  channelTotal,
  engagementTimeline,
  taskList,
  totalTasks,
  overdueTasks,
  qualityChecks,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusMetrics.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.title}</span>
              <Sparkles className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{metric.subLabel}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {getStatusTrendIcon(metric.trend)}
              <span
                className={
                  metric.trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : metric.trend === 'down'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>渠道占比</span>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 space-y-3">
            {channelShare.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between gap-3 text-xs">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${channel.accent}`}>
                  {channel.label}
                </span>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <div className="h-1.5 w-24 rounded-full bg-gray-100 dark:bg-gray-700">
                    <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${calculateChannelWidth(channel, channelTotal)}%` }} />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{channel.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">沟通时间轴</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">按时间回看所有渠道记录，结合 AI 摘要与 TODO。</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Filter className="h-3.5 w-3.5" /> 筛选
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Sparkles className="h-3.5 w-3.5" /> AI 摘要
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {engagementTimeline.map((record) => (
                <div key={record.id} className="flex gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex flex-col items-center text-xs text-gray-400 dark:text-gray-500">
                    <div className="font-semibold text-gray-900 dark:text-white">{record.time.split(' ')[0]}</div>
                    <div>{record.time.split(' ')[1]}</div>
                    <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow dark:bg-gray-800">
                      {CHANNEL_ICON_MAP[record.channel]}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{record.channel}</div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{record.summary}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {record.owner}</span>
                          <span className={sentimentTextMap[record.sentiment].className}>{sentimentTextMap[record.sentiment].label}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {record.hasAttachment && (
                          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                            <FileText className="h-3.5 w-3.5" /> 查看附件
                          </button>
                        )}
                        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                          <NotebookPen className="h-3.5 w-3.5" /> 打开详情
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-3 text-xs leading-5 dark:border-gray-700 dark:bg-gray-800/80">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">AI 摘要</div>
                      <div className="mt-2 grid gap-3 md:grid-cols-3">
                        <div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">亮点</div>
                          <ul className="mt-1 list-disc pl-4 text-gray-600 dark:text-gray-300">
                            {record.aiSummary.highlights.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">待办</div>
                          <ul className="mt-1 list-disc pl-4 text-gray-600 dark:text-gray-300">
                            {record.aiSummary.todo.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] text-gray-400 dark:text-gray-500">风险</div>
                          <p className={`mt-1 ${record.aiSummary.risk ? heatBadgeMap[record.aiSummary.risk] : 'text-gray-500 dark:text-gray-400'}`}>
                            {record.aiSummary.risk ?? '无明显风险'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={crmTheme.cardBase}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>跟进任务</h2>
              <p className={crmTheme.sectionDescription}>今日需完成 {totalTasks} 项任务，待处理 SLA {overdueTasks} 项。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <ClipboardCheck className="h-3.5 w-3.5" />
              导出列表
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {taskList.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {task.owner}</span>
                      {task.channel && <span className="inline-flex items-center gap-1"><Headphones className="h-3.5 w-3.5" /> {task.channel}</span>}
                      <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {task.due}</span>
                    </div>
                  </div>
                  <StatusBadge type={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4">
        <div className={crmTheme.cardBase}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={crmTheme.sectionTitle}>质检记录</h2>
              <p className={crmTheme.sectionDescription}>抽查沟通质量，及时反馈改进建议。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <ShieldCheck className="h-3.5 w-3.5" /> 新建质检
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {qualityChecks.map((qc) => (
              <div key={qc.id} className="rounded-xl border border-gray-200 p-4 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{qc.target}</div>
                    <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">审核人：{qc.reviewer}</div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${qc.status === '待处理' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300' : qc.status === '已反馈' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                    {qc.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><BadgePercent className="h-3.5 w-3.5" /> 评分 {qc.score}</span>
                  <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {qc.createdAt}</span>
                </div>
                <ul className="mt-3 space-y-1 rounded-lg bg-gray-50 p-3 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300">
                  {qc.issues.map((issue) => (
                    <li key={issue}>• {issue}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LeadInsightsTab;
