import type { ReactNode } from 'react';

export type MentorView = 'roster' | 'matrix' | 'availability' | 'mission' | 'insights';

export type MentorScope = 'myMentors' | 'market';

export type MentorRole = '文书' | '材料' | '顾问' | '质检' | '面试官';

export type AvailabilityStatus = '可用' | '忙碌' | '请假';

export interface MentorMetric {
  label: string;
  value: string;
  description: string;
}

export interface MentorEducation {
  school: string;
  degree: string;
  period: string;
}

export interface MentorProject {
  title: string;
  result: string;
  description: string;
  year?: string;
}

export interface MentorTestimonial {
  author: string;
  role: string;
  comment: string;
}

export interface MentorRecord {
  id: string;
  name: string;
  avatar: string;
  primaryRole: MentorRole;
  secondaryRoles: MentorRole[];
  email: string;
  phone: string;
  timezone: string;
  region: string;
  tags: string[];
  languages: string[];
  availabilityRate: number;
  utilizationRate: number;
  studentsCount: number;
  satisfaction: number;
  risk: '正常' | '关注';
  lastActivity: string;
  referralRate?: number;
  pricePerHour?: number;
  experienceYears?: number;
  headline?: string;
  bio?: string;
  focusAreas?: string[];
  serviceScope?: string[];
  strengths?: string[];
  industries?: string[];
  education?: MentorEducation[];
  achievements?: string[];
  projects?: MentorProject[];
  testimonials?: MentorTestimonial[];
  metrics?: MentorMetric[];
  availabilityNotes?: string[];
  tools?: string[];
}

export interface SummaryMetric {
  title: string;
  value: string | number;
  trend: string;
  positive?: boolean;
  icon: ReactNode;
}

export interface SkillMatrixEntry {
  mentor: string;
  role: MentorRole;
  experience: number;
  rating: number;
  satisfaction: number;
  language: string;
}

export interface AvailabilitySlot {
  id: string;
  mentorId: string;
  day: string;
  startTime: string;
  endTime: string;
  status: AvailabilityStatus;
  note?: string;
}

export interface MentorTask {
  id: string;
  title: string;
  mentor: string;
  student: string;
  type: '文书' | '材料' | '质检' | '面试';
  status: '待开始' | '进行中' | '待审核' | '已完成';
  deadline: string;
  priority: '高' | '中' | '低';
}

export interface InsightItem {
  title: string;
  description: string;
  action?: string;
}

export interface SharedResourceItem {
  id: string;
  title: string;
  description: string;
  type: '指南' | '模板' | '案例';
  link: string;
}
