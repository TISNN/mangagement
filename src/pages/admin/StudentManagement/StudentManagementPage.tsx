import React, { useMemo, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  KanbanSquare,
  List,
  Mail,
  MapPin,
  NotebookText,
  Phone,
  Search,
  Sparkles,
  Star,
  Tag,
  Users,
} from 'lucide-react';

type StudentView = 'list' | 'card' | 'grid' | 'kanban' | 'insights';
type StudentStatus = '活跃' | '休学' | '毕业' | '退学';
type RiskLevel = '低' | '中' | '高';

interface StudentService {
  id: string;
  name: string;
  status: '准备中' | '进行中' | '申请中' | '已完成';
  progress: number;
  advisor: string;
}

interface StudentRecord {
  id: string;
  name: string;
  avatar: string;
  status: StudentStatus;
  progress: number;
  stage: string;
  services: StudentService[];
  advisor: string;
  mentorTeam: string[];
  email: string;
  phone: string;
  school: string;
  major: string;
  region: string;
  channel: string;
  tags: string[];
  risk: RiskLevel;
  satisfaction: number;
  tasksPending: number;
  updatedAt: string;
}

interface SummaryMetric {
  title: string;
  value: string | number;
  trend: string;
  positive?: boolean;
  icon: React.ReactNode;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
}

const STUDENT_DATA: StudentRecord[] = [
  {
    id: 'stu-1',
    name: '李敏',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LiMin',
    status: '活跃',
    progress: 62,
    stage: '文书精修 · 网申资料',
    services: [
      { id: 'srv-1', name: '斯坦福 MSCS 全程', status: '进行中', progress: 68, advisor: '陈慧' },
      { id: 'srv-2', name: '托福冲刺', status: '已完成', progress: 100, advisor: '王璐' },
    ],
    advisor: '陈慧',
    mentorTeam: ['刘洋（文书）', '赵倩（质检）'],
    email: 'lmn@example.com',
    phone: '138-1111-2222',
    school: '清华大学 · 计算机科学',
    major: '计算机科学与技术',
    region: '北京',
    channel: '线上讲座',
    tags: ['CS', '研究型', '美国'],
    risk: '中',
    satisfaction: 4.6,
    tasksPending: 3,
    updatedAt: '2025-11-08',
  },
  {
    id: 'stu-2',
    name: '王晨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=WangChen',
    status: '活跃',
    progress: 38,
    stage: '材料准备',
    services: [
      { id: 'srv-3', name: 'CMU ECE 半DIY', status: '准备中', progress: 25, advisor: '张晓' },
    ],
    advisor: '张晓',
    mentorTeam: ['李楠（材料）'],
    email: 'wangchen@example.com',
    phone: '186-3333-4444',
    school: '上海交通大学 · 电子工程',
    major: '电子与信息工程',
    region: '上海',
    channel: '顾问转介',
    tags: ['硬件', '美研'],
    risk: '低',
    satisfaction: 4.8,
    tasksPending: 1,
    updatedAt: '2025-11-07',
  },
  {
    id: 'stu-3',
    name: '赵雪',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoXue',
    status: '休学',
    progress: 15,
    stage: '基础规划',
    services: [
      { id: 'srv-4', name: '哥大统计全程', status: '准备中', progress: 15, advisor: '李想' },
    ],
    advisor: '李想',
    mentorTeam: ['刘洋（文书）'],
    email: 'zhaoxue@example.com',
    phone: '139-5555-6666',
    school: '北京大学 · 统计学',
    major: '统计学',
    region: '北京',
    channel: '官网注册',
    tags: ['美研', '统计'],
    risk: '高',
    satisfaction: 3.9,
    tasksPending: 5,
    updatedAt: '2025-11-05',
  },
  {
    id: 'stu-4',
    name: '周扬',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ZhouYang',
    status: '毕业',
    progress: 100,
    stage: '已录取 · Columbia MSDS',
    services: [
      { id: 'srv-5', name: '哥大 MSDS 全程', status: '已完成', progress: 100, advisor: '陈慧' },
    ],
    advisor: '陈慧',
    mentorTeam: ['刘洋', '赵倩'],
    email: 'zhouyang@example.com',
    phone: '137-7777-8888',
    school: '复旦大学 · 数学',
    major: '数学与应用',
    region: '上海',
    channel: '学生推荐',
    tags: ['数据科学', '成功案例'],
    risk: '低',
    satisfaction: 4.9,
    tasksPending: 0,
    updatedAt: '2025-10-30',
  },
];

const SUMMARY_DATA: SummaryMetric[] = [
  {
    title: '在读学生',
    value: '128',
    trend: '+12 本月新增',
    positive: true,
    icon: <Users className="h-5 w-5 text-blue-500" />,
  },
  {
    title: '活跃占比',
    value: '76%',
    trend: '+4.5% 与上月比较',
    positive: true,
    icon: <Activity className="h-5 w-5 text-emerald-500" />,
  },
  {
    title: '风险学生',
    value: '9',
    trend: '-3 风险下降',
    positive: true,
    icon: <Sparkles className="h-5 w-5 text-amber-500" />,
  },
  {
    title: '平均满意度',
    value: '4.7',
    trend: '+0.3 最近 30 天',
    positive: true,
    icon: <Star className="h-5 w-5 text-purple-500" />,
  },
];

const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: '准备中', title: '准备中', color: 'border-slate-200' },
  { id: '进行中', title: '进行中', color: 'border-blue-200' },
  { id: '申请中', title: '申请中', color: 'border-indigo-200' },
  { id: '已完成', title: '已完成', color: 'border-emerald-200' },
  { id: '风险', title: '风险', color: 'border-rose-200' },
];

const STATUS_TAG_CLASS: Record<StudentStatus, string> = {
  活跃: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  休学: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  毕业: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  退学: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
};

const RISK_TAG_CLASS: Record<RiskLevel, string> = {
  低: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  中: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  高: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
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
    {SUMMARY_DATA.map((item) => (
      <div
        key={item.title}
        className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-blue-50/40 dark:from-gray-800/0 dark:via-gray-800/0 dark:to-blue-900/10 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
            <p
              className={`mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 px-2.5 py-1 text-xs font-medium ${
                item.positive ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {item.trend}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 dark:bg-gray-700/60">
            {item.icon}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const FilterBar: React.FC<{
  search: string;
  setSearch: (value: string) => void;
  status: StudentStatus | '全部';
  setStatus: (value: StudentStatus | '全部') => void;
}> = ({ search, setSearch, status, setStatus }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 shadow-sm flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
    <div className="flex flex-1 items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索学生姓名/邮箱/标签..."
        className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
      />
    </div>
    <div className="flex flex-wrap gap-2">
      <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
        <Filter className="h-4 w-4" />
        状态
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StudentStatus | '全部')}
          className="bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
        >
          <option value="全部">全部学生</option>
          <option value="活跃">活跃</option>
          <option value="休学">休学</option>
          <option value="毕业">毕业</option>
          <option value="退学">退学</option>
        </select>
      </div>
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
        <Tag className="h-4 w-4" />
        标签
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
        <Users className="h-4 w-4" />
        顾问
      </button>
      <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800">
        <Download className="h-4 w-4" />
        导出数据
      </button>
    </div>
  </div>
);

const ListView: React.FC<{ students: StudentRecord[]; onSelect: (student: StudentRecord) => void }> = ({
  students,
  onSelect,
}) => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-6 py-3">学生</th>
            <th className="px-6 py-3">服务</th>
            <th className="px-6 py-3">顾问</th>
            <th className="px-6 py-3">阶段</th>
            <th className="px-6 py-3">风险</th>
            <th className="px-6 py-3">进度</th>
            <th className="px-6 py-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-10 w-10 rounded-xl object-cover ring-4 ring-white dark:ring-gray-700"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.school}</p>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}>
                        {student.status}
                      </span>
                      <span className="text-[11px] text-gray-400">更新时间 {student.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="space-y-1">
                  {student.services.map((service) => (
                    <div key={service.id} className="flex items-center gap-2">
                      <span>{service.name}</span>
                      <span className="text-xs text-gray-400">{service.status} · {service.progress}%</span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.advisor}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{student.stage}</td>
              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}>
                  {student.risk}风险
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${student.progress}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{student.progress}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onSelect(student)}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                >
                  查看详情
                  <ChevronRight className="h-3 w-3" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CardView: React.FC<{ students: StudentRecord[]; onSelect: (student: StudentRecord) => void }> = ({
  students,
  onSelect,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {students.map((student) => (
      <div
        key={student.id}
        className="group relative flex h-full flex-col rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm hover:shadow-xl transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="h-12 w-12 rounded-xl object-cover ring-4 ring-white dark:ring-gray-700"
            />
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{student.school}</p>
            </div>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}>
            {student.status}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          {student.region} · {student.channel}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {student.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {student.services.slice(0, 2).map((service) => (
            <div key={service.id} className="rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center justify-between">
                <span>{service.name}</span>
                <span className="text-xs text-gray-400">{service.status}</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600/60">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${service.progress}%` }} />
                </div>
                <span className="text-[11px] text-gray-400">{service.progress}%</span>
              </div>
            </div>
          ))}
          {student.services.length > 2 && (
            <button className="text-xs text-blue-500 dark:text-blue-300">查看更多服务...</button>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-purple-500" />
            顾问：{student.advisor}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            待办：{student.tasksPending}
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            风险：{student.risk}
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-purple-500" />
            满意度：{student.satisfaction}
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={() => onSelect(student)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
          >
            进入详情
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
);

const DataGridView: React.FC<{ students: StudentRecord[] }> = ({ students }) => (
  <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm space-y-4">
    <SectionHeader
      title="数据表格视图"
      description="支持自定义列、导出、批量操作，便于数据运营分析。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
          <FileSpreadsheet className="h-4 w-4" />
          导出 Excel
        </button>
      }
    />
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700 text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <th className="px-4 py-3">姓名</th>
            <th className="px-4 py-3">状态</th>
            <th className="px-4 py-3">服务数量</th>
            <th className="px-4 py-3">主要顾问</th>
            <th className="px-4 py-3">风险等级</th>
            <th className="px-4 py-3">满意度</th>
            <th className="px-4 py-3">来源渠道</th>
            <th className="px-4 py-3">区域</th>
            <th className="px-4 py-3">更新时间</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{student.name}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.status}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.services.length}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.advisor}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.risk}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.satisfaction}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.channel}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.region}</td>
              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{student.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const KanbanView: React.FC<{ students: StudentRecord[] }> = ({ students }) => (
  <div className="space-y-4">
    <SectionHeader
      title="服务阶段看板"
      description="按服务阶段维度查看学生进度，支持拖拽与优先级管理（待接入）。"
    />
    <div className="overflow-x-auto">
      <div className="grid min-w-[960px] grid-cols-5 gap-4">
        {KANBAN_COLUMNS.map((column) => (
          <div
            key={column.id}
            className={`flex h-full flex-col rounded-2xl border ${column.color} dark:border-gray-700/60 bg-white dark:bg-gray-800/70 shadow-sm`}
          >
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/60 px-4 py-3">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{column.title}</span>
              <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 text-xs text-gray-600 dark:text-gray-300">
                {students.filter((student) =>
                  student.services.some((service) => service.status === column.id),
                ).length}
              </span>
            </div>
            <div className="space-y-3 p-3">
              {students
                .filter((student) => student.services.some((service) => service.status === column.id))
                .map((student) => (
                  <div key={student.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{student.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{student.stage}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}>
                        风险 {student.risk}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      主服务：{student.services.find((service) => service.status === column.id)?.name}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-gray-400">{student.progress}%</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Users className="h-3.5 w-3.5 text-purple-500" />
                      顾问：{student.advisor}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InsightsView: React.FC = () => (
  <div className="space-y-4">
    <SectionHeader
      title="学生数据洞察"
      description="结合服务进度、转化漏斗、满意度与风险数据，输出趋势与策略建议。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-sm">
          <BarChart3 className="h-4 w-4" />
          导出分析报告
        </button>
      }
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">服务类型占比</h3>
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          图表占位：环形图展示语言培训/文书/网申/全程服务占比。
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">转化漏斗</h3>
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          图表占位：条形图或漏斗图显示线索 → 面谈 → 签约 → 活跃 → 完成。
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">学生满意度趋势</h3>
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          图表占位：折线图展示满意度平均分与反馈量走势。
        </div>
      </div>
      <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">风险热力图</h3>
        <div className="mt-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-600 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          图表占位：热力图展示不同服务阶段的风险分布。
        </div>
      </div>
    </div>
  </div>
);

const StudentDetailPanel: React.FC<{ student: StudentRecord | null; onClose: () => void }> = ({
  student,
  onClose,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/30 backdrop-blur-sm">
      <div className="h-full w-full max-w-4xl overflow-y-auto rounded-l-3xl border-l border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-900 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <img src={student.avatar} alt={student.name} className="h-14 w-14 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-700" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.school}</p>
                <div className="mt-2 inline-flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_TAG_CLASS[student.status]}`}>
                    {student.status}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${RISK_TAG_CLASS[student.risk]}`}>
                    风险 {student.risk}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                {student.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                {student.phone}
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-purple-500" />
                主要顾问：{student.advisor}
              </div>
              <div className="flex items-center gap-2">
                <NotebookText className="h-4 w-4 text-emerald-500" />
                任务待办：{student.tasksPending}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            关闭
          </button>
        </div>

        <div className="mt-6">
          <SectionHeader title="服务摘要" actions={<button className="text-sm text-blue-500 dark:text-blue-300">查看服务进度中心</button>} />
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {student.services.map((service) => (
              <div key={service.id} className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{service.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">负责人：{service.advisor}</p>
                  </div>
                  <span className="text-xs text-gray-400">{service.status}</span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700/60">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${service.progress}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400">{service.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">沟通记录</h3>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              最近一次沟通时间：{student.updatedAt} · 学生反馈良好，建议保持周频次沟通，关注考试压力。
            </p>
            <button className="mt-4 inline-flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300">
              查看完整沟通记录
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">AI 服务洞察</h3>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              当前处于文书冲刺阶段，建议：<br />
              1. 加强与学生沟通节奏，协调课程与文书时间。<br />
              2. 提前准备推荐信材料，避免期末高峰期。<br />
              3. 关注服务满意度变化，记录阶段亮点。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StudentStatus | '全部'>('全部');
  const [view, setView] = useState<StudentView>('list');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  const filteredStudents = useMemo(() => {
    return STUDENT_DATA.filter((student) => {
      const matchesStatus = status === '全部' || student.status === status;
      const matchesSearch =
        search.trim().length === 0 ||
        student.name.includes(search) ||
        student.email.includes(search) ||
        student.tags.some((tag) => tag.includes(search));
      return matchesStatus && matchesSearch;
    });
  }, [search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">学生管理中心</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Student Management Center</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            集中管理学生全生命周期信息，提供列表、卡片、表格、看板与洞察多视图。结合 AI 洞察、风险预警与服务进度，帮助顾问与运营高效协同，保障学生申请体验。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Download className="h-4 w-4" />
            生成学生报告
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Users className="h-4 w-4" />
            新增学生
          </button>
        </div>
      </div>

      <SummaryCards />

      <FilterBar search={search} setSearch={setSearch} status={status} setStatus={setStatus} />

      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'list', label: '列表视图', icon: <List className="h-4 w-4" /> },
            { id: 'card', label: '卡片视图', icon: <Users className="h-4 w-4" /> },
            { id: 'grid', label: '表格视图', icon: <FileSpreadsheet className="h-4 w-4" /> },
            { id: 'kanban', label: '服务看板', icon: <KanbanSquare className="h-4 w-4" /> },
            { id: 'insights', label: '数据洞察', icon: <BarChart3 className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as StudentView)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                view === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' && <ListView students={filteredStudents} onSelect={setSelectedStudent} />}

      {view === 'card' && <CardView students={filteredStudents} onSelect={setSelectedStudent} />}

      {view === 'grid' && <DataGridView students={filteredStudents} />}

      {view === 'kanban' && <KanbanView students={filteredStudents} />}

      {view === 'insights' && <InsightsView />}

      <StudentDetailPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
};

export default StudentManagementPage;

