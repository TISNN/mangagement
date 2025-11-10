import React from 'react';
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  Filter,
  LayoutGrid,
  Library,
  ListChecks,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Tag,
} from 'lucide-react';

interface TeamCard {
  id: string;
  name: string;
  description: string;
  members: number;
  leader: string;
  documents: number;
  updatedAt: string;
  focus: string[];
}

interface CatalogItem {
  id: string;
  title: string;
  category: string;
  stage: '草稿' | '审核中' | '已发布';
  owner: string;
  updatedAt: string;
  tags: string[];
  audience: string;
}

interface ActivityItem {
  id: string;
  type: '发布' | '评论' | '更新';
  actor: string;
  content: string;
  time: string;
  link?: string;
}

const TEAMS: TeamCard[] = [
  {
    id: 'team-1',
    name: '北美顾问案例库',
    description: '沉淀美国/加拿大成功案例、选校策略与文书模板，为顾问与市场活动提供素材。',
    members: 24,
    leader: '赵婧怡',
    documents: 186,
    updatedAt: '2025-11-08 09:40',
    focus: ['留学案例', '材料模板', 'SOP'],
  },
  {
    id: 'team-2',
    name: '语言培训教研组',
    description: '聚合 IELTS/TOEFL 各科目教学内容、线上课程脚本与课堂反馈。',
    members: 18,
    leader: '培训团队',
    documents: 92,
    updatedAt: '2025-11-07 21:15',
    focus: ['IELTS', '听说读写', '直播课'],
  },
  {
    id: 'team-3',
    name: 'B2B 合作支持',
    description: '服务合作高校/机构的培训资料、产品手册、售后 FAQ 与授权协议。',
    members: 12,
    leader: '刘珂',
    documents: 64,
    updatedAt: '2025-11-07 17:50',
    focus: ['B 端培训', '售后支持', '授权文件'],
  },
];

const CATALOG: CatalogItem[] = [
  {
    id: 'c1',
    title: 'MIT CS 项目申请全链路模板',
    category: '案例模板',
    stage: '已发布',
    owner: '北美顾问案例库',
    updatedAt: '11-08 08:35',
    tags: ['留学案例', '进阶'],
    audience: '顾问内部',
  },
  {
    id: 'c2',
    title: 'IELTS 口语一对一课堂脚本（11 月版）',
    category: '课程脚本',
    stage: '审核中',
    owner: '语言培训教研组',
    updatedAt: '11-07 22:15',
    tags: ['口语', '课程包'],
    audience: '学生可见',
  },
  {
    id: 'c3',
    title: 'B2B 产品培训：企业入门课程',
    category: '企业培训',
    stage: '草稿',
    owner: 'B2B 合作支持',
    updatedAt: '11-07 19:40',
    tags: ['企业培训', '授权'],
    audience: '合作机构',
  },
  {
    id: 'c4',
    title: '高压家长情绪缓解话术库',
    category: '话术模板',
    stage: '已发布',
    owner: '服务质控组',
    updatedAt: '11-06 18:05',
    tags: ['服务交付', '风险处理'],
    audience: '顾问内部',
  },
];

const ACTIVITIES: ActivityItem[] = [
  { id: 'a1', type: '发布', actor: '培训团队', content: '《IELTS 听力 21 天课程》已上线并同步知识花园订阅', time: '1 小时前', link: '#' },
  { id: 'a2', type: '更新', actor: '服务质控', content: '《签证风险处理指引》更新 2.1 版，新增学生沟通模板', time: '昨天 22:10' },
  { id: 'a3', type: '评论', actor: '刘珂', content: '在《企业产品 FAQ》中回复合作高校顾问的问题', time: '昨天 17:45', link: '#' },
  { id: 'a4', type: '发布', actor: '北美顾问案例库', content: '《北美 2025 申诉信合集》提交花园审核，预计 24h 内上线', time: '昨天 15:30' },
];

const stageColor: Record<CatalogItem['stage'], string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
  审核中: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  已发布: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const activityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case '发布':
      return <Sparkles className="h-3.5 w-3.5" />;
    case '评论':
      return <MessageSquare className="h-3.5 w-3.5" />;
    case '更新':
    default:
      return <Activity className="h-3.5 w-3.5" />;
  }
};

const KnowledgeHubTeamSpacePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">团队空间</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Team Space · 团队知识资产与协作中心</p>
          <p className="max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            管理按团队划分的知识资产，支持目录结构、权限、协作评论与对外发布策略。快速定位热门内容、风险提醒与待办任务。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Users className="h-4 w-4" />
            创建团队空间
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            <Sparkles className="h-4 w-4" />
            导入目录模板
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">我管理 / 加入的团队</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">查看各团队的内容资产、责任人和最新动态。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="h-9 rounded-lg border border-gray-200 pl-9 pr-3 text-sm shadow-sm outline-none transition hover:border-indigo-200 focus:border-indigo-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                placeholder="搜索团队"
              />
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Filter className="hidden" />
              管理入口
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TEAMS.map((team) => (
            <div key={team.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600 shadow-sm transition hover:border-indigo-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300">
              <div className="flex items-center justify-between text-sm font-semibold text-gray-900 dark:text-white">
                <span>{team.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                  <Library className="h-3 w-3" /> {team.documents} 文档
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">{team.description}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> 成员 {team.members}</div>
                <div className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 负责人 {team.leader}</div>
                <div className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> 更新 {team.updatedAt}</div>
                <div className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> 专注领域</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                {team.focus.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                    <Tag className="h-3 w-3" /> {item}
                  </span>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-xs hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                进入空间 <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">目录与文档列表</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">根据分类与审批状态查看团队知识资产。</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <LayoutGrid className="h-3.5 w-3.5" /> 目录管理
              </button>
              <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                <ListChecks className="h-3.5 w-3.5" /> 批量操作
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {CATALOG.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${stageColor[item.stage]}`}>{item.stage}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><Library className="h-3 w-3" /> {item.category}</span>
                  <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> 团队：{item.owner}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> 更新 {item.updatedAt}</span>
                  <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> 受众：{item.audience}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                  {item.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover;border-indigo-500 dark:hover:text-indigo-300">
                    <BookOpen className="h-3.5 w-3.5" /> 查看详情
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover;border-emerald-500 dark:hover:text-emerald-300">
                    <Sparkles className="h-3.5 w-3.5" /> 推荐到花园
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-amber-200 hover:text-amber-600 dark:border-gray-600 dark:hover;border-amber-500 dark:hover:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5" /> 申请外发
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">团队动态</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">实时追踪团队发布、更新与互动。</p>
            </div>
            <button className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Activity className="h-3.5 w-3.5" /> 订阅
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            {ACTIVITIES.map((activity) => (
              <div key={activity.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 leading-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/40">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 dark:text-indigo-300">
                  {activityIcon(activity.type)}
                  <span>{activity.type}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{activity.actor} · {activity.time}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{activity.content}</div>
                {activity.link && (
                  <button className="mt-2 inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 text-xs hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    进入详情 <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHubTeamSpacePage;
