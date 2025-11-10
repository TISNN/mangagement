import { useEffect, useMemo, useState } from 'react';
import { Brain, CalendarDays, ClipboardCheck, Download, Loader2, Sparkles } from 'lucide-react';

import {
  STUDENTS,
  STUDENT_DATA,
} from './data';
import type {
  RecommendationDefinition,
  RecommendationProgram,
  RecommendationVersion,
  RiskPreference,
  StrengthKey,
  WeightConfig,
} from './types';
import { AIRecommendationPanel } from './components/AIRecommendationPanel';
import { CollaborationPanel } from './components/CollaborationPanel';
import { DecisionArchivePanel } from './components/DecisionArchivePanel';
import { ManualSelectionPanel } from './components/ManualSelectionPanel';
import { OverviewPanel } from './components/OverviewPanel';

const TABS = [
  { key: 'recommendation', label: 'AI 推荐', description: '权重调优 · 版本管理' },
  { key: 'manual', label: '人工筛选', description: '筛选模版 · 候选池' },
  { key: 'collaboration', label: '会议协同', description: '沟通纪要 · 行动项' },
  { key: 'archive', label: '决策档案', description: '版本记录 · 附件管理' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

type Accent = Parameters<typeof OverviewPanel>[0]['stats'][number]['accent'];

const WEIGHT_LABEL_MAP: Record<StrengthKey, string> = {
  ranking: '项目排名 / 品牌',
  research: '科研匹配度',
  internship: '实习 / 行业匹配',
  language: '语言门槛',
  budget: '预算与奖学金需求',
  location: '地理与生活偏好',
};

const RISK_SUMMARY_MAP: Record<RiskPreference, string> = {
  稳健: '偏向降低申请风险，以匹配和保底院校为核心。',
  均衡: '兼顾冲刺与稳妥，保持梯度合理分布。',
  进取: '积极冲刺顶部院校，接受更高的不确定性。',
};

const computeScore = (item: RecommendationDefinition, weightConfig: WeightConfig, riskPreference: RiskPreference): number => {
  const weightBoost = item.strengths.reduce((acc, strength) => acc + (weightConfig[strength] - 50) / 5, 0);

  const riskAdjustments: Record<RecommendationDefinition['level'], number> =
    riskPreference === '稳健'
      ? { 冲刺: -6, 匹配: 3, 保底: 6 }
      : riskPreference === '进取'
        ? { 冲刺: 6, 匹配: 2, 保底: -5 }
        : { 冲刺: 2, 匹配: 1, 保底: 0 };

  const randomNudge = Math.random() * 2 - 1;
  const score = item.baseScore + weightBoost + riskAdjustments[item.level] + randomNudge;
  return Math.max(60, Math.min(99, Math.round(score)));
};

const formatDateTime = (date: Date) => {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')} ${`${date.getHours()}`.padStart(2, '0')}:${`${date.getMinutes()}`.padStart(2, '0')}`;
};

const DEFAULT_RISK_PREFERENCE: RiskPreference = '均衡';
const DEFAULT_WEIGHT: WeightConfig = {
  ranking: 60,
  research: 60,
  internship: 60,
  language: 50,
  budget: 50,
  location: 50,
};
const DEFAULT_STUDENT_ID = STUDENTS[0]?.id ?? '';

const SchoolSelectionPlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('recommendation');
  const defaultBundle = STUDENT_DATA[DEFAULT_STUDENT_ID];
  const [activeStudentId, setActiveStudentId] = useState<string>(DEFAULT_STUDENT_ID);
  const [versions, setVersions] = useState<RecommendationVersion[]>(
    defaultBundle?.versions.map((version) => ({ ...version })) ?? [],
  );
  const [activeVersionId, setActiveVersionId] = useState<string>(defaultBundle?.versions[0]?.id ?? '');
  const [recommendations, setRecommendations] = useState<RecommendationProgram[]>(() =>
    (defaultBundle?.recommendations ?? []).map((item) => ({ ...item, score: item.baseScore })),
  );
  const [weightConfig, setWeightConfig] = useState<WeightConfig>({
    ...(defaultBundle?.defaultWeightConfig ?? DEFAULT_WEIGHT),
  });
  const [riskPreference, setRiskPreference] = useState<RiskPreference>(
    defaultBundle?.defaultRiskPreference ?? DEFAULT_RISK_PREFERENCE,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerationNote, setLastGenerationNote] = useState('');
  const [isStudentSelectorOpen, setIsStudentSelectorOpen] = useState(false);

  useEffect(() => {
    const bundle = STUDENT_DATA[activeStudentId];
    if (!bundle) {
      return;
    }

    setVersions(bundle.versions.map((version) => ({ ...version })));
    setActiveVersionId(bundle.versions[0]?.id ?? '');
    setRecommendations(bundle.recommendations.map((item) => ({ ...item, score: item.baseScore })));
    setWeightConfig({ ...bundle.defaultWeightConfig });
    setRiskPreference(bundle.defaultRiskPreference);
    setLastGenerationNote('');
    setActiveTab('recommendation');
  }, [activeStudentId]);

  const currentData = STUDENT_DATA[activeStudentId] ?? defaultBundle;

  const handleWeightChange = (key: StrengthKey, value: number) => {
    setWeightConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateRecommendations = () => {
    if (isGenerating) return;
    const baseDefinitions = (STUDENT_DATA[activeStudentId] ?? defaultBundle)?.recommendations ?? [];
    if (baseDefinitions.length === 0) return;

    setIsGenerating(true);

    window.setTimeout(() => {
      const nextRecommendations = baseDefinitions
        .map((item) => ({
          ...item,
          score: computeScore(item, weightConfig, riskPreference),
        }))
        .sort((a, b) => b.score - a.score);

      setRecommendations(nextRecommendations);

      const sortedWeights = Object.entries(weightConfig).sort((a, b) => b[1] - a[1]);
      const primary = sortedWeights[0]?.[0] as StrengthKey | undefined;
      const secondary = sortedWeights[1]?.[0] as StrengthKey | undefined;
      const primaryLabel = primary ? WEIGHT_LABEL_MAP[primary] : '综合匹配';
      const secondaryLabel = secondary ? `、${WEIGHT_LABEL_MAP[secondary]}` : '';
      const descriptiveSummary = `${RISK_SUMMARY_MAP[riskPreference]} 重点关注${primaryLabel}${secondaryLabel}。`;

      setLastGenerationNote(descriptiveSummary);

      const nextVersionId = `v${versions.length + 1}`;
      const newVersion: RecommendationVersion = {
        id: nextVersionId,
        createdAt: formatDateTime(new Date()),
        createdBy: 'AI Copilot',
        summary: `根据${riskPreference}偏好，突出${primaryLabel}${secondaryLabel}权重，刷新推荐顺序。`,
        adopted: true,
      };

      setVersions((prev) => [newVersion, ...prev.map((version) => ({ ...version, adopted: false }))]);
      setActiveVersionId(newVersion.id);
      setIsGenerating(false);
    }, 450);
  };

  const headerStats = useMemo(() => {
    if (!currentData) return [];
    const { profile } = currentData;
    return [
      {
        label: '目标学生',
        value: `${profile.name}｜${profile.programGoal}`,
        accent: 'indigo' as Accent,
        icon: <CalendarDays className="h-4 w-4" />,
      },
      {
        label: '当前方案版本',
        value: activeVersionId.toUpperCase() || '—',
        accent: 'purple' as Accent,
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        label: 'AI 推荐数量',
        value: `${recommendations.length} 所`,
        accent: 'cyan' as Accent,
        icon: <Brain className="h-4 w-4" />,
      },
      {
        label: '冲 / 匹 / 保 配比',
        value: `${profile.targetDistribution.sprint}% / ${profile.targetDistribution.match}% / ${profile.targetDistribution.safety}%`,
        accent: 'orange' as Accent,
        icon: <ClipboardCheck className="h-4 w-4" />,
      },
    ];
  }, [activeVersionId, currentData, recommendations.length]);

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
          className={`flex flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition ${
            activeTab === tab.key
              ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-200'
              : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900/60 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:text-blue-200'
          }`}
        >
          <span className="text-sm font-semibold">{tab.label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{tab.description}</span>
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
            <button
              onClick={handleGenerateRecommendations}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition ${
                isGenerating ? 'cursor-not-allowed opacity-80' : 'hover:bg-blue-700'
              }`}
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isGenerating ? '生成中…' : '生成 AI 推荐'}
            </button>
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

      {activeTab === 'recommendation' && (
        <AIRecommendationPanel
          student={currentData.profile}
          recommendations={recommendations}
          versions={versions}
          activeVersionId={activeVersionId}
          onSelectVersion={setActiveVersionId}
          weightConfig={weightConfig}
          onWeightChange={handleWeightChange}
          riskPreference={riskPreference}
          onRiskPreferenceChange={setRiskPreference}
          onGenerate={handleGenerateRecommendations}
          isGenerating={isGenerating}
          lastGenerationNote={lastGenerationNote}
        />
      )}

      {activeTab === 'manual' && (
        <ManualSelectionPanel presets={currentData.manualPresets} candidates={currentData.candidates} />
      )}

      {activeTab === 'collaboration' && <CollaborationPanel meetings={currentData.meetings} />}

      {activeTab === 'archive' && <DecisionArchivePanel snapshots={currentData.decisions} />}
    </div>
  );
};

export default SchoolSelectionPlannerPage;
