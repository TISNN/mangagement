import { useMemo, useState } from 'react';

import { CalendarClock, ClipboardList, MessageSquare, Target, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { CollaborationPanel } from './components/CollaborationPanel';
import { ClassroomManagementPanel } from './components/ClassroomManagementPanel';
import { OverviewPanel } from './components/OverviewPanel';
import { PerformancePanel } from './components/PerformancePanel';
import { PostClassPanel } from './components/PostClassPanel';
import { PreparationPanel } from './components/PreparationPanel';
import { SchedulePlannerPanel } from './components/SchedulePlannerPanel';
import {
  ATTENDANCE_INSIGHTS,
  CLASSROOM_INTERACTIONS,
  CLASSROOM_LOGS,
  CLASS_BRIEFS,
  COLLABORATION_THREADS,
  LESSON_PLANS,
  PERFORMANCE_METRICS,
  POST_CLASS_ACTIONS,
  QUALITY_FEEDBACKS,
  REQUEST_ITEMS,
  TEACHER_KPIS,
  TEACHER_SCHEDULE,
  WEEKLY_SUMMARY,
} from './data';

const TABS = [
  { key: 'overview', label: '首页概览', description: 'KPI · 课表摘要 · 班级提醒' },
  { key: 'schedule', label: '课表与班级', description: '排班 · 班级信息 · 调课' },
  { key: 'preparation', label: '备课中心', description: '教案 · 资料 · AI 建议' },
  { key: 'classroom', label: '课堂管理', description: '互动数据 · 课堂记录' },
  { key: 'postClass', label: '课后任务', description: '补课安排 · 审批请求' },
  { key: 'performance', label: '教学数据', description: 'KPI · 质检反馈' },
  { key: 'collaboration', label: '协同与沟通', description: '班主任 · 教研 · 教务' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const TutorPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const upcoming = useMemo(() => TEACHER_SCHEDULE.slice(0, 2), []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">教师工作台</h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Tutor Portal</p>
            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              打通课前、课堂、课后与绩效的全流程工具，让老师高效备课、教学与协作，同时沉淀优质教学数据与教研反馈。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <CalendarClock className="h-4 w-4 text-blue-500" />
              近期课程 {upcoming.length} 场
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <ClipboardList className="h-4 w-4 text-emerald-500" />
              课后任务 {POST_CLASS_ACTIONS.length} 项
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Users className="h-4 w-4 text-indigo-500" />
              班级 {CLASS_BRIEFS.length} 个
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Target className="h-4 w-4" />
            发布教学目标
          </Button>
          <Button variant="outline" className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200">
            <MessageSquare className="h-4 w-4" />
            与教研沟通
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
        <OverviewPanel kpis={TEACHER_KPIS} schedule={TEACHER_SCHEDULE} classes={CLASS_BRIEFS} />
      )}

      {activeTab === 'schedule' && (
        <SchedulePlannerPanel lessons={TEACHER_SCHEDULE} weeklySummary={WEEKLY_SUMMARY} insights={ATTENDANCE_INSIGHTS} />
      )}

      {activeTab === 'preparation' && <PreparationPanel plans={LESSON_PLANS} />}

      {activeTab === 'classroom' && (
        <ClassroomManagementPanel interactions={CLASSROOM_INTERACTIONS} logs={CLASSROOM_LOGS} />
      )}

      {activeTab === 'postClass' && (
        <PostClassPanel actions={POST_CLASS_ACTIONS} requests={REQUEST_ITEMS} />
      )}

      {activeTab === 'performance' && (
        <PerformancePanel metrics={PERFORMANCE_METRICS} feedbacks={QUALITY_FEEDBACKS} />
      )}

      {activeTab === 'collaboration' && <CollaborationPanel threads={COLLABORATION_THREADS} />}
    </div>
  );
};
