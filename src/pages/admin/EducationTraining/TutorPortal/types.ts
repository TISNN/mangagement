export interface TeacherKpi {
  id: string;
  label: string;
  value: string;
  trend: string;
  positive: boolean;
}

export interface TeacherScheduleSlot {
  id: string;
  date: string;
  timeRange: string;
  course: string;
  className: string;
  format: '线上' | '线下' | '混合';
  room: string;
  students: number;
  status: '待开始' | '已确认' | '需调课';
  actions: string[];
}

export interface ClassBrief {
  id: string;
  name: string;
  level: string;
  remainingHours: number;
  objectives: string[];
  alerts?: string[];
}

export interface LessonPlanResource {
  id: string;
  title: string;
  type: '教案' | 'PPT' | '题库' | '视频';
  version: string;
  owner: string;
  updatedAt: string;
}

export interface LessonPlan {
  id: string;
  course: string;
  focusPoints: string[];
  activities: string[];
  resources: LessonPlanResource[];
  aiSuggestions?: string[];
}

export interface ClassroomInteraction {
  id: string;
  type: '举手' | '答题' | '投票';
  count: number;
  trend: 'up' | 'down' | 'flat';
}

export interface ClassroomLog {
  id: string;
  slotId: string;
  attendance: string;
  highlights: string[];
  assignments: string[];
  recordingStatus: '已开启' | '未开启';
  nextActions: string[];
}

export interface PostClassAction {
  id: string;
  title: string;
  deadline: string;
  status: '待处理' | '进行中' | '完成';
  assignee: string;
}

export interface PerformanceMetric {
  id: string;
  label: string;
  value: string;
  benchmark: string;
  status: '良好' | '需关注' | '风险';
}

export interface QualityFeedback {
  id: string;
  source: '教研' | '督导' | '学员' | '家长';
  summary: string;
  date: string;
  actionItems: string[];
}

export interface CollaborationItem {
  id: string;
  channel: '班主任' | '教研' | '教务' | '群聊';
  subject: string;
  lastUpdate: string;
  unread: number;
  quickActions: string[];
}

export interface RequestItem {
  id: string;
  type: '调课' | '代课' | '请假' | '培训';
  status: '待审批' | '已通过' | '已驳回';
  date: string;
  detail: string;
}
