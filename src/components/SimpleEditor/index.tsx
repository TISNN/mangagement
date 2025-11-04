/**
 * SimpleEditor 适配器
 * 包装 Tiptap Simple Editor，支持我们的 content 和 onChange API
 */

import { useEffect } from 'react';
import { SimpleEditor as TiptapSimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useEditor } from '@tiptap/react';

interface SimpleEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export default function SimpleEditor({
  content,
  onChange,
  placeholder = '开始编写...',
  readOnly = false,
  minHeight = '400px',
}: SimpleEditorProps) {
  // 由于 TiptapSimpleEditor 内部管理编辑器，我们需要创建一个包装器
  // 暂时使用原始的 Simple Editor，后续可以进一步定制
  
  return (
    <div style={{ minHeight }} className="simple-editor-wrapper">
      <TiptapSimpleEditor />
      <div className="text-xs text-gray-500 mt-2">
        ℹ️ 提示：Simple Editor 正在加载中，API 适配正在开发...
      </div>
    </div>
  );
}

