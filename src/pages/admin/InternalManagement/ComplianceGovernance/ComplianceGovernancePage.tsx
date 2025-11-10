import { useMemo, useState } from 'react';

import { AlertTriangle, ClipboardList, FileSearch, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import { COMPLIANCE_CASE_LOGS, COMPLIANCE_RISKS, POLICY_UPDATES } from './data';
import { ComplianceCaseTable } from './components/ComplianceCaseTable';
import { ComplianceRiskBoard } from './components/ComplianceRiskBoard';
import { PolicyUpdateFeed } from './components/PolicyUpdateFeed';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'risk', label: '风险看板', description: '风险等级 · 责任归属', icon: ShieldAlert },
  { key: 'policy', label: '政策速递', description: '监管动态 · 影响评估', icon: FileSearch },
  { key: 'case', label: '整改工单', description: '执行进度 · 佐证材料', icon: ClipboardList },
] as const;

export const ComplianceGovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('risk');

  const severeCount = useMemo(
    () => COMPLIANCE_RISKS.filter((risk) => risk.level === '严重').length,
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">合规监督中心</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              统一管理合同、隐私、政策与风险整改，确保招生、教学、运营各环节符合法规与合作要求。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              严重风险 {severeCount} 项
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <FileSearch className="h-4 w-4 text-blue-500" />
              本周政策解读 {POLICY_UPDATES.length} 条
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <ClipboardList className="h-4 w-4 text-emerald-500" />
              在办工单 {COMPLIANCE_CASE_LOGS.length} 条
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[ComplianceGovernancePage] 新建合规检查计划')}
          >
            新建检查计划
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[ComplianceGovernancePage] 开启告警订阅')}
          >
            告警订阅
          </Button>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto md:flex-row md:items-center md:gap-3 ${
                activeTab === tab.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'risk' ? <ComplianceRiskBoard risks={COMPLIANCE_RISKS} /> : null}

      {activeTab === 'policy' ? <PolicyUpdateFeed policies={POLICY_UPDATES} /> : null}

      {activeTab === 'case' ? <ComplianceCaseTable cases={COMPLIANCE_CASE_LOGS} /> : null}
    </div>
  );
};

