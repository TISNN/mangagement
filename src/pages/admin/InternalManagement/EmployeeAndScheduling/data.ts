import { supabase } from '@/supabase';

import type { AttendanceSummary, ShiftConflict, StaffProfile } from '../types';

interface EmployeeRow {
  id: number;
  name: string | null;
  position: string | null;
  department: string | null;
  email: string | null;
  contact?: string | null;
  phone?: string | null;
  status?: string | null;
  avatar_url?: string | null;
  hire_date?: string | null;
  location?: string | null;
  is_active?: boolean | null;
  skills?: unknown;
  is_partner?: boolean | null;
  join_date?: string | null;
}

interface MentorRow {
  id: number;
  name: string | null;
  employee_id: number | null;
  service_scope?: string[] | null;
  specializations?: string[] | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
}

interface MeetingParticipant {
  id?: string | null;
  name?: string | null;
  type?: string | null;
  mentor_id?: number | null;
  employee_id?: number | null;
}

interface MeetingRow {
  id: number;
  title?: string | null;
  meeting_type?: string | null;
  status?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  meeting_link?: string | null;
  participants?: MeetingParticipant[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface TaskRow {
  id: number;
  title?: string | null;
  status?: string | null;
  priority?: string | null;
  start_date?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  assigned_to?: number[] | null;
}

interface EmployeeSchedulingDataset {
  profiles: StaffProfile[];
  conflicts: ShiftConflict[];
  attendance: AttendanceSummary[];
  fetchedAt: string;
}

const WEEKDAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;
const CACHE_TTL = 60 * 1000;

let cache: EmployeeSchedulingDataset | null = null;
let cacheGeneratedAt = 0;

const FALLBACK_PROFILES: StaffProfile[] = [
  {
    id: 'fallback-01',
    name: '示例导师',
    role: '留学顾问',
    team: '北美规划组',
    email: 'mentor@example.com',
    workload: 68,
    skills: ['选校规划', '材料校审', 'CRM 建档'],
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=NorthAmerica',
    timezone: 'Asia/Shanghai (UTC+8)',
    location: '上海 · 北美规划组',
    bio: '示例数据，用于在 Supabase 请求失败时兜底展示。',
    availability: [
      { day: '周二', start: '10:00', end: '18:00', location: '总部 4F' },
      { day: '周四', start: '10:00', end: '18:30', location: '总部 4F' },
      { day: '周六', start: '09:30', end: '16:30', location: '线上' },
    ],
    status: '在岗',
  },
];

const FALLBACK_CONFLICTS: ShiftConflict[] = [
  {
    id: 'fallback-conflict-1',
    staff: '示例导师',
    issue: '周四 15:00-16:30 与 16:00-17:00 排班重叠',
    impact: '影响 1 场家长沟通会的安排',
    suggestedAction: '确认是否需要拆分班次或改派其他导师',
    detectedAt: '示例数据',
  },
];

const FALLBACK_ATTENDANCE: AttendanceSummary[] = [
  {
    month: '示例月',
    present: 12,
    leave: 1,
    overtimeHours: 4,
    alerts: ['示例数据：补齐 Supabase 数据后将自动替换'],
  },
];

const generateAvatarUrlForEmployee = (employee: EmployeeRow): string => {
  const seed = (employee.name?.trim() || `employee-${employee.id}`).replace(/\s+/g, '-');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,ffdfbf&radius=50`;
};

const LEAVE_STATUSES = new Set(['缺席', '取消', '请假', '旷班']);

const padNumber = (value: number) => value.toString().padStart(2, '0');

const parseSkills = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
      }
    } catch {
      return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);
    }
    if (value.trim().length > 0) return [value.trim()];
  }
  return [];
};

const toDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatTime = (date: Date): string => `${padNumber(date.getHours())}:${padNumber(date.getMinutes())}`;

const formatDateTime = (date: Date): string =>
  `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())} ${formatTime(date)}`;

const formatMonth = (date: Date): string => `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}`;

const addMinutes = (date: Date, minutes: number): Date => new Date(date.getTime() + minutes * 60 * 1000);

const deriveTimezoneLabel = (location?: string | null): string => {
  if (!location) return 'Asia/Shanghai (UTC+8)';

  const normalized = location.toLowerCase();

  if (normalized.includes('berlin') || normalized.includes('柏林')) {
    return 'Europe/Berlin (UTC+1)';
  }
  if (normalized.includes('london') || normalized.includes('伦敦')) {
    return 'Europe/London (UTC+0)';
  }
  if (normalized.includes('vancouver') || normalized.includes('toronto')) {
    return 'America/Toronto (UTC-5)';
  }

  return 'Asia/Shanghai (UTC+8)';
};

const createAvailability = (
  meetings: MeetingRow[],
  tasks: TaskRow[],
  fallbackLocation: string,
): StaffProfile['availability'] => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

  const meetingSlots = meetings
    .map((meeting) => {
      const start = toDate(meeting.start_time ?? meeting.created_at);
      if (!start) return null;
      if (start < windowStart || start > windowEnd) return null;
      const end = toDate(meeting.end_time) ?? addMinutes(start, 60);
      return {
        order: start.getTime(),
        day: WEEKDAY_LABELS[start.getDay()],
        start: formatTime(start),
        end: formatTime(end),
        location: meeting.location?.trim() || (meeting.meeting_link ? '线上会议' : fallbackLocation || '待确认'),
      };
    })
    .filter((item): item is { order: number; day: string; start: string; end: string; location: string } => item !== null)
    .sort((a, b) => a.order - b.order)
    .slice(0, 5);

  if (meetingSlots.length >= 3) {
    return meetingSlots.map(({ day, start, end, location }) => ({ day, start, end, location }));
  }

  const fallbackSlots = tasks
    .map((task) => {
      const due = toDate(task.due_date ?? task.start_date ?? task.updated_at ?? task.created_at);
      if (!due) return null;
      if (due < windowStart || due > windowEnd) return null;
      const end = addMinutes(due, task.priority === '高' ? 120 : 90);
      return {
        order: due.getTime(),
        day: WEEKDAY_LABELS[due.getDay()],
        start: formatTime(due),
        end: formatTime(end),
        location: `${task.priority ?? '日常'}任务 · 待确认地点`,
      };
    })
    .filter(
      (item): item is { order: number; day: string; start: string; end: string; location: string } => item !== null,
    )
    .sort((a, b) => a.order - b.order)
    .slice(0, 3 - meetingSlots.length);

  const combined = [...meetingSlots, ...fallbackSlots];

  if (combined.length === 0) {
    return [
      {
        day: '待排班',
        start: '待定',
        end: '待定',
        location: fallbackLocation || '待确认',
      },
    ];
  }

  return combined.map(({ day, start, end, location }) => ({ day, start, end, location }));
};

const computeWorkload = (tasks: TaskRow[], meetings: MeetingRow[], isPartner?: boolean | null): number => {
  const activeTasks = tasks.filter((task) => task.status !== '已完成').length;
  const upcomingMeetings = meetings.filter((meeting) => {
    const start = toDate(meeting.start_time ?? meeting.created_at);
    return Boolean(start && start.getTime() >= Date.now() - 12 * 60 * 60 * 1000);
  }).length;

  const workloadRaw = activeTasks * 10 + upcomingMeetings * 12 + (isPartner ? 6 : 0);
  return Math.min(100, Math.max(30, Math.round(workloadRaw)));
};

const detectConflicts = (
  profiles: StaffProfile[],
  meetingsByEmployee: Map<string, MeetingRow[]>,
  tasksByEmployee: Map<string, TaskRow[]>,
): ShiftConflict[] => {
  const conflicts: ShiftConflict[] = [];
  const now = new Date();
  const detectedAt = formatDateTime(now);

  profiles.forEach((profile) => {
    const employeeMeetings = [...(meetingsByEmployee.get(profile.id) ?? [])].sort((a, b) => {
      const aTime = toDate(a.start_time ?? a.created_at)?.getTime() ?? 0;
      const bTime = toDate(b.start_time ?? b.created_at)?.getTime() ?? 0;
      return aTime - bTime;
    });

    for (let index = 0; index < employeeMeetings.length - 1; index += 1) {
      const current = employeeMeetings[index];
      const next = employeeMeetings[index + 1];
      const currentStart = toDate(current.start_time ?? current.created_at);
      const nextStart = toDate(next.start_time ?? next.created_at);
      if (!currentStart || !nextStart) continue;

      const currentEnd = toDate(current.end_time) ?? addMinutes(currentStart, 60);
      const nextEnd = toDate(next.end_time) ?? addMinutes(nextStart, 60);

      if (nextStart < currentEnd) {
        conflicts.push({
          id: `overlap-${profile.id}-${current.id}-${next.id}`,
          staff: profile.name,
          issue: `会议冲突：${current.title ?? `会议 #${current.id}`} 与 ${next.title ?? `会议 #${next.id}`}`,
          impact: `${formatDateTime(currentStart)}-${formatTime(currentEnd)} 与 ${formatDateTime(nextStart)}-${formatTime(
            nextEnd,
          )} 时间重叠`,
          suggestedAction: '建议协调其中一场会议调整时间或安排备选导师',
          detectedAt,
        });
      }
    }

    const employeeTasks = (tasksByEmployee.get(profile.id) ?? []).filter((task) => task.status !== '已完成');
    const urgentTasks = employeeTasks.filter((task) => {
      const due = toDate(task.due_date ?? task.start_date);
      return Boolean(due && due.getTime() - now.getTime() <= 48 * 60 * 60 * 1000 && due.getTime() >= now.getTime());
    });

    if (urgentTasks.length >= 2) {
      conflicts.push({
        id: `task-bottleneck-${profile.id}`,
        staff: profile.name,
        issue: `48 小时内有 ${urgentTasks.length} 个任务到期`,
        impact: '任务集中，可能挤压面谈准备或材料校对时间',
        suggestedAction: '请协调资源，考虑拆分任务或调配支持人员',
        detectedAt,
      });
    }

    const upcomingMeetingExists = employeeMeetings.some((meeting) => {
      const start = toDate(meeting.start_time ?? meeting.created_at);
      return Boolean(start && start.getTime() > now.getTime());
    });

    if (profile.status !== '在岗' && upcomingMeetingExists) {
      conflicts.push({
        id: `status-mismatch-${profile.id}`,
        staff: profile.name,
        issue: '员工处于非在岗状态但仍存在排班',
        impact: '存在未及时更新状态或调班的风险',
        suggestedAction: '请确认员工状态并及时调整排班或安排替补',
        detectedAt,
      });
    }

    if (profile.workload >= 85) {
      conflicts.push({
        id: `workload-${profile.id}`,
        staff: profile.name,
        issue: `工作负载达到 ${profile.workload}%`,
        impact: '存在过度排班风险，可能影响服务质量',
        suggestedAction: '建议适度调减任务或安排集中复盘时间',
        detectedAt,
      });
    }
  });

  return conflicts;
};

const buildAttendanceSummaries = (meetings: MeetingRow[], tasks: TaskRow[]): AttendanceSummary[] => {
  const now = new Date();
  const months = Array.from({ length: 3 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    return formatMonth(date);
  });

  return months.map((month) => {
    const monthMeetings = meetings.filter((meeting) => {
      const start = toDate(meeting.start_time ?? meeting.created_at);
      return start ? formatMonth(start) === month : false;
    });

    const monthTasks = tasks.filter((task) => {
      const due = toDate(task.due_date ?? task.start_date ?? task.updated_at ?? task.created_at);
      return due ? formatMonth(due) === month : false;
    });

    const present = monthMeetings.filter((meeting) => meeting.status === '已完成').length;
    const leave = monthMeetings.filter((meeting) => meeting.status && LEAVE_STATUSES.has(meeting.status)).length;
    const overtimeHours = Math.round(Math.max(0, monthTasks.length * 1.2 + Math.max(present - 5, 0) * 0.5) * 10) / 10;

    const alerts: string[] = [];
    if (leave > 0) {
      alerts.push(`有 ${leave} 场会议未按计划执行，请复盘原因`);
    }
    if (overtimeHours > 6) {
      alerts.push(`加班 ${overtimeHours} 小时，建议重新平衡任务`);
    }
    if (alerts.length === 0) {
      alerts.push(present > 0 ? '出勤表现稳定，请继续保持' : '暂无排班数据，建议补充基础排班');
    }

    return {
      month,
      present,
      leave,
      overtimeHours,
      alerts,
    };
  });
};

const composeProfiles = (
  employees: EmployeeRow[],
  mentors: MentorRow[],
  meetingsByEmployee: Map<string, MeetingRow[]>,
  tasksByEmployee: Map<string, TaskRow[]>,
): StaffProfile[] => {
  const mentorByEmployeeId = new Map<string, MentorRow>();
  mentors.forEach((mentor) => {
    if (mentor.employee_id != null) {
      mentorByEmployeeId.set(String(mentor.employee_id), mentor);
    }
  });

  return employees.map((employee) => {
    const employeeId = String(employee.id);
    const mentor = mentorByEmployeeId.get(employeeId);
    const employeeMeetings = meetingsByEmployee.get(employeeId) ?? [];
    const employeeTasks = tasksByEmployee.get(employeeId) ?? [];

    const skills = Array.from(
      new Set([
        ...parseSkills(employee.skills),
        ...(mentor?.service_scope ?? []),
        ...(mentor?.specializations ?? []),
      ]),
    ).slice(0, 8);

    const defaultLocation = mentor?.location?.trim() || employee.location?.trim() || '待填写';
    const timezone = deriveTimezoneLabel(defaultLocation);
    const availability = createAvailability(employeeMeetings, employeeTasks, defaultLocation);
    const status = employee.is_active === false ? '请假' : '在岗';
    const avatarUrl =
      typeof employee.avatar_url === 'string' && employee.avatar_url.trim().length > 0
        ? employee.avatar_url
        : undefined;

    return {
      id: employeeId,
      name: employee.name ?? `员工 #${employeeId}`,
      role: employee.position ?? (mentor?.name ? `${mentor.name} · 导师` : '未设置岗位'),
      team: employee.department ?? '未分配团队',
      email: employee.email ?? undefined,
      workload: computeWorkload(employeeTasks, employeeMeetings, employee.is_partner),
      skills: skills.length > 0 ? skills : ['待配置技能'],
      avatarUrl: avatarUrl ?? mentor?.avatar_url ?? generateAvatarUrlForEmployee(employee),
      timezone,
      location: defaultLocation,
      bio: mentor?.bio ?? undefined,
      availability,
      status,
    };
  });
};

const buildMappings = (
  mentors: MentorRow[],
  meetings: MeetingRow[],
  tasks: TaskRow[],
): {
  meetingsByEmployee: Map<string, MeetingRow[]>;
  tasksByEmployee: Map<string, TaskRow[]>;
} => {
  const mentorById = new Map<number, MentorRow>();
  mentors.forEach((mentor) => {
    mentorById.set(mentor.id, mentor);
  });

  const meetingsByEmployee = new Map<string, MeetingRow[]>();
  meetings.forEach((meeting) => {
    const participants = Array.isArray(meeting.participants) ? meeting.participants : [];
    const employeeIds = new Set<string>();

    participants.forEach((participant) => {
      if (participant.employee_id != null) {
        employeeIds.add(String(participant.employee_id));
        return;
      }
      if (participant.mentor_id != null) {
        const mentor = mentorById.get(participant.mentor_id);
        if (mentor?.employee_id != null) {
          employeeIds.add(String(mentor.employee_id));
        }
      }
    });

    employeeIds.forEach((employeeId) => {
      const existing = meetingsByEmployee.get(employeeId);
      if (existing) {
        existing.push(meeting);
      } else {
        meetingsByEmployee.set(employeeId, [meeting]);
      }
    });
  });

  const tasksByEmployee = new Map<string, TaskRow[]>();
  tasks.forEach((task) => {
    const assignees = Array.isArray(task.assigned_to) ? task.assigned_to : [];
    assignees
      .map((assignee) => String(assignee))
      .forEach((employeeId) => {
        const existing = tasksByEmployee.get(employeeId);
        if (existing) {
          existing.push(task);
        } else {
          tasksByEmployee.set(employeeId, [task]);
        }
      });
  });

  return { meetingsByEmployee, tasksByEmployee };
};

const fetchDataset = async (): Promise<EmployeeSchedulingDataset> => {
  const [employeeRes, mentorRes, meetingRes, taskRes] = await Promise.all([
    supabase.from('employees').select('*').order('id', { ascending: true }),
    supabase.from('mentors').select('*'),
    supabase.from('meetings').select('*').range(0, 199).order('start_time', { ascending: true }),
    supabase.from('tasks').select('*').range(0, 199),
  ]);

  const dataErrors = [employeeRes.error, mentorRes.error, meetingRes.error, taskRes.error].filter(Boolean);

  if (dataErrors.length > 0) {
    const messages = dataErrors.map((error) => error?.message ?? '未知错误').join('; ');
    throw new Error(messages);
  }

  const employees = (employeeRes.data ?? []) as EmployeeRow[];
  const mentors = (mentorRes.data ?? []) as MentorRow[];
  const meetings = (meetingRes.data ?? []) as MeetingRow[];
  const tasks = (taskRes.data ?? []) as TaskRow[];

  const employeesWithoutAvatar = employees.filter(
    (employee) => !employee.avatar_url || employee.avatar_url.trim().length === 0,
  );

  if (employeesWithoutAvatar.length > 0) {
    await Promise.all(
      employeesWithoutAvatar.map(async (employee) => {
        const avatarUrl = generateAvatarUrlForEmployee(employee);
        const { error: updateError } = await supabase
          .from('employees')
          .update({ avatar_url: avatarUrl })
          .eq('id', employee.id);

        if (updateError) {
          console.error('[EmployeeScheduling] 更新员工头像失败', { employeeId: employee.id, updateError });
          return;
        }

        employee.avatar_url = avatarUrl;
      }),
    );
  }

  if (employees.length === 0) {
    return {
      profiles: FALLBACK_PROFILES,
      conflicts: FALLBACK_CONFLICTS,
      attendance: FALLBACK_ATTENDANCE,
      fetchedAt: new Date().toISOString(),
    };
  }

  const { meetingsByEmployee, tasksByEmployee } = buildMappings(mentors, meetings, tasks);
  const profiles = composeProfiles(employees, mentors, meetingsByEmployee, tasksByEmployee);
  const conflicts = detectConflicts(profiles, meetingsByEmployee, tasksByEmployee);
  const attendance = buildAttendanceSummaries(meetings, tasks);

  return {
    profiles,
    conflicts,
    attendance,
    fetchedAt: new Date().toISOString(),
  };
};

export const loadEmployeeSchedulingData = async (options?: { forceRefresh?: boolean }): Promise<EmployeeSchedulingDataset> => {
  const shouldRefresh =
    options?.forceRefresh ||
    !cache ||
    Date.now() - cacheGeneratedAt > CACHE_TTL;

  if (!shouldRefresh && cache) {
    return cache;
  }

  try {
    const dataset = await fetchDataset();
    cache = dataset;
    cacheGeneratedAt = Date.now();
    return dataset;
  } catch (error) {
    console.error('[EmployeeScheduling] 加载数据失败，使用兜底数据：', error);
    cache = {
      profiles: FALLBACK_PROFILES,
      conflicts: FALLBACK_CONFLICTS,
      attendance: FALLBACK_ATTENDANCE,
      fetchedAt: new Date().toISOString(),
    };
    cacheGeneratedAt = Date.now();
    return cache;
  }
};

export const loadStaffProfileById = async (
  staffId: string,
  options?: { forceRefresh?: boolean },
): Promise<{ profile: StaffProfile | null; conflicts: ShiftConflict[] }> => {
  const dataset = await loadEmployeeSchedulingData(options);
  const profile = dataset.profiles.find((item) => item.id === staffId) ?? null;
  const conflicts = profile ? dataset.conflicts.filter((conflict) => conflict.staff === profile.name) : [];
  return { profile, conflicts };
};

