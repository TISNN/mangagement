import { useMemo, useState } from 'react';

import { Brain, CalendarDays, ClipboardList, MessageSquare, Sparkles, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AssignmentsPanel } from './components/AssignmentsPanel';
import { CommunicationPanel } from './components/CommunicationPanel';
import { OverviewSnapshot } from './components/OverviewSnapshot';
import { ProgressInsightPanel } from './components/ProgressInsightPanel';
import { ResourceLibraryPanel } from './components/ResourceLibraryPanel';
import { SchedulePlannerPanel } from './components/SchedulePlannerPanel';
import {
  ATTENDANCE_INSIGHTS,
  COMMUNICATION_CARDS,
  GROWTH_MILESTONES,
  GUARDIAN_ALERTS,
  LEARNER_KPIS,
  LEARNING_TASKS,
  PROGRESS_GOALS,
  RESOURCE_FOLDERS,
  UPCOMING_LESSONS,
  WEEKLY_SUMMARY,
} from './data';

const TABS = [
  { key: 'overview', label: '首页概览', description: 'KPI · 今日课程 · 待办' },
  { key: 'schedule', label: '课表中心', description: '课程排期 · 请假补课' },
  { key: 'assignments', label: '作业与任务', description: '提交进度 · AI 点评' },
  { key: 'resources', label: '学习资料', description: '资料库 · 离线下载' },
  { key: 'progress', label: '成绩与成长', description: '目标追踪 · 里程碑' },
  { key: 'communication', label: '沟通与家长', description: '消息中心 · 家长提醒' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const LearnerPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const todayLessons = useMemo(() => UPCOMING_LESSONS.slice(0, 1), []);
  const totalTasks = LEARNING_TASKS.length;
  const pendingTasks = LEARNING_TASKS.filter((task) => task.status === '待提交').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">学习中心</h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Learner Portal</p>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              汇集课表、任务、资料与沟通功能，让学员与家长随时掌握学习进度，并与班主任保持高效互动。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              今日课程 {todayLessons.length} 节
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <ClipboardList className="h-4 w-4 text-emerald-500" />
              待办任务 {pendingTasks}/{totalTasks}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              AI 建议可用
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Brain className="h-4 w-4" />
            生成学习报告
          </Button>
          <Button variant="outline" className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200">
            <MessageSquare className="h-4 w-4" />
            联系班主任
          </Button>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto md:flex-row md:items-center md:gap-3 ${
                activeTab === tab.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <OverviewSnapshot kpis={LEARNER_KPIS} lessons={UPCOMING_LESSONS} tasks={LEARNING_TASKS} />
      )}

      {activeTab === 'schedule' && (
        <SchedulePlannerPanel lessons={UPCOMING_LESSONS} weeklySummary={WEEKLY_SUMMARY} insights={ATTENDANCE_INSIGHTS} />
      )}

      {activeTab === 'assignments' && <AssignmentsPanel tasks={LEARNING_TASKS} />}

      {activeTab === 'resources' && <ResourceLibraryPanel folders={RESOURCE_FOLDERS} />}

      {activeTab === 'progress' && <ProgressInsightPanel goals={PROGRESS_GOALS} milestones={GROWTH_MILESTONES} />}

      {activeTab === 'communication' && (
        <CommunicationPanel threads={COMMUNICATION_CARDS} alerts={GUARDIAN_ALERTS} />
      )}
    </div>
  );
};
