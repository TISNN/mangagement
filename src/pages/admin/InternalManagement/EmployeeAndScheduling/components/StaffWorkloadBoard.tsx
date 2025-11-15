import { useMemo } from 'react';

import { AlertTriangle, Briefcase, CalendarCheck2, Target } from 'lucide-react';

import { Progress } from '@/components/ui/progress';

import type { StaffProfile } from '../../types';

interface StaffWorkloadBoardProps {
  profiles: StaffProfile[];
}

const workloadLevelClass = (value: number) => {
  if (value >= 85) return 'text-rose-600 dark:text-rose-300';
  if (value >= 70) return 'text-amber-600 dark:text-amber-300';
  return 'text-emerald-600 dark:text-emerald-300';
};

const workloadBadgeClass = (value: number) => {
  if (value >= 85) {
    return 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-200';
  }
  if (value >= 70) {
    return 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-200';
  }
  return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-200';
};

export const StaffWorkloadBoard: React.FC<StaffWorkloadBoardProps> = ({ profiles }) => {
  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => b.workload - a.workload || a.name.localeCompare(b.name, 'zh-CN')),
    [profiles],
  );

  if (sortedProfiles.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-400">
        暂无团队成员数据，请先导入成员信息。
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sortedProfiles.map((profile) => (
        <article
          key={profile.id}
          className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
        >
          <header className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{profile.name}</h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${workloadBadgeClass(
                    profile.workload,
                  )}`}
                >
                  <Target className="h-3 w-3" />
                  {profile.workload}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {profile.role} · {profile.team}
              </p>
            </div>
            {profile.workload >= 85 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:bg-rose-900/30 dark:text-rose-200">
                <AlertTriangle className="h-3 w-3" />
                负载偏高
              </span>
            ) : null}
          </header>

          <section className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>本周工作量</span>
              <span className={`font-semibold ${workloadLevelClass(profile.workload)}`}>{profile.workload}%</span>
            </div>
            <Progress value={profile.workload} className="h-2" aria-valuenow={profile.workload} aria-label="当前工作量" />
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800/60">
                <Briefcase className="h-3.5 w-3.5 text-blue-500 dark:text-blue-300" />
                当前任务 {profile.activeTaskCount} 个
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-gray-800/60">
                <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" />
                即将会议 {profile.upcomingMeetingCount} 场
              </span>
            </div>
          </section>

          <section className="mt-5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">重点关注</h4>
            {profile.responsibilityHighlights.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {profile.responsibilityHighlights.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2 text-gray-600 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.type} · {item.title}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{item.dueAt ?? '时间待定'}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        状态：{item.status} · 优先级{' '}
                        <span
                          className={
                            item.importance === '高'
                              ? 'text-rose-500 dark:text-rose-300'
                              : item.importance === '低'
                                ? 'text-emerald-500 dark:text-emerald-300'
                                : 'text-amber-500 dark:text-amber-300'
                          }
                        >
                          {item.importance}
                        </span>
                      </span>
                      {item.description ? <span>{item.description}</span> : null}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-center text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                暂无任务或会议记录，建议补充团队成员的职责信息。
              </div>
            )}
          </section>

          {profile.primaryFocus ? (
            <footer className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs text-blue-600 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
              当前重点：{profile.primaryFocus}
            </footer>
          ) : null}
        </article>
      ))}
    </div>
  );
};

