import type { ComponentType } from 'react';
import {
  LayoutGrid,
  ListTodo,
  Users,
  GraduationCap,
  ClipboardList,
  FileCheck,
  Globe2,
  UserSquare2,
  FileText,
  PieChart,
  Layers,
  Brain,
  Calendar,
  LayoutDashboard,
  Handshake,
  MessageCircle,
  Compass,
  CalendarClock,
  Library,
  Laptop,
  Briefcase,
} from 'lucide-react';

export type AppCenterUserRole = 'admin' | 'student' | 'guest';

export interface AppFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: ComponentType<{ className?: string }>;
  rolesAllowed: AppCenterUserRole[];
  badge?: '热门' | '新上线';
  tags?: string[];
}

export const MAX_FAVORITES = 6;

export const APP_FEATURES: AppFeature[] = [
  {
    id: 'dashboard',
    title: '控制台',
    description: '一眼掌握团队进展和关键提醒',
    category: '核心工作台',
    icon: LayoutGrid,
    rolesAllowed: ['admin', 'student', 'guest'],
    badge: '热门',
    tags: ['概览'],
  },
  {
    id: 'tasks',
    title: '任务管理',
    description: '跟进个人与团队待办事项',
    category: '核心工作台',
    icon: ListTodo,
    rolesAllowed: ['admin', 'student'],
    tags: ['执行'],
  },
  {
    id: 'applications',
    title: '申请进度',
    description: '随时检查申请状态与剩余事项',
    category: '核心工作台',
    icon: FileCheck,
    rolesAllowed: ['admin', 'student'],
    tags: ['流程'],
  },
  {
    id: 'students',
    title: '学生管理',
    description: '快速查看学生档案与进度',
    category: '客户与项目',
    icon: Users,
    rolesAllowed: ['admin'],
    tags: ['客户'],
  },
  {
    id: 'service-chronology',
    title: '服务进度',
    description: '用时间轴记录每个学生的服务里程碑',
    category: '客户与项目',
    icon: LayoutDashboard,
    rolesAllowed: ['admin'],
    tags: ['流程'],
  },
  {
    id: 'application-workbench',
    title: '文书工作台',
    description: '协作撰写和管理申请文书',
    category: '客户与项目',
    icon: ClipboardList,
    rolesAllowed: ['admin'],
    tags: ['文书'],
  },
  {
    id: 'school-selection-planner',
    title: '选校规划',
    description: '梳理申请策略与选校组合',
    category: '客户与项目',
    icon: Compass,
    rolesAllowed: ['admin', 'student'],
    tags: ['规划'],
  },
  {
    id: 'project-marketplace',
    title: '项目市场',
    description: '浏览可向学生推荐的项目资源',
    category: '客户与项目',
    icon: Globe2,
    rolesAllowed: ['admin'],
    badge: '新上线',
    tags: ['资源'],
  },
  {
    id: 'mentor-marketplace',
    title: '导师人才市场',
    description: '挑选行业导师并同步团队协作',
    category: '客户与项目',
    icon: UserSquare2,
    rolesAllowed: ['admin'],
    tags: ['导师'],
  },
  {
    id: 'professor-directory',
    title: '全球教授库',
    description: '按学校与研究方向筛选教授',
    category: '知识与资源',
    icon: GraduationCap,
    rolesAllowed: ['admin'],
    tags: ['资料'],
  },
  {
    id: 'phd-opportunities',
    title: '全球博士岗位',
    description: '查看博士岗位、资助与申请流程示例',
    category: '知识与资源',
    icon: GraduationCap,
    rolesAllowed: ['admin', 'student'],
    tags: ['博士'],
  },
  {
    id: 'knowledge-hub/market',
    title: '知识花园',
    description: '从知识中心获取最新运营素材',
    category: '知识与资源',
    icon: Layers,
    rolesAllowed: ['admin'],
    tags: ['资料'],
  },
  {
    id: 'knowledge',
    title: '知识库',
    description: '速览精选攻略与模版合集',
    category: '知识与资源',
    icon: Library,
    rolesAllowed: ['admin', 'student'],
    tags: ['学习'],
  },
  {
    id: 'crm-lead-list',
    title: '客户线索',
    description: '集中跟进顾问与市场线索',
    category: '销售与运营',
    icon: MessageCircle,
    rolesAllowed: ['admin'],
    tags: ['CRM'],
  },
  {
    id: 'crm-contract-dock',
    title: '合同与签约',
    description: '管理签约流程与合同状态',
    category: '销售与运营',
    icon: Handshake,
    rolesAllowed: ['admin'],
    tags: ['CRM'],
  },
  {
    id: 'partner-management',
    title: '合作方管理',
    description: '统一维护高校、导师与机构合作方档案',
    category: '销售与运营',
    icon: Handshake,
    rolesAllowed: ['admin'],
    badge: '新上线',
    tags: ['合作'],
  },
  {
    id: 'crm-client-insights',
    title: '客户分群',
    description: '用数据洞察不同客户群体',
    category: '销售与运营',
    icon: PieChart,
    rolesAllowed: ['admin'],
    tags: ['分析'],
  },
  {
    id: 'meetings',
    title: '会议管理',
    description: '安排团队会议与重点纪要',
    category: '团队协作',
    icon: Calendar,
    rolesAllowed: ['admin', 'student'],
    tags: ['协作'],
  },
  // 教育培训相关功能 - 暂时隐藏
  // {
  //   id: 'education-training/learner-portal',
  //   title: '学习中心',
  //   description: '学生课表、作业与课堂回放',
  //   category: '学习服务',
  //   icon: Laptop,
  //   rolesAllowed: ['student', 'admin'],
  //   tags: ['学习'],
  // },
  // {
  //   id: 'education-training/scheduling-classroom',
  //   title: '排课与教室',
  //   description: '统一安排课程表与教室资源',
  //   category: '学习服务',
  //   icon: CalendarClock,
  //   rolesAllowed: ['admin'],
  //   tags: ['教学'],
  // },
  {
    id: 'finance-suite',
    title: '财务中台',
    description: '实时掌握营收与费用结构',
    category: '运营支持',
    icon: Briefcase,
    rolesAllowed: ['admin'],
    tags: ['财务'],
  },
];

export const FEATURE_CATEGORIES = Array.from(
  new Set(APP_FEATURES.map((feature) => feature.category)),
);

export const getDefaultFavorites = (role: AppCenterUserRole): string[] => {
  if (role === 'student') {
    return [
      'dashboard',
      'tasks',
      'applications',
      'knowledge',
      // 'education-training/learner-portal', // 暂时隐藏
      'meetings',
    ].filter((id) => APP_FEATURES.some((feature) => feature.id === id));
  }

  return [
    'dashboard',
    'students',
    'service-chronology',
    'crm-lead-list',
    'project-marketplace',
    'professor-directory',
  ].filter((id) => APP_FEATURES.some((feature) => feature.id === id));
};

