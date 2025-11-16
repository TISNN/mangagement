import React from 'react';
import {
  ArrowUpRight,
  BookMarked,
  BookOpen,
  ChevronRight,
  FolderKanban,
  LayoutGrid,
  Plus,
  Search,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';

type KnowledgeLibrary = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  updatedAt: string;
  owner: string;
  badge?: string;
};

type Shortcut = {
  id: string;
  label: string;
  helper: string;
};

type Announcement = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

const FEATURED_LIBRARIES: KnowledgeLibrary[] = [
  {
    id: 'lib-001',
    name: '学屿教育',
    description: '顾问培训、流程手册、项目执行模板等核心资料，支持团队协同和对外交付。',
    icon: BookOpen,
    category: '旗舰知识库',
    updatedAt: '今天 09:30',
    owner: '学屿教育 PMO',
    badge: '推荐',
  },
  {
    id: 'lib-002',
    name: '留学大模型研发',
    description: '沉淀大模型研发布局、Prompt 测试报告与上线迭代日志。',
    icon: Sparkles,
    category: 'AI 协作',
    updatedAt: '昨天 22:10',
    owner: '智能研发组',
  },
  {
    id: 'lib-003',
    name: '示例知识库 / Wiki samples',
    description: '标准模板参考，帮助你快速搭建高质量知识库结构。',
    icon: BookMarked,
    category: '模板资源',
    updatedAt: '11月5日',
    owner: '知识运营',
  },
];

const ALL_LIBRARIES: KnowledgeLibrary[] = [
  ...FEATURED_LIBRARIES,
  {
    id: 'lib-004',
    name: '顾问文书手册',
    description: '覆盖从访谈到初稿、修改与终稿的文书全流程最佳实践。',
    icon: FolderKanban,
    category: '顾问支持',
    updatedAt: '今天 11:05',
    owner: '顾问交付中心',
  },
  {
    id: 'lib-005',
    name: '机构合作运营',
    description: '记录合作机构 onboarding、权益配置与渠道运营策略。',
    icon: Users,
    category: '机构共建',
    updatedAt: '11月8日',
    owner: '渠道商务部',
  },
  {
    id: 'lib-006',
    name: '营销增长实验室',
    description: '沉淀营销内容生产流程、活动复盘与增长实验案例。',
    icon: LayoutGrid,
    category: '市场增长',
    updatedAt: '11月3日',
    owner: '市场团队',
  },
];

const SHORTCUTS: Shortcut[] = [
  { id: 'sc-1', label: '顾问培训资料', helper: '面向新人顾问的培训素材包' },
  { id: 'sc-2', label: '项目执行 SOP', helper: '按项目阶段拆解的操作手册' },
  { id: 'sc-3', label: '机构合作专区', helper: '对外共享可直接落地的模板' },
  { id: 'sc-4', label: 'AI Prompt 仓库', helper: '汇总高评分 Prompt 与使用指南' },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '知识库上线审核新增「三权校验」流程',
    detail: '发布前自动检查所有权、使用权、外部可见范围，保障合规。',
    time: '今天 08:30',
  },
  {
    id: 'ann-2',
    title: 'AI 智能检索已支持知识库全文联想',
    detail: '输入关键词可匹配知识库、文档与内部问答，多端统一入口。',
    time: '昨日 21:10',
  },
];

const categoryColorMap: Record<string, string> = {
  旗舰知识库: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200',
  'AI 协作': 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-200',
  模板资源: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-200',
  顾问支持: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-200',
  机构共建: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200',
  市场增长: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-200',
};

const KnowledgeLibraryCard: React.FC<{ library: KnowledgeLibrary }> = ({ library }) => {
  const Icon = library.icon;
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${categoryColorMap[library.category] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300'}`}>
            <Icon className="h-3.5 w-3.5" />
            {library.category}
          </span>
          {library.badge && (
            <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-600 dark:bg-rose-900/40 dark:text-rose-200">
              {library.badge}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{library.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{library.description}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          <span>{library.owner}</span>
        </div>
        <span>{library.updatedAt}</span>
      </div>
    </div>
  );
};

const CloudDocsKnowledgeLegacyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="relative flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
              <BookMarked className="h-3.5 w-3.5" />
              知识库中心（旧版）
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">凝聚团队知识力量</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                根据顾问、机构、运营等角色打造知识库集合，沉淀流程手册、工具模板与策略复盘。提供一站式搜索、收藏与协作体验。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">🔎 全局检索</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">📌 收藏夹</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">🧭 场景导航</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <Sparkles className="h-4 w-4" />
                进入知识库
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Plus className="h-4 w-4" />
                新建知识库
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-sm text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200">
            <div className="text-xs uppercase tracking-widest text-indigo-500 dark:text-indigo-300">今日概览</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>知识库总数</span>
                <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-200">28</span>
              </div>
              <div className="flex items中心 justify-between">
                <span>活跃成员</span>
                <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-200">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span>待审核内容</span>
                <span className="text-xl font-semibold text-indigo-600 dark:text-indigo-200">6</span>
              </div>
            </div>
            <div className="rounded-xl border border-indigo-200/70 bg-white/80 px-4 py-3 text-xs leading-5 text-indigo-700 shadow-sm dark:border-indigo-500/40 dark:bg-indigo-900/30 dark:text-indigo-100">
              风控提醒：3 个知识库存在外部共享链接超过 30 天未更新，请尽快同步版本。
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify之间 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">热门知识库</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">围绕顾问服务、机构合作与研发生态的重点知识域。</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <Search className="h-4 w-4" />
            搜索知识库
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_LIBRARIES.map((library) => (
            <KnowledgeLibraryCard key={library.id} library={library} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">全部知识库</h2>
            <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">管理分组</button>
          </div>
          <div className="mt-4 space-y-4">
            {ALL_LIBRARIES.map((library) => (
              <div key={library.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Tag className="h-3.5 w-3.5 text-indigo-500" />
                      {library.category}
                    </div>
                    <div>
                      <div className="text-base font-semibold text-slate-900 dark:text-white">{library.name}</div>
                      <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{library.description}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <Users className="h-3.5 w-3.5" />
                      负责人：{library.owner}
                      <span className="inline-flex items-center gap-1 text-[11px]">
                        <ArrowUpRight className="h-3 w-3" />
                        更新：{library.updatedAt}
                      </span>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                    查看详情
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg白色 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text白色">快捷入口</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">自定义</button>
            </div>
            <div className="mt-4 space-y-3">
              {SHORTCUTS.map((item) => (
                <button key={item.id} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text白色">{item.label}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.helper}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text白色">公告与更新</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">查看历史</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {ANNOUNCEMENTS.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="text-sm font-semibold text-slate-900 dark:text白色">{item.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</p>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CloudDocsKnowledgeLegacyPage;

