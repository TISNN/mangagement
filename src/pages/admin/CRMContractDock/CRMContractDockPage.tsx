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
  Globe2,
  NotebookPen,
  Receipt,
  ShieldAlert,
  Sparkles,
  Wallet,
  Workflow,
  X,
} from 'lucide-react';

import TemplateLibraryModal, {
  TemplateCategory as TemplateLibraryCategory,
  TemplateItem as TemplateLibraryItem,
} from '../../../components/knowledge/TemplateLibraryModal';

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

interface ContractListItem {
  id: string;
  code: string;
  customer: string;
  product: string;
  amount: string;
  stage: ContractCard['stage'];
  owner: string;
  createdAt: string;
  updatedAt: string;
  paymentProgress: string;
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

interface ContractTemplateCard {
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

interface SectionNav {
  id: 'overview' | 'execution' | 'templates' | 'governance';
  label: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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

const CONTRACT_LIST: ContractListItem[] = [
  {
    id: 'contract-list-001',
    code: 'CRM-2025-1101',
    customer: '李沐阳家庭',
    product: '北美 CS 全程服务',
    amount: '¥ 198,000',
    stage: '审批中',
    owner: '丁若楠',
    createdAt: '2025-11-06',
    updatedAt: '2025-11-09',
    paymentProgress: '定金已收 · 阶段款待收',
    risk: 'warning',
  },
  {
    id: 'contract-list-002',
    code: 'CRM-2025-1098',
    customer: '陈奕辰',
    product: '英国商科 VIP 服务',
    amount: '¥ 168,000',
    stage: '签署中',
    owner: '赵婧怡',
    createdAt: '2025-11-05',
    updatedAt: '2025-11-09',
    paymentProgress: '签署完成后一次性收款',
  },
  {
    id: 'contract-list-003',
    code: 'CRM-2025-1083',
    customer: '王鑫',
    product: '加拿大 EE 快速通道',
    amount: '¥ 152,000',
    stage: '已签署',
    owner: '王磊',
    createdAt: '2025-10-28',
    updatedAt: '2025-11-08',
    paymentProgress: '定金&阶段款已收 · 尾款 2026-03-01',
  },
  {
    id: 'contract-list-004',
    code: 'CRM-2025-1107',
    customer: '周昕怡',
    product: '澳洲研究生全程服务',
    amount: '¥ 132,000',
    stage: '草稿',
    owner: '朱乐言',
    createdAt: '2025-11-08',
    updatedAt: '2025-11-09',
    paymentProgress: '草稿阶段 · 待提交审批',
  },
  {
    id: 'contract-list-005',
    code: 'CRM-2025-1059',
    customer: '林泊言',
    product: '新加坡 SMU 申请 VIP',
    amount: '¥ 188,000',
    stage: '变更',
    owner: '郭霖',
    createdAt: '2025-10-12',
    updatedAt: '2025-11-07',
    paymentProgress: '变更审批中 · 待确认付款计划',
    risk: 'warning',
  },
  {
    id: 'contract-list-006',
    code: 'CRM-2025-1042',
    customer: '郭子涵',
    product: '托福保分计划',
    amount: '¥ 58,000',
    stage: '退款',
    owner: '宋知远',
    createdAt: '2025-09-30',
    updatedAt: '2025-11-05',
    paymentProgress: '退款审批中 · 财务待处理',
    risk: 'alert',
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

const CONTRACT_TEMPLATES: ContractTemplateCard[] = [
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

const SECTION_NAV: SectionNav[] = [
  {
    id: 'overview',
    label: '概览仪表盘',
    description: '指标、状态与总体趋势',
    icon: BarChart3,
  },
  {
    id: 'execution',
    label: '合同执行',
    description: '流程推进、合同列表与收款',
    icon: FolderKanban,
  },
  {
    id: 'templates',
    label: '模板与配置',
    description: '模板库、版本维护与快速应用',
    icon: NotebookPen,
  },
  {
    id: 'governance',
    label: '法律与风控',
    description: '风险预警与法律顾问支持',
    icon: ShieldAlert,
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

const TEMPLATE_TYPE_STYLES: Record<ContractTemplateCard['type'], string> = {
  免费: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  付费: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
};

const CONTRACT_TEMPLATE_LIBRARY_ITEMS: TemplateLibraryItem[] = [
  {
    id: 'contract-template-001',
    categoryId: 'baseline',
    categoryLabel: '标准合同',
    title: '北美 CS 全程服务主合同',
    description: '涵盖顾问配置、服务阶段、违约责任与知识产权条款，适用于本科/硕士全程服务。',
    usage: '2.3k',
    tags: ['电子签', '中文', '标准条款'],
    updatedAt: '更新·2025-10-30',
  },
  {
    id: 'contract-template-002',
    categoryId: 'baseline',
    categoryLabel: '标准合同',
    title: '英国商科 VIP 服务合同',
    description: '覆盖院校优先级承诺、背景提升包、保底院校保障，支持中英双语签署。',
    usage: '1.7k',
    tags: ['双语', 'VIP', '服务保障'],
    updatedAt: '更新·2025-09-18',
  },
  {
    id: 'contract-template-003',
    categoryId: 'premium',
    categoryLabel: '增值服务',
    title: '托福保分计划补充协议',
    description: '适配保分班课程，支持保分承诺、退款条件与补课安排条款。',
    usage: '980',
    tags: ['补充协议', '语言课程'],
    updatedAt: '更新·2025-10-12',
  },
  {
    id: 'contract-template-004',
    categoryId: 'international',
    categoryLabel: '国际签约',
    title: '加拿大快速通道移民服务协议',
    description: '结合签证、移民流程，细化政府材料责任、时间节点与风险说明。',
    usage: '1.1k',
    tags: ['移民服务', '分期付款'],
    updatedAt: '更新·2025-08-05',
  },
  {
    id: 'contract-template-005',
    categoryId: 'supplement',
    categoryLabel: '补充协议',
    title: '服务延展补充协议模版',
    description: '适用于客户延期或增购服务场景，包含服务延展费用和延期责任条款。',
    usage: '640',
    tags: ['延期', '增购', '条款补充'],
    updatedAt: '更新·2025-07-22',
  },
  {
    id: 'contract-template-006',
    categoryId: 'finance',
    categoryLabel: '收款与发票',
    title: '分期付款计划+发票约定模版',
    description: '拆解定金、阶段款、尾款的金额、节点与违约责任，附发票开具说明。',
    usage: '1.5k',
    tags: ['付款计划', '发票管理'],
    updatedAt: '更新·2025-09-02',
  },
  {
    id: 'contract-template-007',
    categoryId: 'risk',
    categoryLabel: '风控条款',
    title: '高折扣审批专项模板',
    description: '针对折扣超标的审批合同，加入审批记录、折扣原因与利润评估表格。',
    usage: '420',
    tags: ['折扣审批', '风控'],
    updatedAt: '更新·2025-10-18',
  },
  {
    id: 'contract-template-008',
    categoryId: 'international',
    categoryLabel: '国际签约',
    title: '多国联合签约双语合同',
    description: '覆盖英美澳多国组合项目，支持多币种报价与不同税务要求。',
    usage: '530',
    tags: ['多币种', '双语'],
    updatedAt: '更新·2025-09-26',
  },
];

const CONTRACT_TEMPLATE_LIBRARY_CATEGORIES: TemplateLibraryCategory[] = [
  { id: 'baseline', name: '标准合同', icon: FileText, count: 0 },
  { id: 'premium', name: '增值服务', icon: Sparkles, count: 0 },
  { id: 'international', name: '国际签约', icon: Globe2, count: 0 },
  { id: 'supplement', name: '补充协议', icon: NotebookPen, count: 0 },
  { id: 'finance', name: '收款与发票', icon: Receipt, count: 0 },
  { id: 'risk', name: '风控条款', icon: ShieldAlert, count: 0 },
].map((category) => ({
  ...category,
  count: CONTRACT_TEMPLATE_LIBRARY_ITEMS.filter((item) => item.categoryId === category.id).length,
}));

const LegalConsultModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur">
      <div className="relative flex h-[80vh] w-[92vw] max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">法律顾问与合规支持</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              快速预约律所顾问、查看风险指引与合规模板，保障合同签约安全可靠。
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              智能条款建议
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:text-rose-300">
              <ShieldAlert className="h-4 w-4" />
              快速风险评估
            </button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 lg:flex-row">
          <div className="w-full space-y-4 lg:w-1/3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">顾问预约</h4>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                选择法律领域与期望时间，系统将匹配合作律所的专业律师并发送确认邮件。
              </p>
              <form className="mt-3 space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <label className="block">
                  <span className="mb-1 inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">法律领域</span>
                  <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40">
                    <option>合同条款审核</option>
                    <option>跨境签约合规</option>
                    <option>退款与纠纷处理</option>
                    <option>知识产权与隐私</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">期望时间</span>
                  <input
                    type="datetime-local"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">合同编号 / 场景说明</span>
                  <textarea
                    rows={4}
                    placeholder="简要说明待审合同的核心条款、风险点或诉求……"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                  />
                </label>
                <button type="button" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700">
                  <NotebookPen className="h-4 w-4" />
                  提交预约申请
                </button>
              </form>
            </div>
          </div>

          <div className="w-full space-y-4 lg:w-2/3">
            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">常用法律指引</h4>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">结合最新签约风险提示，快速查看条款建议与应对策略。</p>
              <div className="mt-4 space-y-3">
                {LEGAL_GUIDES.map((guide) => (
                  <div key={`legal-modal-${guide.id}`} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{guide.title}</div>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{guide.summary}</p>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">响应：{guide.responseTime}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-indigo-500 dark:text-indigo-300">
                      {guide.tags.map((tag) => (
                        <span key={`${guide.id}-${tag}`} className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 dark:bg-indigo-900/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                      <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                        <NotebookPen className="h-3.5 w-3.5" />
                        获取标准条款
                      </button>
                      <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        生成风险提示
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">最新合规快讯</h4>
              <ul className="mt-3 space-y-3 text-xs text-slate-500 dark:text-slate-400">
                <li className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">《未成年人个人信息保护条例》修订</div>
                  <p className="mt-1 leading-5">线上合同需补充监护人知情同意条款，建议同步更新隐私附件。</p>
                </li>
                <li className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">跨境线上签约合规提醒</div>
                  <p className="mt-1 leading-5">建议新增境外电子签存证说明，并核验合作院校电子认证方式。</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
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

const OverviewSection: React.FC = () => (
  <div className="space-y-6">
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

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">合同状态分布</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">实时了解不同阶段合同数量与处理用时。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500" type="button">
            <Filter className="h-3.5 w-3.5" /> 设置指标
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500" type="button">
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
  </div>
);

const ExecutionSection: React.FC = () => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">合同看板</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">查看关键合同在审批、签署与收款中的实时状态。</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
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
                <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                  <ArrowRight className="h-3.5 w-3.5" /> 查看详情
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">合同列表</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">支持按编号、阶段、负责人快速检索重点合同。</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500" type="button">
            <Filter className="h-3.5 w-3.5" /> 筛选
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">
            <tr>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">合同编号</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">客户 / 产品</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">金额</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">负责人</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">阶段</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">最新进展</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-semibold">更新时间</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {CONTRACT_LIST.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">
                  <div className="font-medium">{item.code}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">创建 {item.createdAt}</div>
                </td>
                <td className="min-w-[200px] px-4 py-3 text-gray-900 dark:text-white">
                  <div className="font-medium">{item.customer}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.product}</div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{item.amount}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{item.owner}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageAccent(item.stage)}`}>
                    {item.stage}
                  </span>
                </td>
                <td className="min-w-[220px] px-4 py-3 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    {item.risk && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          item.risk === 'alert'
                            ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {item.risk === 'alert' ? '风险' : '关注'}
                      </span>
                    )}
                    <span>{item.paymentProgress}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{item.updatedAt}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                    <ArrowRight className="h-3.5 w-3.5" /> 查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">审批流程</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">可视化审批节点，支持多级配置与实时状态。</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">收款与发票</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">跟踪付款计划、发票开具与逾期提醒。</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500" type="button">
              <ClipboardList className="h-3.5 w-3.5" /> 编辑付款计划
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:hover:border-blue-500" type="button">
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
    </div>
  </div>
);

const TemplateSection: React.FC = () => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">模板库</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">标准化合同模板，提高签约效率与合规性。</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
          <Sparkles className="h-3.5 w-3.5" /> 模板市场
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {CONTRACT_TEMPLATES.map((template) => (
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
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                <FileText className="h-3.5 w-3.5" /> 预览
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                <Download className="h-3.5 w-3.5" /> 下载
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-600 hover:bg-blue-100 dark:border-blue-500/60 dark:bg-blue-900/20 dark:text-blue-300" type="button">
                <Sparkles className="h-3.5 w-3.5" /> 立即使用
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GovernanceSection: React.FC = () => (
  <div className="space-y-6">
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">风险预警</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">及时发现并处理潜在风险，保障合同质量与合规。</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
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

    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">法律指导与顾问服务</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">提供合同审查、条款指引、律师顾问预约等专业支持，解决复杂法律问题。</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
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
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                <NotebookPen className="h-3.5 w-3.5" /> 填写需求
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300" type="button">
                <ShieldAlert className="h-3.5 w-3.5" /> 提交法律 Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CRMContractDockPage: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState<SectionNav['id']>('overview');
  const [templateModalOpen, setTemplateModalOpen] = React.useState(false);
  const [legalModalOpen, setLegalModalOpen] = React.useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'execution':
        return <ExecutionSection />;
      case 'templates':
        return <TemplateSection />;
      case 'governance':
        return <GovernanceSection />;
      default:
        return null;
    }
  };

  return (
    <>
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
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
              type="button"
              onClick={() => setTemplateModalOpen(true)}
            >
              <NotebookPen className="h-4 w-4" />
              模板库
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-300"
              type="button"
              onClick={() => setLegalModalOpen(true)}
            >
              <ShieldAlert className="h-4 w-4" />
              法律咨询
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700" type="button">
              <Sparkles className="h-4 w-4" />
              新建合同
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SECTION_NAV.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-gray-800/60 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-500/60 dark:bg-blue-900/10 dark:text-blue-200'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-500'
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{section.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{section.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {renderSection()}
      </div>
      <TemplateLibraryModal
        open={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        categories={CONTRACT_TEMPLATE_LIBRARY_CATEGORIES}
        items={CONTRACT_TEMPLATE_LIBRARY_ITEMS}
        defaultCategoryId="baseline"
      />
      <LegalConsultModal open={legalModalOpen} onClose={() => setLegalModalOpen(false)} />
    </>
  );
};

export default CRMContractDockPage;
