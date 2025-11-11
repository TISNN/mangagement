import { formatDate } from '../../../utils/dateUtils';
import { StudentDisplay } from '../StudentsPage/StudentsPage';
import { DEFAULT_BUSINESS_LINE } from '../../../context/studentBusinessLines';
import {
  StudentRecord,
  StudentServiceItem,
  SummaryMetric,
  KanbanColumn,
  RiskLevel,
  StudentStatus,
  MentorRole,
  MentorTeamMember,
} from './types';

type LegacyMentor = {
  id: string | number;
  name?: string;
  roleKey?: string;
  role?: string;
  roleName?: string;
  roleLabel?: string;
  roles?: string[];
  responsibilities?: string;
  task?: string;
  isPrimary?: boolean;
};

type MentorAssignmentRecord = {
  mentorId: number | null;
  name: string;
  roleKey: string;
  roleName: string;
  responsibilities?: string;
  isPrimary?: boolean;
};

const SERVICE_STATUS_MAP: Record<string, StudentServiceItem['status']> = {
  未开始: '准备中',
  准备中: '准备中',
  进行中: '进行中',
  申请中: '申请中',
  已完成: '已完成',
  已暂停: '申请中',
  已取消: '申请中',
};

const STATUS_DISPLAY_MAP: Record<StudentServiceItem['status'], string> = {
  准备中: '准备中',
  进行中: '进行中',
  申请中: '申请中',
  已完成: '已完成',
};

const getServiceStatus = (status: string): StudentServiceItem['status'] =>
  SERVICE_STATUS_MAP[status] ?? '准备中';

const getServiceProgress = (status: string): number => {
  switch (status) {
    case '已完成':
      return 100;
    case '进行中':
      return 65;
    case '申请中':
    case '已暂停':
    case '已取消':
      return 45;
    case '准备中':
    case '未开始':
    default:
      return 20;
  }
};

const determineRisk = (studentStatus: string, serviceStatuses: string[]): RiskLevel => {
  if (serviceStatuses.some((status) => ['已暂停', '已取消'].includes(status))) {
    return '高';
  }
  if (studentStatus === '休学') {
    return '中';
  }
  return '低';
};

export const mapStudentRecord = (student: StudentDisplay): StudentRecord => {
  const normalizedStatus: StudentStatus = ['活跃', '休学', '毕业', '退学'].includes(
    student.status as StudentStatus,
  )
    ? (student.status as StudentStatus)
    : '活跃';

  const businessLines =
    Array.isArray(student.businessLines) && student.businessLines.length > 0
      ? student.businessLines
      : [DEFAULT_BUSINESS_LINE];
  const primaryBusinessLine = student.primaryBusinessLine ?? businessLines[0];

  const parentNameMap = new Map<number, string>();
  student.services.forEach((service) => {
    if (typeof service.serviceTypeId === 'number' && (service.serviceParentId === null || service.serviceParentId === undefined)) {
      parentNameMap.set(service.serviceTypeId, service.serviceType);
    }
  });

  const parentIdsWithChildren = new Set<number>();
  student.services.forEach((service) => {
    if (typeof service.serviceParentId === 'number') {
      parentIdsWithChildren.add(service.serviceParentId);
    }
  });

  const filteredStudentServices = student.services.filter((service) => {
    if (service.serviceParentId === null || service.serviceParentId === undefined) {
      if (typeof service.serviceTypeId === 'number' && parentIdsWithChildren.has(service.serviceTypeId)) {
        return false;
      }
    }
    return true;
  });

  const services: StudentServiceItem[] = filteredStudentServices.map((service) => {
    const mappedStatus = getServiceStatus(service.status);

    const assignmentSource: MentorAssignmentRecord[] = Array.isArray(service.mentorAssignments)
      ? (service.mentorAssignments as MentorAssignmentRecord[])
      : [];

    const rawEntries: Array<{
      id: number | null;
      name: string;
      roleKey: string;
      roleName: string;
      responsibilities?: string;
      isPrimary?: boolean;
    }> = assignmentSource.length > 0
      ? assignmentSource.map((assignment) => ({
          id: assignment.mentorId,
          name: assignment.name,
          roleKey: assignment.roleKey,
          roleName: assignment.roleName,
          responsibilities: assignment.responsibilities,
          isPrimary: assignment.isPrimary,
        }))
      : Array.isArray(service.mentors)
      ? (service.mentors as LegacyMentor[]).map((mentor) => {
          const numericId =
            typeof mentor.id === 'string'
              ? Number.parseInt(mentor.id, 10)
              : typeof mentor.id === 'number'
              ? mentor.id
              : NaN;
          return {
            id: Number.isNaN(numericId) ? null : numericId,
            name: mentor.name || '未知导师',
            roleKey: mentor.roleKey || mentor.role || 'collaborator',
            roleName:
              mentor.roleName || mentor.roleLabel || (Array.isArray(mentor.roles) ? mentor.roles[0] : '协同导师'),
            responsibilities: mentor.responsibilities || mentor.task || undefined,
            isPrimary: Boolean(mentor.isPrimary),
          };
        })
      : [];

    const memberMap = new Map<string, MentorTeamMember>();

    rawEntries.forEach((mentor) => {
      if (!mentor.id || Number.isNaN(mentor.id)) return;
      const roleKey = mentor.roleKey || 'collaborator';
      const roleName = mentor.roleName || '协同导师';
      const key = `${mentor.id}-${roleKey}`;

      if (!memberMap.has(key)) {
        memberMap.set(key, {
          id: mentor.id,
          name: mentor.name || '未知导师',
          roleKey,
          roleName,
          responsibilities: mentor.responsibilities,
          isPrimary: Boolean(mentor.isPrimary),
        });
      } else {
        const existing = memberMap.get(key)!;
        existing.isPrimary = existing.isPrimary || Boolean(mentor.isPrimary);
        if (!existing.responsibilities && mentor.responsibilities) {
          existing.responsibilities = mentor.responsibilities;
        }
      }
    });

    const mentorMembers = Array.from(memberMap.values());

    const roleMap = new Map<string, MentorRole>();
    mentorMembers.forEach((member) => {
      const existingRole = roleMap.get(member.roleKey);
      if (existingRole) {
        existingRole.mentors.push(member);
        if (!existingRole.responsibilities && member.responsibilities) {
          existingRole.responsibilities = member.responsibilities;
        }
      } else {
        roleMap.set(member.roleKey, {
          roleKey: member.roleKey,
          roleName: member.roleName,
          responsibilities: member.responsibilities,
          mentors: [member],
        });
      }
    });

    const mentorRoles = Array.from(roleMap.values());
    const mentorTeamNames = Array.from(new Set(mentorMembers.map((member) => member.name))).filter(Boolean);
    const primaryMentor = mentorMembers.find((member) => member.isPrimary) ?? mentorMembers[0] ?? null;

    let displayName = service.serviceType;
    if (typeof service.serviceParentId === 'number') {
      const parentName = parentNameMap.get(service.serviceParentId);
      if (parentName) {
        const childDisplay = (() => {
          if (!service.serviceType) return '';
          const segments = service.serviceType.split(' - ');
          if (segments.length > 1) {
            return segments[segments.length - 1]?.trim() ?? service.serviceType;
          }
          if (service.serviceType.startsWith(parentName)) {
            return service.serviceType.slice(parentName.length).replace(/^[-·]/, '').trim() || service.serviceType;
          }
          return service.serviceType;
        })();
        displayName = childDisplay ? `${parentName} · ${childDisplay}` : parentName;
      }
    }

    return {
      id: service.id,
      name: displayName,
      status: mappedStatus,
      progress: getServiceProgress(service.status),
      advisor: primaryMentor?.name || '未分配',
      mentorId: primaryMentor?.id ?? null,
      mentorTeam: mentorTeamNames,
      mentorRoles,
      mentorMembers,
    };
  });

  const mentorTeam = Array.from(new Set(services.flatMap((service) => service.mentorTeam)));
  const serviceStatuses = services.map((service) => service.status);
  const riskLevel = determineRisk(normalizedStatus, serviceStatuses);
  const averageProgress =
    services.length > 0
      ? Math.round(services.reduce((sum, srv) => sum + srv.progress, 0) / services.length)
      : 0;
  const satisfaction = riskLevel === '高' ? 3.7 : riskLevel === '中' ? 4.3 : 4.8;
  const tasksPending = services.filter((service) => service.status !== '已完成').length * 2;

  const dateCandidates = filteredStudentServices
    .map((service) => service.endDate || service.enrollmentDate)
    .filter((value): value is string => Boolean(value));
  const latestDate =
    dateCandidates.length > 0 ? dateCandidates.sort().reverse()[0] : student.enrollmentDate;

  const tags = Array.from(
    new Set(
      [
        student.education_level,
        student.major,
        ...filteredStudentServices.map((service) => service.serviceType),
      ].filter(Boolean) as string[],
    ),
  );

  const aggregatedAdvisor =
    services.find((service) => service.mentorMembers.some((member) => member.isPrimary))?.advisor ||
    services[0]?.advisor ||
    '未分配';
 
   const primaryService = filteredStudentServices[0];
   const primaryServiceItem = services[0];
   const stageStatus: StudentServiceItem['status'] = primaryServiceItem
     ? primaryServiceItem.status
     : primaryService
     ? getServiceStatus(primaryService.status)
     : '准备中';
 
  return {
    id: student.id,
    name: student.name,
    avatar: student.avatar,
    status: normalizedStatus,
    businessLines,
    primaryBusinessLine,
    progress: averageProgress,
    stage: primaryServiceItem
      ? `${primaryServiceItem.name} · ${STATUS_DISPLAY_MAP[stageStatus]}`
      : '暂无服务',
    services,
    advisor: aggregatedAdvisor,
    mentorTeam,
    email: student.email,
    phone: student.contact || '未提供联系方式',
    school: student.school || '未填写学校',
    major: student.major || '未填写专业',
    location: student.location || student.address || '未填写地区',
    channel: '未填写渠道',
    tags: tags.length > 0 ? tags : ['未分类'],
    risk: riskLevel,
    satisfaction: Number(satisfaction.toFixed(1)),
    tasksPending,
    updatedAt: latestDate ? formatDate(latestDate) : formatDate(new Date()),
  };
};

export const buildSummaryMetrics = (students: StudentRecord[]): SummaryMetric[] => {
  const total = students.length;
  const activeCount = students.filter((student) => student.status === '活跃').length;
  const riskCount = students.filter((student) => student.risk !== '低').length;
  const averageSatisfaction =
    total > 0
      ? (students.reduce((sum, student) => sum + student.satisfaction, 0) / total).toFixed(1)
      : '0.0';
  const averageServices =
    total > 0
      ? (students.reduce((sum, student) => sum + student.services.length, 0) / total).toFixed(1)
      : '0.0';

  const activeRate = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  return [
    {
      title: '总学生',
      value: total,
      trend: `活跃 ${activeCount} 人`,
      positive: activeCount >= total / 2,
      icon: 'users',
    },
    {
      title: '活跃占比',
      value: `${activeRate}%`,
      trend: `共 ${total} 人`,
      positive: activeRate >= 60,
      icon: 'activity',
    },
    {
      title: '风险学生',
      value: riskCount,
      trend: riskCount > 0 ? '需要重点关注' : '全部安全',
      positive: riskCount === 0,
      icon: 'sparkles',
    },
    {
      title: '平均满意度',
      value: averageSatisfaction,
      trend: `人均服务 ${averageServices} 项`,
      positive: Number(averageSatisfaction) >= 4.0,
      icon: 'star',
    },
  ];
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: '准备中', title: '准备中', color: 'border-slate-200' },
  { id: '进行中', title: '进行中', color: 'border-blue-200' },
  { id: '申请中', title: '申请中', color: 'border-indigo-200' },
  { id: '已完成', title: '已完成', color: 'border-emerald-200' },
  { id: '风险', title: '风险', color: 'border-rose-200' },
];

export const STATUS_TAG_CLASS: Record<StudentStatus, string> = {
  活跃: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  休学: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  毕业: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  退学: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

export const RISK_TAG_CLASS: Record<RiskLevel, string> = {
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

