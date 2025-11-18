import { useEffect, useMemo, useState } from 'react';
import { Brain, CalendarDays, ClipboardCheck, Download, Sparkles } from 'lucide-react';

import {
  STUDENTS,
  STUDENT_DATA,
} from './data';
import type {
  CandidateProgram,
} from './types';
import { CollaborationPanel } from './components/CollaborationPanel';
import { DecisionArchivePanel } from './components/DecisionArchivePanel';
import { ManualSelectionPanel } from './components/ManualSelectionPanel';
import { OverviewPanel } from './components/OverviewPanel';

const TABS = [
  { key: 'manual', label: '人工筛选' },
  { key: 'collaboration', label: '会议协同' },
  { key: 'archive', label: '决策档案' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

type Accent = Parameters<typeof OverviewPanel>[0]['stats'][number]['accent'];

const DEFAULT_STUDENT_ID = STUDENTS[0]?.id ?? '';

const SchoolSelectionPlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('manual');
  const defaultBundle = STUDENT_DATA[DEFAULT_STUDENT_ID];
  const [activeStudentId, setActiveStudentId] = useState<string>(DEFAULT_STUDENT_ID);
  const [candidates, setCandidates] = useState<CandidateProgram[]>(
    defaultBundle?.candidates ?? []
  );
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);

  useEffect(() => {
    const bundle = STUDENT_DATA[activeStudentId];
    if (!bundle) {
      return;
    }

    setCandidates(bundle.candidates ?? []);
    setActiveTab('manual');
  }, [activeStudentId]);

  const currentData = STUDENT_DATA[activeStudentId] ?? defaultBundle;

  const headerStats = useMemo(() => {
    if (!currentData) return [];
    const { profile } = currentData;
    const sprintCount = candidates.filter((c) => c.stage === '冲刺').length;
    const matchCount = candidates.filter((c) => c.stage === '匹配').length;
    const safetyCount = candidates.filter((c) => c.stage === '保底').length;
    const totalCount = candidates.length;

    return [
      {
        label: '目标学生',
        value: `${profile.name}｜${profile.programGoal}`,
        accent: 'indigo' as Accent,
        icon: <CalendarDays className="h-4 w-4" />,
      },
      {
        label: '候选项目',
        value: `${totalCount} 所`,
        accent: 'purple' as Accent,
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        label: 'AI 推荐',
        value: `${candidates.filter((c) => c.source === 'AI推荐').length} 所`,
        accent: 'cyan' as Accent,
        icon: <Brain className="h-4 w-4" />,
      },
      {
        label: '冲 / 匹 / 保 配比',
        value: totalCount > 0 
          ? `${sprintCount} / ${matchCount} / ${safetyCount}`
          : `${profile.targetDistribution.sprint}% / ${profile.targetDistribution.match}% / ${profile.targetDistribution.safety}%`,
        accent: 'orange' as Accent,
        icon: <ClipboardCheck className="h-4 w-4" />,
      },
    ];
  }, [currentData, candidates]);

  const studentSwitcher = isStudentSelectorOpen ? (
    <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 shadow-sm dark:border-blue-900/40 dark:bg-blue-950/30">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-200">
          选择目标学生
        </div>
        <button
          onClick={() => setIsStudentSelectorOpen(false)}
          className="text-xs text-blue-600 hover:underline dark:text-blue-300"
        >
          收起
        </button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {STUDENTS.map((student) => (
          <button
            key={student.id}
            onClick={() => {
              setActiveStudentId(student.id);
              setIsStudentSelectorOpen(false);
            }}
            className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left text-sm transition ${
              student.id === activeStudentId
                ? 'border-blue-500 bg-white shadow-sm dark:border-blue-400 dark:bg-blue-900/40'
                : 'border-white bg-white/60 hover:border-blue-200 hover:bg-white dark:border-blue-900/20 dark:bg-blue-950/20 dark:hover:border-blue-700/40'
            }`}
          >
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{student.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {student.intake} · {student.goal}
            </span>
            {student.tags?.length ? (
              <span className="text-xs text-gray-400 dark:text-gray-500">标签：{student.tags.join('、')}</span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  ) : null;

  const featureTabs = (
    <>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`whitespace-nowrap rounded-xl border px-3 py-2 text-left transition ${
            activeTab === tab.key
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
          }`}
        >
          <span className="text-sm font-semibold">{tab.label}</span>
        </button>
      ))}
    </>
  );

  if (!currentData) {
    return <div className="text-sm text-gray-500 dark:text-gray-300">暂未配置学生数据，请先在数据源中添加示例。</div>;
  }

  return (
    <div className="space-y-8">
      <OverviewPanel
        student={currentData.profile}
        stats={headerStats}
        quickActions={(
          <>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <CalendarDays className="h-4 w-4" />
              安排选校会议
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Download className="h-4 w-4" />
              导出方案
            </button>
          </>
        )}
        featureSelector={featureTabs}
        studentSelector={studentSwitcher}
        onPrimaryStatClick={() => setIsStudentSelectorOpen((prev) => !prev)}
      />

      {activeTab === 'manual' && (
        <ManualSelectionPanel 
          student={currentData.profile}
          studentId={activeStudentId}
          presets={currentData.manualPresets} 
          candidates={candidates}
          onCandidatesChange={setCandidates}
        />
      )}

      {activeTab === 'collaboration' && <CollaborationPanel meetings={currentData.meetings} />}

      {activeTab === 'archive' && <DecisionArchivePanel snapshots={currentData.decisions} />}
    </div>
  );
};

export default SchoolSelectionPlannerPage;
