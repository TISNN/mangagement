import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Layers,
  PlusCircle,
  Search,
  Sparkles,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { AppOutletContext } from '../../../App';
import { getDefaultFavorites, type AppFeature } from '../../../data/appFeatures';

type FeedbackType = 'success' | 'info' | 'warning' | 'error';

type UndoState = {
  featureId: string;
  previousSelection: string[];
  timeoutId: number;
};

const FEEDBACK_STYLES: Record<FeedbackType, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border border-blue-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  error: 'bg-rose-50 text-rose-700 border border-rose-200',
};

const ROLE_LABEL: Record<string, string> = {
  admin: '管理员',
  student: '学生',
  guest: '访客',
};

const BADGE_STYLE: Record<'热门' | '新上线', string> = {
  热门: 'bg-rose-50 text-rose-600 border border-rose-200',
  新上线: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
};

const getBadgeClassName = (badge?: '热门' | '新上线') => (badge ? BADGE_STYLE[badge] : '');

const sortFeatures = (features: AppFeature[]) => {
  const score = (badge?: string) => {
    if (badge === '热门') return 2;
    if (badge === '新上线') return 1;
    return 0;
  };
  return [...features].sort((a, b) => {
    const diff = score(b.badge) - score(a.badge);
    if (diff !== 0) return diff;
    return a.title.localeCompare(b.title, 'zh-CN');
  });
};

const AppCenterPage = () => {
  const navigate = useNavigate();
  const { favoriteFeatureIds, setFavoriteFeatureIds, maxFavorites, availableFeatures, userRole } =
    useOutletContext<AppOutletContext>();

  const featureMap = useMemo(
    () => new Map<string, AppFeature>(availableFeatures.map((feature) => [feature.id, feature])),
    [availableFeatures],
  );

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(new Set(availableFeatures.map((feature) => feature.category)));
    return ['全部', ...uniqueCategories];
  }, [availableFeatures]);

  const [draftSelection, setDraftSelection] = useState<string[]>(favoriteFeatureIds);
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string } | null>(null);
  const [undoState, setUndoState] = useState<UndoState | null>(null);

  const selectedSet = useMemo(() => new Set(draftSelection), [draftSelection]);

  const filteredFeatures = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const candidates = availableFeatures.filter((feature) => !selectedSet.has(feature.id));

    const byCategory =
      selectedCategory === '全部'
        ? candidates
        : candidates.filter((feature) => feature.category === selectedCategory);

    const byKeyword = normalizedSearch.length
      ? byCategory.filter(
          (feature) =>
            feature.title.toLowerCase().includes(normalizedSearch) ||
            feature.description.toLowerCase().includes(normalizedSearch) ||
            feature.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearch)),
        )
      : byCategory;

    return sortFeatures(byKeyword);
  }, [availableFeatures, searchTerm, selectedCategory, selectedSet]);

  const selectedFeatures = useMemo(
    () => draftSelection.map((id) => featureMap.get(id)).filter((feature): feature is AppFeature => Boolean(feature)),
    [draftSelection, featureMap],
  );

  const isDirty =
    draftSelection.length !== favoriteFeatureIds.length ||
    draftSelection.some((id, index) => favoriteFeatureIds[index] !== id);

  const remainingSlots = maxFavorites - draftSelection.length;

  const showFeedback = (message: string, type: FeedbackType) => {
    setFeedback({ message, type });
  };

  useEffect(() => {
    setDraftSelection(favoriteFeatureIds);
  }, [favoriteFeatureIds]);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    return () => {
      if (undoState?.timeoutId) {
        window.clearTimeout(undoState.timeoutId);
      }
    };
  }, [undoState]);

  const scheduleUndo = (previousSelection: string[], removedId: string) => {
    setUndoState((prev) => {
      if (prev?.timeoutId) {
        window.clearTimeout(prev.timeoutId);
      }
      const timeoutId = window.setTimeout(() => {
        setUndoState(null);
      }, 3000);
      return {
        featureId: removedId,
        previousSelection,
        timeoutId,
      };
    });
  };

  const handleAddFeature = (featureId: string) => {
    if (draftSelection.length >= maxFavorites) {
      showFeedback(`最多只能固定 ${maxFavorites} 个功能，先移除一个试试`, 'warning');
      return;
    }
    setDraftSelection((prev) => [...prev, featureId]);
    const featureName = featureMap.get(featureId)?.title ?? '功能';
    showFeedback(`${featureName} 已添加到导航栏`, 'success');
  };

  const handleRemoveFeature = (featureId: string) => {
    setDraftSelection((prev) => {
      if (!prev.includes(featureId)) {
        return prev;
      }
      const previous = [...prev];
      const next = prev.filter((id) => id !== featureId);
      scheduleUndo(previous, featureId);
      return next;
    });
    const featureName = featureMap.get(featureId)?.title ?? '功能';
    showFeedback(`${featureName} 已从导航栏移除`, 'info');
  };

  const handleMoveFeature = (featureId: string, direction: 'up' | 'down') => {
    setDraftSelection((prev) => {
      const currentIndex = prev.indexOf(featureId);
      if (currentIndex === -1) return prev;
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleUndo = () => {
    if (!undoState) return;
    window.clearTimeout(undoState.timeoutId);
    setDraftSelection(undoState.previousSelection);
    setUndoState(null);
    const featureName = featureMap.get(undoState.featureId)?.title ?? '功能';
    showFeedback(`已恢复 ${featureName}`, 'success');
  };

  const handleReset = () => {
    const recommendedIds = getDefaultFavorites(userRole)
      .filter((id) => featureMap.has(id))
      .slice(0, maxFavorites);
    setDraftSelection(recommendedIds);
    showFeedback('已恢复推荐组合', 'info');
  };

  const handleSave = () => {
    setFavoriteFeatureIds(draftSelection);
    showFeedback('导航栏已更新', 'success');
  };

  const selectedCountCopy = `已选择 ${draftSelection.length} / ${maxFavorites}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-10 px-6 pb-20 pt-12">
        <header className="space-y-6 rounded-3xl bg-white p-10 shadow-xl ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-600">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                新功能 · 自定义导航
              </div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">应用中心</h1>
              <p className="max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
                把高频入口收纳到导航栏，保持工作台干净专注。精选功能按分类展示，随时添加、移除或调整排序。
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-600 md:items-end">
              <span className="text-xs uppercase tracking-wide text-slate-500">当前身份</span>
              <span className="text-lg font-semibold text-slate-900">{ROLE_LABEL[userRole] ?? ROLE_LABEL.guest}</span>
              <span className="text-xs text-slate-500">最多固定 {maxFavorites} 个常用功能</span>
            </div>
          </div>

          {feedback && (
            <div className={`${FEEDBACK_STYLES[feedback.type]} flex items-center gap-3 rounded-2xl px-4 py-3 text-sm`}>
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              <Layers className="h-4 w-4 text-indigo-500" />
              {selectedCountCopy}
            </div>
            <div className="flex flex-1 flex-wrap justify-start gap-3 md:justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
              >
                恢复推荐组合
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                返回上一页
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isDirty}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                  isDirty
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-400/30 hover:bg-indigo-500'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                保存导航
              </button>
            </div>
          </div>
        </header>

        {undoState && (
          <div className="flex items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-3 text-sm text-slate-600 shadow-sm">
            <span>
              {featureMap.get(undoState.featureId)?.title ?? '功能'} 已移除。
              <span className="ml-2 text-slate-500">需要撤销吗？</span>
            </span>
            <button
              type="button"
              onClick={handleUndo}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
            >
              <Undo2 className="h-4 w-4" />
              撤销
            </button>
          </div>
        )}

        <section className="space-y-4 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">已添加到导航栏</h2>
              <p className="text-sm text-slate-500">拖动排序或移除低频功能，保持导航清爽。</p>
            </div>
            <span className="text-sm text-slate-500">
              剩余可添加 <span className="font-semibold text-indigo-600">{Math.max(0, remainingSlots)}</span> 个功能
            </span>
          </div>

          {selectedFeatures.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
              <PlusCircle className="h-10 w-10 text-indigo-500" />
              <div className="space-y-1">
                <p className="text-base font-medium text-slate-900">导航栏还没有常用功能</p>
                <p className="text-sm text-slate-500">从下方推荐列表挑选 1-2 个入口，专注你最常用的操作。</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {selectedFeatures.map((feature, index) => {
                const isFirst = index === 0;
                const isLast = index === selectedFeatures.length - 1;
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-slate-900">{feature.title}</h3>
                        {feature.badge && (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${getBadgeClassName(feature.badge)}`}>
                            {feature.badge}
                          </span>
                        )}
                      </div>
                      <p className="line-clamp-2 text-sm text-slate-600">{feature.description}</p>
                      {feature.tags && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {feature.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMoveFeature(feature.id, 'up')}
                        disabled={isFirst}
                        className={`rounded-full p-1.5 transition ${
                          isFirst ? 'text-slate-300' : 'text-indigo-500 hover:bg-indigo-50'
                        }`}
                        title="上移"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFeature(feature.id, 'down')}
                        disabled={isLast}
                        className={`rounded-full p-1.5 transition ${
                          isLast ? 'text-slate-300' : 'text-indigo-500 hover:bg-indigo-50'
                        }`}
                        title="下移"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature.id)}
                      className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500"
                      title="移除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-slate-900">可添加功能</h2>
              <p className="text-sm text-slate-500">按分类浏览或搜索你需要的工具。</p>
            </div>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="搜索功能、描述或标签"
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-sm transition ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm shadow-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {filteredFeatures.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500">
              没有匹配的功能，请尝试更换关键词或分类。
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-indigo-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                          {feature.badge && (
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${getBadgeClassName(feature.badge)}`}
                            >
                              {feature.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{feature.description}</p>
                      </div>
                    </div>
                    {feature.tags && (
                      <div className="flex flex-wrap gap-2">
                        {feature.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                      <span>{feature.category}</span>
                      <button
                        type="button"
                        onClick={() => handleAddFeature(feature.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <PlusCircle className="h-4 w-4" />
                        添加
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-3xl border border-indigo-100 bg-indigo-50 p-8 shadow-xl">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-indigo-500" />
            <h2 className="text-2xl font-semibold text-slate-900">我的导航预览</h2>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-6 py-5 shadow-inner">
            {selectedFeatures.length === 0 ? (
              <p className="text-sm text-slate-500">
                预览区会展示保存后的导航效果。添加功能后，这里会实时更新排序结果。
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {selectedFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <span
                      key={feature.id}
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-700"
                    >
                      <Icon className="h-4 w-4" />
                      {feature.title}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppCenterPage;

