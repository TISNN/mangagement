import type {
  ComplianceCaseLog,
  ComplianceRisk,
  PolicyUpdate,
} from '../types';

export const COMPLIANCE_RISKS: ComplianceRisk[] = [
  {
    id: 'risk-01',
    title: '合同模板缺少退款条款更新',
    area: '招生合同',
    level: '高',
    owner: '法务部',
    dueDate: '2025-11-12',
    status: '处理中',
    tags: ['合同', '退款', '家长端'],
  },
  {
    id: 'risk-02',
    title: '英国签证政策解析需补充',
    area: '签证指导',
    level: '中',
    owner: '合规专员 李楠',
    dueDate: '2025-11-10',
    status: '待确认',
    tags: ['政策', '英国', '签证'],
  },
  {
    id: 'risk-03',
    title: '数据脱敏导出流程未生效',
    area: '数据安全',
    level: '严重',
    owner: '数据安全组',
    dueDate: '2025-11-09',
    status: '处理中',
    tags: ['数据', '导出', '审计'],
  },
  {
    id: 'risk-04',
    title: '导师兼职合规检查',
    area: '人事与排班',
    level: '低',
    owner: 'HR 团队',
    dueDate: '2025-11-20',
    status: '待确认',
    tags: ['导师', '兼职', '合同'],
  },
];

export const POLICY_UPDATES: PolicyUpdate[] = [
  {
    id: 'policy-01',
    title: '英国高潜力人才签证（HPI）资格更新',
    source: 'UKVI 官方',
    effectiveDate: '2025-11-15',
    impact: '需更新签证指导模板，并同步给顾问团队及家长。',
    link: '#',
  },
  {
    id: 'policy-02',
    title: '教育行业广告合规指引（征求意见稿）',
    source: '国家市场监管总局',
    effectiveDate: '2025-11-30',
    impact: '需审核现有营销落地页与宣传文案，完成整改后备案。',
    link: '#',
  },
  {
    id: 'policy-03',
    title: '个人信息跨境传输标准合同指引',
    source: '国家网信办',
    effectiveDate: '2025-12-01',
    impact: '梳理现有海外存储节点并补齐跨境备案材料。',
  },
];

export const COMPLIANCE_CASE_LOGS: ComplianceCaseLog[] = [
  {
    id: 'case-01',
    item: '招生活动资料归档',
    description: '检查 10 月线下分享会的资料归档与签字情况，确保符合广告法。',
    createdAt: '2025-11-07',
    assignee: '合规专员 王楠',
    progress: 0.6,
    evidenceRequired: true,
  },
  {
    id: 'case-02',
    item: '合同模板更新复核',
    description: '针对新版合同条款进行法务复核，确认退款条款、责任划分。',
    createdAt: '2025-11-06',
    assignee: '法务部',
    progress: 0.4,
    evidenceRequired: true,
  },
  {
    id: 'case-03',
    item: '数据导出脱敏演练',
    description: '模拟顾问导出学生档案，验证脱敏规则与审计日志记录。',
    createdAt: '2025-11-05',
    assignee: '数据安全组',
    progress: 0.8,
    evidenceRequired: false,
  },
];

