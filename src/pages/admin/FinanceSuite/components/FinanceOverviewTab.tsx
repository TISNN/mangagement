import { useEffect, useMemo, useState } from 'react';

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
  ArrowDownToLine,
  BarChart3,
  TrendingUp,
  Loader2,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { financeService } from '@/services/finance/financeService';
import { KpiCard } from './KpiCard';
import {
  KPI_ALERTS,
  PERIOD_OPTIONS,
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
  const [displayKpis, setDisplayKpis] = useState<KpiCardConfig[]>([]);
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [spendStructure, setSpendStructure] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // 并行加载所有数据
        const [transactions, invoices, revenueData, spendData] = await Promise.all([
          financeService.getAllTransactions(),
          financeService.getAllInvoices(),
          financeService.calculateRevenueStreams(),
          financeService.calculateSpendStructure()
        ]);
        
        // 计算 KPI
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        
        const currentMonthIncome = transactions
          .filter(t => {
            const date = new Date(t.transaction_date);
            return date >= currentMonthStart && date <= currentMonthEnd && t.direction === '收入' && t.status === '已完成';
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const lastMonthIncome = transactions
          .filter(t => {
            const date = new Date(t.transaction_date);
            return date >= lastMonthStart && date <= lastMonthEnd && t.direction === '收入' && t.status === '已完成';
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const incomeDelta = lastMonthIncome > 0 ? ((currentMonthIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : '0';
        
        const currentMonthExpense = transactions
          .filter(t => {
            const date = new Date(t.transaction_date);
            return date >= currentMonthStart && date <= currentMonthEnd && t.direction === '支出' && t.status === '已完成';
          })
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const grossMargin = currentMonthIncome > 0 ? ((currentMonthIncome - currentMonthExpense) / currentMonthIncome * 100).toFixed(1) : '0';
        
        const receivable = transactions
          .filter(t => t.direction === '收入' && (t.status === '待收款' || t.status === '待支付'))
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const kpis: KpiCardConfig[] = [
          {
            id: 'revenue',
            label: '本月收入',
            value: `¥ ${currentMonthIncome.toLocaleString()}`,
            delta: `${incomeDelta.startsWith('-') ? '' : '+'}${incomeDelta}%`,
            tone: Number(incomeDelta) >= 0 ? 'positive' : 'negative',
            caption: '较上月',
            description: '课程服务、知识花园 GMV、企业授权等合计确认收入。',
            icon: TrendingUp,
          },
          {
            id: 'grossMargin',
            label: '毛利率',
            value: `${grossMargin}%`,
            delta: '+0pp',
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
            value: `¥ ${receivable.toLocaleString()}`,
            delta: '+0%',
            tone: 'negative',
            caption: '较上期',
            description: '已确认收入但尚未回款的总额，需要催收跟进。',
            icon: ArrowDownToLine,
          },
        ];
        
        setDisplayKpis(kpis);
        setRevenueStreams(revenueData);
        setSpendStructure(spendData);
        
        // 格式化最近发票
        const formattedInvoices = invoices
          .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
          .slice(0, 5)
          .map((inv: any) => ({
            id: inv.invoice_number || `INV-${inv.id}`,
            client: inv.client_name,
            project: inv.project_name || '未分类',
            amount: Number(inv.amount),
            issuedAt: inv.issued_at,
            status: inv.status
          }));
        
        setRecentInvoices(formattedInvoices);
      } catch (error) {
        console.error('加载财务概览数据失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [period]);

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
              {spendStructure.map((slice) => (
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
          {/* 税务提醒：可以从 finance_tax_calendar 表加载，暂时显示空状态 */}
          <div className="col-span-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-400">
            暂无税务提醒数据（可从 finance_tax_calendar 表加载）
          </div>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              正在加载发票数据...
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-800/40">
              <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-sm font-medium text-gray-900 dark:text-white">暂无最近发票</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">当前没有发票记录</p>
            </div>
          ) : (
            recentInvoices.map((invoice) => (
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
            ))
          )}
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
