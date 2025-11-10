import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart3,
  CalendarClock,
  ClipboardList,
  Coins,
  Download,
  FileText,
  Filter,
  FolderKanban,
  NotebookPen,
  ShieldAlert,
  Sparkles,
  Wallet,
  Workflow,
} from 'lucide-react';

interface SummaryMetric {
  id: string;
  title: string;
  value: string;
  subLabel: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface StatusDistribution {
  id: string;
  label: string;
  value: number;
  color: string;
  description: string;
}

interface ContractCard {
  id: string;
  customer: string;
  product: string;
  amount: string;
  stage: '草稿' | '审批中' | '签署中' | '已签署' | '变更' | '退款';
  owner: string;
  approvalProgress: string;
  dueDate: string;
  risk?: 'warning' | 'alert';
}

interface PaymentMilestone {
  id: string;
  name: string;
  amount: string;
  due: string;
  status: '待收款' | '已收款' | '逾期';
  invoice?: '未开票' | '开票中' | '已开票';
}

interface ApprovalStep {
  id: string;
  title: string;
  owner: string;
  status: '完成' | '待审批' | '进行中';
  timestamp?: string;
  comment?: string;
}

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  country: string;
  updatedAt: string;
  owner: string;
  tags: string[];
  type: '免费' | '付费';
  price?: string;
}

interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  suggestion: string;
}

const SUMMARY_METRICS: SummaryMetric[] = [
  { id: 'signed-amount', title: '本月签约金额', value: '¥ 6,420,000', subLabel: '目标达成 78%', change: '+18% 环比', trend: 'up' },
  { id: 'conversion', title: '合同签约率', value: '32.4%', subLabel: '线索 → 签约', change: '+2.1% 环比', trend: 'up' },
  { id: 'cycle', title: '平均签约周期', value: '27.4 天', subLabel: '目标 ≤ 25 天', change: '-1.8 天', trend: 'down' },
  { id: 'overdue', title: '逾期收款', value: '¥ 180,000', subLabel: '涉及 3 份合同', change: '-12% 环比', trend: 'down' },
];

const STATUS_DISTRIBUTION: StatusDistribution[] = [
  { id: 'draft', label: '草稿', value: 28, color: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300', description: '待提交' },
  { id: 'approval', label: '审批中', value: 16, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300', description: '平均 1.5 天' },
  { id: 'signing', label: '签署中', value: 9, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300', description: '等待客户签名' },
  { id: 'signed', label: '已签署', value: 64, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300', description: '本月完成' },
  { id: 'changed', label: '变更', value: 6, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300', description: '审批中变更' },
  { id: 'refund', label: '退款', value: 3, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300', description: '退款流程中' },
];

const CONTRACT_PIPELINE: ContractCard[] = [
  {
    id: 'contract-001',
    customer: '李沐阳家庭',
    product: '北美 CS 全程服务',
    amount: '¥ 198,000',
    stage: '审批中',
    owner: '丁若楠',
    approvalProgress: '法务审核中',
    dueDate: '今日 18:00',
    risk: 'warning',
  },
  {
    id: 'contract-002',
    customer: '陈奕辰',
    product: '英国商科 VIP 服务',
    amount: '¥ 168,000',
    stage: '签署中',
    owner: '赵婧怡',
    approvalProgress: '客户签署待完成',
    dueDate: '明日 12:00',
  },
  {
    id: 'contract-003',
    customer: '王鑫',
    product: '加拿大 EE 快速通道',
    amount: '¥ 152,000',
    stage: '已签署',
    owner: '王磊',
    approvalProgress: '收款计划执行中',
    dueDate: '收款节点 11-12',
  },
];

const APPROVAL_STEPS: ApprovalStep[] = [
  { id: 'step-1', title: '销售经理审批', owner: '刘晨', status: '完成', timestamp: '2025-11-07 14:28', comment: '折扣符合标准' },
  { id: 'step-2', title: '法务审核', owner: '周珊', status: '进行中', comment: '税务条款需补充附件' },
  { id: 'step-3', title: '财务校验', owner: '吴浩', status: '待审批' },
  { id: 'step-4', title: '管理层确认', owner: '蒋明', status: '待审批' },
];

const PAYMENT_MILESTONES: PaymentMilestone[] = [
  { id: 'pm-01', name: '定金 30%', amount: '¥ 45,600', due: '2025-11-10', status: '已收款', invoice: '已开票' },
  { id: 'pm-02', name: '阶段款 50%', amount: '¥ 76,000', due: '2025-12-05', status: '待收款', invoice: '未开票' },
  { id: 'pm-03', name: '尾款 20%', amount: '¥ 30,400', due: '2026-03-01', status: '待收款', invoice: '未开票' },
];

const TEMPLATE_ITEMS: TemplateItem[] = [
  {
    id: 'tpl-01',
    name: '北美 CS 全程服务合同 v2.3',
    category: '北美服务',
    country: '美国',
    updatedAt: '2025-10-30',
    owner: '法务部',
    tags: ['中文', '电子签', '默认模板'],
    type: '免费',
  },
  {
    id: 'tpl-02',
    name: '英国商科 VIP 合同 v1.8',
    category: '欧洲服务',
    country: '英国',
    updatedAt: '2025-09-18',
    owner: '法务部',
    tags: ['英文', '奖学金条款'],
    type: '付费',
    price: '¥ 199 / 份',
  },
  {
    id: 'tpl-03',
    name: '加拿大快速通道服务协议 v1.1',
    category: '加拿大',
    country: '加拿大',
    updatedAt: '2025-08-05',
    owner: '法务部',
    tags: ['中文', '移民类'],
    type: '付费',
    price: '¥ 149 / 份',
  },
  {
    id: 'tpl-04',
    name: '托福保分计划补充协议 v1.0',
    category: '增值服务',
    country: '中国',
    updatedAt: '2025-10-12',
    owner: '文书团队',
    tags: ['补充条款', '附加服务'],
    type: '免费',
  },
];

const RISK_ALERTS: RiskAlert[] = [
  {
    id: 'risk-01',
    title: '折扣超标审批',
    description: '丁若楠 - 北美 CS 服务折扣 18%，超过标准 15%，等待管理层审批。',
    severity: 'medium',
    suggestion: '补充折扣原因与预期价值说明。',
  },
  {
    id: 'risk-02',
    title: '签署超时',
    description: '陈奕辰 合同待客户签署已超过 48 小时，需顾问跟进。',
    severity: 'high',
    suggestion: '电话提醒客户，若仍延迟联系家长确认。',
  },
  {
    id: 'risk-03',
    title: '收款逾期',
    description: '加拿大 EE 合同阶段款逾期 6 天，金额 ¥ 28,000。',
    severity: 'high',
    suggestion: '启动催款流程并通知财务。',
  },
];

const trendIcon = (trend: SummaryMetric['trend']) => {
  switch (trend) {
    case 'up':
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    case 'down':
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4 text-gray-400" />;
  }
};

const severityBadge = (severity: RiskAlert['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300';
    case 'medium':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
    default:
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
  }
};

const stageAccent = (stage: ContractCard['stage']) => {
  const map: Record<ContractCard['stage'], string> = {
    草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300',
    审批中: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
    签署中: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
    已签署: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    变更: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    退款: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  };
  return map[stage];
};

const TEMPLATE_TYPE_STYLES: Record<TemplateItem['type'], string> = {
  免费: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  付费: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const LEGAL_GUIDES = [
  {
    id: 'legal-01',
    title: '合同风险提示助手',
    summary: '输入合同条款关键词，系统返回常见风险、法规依据和处置建议。',
    tags: ['合同条款', '风险识别'],
    responseTime: '实时',
  },
  {
    id: 'legal-02',
    title: '律师顾问预约',
    summary: '遇到复杂纠纷或跨境法律问题，可预约合作律所的一对一咨询。',
    tags: ['法律顾问', '跨境'],
    responseTime: '24h 内确认',
  },
  {
    id: 'legal-03',
    title: '标准条款指南库',
    summary: '涵盖退款、违约、隐私、知识产权等常见条款的示例与解释。',
    tags: ['条款模板', '合规指南'],
    responseTime: '持续更新',
  },
];

const CRMContractDockPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">合同与签约中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Contract Dock · CRM Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            全面掌控合同从创建、审批到签署与收款的生命周期，结合模板库、风险监控与自动化提醒，帮助销售、法务与财务协同高效签约。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Filter className="h-4 w-4" />
            保存视图
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            新建合同
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_METRICS.map((metric) => (
          <div key={metric.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{metric.title}</span>
              <BarChart3 className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{metric.subLabel}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {trendIcon(metric.trend)}
              <span
                className={
                  metric.trend === 'up'
                    ? 'text-emerald-600 dark:text-emerald-300'
                    : metric.trend === 'down'
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-gray-500 dark:text-gray-400'
                }
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">合同状态分布</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  实时了解不同阶段合同数量与处理用时。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Filter className="h-3.5 w-3.5" /> 设置指标
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                  <Activity className="h-3.5 w-3.5" /> 历史趋势
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {STATUS_DISTRIBUTION.map((status) => (
                <div key={status.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{status.description}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-white">{status.value}</div>
                    <div className="h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, status.value * 2)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">合同看板</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">查看关键合同在审批、签署与收款中的实时状态。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <FolderKanban className="h-3.5 w-3.5" /> 看板视图
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {CONTRACT_PIPELINE.map((contract) => (
                <div key={contract.id} className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-200 dark:border-gray-700 dark:hover:border-blue-500/50">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{contract.customer}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageAccent(contract.stage)}`}>
                          {contract.stage}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{contract.product}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-1"><BadgeDollarSign className="h-3.5 w-3.5 text-emerald-500" /> {contract.amount}</span>
                        <span className="inline-flex items-center gap-1"><NotebookPen className="h-3.5 w-3.5 text-blue-500" /> {contract.approvalProgress}</span>
                        <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5 text-orange-500" /> {contract.dueDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {contract.risk === 'warning' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                          <AlertTriangle className="h-3.5 w-3.5" /> 关注中
                        </span>
                      )}
                      <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                        <ArrowRight className="h-3.5 w-3.5" /> 查看详情
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">审批流程</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">可视化审批节点，支持多级配置与实时状态。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <Workflow className="h-3.5 w-3.5" /> 编辑流程
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {APPROVAL_STEPS.map((step, index) => (
                <div key={step.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{index + 1}. {step.title}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">责任人：{step.owner}</div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        step.status === '完成'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : step.status === '进行中'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700/60 dark:text-gray-300'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  {step.timestamp && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">时间：{step.timestamp}</div>
                  )}
                  {step.comment && (
                    <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/40 dark:text-gray-300">{step.comment}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">风险预警</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">及时发现并处理潜在风险，保障合同质量与合规。</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                <ShieldAlert className="h-3.5 w-3.5" /> 查看全部
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {RISK_ALERTS.map((alert) => (
                <div key={alert.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{alert.description}</div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityBadge(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{alert.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">模板库</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">标准化合同模板，提高签约效率与合规性。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
              <Sparkles className="h-3.5 w-3.5" /> 模板市场
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {TEMPLATE_ITEMS.map((template) => (
              <div key={template.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{template.name}</div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${TEMPLATE_TYPE_STYLES[template.type]}`}>
                        {template.type}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{template.category} · {template.country}</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">更新 {template.updatedAt} · 维护 {template.owner}</div>
                  </div>
                  {template.price && (
                    <div className="text-right text-sm font-semibold text-indigo-600 dark:text-indigo-300">{template.price}</div>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  {template.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                    <FileText className="h-3.5 w-3.5" /> 预览
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                    <Download className="h-3.5 w-3.5" /> 下载
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-600 hover:bg-blue-100 dark:border-blue-500/60 dark:bg-blue-900/20 dark:text-blue-300">
                    <Sparkles className="h-3.5 w-3.5" /> 立即使用
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">收款与发票</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">跟踪付款计划、发票开具与逾期提醒。</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                <ClipboardList className="h-3.5 w-3.5" /> 编辑付款计划
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500">
                <Coins className="h-3.5 w-3.5" /> 查看收款记录
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {PAYMENT_MILESTONES.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">到期：{item.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold text-emerald-600 dark:text-emerald-300">{item.amount}</div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        item.status === '已收款'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : item.status === '逾期'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" /> 发票状态：{item.invoice ?? '—'}</span>
                  {item.status === '逾期' && (
                    <span className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-300"><AlertTriangle className="h-3.5 w-3.5" /> 已超期，建议催款</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">法律指导与顾问服务</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">提供合同审查、条款指引、律师顾问预约等专业支持，解决复杂法律问题。</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" /> 立即咨询
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {LEGAL_GUIDES.map((guide) => (
            <div key={guide.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/40">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{guide.title}</div>
              <p className="mt-2 text-xs leading-5 text-gray-600 dark:text-gray-300">{guide.summary}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-blue-500 dark:text-blue-300">
                {guide.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 dark:bg-blue-900/30">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">响应时效：{guide.responseTime}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                  <NotebookPen className="h-3.5 w-3.5" /> 填写需求
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300">
                  <ShieldAlert className="h-3.5 w-3.5" /> 提交法律 Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CRMContractDockPage;
