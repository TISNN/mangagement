/**
 * AI 生成面板（Notion 风格）
 * 在编辑器中显示思考过程、生成内容和操作按钮
 */

import { useState } from 'react';
import { Rabbit, Square, Check, X, CornerDownLeft, RotateCw } from 'lucide-react';

interface AIGenerationPanelProps {
  isThinking: boolean;
  generatedText: string;
  position: { top: number; left: number };
  onCancel: () => void;
  onAccept: () => void;
  onDiscard: () => void;
  onInsertBelow: () => void;
  onRetry: () => void;
}

export default function AIGenerationPanel({
  isThinking,
  generatedText,
  position,
  onCancel,
  onAccept,
  onDiscard,
  onInsertBelow,
  onRetry,
}: AIGenerationPanelProps) {
  const showActions = !isThinking && generatedText;

  return (
    <div
      className="absolute z-[9998] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl max-w-3xl"
      style={{ 
        top: `${position.top + 30}px`, 
        left: `${Math.max(20, position.left - 200)}px`,
      }}
    >
      {/* 思考指示器 */}
      {isThinking && (
        <div className="flex items-center gap-3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Rabbit className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">正在思考</span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="停止生成"
          >
            <Square className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400 fill-current" />
          </button>
        </div>
      )}

      {/* 生成内容 */}
      {generatedText && (
        <div className="p-4 max-h-96 overflow-y-auto">
          <div 
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: generatedText
                .split('\n\n')
                .map(para => `<p>${para.trim().replace(/\n/g, '<br/>')}</p>`)
                .join('') 
            }}
          />
        </div>
      )}

      {/* 操作按钮 */}
      {showActions && (
        <div className="flex items-center gap-1.5 p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onAccept}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Check className="h-3 w-3" />
            接受
          </button>
          <button
            onClick={onDiscard}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X className="h-3 w-3" />
            放弃
            <span className="ml-0.5 text-[10px] text-gray-500 dark:text-gray-400">Esc</span>
          </button>
          <button
            onClick={onInsertBelow}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <CornerDownLeft className="h-3 w-3" />
            插入
          </button>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCw className="h-3 w-3" />
            再试一次
          </button>
        </div>
      )}
    </div>
  );
}


