export type FundingIntensity = '全额奖学金' | '部分奖学金' | '名额有限';

export interface ApplicationWindow {
  start: string;
  end: string;
  intake: string;
}

export interface PlacementRecord {
  year: number;
  student: string;
  destination: string;
  highlight?: string;
}

export interface PhDRequirement {
  languageTests: string[];
  minimumGPA?: string;
  publicationsPreferred?: string;
  researchExperience: string;
  recommendationLetters: number;
  additionalNotes?: string;
}

export interface FundingOption {
  type: FundingIntensity;
  description: string;
}

export interface ResearchProject {
  title: string;
  description?: string;
  tags?: string[];
}

export interface SchoolInfo {
  id: string;
  enName: string;
  cnName?: string;
  country: string;
  city?: string;
  qsRank2024?: number;
  qsRank2025?: number;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface ProfessorProfile {
  id: number;
  name: string;
  avatar?: string;
  profileUrl?: string;
  primaryTitle?: string;
  additionalTitles?: string[];
  biography?: string;
  education?: string[];
  researchInterests?: string[];
  researchProjects?: ResearchProject[];
  awards?: string[];
  courses?: string[];
  schoolId?: string;  // 新增：关联学校ID
  school?: SchoolInfo; // 新增：关联的学校信息（JOIN查询时填充）
  university: string;  // 保留：学校名称（用于显示和搜索）
  college: string;
  country: string;
  city?: string;
  researchTags: string[];
  signatureProjects: string[];
  contactEmail: string;
  contactPhone?: string;
  personalPage?: string;
  publications: { title: string; year: number; link?: string }[];
  acceptsInternationalStudents: boolean;
  phdSupervisionStatus: string;
  phdRequirements: PhDRequirement;
  fundingOptions: FundingOption[];
  applicationWindow: ApplicationWindow;
  intake: string;
  recentPlacements: PlacementRecord[];
  lastReviewedAt: string;
  internalNotes: string;
  matchScore: number;
  responseTime: string;
}

export interface ProfessorFilterOptions {
  countries: string[];
  universitiesByCountry: Record<string, string[]>;
  researchTagsByCountry: Record<string, string[]>;
  topResearchTags: string[];
  fundingTypes: FundingIntensity[];
  intakes: string[];
}

export type SortMode = 'matchScore' | 'recentlyReviewed' | 'fundingPriority';

export interface MatchCandidatePayload {
  studentId: number;
  targetIntake: string;
  customNote?: string;
}

