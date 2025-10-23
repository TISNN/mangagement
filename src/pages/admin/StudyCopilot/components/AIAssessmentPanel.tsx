import React, { useState } from 'react';
import { Sparkles, Target, AlertTriangle, Clock, FileText, ChevronRight } from 'lucide-react';

interface School {
  name: string;
  program: string;
  matchRate: number;
  reason: string;
  requirements: string[];
}

interface AIAssessmentPanelProps {
  onGenerateReport: () => void;
}

const AIAssessmentPanel: React.FC<AIAssessmentPanelProps> = ({ onGenerateReport }) => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);

  // 推荐院校数据
  const recommendedSchools: School[] = [
    {
      name: 'Nanyang Technological University',
      program: 'Master of Media and Communication',
      matchRate: 92,
      reason: 'GPA和语言成绩符合要求，新闻学背景高度匹配',
      requirements: ['雅思6.5+', 'GPA 3.0+', '相关背景']
    },
    {
      name: 'University of Warwick',
      program: 'MA Media and Communication',
      matchRate: 88,
      reason: '英国传媒强校，接受跨专业申请',
      requirements: ['雅思7.0', 'GPA 3.2+', '作品集加分']
    },
    {
      name: 'University of Leeds',
      program: 'MA Communication and Media',
      matchRate: 85,
      reason: '综合排名和专业排名均优秀',
      requirements: ['雅思6.5', 'GPA 3.0+']
    },
  ];

  // 风险点
  const riskPoints = [
    { type: 'warning', content: '语言成绩偏低，建议提升至雅思7.0以增加竞争力' },
    { type: 'info', content: '缺少实习经历，建议补充1-2段媒体相关实习' },
  ];

  const handleGenerateAssessment = () => {
    setIsAssessing(true);
    setTimeout(() => {
      setIsAssessing(false);
      setHasAssessment(true);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          AI智能评估
        </h3>
        {!hasAssessment && (
          <button
            onClick={handleGenerateAssessment}
            disabled={isAssessing}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {isAssessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>生成初评</span>
              </>
            )}
          </button>
        )}
      </div>

      {hasAssessment ? (
        <div className="space-y-6">
          {/* 五维雷达图 */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              匹配度分析
            </h4>
            <div className="grid grid-cols-5 gap-3 text-center">
              {[
                { label: '学术', score: 85 },
                { label: '语言', score: 70 },
                { label: '背景', score: 90 },
                { label: '动机', score: 95 },
                { label: '预算', score: 80 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${item.score * 1.76} 176`}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{item.score}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 推荐院校 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">🏫 推荐院校方案</h4>
            <div className="space-y-3">
              {recommendedSchools.map((school, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all cursor-pointer border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 dark:text-white">{school.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{school.program}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{school.matchRate}%</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">匹配度</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    💡 {school.reason}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {school.requirements.map((req, ridx) => (
                      <span key={ridx} className="text-xs px-2 py-1 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500 text-gray-700 dark:text-gray-300">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 风险点 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              需要关注的风险点
            </h4>
            <div className="space-y-2">
              {riskPoints.map((risk, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-start gap-2 ${
                    risk.type === 'warning'
                      ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    risk.type === 'warning'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  <p className={`text-sm ${
                    risk.type === 'warning'
                      ? 'text-orange-900 dark:text-orange-300'
                      : 'text-blue-900 dark:text-blue-300'
                  }`}>
                    {risk.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 时间线 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              申请时间规划
            </h4>
            <div className="space-y-2">
              {[
                { month: '11月', task: '语言考试准备', status: 'current' },
                { month: '12月-1月', task: '文书材料准备', status: 'pending' },
                { month: '2月-3月', task: '递交申请', status: 'pending' },
                { month: '4月-6月', task: '等待offer', status: 'pending' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'current'
                      ? 'bg-purple-600 dark:bg-purple-400 ring-4 ring-purple-200 dark:ring-purple-800'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}></div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm ${
                      item.status === 'current'
                        ? 'font-semibold text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {item.month}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onGenerateReport}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white rounded-lg transition-colors font-medium"
            >
              <FileText className="w-4 h-4" />
              生成评估报告
            </button>
            <button className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            点击"生成初评"开始AI智能评估
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            系统将根据学生背景自动生成匹配度分析和院校推荐
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAssessmentPanel;

