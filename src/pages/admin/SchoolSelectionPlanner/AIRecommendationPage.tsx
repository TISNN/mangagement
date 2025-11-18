/**
 * AI智能推荐页面
 * 独立页面，在新标签页中打开
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { STUDENT_DATA } from './data';
import type { StudentProfile, AIMatchCriteria, AIRecommendationMode } from './types';
import { useDeepSearch } from './components/AIRecommendation/hooks/useDeepSearch';
import { generateMockRecommendations } from './components/AIRecommendation/utils/mockData';
import { AIRecommendationContent } from './components/AIRecommendation/AIRecommendationContent';
import { parseGPA, parseLanguageScores } from './components/AIRecommendation/hooks/useStudentParser';

const AIRecommendationPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'config' | 'searching' | 'results'>('config');
  const [mode, setMode] = useState<AIRecommendationMode>('quick');
  const [criteria, setCriteria] = useState<AIMatchCriteria | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // 从数据中加载学生信息
  useEffect(() => {
    if (studentId) {
      const bundle = STUDENT_DATA[studentId];
      if (bundle?.profile) {
        const profile = bundle.profile;
        setStudent(profile);
        const initialCriteria: AIMatchCriteria = {
          mode: 'quick',
          targetCountries: profile.preferedCountries || [],
          targetPrograms: profile.targetPrograms || [],
          currentSchool: profile.undergraduate?.split('·')[0]?.trim(),
          gpa: parseGPA(profile.gpa),
          gpaScale: profile.gpa?.includes('4.0') ? '4.0' : '100',
          languageScores: parseLanguageScores(profile),
        };
        setCriteria(initialCriteria);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [studentId]);

  // 深度检索Hook
  const { searchProgress, isGenerating, setIsGenerating, performDeepSearch } = useDeepSearch({
    criteria: criteria || { targetCountries: [], targetPrograms: [] },
    onComplete: (recs) => {
      setRecommendations(recs);
      setStep('results');
      setIsGenerating(false);
    },
  });

  // 生成推荐
  const handleGenerate = async () => {
    if (!criteria) return;

    setIsGenerating(true);
    setCriteria({ ...criteria, mode });

    if (mode === 'deep') {
      setStep('searching');
      await performDeepSearch();
      // 生成结果
      const mockRecs = generateMockRecommendations('deep');
      setRecommendations(mockRecs);
      setStep('results');
      setIsGenerating(false);
    } else {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockRecs = generateMockRecommendations('quick');
      setRecommendations(mockRecs);
      setStep('results');
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!student || !criteria) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-gray-900 dark:text-white">未找到学生信息</p>
          <button
            onClick={() => navigate('/admin/school-selection-planner')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            返回选校规划
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 页面头部 */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/school-selection-planner')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
                <span>返回</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI智能推荐</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AIRecommendationContent
          student={student}
          criteria={criteria}
          mode={mode}
          step={step}
          recommendations={recommendations}
          searchProgress={searchProgress}
          isGenerating={isGenerating}
          onModeChange={(newMode) => {
            setMode(newMode);
            setCriteria({ ...criteria, mode: newMode });
          }}
          onCriteriaChange={setCriteria}
          onGenerate={handleGenerate}
          onAddToCandidates={(recs) => {
            // 这里可以通过postMessage或者localStorage与父窗口通信
            alert(`已添加 ${recs.length} 项到候选池`);
          }}
        />
      </div>
    </div>
  );
};

export default AIRecommendationPage;
