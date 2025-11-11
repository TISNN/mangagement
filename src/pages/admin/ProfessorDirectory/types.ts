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

export interface ProfessorProfile {
  id: string;
  name: string;
  avatar?: string;
  university: string;
  college: string;
  country: string;
  city?: string;
  researchTags: string[];
  signatureProjects: string[];
  contactEmail: string;
  personalPage?: string;
  publications: { title: string; year: number; link?: string }[];
  acceptsInternationalStudents: boolean;
  phdSupervisionStatus: string;
  phdRequirements: PhDRequirement;
  fundingOptions: FundingOption[];
  applicationWindow: ApplicationWindow;
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
  studentId: string;
  targetIntake: string;
  customNote?: string;
}

