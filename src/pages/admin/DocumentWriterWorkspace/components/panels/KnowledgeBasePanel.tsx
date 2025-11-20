/**
 * 知识库面板组件
 * 显示模板、案例、资料等
 */

import React, { useState } from 'react';
import { Search, FileText, Star, Download, Plus } from 'lucide-react';
import type { DocumentTemplate } from '../../types';

interface KnowledgeBasePanelProps {
  documentType?: string;
  onInsertTemplate?: (templateId: number) => void;
  onInsertSnippet?: (snippetId: number) => void;
}

export default function KnowledgeBasePanel({
  documentType,
  onInsertTemplate,
  onInsertSnippet,
}: KnowledgeBasePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'templates' | 'cases' | 'resources'>(
    'templates'
  );
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  // TODO: 从API加载模板数据
  // useEffect(() => {
  //   loadTemplates();
  // }, [documentType]);

  const categories = [
    { id: 'templates', label: '模板库' },
    { id: 'cases', label: '案例库' },
    { id: 'resources', label: '资料库' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* 搜索框 - 优化设计 */}
      <div className="p-5 border-b border-slate-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板、案例..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-200 dark:border-gray-700 rounded-xl bg-slate-50/50 dark:bg-gray-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* 分类切换 - 优化设计 */}
      <div className="px-5 py-3 border-b border-slate-200/60 dark:border-gray-800/60 flex gap-2 bg-white/50 dark:bg-gray-900/50">
        {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id as any)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {category.label}
            </button>
        ))}
      </div>

      {/* 内容列表 - 优化设计 */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeCategory === 'templates' && (
          <TemplateList
            templates={templates}
            searchQuery={searchQuery}
            documentType={documentType}
            onInsert={onInsertTemplate}
            loading={loading}
          />
        )}
        {activeCategory === 'cases' && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-800 mb-3">
              <FileText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p>案例库功能开发中...</p>
          </div>
        )}
        {activeCategory === 'resources' && (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-800 mb-3">
              <FileText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p>资料库功能开发中...</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplateListProps {
  templates: DocumentTemplate[];
  searchQuery: string;
  documentType?: string;
  onInsert?: (templateId: number) => void;
  loading: boolean;
}

function TemplateList({
  templates,
  searchQuery,
  documentType,
  onInsert,
  loading,
}: TemplateListProps) {
  const filteredTemplates = templates.filter((template) => {
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (documentType && template.document_type !== documentType) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">
        <div className="inline-block h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
        <p>加载中...</p>
      </div>
    );
  }

  if (filteredTemplates.length === 0) {
    return (
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-gray-800 mb-3">
          <FileText className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        </div>
        <p>{templates.length === 0 ? '暂无模板' : '未找到匹配的模板'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onInsert={() => onInsert?.(template.id)}
        />
      ))}
    </div>
  );
}

interface TemplateCardProps {
  template: DocumentTemplate;
  onInsert: () => void;
}

function TemplateCard({ template, onInsert }: TemplateCardProps) {
  return (
    <div className="p-4 border border-slate-200/60 dark:border-gray-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800/50 hover:border-slate-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {template.name}
            </h4>
          </div>
          {template.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 pl-6">
              {template.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          {template.usage_count > 0 && (
            <span className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {template.usage_count}
            </span>
          )}
          {template.category && (
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-gray-700 rounded-lg font-medium">
              {template.category}
            </span>
          )}
        </div>
        <button
          onClick={onInsert}
          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 group-hover:scale-105"
        >
          插入
        </button>
      </div>
    </div>
  );
}

