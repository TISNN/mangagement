/**
 * 协同空间页面 - 主页面
 * 使用标签页切换各个功能模块，提升代码可维护性和用户体验
 */

import React, { useState } from 'react';
import {
  Upload,
  Sparkles,
  Target,
  MessageCircle,
  ClipboardList,
  BookOpen,
  Calendar,
  LayoutDashboard,
} from 'lucide-react';
import { TabKey } from './types';
import {
  GoalsKPIDashboard,
  TeamFeed,
  CollaborationTasks,
  KnowledgeBase,
  TrainingEvents,
  AlertsPanel,
} from './components';
import {
  AnnouncementDialog,
  CollaborationRequestDialog,
  AnnouncementData,
  CollaborationRequestData,
} from './components/dialogs';

const CRMCollaborationHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [isCollaborationRequestDialogOpen, setIsCollaborationRequestDialogOpen] = useState(false);

  // 标签页配置
  const tabs: Array<{ key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: 'overview', label: '总览', icon: LayoutDashboard },
    { key: 'goals', label: '目标与KPI', icon: Target },
    { key: 'feed', label: '团队动态', icon: MessageCircle },
    { key: 'tasks', label: '协作任务', icon: ClipboardList },
    { key: 'knowledge', label: '知识库', icon: BookOpen },
    { key: 'training', label: '培训活动', icon: Calendar },
  ];

  // 处理各种按钮点击事件
  const handlePublishAnnouncement = () => {
    setIsAnnouncementDialogOpen(true);
  };

  const handleCreateRequest = () => {
    setIsCollaborationRequestDialogOpen(true);
  };

  const handlePublish = (data: AnnouncementData) => {
    // TODO: 调用 API 发布公告
    console.log('发布公告:', data);
    alert(`公告"${data.title}"发布成功！`);
  };

  const handleSubmitRequest = (data: CollaborationRequestData) => {
    // TODO: 调用 API 提交协作请求
    console.log('提交协作请求:', data);
    alert(`协作请求"${data.title}"提交成功！`);
  };

  // 渲染标签页内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="xl:col-span-2 space-y-4">
                <GoalsKPIDashboard />
                <TeamFeed />
              </div>
              <div className="space-y-4">
                <AlertsPanel />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              <CollaborationTasks onCreateRequest={handleCreateRequest} />
              <div className="space-y-4">
                <KnowledgeBase />
                <TrainingEvents />
              </div>
            </div>
          </div>
        );
      case 'goals':
        return <GoalsKPIDashboard />;
      case 'feed':
        return <TeamFeed />;
      case 'tasks':
        return <CollaborationTasks onCreateRequest={handleCreateRequest} />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'training':
        return <TrainingEvents />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">协同空间</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Collaboration Hub · CRM Center</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            统一管理团队目标、跨部门协作、知识沉淀与培训活动，帮助销售、市场与服务团队保持信息同步与执行一致。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handlePublishAnnouncement}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <Upload className="h-4 w-4" />
            发布公告
          </button>
          <button
            onClick={handleCreateRequest}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            新建协作请求
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
      <AnnouncementDialog
        isOpen={isAnnouncementDialogOpen}
        onClose={() => setIsAnnouncementDialogOpen(false)}
        onPublish={handlePublish}
      />
      <CollaborationRequestDialog
        isOpen={isCollaborationRequestDialogOpen}
        onClose={() => setIsCollaborationRequestDialogOpen(false)}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
};

export default CRMCollaborationHubPage;
