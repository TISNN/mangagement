import React from 'react';

import type { StudentProfile } from '../types';
import type { Accent } from './shared';
import { StatPill } from './shared';

interface OverviewStat {
  label: string;
  value: string;
  accent?: Accent;
  icon: React.ReactNode;
}

interface OverviewPanelProps {
  student: StudentProfile;
  stats: OverviewStat[];
  quickActions: React.ReactNode;
  studentSelector?: React.ReactNode;
  featureSelector?: React.ReactNode;
  onPrimaryStatClick?: () => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  student,
  stats,
  quickActions,
  studentSelector,
  featureSelector,
  onPrimaryStatClick,
}) => {
  const basicInfoRows = [
    { label: '本科院校', value: student.undergraduate },
    { label: '绩点', value: student.gpa },
    { label: '语言成绩', value: student.languageScore },
    { label: '标化成绩', value: student.standardizedTests?.join(' / ') },
  ].filter((row) => Boolean(row.value));

  const experienceRows = [
    { label: '实习经历', value: student.internshipHighlights?.join('；') },
    { label: '科研经历', value: student.researchHighlights?.join('；') },
  ].filter((row) => Boolean(row.value));

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">选校规划中心</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">School Selection Planner</p>
            <p className="max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
              集成 AI 推荐、人工筛选与协同会议的选校策略工作台。基于学生画像快速生成方案，配合顾问与学生协作确认目标院校，并沉淀决策版本与会议纪要。
            </p>
          </div>
          {featureSelector && (
            <div className="pt-2">
              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">{featureSelector}</div>
            </div>
          )}
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 lg:max-w-sm xl:max-w-md">{quickActions}</div>
      </div>

      {studentSelector && <div>{studentSelector}</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            onClick={index === 0 ? onPrimaryStatClick : undefined}
            className={index === 0 && onPrimaryStatClick ? 'cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md' : ''}
          >
            <StatPill icon={stat.icon} label={stat.label} value={stat.value} accent={stat.accent} />
          </div>
        ))}
      </div>

      {/* 学生背景摘要和申请方向摘要并排 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 学生背景摘要卡片 */}
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white dark:bg-indigo-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">学生背景摘要</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student Background Summary</p>
              </div>
          </div>
        </div>

          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {/* 基础信息：双列布局 */}
            {basicInfoRows.length > 0 && (
              <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                {basicInfoRows.map((row) => (
                  <div key={row.label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {row.label}
            </span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">{row.value}</span>
                  </div>
          ))}
        </div>
            )}

            {/* 经历类：单列布局 */}
            {experienceRows.length > 0 && (
              <div className="space-y-3">
                {experienceRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                      {row.label}
                    </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{row.value}</span>
                </div>
              ))}
          </div>
        )}

            {basicInfoRows.length === 0 && experienceRows.length === 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500">暂无背景信息</span>
            )}
          </div>
        </div>

        {/* 申请方向摘要卡片 */}
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-500">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">申请方向摘要</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Application Direction Summary</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">目标入学季</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.targetIntake || '—'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">目标国家</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {(student.preferedCountries || student.targetRegions || []).length > 0
                  ? (student.preferedCountries || student.targetRegions || []).join('、')
                  : '—'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">专业方向</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.targetPrograms && student.targetPrograms.length > 0
                  ? student.targetPrograms.join('、')
                  : student.programGoal
                    ? student.programGoal.split(' ').pop() || student.programGoal
                    : '—'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">目标院校</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {student.targetSchools && student.targetSchools.length > 0
                  ? `${student.targetSchools.length} 所`
                  : '未指定'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
