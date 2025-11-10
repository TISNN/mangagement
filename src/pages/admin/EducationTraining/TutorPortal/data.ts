import type {
  AttendanceInsight,
  ClassBrief,
  CollaborationItem,
  ClassroomInteraction,
  ClassroomLog,
  LessonPlan,
  PerformanceMetric,
  PostClassAction,
  QualityFeedback,
  RequestItem,
  ScheduleSummary,
  TeacherKpi,
  TeacherScheduleSlot,
} from './types';

export const TEACHER_KPIS: TeacherKpi[] = [
  {
    id: 'hours',
    label: '月课时数',
    value: '68 节',
    trend: '+6 节 vs 上月',
    positive: true,
  },
  {
    id: 'feedback',
    label: '学员满意度',
    value: '4.7 / 5',
    trend: '+0.2',
    positive: true,
  },
  {
    id: 'grading',
    label: '作业批改时效',
    value: '12 小时',
    trend: '-3 小时',
    positive: true,
  },
  {
    id: 'attendance',
    label: '迟到率',
    value: '3%',
    trend: '+1%',
    positive: false,
  },
];

export const TEACHER_SCHEDULE: TeacherScheduleSlot[] = [
  {
    id: 'slot-1',
    date: '02.13 周四',
    timeRange: '18:30 - 20:00',
    course: 'A-Level 物理 · 波动',
    className: 'A2 Physics 班',
    format: '线下',
    room: '虹口校区 · 402',
    students: 18,
    status: '待开始',
    actions: ['查看课前资料', '调课申请'],
  },
  {
    id: 'slot-2',
    date: '02.14 周五',
    timeRange: '20:00 - 21:30',
    course: 'IELTS 口语冲刺',
    className: 'IELTS G7 小班',
    format: '线上',
    room: 'Zoom · Room B',
    students: 12,
    status: '已确认',
    actions: ['进入课堂', '布置预习任务'],
  },
  {
    id: 'slot-3',
    date: '02.15 周六',
    timeRange: '14:00 - 16:00',
    course: '科研项目辅导',
    className: 'STEM Project Lab',
    format: '混合',
    room: 'ClassIn 云教室 + 实验室 2F',
    students: 8,
    status: '需调课',
    actions: ['提交调课说明', '通知班主任'],
  },
];

export const CLASS_BRIEFS: ClassBrief[] = [
  {
    id: 'class-ielts',
    name: 'IELTS G7 小班',
    level: 'IELTS 6.5-7.5',
    remainingHours: 6,
    objectives: ['强化口语结构', '提高 Task 2 逻辑', '保持每日打卡'],
    alerts: ['学员 Lily 最近缺勤 1 次'],
  },
  {
    id: 'class-physics',
    name: 'A-Level Physics A2',
    level: 'A-Level A* 冲刺',
    remainingHours: 10,
    objectives: ['完成波动模块', '安排仿真考试'],
  },
];

export const LESSON_PLANS: LessonPlan[] = [
  {
    id: 'plan-ielts',
    course: 'IELTS 口语冲刺：Part 2 与 Part 3',
    focusPoints: ['结构模板回顾', '当下时事话题拓展', '口语填充与语气控制'],
    activities: ['快速热身问答', '角色扮演 + AI 反馈', '学员互评环节'],
    resources: [
      {
        id: 'res-plan-1',
        title: '口语模板教案 v4',
        type: '教案',
        version: 'v4.0',
        owner: 'Lucy Chen',
        updatedAt: '2024-02-10',
      },
      {
        id: 'res-ppt-1',
        title: 'Part 2 高频话题 PPT',
        type: 'PPT',
        version: 'v2.3',
        owner: 'Teaching Team',
        updatedAt: '2024-02-08',
      },
    ],
    aiSuggestions: ['建议加入时事话题：AI 与教育', '课堂互动可增加“表情卡”投票'],
  },
  {
    id: 'plan-physics',
    course: 'A-Level Physics：Wave Interference',
    focusPoints: ['干涉与衍射实验', '公式推导与练习'],
    activities: ['课堂演示', '分组实验记录', 'Quizlet 快速检测'],
    resources: [
      {
        id: 'res-physics-guide',
        title: '实验操作指南 v1.1',
        type: '教案',
        version: 'v1.1',
        owner: 'Physics Research Team',
        updatedAt: '2024-02-07',
      },
      {
        id: 'res-physics-ppt',
        title: '波的干涉讲义',
        type: 'PPT',
        version: 'v1.5',
        owner: 'Robert Wang',
        updatedAt: '2024-02-06',
      },
    ],
  },
];

export const CLASSROOM_INTERACTIONS: ClassroomInteraction[] = [
  { id: 'interaction-raise', type: '举手', count: 14, trend: 'up' },
  { id: 'interaction-answer', type: '答题', count: 26, trend: 'up' },
  { id: 'interaction-vote', type: '投票', count: 4, trend: 'flat' },
];

export const CLASSROOM_LOGS: ClassroomLog[] = [
  {
    id: 'log-1',
    slotId: 'slot-1',
    attendance: '18/18 到课 · 1 人迟到 5 分钟',
    highlights: ['分组实验讨论积极', 'AI 口语助手参与练习'],
    assignments: ['发布口语作业', '课后反馈问卷'],
    recordingStatus: '已开启',
    nextActions: ['提醒 Lily 缺勤补课', '整理实验数据上传'],
  },
  {
    id: 'log-2',
    slotId: 'slot-2',
    attendance: '12/12 到课',
    highlights: ['课堂互动 28 次', '评分即时反馈完成'],
    assignments: ['布置写作 Task2 作业', '推送题库练习'],
    recordingStatus: '已开启',
    nextActions: ['标记重点问题整理至教研'],
  },
];

export const POST_CLASS_ACTIONS: PostClassAction[] = [
  {
    id: 'action-1',
    title: '补课安排确认',
    deadline: '02-14 20:00',
    status: '进行中',
    assignee: '班主任 Dora',
  },
  {
    id: 'action-2',
    title: '上传课堂录播与讲义',
    deadline: '02-14 12:00',
    status: '待处理',
    assignee: '教师本人',
  },
  {
    id: 'action-3',
    title: '提交作业点评模板',
    deadline: '02-15 18:00',
    status: '完成',
    assignee: '教学助教 Kevin',
  },
];

export const PERFORMANCE_METRICS: PerformanceMetric[] = [
  {
    id: 'metric-attendance',
    label: '出勤率',
    value: '96%',
    benchmark: '目标 ≥ 95%',
    status: '良好',
  },
  {
    id: 'metric-feedback',
    label: '课堂满意度',
    value: '4.7 / 5',
    benchmark: '目标 ≥ 4.5',
    status: '良好',
  },
  {
    id: 'metric-grading',
    label: '批改时效',
    value: '12 小时',
    benchmark: '目标 ≤ 24 小时',
    status: '良好',
  },
  {
    id: 'metric-quality',
    label: '质检得分',
    value: '88 / 100',
    benchmark: '目标 ≥ 90',
    status: '需关注',
  },
];

export const QUALITY_FEEDBACKS: QualityFeedback[] = [
  {
    id: 'feedback-1',
    source: '教研',
    summary: '建议口语课加入新的话题数据，以便学员练习最新题库。',
    date: '2024-02-09',
    actionItems: ['更新题库', '与学员沟通新题目'],
  },
  {
    id: 'feedback-2',
    source: '学员',
    summary: '课堂节奏清晰，希望作业点评能提供更多范文示例。',
    date: '2024-02-07',
    actionItems: ['整理范文合集', '安排点评直播'],
  },
];

export const COLLABORATION_THREADS: CollaborationItem[] = [
  {
    id: 'collab-1',
    channel: '班主任',
    subject: 'G7 班本周缺勤与补课',
    lastUpdate: '今天 09:10',
    unread: 1,
    quickActions: ['确认补课', '写课堂纪要'],
  },
  {
    id: 'collab-2',
    channel: '教研',
    subject: '口语课程教案更新审核',
    lastUpdate: '昨天 18:30',
    unread: 0,
    quickActions: ['上传版本', '查看意见'],
  },
  {
    id: 'collab-3',
    channel: '教务',
    subject: '2 月排班确认',
    lastUpdate: '昨天 15:20',
    unread: 2,
    quickActions: ['确认排班', '申请调课'],
  },
];

export const REQUEST_ITEMS: RequestItem[] = [
  {
    id: 'request-1',
    type: '调课',
    status: '待审批',
    date: '2024-02-12',
    detail: '2/16 STEM Lab 课程因实验室维护需调整至 2/17',
  },
  {
    id: 'request-2',
    type: '培训',
    status: '已通过',
    date: '2024-02-10',
    detail: '报名“AI 辅助教学”内训，时间 2/20 晚 7 点',
  },
  {
    id: 'request-3',
    type: '代课',
    status: '已驳回',
    date: '2024-02-08',
    detail: '申请 2/15 IELTS 晚课由 Lucy 代课，原因：出差',
  },
];

export const WEEKLY_SUMMARY: ScheduleSummary[] = [
  {
    day: '周一',
    lessons: 3,
    studyHours: 4,
    focus: 'IELTS 口语 + A-Level 数学冲刺',
  },
  {
    day: '周三',
    lessons: 2,
    studyHours: 3,
    focus: '项目辅导 · 教研会议',
  },
  {
    day: '周五',
    lessons: 2,
    studyHours: 2.5,
    focus: '口语冲刺直播 · 作业点评',
  },
  {
    day: '周末',
    lessons: 1,
    studyHours: 2,
    focus: '线上家长沟通 · 内训',
  },
];

export const ATTENDANCE_INSIGHTS: AttendanceInsight[] = [
  {
    id: 'insight-1',
    title: '本周迟到 2 次',
    status: '提醒',
    detail: '周二线下班有 1 名学员迟到 10 分钟，建议上课前推送提醒。',
    actions: ['发送提醒', '记录原因'],
  },
  {
    id: 'insight-2',
    title: '补课需求待确认',
    status: '需关注',
    detail: 'IELTS G7 小班有 1 位学员缺勤，需安排补课或提供录播。',
    actions: ['安排补课', '推送录播'],
  },
  {
    id: 'insight-3',
    title: '互动活跃度增加',
    status: '良好',
    detail: '近三次课堂答题次数增加 15%，可继续引导互动。',
    actions: ['表扬通知', '继续跟踪'],
  },
];
