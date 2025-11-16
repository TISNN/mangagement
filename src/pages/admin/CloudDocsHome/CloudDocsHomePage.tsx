import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FilePlus,
  UploadCloud,
  Users,
  Clock,
  MessageSquare,
  Share2,
  Search,
  Settings,
  FileText,
  Folder,
  Sparkles,
  Loader2,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import {
  getRecentDocuments,
  getFavoriteDocuments,
  getCloudDocumentStats,
  formatDocumentStatus,
  formatDocumentUpdatedAt,
  deleteDocument,
  type CloudDocument,
  type CloudDocumentStats,
} from '../../../services/cloudDocumentService';
import { formatDateTime } from '../../../utils/dateUtils';

type QuickAction = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  actionLabel: string;
};

// 类型定义已移至 cloudDocumentService.ts

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

// 最近文档和收藏文档将从数据库加载

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

// 协作动态暂时保留硬编码，后续可以扩展为活动日志表
const ACTIVITY_FEED: FeedItem[] = [
  // TODO: 后续可以从数据库的活动日志表获取
];

const statusBadgeMap: Record<'草稿' | '进行中' | '已归档', string> = {
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
  const navigate = useNavigate();
  
  // 数据状态
  const [recentDocs, setRecentDocs] = useState<CloudDocument[]>([]);
  const [favoriteDocs, setFavoriteDocs] = useState<CloudDocument[]>([]);
  const [stats, setStats] = useState<CloudDocumentStats>({
    activeDocuments: 0,
    draftDocuments: 0,
    archivedDocuments: 0,
    favoriteDocuments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId) return;
      const activeMenu = menuRefs.current[openMenuId];
      if (activeMenu && !activeMenu.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 并行加载所有数据
      const [recent, favorites, statistics] = await Promise.all([
        getRecentDocuments(10),
        getFavoriteDocuments(10),
        getCloudDocumentStats(),
      ]);

      setRecentDocs(recent);
      setFavoriteDocs(favorites);
      setStats(statistics);
    } catch (err) {
      console.error('加载云文档数据失败:', err);
      setError('加载数据失败，请刷新页面重试');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'qa-create-doc':
        navigate('/admin/cloud-docs/documents/new');
        break;
      case 'qa-upload':
        // TODO: 实现上传文件功能
        alert('上传文件功能开发中...');
        break;
      case 'qa-invite':
        // TODO: 实现邀请团队功能
        alert('邀请团队功能开发中...');
        break;
      default:
        break;
    }
  };

  const handleDocumentClick = (docId: number) => {
    navigate(`/admin/cloud-docs/documents/${docId}`);
  };

  const handleDeleteDocument = async (docId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (!confirm('确定要删除这个文档吗？此操作不可恢复。')) {
      return;
    }

    try {
      await deleteDocument(docId);
      // 重新加载数据
      await loadData();
      setOpenMenuId(null);
    } catch (error) {
      console.error('删除文档失败:', error);
      alert('删除文档失败: ' + (error as Error).message);
    }
  };

  const handleMenuToggle = (docId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    setOpenMenuId(openMenuId === docId ? null : docId);
  };

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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-200" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-center text-xl font-semibold">
                <div>
                  <div>{stats.activeDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">活跃协作文档</div>
                </div>
                <div>
                  <div>{stats.draftDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">草稿文档</div>
                </div>
                <div>
                  <div>{stats.archivedDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">已归档文档</div>
                </div>
                <div>
                  <div>{stats.favoriteDocuments}</div>
                  <div className="mt-1 text-xs font-normal text-indigo-100/70">收藏文档</div>
                </div>
              </div>
            )}
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
                <button 
                  onClick={() => handleQuickAction(item.id)}
                  className="rounded-full border border-indigo-100 p-2 text-indigo-500 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-indigo-500/40 dark:text-indigo-200 dark:hover:border-indigo-300 dark:hover:text-indigo-100" 
                  aria-label={item.actionLabel}
                >
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
              <button 
                onClick={() => handleQuickAction(item.id)}
                className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-200 dark:hover:text-indigo-100"
              >
                {item.actionLabel}
              </button>
            </div>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">置顶空间</h3>
            <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">管理</button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
            </div>
          ) : favoriteDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              暂无收藏文档
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {favoriteDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white">{doc.title}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {doc.location || '未分类'}
                      </p>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                      收藏
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDocumentUpdatedAt(doc.updated_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">协作动态</h3>
            <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">查看全部</button>
          </div>
          {ACTIVITY_FEED.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              暂无协作动态
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* 常用目录入口 */}
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

      {/* 最近打开列表 - 占据一整行 */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : recentDocs.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            暂无文档，点击"新建云文档"开始创建
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {/* 表头 */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-[1fr_140px_120px_80px_40px] gap-3 items-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-3">
                  <span>名称</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>修改时间</span>
                </div>
                <div className="hidden lg:block">
                  <span>所有者</span>
                </div>
                <div className="text-center">
                  <span>状态</span>
                </div>
                <div></div>
              </div>
            </div>
            {/* 文档列表 */}
            {recentDocs.map((doc) => {
              const status = formatDocumentStatus(doc.status);
              const isMenuOpen = openMenuId === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => handleDocumentClick(doc.id)}
                  className="grid grid-cols-[1fr_140px_120px_80px_40px] gap-3 items-center px-6 py-4 text-sm text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-900 dark:text-white truncate">{doc.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {doc.location || '未分类'}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{formatDateTime(new Date(doc.updated_at))}</span>
                  </div>
                  <div className="hidden lg:block text-xs text-slate-500 dark:text-slate-400 truncate">
                    {doc.creator?.name || '未知用户'}
                  </div>
                  <div className="flex justify-center">
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadgeMap[status]}`}>
                      {status}
                    </span>
                  </div>
                  {/* 更多选项按钮 */}
                  <div className="flex justify-end">
                    <div className="relative" ref={(el) => (menuRefs.current[doc.id] = el)}>
                      <button
                        onClick={(e) => handleMenuToggle(doc.id, e)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="更多选项"
                      >
                        <MoreVertical className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      {/* 下拉菜单 */}
                      {isMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                          <button
                            onClick={(e) => handleDeleteDocument(doc.id, e)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除文档
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CloudDocsHomePage;

