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
