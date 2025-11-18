import { useEffect, useState } from 'react';

import {
  Download,
  FileText,
  Filter,
  Loader2,
  Search,
  Upload,
  Users,
} from 'lucide-react';

import { financeService } from '@/services/finance/financeService';
import { SocialSecurityImportDialog } from './SocialSecurityImportDialog';

export const FinanceSocialSecurityTab = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // 加载数据
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [allRecords, summaryData] = await Promise.all([
        financeService.getAllSocialSecurityRecords(),
        financeService.getSocialSecuritySummary()
      ]);
      
      setRecords(allRecords);
      setSummary(summaryData);
      
      // 设置默认选中最新期间
      if (allRecords.length > 0) {
        const periods = [...new Set(allRecords.map((r: any) => r.period_start))].sort().reverse();
        if (periods.length > 0 && !selectedPeriod) {
          setSelectedPeriod(periods[0]);
        }
      }
    } catch (error) {
      console.error('加载社保数据失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 获取所有期间
  const periods = [...new Set(records.map((r: any) => r.period_start))].sort().reverse();

  // 过滤记录
  const filteredRecords = records.filter((record: any) => {
    const matchPeriod = !selectedPeriod || record.period_start === selectedPeriod;
    const matchKeyword = !searchKeyword || 
      record.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      record.id_number?.includes(searchKeyword) ||
      record.personal_social_security_number?.includes(searchKeyword);
    return matchPeriod && matchKeyword;
  });

  // 格式化金额
  const formatAmount = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined || amount === '') return '0.00';
    return Number(amount).toFixed(2);
  };

  return (
    <section className="space-y-6">
      {/* 汇总卡片 */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">总记录数</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{summary.totalRecords}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">单位部分合计</p>
            <p className="mt-2 text-lg font-semibold text-emerald-500">¥ {summary.totalEmployer.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">个人部分合计</p>
            <p className="mt-2 text-lg font-semibold text-blue-500">¥ {summary.totalIndividual.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">应缴金额合计</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">¥ {summary.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* 筛选和操作栏 */}
      <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索姓名 / 证件号码 / 社保号"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm text-gray-600 transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedPeriod('')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                !selectedPeriod
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
              }`}
            >
              全部期间
            </button>
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Filter className="h-4 w-4" />
            高级筛选
          </button>
          <button
            onClick={() => setImportDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <Upload className="h-4 w-4" />
            导入数据
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Download className="h-4 w-4" />
            导出报表
          </button>
        </div>
      </div>

      {/* 社保明细表格 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
                <thead className="bg-gray-50/80 text-[10px] font-medium text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
                  <tr>
                    <th rowSpan={2} className="px-2 py-2 text-left whitespace-nowrap">序号</th>
                    <th rowSpan={2} className="px-2 py-2 text-left whitespace-nowrap">姓名</th>
                    <th rowSpan={2} className="px-2 py-2 text-left whitespace-nowrap">证件号</th>
                    <th rowSpan={2} className="px-2 py-2 text-left whitespace-nowrap">证件类型</th>
                    <th rowSpan={2} className="px-2 py-2 text-left whitespace-nowrap" title="个人社保号">社保号</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap">费款所属期</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600" title="基本养老保险(单位缴纳)">养老(单位)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap" title="基本养老保险(个人缴纳)">养老(个人)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600" title="农民工失业保险(单位缴纳)">农工失业(单位)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap" title="城镇工失业保险(单位缴纳)">城镇失业(单位)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap" title="农民工失业保险(个人缴纳)">农工失业(个人)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap" title="城镇工失业保险(个人缴纳)">城镇失业(个人)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600" title="基本医疗保险(含生育)(单位缴纳)">医疗(单位)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap" title="基本医疗保险(含生育)(个人缴纳)">医疗(个人)</th>
                    <th colSpan={2} className="px-2 py-2 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600">工伤</th>
                    <th rowSpan={2} className="px-2 py-2 text-right whitespace-nowrap border-l border-gray-300 dark:border-gray-600">单位合计</th>
                    <th rowSpan={2} className="px-2 py-2 text-right whitespace-nowrap">个人合计</th>
                    <th rowSpan={2} className="px-2 py-2 text-right whitespace-nowrap border-l border-gray-300 dark:border-gray-600">应缴合计</th>
                  </tr>
                  <tr>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">起</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">止</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap border-l border-gray-300 dark:border-gray-600">基数</th>
                    <th className="px-2 py-1.5 text-center whitespace-nowrap">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-gray-900/40">
                  {isLoading ? (
                    <tr>
                      <td colSpan={25} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          正在加载社保数据...
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={25} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3">
                          <Users className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                          <p className="text-base font-medium text-gray-900 dark:text-white">暂无社保记录</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {searchKeyword || selectedPeriod ? '没有找到匹配的记录' : '当前没有社保缴费记录，请导入或添加数据'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, index) => (
                      <tr key={record.id} className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40">
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300">{index + 1}</td>
                        <td className="px-2 py-2 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{record.name}</td>
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.id_number}</td>
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.id_type || '居民身份证'}</td>
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.personal_social_security_number || '-'}</td>
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.period_start}</td>
                        <td className="px-2 py-2 text-gray-600 dark:text-gray-300 whitespace-nowrap">{record.period_end}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.endowment_insurance_employer_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.endowment_insurance_employer_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.endowment_insurance_individual_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.endowment_insurance_individual_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.migrant_unemployment_employer_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.migrant_unemployment_employer_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.urban_unemployment_employer_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.urban_unemployment_employer_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.migrant_unemployment_individual_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.migrant_unemployment_individual_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.urban_unemployment_individual_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.urban_unemployment_individual_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.medical_insurance_employer_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.medical_insurance_employer_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.medical_insurance_individual_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.medical_insurance_individual_amount)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.work_injury_base)}</td>
                        <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-300 whitespace-nowrap">{formatAmount(record.work_injury_amount)}</td>
                        <td className="px-2 py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400 border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.employer_total)}</td>
                        <td className="px-2 py-2 text-right font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{formatAmount(record.individual_total)}</td>
                        <td className="px-2 py-2 text-right font-semibold text-gray-900 dark:text-white border-l border-gray-200 dark:border-gray-700 whitespace-nowrap">{formatAmount(record.total_amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 导入对话框 */}
      <SocialSecurityImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={loadData}
      />
    </section>
  );
};

