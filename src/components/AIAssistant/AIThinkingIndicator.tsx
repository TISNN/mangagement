/**
 * AI 思考中指示器（Notion 风格）
 * 显示在编辑器中的"正在思考..."状态
 */

import { Rabbit, Square } from 'lucide-react';

interface AIThinkingIndicatorProps {
  onCancel?: () => void;
}

export default function AIThinkingIndicator({ onCancel }: AIThinkingIndicatorProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 my-2">
      {/* AI 图标 */}
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <Rabbit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </div>

      {/* 思考文字 */}
      <span className="text-sm text-gray-600 dark:text-gray-400">正在思考</span>

      {/* 加载动画 */}
      <div className="flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* 取消按钮 */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="停止生成"
        >
          <Square className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400 fill-current" />
        </button>
      )}
    </div>
  );
}


