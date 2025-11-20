/**
 * 文档编辑区域组件
 * 包含文档编辑器和相关工具栏
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Save, Send, Share2, Settings, Clock, FileText } from 'lucide-react';
import DocumentEditor from '../../../../components/DocumentEditor';
import type { Document } from '../types';

interface DocumentEditorAreaProps {
  document: Document | null;
  onSave: (content: string) => Promise<void>;
  onUpdate: (updates: { title?: string; content?: string; status?: string }) => Promise<void>;
  isLoading?: boolean;
}

export default function DocumentEditorArea({
  document,
  onSave,
  onUpdate,
  isLoading = false,
}: DocumentEditorAreaProps) {
  const [title, setTitle] = useState(document?.title || '');
  const [content, setContent] = useState(document?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  // 同步文档数据
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      setLastSaved(document.updated_at ? new Date(document.updated_at) : null);
    } else {
      setTitle('');
      setContent('');
      setLastSaved(null);
    }
  }, [document]);

  // 自动保存
  useEffect(() => {
    if (!document || !content) return;

    // 清除之前的定时器
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // 设置新的自动保存定时器（30秒）
    const timer = setTimeout(async () => {
      try {
        setIsSaving(true);
        await onSave(content);
        setLastSaved(new Date());
      } catch (error) {
        console.error('自动保存失败:', error);
      } finally {
        setIsSaving(false);
      }
    }, 30000);

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [content, document, onSave]);

  // 手动保存
  const handleManualSave = useCallback(async () => {
    if (!document) return;

    try {
      setIsSaving(true);
      await onSave(content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [document, content, onSave]);

  // 提交审核
  const handleSubmit = useCallback(async () => {
    if (!document) return;

    if (!confirm('确定要提交审核吗？')) return;

    try {
      setIsSaving(true);
      await onUpdate({ status: 'review' });
      alert('已提交审核');
    } catch (error) {
      console.error('提交失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSaving(false);
    }
  }, [document, onUpdate]);

  // 标题变化
  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      setTitle(newTitle);
      if (document) {
        try {
          await onUpdate({ title: newTitle });
        } catch (error) {
          console.error('更新标题失败:', error);
        }
      }
    },
    [document, onUpdate]
  );

  // 内容变化
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="text-center">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-6" />
          <p className="text-base text-slate-600 dark:text-slate-400 mb-2 font-medium">
            请从左侧选择一个文档开始编辑
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            或点击"新建文档"创建新文档
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex-none px-6 py-3 border-b border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {document.document_type}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded ${
                document.status === 'writing'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : document.status === 'review'
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-gray-700 dark:text-slate-300'
              }`}
            >
              {document.status === 'writing'
                ? '撰写中'
                : document.status === 'review'
                  ? '待审核'
                  : document.status}
            </span>
            {document.deadline && (
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                截止: {new Date(document.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 保存状态 */}
            {isSaving ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                保存中...
              </span>
            ) : lastSaved ? (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                已保存 {formatTimeAgo(lastSaved)}
              </span>
            ) : null}

            {/* 操作按钮 */}
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              保存
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving || document.status === 'review'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              提交审核
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
              title="分享"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
              title="设置"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 编辑器 */}
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          title={title}
          onTitleChange={handleTitleChange}
          content={content}
          onContentChange={handleContentChange}
          saving={isSaving}
          lastSaved={lastSaved}
          isEditMode={!!document}
          placeholder="开始编写文档内容..."
          showMetadata={true}
        />
      </div>
    </div>
  );
}

// 格式化时间差
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return date.toLocaleDateString();
}

