import { useMemo, useState } from 'react';

import { Cog, Cpu, Database, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { TabDefinition } from '../types';

import { INTEGRATION_HEALTH, MAINTENANCE_TASKS, NOTIFICATION_TEMPLATES } from './data';
import { IntegrationHealthList } from './components/IntegrationHealthList';
import { MaintenancePlanBoard } from './components/MaintenancePlanBoard';
import { NotificationTemplateTable } from './components/NotificationTemplateTable';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'integration', label: '集成监控', description: '连接状态 · 告警详情', icon: Database },
  { key: 'notification', label: '通知模板', description: '触发事件 · 启用状态', icon: MessageCircle },
  { key: 'maintenance', label: '维护计划', description: '备份演练 · 功能开关', icon: Cog },
] as const;

export const SystemSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('integration');

  const warningCount = useMemo(
    () => INTEGRATION_HEALTH.filter((item) => item.status !== '正常').length,
    []
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">系统设置中心</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              集中管理站点配置、通知策略、第三方集成与运维计划，确保系统稳定可控、变更有迹可循。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Database className="h-4 w-4 text-blue-500" />
              集成服务 {INTEGRATION_HEALTH.length} 项
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              通知模板 {NOTIFICATION_TEMPLATES.length} 个
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Cpu className="h-4 w-4 text-amber-500" />
              告警 {warningCount} 个
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[SystemSettingsPage] 新增配置项')}
          >
            新增配置项
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[SystemSettingsPage] 打开变更记录')}
          >
            变更记录
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

      {activeTab === 'integration' ? <IntegrationHealthList items={INTEGRATION_HEALTH} /> : null}

      {activeTab === 'notification' ? (
        <NotificationTemplateTable
          templates={NOTIFICATION_TEMPLATES}
          onToggle={(id, enabled) => console.info('[SystemSettingsPage] 切换模板状态', { id, enabled })}
        />
      ) : null}

      {activeTab === 'maintenance' ? <MaintenancePlanBoard tasks={MAINTENANCE_TASKS} /> : null}
    </div>
  );
};

