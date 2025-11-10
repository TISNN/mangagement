import { useMemo, useState } from 'react';

import { Activity, ArrowLeftRight, FileSignature, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import { ApprovalWorkflowBoard } from './components/ApprovalWorkflowBoard';
import { AuditLogPanel } from './components/AuditLogPanel';
import { RoleTemplateGrid } from './components/RoleTemplateGrid';
import { APPROVAL_WORKFLOWS, PERMISSION_AUDIT_LOGS, ROLE_TEMPLATES } from './data';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'roles', label: '角色模板', description: '角色分层 · 权限范围 · 负责人', icon: Shield },
  { key: 'approvals', label: '审批流程', description: '审批环节 · SLA · 自动撤销', icon: FileSignature },
  { key: 'audit', label: '敏感操作审计', description: '权限变更 · 高危告警', icon: Activity },
] as const;

export const OrganizationAndPermissionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('roles');
  const highRiskCount = useMemo(
    () => PERMISSION_AUDIT_LOGS.filter((log) => log.riskLevel === '高').length,
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">组织与权限中心</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              统一的角色模板、审批流程与敏感操作审计，帮助机构在多业务线中保持安全、合规又高效的授权体系。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Shield className="h-4 w-4 text-blue-500" />
              角色模板 {ROLE_TEMPLATES.length} 个
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <FileSignature className="h-4 w-4 text-emerald-500" />
              审批链路 {APPROVAL_WORKFLOWS.length} 条
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Activity className="h-4 w-4 text-red-500" />
              高危告警 {highRiskCount} 条
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[OrganizationAndPermissionsPage] 发起权限巡检任务')}
          >
            <ArrowLeftRight className="h-4 w-4" />
            发起权限巡检
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[OrganizationAndPermissionsPage] 打开权限策略对照表')}
          >
            查看策略对照
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

      {activeTab === 'roles' ? (
        <RoleTemplateGrid
          templates={ROLE_TEMPLATES}
          onPreview={(roleId) => console.info('[OrganizationAndPermissionsPage] 查看角色绑定成员', { roleId })}
        />
      ) : null}

      {activeTab === 'approvals' ? <ApprovalWorkflowBoard workflows={APPROVAL_WORKFLOWS} /> : null}

      {activeTab === 'audit' ? <AuditLogPanel logs={PERMISSION_AUDIT_LOGS} /> : null}
    </div>
  );
};

