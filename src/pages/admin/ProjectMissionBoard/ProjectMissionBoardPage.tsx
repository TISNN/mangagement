import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Filter,
  Flame,
  Layout,
  ListChecks,
  Plus,
  Settings,
  Sparkles,
  Tag,
  Users,
  Workflow,
  MessageSquare,
  FileSearch,
  GraduationCap,
  Plane,
  FileCheck,
  TrendingUp,
  Target,
} from 'lucide-react';
import { format } from 'date-fns';

type MissionTab = 'kanban' | 'my' | 'calendar' | 'matrix' | 'analytics';

type Priority = '紧急' | '重要' | '普通';

interface SummaryCard {
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  accent: string;
}

interface AlertItem {
  id: string;
  title: string;
  project: string;
  owner: string;
  priority: Priority;
  dueDate: string;
  status: '逾期' | '进行中' | '即将到期';
  tags: string[];
}

interface KanbanTask {
  id: string;
  title: string;
  project: string;
  owner: string;
  ownerRole: string;
  dueDate: string;
  priority: Priority;
  tags?: string[];
  checklistProgress?: number;
  aiHint?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  badge: string;
  tasks: KanbanTask[];
}

interface PersonalTask {
  id: string;
  title: string;
  project: string;
  status: string;
  dueDate: string;
  priority: Priority;
  role: string;
  timeSpent?: string;
}

interface CalendarTask {
  id: string;
  title: string;
  start: string;
  end?: string;
  type: '任务' | '审核' | '提醒';
  owner: string;
}

interface MatrixCell {
  role: string;
  workload: number;
  completed: number;
  overdue: number;
}

interface MatrixRow {
  stage: string;
  cells: MatrixCell[];
}

interface TrendItem {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}

type CopilotPhaseId = 'consultation' | 'planning' | 'application' | 'tracking' | 'visa' | 'departure';

interface CopilotPhase {
  id: CopilotPhaseId;
  name: string;
  description: string;
  progress: number;
  accent: {
    pill: string;
    ring: string;
    text: string;
    badge: string;
    gradient: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  icon: React.ComponentType<{ className?: string }>;
}

const COPILOT_HERO_STATS = [
  { label: '总学生数', value: '286', change: '+12.5%' },
  { label: '进行中项目', value: '127', change: '+8.3%' },
  { label: '本月转化', value: '42', change: '+25.0%' },
  { label: '成功率', value: '94.2%', change: '+5.2%' },
];

const COPILOT_PHASES: CopilotPhase[] = [
  {
    id: 'consultation',
    name: '咨询评估',
    description: '学生画像与需求采集，生成评估报告与行动建议。',
    progress: 100,
    icon: MessageSquare,
    accent: {
      pill: 'from-blue-500 to-sky-500',
      ring: 'text-blue-500',
      text: 'text-blue-600 dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
      gradient: 'from-blue-500/20 to-blue-500/5',
    },
    stats: [
      { label: '在跟进', value: '45' },
      { label: '平均响应', value: '3.2h' },
    ],
  },
  {
    id: 'planning',
    name: '方案规划',
    description: '院校项目匹配、时间轴安排与材料清单自动生成。',
    progress: 82,
    icon: FileSearch,
    accent: {
      pill: 'from-purple-500 to-indigo-500',
      ring: 'text-purple-500',
      text: 'text-purple-600 dark:text-purple-300',
      badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300',
      gradient: 'from-purple-500/20 to-purple-500/5',
    },
    stats: [
      { label: '方案待确认', value: '18' },
      { label: 'AI 推荐采纳', value: '76%' },
    ],
  },
  {
    id: 'application',
    name: '申请递交',
    description: '文书协同、材料提交状态追踪与质检提醒。',
    progress: 58,
    icon: GraduationCap,
    accent: {
      pill: 'from-emerald-500 to-teal-500',
      ring: 'text-emerald-500',
      text: 'text-emerald-600 dark:text-emerald-300',
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
    },
    stats: [
      { label: '文书定稿率', value: '63%' },
      { label: '质检退回率', value: '7%' },
    ],
  },
  {
    id: 'tracking',
    name: '进度跟踪',
    description: 'Offer 结果记录、补件提醒与关键节点日志回放。',
    progress: 34,
    icon: TrendingUp,
    accent: {
      pill: 'from-orange-500 to-amber-500',
      ring: 'text-orange-500',
      text: 'text-orange-600 dark:text-orange-300',
      badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300',
      gradient: 'from-orange-500/20 to-orange-500/5',
    },
    stats: [
      { label: '结果待录入', value: '11' },
      { label: '补件提醒', value: '5' },
    ],
  },
  {
    id: 'visa',
    name: '签证办理',
    description: '签证材料模板、预约排期与风险告警。',
    progress: 0,
    icon: FileCheck,
    accent: {
      pill: 'from-indigo-500 to-blue-500',
      ring: 'text-indigo-500',
      text: 'text-indigo-600 dark:text-indigo-300',
      badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300',
      gradient: 'from-indigo-500/20 to-indigo-500/5',
    },
    stats: [
      { label: '待启动', value: '8' },
      { label: '临近截止', value: '3' },
    ],
  },
  {
    id: 'departure',
    name: '行前准备',
    description: '行前课程、住宿安排与社群同步。',
    progress: 0,
    icon: Plane,
    accent: {
      pill: 'from-pink-500 to-rose-500',
      ring: 'text-pink-500',
      text: 'text-pink-600 dark:text-pink-300',
      badge: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300',
      gradient: 'from-pink-500/20 to-pink-500/5',
    },
    stats: [
      { label: '行前包准备', value: '5' },
      { label: '社群覆盖', value: '72%' },
    ],
  },
];

const SUMMARY_CARDS: SummaryCard[] = [
  {
    title: '在册任务',
    value: 126,
    trend: '+18 相比上周',
    icon: <Workflow className="h-5 w-5 text-blue-500" />,
    accent: 'from-blue-500/10 to-blue-500/5',
  },
  {
    title: '逾期任务',
    value: 9,
    trend: '3 个高优先级',
    icon: <AlertTriangle className="h-5 w-5 text-rose-500" />,
    accent: 'from-rose-500/10 to-rose-500/5',
  },
  {
    title: '准时完成率',
    value: '91%',
    trend: '+4.2% 本月提升',
    icon: <Activity className="h-5 w-5 text-emerald-500" />,
    accent: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    title: '平均响应时长',
    value: '6.5h',
    trend: '-1.3h 与上月比较',
    icon: <Clock className="h-5 w-5 text-purple-500" />,
    accent: 'from-purple-500/10 to-purple-500/5',
  },
];

const ALERT_DATA: AlertItem[] = [
  {
    id: 'alert-1',
    title: '提交 Stanford 网申材料',
    project: '李敏 · 斯坦福 MSCS',
    owner: '陈慧（顾问）',
    priority: '紧急',
    dueDate: '2025-11-09',
    status: '逾期',
    tags: ['网申', '材料补充'],
  },
  {
    id: 'alert-2',
    title: 'Essay 2 学生反馈跟进',
    project: '李敏 · Columbia MSDS',
    owner: '刘洋（文书）',
    priority: '重要',
    dueDate: '2025-11-10',
    status: '即将到期',
    tags: ['文书', '学生反馈'],
  },
  {
    id: 'alert-3',
    title: '推荐人确认回访',
    project: '王晨 · CMU ECE',
    owner: '张晓（顾问）',
    priority: '普通',
    dueDate: '2025-11-11',
    status: '进行中',
    tags: ['沟通', '提醒'],
  },
];

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'todo',
    title: '待认领',
    badge: '5',
    tasks: [
      {
        id: 'task-1',
        title: '校对 GPA 证明并盖章',
        project: '李敏 · Stanford MSCS',
        owner: '李敏',
        ownerRole: '学生',
        dueDate: '2025-11-12',
        priority: '重要',
        tags: ['材料'],
        aiHint: '建议提醒学生提供 PDF 与照片版，便于质检比对。',
      },
      {
        id: 'task-2',
        title: '准备 TOEFL Home Edition 成绩说明',
        project: '王晨 · CMU ECE',
        owner: '张晓',
        ownerRole: '顾问',
        dueDate: '2025-11-14',
        priority: '普通',
      },
    ],
  },
  {
    id: 'doing',
    title: '进行中',
    badge: '8',
    tasks: [
      {
        id: 'task-3',
        title: 'PS 第三版修改',
        project: '李敏 · Stanford MSCS',
        owner: '刘洋',
        ownerRole: '文书',
        dueDate: '2025-11-09',
        priority: '紧急',
        checklistProgress: 65,
        tags: ['文书', 'AI润色'],
        aiHint: '建议加强研究动机与项目匹配度，突出算法课程经历。',
      },
      {
        id: 'task-4',
        title: '斯坦福网申系统资料填充',
        project: '李敏 · Stanford MSCS',
        owner: '李敏',
        ownerRole: '学生',
        dueDate: '2025-11-11',
        priority: '重要',
        checklistProgress: 40,
      },
    ],
  },
  {
    id: 'review',
    title: '待审核',
    badge: '4',
    tasks: [
      {
        id: 'task-5',
        title: '文书质检 - Essay 1',
        project: '李敏 · Columbia MSDS',
        owner: '赵倩',
        ownerRole: '质检',
        dueDate: '2025-11-09',
        priority: '重要',
        tags: ['质检'],
      },
    ],
  },
  {
    id: 'student',
    title: '待学生',
    badge: '3',
    tasks: [
      {
        id: 'task-6',
        title: '学生确认 Essay 2 最终稿',
        project: '李敏 · Columbia MSDS',
        owner: '李敏',
        ownerRole: '学生',
        dueDate: '2025-11-10',
        priority: '重要',
      },
    ],
  },
  {
    id: 'done',
    title: '已完成',
    badge: '18',
    tasks: [
      {
        id: 'task-7',
        title: '推荐信模板定稿并上传',
        project: '王晨 · CMU ECE',
        owner: '刘洋',
        ownerRole: '文书',
        dueDate: '2025-11-05',
        priority: '普通',
        checklistProgress: 100,
        tags: ['文书'],
      },
    ],
  },
];

const PERSONAL_TASKS: PersonalTask[] = [
  {
    id: 'my-1',
    title: '审核 PS 第三版',
    project: '李敏 · Stanford MSCS',
    status: '待审核',
    dueDate: '2025-11-09',
    priority: '紧急',
    role: '质检',
  },
  {
    id: 'my-2',
    title: '安排推荐人电话沟通',
    project: '王晨 · CMU ECE',
    status: '进行中',
    dueDate: '2025-11-12',
    priority: '重要',
    role: '顾问',
    timeSpent: '已耗时 1.5h',
  },
  {
    id: 'my-3',
    title: '整理材料上传规范',
    project: '团队知识库',
    status: '待认领',
    dueDate: '2025-11-15',
    priority: '普通',
    role: '运营',
  },
];

const CALENDAR_TASKS: CalendarTask[] = [
  {
    id: 'cal-1',
    title: 'Essay 1 审核会议',
    start: '2025-11-09T14:00:00',
    end: '2025-11-09T15:00:00',
    type: '审核',
    owner: '质检团队',
  },
  {
    id: 'cal-2',
    title: '提交 Stanford 网申',
    start: '2025-11-11T00:00:00',
    type: '任务',
    owner: '李敏',
  },
  {
    id: 'cal-3',
    title: '推荐人回访提醒',
    start: '2025-11-12T10:00:00',
    type: '提醒',
    owner: '张晓',
  },
];

const MATRIX_DATA: MatrixRow[] = [
  {
    stage: '材料准备',
    cells: [
      { role: '顾问', workload: 8, completed: 6, overdue: 1 },
      { role: '文书', workload: 4, completed: 3, overdue: 0 },
      { role: '学生', workload: 5, completed: 3, overdue: 2 },
      { role: '质检', workload: 2, completed: 2, overdue: 0 },
    ],
  },
  {
    stage: '文书撰写',
    cells: [
      { role: '顾问', workload: 3, completed: 3, overdue: 0 },
      { role: '文书', workload: 9, completed: 6, overdue: 1 },
      { role: '学生', workload: 4, completed: 2, overdue: 1 },
      { role: '质检', workload: 3, completed: 1, overdue: 0 },
    ],
  },
  {
    stage: '网申操作',
    cells: [
      { role: '顾问', workload: 6, completed: 2, overdue: 1 },
      { role: '文书', workload: 2, completed: 1, overdue: 0 },
      { role: '学生', workload: 8, completed: 4, overdue: 2 },
      { role: '质检', workload: 1, completed: 1, overdue: 0 },
    ],
  },
];

const TREND_DATA: TrendItem[] = [
  { label: '任务准时率', value: '91%', delta: '+4.2%', positive: true },
  { label: '平均完成时长', value: '18.7h', delta: '-2.1h', positive: true },
  { label: '质检退回率', value: '7%', delta: '-1.4%', positive: true },
  { label: 'AI 建议采纳率', value: '63%', delta: '+6.3%', positive: true },
];

const priorityColorMap: Record<Priority, string> = {
  紧急: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  重要: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  普通: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
};

const statusColorMap: Record<AlertItem['status'], string> = {
  逾期: 'border-l-4 border-rose-500',
  进行中: 'border-l-4 border-blue-500',
  即将到期: 'border-l-4 border-amber-500',
};

const formatDate = (value: string) => {
  try {
    return format(new Date(value), 'MM-dd');
  } catch (error) {
    return value;
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

const CopilotOverviewSection: React.FC = () => {
  const [activePhase, setActivePhase] = useState<CopilotPhaseId>('consultation');

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-gradient-to-br from-slate-900 via-purple-800 to-blue-700 p-8 text-white shadow-xl dark:border-gray-700/60">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-t from-white/10 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              申请 Copilot · AI 任务驾驶舱
            </div>
            <h2 className="text-3xl font-semibold leading-tight">一屏掌握留学项目执行进度</h2>
            <p className="text-sm text-white/80 leading-6">
              将原独立 Copilot 页面关键指标纳入任务面板，纵览从咨询到行前的全链路阶段，并支持下一步直接跳转至学生、任务与数据模块。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {COPILOT_HERO_STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-medium text-white/60">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-200">↗ {stat.change}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">阶段总览</h3>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/60">
              <ListChecks className="h-3.5 w-3.5" />
              阶段配置
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs text-white hover:bg-blue-700">
              <Users className="h-3.5 w-3.5" />
              指派顾问
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          {COPILOT_PHASES.map((phase) => {
            const Icon = phase.icon;
            const isActive = activePhase === phase.id;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setActivePhase(phase.id)}
                className={`group relative flex h-full flex-col gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:-translate-y-1 hover:shadow-md dark:bg-gray-800 ${
                  isActive ? `border-2 border-blue-500 shadow-lg` : 'border-gray-100 dark:border-gray-700/60'
                }`}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${phase.accent.gradient} opacity-0 transition-opacity group-hover:opacity-100 ${isActive ? 'opacity-100' : ''}`} />
                <div className="relative flex items-center justify-between">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-br ${phase.accent.pill} px-3 py-1 text-xs font-medium text-white`}
                  >
                    <Icon className="h-4 w-4" />
                    阶段 {COPILOT_PHASES.findIndex((p) => p.id === phase.id) + 1}
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${phase.accent.badge}`}>
                    进度 {phase.progress}%
                  </span>
                </div>
                <div className="relative space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{phase.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-5">{phase.description}</p>
                  <div className="flex items-center gap-2">
                    {phase.stats.map((stat) => (
                      <span
                        key={stat.label}
                        className={`inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 dark:bg-gray-800/70 dark:text-gray-300 ${phase.accent.text}`}
                      >
                        {stat.label} · {stat.value}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative mt-auto w-full">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500">
                    <span>阶段完成度</span>
                    <span className={phase.accent.text}>{phase.progress}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700/60">
                    <div
                      className={`h-full rounded-full ${phase.accent.ring.replace('text', 'bg')}`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span>
              当前聚焦阶段：<span className="font-semibold text-blue-600 dark:text-blue-300">{COPILOT_PHASES.find((p) => p.id === activePhase)?.name}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
              <FileSearch className="h-3.5 w-3.5" />
              跳转学生档案
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700/60">
              <ListChecks className="h-3.5 w-3.5" />
              查看任务列表
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-3 py-1.5 text-xs text-white hover:bg-purple-700">
              <Sparkles className="h-3.5 w-3.5" />
              调用 Copilot 建议
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummarySection: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    {SUMMARY_CARDS.map((card) => (
      <div
        key={card.title}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} pointer-events-none`} />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {card.trend}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
            {card.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const AlertList: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="任务警报中心"
      description="关注逾期与即将到期的关键任务，便于即时响应。"
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 text-sm">
            <Flame className="h-4 w-4" />
            一键催办
          </button>
        </>
      }
    />
    <div className="mt-6 space-y-3">
      {ALERT_DATA.map((item) => (
        <div
          key={item.id}
          className={`rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm ${statusColorMap[item.status]}`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${priorityColorMap[item.priority]}`}>
                  {item.priority}
                </span>
                <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/60 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                  {item.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.project} · {item.owner}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  截止 {formatDate(item.dueDate)}
                </span>
                {item.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
              <Users className="h-4 w-4" />
              指派处理
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const KanbanBoard: React.FC = () => (
  <div className="overflow-x-auto">
    <div className="min-w-[960px] grid grid-cols-5 gap-4">
      {KANBAN_COLUMNS.map((column) => (
        <div key={column.id} className="flex h-full flex-col rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{column.title}</span>
              <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 text-xs text-gray-600 dark:text-gray-300">
                {column.badge}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-3 p-3">
            {column.tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{task.project}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${priorityColorMap[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1">
                    <Users className="h-3 w-3" />
                    {task.owner} · {task.ownerRole}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    {formatDate(task.dueDate)}
                  </span>
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[11px] text-blue-600 dark:text-blue-300">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                {typeof task.checklistProgress === 'number' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span>子任务进度</span>
                      <span>{task.checklistProgress}%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700/60">
                      <div
                        className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
                        style={{ width: `${task.checklistProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {task.aiHint && (
                  <div className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-[11px] text-amber-600 dark:text-amber-300">
                    <Sparkles className="mr-1 inline h-3 w-3" />
                    {task.aiHint}
                  </div>
                )}
              </div>
            ))}
            <button className="w-full rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <Plus className="mr-2 inline h-4 w-4" />
              新建任务
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MyTasks: React.FC = () => (
  <div className="space-y-3">
    {PERSONAL_TASKS.map((task) => (
      <div key={task.id} className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${priorityColorMap[task.priority]}`}>
                {task.priority}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
                {task.status}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{task.project} · 角色：{task.role}</p>
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 text-blue-500" />
              截止 {formatDate(task.dueDate)}
              {task.timeSpent && (
                <>
                  <span className="text-gray-300">·</span>
                  <Clock className="h-3 w-3 text-emerald-500" />
                  {task.timeSpent}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
              <CheckCircle2 className="h-3.5 w-3.5" />
              标记完成
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              AI 建议
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MissionCalendar: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-6 shadow-sm">
    <SectionHeader
      title="任务日历"
      description="查看本周任务与提醒时间轴，支持拖拽调整截止日期。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
          <Settings className="h-4 w-4" />
          日历设置
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {CALENDAR_TASKS.map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow">
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>{format(new Date(item.start), 'yyyy-MM-dd HH:mm')}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300">
              {item.type}
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">负责人：{item.owner}</p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-blue-500 dark:text-blue-300">
            <Compass className="h-3 w-3" />
            支持拖拽至新日期，自动同步提醒与依赖任务
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CrewMatrix: React.FC = () => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-6 shadow-sm">
    <SectionHeader
      title="职责矩阵"
      description="按阶段与角色统计任务工作量，识别负载与瓶颈。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
          <Layout className="h-4 w-4" />
          切换视图
        </button>
      }
    />
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-[720px] divide-y divide-gray-100 dark:divide-gray-700 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">阶段 / 角色</th>
            <th className="px-4 py-3">顾问</th>
            <th className="px-4 py-3">文书</th>
            <th className="px-4 py-3">学生</th>
            <th className="px-4 py-3">质检</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/70">
          {MATRIX_DATA.map((row) => (
            <tr key={row.stage}>
              <td className="px-4 py-4 font-medium text-gray-900 dark:text-white">{row.stage}</td>
              {row.cells.map((cell) => (
                <td key={cell.role} className="px-4 py-4">
                  <div className="space-y-2 rounded-xl bg-gray-50 dark:bg-gray-800/90 p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cell.role}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-300">总 {cell.workload}</span>
                      <span className="text-emerald-500 dark:text-emerald-300">完成 {cell.completed}</span>
                      <span className="text-rose-500 dark:text-rose-300">逾期 {cell.overdue}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(cell.completed / Math.max(cell.workload, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const MissionAnalytics: React.FC = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {TREND_DATA.map((item) => (
        <div key={item.label} className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{item.value}</p>
          <p className={`mt-2 text-xs font-medium ${item.positive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {item.delta} · 相比上周期
          </p>
        </div>
      ))}
    </div>
    <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-6 shadow-sm">
      <SectionHeader
        title="关键指标趋势"
        description="支持与 OKR、绩效评估联动，导出报告或发送至邮件。"
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
            <BarChart3 className="h-4 w-4" />
            导出报告
          </button>
        }
      />
      <div className="mt-6 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
        图表占位：折线图展示任务完成率、平均时长与 AI 建议采纳率趋势。可接入现有图表库（如 Recharts / ECharts）。
      </div>
    </div>
  </div>
);

const ProjectMissionBoardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MissionTab>('kanban');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">项目任务面板</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Project Mission Board</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            协调顾问、文书、学生、质检的任务协作中心，支持模板化与自动化。实时洞察项目进度、瓶颈与工作负载，保障申请项目按时高质交付。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Filter className="h-4 w-4" />
            高级筛选
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Plus className="h-4 w-4" />
            新建任务
          </button>
        </div>
      </div>

      <CopilotOverviewSection />

      <SummarySection />

      <AlertList />

      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'kanban', label: '任务看板', icon: <ListChecks className="h-4 w-4" /> },
            { id: 'my', label: '我的任务', icon: <Users className="h-4 w-4" /> },
            { id: 'calendar', label: '任务日历', icon: <Calendar className="h-4 w-4" /> },
            { id: 'matrix', label: '职责矩阵', icon: <Layout className="h-4 w-4" /> },
            { id: 'analytics', label: '指标分析', icon: <BarChart3 className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MissionTab)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'kanban' && (
        <div className="space-y-4">
          <SectionHeader
            title="任务看板"
            description="按阶段划分的任务视图，支持拖拽、批量指派、AI 提示。"
            actions={
              <>
                <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  AI 协助拆解
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
                  <Settings className="h-4 w-4" />
                  配置阶段
                </button>
              </>
            }
          />
          <KanbanBoard />
        </div>
      )}

      {activeTab === 'my' && (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-6 shadow-sm space-y-4">
          <SectionHeader
            title="我的任务"
            description="按优先级与截止时间排列，支持角色切换与专注模式。"
            actions={
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                <Compass className="h-4 w-4" />
                启动专注模式
              </button>
            }
          />
          <MyTasks />
        </div>
      )}

      {activeTab === 'calendar' && <MissionCalendar />}

      {activeTab === 'matrix' && <CrewMatrix />}

      {activeTab === 'analytics' && <MissionAnalytics />}
    </div>
  );
};

export default ProjectMissionBoardPage;

