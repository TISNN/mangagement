export type PhdFundingLevel = 'full' | 'partial' | 'unspecified';

export type PhdPositionStatus = 'open' | 'closing_soon' | 'expired';

export interface PhdPosition {
  id: string;
  sourceId: string;
  titleEn: string;
  titleZh?: string;
  university: string;
  department?: string | null;
  country?: string | null;
  city?: string | null;
  officialLink: string;
  intakeTerm?: string | null;
  deadline?: string | null;
  deadlineStatus: 'confirmed' | 'estimated' | 'unknown';
  employmentType?: string | null;
  workload?: string | null;
  educationLevel?: string | null;
  salaryRange?: string | null;
  fundingLevel: PhdFundingLevel;
  supportsInternational: boolean;
  description: string;
  requirements: string;
  applicationSteps: string;
  tags: string[];
  status: PhdPositionStatus;
  matchScore: number;
  lastScrapedAt?: string | null;
}


