export interface LearnerKpi {
  id: string;
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export interface LessonEvent {
  id: string;
  date: string;
  timeRange: string;
  course: string;
  instructor: string;
  mode: '线上' | '线下' | '混合';
  location: string;
  status: '即将开始' | '进行中' | '待确认';
  resources: string[];
  joinLink?: string;
}

export interface LearningTask {
  id: string;
  title: string;
  course: string;
  type: '作业' | '项目' | '测评';
  dueDate: string;
  status: '待提交' | '已提交' | '批改中' | '已完成';
  completion: number;
  aiHighlights?: string[];
  nextSteps?: string[];
}

export interface ResourceItem {
  id: string;
  name: string;
  format: 'PDF' | '视频' | '音频' | '文档' | '链接';
  size?: string;
  duration?: string;
  updatedAt: string;
  owner: string;
  version: string;
  tags: string[];
}

export interface ResourceFolder {
  id: string;
  title: string;
  description: string;
  items: ResourceItem[];
}

export interface ProgressGoal {
  id: string;
  title: string;
  targetScore?: number;
  currentScore?: number;
  plan?: string;
  milestone: string;
  dueDate: string;
  status: '按计划' | '需关注' | '风险';
}

export interface GrowthMilestone {
  id: string;
  title: string;
  category: '学术' | '技能' | '行为';
  description: string;
  achievedAt: string;
  evidence: string;
}

export interface CommunicationCard {
  id: string;
  channel: '班主任' | '授课老师' | '顾问' | '班级群';
  topic: string;
  lastMessage: string;
  lastActivity: string;
  unread: number;
  quickActions: string[];
}

export interface GuardianAlert {
  id: string;
  title: string;
  type: '出勤' | '作业' | '缴费' | '行为' | '系统';
  level: '高' | '中' | '低';
  message: string;
  actionLabel?: string;
}

export interface ScheduleSummary {
  day: string;
  lessons: number;
  studyHours: number;
  focus: string;
}

export interface AttendanceInsight {
  id: string;
  title: string;
  status: '良好' | '提醒' | '风险';
  detail: string;
  actions: string[];
}
