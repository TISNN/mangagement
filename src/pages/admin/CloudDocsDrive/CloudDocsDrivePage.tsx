import React from 'react';
import {
  Filter,
  Folder,
  FolderOpen,
  HardDrive,
  PieChart,
  Presentation,
  Share2,
  Shield,
  Trash,
  UploadCloud,
  UserPlus,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';

type StorageStat = {
  id: string;
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
};

type DriveFolder = {
  id: string;
  name: string;
  owner: string;
  updatedAt: string;
  items: number;
  shared: boolean;
  tag?: string;
};

type FileRecord = {
  id: string;
  name: string;
  type: 'doc' | 'sheet' | 'slides';
  owner: string;
  updatedAt: string;
  size: string;
  location: string;
  sharedWith: string[];
  status: '内部' | '跨团队' | '待归档';
};

const STORAGE_STATS: StorageStat[] = [
  { id: 'used', label: '已使用', value: '86 GB', helper: '团队空间 72 GB · 个人空间 14 GB', icon: HardDrive },
  { id: 'remain', label: '剩余容量', value: '34 GB', helper: '归档与压缩可释放空间', icon: PieChart },
  { id: 'shared', label: '团队共享', value: '18 个文件夹', helper: '跨部门协作使用', icon: Share2 },
  { id: 'security', label: '安全巡检', value: '2 项风险', helper: '待处理：权限过宽 · 过期链接', icon: Shield },
];

const DRIVE_FOLDERS: DriveFolder[] = [
  { id: 'f-001', name: '学屿教育 · 顾问交付资料', owner: 'Evan Xu', updatedAt: '今天 17:29', items: 124, shared: true, tag: '跨团队' },
  { id: 'f-002', name: '面试资料库', owner: '陈晓丹', updatedAt: '昨天 00:24', items: 98, shared: false },
  { id: 'f-003', name: '2025 项目执行模板', owner: '运营团队', updatedAt: '11月9日', items: 57, shared: true, tag: '项目共用' },
  { id: 'f-004', name: '导师培养计划', owner: 'Evan Xu', updatedAt: '11月6日', items: 23, shared: false, tag: '内部专用' },
  { id: 'f-005', name: '招生宣讲素材', owner: '市场团队', updatedAt: '11月2日', items: 76, shared: true, tag: '市场共享' },
  { id: 'f-006', name: '归档中心', owner: '知识管理', updatedAt: '10月25日', items: 342, shared: false },
];

const FILES: FileRecord[] = [
  {
    id: 'file-001',
    name: '小满申请进度总表',
    type: 'sheet',
    owner: 'Evan Xu',
    updatedAt: '今天 19:00',
    size: '3.2 MB',
    location: '学屿教育 / 项目进度',
    sharedWith: ['学屿教育', '顾问团队'],
    status: '内部',
  },
  {
    id: 'file-002',
    name: 'ESSEC MIM 面试演示稿',
    type: 'slides',
    owner: '陈晓丹',
    updatedAt: '今天 18:58',
    size: '18 MB',
    location: '面试资料 / 公开课堂',
    sharedWith: ['面试教练组', '顾问培训组'],
    status: '跨团队',
  },
  {
    id: 'file-003',
    name: '机构合作协议（草案）',
    type: 'doc',
    owner: '赵婧怡',
    updatedAt: '昨天 20:06',
    size: '1.1 MB',
    location: '机构合作 / 法务文档',
    sharedWith: ['渠道商务', '法务审核'],
    status: '内部',
  },
  {
    id: 'file-004',
    name: '营销内容排期表',
    type: 'sheet',
    owner: '市场团队',
    updatedAt: '11月2日',
    size: '2.6 MB',
    location: '营销中心 / 内容管理',
    sharedWith: ['市场团队'],
    status: '待归档',
  },
];

const typeIconMap: Record<FileRecord['type'], React.ComponentType<{ className?: string }>> = {
  doc: FileText,
  sheet: FileSpreadsheet,
  slides: Presentation,
};

const statusClass: Record<FileRecord['status'], string> = {
  内部: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
  跨团队: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200',
  待归档: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-200',
};

const CloudDocsDrivePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">云盘</h1>
            <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              管理跨团队共享的文件夹、权限与存储状态，支持批量授权、外链管控与归档策略，保障资料安全可控。
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">📦 存储策略</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">🔗 外链管理</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">🛡️ 权限巡检</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <UploadCloud className="h-4 w-4" />
              上传文件
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <UserPlus className="h-4 w-4" />
              统一授权
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STORAGE_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.id} className="rounded-2xl border border-slate-200 bg-white/90 p-5 text-slate-600 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{stat.label}</span>
                  <Icon className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{stat.value}</div>
                <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{stat.helper}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">文件概览</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <span>团队空间</span>
                <span className="text-xs text-slate-400">8 个文件夹</span>
              </li>
              <li className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <span>我的空间</span>
                <span className="text-xs text-slate-400">14 个文件</span>
              </li>
              <li className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <span>团队共享</span>
                <span className="text-xs text-slate-400">18 个链接</span>
              </li>
              <li className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <span>待归档</span>
                <span className="text-xs text-slate-400">6 个文件</span>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">过滤器</div>
            <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
              <Filter className="h-3.5 w-3.5" />
              按标签筛选
            </button>
            <button className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-500 dark:hover:text-rose-300">
              <Trash className="h-3.5 w-3.5" />
              清理策略
            </button>
          </div>
        </aside>
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">团队文件夹</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">按业务域划分的协作文件夹，可快速查看共享范围与更新节奏。</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                  <UploadCloud className="h-4 w-4" />
                  上传文件
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-300">
                  <Share2 className="h-4 w-4" />
                  批量共享
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {DRIVE_FOLDERS.map((folder) => (
                <div key={folder.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm transition hover:border-indigo-200 hover:bg-white dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-indigo-500" />
                        <span className="font-semibold text-slate-900 dark:text-white">{folder.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">更新：{folder.updatedAt}</p>
                    </div>
                    {folder.shared && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                        已共享
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <Folder className="h-3.5 w-3.5" />
                    <span>{folder.items} 个文件 · 负责人 {folder.owner}</span>
                  </div>
                  {folder.tag && (
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-900/60 dark:text-slate-300">
                      {folder.tag}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4 text-sm dark:border-slate-700">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">共享文件列表</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">查看跨团队共享范围与最近更新，必要时可快速收回。</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                导出权限清单
              </button>
            </div>
            <div className="hidden border-b border-slate-200 px-6 py-3 text-xs uppercase tracking-widest text-slate-400 dark:border-slate-800 lg:grid lg:grid-cols-[2fr,1fr,1fr,1fr]">
              <span>文件</span>
              <span>所有者</span>
              <span>访问范围</span>
              <span>状态 / 操作</span>
            </div>
            <div className="divide-y divide-slate-200 text-sm dark:divide-slate-800">
              {FILES.map((file) => {
                const Icon = typeIconMap[file.type];
                return (
                  <div key={file.id} className="grid gap-4 px-6 py-4 text-slate-600 dark:text-slate-300 md:grid-cols-[2fr,1fr,1fr,1fr]">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{file.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{file.location}</div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <div>所有者：{file.owner}</div>
                      <div>更新时间：{file.updatedAt}</div>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <div>大小：{file.size}</div>
                      <div>访问角色：{file.sharedWith.join(' / ')}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClass[file.status]}`}>{file.status}</span>
                      <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                        查看历史
                      </button>
                      <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-rose-500 hover:border-rose-200 hover:text-rose-600 dark:border-rose-500/40 dark:text-rose-300 dark:hover:border-rose-400 dark:hover:text-rose-200">
                        收回
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-xs text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-300">运营提醒</span>
            <span className="ml-3">共享权限需每 30 天复核一次，请关注到期提醒。</span>
          </div>
          <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
            查看风险中心
          </button>
        </div>
      </section>
    </div>
  );
};

export default CloudDocsDrivePage;

