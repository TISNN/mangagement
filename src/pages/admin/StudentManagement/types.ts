import React from 'react';
import { StudentDisplay } from '../StudentsPage/StudentsPage';
import { StudentBusinessLine } from '../../../context/studentBusinessLines';

export type StudentView = 'list' | 'card' | 'grid' | 'kanban' | 'insights';
export type StudentStatus = '活跃' | '休学' | '毕业' | '退学';
export type RiskLevel = '低' | '中' | '高';

export interface MentorTeamMember {
  id: number;
  name: string;
  roleKey: string;
  roleName: string;
  responsibilities?: string;
  isPrimary?: boolean;
}

export interface MentorRole {
  roleKey: string;
  roleName: string;
  responsibilities?: string;
  mentors: MentorTeamMember[];
}

export interface StudentServiceItem {
  id: string;
  name: string;
  status: '准备中' | '进行中' | '申请中' | '已完成';
  progress: number;
  advisor: string;
  mentorId?: number | null;
  mentorTeam: string[];
  mentorRoles: MentorRole[];
  mentorMembers: MentorTeamMember[];
}

export interface StudentRecord {
  id: string;
  name: string;
  avatar: string;
  status: StudentStatus;
  businessLines: StudentBusinessLine[];
  primaryBusinessLine: StudentBusinessLine;
  progress: number;
  stage: string;
  services: StudentServiceItem[];
  advisor: string;
  mentorTeam: string[];
  email: string;
  phone: string;
  school: string;
  major: string;
  location: string;
  channel: string;
  tags: string[];
  risk: RiskLevel;
  satisfaction: number;
  tasksPending: number;
  updatedAt: string;
}

export type SummaryMetricIcon = 'users' | 'activity' | 'sparkles' | 'star';

export interface SummaryMetric {
  title: string;
  value: string | number;
  trend: string;
  positive?: boolean;
  icon: SummaryMetricIcon;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

export type MapStudentRecord = (student: StudentDisplay) => StudentRecord;

