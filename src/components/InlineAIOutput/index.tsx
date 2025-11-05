/**
 * 内联 AI 输出组件
 * Notion 风格：直接在文档中显示 AI 生成内容
 */

import { Check, X, CornerDownLeft, RotateCcw } from 'lucide-react';

interface InlineAIOutputProps {
  content: string;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
  onReplace: () => void;
  onRetry: () => void;
}

export default function InlineAIOutput({
  content,
  loading,
  onAccept,
  onReject,
  onReplace,
  onRetry,
}: InlineAIOutputProps) {
  return (
    <div className="inline-ai-output my-4 border-l-4 border-purple-500 bg-purple-50/50 dark:bg-purple-900/10 rounded-r-lg">
      {/* AI 生成内容 */}
      <div className="px-4 py-3 min-h-[60px]">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500 border-t-transparent"></div>
            </div>
            <span className="text-sm">正在思考...</span>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        ) : (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>

      {/* 操作按钮 */}
      {!loading && content && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-900/50">
          <button
            onClick={onAccept}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-md transition-colors"
            title="接受并插入 (Enter)"
          >
            <Check className="h-3.5 w-3.5" />
            接受
          </button>
          
          <button
            onClick={onReplace}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            title="替换选中内容"
          >
            <CornerDownLeft className="h-3.5 w-3.5" />
            替换
          </button>
          
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-md transition-colors"
            title="重新生成"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重试
          </button>
          
          <button
            onClick={onReject}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md transition-colors"
            title="放弃 (Escape)"
          >
            <X className="h-3.5 w-3.5" />
            放弃
          </button>
        </div>
      )}
    </div>
  );
}

