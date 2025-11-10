export type AssessmentMode = 'online' | 'offline' | 'hybrid';

export type PlanStatus = 'draft' | 'published' | 'in-progress';

export interface AssessmentPlan {
  id: string;
  name: string;
  examType: string;
  window: string;
  targetCohort: string;
  capacity: number;
  booked: number;
  mode: AssessmentMode;
  owner: string;
  status: PlanStatus;
  riskLevel: 'low' | 'medium' | 'high';
  highlights: string[];
}

export interface AssessmentTimelineEvent {
  id: string;
  label: string;
  date: string;
  status: 'pending' | 'ready' | 'live' | 'completed';
  owner: string;
  notes: string;
}

export interface QuestionBankCategory {
  id: string;
  title: string;
  itemCount: number;
  coverage: number;
  difficultySpread: {
    easy: number;
    medium: number;
    hard: number;
  };
  lastUpdated: string;
  owner: string;
  tags: string[];
}

export interface QuestionBankGap {
  id: string;
  topic: string;
  impact: 'low' | 'medium' | 'high';
  requiredBy: string;
  assignee: string;
  action: string;
}

export interface AssessmentSession {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  channel: string;
  mode: AssessmentMode;
  capacity: number;
  booked: number;
  hasAiProctor: boolean;
  invigilators: string[];
  status: 'registration' | 'ready' | 'in-progress' | 'completed';
  location?: string;
}

export interface ScoreInsight {
  id: string;
  cohort: string;
  averageScore: number;
  targetScore: number;
  change: number;
  percentile75: number;
  percentile25: number;
  riskLevel: 'low' | 'medium' | 'high';
  focusAreas: string[];
}

export interface SkillRadarEntry {
  skill: string;
  current: number;
  target: number;
  change: number;
}

export interface PlacementRule {
  id: string;
  ruleName: string;
  criteria: string;
  autoAction: string;
  manualReview: boolean;
}

export interface InterventionAlert {
  id: string;
  studentName: string;
  cohort: string;
  trigger: string;
  severity: 'low' | 'medium' | 'high';
  owner: string;
  dueDate: string;
  nextStep: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'flat';
}

export interface IntegrationTask {
  id: string;
  title: string;
  owner: string;
  status: 'pending' | 'in-progress' | 'completed';
  notes: string;
}

export interface CapacitySnapshot {
  id: string;
  region: string;
  slots: number;
  booked: number;
  completionRate: number;
}
