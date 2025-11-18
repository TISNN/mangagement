export interface StudentProfile {
  name: string;
  programGoal: string;
  background: string[];
  targetIntake: string;
  preferedCountries: string[];
  targetDistribution: {
    sprint: number;
    match: number;
    safety: number;
  };
  undergraduate?: string;
  gpa?: string;
  languageScore?: string;
  standardizedTests?: string[];
  researchHighlights?: string[];
  internshipHighlights?: string[];
  targetRegions?: string[];
  targetSchools?: string[];
  targetPrograms?: string[];
}
export interface StudentSummary {
  id: string;
  name: string;
  intake: string;
  goal: string;
  tags?: string[];
}

export interface RecommendationVersion {
  id: string;
  createdAt: string;
  createdBy: string;
  summary: string;
  adopted: boolean;
}

export interface ManualFilterPreset {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export type StrengthKey = 'ranking' | 'research' | 'internship' | 'language' | 'budget' | 'location';

export type WeightConfig = Record<StrengthKey, number>;

// AI推荐模式
export type AIRecommendationMode = 'quick' | 'deep';

// AI推荐条件匹配接口
export interface AIMatchCriteria {
  mode?: AIRecommendationMode;       // 推荐模式: quick(快速) 或 deep(深度检索)
  targetCountries: string[];        // 目标国家
  targetPrograms: string[];         // 专业方向
  budgetRange?: {                    // 预算范围
    min?: number;
    max?: number;
    currency?: string;
  };
  currentSchool?: string;            // 学生当前学校
  gpa?: number;                      // GPA成绩
  gpaScale?: string;                 // GPA制式
  languageScores?: {                 // 语言成绩
    toefl?: number;
    ielts?: number;
    gre?: number;
    gmat?: number;
  };
}

// 深度检索进度信息（8阶段细化流程）
export interface DeepSearchProgress {
  stage: 'parsing' | 'loading' | 'initialFilter' | 'conditionMatch' | 'deepAnalysis' | 'scoring' | 'caseComparison' | 'sorting' | 'completed';
  currentStep: string;               // 当前步骤描述
  progress: number;                  // 进度百分比 0-100
  scannedCount?: number;             // 已扫描的项目数
  totalCount?: number;               // 总项目数
  matchedCount?: number;             // 已匹配的项目数
  filteredCount?: number;            // 初步筛选后的数量
  analyzedCount?: number;            // 深度分析完成的数量
  message?: string;                  // 进度提示信息
  details?: string[];                // 详细步骤信息
}

// AI推荐结果(基于条件匹配)
export interface AIRecommendationResult {
  id: string;
  schoolId?: number;                 // 学校ID(关联数据库)
  programId?: number;                // 项目ID(关联数据库)
  school: string;
  program: string;
  level: '冲刺' | '匹配' | '保底';
  matchScore: number;                // 匹配度分数 0-100
  matchReason: string;               // 匹配理由
  rationale: string;                 // 推荐理由
  highlight: string[];               // 亮点标签
  requirements: string[];            // 需补充材料
  similarCases?: {                   // 相似案例
    id: number;
    studentName: string;
    admissionYear: number;
    gpa: string;
    languageScores: string;
  }[];
  selected?: boolean;                // 是否选中(用于批量操作)
}

export interface RecommendationDefinition {
  id: string;
  school: string;
  program: string;
  level: '冲刺' | '匹配' | '保底';
  baseScore: number;
  rationale: string;
  highlight: string[];
  requirements: string[];
  caseReference?: string;
  strengths: StrengthKey[];
}

export interface RecommendationProgram extends RecommendationDefinition {
  score: number;
}

export interface CandidateProgram {
  id: string;
  school: string;
  program: string;
  source: 'AI推荐' | '人工添加';
  stage: '冲刺' | '匹配' | '保底';
  status: '待讨论' | '通过' | '淘汰';
  notes: string;
  owner: string;
  matchScore?: number;              // 匹配度分数(仅AI推荐项目)
  matchReason?: string;             // 匹配理由(仅AI推荐项目)
  rationale?: string;               // 推荐理由(仅AI推荐项目)
}

export interface MeetingPlan {
  id: string;
  type: '学生会议' | '顾问会商';
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  actions: string[];
}

export interface DecisionSnapshot {
  id: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  attachments: string[];
}

export type RiskPreference = '稳健' | '均衡' | '进取';
export interface StudentDataBundle {
  profile: StudentProfile;
  recommendations: RecommendationDefinition[];
  versions: RecommendationVersion[];
  manualPresets: ManualFilterPreset[];
  candidates: CandidateProgram[];
  meetings: MeetingPlan[];
  decisions: DecisionSnapshot[];
  defaultWeightConfig: WeightConfig;
  defaultRiskPreference: RiskPreference;
}
