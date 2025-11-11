import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Filter,
  History,
  LayoutPanelLeft,
  Library,
  Lightbulb,
  Loader2,
  MessageSquare,
  Pencil,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  Users,
  Workflow,
} from 'lucide-react';
import { format } from 'date-fns';

type WorkbenchTab =
  | 'dashboard'
  | 'materials'
  | 'documents'
  | 'submission'
  | 'quality'
  | 'resources';

type OwnerType = '顾问' | '文书' | '学生' | '质检';

interface TaskSummary {
  label: string;
  value: number | string;
  trend?: string;
  badgeColor: string;
  icon: React.ReactNode;
}

interface TimelineNode {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerRole: OwnerType;
  date: string;
  status: '计划中' | '进行中' | '完成';
}

interface MaterialItem {
  id: string;
  name: string;
  stage: '基础准备' | '文书提交' | '网申提交' | '签证申请';
  owner: string;
  ownerRole: OwnerType;
  status: '未开始' | '进行中' | '待学生补充' | '待审核' | '已通过';
  deadline: string;
  lastUpdated: string;
  attachments: number;
  tags?: string[];
}

interface DocumentVersion {
  id: string;
  label: string;
  createdAt: string;
  author: string;
  changeSummary: string;
}

interface DocumentItem {
  id: string;
  title: string;
  type: '个人陈述' | '推荐信' | 'Essay' | '简历';
  status: '撰写中' | '待审核' | '待学生确认' | '已定稿';
  owner: string;
  dueDate: string;
  score?: number;
  versions: DocumentVersion[];
}

interface SubmissionStage {
  id: string;
  label: string;
  status: '未开始' | '进行中' | '已完成' | '风险';
  owner: string;
  plannedDate?: string;
  completedAt?: string;
  notes?: string;
}

interface QualityTask {
  id: string;
  target: string;
  type: '文书审核' | '材料复核' | '流程合规';
  submitter: string;
  score?: number;
  status: '待审核' | '退回修改' | '已通过';
  submittedAt: string;
  tags?: string[];
}

interface ResourceItem {
  id: string;
  title: string;
  category: '优秀案例' | '写作指南' | '表格模板' | '政策解读';
  tags: string[];
  updatedAt: string;
  usageCount: number;
}

type StudentPhase = '材料准备' | '文书冲刺' | '网申递交' | '补件跟进';

interface StudentOption {
  id: string;
  name: string;
  service: string;
  phase: StudentPhase;
  educationLevel: string;
  mentors: string[];
  riskTags?: string[];
  deadlineLabel?: string;
  countdown?: string;
  serviceTags: string[];
  isFavorite?: boolean;
  allowAccess?: boolean;
}

const STUDENT_PHASE_BADGE: Record<StudentPhase, string> = {
  材料准备: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  文书冲刺: 'bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  网申递交: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  补件跟进: 'bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
};

const STUDENT_OPTIONS: StudentOption[] = [
  {
    id: 'stu-1',
    name: '李敏',
    service: '全包申请 · Stanford MSCS',
    phase: '文书冲刺',
    educationLevel: '硕士',
    mentors: ['陈慧（顾问）', '刘洋（文书）', '王璐（文书）'],
    riskTags: ['材料逾期 1', '待审核文书 2'],
    deadlineLabel: 'Essay 终稿 · 2025-11-12',
    countdown: 'D-12',
    serviceTags: ['全包申请', 'CS 专业', '北美'],
    isFavorite: true,
    allowAccess: true,
  },
  {
    id: 'stu-2',
    name: '王晨',
    service: '半 DIY · CMU ECE',
    phase: '网申递交',
    educationLevel: '硕士',
    mentors: ['张晓（顾问）', '高原（网申）'],
    riskTags: ['待补件提醒'],
    deadlineLabel: '网申提交 · 2025-11-18',
    countdown: 'D-18',
    serviceTags: ['半 DIY', '工程', '美研'],
    allowAccess: true,
  },
  {
    id: 'stu-3',
    name: '周恬',
    service: '全包申请 · LSE MSc Finance',
    phase: '材料准备',
    educationLevel: '硕士',
    mentors: ['赵琳（顾问）', '周航（文书）'],
    riskTags: ['待学生反馈'],
    deadlineLabel: '推荐信草稿 · 2025-11-09',
    countdown: 'D-9',
    serviceTags: ['金融', '英国', '全包申请'],
    allowAccess: true,
  },
  {
    id: 'stu-4',
    name: '刘岚',
    service: '语言培训 · IELTS',
    phase: '补件跟进',
    educationLevel: '本科',
    mentors: ['李月（课程）'],
    riskTags: ['成绩单待上传'],
    deadlineLabel: '成绩上传 · 2025-11-06',
    countdown: 'D-6',
    serviceTags: ['语言培训', '雅思', '冲刺'],
    allowAccess: false,
  },
];

const DEFAULT_SELECTED_STUDENT_ID = STUDENT_OPTIONS.find((item) => item.allowAccess)?.id ?? '';

const DEFAULT_FAVORITE_STUDENT_IDS = STUDENT_OPTIONS.filter((item) => item.isFavorite && item.allowAccess).map((item) => item.id);

const SUMMARY_DATA: TaskSummary[] = [
  {
    label: '当前项目',
    value: 18,
    trend: '+3 本月新增',
    badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-300',
    icon: <Workflow className="h-5 w-5 text-blue-500" />,
  },
  {
    label: '即将到期材料',
    value: 6,
    trend: '48 小时内到期',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
    icon: <Clock className="h-5 w-5 text-amber-500" />,
  },
  {
    label: '待审核文书',
    value: 4,
    trend: '平均用时 12h',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-300',
    icon: <ShieldCheck className="h-5 w-5 text-purple-500" />,
  },
  {
    label: '学生反馈',
    value: '92%',
    trend: '满意度',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300',
    icon: <MessageSquare className="h-5 w-5 text-emerald-500" />,
  },
];

const TIMELINE_DATA: TimelineNode[] = [
  {
    id: 'node-1',
    title: '确定学校与项目清单',
    description: '确认 5 所目标院校，生成材料与文书模板',
    owner: '陈慧（顾问）',
    ownerRole: '顾问',
    date: '2025-11-01',
    status: '完成',
  },
  {
    id: 'node-2',
    title: '材料准备与翻译',
    description: '成绩单、在读证明翻译完成，等待学生签字确认',
    owner: '王璐（文书）',
    ownerRole: '文书',
    date: '2025-11-05',
    status: '进行中',
  },
  {
    id: 'node-3',
    title: 'PS 初稿撰写',
    description: 'AI 辅助撰写完成，进入质检流程',
    owner: '刘洋（文书）',
    ownerRole: '文书',
    date: '2025-11-08',
    status: '进行中',
  },
  {
    id: 'node-4',
    title: '网申账号注册',
    description: '斯坦福、哥大账号已创建，需要上传基础资料',
    owner: '李敏（学生）',
    ownerRole: '学生',
    date: '2025-11-10',
    status: '计划中',
  },
];

const MATERIAL_DATA: MaterialItem[] = [
  {
    id: 'mat-1',
    name: '本科成绩单（英文、盖章）',
    stage: '基础准备',
    owner: '李敏',
    ownerRole: '学生',
    status: '待审核',
    deadline: '2025-11-12',
    lastUpdated: '2025-11-07 19:36',
    attachments: 2,
    tags: ['必需', '需盖章'],
  },
  {
    id: 'mat-2',
    name: '个人简历（最新版本）',
    stage: '文书提交',
    owner: '刘洋',
    ownerRole: '文书',
    status: '进行中',
    deadline: '2025-11-09',
    lastUpdated: '2025-11-08 10:14',
    attachments: 3,
    tags: ['AI润色'],
  },
  {
    id: 'mat-3',
    name: '财产证明',
    stage: '网申提交',
    owner: '陈慧',
    ownerRole: '顾问',
    status: '未开始',
    deadline: '2025-11-18',
    lastUpdated: '—',
    attachments: 0,
    tags: ['可选'],
  },
  {
    id: 'mat-4',
    name: '推荐信（教授）',
    stage: '文书提交',
    owner: '王璐',
    ownerRole: '文书',
    status: '待学生补充',
    deadline: '2025-11-15',
    lastUpdated: '2025-11-07 09:05',
    attachments: 1,
    tags: ['紧急', '需回访'],
  },
];

const DOCUMENT_DATA: DocumentItem[] = [
  {
    id: 'doc-1',
    title: '个人陈述 - Stanford MSCS',
    type: '个人陈述',
    status: '待审核',
    owner: '刘洋（文书）',
    dueDate: '2025-11-12',
    score: 87,
    versions: [
      {
        id: 'v3',
        label: 'V3 · 提交审核',
        createdAt: '2025-11-08 22:15',
        author: '刘洋',
        changeSummary: '强化科研经历、优化动机段落结构',
      },
      {
        id: 'v2',
        label: 'V2 · 顾问反馈',
        createdAt: '2025-11-07 18:20',
        author: '陈慧',
        changeSummary: '新增实习亮点、补充职业规划',
      },
      {
        id: 'v1',
        label: 'V1 · 初稿',
        createdAt: '2025-11-06 09:02',
        author: '刘洋',
        changeSummary: 'AI 辅助生成骨架，填充基础背景',
      },
    ],
  },
  {
    id: 'doc-2',
    title: '推荐信模板（教授 A）',
    type: '推荐信',
    status: '撰写中',
    owner: '王璐（文书）',
    dueDate: '2025-11-14',
    versions: [
      {
        id: 'v1',
        label: '骨架模板',
        createdAt: '2025-11-05 15:45',
        author: '系统模板库',
        changeSummary: '引用学校官方推荐结构',
      },
    ],
  },
  {
    id: 'doc-3',
    title: 'Essay 1 - Future Vision',
    type: 'Essay',
    status: '待学生确认',
    owner: '李敏（学生）',
    dueDate: '2025-11-10',
    score: 92,
    versions: [
      {
        id: 'v2',
        label: '定稿待确认',
        createdAt: '2025-11-08 11:06',
        author: '刘洋',
        changeSummary: '整合学生反馈，突出愿景落地性',
      },
      {
        id: 'v1',
        label: '初稿',
        createdAt: '2025-11-07 08:44',
        author: '刘洋',
        changeSummary: '构建故事线，加入案例细节',
      },
    ],
  },
];

const SUBMISSION_DATA: SubmissionStage[] = [
  {
    id: 'stage-1',
    label: '账号注册',
    status: '已完成',
    owner: '李敏',
    completedAt: '2025-11-05',
    notes: 'Stanford / Columbia / CMU 账号均已创建',
  },
  {
    id: 'stage-2',
    label: '基础信息填写',
    status: '进行中',
    owner: '李敏',
    plannedDate: '2025-11-11',
    notes: 'Stanford 表单已完成 80%，需补充奖学金板块',
  },
  {
    id: 'stage-3',
    label: '文书上传',
    status: '未开始',
    owner: '刘洋',
    plannedDate: '2025-11-15',
  },
  {
    id: 'stage-4',
    label: '材料提交',
    status: '未开始',
    owner: '陈慧',
    plannedDate: '2025-11-18',
  },
  {
    id: 'stage-5',
    label: '缴费与递交',
    status: '未开始',
    owner: '李敏',
    plannedDate: '2025-11-20',
  },
  {
    id: 'stage-6',
    label: '补件跟进',
    status: '未开始',
    owner: '陈慧',
  },
];

const QUALITY_TASKS: QualityTask[] = [
  {
    id: 'qc-1',
    target: '个人陈述 - Stanford MSCS',
    type: '文书审核',
    submitter: '刘洋（文书）',
    score: 87,
    status: '待审核',
    submittedAt: '2025-11-08 22:15',
    tags: ['语言质量', '故事线'],
  },
  {
    id: 'qc-2',
    target: '推荐信模板（教授 A）',
    type: '文书审核',
    submitter: '王璐（文书）',
    status: '退回修改',
    submittedAt: '2025-11-07 13:40',
    tags: ['格式', '内容一致性'],
  },
  {
    id: 'qc-3',
    target: '本科成绩单（英文译本）',
    type: '材料复核',
    submitter: '陈慧（顾问）',
    status: '已通过',
    score: 95,
    submittedAt: '2025-11-06 09:10',
  },
];

const RESOURCE_ITEMS: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Stanford MSCS Essay 优秀范文（2024）',
    category: '优秀案例',
    tags: ['CS', '研究生', 'Essay'],
    updatedAt: '2025-10-28',
    usageCount: 128,
  },
  {
    id: 'res-2',
    title: '个人陈述写作 5 步法',
    category: '写作指南',
    tags: ['文书技巧', '结构'],
    updatedAt: '2025-10-12',
    usageCount: 236,
  },
  {
    id: 'res-3',
    title: '财产证明模板（英语版）',
    category: '表格模板',
    tags: ['财务材料'],
    updatedAt: '2025-09-30',
    usageCount: 310,
  },
  {
    id: 'res-4',
    title: '美国 CS 项目申请要求对比（2025）',
    category: '政策解读',
    tags: ['对比', '数据更新'],
    updatedAt: '2025-11-01',
    usageCount: 76,
  },
];

const ROLE_BADGE: Record<OwnerType, string> = {
  顾问: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
  文书: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  学生: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  质检: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
};

const STATUS_BADGE: Record<string, string> = {
  未开始: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  进行中: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  待学生补充: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  待审核: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300',
  已通过: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  撰写中: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300',
  待学生确认: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  已定稿: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  风险: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
  已完成: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
  计划中: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  待审核标签: '',
};

const formatDate = (value: string) => {
  if (!value || value === '—') return '—';
  try {
    return format(new Date(value), 'yyyy/MM/dd');
  } catch {
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
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300'}`}>
    {status}
  </span>
);

const RolePill: React.FC<{ owner: string; role: OwnerType }> = ({ owner, role }) => (
  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200">
    <span className={`h-2 w-2 rounded-full ${ROLE_BADGE[role].includes('purple') ? 'bg-purple-500' : ROLE_BADGE[role].includes('blue') ? 'bg-blue-500' : ROLE_BADGE[role].includes('emerald') ? 'bg-emerald-500' : 'bg-amber-500'}`} />
    {owner}
    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${ROLE_BADGE[role]}`}>{role}</span>
  </span>
);

const StudentContextBar: React.FC<{
  students: StudentOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
}> = ({ students, selectedId, onSelect, favoriteIds, onToggleFavorite, isLoading }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const accessibleStudents = useMemo(() => students.filter((item) => item.allowAccess), [students]);
  const selectedStudent = useMemo(
    () => students.find((item) => item.id === selectedId) ?? accessibleStudents[0],
    [students, selectedId, accessibleStudents],
  );

  const filteredStudents = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return accessibleStudents;
    return accessibleStudents.filter((student) => {
      const base = [student.name, student.service, student.educationLevel, ...student.serviceTags].join(' ');
      return base.toLowerCase().includes(keyword);
    });
  }, [accessibleStudents, searchValue]);

  const handleSelect = (id: string) => {
    setIsDropdownOpen(false);
    setSearchValue('');
    onSelect(id);
  };

  if (!students.length) return null;

  const disabledActionStyle =
    'border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60';
  const activeActionStyle =
    'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600';

  return (
    <div className="rounded-3xl border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 shadow-sm p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-base font-semibold text-slate-900 dark:text-white shadow-sm hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-900/20 transition-colors"
            >
              {selectedStudent ? selectedStudent.name : '选择学生'}
              <ChevronDown className="h-4 w-4 text-slate-400" />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
            </button>
            {selectedStudent ? (
              <>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${STUDENT_PHASE_BADGE[selectedStudent.phase]}`}>
                  {selectedStudent.phase}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700/80 px-3 py-1 text-xs text-slate-600 dark:text-slate-300">
                  {selectedStudent.educationLevel}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{selectedStudent.service}</span>
              </>
            ) : (
              <span className="text-sm text-slate-500 dark:text-slate-400">请选择要查看的学生</span>
            )}
            {selectedStudent?.countdown && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 px-2.5 py-1 text-xs font-medium">
                <Clock className="h-3.5 w-3.5" />
                {selectedStudent.countdown}
              </span>
            )}
          </div>

          {selectedStudent?.allowAccess === false ? (
            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              暂无权限查看该学生，请联系管理员或主顾问开通访问。
            </div>
          ) : (
            selectedStudent && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">服务焦点</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{selectedStudent.service}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {selectedStudent.serviceTags.map((tag) => (
                      <span key={`${selectedStudent.id}-${tag}`} className="inline-flex items-center rounded-full bg-white dark:bg-slate-800 px-3 py-1 border border-slate-200 dark:border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">导师团队</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    {selectedStudent.mentors.map((mentor) => (
                      <span key={`${selectedStudent.id}-${mentor}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 border border-slate-200 dark:border-slate-700">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {mentor}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedStudent.deadlineLabel && (
                  <div className="md:col-span-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 px-4 py-4 flex flex-wrap items-center gap-3 text-sm text-blue-700 dark:text-blue-200">
                    <Calendar className="h-4 w-4" />
                    {selectedStudent.deadlineLabel}
                    {selectedStudent.countdown && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 dark:bg-blue-900/40 px-3 py-0.5 text-xs font-medium">
                        <Clock className="h-3 w-3" />
                        {selectedStudent.countdown}
                      </span>
                    )}
                  </div>
                )}
                {selectedStudent.riskTags && selectedStudent.riskTags.length > 0 && (
                  <div className="md:col-span-2 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-4 py-4 flex flex-wrap items-center gap-2">
                    {selectedStudent.riskTags.map((risk) => (
                      <span key={`${selectedStudent.id}-${risk}`} className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-300 px-3 py-1 text-xs font-medium">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {risk}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={selectedStudent?.allowAccess === false}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedStudent?.allowAccess === false ? disabledActionStyle : activeActionStyle
            }`}
          >
            <Users className="h-4 w-4" />
            管理服务
          </button>
          <button
            disabled={selectedStudent?.allowAccess === false}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
              selectedStudent?.allowAccess === false ? disabledActionStyle : activeActionStyle
            }`}
          >
            <BookOpen className="h-4 w-4" />
            打开学生详情
          </button>
          {selectedStudent && (
            <button
              onClick={() => onToggleFavorite(selectedStudent.id)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                favoriteIds.includes(selectedStudent.id)
                  ? 'border border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/60 dark:bg-amber-900/20 dark:text-amber-300'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400 hover:text-amber-500'
              }`}
            >
              <Star className={`h-4 w-4 ${favoriteIds.includes(selectedStudent.id) ? 'fill-current' : ''}`} />
              {favoriteIds.includes(selectedStudent.id) ? '取消收藏' : '收藏'}
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-slate-400 tracking-[0.2em] uppercase mb-3">搜索学生</div>
        <div className="relative">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 focus-within:border-blue-400 focus-within:bg-white dark:focus-within:bg-slate-900 transition-colors">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 120)}
              className="flex-1 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="搜索学生姓名、服务类型、阶段或顾问…"
            />
          </div>
          {isDropdownOpen && (
            <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl max-h-72 overflow-y-auto">
              {filteredStudents.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500 dark:text-slate-400 text-center">未找到匹配的学生，可尝试调整搜索条件。</div>
              ) : (
                filteredStudents.map((student) => (
                  <button
                    key={student.id}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(student.id)}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      student.id === selectedId ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{student.name}</div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{student.service}</div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STUDENT_PHASE_BADGE[student.phase]}`}>
                        {student.phase}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const SummarySection: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {SUMMARY_DATA.map((item) => (
      <div
        key={item.label}
        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-5 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-blue-50/60 dark:from-gray-800/0 dark:via-gray-800/0 dark:to-blue-900/10 pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
          <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-gray-700/60 flex items-center justify-center">
            {item.icon}
          </div>
        </div>
        <div className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
        {item.trend && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            {item.trend}
          </div>
        )}
      </div>
    ))}
  </div>
);

const TimelineSection: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="任务时间线"
      description="跨角色协作任务的关键节点与风险提示"
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Filter className="h-4 w-4" />
            筛选
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Calendar className="h-4 w-4" />
            添加里程碑
          </button>
        </>
      }
    />
    <div className="mt-6 relative">
      <div className="absolute left-4 top-0 bottom-0 border-l border-dashed border-blue-200 dark:border-blue-900/40" />
      <div className="space-y-6">
        {TIMELINE_DATA.map((node, index) => (
          <div key={node.id} className="relative pl-12">
            <div className={`absolute left-4 top-2 -translate-x-1/2 h-3 w-3 rounded-full border-4 ${node.status === '完成' ? 'border-emerald-500' : node.status === '进行中' ? 'border-blue-500' : 'border-gray-300'}`} />
            <div className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/70 p-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{node.title}</h3>
                    <StatusBadge status={node.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{node.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <RolePill owner={node.owner} role={node.ownerRole} />
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {formatDate(node.date)}
                    </span>
                  </div>
                </div>
                {index === 0 && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-3 py-1.5 text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    已完成并归档
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const MaterialsTable: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="材料清单"
      description="实时跟踪材料完成情况，支持批量操作与提醒。"
      actions={
        <>
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <UploadCloud className="h-4 w-4" />
            批量上传
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
            <ClipboardList className="h-4 w-4" />
            套用模板
          </button>
        </>
      }
    />
    <div className="mt-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3">材料名称</th>
              <th className="px-4 py-3">阶段</th>
              <th className="px-4 py-3">负责人</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">截止日期</th>
              <th className="px-4 py-3">最近更新</th>
              <th className="px-4 py-3">附件</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {MATERIAL_DATA.map((item) => (
              <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                    {item.tags && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/80 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{item.stage}</td>
                <td className="px-4 py-4">
                  <RolePill owner={item.owner} role={item.ownerRole} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300">{formatDate(item.deadline)}</td>
                <td className="px-4 py-4 text-gray-500 dark:text-gray-400">{item.lastUpdated}</td>
                <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                  {item.attachments > 0 ? `${item.attachments} 个` : '—'}
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                    <Pencil className="h-3.5 w-3.5" />
                    管理
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DocumentWorkspace: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(DOCUMENT_DATA[0]?.id ?? '');
  const selectedDocument = useMemo(
    () => DOCUMENT_DATA.find((doc) => doc.id === selectedId),
    [selectedId],
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,320px)_1fr] gap-6">
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60">
        <div className="border-b border-gray-100 dark:border-gray-700/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">文书目录</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">支持多文书并行协作</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-xs">
              <FileText className="h-3.5 w-3.5" />
              新建文书
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-700/60 px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
            <Search className="h-4 w-4" />
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="搜索文书或关键词"
            />
          </div>
        </div>
        <div className="max-h-[540px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/70">
          {DOCUMENT_DATA.map((doc) => {
            const isActive = doc.id === selectedId;
            return (
              <button
                key={doc.id}
                onClick={() => setSelectedId(doc.id)}
                className={`w-full text-left px-4 py-4 transition-colors ${
                  isActive ? 'bg-blue-50/70 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">{doc.title}</span>
                      <StatusBadge status={doc.status} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {doc.type} · 负责人：{doc.owner}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      截止：{formatDate(doc.dueDate)} · 版本 {doc.versions.length}
                    </p>
                  </div>
                  {doc.score && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 px-2 py-1 text-xs">
                      <Sparkles className="h-3.5 w-3.5" />
                      评分 {doc.score}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
        {selectedDocument ? (
          <>
            <SectionHeader
              title={selectedDocument.title}
              description="版本历史、AI 辅助及审核状态在此集中管理。"
              actions={
                <>
                  <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    AI 润色
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm">
                    <ShieldCheck className="h-4 w-4" />
                    提交审核
                  </button>
                </>
              }
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-700/60 p-4">
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">文书类型</span>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDocument.type}</p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-700/60 p-4">
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">截止时间</span>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">
                  {formatDate(selectedDocument.dueDate)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-700/60 p-4">
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">负责人</span>
                <p className="mt-2 font-semibold text-gray-900 dark:text-white">{selectedDocument.owner}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/90">
              <div className="border-b border-gray-100 dark:border-gray-700/70 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <History className="h-4 w-4" />
                  版本历史
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                  查看差异
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {selectedDocument.versions.map((version) => (
                  <div key={version.id} className="px-5 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{version.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{version.changeSummary}</p>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {version.createdAt} · {version.author}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-700/60 p-5 border border-gray-100 dark:border-gray-700/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                最近改动建议
              </div>
              <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
                <li>梳理动机段落结构，强调个人愿景与项目契合度。</li>
                <li>新增科研成果的量化指标，突出独特贡献。</li>
                <li>补充毕业后的职业计划，强化长期目标逻辑闭环。</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
            <LayoutPanelLeft className="h-12 w-12 text-gray-300" />
            选择一份文书查看详细信息
          </div>
        )}
      </div>
    </div>
  );
};

const SubmissionTracker: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="网申进度"
      description="分阶段记录网申执行状态，支持上传凭证与风险提示。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
          <UploadCloud className="h-4 w-4" />
          上传凭证
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      {SUBMISSION_DATA.map((stage) => (
        <div
          key={stage.id}
          className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 dark:text-white">{stage.label}</h3>
                <StatusBadge status={stage.status} />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">负责人：{stage.owner}</p>
              {stage.notes && (
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-300">{stage.notes}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              计划：{stage.plannedDate ? formatDate(stage.plannedDate) : '—'}
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              完成：{stage.completedAt ? formatDate(stage.completedAt) : '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QualityBoard: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="审核质检"
      description="统一管理文书与材料的质检任务，确保流程合规。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm">
          <ShieldCheck className="h-4 w-4" />
          配置质检标准
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {QUALITY_TASKS.map((task) => (
        <div
          key={task.id}
          className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">{task.target}</h3>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              类型：{task.type} · 提交人：{task.submitter}
            </p>
            {task.tags && (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>提交时间：{task.submittedAt}</span>
              {task.score && (
                <span className="inline-flex items-center gap-1 text-emerald-500 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  评分 {task.score}
                </span>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
                返回修改
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 text-xs">
                通过
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ResourceGrid: React.FC = () => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-6">
    <SectionHeader
      title="资源模板库"
      description="沉淀高质量案例、写作指南与模板，支持快速引用。"
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
          <UploadCloud className="h-4 w-4" />
          上传资源
        </button>
      }
    />
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {RESOURCE_ITEMS.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800/80 p-4 shadow-sm hover:border-blue-200 dark:hover:border-blue-700/70 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 px-2.5 py-1 text-xs font-medium">
              {item.category}
            </span>
            <span className="text-xs text-gray-400">引用 {item.usageCount}</span>
          </div>
          <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white leading-6">{item.title}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/80 px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>更新：{formatDate(item.updatedAt)}</span>
            <button className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-300">
              应用
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TAB_CONFIG: Array<{
  id: WorkbenchTab;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}> = [
  { id: 'dashboard', label: '任务总览', icon: <Workflow className="h-4 w-4" /> },
  { id: 'materials', label: '材料清单', badge: '4', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'documents', label: '文书工作台', icon: <BookOpen className="h-4 w-4" /> },
  { id: 'submission', label: '网申进度', icon: <UploadCloud className="h-4 w-4" /> },
  { id: 'quality', label: '审核质检', badge: '2', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 'resources', label: '资源模板库', icon: <Library className="h-4 w-4" /> },
];

const ApplicationWorkbenchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<WorkbenchTab>('dashboard');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(DEFAULT_SELECTED_STUDENT_ID);
  const [favoriteStudentIds, setFavoriteStudentIds] = useState<string[]>(DEFAULT_FAVORITE_STUDENT_IDS);
  const [isSwitchingStudent, setIsSwitchingStudent] = useState(false);
  const switchTimerRef = useRef<number | null>(null);

  const handleSelectStudent = useCallback(
    (id: string) => {
      if (id === selectedStudentId) return;
      const targetStudent = STUDENT_OPTIONS.find((student) => student.id === id && student.allowAccess);
      if (!targetStudent) return;

      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current);
      }

      setIsSwitchingStudent(true);
      setSelectedStudentId(id);

      switchTimerRef.current = window.setTimeout(() => setIsSwitchingStudent(false), 350);
    },
    [selectedStudentId],
  );

  const handleToggleFavorite = useCallback((id: string) => {
    setFavoriteStudentIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">文书申请工作台</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Application Workbench</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            整合文书撰写、材料清单、网申操作、审核质检与模板资源的核心工作台，帮助团队高效推进每一位学生的申请项目。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60">
            <Users className="h-4 w-4" />
            分配团队
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
            <Pencil className="h-4 w-4" />
            新建申请项目
          </button>
        </div>
      </div>

      <StudentContextBar
        students={STUDENT_OPTIONS}
        selectedId={selectedStudentId}
        onSelect={handleSelectStudent}
        favoriteIds={favoriteStudentIds}
        onToggleFavorite={handleToggleFavorite}
        isLoading={isSwitchingStudent}
      />

      <div
        className={`space-y-6 transition-opacity duration-200 ${isSwitchingStudent ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}
      >
        <SummarySection />

        <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 p-2">
          <div className="flex flex-wrap gap-2">
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.badge && (
                    <span
                      className={`ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full text-[11px] ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,520px)_1fr] gap-6">
            <TimelineSection />
            <div className="space-y-6">
              <MaterialsTable />
            </div>
          </div>
        )}

        {activeTab === 'materials' && <MaterialsTable />}

        {activeTab === 'documents' && <DocumentWorkspace />}

        {activeTab === 'submission' && <SubmissionTracker />}

        {activeTab === 'quality' && <QualityBoard />}

        {activeTab === 'resources' && <ResourceGrid />}
      </div>
    </div>
  );
};

export default ApplicationWorkbenchPage;

