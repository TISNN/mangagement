import { useEffect, useMemo, useState } from 'react';

import {
  Download,
  Filter,
  Loader2,
  Search,
  Sparkles,
  Table2,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';

import { financeService } from '@/services/finance/financeService';
import {
  LEDGER_FILTERS,
} from '../data';
import type { LedgerTransaction } from '../types';

export const FinanceLedgerTab = () => {
  const [ledgerFilter, setLedgerFilter] = useState<string>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [aggregates, setAggregates] = useState<any[]>([]);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const allTransactions = await financeService.getAllTransactions();
        
        // 转换为 LedgerTransaction 格式
        const formattedTransactions: LedgerTransaction[] = allTransactions.map((t: any) => ({
          id: `TRX-${t.id}`,
          date: t.transaction_date,
          type: t.direction as '收入' | '支出' | '转账' | '退款' | '税费',
          project: t.project?.name || t.service_type?.name || t.notes || '未分类',
          amount: Number(t.amount) * (t.direction === '收入' ? 1 : -1),
          channel: t.account?.name || '未知渠道',
          counterparty: t.person?.name || t.student_ref_id || t.employee_ref_id || '未知',
          status: t.status === '已完成' ? '已核销' : t.status === '待收款' || t.status === '待支付' ? '待确认' : '争议中',
          approval: t.status === '已完成' ? '通过' : t.status === '待收款' || t.status === '待支付' ? '待审批' : '驳回',
          tags: t.category?.name ? [t.category.name] : []
        }));
        
        setTransactions(formattedTransactions);
        
        // 计算聚合数据
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekTransactions = formattedTransactions.filter(t => new Date(t.date) >= weekStart);
        
        const weekIncome = weekTransactions
          .filter(t => t.type === '收入')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const pendingExpense = formattedTransactions
          .filter(t => t.type === '支出' && t.approval === '待审批')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const gardenIncome = formattedTransactions
          .filter(t => t.tags.includes('知识花园') || t.project.includes('知识花园'))
          .reduce((sum, t) => sum + (t.type === '收入' ? Math.abs(t.amount) : 0), 0);
        
        setAggregates([
          { label: '本周新增收入', value: `¥ ${weekIncome.toLocaleString()}`, tone: 'positive' as const },
          { label: '待审批支出', value: `¥ ${pendingExpense.toLocaleString()}`, tone: 'negative' as const },
          { label: '知识花园收入', value: `¥ ${gardenIncome.toLocaleString()}`, tone: 'positive' as const },
          { label: '对账完成率', value: '86%', tone: 'neutral' as const },
        ]);
      } catch (error) {
        console.error('加载财务流水数据失败', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredLedger = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();
    return transactions.filter((trx) => {
      const matchKeyword =
        !lowerKeyword ||
        trx.id.toLowerCase().includes(lowerKeyword) ||
        trx.project.toLowerCase().includes(lowerKeyword) ||
        trx.counterparty.toLowerCase().includes(lowerKeyword);

      const matchFilter = (() => {
        switch (ledgerFilter) {
          case 'income':
            return trx.type === '收入';
          case 'expense':
            return trx.type === '支出';
          case 'refund':
            return trx.type === '退款';
          case 'approval_pending':
            return trx.approval === '待审批';
          case 'garden':
            return trx.tags.some((tag: string) => tag.includes('知识花园')) || trx.project.includes('知识花园');
          default:
            return true;
        }
      })();

      return matchKeyword && matchFilter;
    });
  }, [ledgerFilter, keyword, transactions]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索交易编号 / 项目 / 合作方"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-600 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {LEDGER_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setLedgerFilter(filter.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  ledgerFilter === filter.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Filter className="h-4 w-4" />
            高级筛选
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Download className="h-4 w-4" />
            导出流水
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            导入对账单
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {aggregates.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              {item.tone === 'positive' ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">趋势良好</span>
                </>
              ) : item.tone === 'negative' ? (
                <>
                  <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-rose-500">需要关注</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-400">保持监控</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
          <span>共 {filteredLedger.length} 条结果 · 支持列视图、保存筛选条件</span>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Table2 className="h-3.5 w-3.5" />
              列设置
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              智能聚合
            </button>
          </div>
        </div>
        <div className="max-h-[460px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left font-medium">交易编号</th>
                <th className="px-6 py-3 text-left font-medium">日期</th>
                <th className="px-6 py-3 text-left font-medium">项目 / 内容</th>
                <th className="px-6 py-3 text-right font-medium">金额</th>
                <th className="px-6 py-3 text-left font-medium">渠道</th>
                <th className="px-6 py-3 text-left font-medium">往来方</th>
                <th className="px-6 py-3 text-left font-medium">状态</th>
                <th className="px-6 py-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900/40">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      正在加载对账数据...
                    </div>
                  </td>
                </tr>
              ) : filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <Table2 className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium text-gray-900 dark:text-white">暂无财务流水数据</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {keyword ? '没有找到匹配的交易记录' : '当前没有财务流水记录，请添加交易记录'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{transaction.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-gray-100">{transaction.project}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {transaction.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${transaction.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {transaction.amount >= 0 ? '+' : '-'}¥ {Math.abs(transaction.amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{transaction.channel}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{transaction.counterparty}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            transaction.status === '已核销'
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : transaction.status === '争议中'
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}
                        >
                          {transaction.status}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            transaction.approval === '通过'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                              : transaction.approval === '待审批'
                                ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                          }`}
                        >
                          {transaction.approval}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
