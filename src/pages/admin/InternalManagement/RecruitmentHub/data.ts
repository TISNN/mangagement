import { addDays, addHours, format } from 'date-fns';

export interface PositionSummary {
  id: string;
  title: string;
  department: string;
  location: string;
  headcount: number;
  filled: number;
  priority: '高' | '中' | '低';
  status: '开放中' | '暂停中' | '已完成';
  owner: string;
  openedAt: string;
  budget?: string;
}

export interface CandidateSummary {
  id: string;
  name: string;
  position: string;
  source: string;
  updatedAt: string;
  score?: number;
  tags?: string[];
  owner?: string;
  email?: string;
  phone?: string;
  resumeUrl?: string;
}

export interface CandidatePipelineColumn {
  stage: string;
  description: string;
  candidates: CandidateSummary[];
}

export interface CandidateTimelineEvent {
  date: string;
  owner: string;
  event: string;
  detail: string;
}

export interface CandidateProfile extends CandidateSummary {
  experienceYears: string;
  expectedSalary: string;
  currentCompany?: string;
  education?: string;
  skills: string[];
  status: string;
  notes?: string;
  timeline: CandidateTimelineEvent[];
  attachments?: Array<{ name: string; url: string }>;
}

export interface InterviewScheduleItem {
  id: string;
  candidate: string;
  position: string;
  stage: string;
  scheduledAt: string;
  endAt: string;
  timezone: string;
  interviewers: string[];
  location: string;
  meetingLink?: string;
  status: '待开始' | '进行中' | '已完成' | '重排中';
  attachments?: string[];
}

export interface OfferDecisionItem {
  id: string;
  candidate: string;
  position: string;
  stage: string;
  interviewers: string[];
  score: number;
  recommendation: '录用' | '备选' | '拒绝';
  nextAction: string;
  deadline: string;
}

export interface RecruitingReportMetric {
  id: string;
  title: string;
  value: string;
  trend?: string;
  change?: string;
  description?: string;
}

export interface RecruitingReportInsight {
  id: string;
  title: string;
  impact: '高' | '中' | '低';
  detail: string;
  owner: string;
  updatedAt: string;
}

const formatDateTime = (date: Date) => format(date, 'yyyy-MM-dd HH:mm');

export const POSITION_SUMMARIES: PositionSummary[] = [
  {
    id: 'pos-2024-01',
    title: '资深留学顾问',
    department: '咨询一部',
    location: '北京 · 望京',
    headcount: 2,
    filled: 1,
    priority: '高',
    status: '开放中',
    owner: '陈璐 · HRBP',
    openedAt: '2025-10-28',
    budget: '25-30万/年',
  },
  {
    id: 'pos-2024-02',
    title: '语言中心雅思教师',
    department: '教学服务部',
    location: '广州 · 天河',
    headcount: 3,
    filled: 1,
    priority: '中',
    status: '开放中',
    owner: '王哲 · 招聘专员',
    openedAt: '2025-10-18',
    budget: '20-26万/年',
  },
  {
    id: 'pos-2024-03',
    title: '市场内容运营',
    department: '品牌市场部',
    location: '上海 · 徐汇',
    headcount: 1,
    filled: 1,
    priority: '低',
    status: '已完成',
    owner: '赵芷若 · HRBP',
    openedAt: '2025-09-01',
    budget: '18-22万/年',
  },
  {
    id: 'pos-2024-04',
    title: '教研产品经理',
    department: '教学研发部',
    location: '远程 · 灵活',
    headcount: 1,
    filled: 0,
    priority: '高',
    status: '暂停中',
    owner: '刘昊 · HR',
    openedAt: '2025-10-05',
    budget: '28-35万/年',
  },
];

export const CANDIDATE_PIPELINE: CandidatePipelineColumn[] = [
  {
    stage: '待筛选',
    description: '简历收集中，等待 HR 初筛',
    candidates: [
      {
        id: 'cand-001',
        name: '李安雅',
        position: '资深留学顾问',
        source: '内推',
        updatedAt: '2025-11-09 10:20',
        email: 'anya.li@example.com',
        phone: '+86 138 0000 1234',
        resumeUrl: 'https://example.com/resume/anya-li.pdf',
        tags: ['5年经验', '北美方向'],
        owner: '王哲',
      },
      {
        id: 'cand-002',
        name: 'Tina Chen',
        position: '语言中心雅思教师',
        source: 'BOSS直聘',
        updatedAt: '2025-11-08 18:10',
        email: 'tina.chen@example.com',
        phone: '+86 139 1111 5678',
        resumeUrl: 'https://example.com/resume/tina-chen.pdf',
        tags: ['8.5 雅思成绩'],
        owner: '刘昊',
      },
    ],
  },
  {
    stage: '简历通过',
    description: '已完成 HR 初筛，即将进入面试流程',
    candidates: [
      {
        id: 'cand-003',
        name: '王臻',
        position: '资深留学顾问',
        source: '猎头渠道',
        updatedAt: '2025-11-07 15:40',
        score: 82,
        email: 'zhen.wang@example.com',
        phone: '+86 158 8899 2345',
        resumeUrl: 'https://example.com/resume/zhen-wang.pdf',
        tags: ['QS Top 50', '硕士'],
        owner: '陈璐',
      },
    ],
  },
  {
    stage: '面试中',
    description: '正在进行多轮面试评估',
    candidates: [
      {
        id: 'cand-004',
        name: '赵沐',
        position: '市场内容运营',
        source: '校园招聘',
        updatedAt: '2025-11-09 09:15',
        score: 87,
        email: 'mu.zhao@example.com',
        phone: '+86 137 9876 3456',
        resumeUrl: 'https://example.com/resume/mu-zhao.pdf',
        tags: ['视频运营', '双语'],
        owner: '赵芷若',
      },
      {
        id: 'cand-005',
        name: 'Grace Li',
        position: '语言中心雅思教师',
        source: '拉勾',
        updatedAt: '2025-11-08 20:40',
        score: 75,
        email: 'grace.li@example.com',
        phone: '+86 150 1234 5678',
        resumeUrl: 'https://example.com/resume/grace-li.pdf',
        tags: ['教学总监背景'],
        owner: '王哲',
      },
    ],
  },
  {
    stage: '发 Offer',
    description: 'Offer 流程中，等待候选人反馈',
    candidates: [
      {
        id: 'cand-006',
        name: 'Samuel Wong',
        position: '资深留学顾问',
        source: '外部猎头',
        updatedAt: '2025-11-06 14:05',
        score: 90,
        email: 'samuel.wong@example.com',
        phone: '+852 9123 4567',
        resumeUrl: 'https://example.com/resume/samuel-wong.pdf',
        tags: ['香港籍', '英语母语'],
        owner: '陈璐',
      },
    ],
  },
  {
    stage: '已入职',
    description: 'Offer 接受并完成入职流程',
    candidates: [
      {
        id: 'cand-007',
        name: '陈夏',
        position: '市场内容运营',
        source: '内推',
        updatedAt: '2025-11-01 11:30',
        score: 92,
        email: 'xia.chen@example.com',
        phone: '+86 186 2345 6789',
        resumeUrl: 'https://example.com/resume/xia-chen.pdf',
        tags: ['前BAT', '品牌策划'],
        owner: '赵芷若',
      },
    ],
  },
];

export const CANDIDATE_PROFILES: CandidateProfile[] = [
  {
    id: 'cand-001',
    name: '李安雅',
    email: 'anya.li@example.com',
    phone: '+86 138 0000 1234',
    position: '资深留学顾问',
    source: '内推（王若）',
    owner: '王哲',
    updatedAt: '2025-11-09 10:20',
    experienceYears: '5 年',
    expectedSalary: '32W / 年 · 可谈',
    currentCompany: '某知名咨询机构 · 留学顾问',
    education: '伦敦大学学院 UCL · 教育学硕士',
    skills: ['北美本科申请', '面试辅导', '家长沟通', 'QS Top50 项目'],
    resumeUrl: 'https://example.com/resume/anya-li.pdf',
    status: '待 HR 面试',
    tags: ['5年经验', '北美方向'],
    timeline: [
      { date: '11-07 09:20', owner: '王哲', event: '内推提交', detail: '同为留学顾问的王若推荐' },
      { date: '11-08 10:00', owner: '陈璐', event: '简历初筛', detail: '通过 · 反馈综合背景良好' },
      { date: '11-09 09:40', owner: '王哲', event: '安排 HR 面试', detail: '待候选人确认时间' },
    ],
    attachments: [
      { name: '简历 - 李安雅.pdf', url: 'https://example.com/resume/anya-li.pdf' },
      { name: '作品集 - 北美案例.pptx', url: 'https://example.com/portfolio/anya-li.pptx' },
    ],
    notes: '家庭在北京，愿接受 2 次出差；希望有明确晋升路径。',
  },
  {
    id: 'cand-003',
    name: '王臻',
    email: 'zhen.wang@example.com',
    phone: '+86 158 8899 2345',
    position: '资深留学顾问',
    source: '猎头渠道（外服猎头）',
    owner: '陈璐',
    updatedAt: '2025-11-07 15:40',
    experienceYears: '7 年',
    expectedSalary: '35W / 年',
    currentCompany: '启德教育 · 高级顾问',
    education: '香港大学 · 市场营销硕士',
    skills: ['战略规划', '服务流程设计', '跨部门协同'],
    resumeUrl: 'https://example.com/resume/zhen-wang.pdf',
    status: '等待专业面反馈',
    tags: ['QS Top 50', '硕士'],
    timeline: [
      { date: '11-05 13:00', owner: '猎头-陈英', event: '投递简历', detail: '猎头渠道推荐' },
      { date: '11-06 09:30', owner: '陈璐', event: 'HR 初筛', detail: '面试通过' },
      { date: '11-08 14:00', owner: '李骁', event: '专业面', detail: '正在评估' },
    ],
    attachments: [{ name: '简历 - 王臻.pdf', url: 'https://example.com/resume/zhen-wang.pdf' }],
    notes: '可接受薪酬略低，但希望明确团队带领范围。',
  },
  {
    id: 'cand-004',
    name: '赵沐',
    email: 'mu.zhao@example.com',
    phone: '+86 137 9876 3456',
    position: '市场内容运营',
    source: '校园招聘',
    owner: '赵芷若',
    updatedAt: '2025-11-09 09:15',
    experienceYears: '2 年',
    expectedSalary: '18W / 年',
    currentCompany: '应届毕业生',
    education: '复旦大学 · 新闻传播本科',
    skills: ['短视频策划', '品牌联合活动', '数据分析'],
    resumeUrl: 'https://example.com/resume/mu-zhao.pdf',
    status: '业务面试中',
    tags: ['视频运营', '双语'],
    timeline: [
      { date: '10-30 20:00', owner: '赵芷若', event: '校招投递', detail: '通过官方校招渠道' },
      { date: '11-03 15:00', owner: '王哲', event: 'HR 面试', detail: '表现活跃，沟通顺畅' },
      { date: '11-09 09:15', owner: '内容团队', event: '业务面试', detail: '待评估' },
    ],
    attachments: [
      { name: '简历 - 赵沐.pdf', url: 'https://example.com/resume/mu-zhao.pdf' },
      { name: '短视频作品清单.xlsx', url: 'https://example.com/portfolio/mu-zhao.xlsx' },
    ],
    notes: '可接受长期外派，期望快速成长路径。',
  },
  {
    id: 'cand-005',
    name: 'Grace Li',
    email: 'grace.li@example.com',
    phone: '+86 150 1234 5678',
    position: '语言中心雅思教师',
    source: '拉勾',
    owner: '王哲',
    updatedAt: '2025-11-08 20:40',
    experienceYears: '6 年',
    expectedSalary: '26W / 年',
    currentCompany: '环球教育 · 高级讲师',
    education: '悉尼大学 · 教育学硕士',
    skills: ['雅思口语', '课程研发', '教师培养'],
    resumeUrl: 'https://example.com/resume/grace-li.pdf',
    status: '试讲待评估',
    tags: ['教学总监背景'],
    timeline: [
      { date: '11-02 18:20', owner: '王哲', event: '简历筛选', detail: '通过' },
      { date: '11-05 10:00', owner: 'HR', event: 'HR 面试', detail: '通过' },
      { date: '11-09 10:30', owner: '教学主管', event: '试讲', detail: '待反馈' },
    ],
    attachments: [
      { name: '简历 - Grace Li.pdf', url: 'https://example.com/resume/grace-li.pdf' },
      { name: '试讲教案.pdf', url: 'https://example.com/lesson-plan/grace-li.pdf' },
    ],
    notes: '希望提供教学研究项目参与机会。',
  },
];

const now = new Date();

export const INTERVIEW_SCHEDULE: InterviewScheduleItem[] = [
  {
    id: 'interview-001',
    candidate: '王臻',
    position: '资深留学顾问',
    stage: '第二轮 · 专业面',
    scheduledAt: formatDateTime(addHours(now, 6)),
    endAt: formatDateTime(addHours(now, 7)),
    timezone: 'Asia/Shanghai',
    interviewers: ['李骁 · 咨询总监', '赵一宁 · 北美导师'],
    location: 'Zoom 线上会议',
    meetingLink: 'https://zoom.us/j/123456789',
    status: '待开始',
    attachments: ['面试题库.pdf'],
  },
  {
    id: 'interview-002',
    candidate: 'Grace Li',
    position: '语言中心雅思教师',
    stage: '试讲体验',
    scheduledAt: formatDateTime(addDays(now, 1)),
    endAt: formatDateTime(addDays(addHours(now, 1.5), 1)),
    timezone: 'Asia/Shanghai',
    interviewers: ['孙洋 · 教学主管', '学员代表 · Kelly'],
    location: '广州天河校区 305 教室',
    status: '待开始',
  },
  {
    id: 'interview-003',
    candidate: '李安雅',
    position: '资深留学顾问',
    stage: 'HR 面试',
    scheduledAt: formatDateTime(addHours(now, -2)),
    endAt: formatDateTime(addHours(now, -1)),
    timezone: 'Asia/Shanghai',
    interviewers: ['王哲 · 招聘专员'],
    location: 'Teams 线上',
    status: '已完成',
  },
  {
    id: 'interview-004',
    candidate: 'Samuel Wong',
    position: '资深留学顾问',
    stage: 'Offer 洽谈',
    scheduledAt: formatDateTime(addDays(now, 2)),
    endAt: formatDateTime(addDays(addHours(now, 1), 2)),
    timezone: 'Asia/Shanghai',
    interviewers: ['陈璐 · HRBP'],
    location: '电话会议',
    status: '待开始',
  },
];

export const OFFER_DECISIONS: OfferDecisionItem[] = [
  {
    id: 'decision-001',
    candidate: '王臻',
    position: '资深留学顾问',
    stage: '待决策',
    interviewers: ['李骁', '赵一宁'],
    score: 88,
    recommendation: '录用',
    nextAction: '准备薪资方案 & 发起 Offer 审批',
    deadline: formatDateTime(addDays(now, 1)),
  },
  {
    id: 'decision-002',
    candidate: 'Grace Li',
    position: '语言中心雅思教师',
    stage: '试讲评估',
    interviewers: ['孙洋', '课程负责人'],
    score: 79,
    recommendation: '备选',
    nextAction: '等待试讲录屏反馈',
    deadline: formatDateTime(addDays(now, 2)),
  },
  {
    id: 'decision-003',
    candidate: '李安雅',
    position: '资深留学顾问',
    stage: 'HR面后的跟进',
    interviewers: ['王哲'],
    score: 73,
    recommendation: '拒绝',
    nextAction: '发送感谢邮件并同步内推人',
    deadline: formatDateTime(addDays(now, 0)),
  },
];

export const REPORT_METRICS: RecruitingReportMetric[] = [
  {
    id: 'metric-01',
    title: '开放职位',
    value: '8',
    trend: '环比 +2',
    description: '其中 3 个为高优先级岗位',
  },
  {
    id: 'metric-02',
    title: '月度 Offer 接受率',
    value: '83%',
    change: '+5% vs 上月',
    description: '优化薪资方案后提升',
  },
  {
    id: 'metric-03',
    title: '平均招聘周期',
    value: '27 天',
    trend: '目标：≤ 25 天',
    description: '市场内容运营岗位耗时较长',
  },
  {
    id: 'metric-04',
    title: '渠道贡献 Top3',
    value: '内推 / 猎头 / Boss 直聘',
    description: '内推面试通过率 42%',
  },
];

export const REPORT_INSIGHTS: RecruitingReportInsight[] = [
  {
    id: 'insight-01',
    title: '英语教研岗候选人供给紧张',
    impact: '高',
    detail: '同类职位市场竞争激烈，建议加大内推奖励与猎头合作。',
    owner: '刘昊',
    updatedAt: '2025-11-08',
  },
  {
    id: 'insight-02',
    title: '面试官反馈延迟',
    impact: '中',
    detail: '本周有 4 场面试反馈超过 24 小时提交，影响决策速度。',
    owner: '王哲',
    updatedAt: '2025-11-07',
  },
  {
    id: 'insight-03',
    title: 'Offer 被拒主要原因',
    impact: '中',
    detail: '薪资竞争力不足占 60%，建议收集市场薪资数据并调整预算。',
    owner: '陈璐',
    updatedAt: '2025-11-05',
  },
];


