import { useMemo } from 'react';
import { ArrowRight, CheckCircle2, Clock, Loader2, Sparkles } from 'lucide-react';

import type {
  RecommendationProgram,
  RecommendationVersion,
  StudentProfile,
  StrengthKey,
  WeightConfig,
  RiskPreference,
} from '../types';

import { CandidateBadge, ICON_COLOR_MAP, SectionHeader } from './shared';

interface AIRecommendationPanelProps {
  student: StudentProfile;
  recommendations: RecommendationProgram[];
  versions: RecommendationVersion[];
  activeVersionId: string;
  onSelectVersion: (id: string) => void;
  weightConfig: WeightConfig;
  onWeightChange: (key: StrengthKey, value: number) => void;
  riskPreference: RiskPreference;
  onRiskPreferenceChange: (value: RiskPreference) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  lastGenerationNote: string;
}

const LEVEL_ACCENT_MAP: Record<RecommendationProgram['level'], 'rose' | 'indigo' | 'emerald'> = {
  冲刺: 'rose',
  匹配: 'indigo',
  保底: 'emerald',
};

const WEIGHT_LABEL_MAP: Record<StrengthKey, string> = {
  ranking: '项目排名 / 品牌',
  research: '科研匹配度',
  internship: '实习 / 行业匹配',
  language: '语言门槛',
  budget: '预算与奖学金需求',
  location: '地理与生活偏好',
};

const WEIGHT_HINT_MAP: Record<StrengthKey, string> = {
  ranking: '重点关注世界排名、学院声誉与导师资源',
  research: '对学生科研方向、实验室匹配度的敏感程度',
  internship: '关注项目职业导向、实习机会与校友网络',
  language: '语言要求、考试成绩门槛与豁免政策',
  budget: '学费、奖学金、助研岗位与生活成本',
  location: '所处城市、签证环境、生活便利度',
};

const RISK_SUMMARY_MAP: Record<RiskPreference, string> = {
  稳健: '偏向降低申请风险，以匹配和保底院校为核心。',
  均衡: '兼顾冲刺与稳妥，保持梯度合理分布。',
  进取: '积极冲刺顶部院校，接受更高的不确定性。',
};

const RISK_OPTIONS: RiskPreference[] = ['稳健', '均衡', '进取'];

interface WeightSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

const WeightSlider = ({ label, description, value, onChange }: WeightSliderProps) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <div className="text-sm font-semibold text-gray-900 dark:text-white">{label}</div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
    />
    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const RecommendationCard = ({ program }: { program: RecommendationProgram }) => {
  const levelAccent = LEVEL_ACCENT_MAP[program.level];
  const iconColor = ICON_COLOR_MAP[levelAccent];
  const highlightAccents: Array<'purple' | 'cyan' | 'amber'> = ['purple', 'cyan', 'amber'];
  const logoInitial = program.school.charAt(0).toUpperCase();
  const logoColor = ICON_COLOR_MAP[levelAccent] ?? 'text-blue-500';

  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800/60 ${
      levelAccent === 'rose'
        ? 'border-rose-100 dark:border-rose-900/30'
        : levelAccent === 'indigo'
        ? 'border-indigo-100 dark:border-indigo-900/30'
        : 'border-emerald-100 dark:border-emerald-900/30'
    }`}>
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-lg font-semibold shadow-sm dark:border-gray-700 dark:bg-gray-900/60 ${logoColor}`}>
                {logoInitial}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{program.school}</span>
                  <span>·</span>
                  <span>{program.program}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <CandidateBadge value={program.level} accent={levelAccent} />
                  <CandidateBadge value={`匹配度 ${program.score}%`} accent="cyan" />
                  {program.highlight.map((tag, index) => (
                    <CandidateBadge key={tag} value={tag} accent={highlightAccents[index % highlightAccents.length]} />
                  ))}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
              <Sparkles className="h-4 w-4 text-blue-500" />
              AI 推荐
            </div>
          </div>

          <p className="leading-6 text-sm text-gray-600 dark:text-gray-300">{program.rationale}</p>

          <div className="rounded-xl bg-white/80 p-3 text-xs text-gray-700 shadow-sm dark:bg-gray-900/40 dark:text-gray-200">
            <div className={`mb-1 font-medium ${
              levelAccent === 'rose'
                ? 'text-rose-600 dark:text-rose-300'
                : levelAccent === 'indigo'
                ? 'text-indigo-600 dark:text-indigo-300'
                : 'text-emerald-600 dark:text-emerald-300'
            }`}>申请建议</div>
            <ul className="space-y-1">
              {program.requirements.map((requirement) => (
                <li key={requirement} className="flex items-center gap-2">
                  <CheckCircle2 className={`h-4 w-4 ${iconColor}`} />
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:w-72 xl:w-80">
          <div className="rounded-xl border border-dashed border-gray-200 p-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">案例参考</div>
            <p className="leading-5">{program.caseReference ?? '暂无相似案例，将在后续迭代中补充。'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


export const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({
  student,
  recommendations,
  versions,
  activeVersionId,
  onSelectVersion,
  weightConfig,
  onWeightChange,
  riskPreference,
  onRiskPreferenceChange,
  onGenerate,
  isGenerating,
  lastGenerationNote,
}) => {
  const weightEntries = useMemo(() => Object.keys(weightConfig) as StrengthKey[], [weightConfig]);

  return (
    <section className="space-y-4">
      <SectionHeader
        title="AI 智能选校"
        description="基于学生画像的一键生成方案，可调整权重并保留版本历史。"
        action={(
          <div className="flex items-center gap-2 overflow-x-auto">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => onSelectVersion(version.id)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs transition ${
                  activeVersionId === version.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                {version.id.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      />

      <div className="space-y-4">
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">权重调整</div>
            <span className="text-xs text-gray-400 dark:text-gray-500">拖动滑块以强调不同匹配维度（0 = 不重要，100 = 极其重要）</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {weightEntries.map((key) => (
              <WeightSlider
                key={key}
                label={WEIGHT_LABEL_MAP[key]}
                description={WEIGHT_HINT_MAP[key]}
                value={weightConfig[key]}
                onChange={(value) => onWeightChange(key, value)}
              />
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">风险偏好</div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{RISK_SUMMARY_MAP[riskPreference]}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {RISK_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => onRiskPreferenceChange(option)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                    riskPreference === option
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/60 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition ${
                isGenerating ? 'cursor-not-allowed opacity-80' : 'hover:bg-blue-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  生成中…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  生成 AI 推荐
                </>
              )}
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <ArrowRight className="h-4 w-4" />
              查看生成日志
            </button>
          </div>
          <div className="rounded-lg border border-dashed border-gray-200 p-4 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="font-medium text-gray-700 dark:text-gray-200">本次生成摘要</div>
            <p className="mt-1 leading-5">{lastGenerationNote || '调整权重并点击“生成 AI 推荐”后，将在此处展示生成理由。'}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((program) => (
          <RecommendationCard key={program.id} program={program} />
        ))}
      </div>
    </section>
  );
};
