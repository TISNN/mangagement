import React from 'react';
import {
  FilePlus,
  UploadCloud,
  Users,
  Star,
  Clock,
  MessageSquare,
  Share2,
  Search,
  Settings,
  FileText,
  Folder,
  Sparkles,
} from 'lucide-react';

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
};

type RecentDocument = {
  id: string;
  name: string;
  owner: string;
  updatedAt: string;
  location: string;
  status: '草稿' | '进行中' | '已归档';
};

type WorkspaceShortcut = {
  id: string;
  name: string;
  description: string;
  members: number;
  badge?: string;
};

type FolderShortcut = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight: string;
  helper: string;
};

type FeedItem = {
  id: string;
  type: 'comment' | 'share' | 'update';
  detail: string;
  actor: string;
  time: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'qa-create-doc',
    title: '新建云文档',
    description: '选择协作文档模板，立即开始多人实时编辑。',
    icon: FilePlus,
    actionLabel: '创建文档',
  },
  {
    id: 'qa-upload',
    title: '上传本地文件',
    description: '支持 Word、PDF、PPT 等常见格式，自动同步版本。',
    icon: UploadCloud,
    actionLabel: '上传文件',
  },
  {
    id: 'qa-invite',
    title: '邀请团队协作',
    description: '通过链接或手机号邀请顾问、机构伙伴共用同一空间。',
    icon: Users,
    actionLabel: '邀请成员',
  },
];

const RECENT_DOCS: RecentDocument[] = [
  {
    id: 'doc-001',
    name: '小满申请档案汇总（终版）',
    owner: 'Evan Xu',
    updatedAt: '今天 19:00',
    location: '学鸢教育 / 申研服务',
    status: '进行中',
  },
  {
    id: 'doc-002',
    name: '2025 申请季项目执行总览',
    owner: '学鸢教育运营组',
    updatedAt: '今天 18:58',
    location: '学鸢教育 / 项目运营',
    status: '进行中',
  },
  {
    id: 'doc-003',
    name: 'ESSEC MIM 面试应对手册',
    owner: '陈晓丹',
    updatedAt: '昨天 00:24',
    location: '面试准备 / 面试素材库',
    status: '草稿',
  },
  {
    id: 'doc-004',
    name: '2025/09/07 申请季教练备课',
    owner: 'Evan Xu',
    updatedAt: '11月9日 20:58',
    location: '备课脚本 / 语言提升',
    status: '已归档',
  },
];

const FAVORITE_SPACES: WorkspaceShortcut[] = [
  {
    id: 'ws-01',
    name: '小满申请档案',
    description: '包含个人信息、教育背景、文书素材等核心档案内容。',
    members: 5,
    badge: '置顶',
  },
  {
    id: 'ws-02',
    name: '申研服务总览（含甘特图）',
    description: '同步顾问、教研与服务团队的联合执行计划。',
    members: 12,
  },
  {
    id: 'ws-03',
    name: 'ESSEC MIM 面试攻坚',
    description: '沉淀过往高分案例与面试复盘，便于快速复用。',
    members: 8,
    badge: '活跃',
  },
];

const FOLDER_SHORTCUTS: FolderShortcut[] = [
  {
    id: 'fs-01',
    title: '我的云盘',
    icon: Folder,
    highlight: '个人空间',
    helper: '草稿、临时存档与个人资料。',
  },
  {
    id: 'fs-02',
    title: '团队协作区',
    icon: Users,
    highlight: '项目协作',
    helper: '项目资料、交付模板、复盘文档。',
  },
  {
    id: 'fs-03',
    title: '共享文档',
    icon: Share2,
    highlight: '对外共享',
    helper: '机构、家长可见版本与外链记录。',
  },
  {
    id: 'fs-04',
    title: '模板库',
    icon: Sparkles,
    highlight: '快速启动',
    helper: '标准流程、面试模板、运营清单。',
  },
];

const ACTIVITY_FEED: FeedItem[] = [
  {
    id: 'feed-1',
    type: 'comment',
    detail: '评论了《小满申请档案汇总》文书素材章节',
    actor: '李研',
    time: '10 分钟前',
  },
  {
    id: 'feed-2',
    type: 'share',
    detail: '向机构伙伴共享《申研服务执行总览》外部版本',
    actor: '赵婧怡',
    time: '1 小时前',
  },
  {
    id: 'feed-3',
    type: 'update',
    detail: '在《ESSEC MIM 面试手册》中更新面试官提问模板',
    actor: 'Evan Xu',
    time: '昨天 20:45',
  },
];

const statusBadgeMap: Record<RecentDocument['status'], string> = {
  草稿: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  进行中: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
  已归档: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300',
};

const feedIconMap: Record<FeedItem['type'], React.ComponentType<{ className?: string }>> = {
  comment: MessageSquare,
  share: Share2,
  update: Sparkles,
};

const CloudDocsHomePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white shadow-lg">
        <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-100">
              <Sparkles className="h-3.5 w-3.5" />
              云文档中心
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold leading-tight">以项目为核心的文档协作控制台</h1>
              <p className="max-w-2xl text-sm text-indigo-100/80">
                将申请服务、运营项目、机构合作的关键文档集中管理。支持多角色权限、实时协作与统一动态，让团队协作更自洽。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-indigo-100/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">👥 顾问/机构联合使用</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🗂️ 多维度目录管理</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">🛡️ 版本与权限留痕</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-6 text-indigo-50">
            <div className="text-sm uppercase tracking-widest text-indigo-100/70">今日概览</div>
            <div className="grid grid-cols-2 gap-4 text-center text-xl font-semibold">
              <div>
                <div>38</div>
                <div className="mt-1 text-xs font-normal text-indigo-100/70">活跃协作文档</div>
              </div>
              <div>
                <div>12</div>
                <div className="mt-1 text-xs font-normal text-indigo-100/70">待审批变更</div>
              </div>
              <div>
                <div>8</div>
                <div className="mt-1 text-xs font-normal text-indigo-100/70">机构共享文件</div>
              </div>
              <div>
                <div>5</div>
                <div className="mt-1 text-xs font-normal text-indigo-100/70">AI 生成草稿</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {FOLDER_SHORTCUTS.map((folder) => {
          const Icon = folder.icon;
          return (
            <div key={folder.id} className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-indigo-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">{folder.title}</span>
                </div>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                  {folder.highlight}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{folder.helper}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {QUICK_ACTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                    <Icon className="h-3.5 w-3.5" />
                    {item.title}
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
                <button className="rounded-full border border-indigo-100 p-2 text-indigo-500 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:border-indigo-300 dark:hover:text-indigo-100" aria-label={item.actionLabel}>
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
              <button className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-200 dark:hover:text-indigo-100">
                {item.actionLabel}
              </button>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最近打开</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">跟进有变更或新增评论的文件，保持信息同步。</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Search className="h-4 w-4" />
              快速查找
            </div>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {RECENT_DOCS.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center gap-3 px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex min-w-[200px] flex-1 items-center gap-3">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{doc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{doc.location}</div>
                  </div>
                </div>
                <div className="hidden min-w-[140px] items-center gap-2 text-xs text-slate-500 dark:text-slate-400 md:flex">
                  <Clock className="h-4 w-4" />
                  {doc.updatedAt}
                </div>
                <div className="hidden min-w-[120px] text-xs text-slate-500 dark:text-slate-400 lg:block">{doc.owner}</div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadgeMap[doc.status]}`}>{doc.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">置顶空间</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">管理</button>
            </div>
            <div className="mt-4 space-y-3">
              {FAVORITE_SPACES.map((space) => (
                <div key={space.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{space.name}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{space.description}</p>
                    </div>
                    {space.badge && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                        {space.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Users className="h-3.5 w-3.5" />
                    {space.members} 位成员协作中
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">协作动态</h3>
              <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">查看全部</button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {ACTIVITY_FEED.map((item) => {
                const Icon = feedIconMap[item.type];
                return (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <Icon className="mt-0.5 h-4 w-4 text-indigo-500" />
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">{item.actor}</div>
                      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</p>
                      <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">常用目录入口</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">按业务场景快速进入指定文件夹，便于新人同步结构。</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            <Settings className="h-4 w-4" />
            管理入口
          </button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['申研项目档案', '面试素材库', '业务运营方案', '机构合作资料', '营销内容生产', '智库共创', '数据报表', '归档中心'].map((folder) => (
            <div key={folder} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <Folder className="h-4 w-4 text-indigo-500" />
              <span>{folder}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CloudDocsHomePage;

