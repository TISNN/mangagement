import type {
  AttendanceInsight,
  CommunicationCard,
  GuardianAlert,
  GrowthMilestone,
  LearnerKpi,
  LearningTask,
  LessonEvent,
  ProgressGoal,
  ResourceFolder,
  ScheduleSummary,
} from './types';

export const LEARNER_KPIS: LearnerKpi[] = [
  {
    id: 'attendance',
    label: '出勤率',
    value: '96%',
    change: '+3% 同比上周',
    positive: true,
  },
  {
    id: 'assignments',
    label: '作业准时率',
    value: '92%',
    change: '-1% 同比',
    positive: false,
  },
  {
    id: 'practice',
    label: '练习完成',
    value: '18/20',
    change: '+4 本周新增',
    positive: true,
  },
  {
    id: 'communication',
    label: '消息回复',
    value: '15 条',
    change: '家长 5 条',
    positive: true,
  },
];

export const UPCOMING_LESSONS: LessonEvent[] = [
  {
    id: 'lesson-1',
    date: '02.12 周三',
    timeRange: '19:00 - 20:30',
    course: 'IELTS 口语实战演练',
    instructor: 'Lucy Chen',
    mode: '线上',
    location: 'Zoom 会议室 · Room A',
    status: '即将开始',
    resources: ['课前热身练习包', '口语题库 v3.2'],
    joinLink: 'https://zoom.example.com/ielts-speaking',
  },
  {
    id: 'lesson-2',
    date: '02.14 周五',
    timeRange: '18:30 - 20:00',
    course: 'A-Level 数学冲刺班',
    instructor: 'Robert Wang',
    mode: '线下',
    location: '上海徐汇校区 · 3F-305',
    status: '待确认',
    resources: ['函数与微积分讲义', '课堂测验卷'],
  },
  {
    id: 'lesson-3',
    date: '02.16 周日',
    timeRange: '10:00 - 11:30',
    course: '留学文书工作坊',
    instructor: 'Grace Li',
    mode: '混合',
    location: 'ClassIn 云教室',
    status: '即将开始',
    resources: ['个人故事模板', '优秀案例参考'],
  },
];

export const LEARNING_TASKS: LearningTask[] = [
  {
    id: 'task-essay',
    title: 'IELTS 写作 Task 2 作业：Globalization',
    course: 'IELTS Writing',
    type: '作业',
    dueDate: '02-15 22:00',
    status: '待提交',
    completion: 45,
    aiHighlights: ['AI 建议强化段落衔接', '建议引用近期案例'],
    nextSteps: ['完成正文第三段草稿', '与老师预约语法检查'],
  },
  {
    id: 'task-portfolio',
    title: '艺术作品集阶段性提交',
    course: 'Art Portfolio Coaching',
    type: '项目',
    dueDate: '02-18 18:00',
    status: '已提交',
    completion: 100,
    aiHighlights: ['自动生成作品说明草稿'],
  },
  {
    id: 'task-quiz',
    title: 'A-Level 数学第二次周测',
    course: 'A-Level Math',
    type: '测评',
    dueDate: '02-17 12:00',
    status: '批改中',
    completion: 100,
    nextSteps: ['等待教师评分', '复盘错题'],
  },
];

export const RESOURCE_FOLDERS: ResourceFolder[] = [
  {
    id: 'ielts-suite',
    title: 'IELTS 学习路径',
    description: '口语题库、写作范文、听力训练包与 AI 练习合集',
    items: [
      {
        id: 'res-spk-kit',
        name: '口语 Part1 高频题库（2024 Q1）',
        format: 'PDF',
        size: '2.4 MB',
        updatedAt: '2024-02-10',
        owner: 'Lucy Chen',
        version: 'v3.2',
        tags: ['口语', '题库', '热身'],
      },
      {
        id: 'res-writing',
        name: '写作 Task2 高分范文合集',
        format: '文档',
        updatedAt: '2024-02-08',
        owner: 'AI Writer',
        version: 'v1.4',
        tags: ['写作', '范文'],
      },
      {
        id: 'res-speaking-ai',
        name: 'AI 口语反馈演示视频',
        format: '视频',
        duration: '18:24',
        updatedAt: '2024-02-05',
        owner: 'Learning Tech',
        version: 'v1.0',
        tags: ['演示', '技巧'],
      },
    ],
  },
  {
    id: 'stem-lab',
    title: 'STEM 拓展课资料库',
    description: '竞赛资料、项目模板与实战案例集合',
    items: [
      {
        id: 'res-project-kit',
        name: '科研项目 Canvas 模板',
        format: '文档',
        updatedAt: '2024-02-02',
        owner: 'Research Center',
        version: 'v2.1',
        tags: ['科研', '模板'],
      },
      {
        id: 'res-case',
        name: 'Intel ISEF 获奖案例拆解',
        format: 'PDF',
        size: '3.1 MB',
        updatedAt: '2024-01-30',
        owner: 'Project Coach',
        version: 'v1.0',
        tags: ['竞赛', '案例'],
      },
    ],
  },
];

export const PROGRESS_GOALS: ProgressGoal[] = [
  {
    id: 'goal-ielts',
    title: 'IELTS 总分 7.5',
    targetScore: 7.5,
    currentScore: 7.0,
    milestone: '3 月上旬完成口语冲刺营',
    dueDate: '2024-03-25',
    status: '按计划',
  },
  {
    id: 'goal-math',
    title: 'A-Level 数学 A*',
    milestone: '每周完成 2 套真题 + 1 次错题班',
    dueDate: '2024-05-10',
    status: '需关注',
  },
  {
    id: 'goal-portfolio',
    title: '作品集终审提交',
    milestone: '2 月底完成 10 件作品精修',
    dueDate: '2024-03-01',
    status: '风险',
  },
];

export const GROWTH_MILESTONES: GrowthMilestone[] = [
  {
    id: 'milestone-speaking',
    title: '口语仿真演练评分提升至 7.0',
    category: '学术',
    description: '借助 AI 口语导师针对性练习 4 次，教师反馈口语结构更清晰。',
    achievedAt: '2024-02-05',
    evidence: 'AI 口语评分报告 v2',
  },
  {
    id: 'milestone-project',
    title: '完成科研项目开题答辩',
    category: '技能',
    description: '在导师工作坊上完成项目陈述并通过审核，获得后续实验资源。',
    achievedAt: '2024-01-28',
    evidence: '项目委员会意见书',
  },
];

export const COMMUNICATION_CARDS: CommunicationCard[] = [
  {
    id: 'thread-class',
    channel: '班主任',
    topic: 'Week 6 学习计划同步',
    lastMessage: '已上传周计划，请查收',
    lastActivity: '昨天 21:40',
    unread: 2,
    quickActions: ['查看计划', '预约跟进'],
  },
  {
    id: 'thread-parent',
    channel: '家长',
    topic: '缴费提醒 & 文书进度',
    lastMessage: '已确认缴费安排',
    lastActivity: '昨天 19:10',
    unread: 0,
    quickActions: ['发送收据', '安排回访'],
  },
  {
    id: 'thread-teacher',
    channel: '授课老师',
    topic: 'IELTS 作业点评',
    lastMessage: '口语反馈已更新至资料区',
    lastActivity: '今天 09:25',
    unread: 1,
    quickActions: ['查看反馈', '添加提醒'],
  },
];

export const GUARDIAN_ALERTS: GuardianAlert[] = [
  {
    id: 'alert-attendance',
    title: '昨日晚课缺勤',
    type: '出勤',
    level: '高',
    message: '学生未参加 2/11 IELTS 口语课，请家长确认原因并预约补课。',
    actionLabel: '提交请假说明',
  },
  {
    id: 'alert-homework',
    title: 'A-Level 数学作业逾期 1 次',
    type: '作业',
    level: '中',
    message: '建议本周末安排 1 对 1 巩固课堂知识，避免影响进度。',
    actionLabel: '预约巩固课',
  },
  {
    id: 'alert-payment',
    title: '春季课包尾款提醒',
    type: '缴费',
    level: '低',
    message: '尾款将在 2/20 扣款，请确认账户余额或联系我们的顾问。',
    actionLabel: '查看缴费方案',
  },
];

export const WEEKLY_SUMMARY: ScheduleSummary[] = [
  {
    day: '周一',
    lessons: 2,
    studyHours: 3,
    focus: 'IELTS 听力练习 · 作品集草稿',
  },
  {
    day: '周三',
    lessons: 3,
    studyHours: 4,
    focus: '口语实战 · 线下项目工作坊',
  },
  {
    day: '周五',
    lessons: 2,
    studyHours: 2.5,
    focus: 'A-Level 数学讲解 · 作业辅导',
  },
  {
    day: '周末',
    lessons: 1,
    studyHours: 2,
    focus: '文书工作坊 · 家庭沟通',
  },
];

export const ATTENDANCE_INSIGHTS: AttendanceInsight[] = [
  {
    id: 'attendance-week',
    title: '本周出勤 5/6 次',
    status: '提醒',
    detail: '周二 IELTS 口语课缺勤，建议安排补课或提供录播回放。',
    actions: ['发送补课申请', '推送录播链接'],
  },
  {
    id: 'punctual',
    title: '签到准时率 94%',
    status: '良好',
    detail: '仅在早课时段有轻微迟到，可考虑提前提醒。',
    actions: ['开启 15 分钟提醒'],
  },
  {
    id: 'engagement',
    title: '课堂参与度上升',
    status: '良好',
    detail: '最近三次课堂回答次数翻倍，保持积极互动。',
    actions: ['发送表扬通知'],
  },
];
