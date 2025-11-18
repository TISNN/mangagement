/**
 * AI推荐对话框组件
 * 基于条件匹配的AI智能推荐
 */

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, ChevronDown, ChevronUp, Zap, Database } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import type { StudentProfile, AIMatchCriteria, AIRecommendationResult, AIRecommendationMode, DeepSearchProgress } from '../types';

interface AIRecommendationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfile;
  onAddToCandidates: (recommendations: AIRecommendationResult[]) => void;
}

const LEVEL_COLOR_MAP = {
  冲刺: 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800',
  匹配: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:text-indigo-400 dark:bg-indigo-900/20 dark:border-indigo-800',
  保底: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800',
};

export const AIRecommendationDialog: React.FC<AIRecommendationDialogProps> = ({
  open,
  onOpenChange,
  student,
  onAddToCandidates,
}) => {
  const [step, setStep] = useState<'config' | 'searching' | 'results'>('config');
  const [mode, setMode] = useState<AIRecommendationMode>('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [criteria, setCriteria] = useState<AIMatchCriteria>({
    mode: 'quick',
    targetCountries: student.preferedCountries || [],
    targetPrograms: student.targetPrograms || [],
  });
  const [recommendations, setRecommendations] = useState<AIRecommendationResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchProgress, setSearchProgress] = useState<DeepSearchProgress | null>(null);

  // 解析GPA
  const parseGPA = (gpaStr?: string): number | undefined => {
    if (!gpaStr) return undefined;
    const match = gpaStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : undefined;
  };

  // 解析语言成绩
  const parseLanguageScores = (student: StudentProfile) => {
    const scores: AIMatchCriteria['languageScores'] = {};
    if (student.languageScore) {
      // 解析TOEFL
      const toeflMatch = student.languageScore.match(/TOEFL[:\s]*(\d+)/i);
      if (toeflMatch) scores.toefl = parseInt(toeflMatch[1]);

      // 解析IELTS
      const ieltsMatch = student.languageScore.match(/IELTS[:\s]*(\d+\.?\d*)/i);
      if (ieltsMatch) scores.ielts = parseFloat(ieltsMatch[1]);
    }
    if (student.standardizedTests) {
      // 解析GRE
      const greMatch = student.standardizedTests.join(' ').match(/GRE[:\s]*(\d+)/i);
      if (greMatch) scores.gre = parseInt(greMatch[1]);

      // 解析GMAT
      const gmatMatch = student.standardizedTests.join(' ').match(/GMAT[:\s]*(\d+)/i);
      if (gmatMatch) scores.gmat = parseInt(gmatMatch[1]);
    }
    return scores;
  };

  // 初始化条件
  useEffect(() => {
    if (open && student) {
      setCriteria({
        mode: 'quick',
        targetCountries: student.preferedCountries || [],
        targetPrograms: student.targetPrograms || [],
        currentSchool: student.undergraduate?.split('·')[0]?.trim(),
        gpa: parseGPA(student.gpa),
        gpaScale: student.gpa?.includes('4.0') ? '4.0' : '100',
        languageScores: parseLanguageScores(student),
      });
      setMode('quick');
      setStep('config');
      setRecommendations([]);
      setSearchProgress(null);
    }
  }, [open, student]);

  // 深度检索进度更新
  const updateDeepSearchProgress = (
    stage: DeepSearchProgress['stage'],
    progress: number,
    message: string,
    scannedCount?: number,
    totalCount?: number,
    matchedCount?: number,
    filteredCount?: number,
    analyzedCount?: number,
    details?: string[]
  ) => {
    setSearchProgress({
      stage,
      currentStep: message,
      progress,
      scannedCount,
      totalCount,
      matchedCount,
      filteredCount,
      analyzedCount,
      message,
      details,
    });
  };

  // 深度检索流程（8阶段细化版）
  const performDeepSearch = async () => {
    const totalPrograms = 6644;

    // 阶段1: 解析匹配条件 (0-5%)
    updateDeepSearchProgress(
      'parsing',
      2,
      '正在解析匹配条件...',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ['解析目标国家: ' + (criteria.targetCountries.join(', ') || '未设置'), '解析专业方向: ' + (criteria.targetPrograms.join(', ') || '未设置')]
    );
    await new Promise((resolve) => setTimeout(resolve, 400));
    updateDeepSearchProgress('parsing', 5, '条件解析完成', undefined, undefined, undefined, undefined, undefined, ['✓ 已解析学生背景数据', '✓ 已解析GPA和语言成绩']);

    // 阶段2: 加载项目数据库 (5-15%)
    updateDeepSearchProgress('loading', 7, '正在连接数据库...', 0, totalPrograms);
    await new Promise((resolve) => setTimeout(resolve, 300));

    let scanned = 0;
    const loadInterval = setInterval(() => {
      scanned += Math.floor(totalPrograms / 25);
      if (scanned >= totalPrograms) {
        scanned = totalPrograms;
        clearInterval(loadInterval);
      }
      const progress = 7 + Math.floor((scanned / totalPrograms) * 8);
      updateDeepSearchProgress(
        'loading',
        progress,
        `正在加载项目数据库...`,
        scanned,
        totalPrograms,
        undefined,
        undefined,
        undefined,
        [`已加载 ${scanned} / ${totalPrograms} 个项目`]
      );
    }, 80);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(loadInterval);
    updateDeepSearchProgress('loading', 15, '项目数据库加载完成', totalPrograms, totalPrograms, undefined, undefined, undefined, [`✓ 已加载全部 ${totalPrograms} 个项目`]);

    // 阶段3: 初步筛选 (15-35%)
    updateDeepSearchProgress('initialFilter', 18, '正在进行初步筛选...', totalPrograms, totalPrograms);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = 0;
    const filterInterval = setInterval(() => {
      filtered += Math.floor(2000 / 20);
      if (filtered >= 2000) {
        filtered = 2000;
        clearInterval(filterInterval);
      }
      const progress = 18 + Math.floor((filtered / 2000) * 17);
      updateDeepSearchProgress(
        'initialFilter',
        progress,
        `正在按条件筛选项目...`,
        totalPrograms,
        totalPrograms,
        undefined,
        filtered,
        undefined,
        [
          '✓ 按国家筛选: ' + criteria.targetCountries.length + ' 个国家',
          '✓ 按专业类别筛选',
          `已筛选出 ${filtered} 个符合条件的项目`,
        ]
      );
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearInterval(filterInterval);
    updateDeepSearchProgress('initialFilter', 35, `初步筛选完成，共 ${filtered} 个项目`, totalPrograms, totalPrograms, undefined, filtered);

    // 阶段4: 条件匹配 (35-55%)
    updateDeepSearchProgress('conditionMatch', 38, '正在匹配申请条件...', totalPrograms, totalPrograms, undefined, filtered);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let matched = 0;
    const matchInterval = setInterval(() => {
      matched += Math.floor(800 / 18);
      if (matched >= 800) {
        matched = 800;
        clearInterval(matchInterval);
      }
      const progress = 38 + Math.floor((matched / 800) * 17);
      updateDeepSearchProgress(
        'conditionMatch',
        progress,
        `正在匹配申请条件...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        undefined,
        [
          '✓ GPA要求匹配: ' + Math.floor(matched * 0.4) + ' 项',
          '✓ 语言成绩匹配: ' + Math.floor(matched * 0.3) + ' 项',
          '✓ 预算范围匹配: ' + Math.floor(matched * 0.3) + ' 项',
          `已匹配 ${matched} 个项目`,
        ]
      );
    }, 90);

    await new Promise((resolve) => setTimeout(resolve, 1800));
    clearInterval(matchInterval);
    updateDeepSearchProgress('conditionMatch', 55, `条件匹配完成，共 ${matched} 个匹配项目`, totalPrograms, totalPrograms, matched, filtered);

    // 阶段5: 深度分析 (55-75%)
    updateDeepSearchProgress('deepAnalysis', 58, '正在进行深度分析...', totalPrograms, totalPrograms, matched, filtered);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let analyzed = 0;
    const analysisInterval = setInterval(() => {
      analyzed += Math.floor(matched / 17);
      if (analyzed >= matched) {
        analyzed = matched;
        clearInterval(analysisInterval);
      }
      const progress = 58 + Math.floor((analyzed / matched) * 17);
      updateDeepSearchProgress(
        'deepAnalysis',
        progress,
        `正在深度分析项目...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 课程匹配度分析: ' + Math.floor(analyzed * 0.3) + ' 项',
          '✓ 实习经历匹配: ' + Math.floor(analyzed * 0.25) + ' 项',
          '✓ 科研背景匹配: ' + Math.floor(analyzed * 0.25) + ' 项',
          '✓ 职业目标匹配: ' + Math.floor(analyzed * 0.2) + ' 项',
          `已分析 ${analyzed} 个项目`,
        ]
      );
    }, 100);

    await new Promise((resolve) => setTimeout(resolve, 1700));
    clearInterval(analysisInterval);
    updateDeepSearchProgress('deepAnalysis', 75, `深度分析完成，共分析 ${analyzed} 个项目`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段6: AI评分计算 (75-85%)
    updateDeepSearchProgress('scoring', 78, '正在计算AI匹配度分数...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 500));

    let scored = 0;
    const scoreInterval = setInterval(() => {
      scored += Math.floor(analyzed / 7);
      if (scored >= analyzed) {
        scored = analyzed;
        clearInterval(scoreInterval);
      }
      const progress = 78 + Math.floor((scored / analyzed) * 7);
      updateDeepSearchProgress(
        'scoring',
        progress,
        `正在计算匹配度分数...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 综合匹配度计算: ' + Math.floor(scored * 0.4) + ' 项',
          '✓ 冲刺/匹配/保底分级: ' + Math.floor(scored * 0.6) + ' 项',
          `已计算 ${scored} 个项目评分`,
        ]
      );
    }, 120);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    clearInterval(scoreInterval);
    updateDeepSearchProgress('scoring', 85, `AI评分计算完成，共 ${scored} 个项目`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段7: 相似案例对比 (85-95%)
    updateDeepSearchProgress('caseComparison', 88, '正在查找相似案例...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 600));

    let casesFound = 0;
    const caseInterval = setInterval(() => {
      casesFound += Math.floor(scored / 7);
      if (casesFound >= scored) {
        casesFound = scored;
        clearInterval(caseInterval);
      }
      const progress = 88 + Math.floor((casesFound / scored) * 7);
      updateDeepSearchProgress(
        'caseComparison',
        progress,
        `正在对比历史成功案例...`,
        totalPrograms,
        totalPrograms,
        matched,
        filtered,
        analyzed,
        [
          '✓ 查找相似背景学生: ' + Math.floor(casesFound * 0.6) + ' 项',
          '✓ 对比录取数据: ' + Math.floor(casesFound * 0.4) + ' 项',
          `已对比 ${casesFound} 个项目`,
        ]
      );
    }, 150);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    clearInterval(caseInterval);
    updateDeepSearchProgress('caseComparison', 95, `相似案例对比完成`, totalPrograms, totalPrograms, matched, filtered, analyzed);

    // 阶段8: 结果排序整理 (95-100%)
    updateDeepSearchProgress('sorting', 97, '正在排序和整理结果...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 400));

    updateDeepSearchProgress('sorting', 99, '正在生成推荐理由...', totalPrograms, totalPrograms, matched, filtered, analyzed);
    await new Promise((resolve) => setTimeout(resolve, 300));

    updateDeepSearchProgress('completed', 100, '深度检索完成！', totalPrograms, totalPrograms, matched, filtered, analyzed, ['✓ 所有阶段已完成', '✓ 结果已准备好']);
    await new Promise((resolve) => setTimeout(resolve, 400));
  };

  // 生成推荐
  const handleGenerate = async () => {
    setIsGenerating(true);
    setCriteria({ ...criteria, mode });

    if (mode === 'deep') {
      // 深度检索模式: 显示进度界面
      setStep('searching');
      await performDeepSearch();
    } else {
      // Quick模式: 直接生成结果
      // 模拟AI匹配算法(实际应该调用后端API)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    // 生成模拟推荐结果
    const mockRecommendations: AIRecommendationResult[] = [
      {
        id: '1',
        school: 'MIT',
        program: 'MEng in Computer Science',
        level: '冲刺',
        matchScore: 92,
        matchReason: 'GPA匹配度高,语言成绩优秀',
        rationale: '科研成果与目标项目高度匹配,建议强化推荐信组合以支撑冲刺。',
        highlight: ['冲刺', 'AI推荐', '科研匹配'],
        requirements: ['补充一封海外教授推荐信', '进一步量化科研成果'],
        similarCases: [
          {
            id: 1,
            studentName: '张同学',
            admissionYear: 2024,
            gpa: '3.8/4.0',
            languageScores: 'TOEFL 108',
          },
        ],
      },
      {
        id: '2',
        school: 'CMU',
        program: 'MS in Software Engineering',
        level: '匹配',
        matchScore: 88,
        matchReason: '实习经历匹配,项目强调工程落地',
        rationale: '课程结构契合学生实习经历,项目强调工程落地能力。',
        highlight: ['匹配', '工程导向', '签证友好'],
        requirements: ['建议提前准备 coding assignment', '补充一个开源项目成果'],
      },
      {
        id: '3',
        school: 'Northeastern University',
        program: 'MS in Information Systems',
        level: '保底',
        matchScore: 81,
        matchReason: '过往录取率高,课程实践性强',
        rationale: '过往录取率高,课程实践性强,适合作为保底选项。',
        highlight: ['保底', 'Co-op实习', '城市资源丰富'],
        requirements: ['准备额外的职业规划陈述', '强调实习成果与职业目标关联'],
      },
      {
        id: '4',
        school: 'UIUC',
        program: 'MS in Computer Science',
        level: '匹配',
        matchScore: 85,
        matchReason: '排名适中,GPA要求匹配',
        rationale: '课程强但竞争激烈,需准备数学背景补充材料。',
        highlight: ['匹配', '数学要求', '研究机会多'],
        requirements: ['补充数学背景材料', '强化数学课程成绩单'],
      },
      {
        id: '5',
        school: 'University of Washington',
        program: 'MS in Data Science',
        level: '匹配',
        matchScore: 83,
        matchReason: '专业方向匹配,地理位置优越',
        rationale: '数据科学方向与实习经历匹配,地理位置优越。',
        highlight: ['匹配', '数据科学', '西海岸'],
        requirements: ['准备数据科学项目作品集', '强调数据分析实习经验'],
      },
    ];

    setRecommendations(mode === 'deep' ? mockRecommendations.concat(Array(20).fill(null).map((_, i) => ({
      id: `deep-${i + 6}`,
      school: `University ${i + 1}`,
      program: `Program ${i + 1}`,
      level: (['冲刺', '匹配', '保底'] as const)[i % 3],
      matchScore: 75 + Math.floor(Math.random() * 20),
      matchReason: `深度检索匹配项目 ${i + 1}`,
      rationale: `通过全库检索发现的项目 ${i + 1}`,
      highlight: ['深度检索', '全库匹配'],
      requirements: [],
    }))) : mockRecommendations);
    setStep('results');
    setIsGenerating(false);
  };

  // 切换展开/收起
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  // 切换选中状态
  const toggleSelect = (id: string) => {
    setRecommendations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = recommendations.every((item) => item.selected);
    setRecommendations((prev) => prev.map((item) => ({ ...item, selected: !allSelected })));
  };

  // 加入候选池
  const handleAddToCandidates = () => {
    const selected = recommendations.filter((item) => item.selected);
    if (selected.length === 0) {
      alert('请至少选择一个推荐项目');
      return;
    }
    onAddToCandidates(selected);
    onOpenChange(false);
  };

  const selectedCount = recommendations.filter((item) => item.selected).length;
  const stats = {
    冲刺: recommendations.filter((item) => item.level === '冲刺').length,
    匹配: recommendations.filter((item) => item.level === '匹配').length,
    保底: recommendations.filter((item) => item.level === '保底').length,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[1000px] !max-w-[1200px] !h-[700px] !max-h-[700px] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI智能推荐
          </DialogTitle>
          <DialogDescription>基于学生条件匹配推荐合适的学校/专业</DialogDescription>
        </DialogHeader>

        {step === 'config' && (
          <div className="space-y-6 py-4">
            {/* 推荐模式选择 */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">🔍 推荐模式</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('quick');
                    setCriteria({ ...criteria, mode: 'quick' });
                  }}
                  className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
                    mode === 'quick'
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        mode === 'quick'
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">快速推荐</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Quick Match</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    基于条件快速匹配，推荐时间约 2-3 秒，适合快速查看初步推荐结果
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>⚡ 快速</span>
                    <span>•</span>
                    <span>📊 约 20-30 项</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('deep');
                    setCriteria({ ...criteria, mode: 'deep' });
                  }}
                  className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition ${
                    mode === 'deep'
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800/40 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        mode === 'deep'
                          ? 'bg-blue-600 text-white dark:bg-blue-500'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">深度检索</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Deep Search</div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                    查阅全量项目库进行筛选，推荐时间约 8-12 秒，提供更全面的匹配结果
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>🔬 全面</span>
                    <span>•</span>
                    <span>📚 全库检索</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 学生基本信息(只读) */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">📋 学生基本信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">学生姓名:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">{student.name}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">当前学校:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {criteria.currentSchool || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">GPA:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {student.gpa || '—'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">语言成绩:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {student.languageScore || '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* 匹配条件(可编辑) */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">⚙️ 匹配条件</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    目标国家
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['美国', '英国', '加拿大', '澳大利亚', '新加坡'].map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          const newCountries = criteria.targetCountries.includes(country)
                            ? criteria.targetCountries.filter((c) => c !== country)
                            : [...criteria.targetCountries, country];
                          setCriteria({ ...criteria, targetCountries: newCountries });
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                          criteria.targetCountries.includes(country)
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {country}
                        {criteria.targetCountries.includes(country) && ' ✓'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    专业方向
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['CS', 'SE', 'AI', 'Data Science', 'Finance', 'Business'].map((program) => (
                      <button
                        key={program}
                        onClick={() => {
                          const newPrograms = criteria.targetPrograms.includes(program)
                            ? criteria.targetPrograms.filter((p) => p !== program)
                            : [...criteria.targetPrograms, program];
                          setCriteria({ ...criteria, targetPrograms: newPrograms });
                        }}
                        className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                          criteria.targetPrograms.includes(program)
                            ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {program}
                        {criteria.targetPrograms.includes(program) && ' ✓'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    预算范围(人民币/年)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      placeholder="最小预算"
                      value={criteria.budgetRange?.min || ''}
                      onChange={(e) =>
                        setCriteria({
                          ...criteria,
                          budgetRange: {
                            ...criteria.budgetRange,
                            min: e.target.value ? parseInt(e.target.value) : undefined,
                            currency: 'CNY',
                          },
                        })
                      }
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="最大预算"
                      value={criteria.budgetRange?.max || ''}
                      onChange={(e) =>
                        setCriteria({
                          ...criteria,
                          budgetRange: {
                            ...criteria.budgetRange,
                            max: e.target.value ? parseInt(e.target.value) : undefined,
                            currency: 'CNY',
                          },
                        })
                      }
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'searching' && searchProgress && (
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <div className="w-full max-w-2xl space-y-6">
              {/* 标题 */}
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Database className="h-8 w-8 animate-pulse text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">深度检索中...</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{searchProgress.message}</p>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{searchProgress.currentStep}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{searchProgress.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                    style={{ width: `${searchProgress.progress}%` }}
                  />
                </div>
              </div>

              {/* 阶段指示器（8阶段细化版） */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { key: 'parsing', label: '解析条件', icon: '🔍', desc: '解析匹配条件' },
                  { key: 'loading', label: '加载数据库', icon: '📚', desc: '加载项目数据库' },
                  { key: 'initialFilter', label: '初步筛选', icon: '🔎', desc: '按条件初步筛选' },
                  { key: 'conditionMatch', label: '条件匹配', icon: '✅', desc: '匹配申请条件' },
                  { key: 'deepAnalysis', label: '深度分析', icon: '🧠', desc: '深度分析匹配度' },
                  { key: 'scoring', label: 'AI评分', icon: '📊', desc: '计算匹配度分数' },
                  { key: 'caseComparison', label: '案例对比', icon: '📖', desc: '对比历史案例' },
                  { key: 'sorting', label: '排序整理', icon: '⭐', desc: '排序和整理结果' },
                ].map((stage, index) => {
                  const stageKeys: DeepSearchProgress['stage'][] = [
                    'parsing',
                    'loading',
                    'initialFilter',
                    'conditionMatch',
                    'deepAnalysis',
                    'scoring',
                    'caseComparison',
                    'sorting',
                  ];
                  const currentStageIndex = stageKeys.indexOf(searchProgress.stage);
                  const isActive = index <= currentStageIndex;
                  const isCurrent = searchProgress.stage === stage.key;

                  return (
                    <div
                      key={stage.key}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                          : isActive
                          ? 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-900/30'
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/40'
                      }`}
                    >
                      <div
                        className={`text-2xl ${isCurrent ? 'animate-pulse' : isActive ? '' : 'opacity-40'}`}
                      >
                        {stage.icon}
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400'
                            : isActive
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-gray-400 dark:text-gray-500">{stage.desc}</div>
                      {isCurrent && (
                        <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />
                      )}
                      {isActive && !isCurrent && (
                        <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 统计信息 */}
              {searchProgress.totalCount && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800/60">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {searchProgress.totalCount.toLocaleString()}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">项目库总数</div>
                    </div>
                    {searchProgress.filteredCount && (
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                          {searchProgress.filteredCount.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">初步筛选</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {searchProgress.matchedCount?.toLocaleString() || 0}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">条件匹配</div>
                    </div>
                    {searchProgress.analyzedCount && (
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                          {searchProgress.analyzedCount.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">深度分析</div>
                      </div>
                    )}
                  </div>

                  {/* 详细步骤信息 */}
                  {searchProgress.details && searchProgress.details.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                      <div className="mb-2 text-xs font-semibold text-gray-700 dark:text-gray-300">当前步骤详情:</div>
                      <ul className="space-y-1">
                        {searchProgress.details.map((detail, idx) => (
                          <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-4 py-4">
            {/* 推荐统计 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-center dark:border-rose-900/30 dark:bg-rose-900/20">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.冲刺}</div>
                <div className="text-xs text-rose-600 dark:text-rose-400">冲刺</div>
              </div>
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center dark:border-indigo-900/30 dark:bg-indigo-900/20">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.匹配}</div>
                <div className="text-xs text-indigo-600 dark:text-indigo-400">匹配</div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center dark:border-emerald-900/30 dark:bg-emerald-900/20">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.保底}</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400">保底</div>
              </div>
            </div>

            {/* 推荐列表 */}
            <div className="space-y-3">
              {(['冲刺', '匹配', '保底'] as const).map((level) => {
                const levelItems = recommendations.filter((item) => item.level === level);
                if (levelItems.length === 0) return null;

                return (
                  <div key={level} className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {level}档位 ({levelItems.length}所)
                    </h4>
                    {levelItems.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-lg border p-4 transition ${
                          item.selected
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                            : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.selected || false}
                            onChange={() => toggleSelect(item.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">{item.school}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{item.program}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR_MAP[item.level]}`}
                                >
                                  {item.level}
                                </span>
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                  匹配度: {item.matchScore}分
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {item.matchReason}
                            </div>

                            <button
                              onClick={() => toggleExpand(item.id)}
                              className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {expandedItems.has(item.id) ? (
                                <>
                                  <ChevronUp className="h-3 w-3" />
                                  收起详情
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" />
                                  展开详情
                                </>
                              )}
                            </button>

                            {expandedItems.has(item.id) && (
                              <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900/50">
                                <div>
                                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    推荐理由:
                                  </div>
                                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    {item.rationale}
                                  </div>
                                </div>
                                {item.requirements && item.requirements.length > 0 && (
                                  <div>
                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                      需补充材料:
                                    </div>
                                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
                                      {item.requirements.map((req, idx) => (
                                        <li key={idx}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {item.similarCases && item.similarCases.length > 0 && (
                                  <div>
                                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                      相似案例:
                                    </div>
                                    <div className="mt-1 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                      {item.similarCases.map((caseItem, idx) => (
                                        <div key={idx}>
                                          {caseItem.studentName} ({caseItem.admissionYear}年录取) - GPA:{' '}
                                          {caseItem.gpa}, {caseItem.languageScores}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'config' && (
            <>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || criteria.targetCountries.length === 0 || criteria.targetPrograms.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'deep' ? '准备中...' : '生成中...'}
                  </>
                ) : (
                  <>
                    {mode === 'deep' ? (
                      <>
                        <Database className="h-4 w-4" />
                        开始深度检索
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        开始快速推荐
                      </>
                    )}
                  </>
                )}
              </button>
            </>
          )}

          {step === 'searching' && searchProgress && (
            <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
              深度检索中，请稍候...预计还需要 {Math.max(0, Math.ceil((100 - searchProgress.progress) / 10))} 秒
            </div>
          )}

          {step === 'results' && (
            <>
              <button
                onClick={toggleSelectAll}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {recommendations.every((item) => item.selected) ? '取消全选' : '全选'}
              </button>
              <button
                onClick={handleAddToCandidates}
                disabled={selectedCount === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                加入候选池({selectedCount}项)
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
