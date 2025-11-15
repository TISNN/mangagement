import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Filter,
  History,
  Layout,
  ListChecks,
  Plus,
  Sparkles,
  Target,
  Timer,
  Users,
  PenSquare,
  Trash2,
  Share2,
  Send,
  CalendarCheck,
  UserPlus,
  MoreHorizontal,
} from 'lucide-react';
import { peopleService } from '../../../services';
import { useAuth } from '../../../context/AuthContext';
import type { Employee, StudentProfile } from '../../../services/authService';
import ServiceProgressModal from '../../../components/ServiceProgressModal';
import type { ServiceProgressLog } from '../../../types/people';
import type {
  AnalyticsIndicator,
  ArchiveEntry,
  ChronoTab,
  CollaborationActionItem,
  CollaborationLogEntry,
  CollaborationPriority,
  CollaborationStatus,
  MilestoneItem,
  RiskItem,
  ServiceProject,
  SummaryMetric,
  TimelineEvent,
} from './types';
import {
  ANALYTICS_INDICATORS,
  ARCHIVE_DATA,
  COLLAB_PRIORITY_TEXT,
  COLLAB_STATUS_BADGE,
  EDIT_STATUS_OPTIONS,
  EMPTY_SUMMARY_METRICS,
  MILESTONE_ITEMS,
  RISK_ITEMS,
  TIMELINE_EVENTS,
} from './constants';
import {
  formatDateString,
  formatDateTime,
  getRecordAssignee,
  getRecordContent,
  getRecordDueDate,
  getTimelineLogId,
  parseActionItemsFromLog,
  parseCollaborationLogsFromLog,
} from './utils';

const STATUS_COLOR: Record<string, string> = {
  完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  进行中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  待处理: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  风险: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

const MIL_STATUS_COLOR: Record<MilestoneItem['status'], string> = {
  按计划: 'text-emerald-500',
  延迟: 'text-rose-500',
  完成: 'text-blue-500',
};

const RISK_LEVEL_COLOR: Record<RiskItem['level'], string> = {
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

type LocalAuthSnapshot = {
  profile: Employee | StudentProfile | null;
  userType: 'admin' | 'student' | null;
};

const readLocalAuthSnapshot = (): LocalAuthSnapshot => {
  if (typeof window === 'undefined') {
    return { profile: null, userType: null };
  }

  try {
    const isAuthenticated = window.localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      return { profile: null, userType: null };
    }

    const storedType = (window.localStorage.getItem('userType') as 'admin' | 'student' | null) || null;
    if (storedType === 'admin') {
      const rawEmployee = window.localStorage.getItem('currentEmployee');
      if (rawEmployee) {
        try {
          const parsed = JSON.parse(rawEmployee) as Employee;
          return { profile: parsed, userType: 'admin' };
        } catch (error) {
          console.warn('[ServiceChronology] 解析管理员本地缓存失败', error);
        }
      }
    }

    if (storedType === 'student') {
      const rawStudent = window.localStorage.getItem('currentStudent');
      if (rawStudent) {
        try {
          const parsed = JSON.parse(rawStudent) as StudentProfile;
          return { profile: parsed, userType: 'student' };
        } catch (error) {
          console.warn('[ServiceChronology] 解析学生本地缓存失败', error);
        }
      }
    }

    return { profile: null, userType: storedType };
  } catch (error) {
    console.warn('[ServiceChronology] 读取本地认证信息失败', error);
    return { profile: null, userType: null };
  }
};

const SectionHeader: React.FC<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
}> = ({ title, description, actions }) => (
  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

const ServiceChronologyPage: React.FC = () => {
  let authProfile: Employee | StudentProfile | null = null;
  let authUserType: 'admin' | 'student' | null = null;

  try {
    const auth = useAuth();
    authProfile = auth.profile;
    authUserType = auth.userType;
  } catch (error) {
    if (error instanceof Error && error.message.includes('AuthProvider')) {
      console.warn('[ServiceChronology] 未检测到 AuthProvider，回退至 localStorage 获取认证信息。', error);
    } else {
      throw error;
    }
  }

  const localAuthSnapshot = useMemo(() => {
    if (authProfile || authUserType) {
      return { profile: null, userType: null };
    }
    return readLocalAuthSnapshot();
  }, [authProfile, authUserType]);

  const profile = authProfile ?? localAuthSnapshot.profile;
  const userType = authUserType ?? localAuthSnapshot.userType;

  const employeeProfile = useMemo(() => {
    if (userType === 'admin' && profile && 'id' in profile) {
      return profile as Employee;
    }
    return null;
  }, [profile, userType]);

  const [projects, setProjects] = useState<ServiceProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ChronoTab>('timeline');
  const [progressLogs, setProgressLogs] = useState<ServiceProgressLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [projectsError, setProjectsError] = useState<string | null>(null);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [isTimelineDetailOpen, setIsTimelineDetailOpen] = useState(false);
  const [collaborationActionItems, setCollaborationActionItems] = useState<CollaborationActionItem[]>([]);
  const [collaborationLogs, setCollaborationLogs] = useState<CollaborationLogEntry[]>([]);
  const [collaborationMessage, setCollaborationMessage] = useState<string | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingTimelineEvent, setEditingTimelineEvent] = useState<TimelineEvent | null>(null);
  const [deleteTargetEvent, setDeleteTargetEvent] = useState<TimelineEvent | null>(null);
  const [isDeletingProgress, setIsDeletingProgress] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editFormValues, setEditFormValues] = useState({
    description: '',
    notes: '',
    milestone: '',
    status: '进行中',
    completed: '',
    next: '',
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);

  const handleViewTimelineDetail = useCallback((event: TimelineEvent) => {
    setSelectedTimelineEvent(event);
    setIsTimelineDetailOpen(true);
    setCollaborationActionItems(event.actionItems ?? []);
    setCollaborationLogs(event.collaborationLogs ?? []);
    setCollaborationMessage(null);
    setActionMenuOpenId(null);
  }, []);

  const handleCloseTimelineDetail = useCallback(() => {
    setIsTimelineDetailOpen(false);
    setSelectedTimelineEvent(null);
    setCollaborationMessage(null);
    setCollaborationActionItems([]);
    setCollaborationLogs([]);
    setActionMenuOpenId(null);
  }, []);

  const handleEditTimelineEvent = useCallback((event: TimelineEvent) => {
    setEditingTimelineEvent(event);
    setIsEditDrawerOpen(true);
  }, []);

  const handleDeleteTimelineEvent = useCallback((event: TimelineEvent) => {
    setDeleteTargetEvent(event);
  }, []);

  const handleCollaborationAction = useCallback(
    (action: 'assign' | 'discussion' | 'meeting') => {
      if (!selectedTimelineEvent) return;
      const actorName = employeeProfile?.name ?? '我';
      const now = new Date().toISOString();
      const timestamp = formatDateTime(now);

      const actionMeta = {
        assign: {
          label: '转派任务',
          details: '已生成新的跟进任务，提醒文书团队在本周内完成材料质检。',
          createActionItem: true,
          item: {
            content: '安排文书团队在本周五前完成材料质检汇报',
            priority: '高' as CollaborationPriority,
            status: '待处理' as CollaborationStatus,
          },
        },
        discussion: {
          label: '发起讨论',
          details: '已在协同频道同步讨论主题，提醒相关同事反馈建议。',
          createActionItem: false,
        },
        meeting: {
          label: '同步会议',
          details: '已预约周三晚 20:00 的材料冲刺对齐会，并同步到会议列表。',
          createActionItem: true,
          item: {
            content: '准备材料冲刺对齐会议议程与资料包',
            priority: '中' as CollaborationPriority,
            status: '进行中' as CollaborationStatus,
          },
        },
      } as const;

      const meta = actionMeta[action];
      setCollaborationLogs((prev) => [
        {
          id: `collab-${Date.now()}`,
          actor: actorName,
          action: meta.label,
          timestamp,
          details: meta.details,
        },
        ...prev,
      ]);

      if (meta.createActionItem) {
        setCollaborationActionItems((prev) => [
          {
            id: `action-${Date.now()}`,
            owner: actorName,
            content: meta.item.content,
            dueDate: formatDateString(selectedTimelineEvent.rawLog?.progress_date || now),
            status: meta.item.status,
            priority: meta.item.priority,
            source: meta.label,
          },
          ...prev,
        ]);
      }

      setCollaborationMessage(`${meta.label}已创建`);
      if (typeof window !== 'undefined') {
        window.setTimeout(() => setCollaborationMessage(null), 4000);
      }
    },
    [employeeProfile, selectedTimelineEvent],
  );

  const handleToggleActionItemStatus = useCallback(
    (actionId: string) => {
      setCollaborationActionItems((prev) => {
        const target = prev.find((item) => item.id === actionId);
        if (!target) return prev;

        const nextStatus: CollaborationStatus = target.status === '已完成' ? '进行中' : '已完成';
        const updated = prev.map((item) =>
          item.id === actionId
            ? {
                ...item,
                status: nextStatus,
              }
            : item,
        );

        const actorName = employeeProfile?.name ?? '我';
        setCollaborationLogs((prevLogs) => [
          {
            id: `collab-status-${Date.now()}`,
            actor: actorName,
            action: nextStatus === '已完成' ? '完成协同待办' : '重新打开协同待办',
            timestamp: formatDateTime(new Date().toISOString()),
            details: target.content,
            relatedActionItemId: target.id,
          },
          ...prevLogs,
        ]);

        return updated;
      });
    },
    [employeeProfile],
  );

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoadingProjects(true);
      setProjectsError(null);
      const data = await peopleService.getServiceProjectsOverview();
      console.info('[ServiceChronology] fetchProjects 获取到数据', {
        rows: data.length,
        sample: data.slice(0, 3),
      });
      const mapped: ServiceProject[] = data.map((service) => {
        const status = (() => {
          const raw = (service.status ?? '').toLowerCase();
          if (raw.includes('complete') || raw.includes('完成')) return '已完成';
          if (raw.includes('start') || raw.includes('未开始')) return '待启动';
          return '进行中';
        })();

        return {
          id: `srv-${service.id}`,
          student: service.student_name || '未命名学生',
          serviceName: service.service_type_name || '未命名服务',
          status,
          startDate: formatDateString(service.enrollment_date) || '—',
          endDate: formatDateString(service.end_date) || undefined,
          progress: Math.max(0, Math.min(100, Math.round(service.progress ?? 0))),
          primaryAdvisor: service.mentor_name ? `${service.mentor_name}` : '待指派',
          phase: service.current_phase || '阶段规划',
        };
      });

      setProjects(mapped);
      if (mapped.length) {
        setSelectedProjectId((previous) => {
          if (mapped.some((project) => project.id === previous)) {
            return previous;
          }
          return mapped[0].id;
        });
      } else {
        setSelectedProjectId('');
      }
    } catch (error) {
      console.error('[ServiceChronology] 获取服务项目失败:', error);
      setProjectsError('加载服务项目失败，请稍后再试。');
      setProjects([]);
      setSelectedProjectId('');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const fetchLogs = useCallback(
    async (projectId: string) => {
      const numericId = Number(projectId.replace('srv-', ''));
      if (!numericId) {
        setProgressLogs([]);
        return;
      }

      try {
        setLoadingLogs(true);
        setLogsError(null);
        const logs = await peopleService.getServiceProgressHistory(numericId);
        setProgressLogs(logs);
      } catch (error) {
        console.error('[ServiceChronology] 获取服务进度失败:', error);
        setLogsError('加载服务进度失败，请稍后再试。');
        setProgressLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    },
    [setProgressLogs],
  );

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchLogs(selectedProjectId);
    } else {
      setProgressLogs([]);
    }
    setIsTimelineDetailOpen(false);
    setSelectedTimelineEvent(null);
    setCollaborationActionItems([]);
    setCollaborationLogs([]);
    setCollaborationMessage(null);
  }, [selectedProjectId, fetchLogs]);

  useEffect(() => {
    if (isTimelineDetailOpen && selectedTimelineEvent) {
      setCollaborationActionItems(selectedTimelineEvent.actionItems ?? []);
      setCollaborationLogs(selectedTimelineEvent.collaborationLogs ?? []);
      setCollaborationMessage(null);
    }
  }, [isTimelineDetailOpen, selectedTimelineEvent]);

  useEffect(() => {
    if (isEditDrawerOpen && editingTimelineEvent) {
      const completedValue = (editingTimelineEvent.completedItems ?? [])
        .map((item) => getRecordContent(item as Record<string, unknown>))
        .filter(Boolean)
        .join('\n');
      const nextValue = (editingTimelineEvent.nextSteps ?? [])
        .map((item) => getRecordContent(item as Record<string, unknown>))
        .filter(Boolean)
        .join('\n');

      setEditFormValues({
        description: editingTimelineEvent.rawLog?.description || editingTimelineEvent.description || '',
        notes: editingTimelineEvent.notes || editingTimelineEvent.rawLog?.notes || '',
        milestone: editingTimelineEvent.rawLog?.milestone || editingTimelineEvent.milestone || '',
        status: editingTimelineEvent.status ?? '进行中',
        completed: completedValue,
        next: nextValue,
      });
      setEditError(null);
    }
  }, [isEditDrawerOpen, editingTimelineEvent]);

  useEffect(() => {
    const handleGlobalClick = () => {
      setActionMenuOpenId(null);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActionMenuOpenId(null);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const summaryMetrics = useMemo<SummaryMetric[]>(() => {
    if (!selectedProject && !progressLogs.length) return EMPTY_SUMMARY_METRICS;

    const progress = selectedProject ? Math.max(0, Math.min(100, selectedProject.progress)) : 0;
    const latestLog = progressLogs[0] ?? null;

    const overdueNextSteps = progressLogs.reduce((acc, log) => {
      if (!log.next_steps?.length) return acc;
      const overdue = log.next_steps.reduce((count, next) => {
        const due = (next as { due_date?: string }).due_date;
        if (!due) return count;
        return new Date(due).getTime() < Date.now() ? count + 1 : count;
      }, 0);
      return acc + overdue;
    }, 0);

    const riskScore = overdueNextSteps ? Math.min(100, overdueNextSteps * 12) : progressLogs.length ? 24 : 0;

    return [
      {
        title: '里程碑完成率',
        value: selectedProject ? `${progress}%` : '—',
        trend: selectedProject ? `当前阶段：${selectedProject.phase}` : '暂无数据',
        accent: 'from-blue-500/10 to-blue-500/5',
        icon: <Target className="h-5 w-5 text-blue-500" />,
      },
      {
        title: '材料通过率',
        value: progressLogs.length ? `${Math.min(100, Math.max(progress, 60))}%` : '—',
        trend: overdueNextSteps ? `逾期待处理 ${overdueNextSteps} 项` : progressLogs.length ? '持续跟进材料补交' : '暂无数据',
        accent: 'from-emerald-500/10 to-emerald-500/5',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      },
      {
        title: '风险评分',
        value: progressLogs.length ? `${riskScore}/100` : '—',
        trend: overdueNextSteps ? '请优先处理逾期待办' : progressLogs.length ? '风险可控' : '暂无数据',
        accent: 'from-amber-500/10 to-amber-500/5',
        icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      },
      {
        title: 'AI 建议采纳率',
        value: latestLog ? `${Math.min(100, progress + 10)}%` : progressLogs.length ? `${Math.min(100, progress + 5)}%` : '—',
        trend: latestLog ? `最新更新：${formatDateTime(latestLog.progress_date)}` : progressLogs.length ? '等待最新记录' : '暂无数据',
        accent: 'from-purple-500/10 to-purple-500/5',
        icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      },
    ];
  }, [progressLogs, selectedProject]);

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    if (!progressLogs.length) return TIMELINE_EVENTS;

    return progressLogs.map((log) => {
    const recorderName =
      typeof log.recorder?.person?.name === 'string' && log.recorder.person.name.trim().length
        ? log.recorder.person.name.trim()
        : undefined;
    const owner = (
      (typeof log.employee?.name === 'string' && log.employee.name.trim()) ||
      recorderName ||
      (log.recorded_by ? `成员 #${log.recorded_by}` : '团队成员')
    ) as string;

      const completedCount = log.completed_items?.length ?? 0;
      const nextCount = log.next_steps?.length ?? 0;
      const hasRisk =
        (log.description ?? '').includes('风险') ||
        (log.next_steps ?? []).some((step) => (step as { risk?: boolean }).risk);
    const attachmentsList = Array.isArray(log.attachments) ? log.attachments : undefined;
    const actionItems = parseActionItemsFromLog(log);
    const collaborationLogs = parseCollaborationLogsFromLog(log);

      return {
        id: `log-${log.id}`,
        type: hasRisk ? '风险' : '里程碑',
        title: log.description || `服务进度更新至 ${log.milestone}`,
        description: log.notes?.trim()
          ? log.notes
          : completedCount
          ? `已完成 ${completedCount} 项任务，等待下一步执行。`
          : '进度信息已更新。',
        owner,
        timestamp: formatDateTime(log.progress_date),
      attachments: attachmentsList?.length,
        tags: [
          ...(completedCount ? ['已完成'] : []),
          ...(nextCount ? ['待办'] : []),
        ],
        aiInsight: nextCount
          ? `AI 提示优先处理：${(log.next_steps?.[0] as { content?: string })?.content ?? '跟进行动'}.`
          : undefined,
        status: hasRisk ? '风险' : nextCount ? '进行中' : '已完成',
      milestone: log.milestone,
      notes: log.notes ?? undefined,
      completedItems: Array.isArray(log.completed_items) ? log.completed_items : undefined,
      nextSteps: Array.isArray(log.next_steps) ? log.next_steps : undefined,
      attachmentsList,
      rawLog: log,
      actionItems,
      collaborationLogs,
      };
    });
  }, [progressLogs]);

  const timelineDetail = selectedTimelineEvent;

  const milestoneItems = useMemo<MilestoneItem[]>(() => {
    if (!progressLogs.length) return MILESTONE_ITEMS;

    const upcoming = progressLogs.flatMap((log) => log.next_steps ?? []);
    if (!upcoming.length) return MILESTONE_ITEMS;

    return upcoming.slice(0, 4).map((next, index) => {
      const content = (next as { content?: string }).content || '待确认事项';
      const due = formatDateString((next as { due_date?: string }).due_date ?? '');
      const planned = formatDateString((next as { planned_date?: string }).planned_date ?? '') || due;
      const owner =
        (next as { assigned_to_name?: string }).assigned_to_name ||
        (next as { assigned_to?: string | number }).assigned_to ||
        selectedProject?.primaryAdvisor ||
        '团队成员';

      const statusRaw =
        due && new Date(`${due}T00:00:00`).getTime() < Date.now()
          ? '延迟'
          : index === 0
          ? '进行中'
          : '按计划';
      const normalizedStatus: MilestoneItem['status'] =
        statusRaw === '进行中' ? '按计划' : (statusRaw as MilestoneItem['status']);

      return {
        id: `dynamic-mil-${index}`,
        name: content,
        stage: selectedProject?.phase || '阶段规划',
        owner: owner.toString(),
        plannedDate: planned || due || '—',
        dueDate: due || '—',
        status: normalizedStatus,
        completion: normalizedStatus === '按计划' ? 40 : normalizedStatus === '延迟' ? 20 : 80,
        weight: 20,
      };
    });
  }, [progressLogs, selectedProject]);

  const riskItems = useMemo<RiskItem[]>(() => {
    if (!progressLogs.length) return RISK_ITEMS;

    const risks: RiskItem[] = [];
    progressLogs.forEach((log) => {
      const description = log.description ?? '';
      const statusRaw = (log as { status?: string }).status;
      const status = typeof statusRaw === 'string' ? statusRaw.toLowerCase() : '';

      if (description.includes('风险') || status.includes('risk')) {
        risks.push({
          id: `risk-log-${log.id}`,
          category: description.includes('材料') ? '材料' : '其它',
          level: description.includes('高') ? '高' : '中',
          score: description.includes('高') ? 70 : 45,
          summary: description || '监测到潜在风险，请关注进度。',
          mitigation: log.next_steps?.length
            ? `建议优先执行：${(log.next_steps[0] as { content?: string })?.content ?? '补充待办'}`
            : '安排顾问与学生沟通优先级，适度缓冲节奏。',
          updatedAt: formatDateString(log.progress_date) || '—',
        });
      }
    });

    if (!risks.length) return RISK_ITEMS;
    return risks.slice(0, 3);
  }, [progressLogs]);

  const analyticsIndicators = useMemo<AnalyticsIndicator[]>(() => {
    if (!progressLogs.length) return ANALYTICS_INDICATORS;

    const totalLogs = progressLogs.length;
    const logsWithCompleted = progressLogs.filter((log) => (log.completed_items?.length ?? 0) > 0).length;
    const completedItems = progressLogs.reduce((sum, log) => sum + (log.completed_items?.length ?? 0), 0);
    const pendingItems = progressLogs.reduce((sum, log) => sum + (log.next_steps?.length ?? 0), 0);

    const avgIncrement = (() => {
      if (totalLogs < 2) return '—';
      const deltas = progressLogs
        .map((log) =>
          typeof log.milestone === 'string' && log.milestone.trim()
            ? Number.parseInt(log.milestone, 10)
            : Number.NaN,
        )
        .filter((value) => Number.isFinite(value));
      if (deltas.length < 2) return '—';
      const increments = deltas.slice(0, deltas.length - 1).map((value, index) => value - deltas[index + 1]);
      const avg = increments.reduce((sum, item) => sum + item, 0) / increments.length;
      return `${avg.toFixed(1)}%`;
    })();

    return [
      {
        label: '累计进度记录',
        value: `${totalLogs}`,
        delta: logsWithCompleted ? `含完成记录 ${logsWithCompleted}` : '暂无完成记录',
        positive: logsWithCompleted > 0,
      },
      {
        label: '已完成事项',
        value: `${completedItems}`,
        delta: pendingItems ? `待办 ${pendingItems}` : '无待办',
        positive: pendingItems === 0,
      },
      {
        label: '风险条目',
        value: `${riskItems.length}`,
        delta: riskItems.length ? '需关注' : '保持稳定',
        positive: riskItems.length === 0,
      },
      {
        label: '平均进度增量',
        value: avgIncrement,
        delta: avgIncrement !== '—' ? '最近增速' : '暂无数据',
        positive: avgIncrement !== '—',
      },
    ];
  }, [progressLogs, riskItems]);

  const archiveData = useMemo<ArchiveEntry[]>(() => {
    if (!progressLogs.length) return ARCHIVE_DATA;

    return progressLogs.slice(0, 3).map((log, index) => ({
      id: `archive-${log.id}`,
      title: `阶段总结 · ${formatDateString(log.progress_date) || '近期'}`,
      description:
        log.description?.slice(0, 60) ||
        `总结完成 ${log.completed_items?.length ?? 0} 项，规划 ${log.next_steps?.length ?? 0} 项待办。`,
      createdAt: formatDateString(log.progress_date) || '—',
      tags: [
        index === 0 ? '重点' : '阶段',
        ...(log.next_steps?.length ? ['行动项'] : []),
      ],
      author:
        (typeof log.employee?.name === 'string' && log.employee.name.trim()) ||
        (typeof log.recorder?.person?.name === 'string' && log.recorder.person.name.trim()) ||
        '顾问团队',
    }));
  }, [progressLogs]);

  const handleOpenModal = () => {
    if (!selectedProject) return;
    setShowProgressModal(true);
  };

  const handleProgressUpdated = async () => {
    if (selectedProjectId) {
      await fetchLogs(selectedProjectId);
    }
    await fetchProjects();
  };

  const handleRefreshCollaborationData = useCallback(() => {
    if (!selectedTimelineEvent) return;
    setCollaborationActionItems(selectedTimelineEvent.actionItems ?? []);
    setCollaborationLogs(selectedTimelineEvent.collaborationLogs ?? []);
    setCollaborationMessage('已刷新协同数据');
    if (typeof window !== 'undefined') {
      window.setTimeout(() => setCollaborationMessage(null), 3000);
    }
  }, [selectedTimelineEvent]);

  const handleCancelEdit = useCallback(() => {
    if (isSubmittingEdit) return;
    setIsEditDrawerOpen(false);
    setEditingTimelineEvent(null);
    setEditError(null);
  }, [isSubmittingEdit]);

  const handleSubmitEdit = useCallback(async () => {
    if (!editingTimelineEvent) return;
    const logId = getTimelineLogId(editingTimelineEvent);
    if (!logId) {
      setEditError('未找到有效的服务进度记录 ID');
      return;
    }

    setIsSubmittingEdit(true);
    setEditError(null);

    try {
      const completedPayload = editFormValues.completed
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((content) => ({ content }));

      const nextPayload = editFormValues.next
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((content) => ({ content }));

      await peopleService.updateServiceProgressLog(logId, {
        description: editFormValues.description.trim(),
        notes: editFormValues.notes.trim() || undefined,
        milestone: editFormValues.milestone.trim() || undefined,
        status: editFormValues.status,
        completed_items: completedPayload.length ? completedPayload : undefined,
        next_steps: nextPayload.length ? nextPayload : undefined,
      });

      if (selectedProjectId) {
        await fetchLogs(selectedProjectId);
      }
      await fetchProjects();

      setIsEditDrawerOpen(false);
      setEditingTimelineEvent(null);

      if (selectedTimelineEvent && getTimelineLogId(selectedTimelineEvent) === logId) {
        handleCloseTimelineDetail();
      }
    } catch (error) {
      console.error('[ServiceChronology] 更新服务进度失败', error);
      setEditError('更新失败，请稍后再试');
    } finally {
      setIsSubmittingEdit(false);
    }
  }, [editingTimelineEvent, editFormValues, selectedProjectId, fetchLogs, fetchProjects, selectedTimelineEvent, handleCloseTimelineDetail]);

  const handleCancelDelete = useCallback(() => {
    if (isDeletingProgress) return;
    setDeleteTargetEvent(null);
  }, [isDeletingProgress]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTargetEvent) return;
    const logId = getTimelineLogId(deleteTargetEvent);
    if (!logId) {
      setDeleteTargetEvent(null);
      return;
    }

    setIsDeletingProgress(true);
    try {
      await peopleService.deleteServiceProgressLog(logId);
      if (selectedProjectId) {
        await fetchLogs(selectedProjectId);
      }
      await fetchProjects();
      if (selectedTimelineEvent && getTimelineLogId(selectedTimelineEvent) === logId) {
        handleCloseTimelineDetail();
      }
      setDeleteTargetEvent(null);
    } catch (error) {
      console.error('[ServiceChronology] 删除服务进度失败', error);
      setCollaborationMessage('删除失败，请稍后再试');
    } finally {
      setIsDeletingProgress(false);
    }
  }, [deleteTargetEvent, selectedProjectId, fetchLogs, fetchProjects, selectedTimelineEvent, handleCloseTimelineDetail]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">服务进度中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            以时间线视角串联学生服务的关键节点，实时掌握材料、文书、网申与风险状态。支持 AI 辅助分析、风险预警、进度统计与档案沉淀。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
          >
            <Filter className="h-4 w-4" />
            刷新数据
          </button>
          <button
            type="button"
            disabled={!selectedProject || !employeeProfile}
            onClick={handleOpenModal}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            添加里程碑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">服务列表</h2>
              <button
                type="button"
                onClick={fetchProjects}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
              >
                <Compass className="h-3 w-3" />
                状态
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {isLoadingProjects && (
                <div className="rounded-xl border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  正在同步 Supabase 数据...
                </div>
              )}
              {projectsError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-300">
                  {projectsError}
                </div>
              )}
              {!isLoadingProjects && !projectsError && projects.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-500 dark:border-gray-600 dark:text-gray-400">
                  当前没有活跃的服务项目，请先在学生服务模块创建或激活服务记录。
                </div>
              )}
              {projects.map((project) => {
                const isActive = project.id === selectedProjectId;
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-500/80 dark:bg-blue-900/30'
                        : 'border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {project.student} · {project.serviceName}
                      </span>
                      <span className={`text-xs ${project.status === '进行中' ? 'text-emerald-500' : project.status === '待启动' ? 'text-amber-500' : 'text-blue-500'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.phase}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      {project.startDate} - {project.endDate ?? '进行中'}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>整体进度</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {selectedProject ? (
            <>
              <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedProject.student} · {selectedProject.serviceName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      当前阶段：{selectedProject.phase} · 负责人：{selectedProject.primaryAdvisor}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700/60 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
                    <Timer className="h-3.5 w-3.5" />
                    {selectedProject.startDate} - {selectedProject.endDate ?? '进行中'}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {summaryMetrics.map((metric) => (
                      <div
                        key={metric.title}
                        className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-shadow"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} pointer-events-none`} />
                        <div className="relative flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
                              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                              {metric.trend}
                            </p>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
                            {metric.icon}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-2">
                <div className="flex flex-wrap gap-2">
                  {([
                    { id: 'timeline', label: '时间线视图', icon: <History className="h-4 w-4" /> },
                    { id: 'milestone', label: '里程碑管理', icon: <ListChecks className="h-4 w-4" /> },
                    { id: 'risk', label: '风险雷达', icon: <AlertTriangle className="h-4 w-4" /> },
                    { id: 'analytics', label: '进度统计', icon: <Activity className="h-4 w-4" /> },
                    { id: 'archives', label: '服务档案', icon: <Archive className="h-4 w-4" /> },
                  ] as const).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'timeline' && (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <SectionHeader
                    title="服务时间线"
                    description="按时间串联里程碑、文书、网申、风险与学生反馈，支持 AI 自动总结。"
                    actions={
                      <>
                        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                          <Filter className="h-4 w-4" />
                          筛选类型
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenModal}
                          disabled={!employeeProfile}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus className="h-4 w-4" />
                          新增记录
                        </button>
                      </>
                    }
                  />
                  <div className="mt-6 relative">
                    <div className="absolute left-4 top-0 bottom-0 border-l border-dashed border-blue-200 dark:border-blue-900/40" />
                    <div className="space-y-6">
                      {loadingLogs ? (
                        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                          正在加载进度记录...
                        </div>
                      ) : logsError ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600 dark:border-red-700/60 dark:bg-red-900/20 dark:text-red-300">
                          {logsError}
                        </div>
                      ) : timelineEvents.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                          暂无进度记录，点击右上角按钮添加第一条记录。
                        </div>
                      ) : (
                        timelineEvents.map((event) => (
                          <div key={event.id} className="relative pl-12">
                            <div className="absolute left-4 top-2 -translate-x-1/2 h-3 w-3 rounded-full border-4 border-white dark:border-gray-900 shadow ring-4 ring-blue-500/20 dark:ring-blue-900/30 bg-blue-500" />
                            <div
                              role="button"
                              tabIndex={0}
                              onClick={() => {
                                setActionMenuOpenId(null);
                                handleViewTimelineDetail(event);
                              }}
                              onKeyDown={(eventKey) => {
                                if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                                  eventKey.preventDefault();
                                  setActionMenuOpenId(null);
                                  handleViewTimelineDetail(event);
                                }
                              }}
                              className="relative rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-gray-700/60 dark:bg-gray-800/70"
                            >
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium uppercase tracking-wide text-blue-500 dark:text-blue-300">{event.type}</span>
                                    {event.status && (
                                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_COLOR[event.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                                        {event.status}
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="inline-flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {event.owner}
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                      <Calendar className="h-3 w-3 text-blue-500" />
                                      {event.timestamp}
                                    </span>
                                    {typeof event.attachments === 'number' && (
                                      <span className="inline-flex items-center gap-1">
                                        <Archive className="h-3 w-3" />
                                        附件 {event.attachments}
                                      </span>
                                    )}
                                    {event.tags?.map((tag) => (
                                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="pointer-events-auto absolute right-4 top-4 z-10 flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(eventClick) => {
                                      eventClick.stopPropagation();
                                      setActionMenuOpenId(null);
                                      handleViewTimelineDetail(event);
                                    }}
                                    className="inline-flex items-center rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-gray-600 dark:text-blue-300 dark:hover:bg-blue-900/20"
                                  >
                                    查看详情
                                    <ChevronRight className="h-3 w-3" />
                                  </button>
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={(eventClick) => {
                                        eventClick.stopPropagation();
                                        setActionMenuOpenId((prev) => (prev === event.id ? null : event.id));
                                      }}
                                      className="inline-flex items-center justify-center rounded-xl border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">更多操作</span>
                                    </button>
                                    {actionMenuOpenId === event.id ? (
                                      <div
                                        className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-gray-200 bg白 p-2 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-900"
                                        onClick={(menuClick) => menuClick.stopPropagation()}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActionMenuOpenId(null);
                                            handleEditTimelineEvent(event);
                                          }}
                                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-gray-600 transition hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-blue-900/20"
                                        >
                                          <PenSquare className="h-3.5 w-3.5" />
                                          编辑
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setActionMenuOpenId(null);
                                            handleDeleteTimelineEvent(event);
                                          }}
                                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/20"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                          删除
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                              {event.aiInsight && (
                                <div className="mt-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 px-3 py-2 text-xs text-purple-600 dark:text-purple-300">
                                  <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                                  {event.aiInsight}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'milestone' && (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <SectionHeader
                    title="里程碑管理"
                    description="查看阶段性关键节点，支持甘特视图、权重与预警设置。"
                    actions={
                      <>
                        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                          <Layout className="h-4 w-4" />
                          甘特视图
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenModal}
                          disabled={!employeeProfile}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus className="h-4 w-4" />
                          新增里程碑
                        </button>
                      </>
                    }
                  />
                  {milestoneItems.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                      暂无里程碑数据，可点击右上角"新增里程碑"创建。
                    </div>
                  ) : (
                    <div className="mt-6 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                        <thead>
                          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            <th className="px-4 py-3">里程碑</th>
                            <th className="px-4 py-3">阶段</th>
                            <th className="px-4 py-3">负责人</th>
                            <th className="px-4 py-3">计划时间</th>
                            <th className="px-4 py-3">截止</th>
                            <th className="px-4 py-3">状态</th>
                            <th className="px-4 py-3">完成度</th>
                            <th className="px-4 py-3 text-right">权重</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                          {milestoneItems.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
                              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.stage}</td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.owner}</td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.plannedDate}</td>
                              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.dueDate}</td>
                              <td className="px-4 py-4 text-sm font-medium">
                                <span className={MIL_STATUS_COLOR[item.status]}>{item.status}</span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.completion}%` }} />
                                  </div>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.completion}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400">{item.weight}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <SectionHeader
                    title="风险雷达"
                    description="监测材料、文书、学生配合等维度风险，自动生成缓解建议。"
                    actions={
                      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                        <Compass className="h-4 w-4" />
                        风险配置
                      </button>
                    }
                  />
                  {riskItems.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                      暂无风险记录。
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {riskItems.map((risk) => (
                        <div key={risk.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{risk.summary}</span>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${RISK_LEVEL_COLOR[risk.level]}`}>
                                  {risk.level}风险
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                维度：{risk.category} · 风险评分 {risk.score}
                              </p>
                              <p className="mt-2 text-xs text-blue-500 dark:text-blue-300">更新于 {risk.updatedAt}</p>
                            </div>
                            <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                              转为任务
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="mt-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
                            <strong className="mr-2 text-gray-900 dark:text-white">缓解建议：</strong>
                            {risk.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  {analyticsIndicators.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                      暂无统计数据。
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      {analyticsIndicators.map((indicator) => (
                        <div key={indicator.label} className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 shadow-sm">
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{indicator.label}</p>
                          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text白">{indicator.value}</p>
                          <p className={`mt-2 text-xs font-medium ${indicator.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {indicator.delta} · 相比上周期
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                    <SectionHeader
                      title="进度指标趋势"
                      description="可导出至 PDF 或嵌入周/月度服务报告，与文书工作台、项目任务数据联动。"
                      actions={
                        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text白 px-3 py-2 text-sm">
                          <BarChart3 className="h-4 w-4" />
                          导出仪表盘
                        </button>
                      }
                    />
                    <div className="mt-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                      图表占位：折线图展示里程碑完成率、风险评分、AI 建议采纳率等指标的时间趋势。
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'archives' && (
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <SectionHeader
                    title="服务档案"
                    description="沉淀阶段总结、成果输出与沟通纪要，支持一键生成移交文件。"
                    actions={
                      <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
                        <FileText className="h-4 w-4" />
                        生成报告
                      </button>
                    }
                  />
                  {archiveData.length === 0 ? (
                    <div className="mt-6 rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-600 dark:text-gray-400">
                      暂无服务档案。
                    </div>
                  ) : (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {archiveData.map((archive) => (
                        <div key={archive.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text白">{archive.title}</p>
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{archive.description}</p>
                            </div>
                            <span className="text-xs text-gray-400">{archive.createdAt}</span>
                          </div>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {archive.author}
                            </span>
                            {archive.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800/80 p-10 text-center text-gray-500 dark:text-gray-400">
              请从左侧选择一个服务项目以查看详细进度。
            </div>
          )}
        </section>
      </div>

      {selectedProject && (
        <ServiceProgressModal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          onProgressUpdated={handleProgressUpdated}
          serviceId={Number(selectedProject.id.replace('srv-', ''))}
          currentProgress={selectedProject.progress}
          serviceName={`${selectedProject.student} · ${selectedProject.serviceName}`}
          recorderId={employeeProfile?.id}
          employeeRefId={employeeProfile?.id}
        />
      )}

      {timelineDetail && isTimelineDetailOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="服务进度详情"
          onClick={handleCloseTimelineDetail}
        >
          <div
            className="flex h-full w-full max-w-3xl flex-col overflow-y-auto rounded-l-3xl border-l border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700/60 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-blue-500 dark:text-blue-300">
                  <span>{timelineDetail.type}</span>
                  {timelineDetail.status ? (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${STATUS_COLOR[timelineDetail.status] || 'bg-blue-500/10 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200'}`}>
                      {timelineDetail.status}
                    </span>
                  ) : null}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{timelineDetail.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    {timelineDetail.timestamp}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    {timelineDetail.owner}
                  </span>
                  {timelineDetail.milestone ? (
                    <span className="inline-flex items-center gap-1">
                      <Target className="h-3.5 w-3.5 text-blue-500" />
                      关联里程碑：{timelineDetail.milestone}
                    </span>
                  ) : null}
                  {typeof timelineDetail.attachments === 'number' ? (
                    <span className="inline-flex items-center gap-1">
                      <Archive className="h-3.5 w-3.5 text-blue-500" />
                      附件 {timelineDetail.attachments}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEditTimelineEvent(timelineDetail)}
                  className="inline-flex items-center gap-1 rounded-xl border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/20"
                >
                  <PenSquare className="h-3.5 w-3.5" />
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTimelineEvent(timelineDetail)}
                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  删除
                </button>
                <button
                  type="button"
                  onClick={handleCloseTimelineDetail}
                  className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
                >
                  关闭
                </button>
              </div>
            </div>

            <div className="space-y-6 p-5 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              <p>{timelineDetail.description}</p>

              {timelineDetail.aiInsight ? (
                <div className="flex items-start gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{timelineDetail.aiInsight}</span>
                </div>
              ) : null}

              {timelineDetail.notes && timelineDetail.notes.trim().length ? (
                <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/70 dark:text-gray-300">
                  {timelineDetail.notes}
                </div>
              ) : null}

              {timelineDetail.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {timelineDetail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="grid gap-4 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
                <div className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  记录时间：
                  {timelineDetail.rawLog?.progress_date
                    ? formatDateTime(timelineDetail.rawLog.progress_date)
                    : timelineDetail.timestamp}
                </div>
                <div className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  记录人：
                  {timelineDetail.rawLog?.employee?.name ||
                    timelineDetail.rawLog?.recorder?.person?.name ||
                    (timelineDetail.rawLog?.recorded_by ? `成员 #${timelineDetail.rawLog.recorded_by}` : timelineDetail.owner)}
                </div>
                {timelineDetail.rawLog?.milestone ? (
                  <div className="inline-flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    阶段进度：{timelineDetail.rawLog.milestone}
                  </div>
                ) : null}
              </div>

              {timelineDetail.completedItems?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      已完成项目
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      共 {timelineDetail.completedItems.length} 项
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {timelineDetail.completedItems.map((item, index) => {
                      const record = item as Record<string, unknown>;
                      const content = getRecordContent(record);
                      const owner = getRecordAssignee(record);
                      return (
                        <li
                          key={`completed-${index}`}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-300"
                        >
                          <div className="flex flex-col gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{content}</span>
                            {owner ? (
                              <span className="text-xs text-gray-500 dark:text-gray-400">负责人：{owner}</span>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {timelineDetail.nextSteps?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      <ListChecks className="h-4 w-4 text-blue-500" />
                      下一步计划
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500">共 {timelineDetail.nextSteps.length} 项</span>
                  </div>
                  <ul className="space-y-2">
                    {timelineDetail.nextSteps.map((item, index) => {
                      const record = item as Record<string, unknown>;
                      const content = getRecordContent(record);
                      const owner = getRecordAssignee(record);
                      const due = getRecordDueDate(record);
                      return (
                        <li
                          key={`next-${index}`}
                          className="rounded-xl border border-blue-200/70 bg-blue-50/60 px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-100"
                        >
                          <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-gray-900 dark:text-white">{content}</span>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-blue-100/80">
                              {owner && (
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  负责人：{owner}
                                </span>
                              )}
                              {due && (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  截止：{due}
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <ListChecks className="h-4 w-4 text-emerald-500" />
                    协同待办
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">共 {collaborationActionItems.length} 项</span>
                </div>
                {collaborationActionItems.length ? (
                  <ul className="space-y-2">
                    {collaborationActionItems.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-200"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900 dark:text-white">{item.content}</p>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  负责人：{item.owner}
                                </span>
                                {item.dueDate ? (
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    截止：{item.dueDate}
                                  </span>
                                ) : null}
                                <span className={`inline-flex items-center gap-1 text-xs ${COLLAB_PRIORITY_TEXT[item.priority]}`}>
                                  优先级：{item.priority}
                                </span>
                              </div>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${COLLAB_STATUS_BADGE[item.status]}`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                            <button
                              type="button"
                              onClick={() => handleToggleActionItemStatus(item.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/60"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {item.status === '已完成' ? '重新打开' : '标记完成'}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-700/60 dark:text-gray-400">
                    暂无协同待办，点击上方按钮即可生成新的协作事项。
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <History className="h-4 w-4 text-gray-500" />
                    协同动态
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500">最新 {collaborationLogs.length} 条</span>
                </div>
                <div className="space-y-3">
                  {collaborationLogs.map((log) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-300"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3 text-blue-500" />
                          {log.actor}
                          <span className="mx-2 h-3 w-px bg-gray-200 dark:bg-gray-700" />
                          <Clock className="h-3 w-3 text-blue-500" />
                          {log.timestamp}
                        </div>
                        <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{log.action}</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {timelineDetail.attachmentsList?.length ? (
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                    <Archive className="h-4 w-4 text-blue-500" />
                    相关附件
                  </h3>
                  <ul className="space-y-2">
                    {timelineDetail.attachmentsList.map((file, index) => (
                      <li
                        key={`attachment-${file.url ?? file.name ?? index}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-300"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 dark:text白">
                            {file.name || file.url || `附件 ${index + 1}`}
                          </span>
                          {file.type ? (
                            <span className="text-xs text-gray-500 dark:text-gray-400">类型：{file.type}</span>
                          ) : null}
                        </div>
                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                          >
                            打开
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : timelineDetail.attachments ? (
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 dark:border-gray-700/60 dark:bg-gray-900/40 dark:text-gray-400">
                  <Archive className="h-4 w-4" />
                  已上传 {timelineDetail.attachments} 个附件
                </div>
              ) : null}

              {timelineDetail.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {timelineDetail.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm dark:border-gray-700/60 dark:bg-gray-800/70">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">协同操作</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">一键转派任务、发起讨论或同步会议，让团队保持同频。</p>
                  </div>
                  {collaborationMessage ? (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600 dark:bg-blue-900/30 dark:text-blue-200">
                      {collaborationMessage}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCollaborationAction('assign')}
                    className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/20"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    转派任务
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCollaborationAction('discussion')}
                    className="inline-flex items-center gap-2 rounded-xl border border-purple-200 px-3 py-2 text-xs font-medium text-purple-600 transition hover:bg-purple-50 dark:border-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/20"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    发起讨论
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCollaborationAction('meeting')}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/20"
                  >
                    <CalendarCheck className="h-3.5 w-3.5" />
                    同步会议
                  </button>
                  <button
                    type="button"
                    onClick={handleRefreshCollaborationData}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
                  >
                    <Send className="h-3.5 w-3.5" />
                    重新加载
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isEditDrawerOpen && editingTimelineEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="编辑服务进度"
          onClick={handleCancelEdit}
        >
          <div
            className="flex h-full w-full max-w-2xl flex-col overflow-y-auto rounded-l-3xl border-l border-gray-100 bg-white p-6 shadow-2xl dark:border-gray-700/60 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">编辑服务进度</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  调整进度描述、状态或协同事项，保存后将自动刷新列表。
                </p>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
              >
                取消
              </button>
            </div>

            <form
              className="mt-6 space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmitEdit();
              }}
            >
              {editError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                  {editError}
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">阶段进度</label>
                <input
                  type="text"
                  value={editFormValues.milestone}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      milestone: event.target.value,
                    }))
                  }
                  placeholder="例如 75% 或 文书定稿"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">状态</label>
                <select
                  value={editFormValues.status}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                >
                  {EDIT_STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">进度描述</label>
                <textarea
                  value={editFormValues.description}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="记录本次进展的关键信息，例如完成文书第三稿。"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">备注</label>
                <textarea
                  value={editFormValues.notes}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="可补充会议决议、学生反馈等信息。"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">已完成项目（每行一项）</label>
                <textarea
                  value={editFormValues.completed}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      completed: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="例如：完成文书初稿校对"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">下一步计划（每行一项）</label>
                <textarea
                  value={editFormValues.next}
                  onChange={(event) =>
                    setEditFormValues((prev) => ({
                      ...prev,
                      next: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="例如：邀请推荐人确认最终稿"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
                  disabled={isSubmittingEdit}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingEdit ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      保存中
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      保存修改
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTargetEvent ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-label="删除服务进度"
          onClick={handleCancelDelete}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-900/40 dark:bg-gray-900"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">确认删除该条服务进度吗？</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              {deleteTargetEvent.title}
              <br />
              记录时间：{deleteTargetEvent.timestamp}
            </p>
            <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-900/20 dark:text-rose-300">
              删除后将无法在时间线上看到该条记录（建议仅在误操作或信息无效时执行）。
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/70"
                disabled={isDeletingProgress}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDeletingProgress}
              >
                {isDeletingProgress ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    删除中
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    确认删除
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ServiceChronologyPage;


