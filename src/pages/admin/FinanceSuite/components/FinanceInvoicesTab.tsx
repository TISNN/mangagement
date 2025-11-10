import { useMemo, useState } from 'react';

import {
  Download,
  Filter,
  Sparkles,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  INVOICE_FILTERS,
  INVOICE_RECORDS,
  INVOICE_SUMMARY,
} from '../data';
import type { InvoiceRecord } from '../types';

export const FinanceInvoicesTab = () => {
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const filteredInvoices = useMemo(
    () =>
      INVOICE_RECORDS.filter((invoice) => {
        const matchFilter = (() => {
          switch (invoiceFilter) {
            case 'pending':
              return invoice.status === '待审核';
            case 'shipping':
              return invoice.status === '已寄出';
            case 'overseas':
              return invoice.type === '跨境电子';
            case 'invalid':
              return invoice.status === '作废';
            default:
              return true;
          }
        })();

        return matchFilter;
      }),
    [invoiceFilter],
  );

  return (
    <>
      <section className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {INVOICE_SUMMARY.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.label}</p>
              <p
                className={`mt-2 text-lg font-semibold ${
                  card.tone === 'positive'
                    ? 'text-emerald-500'
                    : card.tone === 'negative'
                      ? 'text-rose-500'
                      : 'text-gray-900 dark:text-white'
                }`}
              >
                {card.value}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {INVOICE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setInvoiceFilter(filter.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    invoiceFilter === filter.value
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" onClick={() => console.info('[FinanceSuite] 导出台账')}>
                <Download className="h-3.5 w-3.5" />
                发票报表
              </button>
              <button className="inline-flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1 text-white shadow-sm transition hover:bg-blue-700" onClick={() => console.info('[FinanceSuite] 新建发票')}>
                <Sparkles className="h-3.5 w-3.5" />
                新建发票
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-6 py-3 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
            <span>共 {filteredInvoices.length} 张发票 · 可导出报表</span>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <Filter className="h-3.5 w-3.5" />
                高级筛选
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-[11px] font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                自动开票
              </button>
            </div>
          </div>
          <div className="max-h-[440px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
              <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">发票编号</th>
                  <th className="px-6 py-3 text-left font-medium">类型</th>
                  <th className="px-6 py-3 text-left font-medium">客户 / 项目</th>
                  <th className="px-6 py-3 text-right font-medium">金额</th>
                  <th className="px-6 py-3 text-left font-medium">开票日期</th>
                  <th className="px-6 py-3 text-left font-medium">状态</th>
                  <th className="px-6 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900/40">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{invoice.type}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-gray-100">{invoice.client}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{invoice.project}</div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-900 dark:text-gray-100">¥ {invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{invoice.issuedAt}</td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          className="rounded-lg border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          查看详情
                        </button>
                        <button
                          className="rounded-lg border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
                          onClick={() => console.info('[FinanceSuite] 导出发票', invoice.id)}
                        >
                          导出 PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>发票详情</DialogTitle>
            <DialogDescription>开票流程、附件与物流信息</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">发票编号</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{selectedInvoice.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">类型</p>
                  <p>{selectedInvoice.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">金额（含税）</p>
                  <p>¥ {selectedInvoice.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">税率</p>
                  <p>{(selectedInvoice.taxRate * 100).toFixed(0)}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">客户 / 项目</p>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedInvoice.client}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedInvoice.project}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">开票日期</p>
                  <p>{selectedInvoice.issuedAt}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">当前状态</p>
                  <p>{selectedInvoice.status}</p>
                </div>
                {selectedInvoice.approver && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">审批人</p>
                    <p>{selectedInvoice.approver}</p>
                  </div>
                )}
              </div>
              {selectedInvoice.logistics && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-700 dark:border-blue-500/40 dark:bg-blue-900/20 dark:text-blue-200">
                  <p className="font-medium">物流信息</p>
                  <p className="mt-2">承运商：{selectedInvoice.logistics.company}</p>
                  <p>快递单号：{selectedInvoice.logistics.trackingNo}</p>
                  <p>寄出时间：{selectedInvoice.logistics.shippedAt}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-2 text-xs">
                <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" onClick={() => console.info('[FinanceSuite] 下载发票 PDF', selectedInvoice.id)}>
                  <Download className="h-3.5 w-3.5" />
                  下载 PDF
                </button>
                <button className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" onClick={() => console.info('[FinanceSuite] 提交审批动作', selectedInvoice.id)}>
                  <Sparkles className="h-3.5 w-3.5" />
                  记录审批
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
