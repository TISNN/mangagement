/**
 * 模拟数据生成工具
 */

import type { AIRecommendationResult, AIRecommendationMode } from '../../../types';

/**
 * 生成模拟推荐结果
 */
export const generateMockRecommendations = (mode: AIRecommendationMode): AIRecommendationResult[] => {
  const baseRecommendations: AIRecommendationResult[] = [
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

  if (mode === 'deep') {
    // 深度检索模式返回更多结果
    const additionalResults: AIRecommendationResult[] = Array(20).fill(null).map((_, i) => ({
      id: `deep-${i + 6}`,
      school: `University ${i + 1}`,
      program: `Program ${i + 1}`,
      level: (['冲刺', '匹配', '保底'] as const)[i % 3],
      matchScore: 75 + Math.floor(Math.random() * 20),
      matchReason: `深度检索匹配项目 ${i + 1}`,
      rationale: `通过全库检索发现的项目 ${i + 1}`,
      highlight: ['深度检索', '全库匹配'],
      requirements: [],
    }));
    return [...baseRecommendations, ...additionalResults];
  }

  return baseRecommendations;
};
