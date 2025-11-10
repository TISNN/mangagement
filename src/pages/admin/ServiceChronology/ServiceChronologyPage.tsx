import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Filter,
  FolderKanban,
  History,
  Layout,
  ListChecks,
  Plus,
  ShieldAlert,
  Sparkles,
  Target,
  Timer,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

type ChronoTab = 'timeline' | 'milestone' | 'risk' | 'analytics' | 'archives';

interface ServiceProject {
  id: string;
  student: string;
  serviceName: string;
  status: '进行中' | '待启动' | '已完成';
  startDate: string;
  endDate?: string;
  progress: number;
  primaryAdvisor: string;
  phase: string;
}

interface SummaryMetric {
  title: string;
  value: string | number;
  trend: string;
  accent: string;
  icon: React.ReactNode;
}

interface TimelineEvent {
  id: string;
  type: '里程碑' | '任务' | '材料' | '文书' | '网申' | '风险' | '反馈';
  title: string;
  description: string;
  owner: string;
  timestamp: string;
  attachments?: number;
  tags?: string[];
  aiInsight?: string;
  status?: '完成' | '进行中' | '待处理' | '风险';
}

interface MilestoneItem {
  id: string;
  name: string;
  stage: string;
  owner: string;
  plannedDate: string;
  dueDate: string;
  status: '按计划' | '延迟' | '完成';
  completion: number;
  weight: number;
}

interface RiskItem {
  id: string;
  category: '材料' | '文书' | '网申' | '学生配合' | '外部因素' | '其它';
  level: '高' | '中' | '低';
  score: number;
  summary: string;
  mitigation: string;
  updatedAt: string;
}

interface AnalyticsIndicator {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
}

interface ArchiveEntry {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags: string[];
  author: string;
}

const SERVICE_PROJECTS: ServiceProject[] = [
  {
    id: 'srv-1',
    student: '李敏',
    serviceName: '斯坦福 MSCS 全程申请',
    status: '进行中',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    progress: 62,
    primaryAdvisor: '陈慧（顾问）',
    phase: '文书精修·网申准备',
  },
  {
    id: 'srv-2',
    student: '王晨',
    serviceName: 'CMU ECE 半DIY',
    status: '进行中',
    startDate: '2025-08-15',
    endDate: '2026-01-15',
    progress: 38,
    primaryAdvisor: '张晓（顾问）',
    phase: '材料准备',
  },
  {
    id: 'srv-3',
    student: '赵雪',
    serviceName: '哥大统计硕士 全程',
    status: '待启动',
    startDate: '2025-11-01',
    progress: 12,
    primaryAdvisor: '李想（顾问）',
    phase: '入门规划',
  },
];

const SUMMARY_METRICS: SummaryMetric[] = [
  {
    title: '里程碑完成率',
    value: '74%',
    trend: '+6.2% 较上周',
    accent: 'from-blue-500/10 to-blue-500/5',
    icon: <Target className="h-5 w-5 text-blue-500" />,
  },
  {
    title: '材料通过率',
    value: '82%',
    trend: '+11% 材料质检',
    accent: 'from-emerald-500/10 to-emerald-500/5',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: '风险评分',
    value: '32/100',
    trend: '-8 分 风险下降',
    accent: 'from-amber-500/10 to-amber-500/5',
    icon: <ShieldAlert className="h-5 w-5 text-amber-500" />,
  },
  {
    title: 'AI 建议采纳率',
    value: '67%',
    trend: '+9% 采纳上升',
    accent: 'from-purple-500/10 to-purple-500/5',
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
  },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-1',
    type: '里程碑',
    title: '材料核查完成',
    description: '官方成绩单、在读证明、GPA 说明已完成翻译与盖章质检。',
    owner: '王璐（文书）',
    timestamp: '2025-11-08 20:32',
    attachments: 4,
    tags: ['材料', '质检'],
    status: '完成',
    aiInsight: '材料通过率连续三周提升，建议进入下一阶段的网申资料填充。',
  },
  {
    id: 'evt-2',
    type: '文书',
    title: 'PS 第三稿 AI 深度润色',
    description: '强化科研动机与职业规划逻辑，突出算法课程成绩与实习成果。',
    owner: '刘洋（文书）',
    timestamp: '2025-11-08 14:15',
    attachments: 2,
    tags: ['文书', 'AI润色'],
    status: '进行中',
    aiInsight: '建议增加与 Stanford 教授研究方向的呼应内容，提升匹配度。',
  },
  {
    id: 'evt-3',
    type: '材料',
    title: '推荐信状态追踪',
    description: '教授 A 已确认模板并提交初稿，教授 B 待跟进，系统已发送提醒。',
    owner: '陈慧（顾问）',
    timestamp: '2025-11-07 10:00',
    tags: ['推荐信', '提醒'],
    status: '待处理',
  },
  {
    id: 'evt-4',
    type: '风险',
    title: '学生反馈：文书压力较大',
    description: '学生反馈近期文书与课程压力较大，建议适度缓冲时间并提供写作指导。',
    owner: '学生反馈',
    timestamp: '2025-11-06 21:40',
    tags: ['情绪', '沟通'],
    status: '风险',
    aiInsight: '建议顾问安排一次关怀电话，评估学生节奏，适当调整任务优先级。',
  },
  {
    id: 'evt-5',
    type: '任务',
    title: '创建 Stanford 网申账号',
    description: '学生已完成账号注册，待上传基础资料并填写个人信息版块。',
    owner: '李敏（学生）',
    timestamp: '2025-11-05 19:05',
    tags: ['网申'],
    status: '进行中',
  },
];

const MILESTONE_ITEMS: MilestoneItem[] = [
  {
    id: 'mil-1',
    name: '材料核验与翻译完成',
    stage: '材料准备',
    owner: '王璐（文书）',
    plannedDate: '2025-11-06',
    dueDate: '2025-11-08',
    status: '按计划',
    completion: 100,
    weight: 25,
  },
  {
    id: 'mil-2',
    name: '个人陈述第三版定稿',
    stage: '文书撰写',
    owner: '刘洋（文书）',
    plannedDate: '2025-11-09',
    dueDate: '2025-11-11',
    status: '延迟',
    completion: 65,
    weight: 30,
  },
  {
    id: 'mil-3',
    name: '网申资料填充与确认',
    stage: '网申准备',
    owner: '李敏（学生）',
    plannedDate: '2025-11-12',
    dueDate: '2025-11-15',
    status: '按计划',
    completion: 30,
    weight: 20,
  },
  {
    id: 'mil-4',
    name: '顾问-学生阶段总结会议',
    stage: '沟通复盘',
    owner: '陈慧（顾问）',
    plannedDate: '2025-11-18',
    dueDate: '2025-11-18',
    status: '按计划',
    completion: 0,
    weight: 10,
  },
];

const RISK_ITEMS: RiskItem[] = [
  {
    id: 'risk-1',
    category: '文书',
    level: '中',
    score: 45,
    summary: '文书迭代次数较高，学生反馈时间紧张，存在推迟风险。',
    mitigation: '安排顾问与学生沟通优先级，使用模板加速段落润色。',
    updatedAt: '2025-11-08',
  },
  {
    id: 'risk-2',
    category: '学生配合',
    level: '高',
    score: 70,
    summary: '学生近期期中考试，提交材料响应变慢，推荐信回传可能延迟。',
    mitigation: '开启每日提醒，必要时顾问协助与推荐人沟通。',
    updatedAt: '2025-11-07',
  },
  {
    id: 'risk-3',
    category: '网申',
    level: '低',
    score: 20,
    summary: 'Stanford 网申系统近期更新，暂无影响，需关注后续稳定性。',
    mitigation: '关注官方公告，保持材料备份。',
    updatedAt: '2025-11-05',
  },
];

const ANALYTICS_INDICATORS: AnalyticsIndicator[] = [
  { label: '里程碑准时率', value: '88%', delta: '+5.4%', positive: true },
  { label: '文书退回率', value: '9%', delta: '-2.1%', positive: true },
  { label: '材料补件率', value: '12%', delta: '+1.8%', positive: false },
  { label: '沟通响应时长', value: '6.2h', delta: '-1.5h', positive: true },
];

const ARCHIVE_DATA: ArchiveEntry[] = [
  {
    id: 'arch-1',
    title: '2025-11 阶段总结报告',
    description: '梳理文书与材料进展，记录学生反馈与风险缓解动作。',
    createdAt: '2025-11-08',
    tags: ['阶段报告', '文书', '风险'],
    author: '陈慧',
  },
  {
    id: 'arch-2',
    title: '材料质检清单 v2.0',
    description: '更新 GPA 说明模板，新增网申截图作为核验附件。',
    createdAt: '2025-11-06',
    tags: ['材料', '模板'],
    author: '王璐',
  },
];

const STATUS_COLOR: Record<string, string> = {
  完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  进行中: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  待处理: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  风险: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

const MIL_STATUS_COLOR: Record<MilestoneItem['status'], string> = {
  按计划: 'text-emerald-500',
  延迟: 'text-rose-500',
  完成: 'text-blue-500',
};

const RISK_LEVEL_COLOR: Record<RiskItem['level'], string> = {
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'yyyy/MM/dd');
  } catch {
    return date;
  }
};

const SectionHeader: React.FC<{
  title: string;
  description?: string;
  actions?: React.ReactNode;
}> = ({ title, description, actions }) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

const SummaryCards: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {SUMMARY_METRICS.map((metric) => (
      <div
        key={metric.title}
        className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${metric.accent} pointer-events-none`} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {metric.trend}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
            {metric.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const TimelineSection: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
    <SectionHeader
      title="服务时间线"
      description="按时间串联里程碑、文书、网申、风险与学生反馈，支持 AI 自动总结。"
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Filter className="h-4 w-4" />
            筛选类型
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            新增记录
          </button>
        </>
      }
    />
    <div className="mt-6 relative">
      <div className="absolute left-4 top-0 bottom-0 border-l border-dashed border-blue-200 dark:border-blue-900/40" />
      <div className="space-y-6">
        {TIMELINE_EVENTS.map((event) => (
          <div key={event.id} className="relative pl-12">
            <div className="absolute left-4 top-2 -translate-x-1/2 h-3 w-3 rounded-full border-4 border-white dark:border-gray-900 shadow ring-4 ring-blue-500/20 dark:ring-blue-900/30 bg-blue-500" />
            <div className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-wide text-blue-500 dark:text-blue-300">{event.type}</span>
                    {event.status && (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_COLOR[event.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                        {event.status}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.owner}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      {event.timestamp}
                    </span>
                    {typeof event.attachments === 'number' && (
                      <span className="inline-flex items-center gap-1">
                        <Archive className="h-3 w-3" />
                        附件 {event.attachments}
                      </span>
                    )}
                    {event.tags?.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  查看详情
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {event.aiInsight && (
                <div className="mt-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 px-3 py-2 text-xs text-purple-600 dark:text-purple-300">
                  <Sparkles className="mr-1 inline h-3.5 w-3.5" />
                  {event.aiInsight}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MilestoneSection: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
    <SectionHeader
      title="里程碑管理"
      description="查看阶段性关键节点，支持甘特视图、权重与预警设置。"
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Layout className="h-4 w-4" />
            甘特视图
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            新增里程碑
          </button>
        </>
      }
    />
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">里程碑</th>
            <th className="px-4 py-3">阶段</th>
            <th className="px-4 py-3">负责人</th>
            <th className="px-4 py-3">计划时间</th>
            <th className="px-4 py-3">截止</th>
            <th className="px-4 py-3">状态</th>
            <th className="px-4 py-3">完成度</th>
            <th className="px-4 py-3 text-right">权重</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {MILESTONE_ITEMS.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.stage}</td>
              <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.owner}</td>
              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{formatDate(item.plannedDate)}</td>
              <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{formatDate(item.dueDate)}</td>
              <td className="px-4 py-4 text-sm font-medium">
                <span className={MIL_STATUS_COLOR[item.status]}>{item.status}</span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.completion}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.completion}%</span>
                </div>
              </td>
              <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400">{item.weight}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const RiskRadar: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
    <SectionHeader
      title="风险雷达"
      description="监测材料、文书、学生配合等维度风险，自动生成缓解建议。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
          <Compass className="h-4 w-4" />
          风险配置
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-5">
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
        雷达图占位：展示各维度风险分值，可接入图表库（Recharts / ECharts）。
      </div>
      <div className="space-y-3">
        {RISK_ITEMS.map((risk) => (
          <div key={risk.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{risk.summary}</span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${RISK_LEVEL_COLOR[risk.level]}`}>
                    {risk.level}风险
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  维度：{risk.category} · 风险评分 {risk.score}
                </p>
                <p className="mt-2 text-xs text-blue-500 dark:text-blue-300">更新于 {formatDate(risk.updatedAt)}</p>
              </div>
              <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                转为任务
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-3 rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
              <strong className="mr-2 text-gray-900 dark:text-white">缓解建议：</strong>
              {risk.mitigation}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsSection: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {ANALYTICS_INDICATORS.map((indicator) => (
        <div key={indicator.label} className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{indicator.label}</p>
          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{indicator.value}</p>
          <p className={`mt-2 text-xs font-medium ${indicator.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {indicator.delta} · 相比上周期
          </p>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
      <SectionHeader
        title="进度指标趋势"
        description="可导出至 PDF 或嵌入周/月度服务报告，与文书工作台、项目任务数据联动。"
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            导出仪表盘
          </button>
        }
      />
      <div className="mt-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
        图表占位：折线图展示里程碑完成率、风险评分、AI 建议采纳率等指标的时间趋势。
      </div>
    </div>
  </div>
);

const ArchiveSection: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
    <SectionHeader
      title="服务档案"
      description="沉淀阶段总结、成果输出与沟通纪要，支持一键生成移交文件。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
          <FileText className="h-4 w-4" />
          生成报告
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      {ARCHIVE_DATA.map((archive) => (
        <div key={archive.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{archive.title}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{archive.description}</p>
            </div>
            <span className="text-xs text-gray-400">{formatDate(archive.createdAt)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" />
              {archive.author}
            </span>
            {archive.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ServiceChronologyPage: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string>(SERVICE_PROJECTS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<ChronoTab>('timeline');

  const activeProject = useMemo(
    () => SERVICE_PROJECTS.find((project) => project.id === activeProjectId),
    [activeProjectId],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">服务进度中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Service Progress Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            以时间线视角串联学生服务的关键节点，实时掌握材料、文书、网申与风险状态。支持 AI 辅助分析、风险预警、进度统计与档案沉淀，提升团队协作效率与透明度。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Filter className="h-4 w-4" />
            服务筛选
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            添加里程碑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">服务列表</h2>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                <Filter className="h-3 w-3" />
                状态
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {SERVICE_PROJECTS.map((project) => {
                const isActive = project.id === activeProjectId;
                return (
                  <button
                    key={project.id}
                    onClick={() => setActiveProjectId(project.id)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-500/80 dark:bg-blue-900/30'
                        : 'border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {project.student} · {project.serviceName}
                      </span>
                      <span className={`text-xs ${project.status === '进行中' ? 'text-emerald-500' : project.status === '待启动' ? 'text-amber-500' : 'text-blue-500'}`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{project.phase}</p>
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : '进行中'}
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>整体进度</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      负责人：{project.primaryAdvisor}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="space-y-6">
          {activeProject && (
            <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {activeProject.student} · {activeProject.serviceName}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    当前阶段：{activeProject.phase} · 负责人：{activeProject.primaryAdvisor}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-700/60 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300">
                  <Timer className="h-3.5 w-3.5" />
                  {formatDate(activeProject.startDate)} - {activeProject.endDate ? formatDate(activeProject.endDate) : '进行中'}
                </div>
              </div>
              <div className="mt-5">
                <SummaryCards />
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-2">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'timeline', label: '时间线视图', icon: <History className="h-4 w-4" /> },
                { id: 'milestone', label: '里程碑管理', icon: <ListChecks className="h-4 w-4" /> },
                { id: 'risk', label: '风险雷达', icon: <AlertTriangle className="h-4 w-4" /> },
                { id: 'analytics', label: '进度统计', icon: <Activity className="h-4 w-4" /> },
                { id: 'archives', label: '服务档案', icon: <Archive className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ChronoTab)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'timeline' && <TimelineSection />}

          {activeTab === 'milestone' && <MilestoneSection />}

          {activeTab === 'risk' && <RiskRadar />}

          {activeTab === 'analytics' && <AnalyticsSection />}

          {activeTab === 'archives' && <ArchiveSection />}
        </section>
      </div>
    </div>
  );
};

export default ServiceChronologyPage;

