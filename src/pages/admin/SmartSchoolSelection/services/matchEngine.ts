/**
 * 智能选校匹配引擎
 * 多因子加权模型
 */

import { School, Program } from '../../SchoolLibrary/types/school.types';
import {
  UserCriteria,
  MatchScore,
  MatchStrategy,
  SchoolType,
  QuickMatchResult,
  RecommendationReason
} from '../types/agent.types';

/**
 * 默认权重配置
 */
const DEFAULT_WEIGHTS = {
  ranking: 25,
  cost: 20,
  employability: 25,
  location: 15,
  reputation: 15
};

/**
 * 计算排名匹配度
 */
const calculateRankingScore = (school: School, criteria: UserCriteria): number => {
  const rankingStr = school.ranking || '#999';
  const ranking = parseInt(rankingStr.replace(/\D/g, '')) || 999;
  
  const { preferences } = criteria;
  if (preferences?.ranking) {
    const { min = 1, max = 999 } = preferences.ranking;
    if (ranking < min || ranking > max) return 0;
  }
  
  // 排名越高分数越高 (Top 10: 100分, Top 50: 80分, Top 100: 60分, 其他: 40分)
  if (ranking <= 10) return 100;
  if (ranking <= 50) return 90 - (ranking - 10);
  if (ranking <= 100) return 60 - (ranking - 50) * 0.4;
  if (ranking <= 200) return 40 - (ranking - 100) * 0.2;
  return Math.max(20, 40 - (ranking - 200) * 0.05);
};

/**
 * 计算费用匹配度
 */
const calculateCostScore = (program: Program, criteria: UserCriteria): number => {
  const { budgetMin = 0, budgetMax = Infinity } = criteria;
  
  if (!program.tuition_fee) return 50; // 未知费用给中等分数
  
  const tuition = typeof program.tuition_fee === 'number' 
    ? program.tuition_fee 
    : parseFloat(program.tuition_fee.replace(/[^\d.]/g, ''));
  
  if (isNaN(tuition)) return 50;
  
  // 在预算范围内
  if (tuition >= budgetMin && tuition <= budgetMax) {
    // 费用越接近预算下限分数越高
    const range = budgetMax - budgetMin;
    if (range === 0) return 100;
    const position = (tuition - budgetMin) / range;
    return 100 - position * 30; // 100分(最便宜) 到 70分(最贵但在预算内)
  }
  
  // 超出预算
  if (tuition > budgetMax) {
    const excess = (tuition - budgetMax) / budgetMax;
    return Math.max(0, 50 - excess * 100);
  }
  
  // 低于预算下限(可能质量存疑)
  return 60;
};

/**
 * 计算录取难度匹配度
 */
const calculateAdmissionScore = (
  school: School, 
  program: Program, 
  criteria: UserCriteria
): number => {
  let score = 50; // 基础分
  
  // GPA匹配
  if (criteria.gpa) {
    // 假设Top 50需要GPA 3.5+, Top 100需要3.0+
    const ranking = parseInt((school.ranking || '#999').replace(/\D/g, '')) || 999;
    const requiredGPA = ranking <= 50 ? 3.5 : ranking <= 100 ? 3.0 : 2.5;
    
    if (criteria.gpa >= requiredGPA + 0.5) score += 30; // 超出要求很多
    else if (criteria.gpa >= requiredGPA) score += 20; // 符合要求
    else if (criteria.gpa >= requiredGPA - 0.3) score += 10; // 略低
    else score -= 20; // 明显不足
  }
  
  // 语言成绩匹配(简化处理)
  if (criteria.languageScore) {
    score += 20; // 有语言成绩加分
  }
  
  return Math.max(0, Math.min(100, score));
};

/**
 * 计算专业匹配度
 */
const calculateProgramScore = (program: Program, criteria: UserCriteria): number => {
  let score = 50;
  
  // 专业方向匹配
  const userMajors = criteria.majors.map(m => m.toLowerCase());
  const programName = (program.cn_name || program.en_name || '').toLowerCase();
  const programCategory = (program.category || '').toLowerCase();
  
  for (const major of userMajors) {
    if (programName.includes(major) || programCategory.includes(major)) {
      score += 50;
      break;
    }
  }
  
  // 学位匹配
  const degreeMap: Record<string, string[]> = {
    bachelor: ['本科', 'bachelor', 'undergraduate'],
    master: ['硕士', 'master', 'msc', 'ma', 'mba'],
    phd: ['博士', 'phd', 'doctorate'],
    diploma: ['文凭', 'diploma', 'certificate']
  };
  
  const expectedDegrees = degreeMap[criteria.degreeLevel] || [];
  const programDegree = (program.degree || '').toLowerCase();
  
  if (expectedDegrees.some(d => programDegree.includes(d))) {
    score += 30;
  }
  
  return Math.min(100, score);
};

/**
 * 计算位置匹配度
 */
const calculateLocationScore = (school: School, criteria: UserCriteria): number => {
  let score = 50;
  
  // 国家匹配
  if (criteria.countries.length > 0) {
    const schoolCountry = (school.country || '').toLowerCase();
    if (criteria.countries.some(c => schoolCountry.includes(c.toLowerCase()))) {
      score += 30;
    } else {
      return 0; // 国家不匹配直接0分
    }
  }
  
  // 城市偏好
  if (criteria.preferences?.location) {
    const schoolLocation = (school.location || '').toLowerCase();
    if (criteria.preferences.location.some(loc => schoolLocation.includes(loc.toLowerCase()))) {
      score += 20;
    }
  }
  
  return Math.min(100, score);
};

/**
 * 计算综合匹配分数
 */
export const calculateMatchScore = (
  school: School,
  program: Program,
  criteria: UserCriteria
): MatchScore => {
  const weights = criteria.weights || DEFAULT_WEIGHTS;
  
  // 计算各维度分数
  const breakdown = {
    ranking: calculateRankingScore(school, criteria),
    cost: calculateCostScore(program, criteria),
    admission: calculateAdmissionScore(school, program, criteria),
    program: calculateProgramScore(program, criteria),
    location: calculateLocationScore(school, criteria)
  };
  
  // 加权总分
  const total = (
    (breakdown.ranking * weights.ranking) +
    (breakdown.cost * weights.cost) +
    (breakdown.admission * weights.employability) +
    (breakdown.program * weights.reputation) +
    (breakdown.location * weights.location)
  ) / 100;
  
  return {
    total: Math.round(total),
    breakdown
  };
};

/**
 * 确定学校类型(冲刺/目标/保底)
 */
export const determineSchoolType = (
  matchScore: MatchScore,
  strategy: MatchStrategy,
  userGPA?: number
): SchoolType => {
  const { total, breakdown } = matchScore;
  const admissionDifficulty = 100 - breakdown.admission; // 录取难度
  
  // 根据策略调整阈值
  let reachThreshold = 70;
  let safetyThreshold = 40;
  
  if (strategy === 'aggressive') {
    reachThreshold = 60;
    safetyThreshold = 30;
  } else if (strategy === 'conservative') {
    reachThreshold = 80;
    safetyThreshold = 50;
  }
  
  // 综合匹配度和录取难度判断
  if (admissionDifficulty > reachThreshold || total < 60) {
    return 'reach'; // 冲刺校
  } else if (admissionDifficulty < safetyThreshold && total > 70) {
    return 'safety'; // 保底校
  } else {
    return 'target'; // 目标校
  }
};

/**
 * 生成推荐理由
 */
export const generateRecommendationReason = (
  school: School,
  program: Program,
  matchScore: MatchScore,
  type: SchoolType
): RecommendationReason => {
  const pros: string[] = [];
  const cons: string[] = [];
  const keyPoints: string[] = [];
  const suggestions: string[] = [];
  
  const { breakdown } = matchScore;
  
  // 优势分析
  if (breakdown.ranking >= 80) {
    pros.push(`世界一流名校,排名${school.ranking}`);
    keyPoints.push('顶尖排名优势');
  }
  if (breakdown.program >= 80) {
    pros.push('专业高度匹配,课程设置符合职业发展方向');
  }
  if (breakdown.cost >= 70) {
    pros.push('学费在合理预算范围内,性价比高');
  }
  if (breakdown.location >= 80) {
    pros.push(`地理位置优越: ${school.location}`);
  }
  
  // 劣势分析
  if (breakdown.admission < 50) {
    cons.push('录取竞争激烈,需要提升背景竞争力');
    suggestions.push('建议提高GPA、准备更强的文书材料');
  }
  if (breakdown.cost < 50) {
    cons.push('学费较高,可能超出预期预算');
    suggestions.push('建议申请奖学金或考虑兼职机会');
  }
  if (breakdown.ranking < 60) {
    cons.push('排名相对靠后,声誉需考量');
  }
  
  // 根据类型给建议
  if (type === 'reach') {
    keyPoints.push('🎯 冲刺校 - 有挑战但值得一试');
    suggestions.push('作为冲刺目标,需要准备最强材料');
  } else if (type === 'target') {
    keyPoints.push('✅ 目标校 - 最佳匹配选择');
    suggestions.push('重点准备,争取录取');
  } else {
    keyPoints.push('🛡️ 保底校 - 稳妥选择');
    suggestions.push('作为保底,确保有学可上');
  }
  
  return { pros, cons, keyPoints, suggestions };
};

/**
 * 执行快速匹配
 */
export const performQuickMatch = (
  schools: School[],
  programs: Program[],
  criteria: UserCriteria,
  strategy: MatchStrategy = 'balanced'
): QuickMatchResult[] => {
  const results: QuickMatchResult[] = [];
  
  // 第一步: 基础筛选
  const filteredPairs: Array<{ school: School; program: Program }> = [];
  
  schools.forEach(school => {
    // 国家筛选
    if (criteria.countries.length > 0) {
      const schoolCountry = (school.country || '').toLowerCase();
      if (!criteria.countries.some(c => schoolCountry.includes(c.toLowerCase()))) {
        return;
      }
    }
    
    // 找到该学校的匹配专业
    const schoolPrograms = programs.filter(p => p.school_id === school.id);
    schoolPrograms.forEach(program => {
      filteredPairs.push({ school, program });
    });
  });
  
  // 第二步: 计算匹配分数
  const scored = filteredPairs.map(({ school, program }) => {
    const matchScore = calculateMatchScore(school, program, criteria);
    const type = determineSchoolType(matchScore, strategy, criteria.gpa);
    const reason = generateRecommendationReason(school, program, matchScore, type);
    
    return {
      school,
      program,
      type,
      matchScore,
      reason,
      locked: false
    };
  });
  
  // 第三步: 排序并选择Top结果
  scored.sort((a, b) => b.matchScore.total - a.matchScore.total);
  
  // 第四步: 按类型平衡选择(1-2个冲刺,2-3个目标,1-2个保底)
  const reachSchools = scored.filter(s => s.type === 'reach').slice(0, 2);
  const targetSchools = scored.filter(s => s.type === 'target').slice(0, 3);
  const safetySchools = scored.filter(s => s.type === 'safety').slice(0, 2);
  
  return [...reachSchools, ...targetSchools, ...safetySchools];
};

