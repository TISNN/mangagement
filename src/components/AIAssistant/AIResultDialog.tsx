/**
 * AI 结果对话框
 * 显示 AI 生成的内容并提供操作选项
 */

import { useState } from 'react';
import { Check, X, RotateCw, Edit, Loader2 } from 'lucide-react';

interface AIResultDialogProps {
  content: string;
  loading?: boolean;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
  onEdit?: () => void;
}

export default function AIResultDialog({
  content,
  loading = false,
  onAccept,
  onReject,
  onRegenerate,
  onEdit
}: AIResultDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xs">AI</span>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {loading ? 'AI 正在生成...' : 'AI 生成结果'}
            </h3>
          </div>
          <button
            onClick={onReject}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">AI 正在思考，请稍候...</p>
            </div>
          ) : (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
            />
          )}
        </div>

        {/* 底部操作 */}
        {!loading && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onReject}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
                拒绝
              </button>
              <button
                onClick={onRegenerate}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <RotateCw className="h-4 w-4" />
                重新生成
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  编辑
                </button>
              )}
            </div>
            <button
              onClick={onAccept}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="h-4 w-4" />
              接受并插入
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

