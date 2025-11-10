import { useState } from 'react';
import { Download, FileText, LineChart, RefreshCw, Save, ShieldCheck, Sparkles, Table2 } from 'lucide-react';

import { FinanceInvoicesTab } from './components/FinanceInvoicesTab';
import { FinanceLedgerTab } from './components/FinanceLedgerTab';
import { FinanceOverviewTab } from './components/FinanceOverviewTab';
import { FinanceTaxTab } from './components/FinanceTaxTab';

const FinanceSuitePage: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'ledger' | 'invoices' | 'tax'>('overview');

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Finance Suite · 财务中台</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            聚合营收、支出、现金流与合规信息，让 CFO、财务会计与业务负责人实时掌握关键指标。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Save className="h-4 w-4" />
            保存视图
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Download className="h-4 w-4" />
            导出报告
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            启动自动巡检
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveView('overview')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeView === 'overview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <LineChart className="h-4 w-4" />
            财务概览
          </button>
          <button
            onClick={() => setActiveView('ledger')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeView === 'ledger'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <Table2 className="h-4 w-4" />
            财务流水
          </button>
          <button
            onClick={() => setActiveView('invoices')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeView === 'invoices'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            发票管理
          </button>
          <button
            onClick={() => setActiveView('tax')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeView === 'tax'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            税务中心
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <RefreshCw className="h-3.5 w-3.5" />
          数据刷新时间：今日 07:30
        </div>
      </div>

      {activeView === 'overview' && (
        <FinanceOverviewTab onNavigateInvoices={() => setActiveView('invoices')} />
      )}

      {activeView === 'ledger' && <FinanceLedgerTab />}

      {activeView === 'invoices' && <FinanceInvoicesTab />}

      {activeView === 'tax' && <FinanceTaxTab />}
    </div>
  );
};

export default FinanceSuitePage;