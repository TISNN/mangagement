/**
 * 知识库与模板组件
 * 展示关键资料、话术模板和流程手册
 */

import React, { useState } from 'react';
import { BookOpen, Tag, Sparkles, CheckCircle2, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { KnowledgeArticle } from '../types';
import { KNOWLEDGE_ARTICLES } from '../constants';

interface KnowledgeBaseProps {
  onCreateDocument?: () => void;
  onGenerateScript?: (articleId: string) => void;
  onSubmitUpdate?: (articleId: string) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  onCreateDocument,
  onGenerateScript,
  onSubmitUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(KNOWLEDGE_ARTICLES.map((article) => article.category)));

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">知识库与模板</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">关键资料、话术模板和流程手册统一管理，支持版本与评分</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {isExpanded ? '收起' : '展开'}
          </button>
          <button
            onClick={onCreateDocument}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
          >
            <BookOpen className="h-3.5 w-3.5" /> 新建文档
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* 搜索和筛选 */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文档标题或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    categoryFilter === category
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 文档列表 */}
          <div className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
            {filteredArticles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/40">
                <p className="text-sm text-gray-500">未找到匹配的文档</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{article.title}</div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">更新 {article.updatedAt}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                    分类：{article.category} · 版本 {article.version} · {article.owner}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-indigo-500 dark:text-indigo-300">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        <Tag className="h-3 w-3" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-400 dark:text-gray-500">
                    <div>阅读 {article.usage.views}</div>
                    <div>评分 {article.usage.rating}</div>
                    <div>收藏 {article.usage.favorites}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => onGenerateScript?.(article.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-indigo-200 hover:text-indigo-600 dark:border-gray-600 dark:hover:border-indigo-500 dark:hover:text-indigo-300"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI 生成话术
                    </button>
                    <button
                      onClick={() => onSubmitUpdate?.(article.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-0.5 hover:border-emerald-200 hover:text-emerald-600 dark:border-gray-600 dark:hover:border-emerald-500 dark:hover:text-emerald-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> 提交更新
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeBase;

