import React, { useMemo, useState } from 'react';

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
  const [isBackgroundExpanded, setIsBackgroundExpanded] = useState(false);

  const coreRows = [
    { label: '本科院校', value: student.undergraduate },
    { label: '绩点', value: student.gpa },
    { label: '语言成绩', value: student.languageScore },
    { label: '标化成绩', value: student.standardizedTests?.join(' / ') },
    { label: '科研经历', value: student.researchHighlights?.join('；') },
    { label: '实习经历', value: student.internshipHighlights?.join('；') },
    { label: '目标地区', value: (student.targetRegions ?? student.preferedCountries).join('、') },
    { label: '目标院校', value: student.targetSchools?.join('、') },
    { label: '目标专业', value: student.targetPrograms?.join('、') ?? student.programGoal },
  ].filter((row) => Boolean(row.value));

  const summaryChips = useMemo(() => {
    const chips: string[] = [];
    if (student.undergraduate) chips.push(student.undergraduate);
    if (student.gpa) chips.push(`GPA ${student.gpa}`);
    if (student.languageScore) chips.push(student.languageScore);
    if (student.targetRegions?.length) chips.push(`目标地区 ${student.targetRegions.join('、')}`);
    if (student.targetPrograms?.length) chips.push(`目标专业 ${student.targetPrograms.join('、')}`);
    if (!chips.length && student.background?.length) {
      chips.push(...student.background.slice(0, 3));
    }
    return chips.slice(0, 4);
  }, [student]);

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

      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">学生背景摘要</div>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>目标入学季 {student.targetIntake}</span>
            <button
              type="button"
              onClick={() => setIsBackgroundExpanded((prev) => !prev)}
              className="text-blue-600 hover:underline dark:text-blue-300"
            >
              {isBackgroundExpanded ? '折叠' : '展开'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
          {summaryChips.map((chip) => (
            <span key={chip} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 dark:border-gray-700 dark:bg-gray-900/40">
              {chip}
            </span>
          ))}
          {!summaryChips.length && <span>暂无摘要</span>}
        </div>

        {isBackgroundExpanded && (
          <div className="mt-4 grid gap-y-3 gap-x-8 text-sm text-gray-600 dark:text-gray-300 md:grid-cols-2">
            {coreRows
              .filter((row) => !summaryChips.some((chip) => chip.includes(row.value ?? '')))
              .map((row) => (
                <div key={row.label} className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{row.value}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
};
