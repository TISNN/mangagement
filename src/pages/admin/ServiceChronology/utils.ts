import { format } from 'date-fns';
import type { ServiceProgressLog } from '../../../types/people';
import type {
  CollaborationActionItem,
  CollaborationLogEntry,
  CollaborationPriority,
  CollaborationStatus,
  TimelineEvent,
} from './types';

export const formatDateString = (date: string | null | undefined) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'yyyy-MM-dd');
  } catch {
    return date;
  }
};

export const formatDateTime = (date: string) => {
  try {
    return format(new Date(date), 'yyyy-MM-dd HH:mm');
  } catch {
    return date;
  }
};

export const extractString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string' && value.trim().length) {
    return value.trim();
  }
  return fallback;
};

export const parseActionItemsFromLog = (log: ServiceProgressLog): CollaborationActionItem[] => {
  const rawItems = (log as { action_items?: unknown }).action_items;
  if (Array.isArray(rawItems)) {
    const normalized = rawItems
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item, index) => {
        const owner = extractString(item.assigned_to_name ?? item.owner ?? item.executor, '顾问团队');
        const content = extractString(item.content ?? item.description ?? item.summary, `协同事项 ${index + 1}`);
        const statusRaw = extractString(item.status as string | undefined, '进行中');
        const status: CollaborationStatus = statusRaw.includes('完') ? '已完成' : statusRaw.includes('待') ? '待处理' : '进行中';
        const dueDate = extractString(item.due_date ?? item.deadline ?? item.plan_date, '') || undefined;
        const priorityText = extractString(item.priority as string | undefined, '中');
        const priority: CollaborationPriority = priorityText.includes('高') ? '高' : priorityText.includes('低') ? '低' : '中';

        return {
          id: `log-${log.id}-action-${index}`,
          owner,
          content,
          dueDate: formatDateString(dueDate ?? ''),
          status,
          priority,
          source: extractString(item.source as string | undefined, '人工记录'),
        } satisfies CollaborationActionItem;
      });
    if (normalized.length) {
      return normalized;
    }
  }

  const primaryOwner = extractString(log.employee?.name, '顾问团队');
  const nextStep = extractString(((log.next_steps ?? [])[0] as { content?: string })?.content, '准备下周材料同步');
  return [
    {
      id: `fallback-action-${log.id}-1`,
      owner: primaryOwner,
      content: nextStep,
      dueDate: formatDateString(((log.next_steps ?? [])[0] as { due_date?: string })?.due_date ?? ''),
      status: '进行中',
      priority: '高',
      source: '系统推送',
    },
    {
      id: `fallback-action-${log.id}-2`,
      owner: extractString(log.recorder?.person?.name, primaryOwner),
      content: '与学生确认推荐人反馈节奏',
      dueDate: formatDateString(log.progress_date),
      status: '待处理',
      priority: '中',
      source: '顾问提醒',
    },
  ];
};

export const parseCollaborationLogsFromLog = (log: ServiceProgressLog): CollaborationLogEntry[] => {
  const rawLogs = (log as { collaboration_logs?: unknown }).collaboration_logs;
  if (Array.isArray(rawLogs)) {
    const normalized = rawLogs
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item, index) => {
        const actor = extractString(item.actor ?? item.owner ?? item.created_by, '顾问团队');
        const action = extractString(item.action ?? item.title, `协同记录 ${index + 1}`);
        const timestamp = extractString(item.timestamp ?? item.created_at ?? log.progress_date, log.progress_date);
        const details = extractString(item.details ?? item.description ?? item.note, '记录已同步');
        return {
          id: `log-${log.id}-collab-${index}`,
          actor,
          action,
          timestamp: formatDateTime(timestamp),
          details,
          relatedActionItemId: extractString(item.action_item_id as string | undefined, undefined),
        } satisfies CollaborationLogEntry;
      });
    if (normalized.length) {
      return normalized;
    }
  }

  return [
    {
      id: `fallback-collab-${log.id}-1`,
      actor: extractString(log.employee?.name, '顾问团队'),
      action: '创建协同待办',
      timestamp: formatDateTime(log.progress_date),
      details: '已同步“准备下一轮文书评审”任务给文书团队。',
    },
    {
      id: `fallback-collab-${log.id}-2`,
      actor: extractString(log.recorder?.person?.name, '系统'),
      action: 'AI 建议采纳',
      timestamp: formatDateTime(log.progress_date),
      details: 'AI 已添加提醒：本周需完成推荐信确认与材料补件。',
    },
  ];
};

export const getTimelineLogId = (event: TimelineEvent | null): number | null => {
  if (!event) return null;
  if (typeof event.rawLog?.id === 'number') {
    return event.rawLog.id;
  }
  const numeric = Number(String(event.id).replace('log-', ''));
  return Number.isFinite(numeric) ? numeric : null;
};

export const getRecordContent = (record: Record<string, unknown>) => {
  if (!record) return '';
  const candidates = ['content', 'description', 'title', 'summary', 'note'];
  for (const key of candidates) {
    const value = (record as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return JSON.stringify(record);
};

export const getRecordAssignee = (record: Record<string, unknown>) => {
  if (!record) return '';
  const assigneeFields = ['assigned_to_name', 'owner', 'assigned_to', 'responsible', 'executor'];
  for (const key of assigneeFields) {
    const value = (record as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number') {
      return `成员 #${value}`;
    }
  }
  return '';
};

export const getRecordDueDate = (record: Record<string, unknown>) => {
  if (!record) return '';
  const dueFields = ['due_date', 'deadline', 'plan_date', 'planned_date'];
  for (const key of dueFields) {
    const value = (record as Record<string, unknown>)[key];
    if (typeof value === 'string' && value.trim()) {
      return formatDateString(value.trim());
    }
  }
  return '';
};

