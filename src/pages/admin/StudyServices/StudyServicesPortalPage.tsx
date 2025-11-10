import React from 'react';
import {
  ArrowRight,
  BookOpen,
  ClipboardList,
  GraduationCap,
  History,
  LayoutDashboard,
  Sparkles,
  Compass,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUBMODULES = [
  {
    id: 'students',
    title: '学生管理中心',
    description: '统一管理学生全生命周期信息，提供列表、卡片、表格、看板、洞察多种视图，并嵌套服务详情与AI洞察。',
    icon: <Users className="h-10 w-10 text-blue-500" />,
    route: '/admin/students',
    tags: ['学生档案', '服务进度', 'AI 洞察'],
  },
  {
    id: 'mentors',
    title: '导师管理中心',
    description: '掌握导师档案、能力、排班、任务与绩效数据，支持AI推荐与风险预警，实现导师资源高效调度。',
    icon: <GraduationCap className="h-10 w-10 text-purple-500" />,
    route: '/admin/mentors',
    tags: ['导师档案', '排班', '绩效'],
  },
  {
    id: 'school-selection-planner',
    title: '选校规划中心',
    description: '整合 AI 智能推荐、人工筛选与协同会议工具，沉淀选校方案与决策档案。',
    icon: <Compass className="h-10 w-10 text-cyan-500" />,
    route: '/admin/school-selection-planner',
    tags: ['AI 推荐', '人工筛选', '协同会议'],
  },
  {
    id: 'service-chronology',
    title: '服务进度中心',
    description: '以时间线串联服务里程碑、材料文书、风险与统计，提供可视化进度与档案沉淀。',
    icon: <History className="h-10 w-10 text-indigo-500" />,
    route: '/admin/service-chronology',
    tags: ['时间线', '风险雷达', '档案'],
  },
  {
    id: 'application-workbench',
    title: '文书与申请工作台',
    description: '整合文书撰写、材料清单、网申进度与质检，打造协同工作空间并提供AI辅助能力。',
    icon: <BookOpen className="h-10 w-10 text-emerald-500" />,
    route: '/admin/application-workbench',
    tags: ['文书协同', '材料管理', '网申'],
  },
  {
    id: 'project-mission-board',
    title: '项目任务控制台',
    description: '集中管理项目任务、看板、个人任务、日历与分析，支持自动化和AI建议。',
    icon: <ClipboardList className="h-10 w-10 text-rose-500" />,
    route: '/admin/project-mission-board',
    tags: ['任务看板', '自动化', '绩效'],
  },
];

const StudyServicesPortalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">留学服务总览</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Study Services Portal</p>
          <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400 leading-6">
            聚合学生、导师、服务进度、文书申请和项目任务等核心子模块，构建一体化的留学服务工作枢纽。
            通过指标面板、快捷入口与AI洞察，帮助团队快速了解业务运行情况并跳转到对应模块。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/admin/students')}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
          >
            前往学生管理
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/admin/project-mission-board')}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
          >
            查看任务看板
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { title: '在读学生', value: '128', delta: '+12 本月新增' },
          { title: '活跃导师', value: '36', delta: '+4 活跃' },
          { title: '服务进度均值', value: '68%', delta: '+5% 晋升' },
          { title: '文书满意度', value: '4.7', delta: '+0.2 上升' },
          { title: '风险项目', value: '6', delta: '-3 稳定' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-lg transition-shadow"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {card.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {SUBMODULES.map((module) => (
          <div
            key={module.id}
            className="flex h-full flex-col rounded-2xl border border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-gray-700/60">
                  {module.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{module.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Starfleet Academy / {module.title}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(module.route)}
                className="rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
              >
                进入
              </button>
            </div>
            <p className="mt-4 flex-1 text-sm text-gray-600 dark:text-gray-300 leading-6">{module.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              {module.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700/70 px-2 py-1 text-xs text-gray-600 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => navigate(module.route)}
              className="mt-6 inline-flex items-center gap-2 text-sm text-blue-500 dark:text-blue-300"
            >
              查看模块详情
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyServicesPortalPage;

