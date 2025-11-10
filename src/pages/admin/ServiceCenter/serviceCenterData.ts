import { BarChart3, Calendar, Clock, FileText, Globe2, MessageCircle, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';

export const METRICS = [
  {
    label: '本月订单',
    value: '48',
    change: '+26%',
    accent: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300',
    description: '较上月提升 10 单',
  },
  {
    label: '累计收入',
    value: '¥ 1.83M',
    change: '+18%',
    accent: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300',
    description: '含 35% 定制项目',
  },
  {
    label: '满意度 (NPS)',
    value: '62',
    change: '+8',
    accent: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
    description: '8/10 客户推荐',
  },
  {
    label: '进行中项目',
    value: '17',
    change: '3 风险',
    accent: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300',
    description: '平均进度 72%',
  },
] as const;

export const PIPELINE_STEPS = [
  { stage: '需求收集', count: 23, conversion: '71%' },
  { stage: '方案报价', count: 15, conversion: '64%' },
  { stage: '合同确认', count: 11, conversion: '82%' },
  { stage: '项目执行', count: 9, conversion: '100%' },
] as const;

export const KEY_INSIGHTS = [
  {
    title: '客户 SLA',
    description: '平均响应 9.6 小时 · 目标 12 小时内',
    icon: Clock,
  },
  {
    title: '合同审批',
    description: '3 份待法务确认 · 1 份待财务盖章',
    icon: FileText,
  },
  {
    title: 'AI 推荐',
    description: '为 12 家机构推荐组合服务包',
    icon: TrendingUp,
  },
] as const;

export const SERVICE_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Website Starter',
    category: '数字化建设',
    outline: ['三语响应式官网', '招生线索表单', '基础 SEO 架构'],
    price: '¥ 69,000 起',
    duration: '4-6 周',
    color: 'from-violet-500/20 via-violet-400/10 to-transparent border-violet-200 dark:border-violet-500/40',
  },
  {
    id: 'pkg-2',
    name: 'Social Media 30D Sprint',
    category: '品牌营销',
    outline: ['社媒策略 1 套', '30 日内容日历', '投放监测看板'],
    price: '¥ 36,800 起',
    duration: '30 天',
    color: 'from-rose-500/20 via-rose-400/10 to-transparent border-rose-200 dark:border-rose-500/40',
  },
  {
    id: 'pkg-3',
    name: '留学合同审核',
    category: '法律与合规',
    outline: ['合同风险扫描', '条款优化建议', '标准模板更新'],
    price: '¥ 12,800 / 次',
    duration: '5 个工作日',
    color: 'from-emerald-500/20 via-emerald-400/10 to-transparent border-emerald-200 dark:border-emerald-500/40',
  },
] as const;

export const SERVICE_ORDERS = [
  {
    id: 'SO-2025034',
    client: '星辉国际教育',
    service: 'Website Starter + CRM 集成',
    stage: '执行中',
    csm: '陈晓雨',
    deadline: '03-26',
    health: '关注',
  },
  {
    id: 'SO-2025039',
    client: '启航留学顾问',
    service: 'Social Media 30D Sprint',
    stage: '待验收',
    csm: '王浩',
    deadline: '03-11',
    health: '稳定',
  },
  {
    id: 'SO-2025042',
    client: 'FuturePath Studio',
    service: '留学合同审核 + 法务顾问',
    stage: '需求澄清',
    csm: '李嘉怡',
    deadline: '03-07',
    health: '风险',
  },
] as const;

export const MILESTONES = [
  {
    label: '需求澄清会议',
    owner: 'CSM · 陈晓雨',
    status: '完成',
    due: '02-28',
  },
  {
    label: '设计初稿交付',
    owner: '设计 · 林若溪',
    status: '进行中',
    due: '03-08',
  },
  {
    label: '集成验收 & 培训',
    owner: '开发 · Michael',
    status: '待开始',
    due: '03-22',
  },
] as const;

export const EXPERTS = [
  {
    name: '林若溪',
    specialty: 'UX/UI 设计 · Webflow',
    availability: '本周可分配 24h',
    utilization: 68,
    skills: ['Figma', 'Webflow', '品牌手册'],
  },
  {
    name: 'Michael Chen',
    specialty: '全栈开发 · 小程序',
    availability: '排期 3 月 18 日起',
    utilization: 92,
    skills: ['Next.js', 'Supabase', '小程序云开发'],
  },
  {
    name: '王思远',
    specialty: '法律顾问 · 教育出海',
    availability: '随时响应 (SLA 12h)',
    utilization: 54,
    skills: ['合同审阅', '数据合规', '跨境法务'],
  },
] as const;

export const ALERTS = [
  {
    title: '风控提醒 · FuturePath Studio',
    description: '客户方合同条款新增数据出境要求，需法务复核，避免上线延期。',
    owner: '指派给 王思远（法务）',
    priority: '高',
  },
  {
    title: '交付风险 · 星辉国际教育',
    description: '设计初稿延迟 2 日，建议预留沟通会议确认范围扩展。',
    owner: '指派给 林若溪（设计）',
    priority: '中',
  },
] as const;

export const PERFORMANCE = {
  revenueMix: [
    { label: '数字化建设', value: 38, color: 'bg-indigo-500' },
    { label: '品牌营销', value: 26, color: 'bg-sky-500' },
    { label: '法律与合规', value: 18, color: 'bg-emerald-500' },
    { label: '礼品与印刷', value: 12, color: 'bg-amber-500' },
    { label: '运营支持', value: 6, color: 'bg-pink-500' },
  ],
  satisfaction: [
    { label: '极力推荐', value: 54 },
    { label: '推荐', value: 32 },
    { label: '中立', value: 11 },
    { label: '不推荐', value: 3 },
  ],
} as const;

export const CLIENT_PORTAL_UPDATES = [
  {
    client: '启航留学顾问',
    message: '确认《社媒 30 日计划》执行结果，评分 4.8/5，并申请续约。',
    time: '1 小时前',
  },
  {
    client: '星辉国际教育',
    message: '上传招生简章，等待设计团队同步更新官网页面。',
    time: '3 小时前',
  },
] as const;

export const KNOWLEDGE_ITEMS = [
  {
    title: '网站上线操作手册 · 已发布',
    description: '知识花园 · 付费 ¥199 · 近 7 日下载 46 次',
  },
  {
    title: '社媒内容日历模板 · 审核中',
    description: '同步至团队空间，等待市场运营确认',
  },
  {
    title: '跨境合同风险清单 · 草稿',
    description: '建议与法务顾问联合发布，吸引潜在客户',
  },
] as const;

export const SERVICE_CENTER_TABS = [
  { id: 'overview', label: '总览', description: '站在全局视角掌握订单、SLA、风险态势' },
  { id: 'catalog', label: '服务目录', description: '维护标准化服务包与案例资产' },
  { id: 'projects', label: '项目工单', description: '跟进订单生命周期与里程碑' },
  { id: 'resources', label: '资源池', description: '管理内部专家与外部合作伙伴' },
  { id: 'client-portal', label: '客户门户', description: '洞察客户侧互动、交付与续约信号' },
  { id: 'analytics', label: '分析中心', description: '评估收入结构、满意度与复购率' },
] as const;

export type ServiceCenterTabId = (typeof SERVICE_CENTER_TABS)[number]['id'];

export const TAB_ICONS: Record<ServiceCenterTabId, React.ComponentType<{ className?: string }>> = {
  overview: Sparkles,
  catalog: Globe2,
  projects: Calendar,
  resources: Users,
  'client-portal': MessageCircle,
  analytics: BarChart3,
};

export const TAB_BADGE_STYLES: Record<ServiceCenterTabId, string> = {
  overview: 'from-indigo-500 via-sky-500 to-emerald-500',
  catalog: 'from-violet-500 via-rose-500 to-orange-400',
  projects: 'from-amber-500 via-orange-500 to-rose-500',
  resources: 'from-emerald-500 via-green-500 to-teal-500',
  'client-portal': 'from-sky-500 via-indigo-400 to-purple-500',
  analytics: 'from-indigo-500 via-purple-500 to-pink-500',
};

