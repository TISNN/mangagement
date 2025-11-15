import React from 'react';
import {
  BookMarked,
  BookOpen,
  Bookmark,
  Briefcase,
  Building,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Layers,
  Pin,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from 'lucide-react';

type NavSection = {
  id: string;
  title: string;
  items: string[];
};

type LibraryCard = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  badge?: string;
};

type UpdateItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
};

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'project',
    title: '项目申报',
    items: ['项目概览', '进度甘特图', '节点事项', '风险记录'],
  },
  {
    id: 'document',
    title: '文档协同',
    items: ['顾问交付（最新）', '顾问交付（归档）', '机构共享版本', '外部素材接入'],
  },
  {
    id: 'knowledge',
    title: '知识模板',
    items: ['面试资料', '申请方案', '渠道运营', '营销内容'],
  },
  {
    id: 'operation',
    title: '运营治理',
    items: ['权限设置', '发布审核', 'AI 辅助建议', '历史版本'],
  },
];

const FEATURED_LIBRARIES: LibraryCard[] = [
  {
    id: 'lib-1',
    title: '学鸢教育旗舰知识库',
    description: '覆盖在线咨询、顾问交付、运营复盘等全业务流程，是核心成员共创与培训的核心阵地。',
    highlights: ['142 名成员协作', '132 篇知识条目', '外部共享 26 条'],
    badge: '旗舰',
  },
  {
    id: 'lib-2',
    title: '留学大模型研发',
    description: '沉淀 Prompt 迭代、模型评测与上线 SOP，帮助产品与运营团队快速对齐节奏。',
    highlights: ['48 条实验记录', 'AI Prompt 仓库'],
  },
  {
    id: 'lib-3',
    title: '机构合作交付模板',
    description: '标准化 POC、授课手册、风险说明，支持渠道伙伴复制成熟的交付经验。',
    highlights: ['适配 14 家机构', '新增模板 6 套'],
  },
];

const QUICK_LINKS = [
  { id: 'ql-1', label: '项目申报会议纪要', helper: '三次周会行动项追踪' },
  { id: 'ql-2', label: '面试资料与模板合集', helper: '更新日期：2024-11-12' },
  { id: 'ql-3', label: 'AI 辅助问答库', helper: '高分 Prompt 集合' },
  { id: 'ql-4', label: '机构共享版（外部）', helper: '自动脱敏敏感信息' },
];

const UPDATE_FEED: UpdateItem[] = [
  {
    id: 'up-1',
    title: '顾问交付资料统一迁移至「申研五步法」框架',
    detail: '补齐项目背景、学术规划、实习案例三大板块，并新增 AI 复核流程。',
    time: '今天 11:20',
  },
  {
    id: 'up-2',
    title: '《2025 申研项目执行总览》发布机构访问版',
    detail: '自动生成对外版本，隐藏学生隐私字段并附带关键节点说明。',
    time: '昨天 21:05',
  },
  {
    id: 'up-3',
    title: 'AI 推荐 3 篇高评分面试模板，建议收录至教学模板库',
    detail: '涵盖金融、管理、计算机三大方向的实战案例复盘。',
    time: '昨天 18:40',
  },
];

const KnowledgeHubWorkspacePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-[url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center shadow-sm">
        <div className="bg-slate-900/70 p-8 text-indigo-50">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
                <Layers className="h-3.5 w-3.5" />
                知识协作空间 · 旧版视图
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold leading-tight">小满申请档案汇总</h1>
                <p className="max-w-3xl text-sm leading-6 text-indigo-100/80">
                  以顾问项目为主线，归档申请资料、面试素材、运营复盘与机构共享版本。支持多角色协作、AI 辅助补全、风控留痕与多维目录管理。
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-indigo-100/70">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">👥 顾问 / 教研 / 机构联合协作</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🗂️ 多层目录与权限策略</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">⚡ AI 推荐 / 快速检索入口</span>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl bg-white/10 p-6 text-center text-indigo-50">
              <div>
                <div className="text-2xl font-semibold">42</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-indigo-100/70">活跃协作者</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">18</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-indigo-100/70">待推进事项</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">6</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-indigo-100/70">外部共享版本</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">项目目录</div>
          <nav className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            {NAV_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                  <Pin className="h-3.5 w-3.5 text-indigo-500" />
                  {section.title}
                </div>
                <ul className="space-y-1 pl-5 text-xs text-slate-500 dark:text-slate-400">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <header>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">愿景和目标</h2>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  统一团队对项目的目标认知与业务背景，明确顾问、教研、机构伙伴在各阶段的协作方式。
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                <Sparkles className="h-4 w-4" />
                AI 快速总结
              </button>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-slate-600 dark:text-slate-300 lg:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">项目目标</div>
                <p className="mt-2 leading-6">
                  以申请结果为导向，产出可复用的案例与策略，为机构与内部培训提供标准化范本。
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">关键成果</div>
                <ul className="mt-2 space-y-2 text-xs leading-5">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 产出面试、文书、背景提升三大模块交付物</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 对外发布机构共享包，形成标准化产品</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> 完成服务复盘并纳入知识库培训</li>
                </ul>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">角色分工</div>
                <div className="mt-2 space-y-2 text-xs leading-5">
                  <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-indigo-500" /> 顾问团队：执行方案设计与沟通节奏</div>
                  <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-indigo-500" /> 教研与面试官：提供素材与模拟训练</div>
                  <div className="flex items-center gap-2"><Building className="h-3.5 w-3.5 text-indigo-500" /> 合作机构：同步招生节奏与交付要求</div>
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">常用文档与链接</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.id}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                >
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{link.label}</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{link.helper}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}
            </div>
          </section>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">重点知识库</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">围绕顾问服务、机构合作与研发迭代的知识阵地。</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <BookMarked className="h-4 w-4" />
            管理收藏
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FEATURED_LIBRARIES.map((library) => (
            <div key={library.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">{library.title}</span>
                  {library.badge && (
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-[10px] font-semibold text-rose-600 dark:bg-rose-900/40 dark:text-rose-200">
                      {library.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">{library.description}</p>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-5">
                {library.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">协作动态</h2>
            <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">查看全部</button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {UPDATE_FEED.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
                <div className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                <div className="mt-2 text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">治理策略</div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-1 h-4 w-4 text-indigo-500" />
                外部共享需通过三权校验（所有权 / 使用权 / 外部可见范围）后才能发布。
              </li>
              <li className="flex items-start gap-2">
                <Globe2 className="mt-1 h-4 w-4 text-indigo-500" />
                系统自动生成机构访问版本，发布前会对敏感字段进行脱敏处理。
              </li>
              <li className="flex items-start gap-2">
                <FileText className="mt-1 h-4 w-4 text-indigo-500" />
                协作完成后统一进入归档流程，保留版本记录和 AI 生成摘要。
              </li>
              <li className="flex items-start gap-2">
                <Briefcase className="mt-1 h-4 w-4 text-indigo-500" />
                顾问交付模板同步至培训与知识库，方便新人快速上手。
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">快捷动作</div>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">更多</button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60">
                <span>生成机构共享版</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60">
                <span>导出项目脉搏</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
              <button className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60">
                <span>同步至知识库</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default KnowledgeHubWorkspacePage;

