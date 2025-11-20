import { useEffect, useMemo, useState } from 'react';
import { Brain, CalendarDays, ClipboardCheck, Download, Sparkles, Search, X, User, GraduationCap, MapPin, Tag, Users } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

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
            <button 
              onClick={() => setIsStudentSelectorOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <Users className="h-4 w-4" />
              切换学生
            </button>
          </>
        )}
        featureSelector={featureTabs}
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

      {/* 学生选择弹窗 - 优化设计 */}
      {isStudentSelectorOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur"
          onClick={() => {
            setIsStudentSelectorOpen(false);
            setSearchQuery('');
            setSelectedTag(null);
          }}
        >
          <div
            className="relative flex flex-col h-[85vh] w-[92vw] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={() => {
              setIsStudentSelectorOpen(false);
              setSearchQuery('');
              setSelectedTag(null);
            }}
            className="absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
          >
            <X className="h-4 w-4" />
          </button>

          {/* 弹窗头部 - 固定 */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  选择目标学生
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  共 {STUDENTS.length} 位申请学生，选择一位开始选校规划
                </p>
              </div>
            </div>

            {/* 搜索和筛选栏 */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索学生姓名、入学季、专业方向..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 标签筛选 */}
              {(() => {
                const allTags = Array.from(new Set(STUDENTS.flatMap(s => s.tags || [])));
                if (allTags.length === 0) return null;
                return (
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedTag(null)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                        selectedTag === null
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      全部
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                          selectedTag === tag
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 学生列表 - 可滚动 */}
          <div className="flex-1 overflow-y-auto px-6 py-5 min-h-0">
            {(() => {
              // 过滤学生
              let filteredStudents = STUDENTS.filter((student) => {
                // 搜索过滤
                if (searchQuery) {
                  const query = searchQuery.toLowerCase();
                  const matchesSearch = 
                    student.name.toLowerCase().includes(query) ||
                    student.intake.toLowerCase().includes(query) ||
                    student.goal.toLowerCase().includes(query) ||
                    student.tags?.some(tag => tag.toLowerCase().includes(query));
                  if (!matchesSearch) return false;
                }
                // 标签过滤
                if (selectedTag) {
                  if (!student.tags || !student.tags.includes(selectedTag)) return false;
                }
                return true;
              });

              if (filteredStudents.length === 0) {
                return (
                  <div className="py-12 text-center">
                    <User className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      未找到匹配的学生
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      请尝试调整搜索条件或筛选标签
                    </p>
                  </div>
                );
              }

              return (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredStudents.map((student) => {
                    const studentData = STUDENT_DATA[student.id];
                    const profile = studentData?.profile;
                    const isActive = student.id === activeStudentId;

                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          setActiveStudentId(student.id);
                          setIsStudentSelectorOpen(false);
                          setSearchQuery('');
                          setSelectedTag(null);
                        }}
                        className={`group relative flex flex-col gap-3 rounded-2xl border-2 p-5 text-left transition-all hover:shadow-lg min-h-0 ${
                          isActive
                            ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
                        }`}
                      >
                        {/* 当前标识 */}
                        {isActive && (
                          <div className="absolute top-4 right-4 z-10">
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm whitespace-nowrap">
                              <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                              当前学生
                            </span>
                          </div>
                        )}

                        {/* 学生头像和基本信息 */}
                        <div className="flex items-start gap-3 pr-24">
                          {/* 头像 */}
                          <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-md ${
                            isActive
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500 group-hover:from-blue-400 group-hover:to-indigo-500'
                          }`}>
                            {student.name.charAt(0)}
                          </div>

                          {/* 基本信息 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 break-words">
                              {student.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                              <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="break-words">{student.intake}</span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium break-words leading-relaxed">
                              {student.goal}
                            </p>
                          </div>
                        </div>

                        {/* 详细背景信息 */}
                        {profile && (
                          <div className="space-y-2.5 pt-3 border-t border-gray-200 dark:border-gray-700">
                            {/* 本科院校 */}
                            {profile.undergraduate && (
                              <div className="flex items-start gap-2 text-xs">
                                <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600 dark:text-gray-400 break-words leading-relaxed">
                                  {profile.undergraduate}
                                </span>
                              </div>
                            )}

                            {/* GPA 和语言成绩 */}
                            <div className="flex flex-wrap items-start gap-x-4 gap-y-2 text-xs">
                              {profile.gpa && (
                                <div className="flex items-start gap-1.5">
                                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">GPA:</span>
                                  <span className="font-medium text-gray-700 dark:text-gray-300 break-words">
                                    {profile.gpa}
                                  </span>
                                </div>
                              )}
                              {profile.languageScore && (
                                <div className="flex items-start gap-1.5 min-w-0">
                                  <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">语言:</span>
                                  <span className="font-medium text-gray-700 dark:text-gray-300 break-words">
                                    {profile.languageScore}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* 目标国家 */}
                            {profile.preferedCountries && profile.preferedCountries.length > 0 && (
                              <div className="flex items-start gap-2 text-xs">
                                <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">目标:</span>
                                <span className="font-medium text-gray-700 dark:text-gray-300 break-words">
                                  {profile.preferedCountries.join('、')}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 标签 */}
                        {student.tags && student.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {student.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap ${
                                  isActive
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}
                              >
                                <Tag className="h-3 w-3 flex-shrink-0" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 候选项目数量 */}
                        {studentData && (
                          <div className="pt-3 mt-auto border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">候选项目</span>
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                {studentData.candidates?.length || 0} 所
                              </span>
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default SchoolSelectionPlannerPage;
