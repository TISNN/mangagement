/**
 * 文档列表面板组件
 * 显示当前学生的所有文书，支持切换、筛选、排序
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Download,
  Star,
  MessageSquare,
  Clock,
} from 'lucide-react';
import type { Document, DocumentType, DocumentStatus } from '../types';

interface DocumentListPanelProps {
  documents: Document[];
  currentDocumentId: number | null;
  onDocumentSelect: (documentId: number) => void;
  onCreateDocument: () => void;
  onDeleteDocument: (documentId: number) => void;
  isLoading?: boolean;
}

export default function DocumentListPanel({
  documents,
  currentDocumentId,
  onDocumentSelect,
  onCreateDocument,
  onDeleteDocument,
  isLoading = false,
}: DocumentListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DocumentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DocumentStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // 过滤文档
  const filteredDocuments = documents.filter((doc) => {
    if (searchQuery && !doc.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterType !== 'all' && doc.document_type !== filterType) {
      return false;
    }
    if (filterStatus !== 'all' && doc.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: DocumentStatus) => {
    const colors = {
      draft: 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-slate-300',
      writing: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300',
      review: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300',
      revision: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 text-yellow-700 dark:text-yellow-300',
      finalized: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300',
      archived: 'bg-slate-100 text-slate-500 dark:bg-gray-700 dark:text-slate-400',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: DocumentStatus) => {
    const labels = {
      draft: '草稿',
      writing: '撰写中',
      review: '待审核',
      revision: '修改中',
      finalized: '已定稿',
      archived: '已归档',
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type: DocumentType) => {
    const labels = {
      PS: '个人陈述',
      Essay: 'Essay',
      CV: '简历',
      RL: '推荐信',
      SOP: '目的陈述',
      Other: '其他',
    };
    return labels[type] || type;
  };

  return (
    <div className="h-full flex flex-col">
      {/* 头部 - 简洁设计 */}
      <div className="flex-none px-5 py-4 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            文档列表
          </h3>
          <button
            onClick={onCreateDocument}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            title="新建文档"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索文档..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 筛选按钮 */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
        >
          <Filter className="h-3.5 w-3.5" />
          <span>筛选</span>
        </button>

        {/* 筛选面板 */}
        {showFilters && (
          <div className="mt-3 space-y-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                文档类型
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as DocumentType | 'all')}
                className="w-full text-xs border border-slate-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="all">全部</option>
                <option value="PS">个人陈述</option>
                <option value="Essay">Essay</option>
                <option value="CV">简历</option>
                <option value="RL">推荐信</option>
                <option value="SOP">目的陈述</option>
                <option value="Other">其他</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5 block">
                状态
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as DocumentStatus | 'all')}
                className="w-full text-xs border border-slate-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="all">全部</option>
                <option value="draft">草稿</option>
                <option value="writing">撰写中</option>
                <option value="review">待审核</option>
                <option value="revision">修改中</option>
                <option value="finalized">已定稿</option>
                <option value="archived">已归档</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 文档列表 */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">加载中...</div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {documents.length === 0 ? '暂无文档' : '未找到匹配的文档'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <DocumentItem
                key={doc.id}
                document={doc}
                isSelected={doc.id === currentDocumentId}
                onSelect={() => onDocumentSelect(doc.id)}
                onDelete={() => onDeleteDocument(doc.id)}
                getStatusColor={getStatusColor}
                getStatusLabel={getStatusLabel}
                getTypeLabel={getTypeLabel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface DocumentItemProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (documentId: number) => void;
  getStatusColor: (status: DocumentStatus) => string;
  getStatusLabel: (status: DocumentStatus) => string;
  getTypeLabel: (type: DocumentType) => string;
}

function DocumentItem({
  document,
  isSelected,
  onSelect,
  onDelete,
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
}: DocumentItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : 'hover:bg-slate-50 dark:hover:bg-gray-800 border border-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
              {document.title}
            </span>
            {document.is_favorite && (
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-current flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {getTypeLabel(document.document_type)}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${getStatusColor(document.status)}`}>
              {getStatusLabel(document.status)}
            </span>
            {document.unread_comments_count && document.unread_comments_count > 0 && (
              <span className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                <MessageSquare className="h-3 w-3" />
                {document.unread_comments_count}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{document.word_count} 字</span>
            {document.updated_at && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(document.updated_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <MoreVertical className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      {/* 右键菜单 */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 实现编辑功能
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            编辑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 实现下载功能
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            下载
          </button>
          <div className="h-px bg-slate-200 dark:bg-gray-700 my-1" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('确定要删除这个文档吗？')) {
                onDelete(document.id);
              }
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            删除
          </button>
        </div>
      )}
    </div>
  );
}

