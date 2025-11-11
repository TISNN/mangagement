import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BarChart3, CalendarDays, Clock3, UserPlus, Users2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { AttendanceSummary, ShiftConflict, StaffProfile, TabDefinition } from '../types';

import { AttendanceSummaryPanel } from './components/AttendanceSummaryPanel';
import { ShiftConflictList } from './components/ShiftConflictList';
import { StaffAvailabilityBoard } from './components/StaffAvailabilityBoard';
import { StaffTable } from './components/StaffTable';
import { loadEmployeeSchedulingData } from './data';

type TabKey = (typeof TABS)[number]['key'];

const TABS: TabDefinition[] = [
  { key: 'list', label: '成员列表', description: '基本信息 · 技能标签 · 操作入口', icon: Users2 },
  { key: 'availability', label: '排班与可用性', description: '人员负载 · 技能标签 · 排班地址', icon: CalendarDays },
  { key: 'conflicts', label: '冲突预警', description: '冲突检测 · 建议方案', icon: Clock3 },
  { key: 'attendance', label: '出勤趋势', description: '出勤对比 · 加班提醒', icon: BarChart3 },
] as const;

export const EmployeeAndSchedulingPage: React.FC = () => {
  const [profiles, setProfiles] = useState<StaffProfile[]>([]);
  const [conflicts, setConflicts] = useState<ShiftConflict[]>([]);
  const [attendanceSummaries, setAttendanceSummaries] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('list');
  const navigate = useNavigate();

  const onCalloutMonth = (month: string) => {
    console.info('[TeamMembersPage] 查看出勤详情', { month });
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const dataset = await loadEmployeeSchedulingData();
        if (!mounted) return;
        setProfiles(dataset.profiles);
        setConflicts(dataset.conflicts);
        setAttendanceSummaries(dataset.attendance);
        setError(null);
      } catch (err) {
        if (!mounted) return;
        console.error('[TeamMembersPage] 加载团队成员数据失败', err);
        setError(err instanceof Error ? err.message : '加载团队成员数据失败，请稍后重试');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const activeStaff = useMemo(
    () => profiles.filter((profile) => profile.status === '在岗').length,
    [profiles]
  );

  const totalShifts = useMemo(
    () => profiles.reduce((sum, profile) => sum + profile.availability.length, 0),
    [profiles]
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">团队成员中心</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
              统一掌握团队成员的排班可用性，实时监测冲突与出勤情况，让资源调度更高效。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Users2 className="h-4 w-4 text-blue-500" />
              在岗成员 {activeStaff} 人
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <CalendarDays className="h-4 w-4 text-emerald-500" />
              存量排班 {totalShifts}+ 条
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800/60">
              <Clock3 className="h-4 w-4 text-amber-500" />
              需处理冲突 {conflicts.length} 条
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => navigate('/admin/employees/new')}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            <UserPlus className="h-4 w-4" />
            添加成员
          </Button>
          <Button
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            onClick={() => console.info('[TeamMembersPage] 导入排班计划')}
          >
            导入排班表
          </Button>
          <Button
            variant="outline"
            className="inline-flex items-center gap-2 rounded-xl border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-200"
            onClick={() => console.info('[TeamMembersPage] 打开冲突策略配置')}
          >
            冲突策略
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

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          加载 Supabase 数据出现问题：{error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-400">
          正在获取团队成员数据，请稍候…
        </div>
      ) : null}

      {activeTab === 'list' ? <StaffTable profiles={profiles} /> : null}

      {activeTab === 'availability' ? (
        <StaffAvailabilityBoard profiles={profiles} highlightStatus={['请假']} />
      ) : null}

      {activeTab === 'conflicts' ? <ShiftConflictList conflicts={conflicts} /> : null}

      {activeTab === 'attendance' ? (
        <AttendanceSummaryPanel summaries={attendanceSummaries} onInspect={onCalloutMonth} />
      ) : null}
    </div>
  );
};

