import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search, Sparkles, X } from 'lucide-react';

export type TemplateCategory = {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
};

export type TemplateItem = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  title: string;
  description: string;
  usage: string;
  tags: string[];
  updatedAt: string;
};

type TemplateLibraryModalProps = {
  open: boolean;
  categories: TemplateCategory[];
  items: TemplateItem[];
  onClose: () => void;
  defaultCategoryId?: string;
  className?: string;
};

const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  open,
  categories,
  items,
  onClose,
  defaultCategoryId = 'recommend',
  className,
}) => {
  const [activeCategory, setActiveCategory] = useState(defaultCategoryId);
  const [keyword, setKeyword] = useState('');

  const normalizedCategories = useMemo(() => {
    if (categories.length === 0) {
      return categories;
    }
    const ids = categories.map((item) => item.id);
    if (!ids.includes(defaultCategoryId)) {
      return [{ id: defaultCategoryId, name: '推荐', icon: Sparkles, count: items.length }, ...categories];
    }
    return categories;
  }, [categories, defaultCategoryId, items.length]);

  useEffect(() => {
    setActiveCategory(defaultCategoryId);
    setKeyword('');
  }, [defaultCategoryId, open]);

  useEffect(() => {
    if (!normalizedCategories.some((category) => category.id === activeCategory) && normalizedCategories.length > 0) {
      setActiveCategory(normalizedCategories[0].id);
    }
  }, [normalizedCategories, activeCategory]);

  const filteredTemplates = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return items.filter((item) => {
      const matchCategory = activeCategory === defaultCategoryId || item.categoryId === activeCategory;
      const matchKeyword =
        normalizedKeyword.length === 0 ||
        item.title.toLowerCase().includes(normalizedKeyword) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedKeyword));
      return matchCategory && matchKeyword;
    });
  }, [items, activeCategory, keyword, defaultCategoryId]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur">
      <div
        className={`relative flex h-[85vh] w-[92vw] max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 ${className ?? ''}`}
      >
        <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/60 md:flex">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">模板分类</div>
          <nav className="mt-4 space-y-1">
            {normalizedCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id || (activeCategory === defaultCategoryId && category.id === defaultCategoryId);
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-indigo-300'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </span>
                  <span className={`text-xs ${isActive ? 'text-indigo-100/90' : 'text-slate-400 dark:text-slate-500'}`}>
                    {category.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">模板库</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">根据业务场景快速选择模板，支持一键复制到目标知识库。</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <div className="relative w-full min-w-[240px] sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="搜索模板名称、用途…"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-600 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/40"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                AI 智选
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {filteredTemplates.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/60"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                          {template.categoryLabel}
                        </span>
                        <span>{template.usage} 人已使用</span>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white">{template.title}</h4>
                        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{template.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        {template.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800/60">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 transition hover:text-indigo-600 dark:text-indigo-300 dark:hover:text-indigo-200">
                        立即使用
                        <ChevronRight className="h-3 w-3" />
                      </button>
                      <span className="text-xs text-slate-400 dark:text-slate-500">{template.updatedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
                <Sparkles className="h-6 w-6 text-indigo-500" />
                <p className="mt-3">暂未找到匹配的模板，可尝试更换关键词或分类。</p>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            onClose();
          }}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TemplateLibraryModal;

