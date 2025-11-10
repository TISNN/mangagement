import { useMemo, useState } from 'react';

import { CalendarRange, Download, Settings2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { AdjustmentCenterPanel } from './components/AdjustmentCenterPanel';
import { ClassScheduleBoard } from './components/ClassScheduleBoard';
import { NotificationPanel } from './components/NotificationPanel';
import { ResourceOverviewPanel } from './components/ResourceOverviewPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import {
  ADJUSTMENT_REQUESTS,
  CLASS_PROFILES,
  CONSTRAINT_RULES,
  NOTIFICATION_CHANNELS,
  OPTIMIZATION_SUGGESTIONS,
  ROOM_RESOURCES,
  SCHEDULE_SLOTS,
  TEACHER_AVAILABILITIES,
} from './data';

const TABS = [
  { key: 'overview', label: '排课概览', description: '班级档案 · 日历 · 冲突预警' },
  { key: 'resources', label: '资源调配', description: '师资负载 · 教室利用' },
  { key: 'adjustment', label: '调课中心', description: '请假调课审批流' },
  { key: 'notification', label: '通知同步', description: '多渠道提醒设置' },
  { key: 'analytics', label: '运营分析', description: 'KPI 指标 · 时段热力' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export const SchedulingClassroomPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const summary = useMemo(() => {
    const classCount = CLASS_PROFILES.length;
    const runningClasses = CLASS_PROFILES.filter((cls) => cls.scheduleStatus === 'in-progress').length;
    const pendingAdjustments = ADJUSTMENT_REQUESTS.filter((req) => req.status === 'pending').length;
    const resourceWarning = TEACHER_AVAILABILITIES.filter((teacher) => teacher.status === 'overload').length;

    return {
      classCount,
      runningClasses,
      pendingAdjustments,
      resourceWarning,
    };
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">排课与教室资源中心</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              统筹班级排期、教师与教室资源，支持调课审批与跨渠道同步，保障教学稳定运行。
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                <CalendarRange className="h-4 w-4 text-blue-500" /> {summary.classCount} 个活跃班级
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                <Sparkles className="h-4 w-4 text-emerald-500" /> {summary.runningClasses} 个班级执行中
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                <Settings2 className="h-4 w-4 text-amber-500" /> {summary.pendingAdjustments} 条调课待处理
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/70">
                <Sparkles className="h-4 w-4 text-rose-500" /> {summary.resourceWarning} 位教师负载偏高
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-900">
            <Download className="h-4 w-4" /> 导出排课方案
          </Button>
          <Button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Sparkles className="h-4 w-4" /> 智能排课建议
          </Button>
        </div>
      </header>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col rounded-2xl border px-4 py-3 text-left text-sm transition md:w-auto md:flex-row md:items-center md:gap-3 ${
                activeTab === tab.key
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
              }`}
            >
              <span className="font-semibold">{tab.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <ClassScheduleBoard
          classes={CLASS_PROFILES}
          slots={SCHEDULE_SLOTS}
          constraints={CONSTRAINT_RULES}
          optimizations={OPTIMIZATION_SUGGESTIONS}
        />
      )}

      {activeTab === 'resources' && (
        <ResourceOverviewPanel teachers={TEACHER_AVAILABILITIES} rooms={ROOM_RESOURCES} />
      )}

      {activeTab === 'adjustment' && <AdjustmentCenterPanel adjustments={ADJUSTMENT_REQUESTS} />}

      {activeTab === 'notification' && <NotificationPanel channels={NOTIFICATION_CHANNELS} />}

      {activeTab === 'analytics' && <AnalyticsPanel metrics={KPI_METRICS} heatmap={HEATMAP_SNAPSHOT} />}
    </div>
  );
};
