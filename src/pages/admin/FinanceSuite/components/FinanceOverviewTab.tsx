import { useMemo, useState } from 'react';

import {
  AlertCircle,
  ArrowUpRight,
  FileText,
  Filter,
  Info,
  Mail,
  Pencil,
  PieChart,
  Clock,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { KpiCard } from './KpiCard';
import {
  INVOICE_RECORDS,
  KPI_ALERTS,
  KPI_CARDS,
  KPI_VARIATIONS,
  PERIOD_OPTIONS,
  REVENUE_BY_DIMENSION,
  SPEND_STRUCTURE,
  TAX_REMINDERS,
} from '../data';
import type { KpiCardConfig, PeriodOption, RevenueStream } from '../types';

interface Props {
  onNavigateInvoices: () => void;
}

export const FinanceOverviewTab = ({ onNavigateInvoices }: Props) => {
  const [period, setPeriod] = useState<PeriodOption>('mom');
  const [revenueView, setRevenueView] = useState<'product' | 'channel' | 'region'>('product');
  const [selectedKpi, setSelectedKpi] = useState<KpiCardConfig | null>(null);
  const [selectedRevenue, setSelectedRevenue] = useState<RevenueStream | null>(null);

  const displayKpis = useMemo(
    () =>
      KPI_CARDS.map((card) => ({
        ...card,
        ...KPI_VARIATIONS[period][card.id],
      })),
    [period],
  );

  const revenueStreams = useMemo(() => REVENUE_BY_DIMENSION[revenueView], [revenueView]);

  const recentInvoices = useMemo(
    () =>
      [...INVOICE_RECORDS]
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
        .slice(0, 5),
    [],
  );

  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">关键指标速览</h2>
          <div className="flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setPeriod(option.key)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  period === option.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {displayKpis.map((card) => {
            const baseCard = KPI_CARDS.find((item) => item.id === card.id)!;
            const alertRule = KPI_ALERTS[card.id];
            const rawValue = parseFloat(card.value.replace(/[^0-9.-]/g, ''));
            const showAlert =
              alertRule &&
              ((alertRule.comparison === 'gt' && rawValue > alertRule.threshold) ||
                (alertRule.comparison === 'lt' && rawValue < alertRule.threshold));

            return (
              <button key={card.id} onClick={() => setSelectedKpi({ ...baseCard, ...card })} className="text-left">
                <KpiCard
                  config={
                    showAlert
                      ? {
                          ...card,
                          description: `${card.description} · ${alertRule.description}`,
                          tone: 'negative',
                        }
                      : card
                  }
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">收入管道拆解</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">产品线贡献度与同比表现</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <Filter className="h-3.5 w-3.5" />
                自定义维度
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {(
                [
                  { key: 'product', label: '产品线' },
                  { key: 'channel', label: '渠道' },
                  { key: 'region', label: '地区' },
                ] as const
              ).map((option) => (
                <button
                  key={option.key}
                  onClick={() => setRevenueView(option.key)}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    revenueView === option.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {revenueStreams.map((stream) => (
                <button
                  key={stream.name}
                  onClick={() => setSelectedRevenue(stream)}
                  className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-white dark:border-gray-700 dark:bg-gray-800/40 dark:hover:border-blue-500 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{stream.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">贡献 {Math.round(stream.proportion * 100)}%</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                        stream.yoy >= 0
                          ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-500/15 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      <ArrowUpRight className="h-3 w-3" />
                      {stream.yoy >= 0 ? '+' : ''}
                      {stream.yoy}%
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>¥ {stream.value.toLocaleString()}</span>
                      <span>签约 → 确认收入 → 净收入</span>
                    </div>
                    <div className="mt-2 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${stream.proportion * 100}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">支出结构</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">固定 vs 变量成本与预算偏差</p>
              </div>
              <PieChart className="h-6 w-6 text-blue-500" />
            </div>
            <div className="mt-6 space-y-4">
              {SPEND_STRUCTURE.map((slice) => (
                <div key={slice.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{slice.name}</span>
                    <span>{slice.value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${slice.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/25 dark:text-amber-200">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="h-4 w-4" />
              市场预算偏差
            </p>
            <p className="mt-3 leading-relaxed">
              IELTS 渠道投放较预算高出 9.4%，建议查看投放复盘并触发额度调整审批，确保 Q4 预算充足。
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                onClick={() => console.info('[FinanceSuite] 查看预算复盘')}
              >
                <FileText className="h-3.5 w-3.5" />
                查看复盘
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-blue-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-blue-500/60 dark:text-blue-300 dark:hover:border-blue-400 dark:hover:text-blue-200"
                onClick={() => console.info('[FinanceSuite] 打开预算调整审批')}
              >
                <Pencil className="h-3.5 w-3.5" />
                调整预算
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-6 text-sm text-blue-700 dark:border-blue-500/40 dark:bg-blue-900/25 dark:text-blue-200">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4" />
              现金流预警
            </p>
            <p className="mt-3 leading-relaxed">
              基准场景预计 W48 现金流短缺，建议推进 200k+ 回款并预留备用授信额度。
            </p>
            <div className="mt-4 flex gap-2 text-xs">
              <button
                className="inline-flex items-center gap-1 rounded-full border border-blue-200 px-3 py-1 text-blue-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-blue-500/60 dark:text-blue-300 dark:hover:border-blue-400 dark:hover:text-blue-200"
                onClick={() => console.info('[FinanceSuite] 添加回款计划')}
              >
                <Pencil className="h-3.5 w-3.5" />
                添加回款计划
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700"
                onClick={() => console.info('[FinanceSuite] 查看备用授信')}
              >
                <Info className="h-3.5 w-3.5" />
                授信详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">税务与合规提醒</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">节点、责任人及补充材料</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Mail className="h-3.5 w-3.5" />
            发送提醒
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TAX_REMINDERS.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                <Calendar className="h-4 w-4 text-blue-500" />
                {item.title}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">截止：{item.dueDate}</p>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {item.owner}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    item.severity === 'critical'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300'
                      : item.severity === 'warn'
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300'
                  }`}
                >
                  {item.severity === 'critical' ? '高风险' : item.severity === 'warn' ? '提醒' : '已跟进'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">最近发票</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">仅展示最新 5 条开票记录</p>
          </div>
          <button
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
            onClick={onNavigateInvoices}
          >
            查看全部发票
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800/40">
              <div className="min-w-[200px]">
                <p className="font-medium text-gray-900 dark:text-white">{invoice.id}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.client}</p>
              </div>
              <div className="flex flex-1 flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>项目：{invoice.project}</span>
                <span>金额：¥ {invoice.amount.toLocaleString()}</span>
                <span>日期：{invoice.issuedAt}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  invoice.status === '已开票'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : invoice.status === '待审核'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                      : invoice.status === '草稿'
                        ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                        : invoice.status === '已寄出'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                }`}
              >
                {invoice.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedKpi} onOpenChange={() => setSelectedKpi(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedKpi?.label}</DialogTitle>
            <DialogDescription>指标趋势与告警明细</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedKpi && (
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>当前值：{selectedKpi.value}</p>
                {selectedKpi.delta && <p>波动幅度：{selectedKpi.delta}</p>}
                <p>{selectedKpi.description}</p>
              </div>
            )}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
              KPI 趋势图占位（接入折线图或柱状图组件）
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>数据来源：财务流水 · 决算系统 · 知识花园 GMV</span>
              <span>更新时间：今日 07:30</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRevenue} onOpenChange={() => setSelectedRevenue(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedRevenue?.name} 收入趋势</DialogTitle>
            <DialogDescription>维度拆解与历史趋势</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {selectedRevenue && (
              <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">贡献占比</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{Math.round(selectedRevenue.proportion * 100)}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">同比增长</p>
                  <p className={`text-lg font-semibold ${selectedRevenue.yoy >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedRevenue.yoy >= 0 ? '+' : ''}
                    {selectedRevenue.yoy}%
                  </p>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-6 text-center text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
              收入趋势图占位（可接入折线/面积图）
            </div>
            <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400">
              <p>动作建议：</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>定制化渠道或地区专题活动，提高高潜渠道权重。</li>
                <li>结合 CRM 数据识别贡献 Top 10 客户，策划复购计划。</li>
                <li>对同比下滑的维度设置下阶段的增长目标。</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
