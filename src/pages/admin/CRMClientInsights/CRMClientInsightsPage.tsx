/**
 * 客户分群分析页面 - 主页面
 * 使用标签页切换各个功能模块，提升代码可维护性和用户体验
 */

import React, { useState } from 'react';
import {
  Filter,
  Sparkles,
  Users,
  PieChart,
  Target,
  BarChart3,
  Zap,
  FileText,
  ShieldAlert,
  LayoutDashboard,
} from 'lucide-react';
import { TabKey } from './types';
import {
  MetricsDashboard,
  ProfileAndTags,
  SegmentationBuilder,
  ValueModels,
  AutomationRules,
  ReportsAndExport,
  AlertsAndFocus,
} from './components';
import {
  CustomerSwitchDialog,
  TagManagementDialog,
  PreviewDialog,
  CreateSegmentDialog,
  SegmentFormData,
} from './components/dialogs';

const CRMClientInsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isCreateSegmentDialogOpen, setIsCreateSegmentDialogOpen] = useState(false);

  // 标签页配置
  const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'overview', label: '总览', icon: LayoutDashboard },
    { key: 'profile', label: '画像与标签', icon: Users },
    { key: 'segmentation', label: '分群引擎', icon: Target },
    { key: 'value', label: '价值模型', icon: BarChart3 },
    { key: 'automation', label: '自动化规则', icon: Zap },
    { key: 'reports', label: '报表与导出', icon: FileText },
    { key: 'alerts', label: '预警与关注', icon: ShieldAlert },
  ];

  // 处理各种按钮点击事件
  const handleImportConditions = () => {
    // TODO: 实现导入分群条件功能
    console.log('导入分群条件');
  };

  const handleCreateSegment = () => {
    setIsCreateSegmentDialogOpen(true);
  };

  const handleSaveSegment = (segmentData: SegmentFormData) => {
    // TODO: 调用 API 保存分群
    console.log('保存分群:', segmentData);
    // 可以在这里添加成功提示
    alert(`分群"${segmentData.name}"创建成功！`);
  };

  const handleSwitchCustomer = () => {
    setIsCustomerDialogOpen(true);
  };

  const handleManageTags = () => {
    setIsTagDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    // TODO: 实现保存模板功能
    console.log('保存为模板');
  };

  const handlePreview = () => {
    setIsPreviewDialogOpen(true);
  };

  const handleCreateSegmentFromTemplate = () => {
    // TODO: 实现从模板创建分群功能
    console.log('从模板创建分群');
  };

  const handleViewConfig = () => {
    // TODO: 实现查看模型配置功能（可打开弹窗或抽屉）
    console.log('查看模型配置');
  };

  const handleCreateRule = () => {
    // TODO: 实现新建规则功能（可打开弹窗或抽屉）
    console.log('新建规则');
  };

  const handleViewLog = (ruleId: string) => {
    // TODO: 实现查看日志功能（可打开弹窗或抽屉）
    console.log('查看日志', ruleId);
  };

  const handleExport = () => {
    // TODO: 实现导出报表功能
    console.log('导出报表');
  };

  const handleShare = (reportId: string) => {
    // TODO: 实现分享功能
    console.log('分享报表', reportId);
  };

  const handleViewPlan = () => {
    // TODO: 实现查看预案功能（可打开弹窗或抽屉）
    console.log('查看预案');
  };

  const handleViewDetails = (title: string) => {
    // TODO: 实现查看详情功能（可打开弹窗或抽屉）
    console.log('查看详情', title);
  };

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <MetricsDashboard />
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">快速入口</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">快速访问常用功能</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {tabs
                    .filter((tab) => tab.key !== 'overview')
                    .map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left text-sm text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20"
                        >
                          <Icon className="h-5 w-5" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
              <AlertsAndFocus onViewPlan={handleViewPlan} onViewDetails={handleViewDetails} />
            </div>
          </div>
        );
      case 'profile':
        return (
          <ProfileAndTags onSwitchCustomer={handleSwitchCustomer} onManageTags={handleManageTags} />
        );
      case 'segmentation':
        return (
          <SegmentationBuilder
            onSaveTemplate={handleSaveTemplate}
            onPreview={handlePreview}
            onCreateSegment={handleCreateSegmentFromTemplate}
          />
        );
      case 'value':
        return <ValueModels onViewConfig={handleViewConfig} />;
      case 'automation':
        return <AutomationRules onCreateRule={handleCreateRule} onViewLog={handleViewLog} />;
      case 'reports':
        return <ReportsAndExport onExport={handleExport} onShare={handleShare} />;
      case 'alerts':
        return <AlertsAndFocus onViewPlan={handleViewPlan} onViewDetails={handleViewDetails} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">客户分群分析</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Client Insights · CRM Center</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            汇集客户画像、标签体系、分群引擎、价值模型与自动化策略，帮助团队精准洞察客户旅程并驱动精细化运营与关怀。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleImportConditions}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <Filter className="h-4 w-4" />
            导入分群条件
          </button>
          <button
            onClick={handleCreateSegment}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            新建动态分群
          </button>
        </div>
      </header>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-1 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  group inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
            </div>

      {/* 标签页内容 */}
      <div className="min-h-[600px]">{renderTabContent()}</div>

      {/* 对话框组件 */}
      <CustomerSwitchDialog
        isOpen={isCustomerDialogOpen}
        onClose={() => setIsCustomerDialogOpen(false)}
        onSelect={(customerId) => {
          console.log('选择客户:', customerId);
          setIsCustomerDialogOpen(false);
        }}
      />
      <TagManagementDialog isOpen={isTagDialogOpen} onClose={() => setIsTagDialogOpen(false)} />
      <PreviewDialog isOpen={isPreviewDialogOpen} onClose={() => setIsPreviewDialogOpen(false)} />
      <CreateSegmentDialog
        isOpen={isCreateSegmentDialogOpen}
        onClose={() => setIsCreateSegmentDialogOpen(false)}
        onSave={handleSaveSegment}
      />
    </div>
  );
};

export default CRMClientInsightsPage;
