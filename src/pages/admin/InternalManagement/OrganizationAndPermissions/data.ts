import {
  type ApprovalWorkflow,
  type PermissionAuditLog,
  type RoleTemplate,
} from '../types';

export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'rt-mentor',
    name: '导师主管',
    description: '负责导师团队排班、课程质量与家长沟通追踪，具备高权限的排班和绩效访问能力。',
    permissions: ['排班管理', '教学质量报告', '家长沟通记录', '导师绩效看板'],
    memberCount: 6,
    lastUpdated: '2025-10-22',
    owners: ['周语'],
  },
  {
    id: 'rt-advisor',
    name: '高级顾问',
    description: '针对核心学员提供服务，需访问申请资料、合同价格，同时具备流程审批能力。',
    permissions: ['学生档案', '申请材料', '合同价格查看', '流程审批'],
    memberCount: 18,
    lastUpdated: '2025-11-02',
    owners: ['李承'],
  },
  {
    id: 'rt-finance',
    name: '财务稽核',
    description: '核对合同回款、结算导师课时费，监控财务合规，具备高敏权限，启用双重审批。',
    permissions: ['合同回款', '发票管理', '导师结算', '系统日志导出'],
    memberCount: 4,
    lastUpdated: '2025-10-30',
    owners: ['陈冉', '合规团队'],
    critical: true,
  },
  {
    id: 'rt-ops',
    name: '运营配置',
    description: '维护站点内容、通知模板，与市场渠道对接，主要关注配置与监控能力。',
    permissions: ['站点配置', '通知模板', '营销渠道同步', '数据看板只读'],
    memberCount: 9,
    lastUpdated: '2025-11-06',
    owners: ['运营中心'],
  },
];

export const APPROVAL_WORKFLOWS: ApprovalWorkflow[] = [
  {
    id: 'wf-contract-pricing',
    name: '合同价格调整',
    scenario: '线索转成交阶段申请临时优惠时触发',
    steps: [
      { id: 's1', role: '城市负责人', slaHours: 8, action: '审核优惠原因' },
      { id: 's2', role: '财务稽核', slaHours: 12, action: '校验利润率 & 回款计划' },
      { id: 's3', role: '合规专员', slaHours: 6, action: '同步合同条款调整' },
    ],
    autoRevokeHours: 48,
    lastOptimized: '2025-10-13',
  },
  {
    id: 'wf-access',
    name: '敏感权限开通',
    scenario: '成员申请查看合同价格、导出数据等敏感操作权限',
    steps: [
      { id: 's1', role: '直属上级', slaHours: 4, action: '确认职责匹配' },
      { id: 's2', role: '数据安全官', slaHours: 8, action: '记录原因 & 设置到期时间' },
    ],
    autoRevokeHours: 72,
    lastOptimized: '2025-09-28',
  },
  {
    id: 'wf-external',
    name: '外部合作账号接入',
    scenario: '新增招生渠道或供应商账号时触发',
    steps: [
      { id: 's1', role: '运营配置', slaHours: 12, action: '验证合作资质 & 账号类型' },
      { id: 's2', role: '安全管理员', slaHours: 6, action: '配置访问控制 & 日志采集' },
      { id: 's3', role: 'IT 运维', slaHours: 12, action: '部署监控 & 联调' },
    ],
    lastOptimized: '2025-11-03',
  },
];

export const PERMISSION_AUDIT_LOGS: PermissionAuditLog[] = [
  {
    id: 'log-01',
    user: '王晓',
    action: '发起敏感权限申请',
    detail: '申请查看《FY2025 合同价格表》',
    createdAt: '2025-11-07 09:12',
    riskLevel: '中',
  },
  {
    id: 'log-02',
    user: '审批机器人',
    action: '自动撤销权限',
    detail: '张敏 72 小时未使用「合同导出」权限，已自动收回',
    createdAt: '2025-11-06 19:45',
    riskLevel: '低',
  },
  {
    id: 'log-03',
    user: '陈冉',
    action: '更新角色模板',
    detail: '财务稽核角色新增「导师结算审批」权限',
    createdAt: '2025-11-05 11:03',
    riskLevel: '高',
  },
  {
    id: 'log-04',
    user: '系统监控',
    action: '异常访问告警',
    detail: '顾问李峰 1 小时内导出 5 份合同报价，触发异常阈值',
    createdAt: '2025-11-04 21:18',
    riskLevel: '高',
  },
];

