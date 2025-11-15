import { ApplicationStage, ApplicationDocument, FinalUniversityChoice, StudentProfile } from '../ApplicationProgress/types';

export type StageStatus = 'not_started' | 'in_progress' | 'blocked' | 'completed' | 'paused';

export interface StageTask {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  owner?: string;
  dueDate?: string;
  tags?: string[];
}

export interface StageFile {
  id: string;
  name: string;
  type?: string;
  url?: string;
  updatedAt?: string;
}

export interface FormFieldHighlight {
  id: string;
  label: string;
  value: string;
  copiable?: boolean;
}

export interface StageSnapshot {
  id: ApplicationStage;
  name: string;
  description?: string;
  status: StageStatus;
  progress: number;
  owner?: string;
  startDate?: string;
  deadline?: string;
  blockingReason?: string;
  tasks: StageTask[];
  files: StageFile[];
  formHighlights: FormFieldHighlight[];
}

export interface StudentOption {
  studentId: number;
  name: string;
  avatar?: string;
  mentorName?: string;
  currentStage?: string;
  nextDeadline?: string;
  favorite?: boolean;
  urgentCount?: number;
}

export interface IndicatorCardData {
  id: string;
  label: string;
  value: string;
  description?: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
}

export interface MaterialRecord {
  id: string;
  document: ApplicationDocument;
  stage: ApplicationStage;
  status: string;
  owner?: string;
  deadline?: string;
  updatedAt?: string;
  tags?: string[];
}

export interface FormSnapshotField {
  id: string;
  label: string;
  value: string;
  copyable?: boolean;
}

export interface FormSnapshot {
  id: string;
  schoolName: string;
  programName?: string;
  portalLink?: string;
  status?: string;
  fields: FormSnapshotField[];
}

export interface WorkstationDataState {
  stageSnapshots: StageSnapshot[];
  materials: MaterialRecord[];
  formSnapshots: FormSnapshot[];
  profile: StudentProfile | null;
  choices: FinalUniversityChoice[];
}

