/**
 * 智能选校Agent - 核心类型定义
 */

import { School, Program } from '../../SchoolLibrary/types/school.types';

// ==================== 用户输入条件 ====================

/**
 * 学历层次
 */
export type DegreeLevel = 'bachelor' | 'master' | 'phd' | 'diploma';

/**
 * 匹配策略
 */
export type MatchStrategy = 'conservative' | 'balanced' | 'aggressive';

/**
 * 用户筛选条件
 */
export interface UserCriteria {
  // 基本条件
  countries: string[];              // 目标国家
  majors: string[];                 // 专业方向
  degreeLevel: DegreeLevel;         // 学历层次
  
  // 学术背景
  gpa?: number;                     // GPA
  languageScore?: {                 // 语言成绩
    type: 'IELTS' | 'TOEFL' | 'PTE' | 'Duolingo';
    score: number;
  };
  
  // 财务
  budgetMin?: number;               // 预算下限（年）
  budgetMax?: number;               // 预算上限（年）
  needScholarship?: boolean;        // 是否需要奖学金
  
  // 偏好
  preferences?: {
    location?: string[];            // 城市偏好
    schoolType?: string[];          // 学校类型（研究型/应用型）
    ranking?: {                     // 排名要求
      min?: number;
      max?: number;
    };
    employmentRate?: number;        // 最低就业率要求
    internship?: boolean;           // 是否需要实习机会
  };
  
  // 权重设置（智研模式使用）
  weights?: {
    ranking: number;                // 排名权重 (0-100)
    cost: number;                   // 费用权重 (0-100)
    employability: number;          // 就业权重 (0-100)
    location: number;               // 地理位置权重 (0-100)
    reputation: number;             // 声誉权重 (0-100)
  };
}

// ==================== 匹配结果 ====================

/**
 * 学校类型分类（冲刺/目标/保底）
 */
export type SchoolType = 'reach' | 'target' | 'safety';

/**
 * 匹配分数详情
 */
export interface MatchScore {
  total: number;                    // 总分 (0-100)
  breakdown: {
    ranking: number;                // 排名匹配度
    cost: number;                   // 费用匹配度
    admission: number;              // 录取难度匹配度
    program: number;                // 专业匹配度
    location: number;               // 位置匹配度
  };
}

/**
 * 推荐理由
 */
export interface RecommendationReason {
  pros: string[];                   // 优势
  cons: string[];                   // 劣势
  keyPoints: string[];              // 关键点
  suggestions: string[];            // 建议
}

/**
 * 智选结果（单个学校）
 */
export interface QuickMatchResult {
  school: School;
  program: Program;
  type: SchoolType;                 // 冲刺/目标/保底
  matchScore: MatchScore;
  reason: RecommendationReason;
  locked: boolean;                  // 是否锁定
}

/**
 * 智选方案（完整结果）
 */
export interface QuickMatchPlan {
  id: string;
  name: string;
  createdAt: Date;
  strategy: MatchStrategy;
  criteria: UserCriteria;
  results: QuickMatchResult[];
}

// ==================== 智研分析 ====================

/**
 * 深度分析维度
 */
export interface DeepAnalysis {
  // 课程分析
  curriculum: {
    coreCourses: string[];          // 核心课程
    electives: string[];            // 选修课程
    specializations: string[];      // 专业方向
    practicalComponents: string[];  // 实践环节
  };
  
  // 录取分析
  admission: {
    requirements: {
      gpa: number;
      language: string;
      others: string[];
    };
    acceptanceRate: number;         // 录取率
    competitiveness: 'low' | 'medium' | 'high'; // 竞争程度
    historicalData?: {              // 历史数据
      year: number;
      accepted: number;
      applied: number;
    }[];
  };
  
  // 就业分析
  employment: {
    rate: number;                   // 就业率
    averageSalary?: number;         // 平均薪资
    topEmployers: string[];         // 主要雇主
    industries: string[];           // 就业行业
    internshipRate?: number;        // 实习比例
  };
  
  // 学术资源
  resources: {
    facultyRatio: number;           // 师生比
    researchOutput: string;         // 科研产出
    facilities: string[];           // 设施资源
    partnerships: string[];         // 合作企业/机构
  };
  
  // 校友网络
  alumni: {
    size: number;                   // 校友规模
    network: string[];              // 主要网络
    notableAlumni?: string[];       // 知名校友
  };
}

/**
 * 智研项目结果
 */
export interface DeepResearchResult {
  school: School;
  program: Program;
  matchScore: MatchScore;
  analysis: DeepAnalysis;
  ranking: number;                  // 综合排名
}

/**
 * 智研方案
 */
export interface DeepResearchPlan {
  id: string;
  name: string;
  createdAt: Date;
  criteria: UserCriteria;
  results: DeepResearchResult[];
  insights: {
    totalAnalyzed: number;
    avgMatchScore: number;
    topRecommendations: DeepResearchResult[];
    trends: string[];
  };
}

// ==================== AI顾问 ====================

/**
 * 对话消息类型
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * 对话消息
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'school' | 'program' | 'plan';
    data: School | Program | QuickMatchPlan | DeepResearchPlan;
  }[];
}

/**
 * AI意图识别结果
 */
export interface IntentRecognition {
  intent: 'quick_match' | 'deep_research' | 'compare' | 'info_query' | 'general';
  entities: {
    countries?: string[];
    majors?: string[];
    schools?: string[];
    programs?: string[];
  };
  confidence: number;
}

// ==================== 报告生成 ====================

/**
 * 报告类型
 */
export type ReportType = 'quick' | 'deep' | 'comparison';

/**
 * 报告配置
 */
export interface ReportConfig {
  type: ReportType;
  title: string;
  includeCharts: boolean;
  includeAnalysis: boolean;
  includeRecommendations: boolean;
  advisorNotes?: string;
}

/**
 * 报告数据
 */
export interface ReportData {
  config: ReportConfig;
  plan: QuickMatchPlan | DeepResearchPlan;
  generatedAt: Date;
  format: 'pdf' | 'markdown' | 'html';
}

// ==================== 对比分析 ====================

/**
 * 对比维度
 */
export interface ComparisonDimension {
  name: string;
  key: string;
  format: 'number' | 'percentage' | 'text' | 'list';
  unit?: string;
}

/**
 * 对比结果
 */
export interface ComparisonResult {
  schools: School[];
  programs: Program[];
  dimensions: ComparisonDimension[];
  data: Record<string, string | number | boolean>[];
  winner?: {
    dimension: string;
    schoolId: string;
  }[];
}

