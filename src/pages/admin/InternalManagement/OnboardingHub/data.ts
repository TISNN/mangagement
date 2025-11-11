import { addDays, format } from 'date-fns';

export interface ProcessTemplate {
  id: string;
  name: string;
  type: '入职' | '离职';
  applicableRoles: string[];
  applicableLocations: string[];
  lastUpdated: string;
  version: string;
  steps: Array<{
    id: string;
    title: string;
    ownerRole: string;
    description: string;
    durationHours: number;
  }>;
  status: '启用' | '草稿' | '停用';
}

export interface OnboardingCase {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  startDate: string;
  buddy: string;
  owner: string;
  progress: number;
  status: '准备中' | '进行中' | '即将入职';
  checklist: Array<{
    id: string;
    title: string;
    owner: string;
    dueAt: string;
    status: '待处理' | '进行中' | '已完成';
  }>;
}

export interface TrialReviewItem {
  id: string;
  employee: string;
  position: string;
  probationEnd: string;
  mentor: string;
  status: '待自评' | '待主管评估' | '待 HR 审核' | '已转正';
  objectives: Array<{
    id: string;
    title: string;
    weight: number;
    progress: number;
    owner: string;
  }>;
}

export interface OffboardingCase {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  lastWorkDay: string;
  reason: string;
  handoverOwner: string;
  progress: number;
  status: '办理中' | '等待交接' | '已完成';
  checklist: Array<{
    id: string;
    title: string;
    owner: string;
    dueAt: string;
    status: '待处理' | '进行中' | '已完成';
  }>;
}

export interface DocumentItem {
  id: string;
  employeeName: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  signed: boolean;
  signedAt?: string;
  owner: string;
  notes?: string;
}

export interface ReportMetric {
  id: string;
  title: string;
  value: string;
  trend?: string;
  change?: string;
  description?: string;
}

export interface ReportRecord {
  id: string;
  title: string;
  period: string;
  generatedBy: string;
  generatedAt: string;
  fileUrl: string;
  type: '入职' | '离职';
}

const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

export const PROCESS_TEMPLATES: ProcessTemplate[] = [
  {
    id: 'tpl-onboard-mentor',
    name: '导师入职（总部）',
    type: '入职',
    applicableRoles: ['导师', '顾问'],
    applicableLocations: ['北京总部', '上海', '远程'],
    lastUpdated: '2025-10-28',
    version: 'v3.2',
    status: '启用',
    steps: [
      { id: 'step-01', title: '合同发起与电子签署', ownerRole: 'HR', description: '发送 Offer 与三方协议，需 48 小时内完成签署', durationHours: 48 },
      { id: 'step-02', title: 'IT 账号与系统权限', ownerRole: 'IT', description: '企业邮箱、CRM、排班系统、知识库开通', durationHours: 24 },
      { id: 'step-03', title: 'Buddy 分配与欢迎邮件', ownerRole: 'HR', description: '指定 Buddy 并发送入职欢迎包', durationHours: 12 },
      { id: 'step-04', title: '岗前培训安排', ownerRole: '部门主管', description: '安排行业培训、产品培训、流程培训', durationHours: 72 },
    ],
  },
  {
    id: 'tpl-onboard-ops',
    name: '运营岗位入职（分校）',
    type: '入职',
    applicableRoles: ['运营', '行政'],
    applicableLocations: ['广州分校', '深圳分校'],
    lastUpdated: '2025-11-05',
    version: 'v1.6',
    status: '启用',
    steps: [
      { id: 'step-01', title: '背景核查与资料收集', ownerRole: 'HR', description: '身份证、学历、无犯罪记录等', durationHours: 24 },
      { id: 'step-02', title: '教务系统权限申请', ownerRole: 'IT', description: '教务管理系统、排课工具开通', durationHours: 24 },
      { id: 'step-03', title: '分校行政对接', ownerRole: '行政', description: '办公位置、物品发放、门禁录入', durationHours: 24 },
    ],
  },
  {
    id: 'tpl-offboard-standard',
    name: '标准离职流程',
    type: '离职',
    applicableRoles: ['全体岗位'],
    applicableLocations: ['全部'],
    lastUpdated: '2025-11-02',
    version: 'v2.1',
    status: '启用',
    steps: [
      { id: 'step-01', title: '离职审批与原因确认', ownerRole: 'HR', description: '收集离职原因，完成审批表单', durationHours: 24 },
      { id: 'step-02', title: '项目与客户交接', ownerRole: '部门主管', description: '交接当前在管项目、学生、客户', durationHours: 48 },
      { id: 'step-03', title: '资产回收与账号注销', ownerRole: 'IT/行政', description: '收回设备、门禁、停用账号', durationHours: 24 },
      { id: 'step-04', title: '离职面谈与满意度调查', ownerRole: 'HR', description: '完成离职访谈与调查问卷', durationHours: 12 },
    ],
  },
];

export const ONBOARDING_CASES: OnboardingCase[] = [
  {
    id: 'onboard-2025-001',
    employeeName: '林宸',
    position: '资深留学顾问',
    department: '北美咨询组',
    startDate: formatDate(addDays(new Date(), 3)),
    buddy: '赵一宁',
    owner: '陈璐 · HRBP',
    progress: 65,
    status: '进行中',
    checklist: [
      { id: 'task-01', title: 'Offer 签署与资料上传', owner: '林宸', dueAt: formatDate(addDays(new Date(), 1)), status: '已完成' },
      { id: 'task-02', title: '账号与系统开通', owner: 'IT-王猛', dueAt: formatDate(addDays(new Date(), 2)), status: '进行中' },
      { id: 'task-03', title: 'Buddy 对接与文化介绍', owner: '赵一宁', dueAt: formatDate(addDays(new Date(), 3)), status: '待处理' },
      { id: 'task-04', title: '业务流程培训', owner: '部门主管-李骁', dueAt: formatDate(addDays(new Date(), 5)), status: '待处理' },
    ],
  },
  {
    id: 'onboard-2025-002',
    employeeName: 'Grace Li',
    position: '雅思教师',
    department: '语言中心',
    startDate: formatDate(addDays(new Date(), 5)),
    buddy: '孙洋',
    owner: '王哲 · HR',
    progress: 35,
    status: '准备中',
    checklist: [
      { id: 'task-01', title: '背景调查', owner: 'HR-王哲', dueAt: formatDate(addDays(new Date(), 1)), status: '进行中' },
      { id: 'task-02', title: '排课系统开通', owner: 'IT-周宁', dueAt: formatDate(addDays(new Date(), 2)), status: '待处理' },
      { id: 'task-03', title: '教案提交', owner: 'Grace Li', dueAt: formatDate(addDays(new Date(), 3)), status: '待处理' },
    ],
  },
];

export const TRIAL_REVIEWS: TrialReviewItem[] = [
  {
    id: 'trial-001',
    employee: '李晓彤',
    position: '市场内容运营',
    probationEnd: formatDate(addDays(new Date(), 15)),
    mentor: '赵芷若',
    status: '待主管评估',
    objectives: [
      { id: 'obj-01', title: '完成 3 个留学主题短视频项目', weight: 40, progress: 80, owner: '李晓彤' },
      { id: 'obj-02', title: '搭建内容数据看板并输出周报', weight: 30, progress: 70, owner: '李晓彤' },
      { id: 'obj-03', title: '完成两次培训分享', weight: 30, progress: 60, owner: '李晓彤' },
    ],
  },
  {
    id: 'trial-002',
    employee: '吴思源',
    position: '在线教务专员',
    probationEnd: formatDate(addDays(new Date(), 30)),
    mentor: '周怡',
    status: '待自评',
    objectives: [
      { id: 'obj-01', title: '独立跟进 20 个学生排课需求', weight: 50, progress: 50, owner: '吴思源' },
      { id: 'obj-02', title: '优化排课流程并提交 SOP', weight: 30, progress: 30, owner: '吴思源' },
      { id: 'obj-03', title: '完成服务满意度回访 10 次', weight: 20, progress: 40, owner: '吴思源' },
    ],
  },
];

export const OFFBOARDING_CASES: OffboardingCase[] = [
  {
    id: 'offboard-2025-001',
    employeeName: '陈亮',
    position: '资深文案顾问',
    department: '文书团队',
    lastWorkDay: formatDate(addDays(new Date(), 7)),
    reason: '个人职业规划',
    handoverOwner: '李娅 · 组长',
    progress: 55,
    status: '办理中',
    checklist: [
      { id: 'handover-01', title: '项目交接清单提交', owner: '陈亮', dueAt: formatDate(addDays(new Date(), 3)), status: '进行中' },
      { id: 'handover-02', title: '客户接洽同步', owner: '李娅', dueAt: formatDate(addDays(new Date(), 4)), status: '待处理' },
      { id: 'handover-03', title: '账号注销及资料备份', owner: 'IT-王猛', dueAt: formatDate(addDays(new Date(), 5)), status: '待处理' },
      { id: 'handover-04', title: '离职访谈', owner: 'HR-陈璐', dueAt: formatDate(addDays(new Date(), 6)), status: '待处理' },
    ],
  },
  {
    id: 'offboard-2025-002',
    employeeName: '刘源',
    position: '运营协调员',
    department: '教务运营部',
    lastWorkDay: formatDate(addDays(new Date(), 2)),
    reason: '家庭原因',
    handoverOwner: '周怡 · 主管',
    progress: 80,
    status: '等待交接',
    checklist: [
      { id: 'handover-01', title: '排班文档整理', owner: '刘源', dueAt: formatDate(addDays(new Date(), 1)), status: '已完成' },
      { id: 'handover-02', title: '资产归还确认', owner: '行政-赵浩', dueAt: formatDate(addDays(new Date(), 1)), status: '已完成' },
      { id: 'handover-03', title: '薪资结算确认', owner: '财务-王倩', dueAt: formatDate(addDays(new Date(), 2)), status: '进行中' },
    ],
  },
];

export const DOCUMENT_ITEMS: DocumentItem[] = [
  {
    id: 'doc-001',
    employeeName: '林宸',
    documentType: '劳动合同',
    fileName: '林宸-劳动合同.pdf',
    fileUrl: 'https://example.com/docs/contract-linchen.pdf',
    signed: true,
    signedAt: formatDate(addDays(new Date(), -1)),
    owner: 'HR-陈璐',
  },
  {
    id: 'doc-002',
    employeeName: 'Grace Li',
    documentType: 'Offer Letter',
    fileName: 'Grace-Li-Offer.pdf',
    fileUrl: 'https://example.com/docs/offer-grace-li.pdf',
    signed: false,
    owner: 'HR-王哲',
    notes: '待候选人确认入职日期后发送正式合同',
  },
  {
    id: 'doc-003',
    employeeName: '陈亮',
    documentType: '离职申请表',
    fileName: '陈亮-离职申请.pdf',
    fileUrl: 'https://example.com/docs/offboard-chenliang.pdf',
    signed: true,
    signedAt: formatDate(addDays(new Date(), -2)),
    owner: 'HR-陈璐',
    notes: '需存档于2025年离职记录文件夹',
  },
];

export const REPORT_METRICS: ReportMetric[] = [
  {
    id: 'report-metric-01',
    title: '本月入职完成率',
    value: '92%',
    trend: '目标 ≥ 90%',
    description: '3 个入职流程因资料补充延迟，已提醒 HR 跟进。',
  },
  {
    id: 'report-metric-02',
    title: '平均入职准备周期',
    value: '7.8 天',
    change: '-0.6 天 vs 上月',
    description: '导师入职模板优化后，IT 开账号效率提升。',
  },
  {
    id: 'report-metric-03',
    title: '离职交接准点率',
    value: '88%',
    trend: '目标 ≥ 95%',
    description: '资产归还环节存在延迟，需要行政团队加强跟进。',
  },
  {
    id: 'report-metric-04',
    title: '转正通过率',
    value: '86%',
    change: '+4% vs 上季度',
    description: '市场团队试用期辅导计划生效，减少离职率。',
  },
];

export const REPORT_RECORDS: ReportRecord[] = [
  {
    id: 'report-2025-10-onboard',
    title: '10 月入职流程报表',
    period: '2025-10-01 ~ 2025-10-31',
    generatedBy: '陈璐 · HRBP',
    generatedAt: '2025-11-01 09:30',
    fileUrl: 'https://example.com/reports/onboarding-2025-10.pdf',
    type: '入职',
  },
  {
    id: 'report-2025-10-offboard',
    title: '10 月离职交接明细',
    period: '2025-10-01 ~ 2025-10-31',
    generatedBy: '王哲 · HR',
    generatedAt: '2025-11-01 10:15',
    fileUrl: 'https://example.com/reports/offboarding-2025-10.xlsx',
    type: '离职',
  },
  {
    id: 'report-2025-09-trial',
    title: 'Q3 试用期评估结果',
    period: '2025-Q3',
    generatedBy: 'HRBP 团队',
    generatedAt: '2025-10-05 14:20',
    fileUrl: 'https://example.com/reports/trial-2025-q3.pdf',
    type: '入职',
  },
];


