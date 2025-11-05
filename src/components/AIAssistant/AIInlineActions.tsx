/**
 * AI 内联操作按钮（Notion 风格）
 * 显示在 AI 生成内容下方的操作按钮
 */

import { Check, X, CornerDownLeft, RotateCw } from 'lucide-react';

interface AIInlineActionsProps {
  onAccept: () => void;
  onDiscard: () => void;
  onInsertBelow: () => void;
  onRetry: () => void;
}

export default function AIInlineActions({
  onAccept,
  onDiscard,
  onInsertBelow,
  onRetry,
}: AIInlineActionsProps) {
  return (
    <div className="flex items-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm my-2">
      {/* 接受按钮 */}
      <button
        onClick={onAccept}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
      >
        <Check className="h-3.5 w-3.5" />
        接受
      </button>

      {/* 放弃按钮 */}
      <button
        onClick={onDiscard}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
        放弃
        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">Esc</span>
      </button>

      {/* 插入到下方按钮 */}
      <button
        onClick={onInsertBelow}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <CornerDownLeft className="h-3.5 w-3.5" />
        插入
      </button>

      {/* 重试按钮 */}
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <RotateCw className="h-3.5 w-3.5" />
        再试一次
      </button>
    </div>
  );
}


