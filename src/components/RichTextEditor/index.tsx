/**
 * Tiptap 富文本编辑器组件（优化版）
 * 参考 Simple Editor 设计，添加更多功能
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { 
  Bold, 
  Italic, 
  Strikethrough,
  Code,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List, 
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Highlighter,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import './styles.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = '开始编写...',
  readOnly = false,
  minHeight = '200px'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({ 
        placeholder 
      }),
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-700',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'task-list',
        },
      }),
      TaskItem.configure({ 
        nested: true,
        HTMLAttributes: {
          class: 'task-item',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // 添加链接
  const setLink = () => {
    const url = window.prompt('输入链接URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  // 添加图片
  const addImage = () => {
    const url = window.prompt('输入图片URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // 插入表格
  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="rich-text-editor border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* 工具栏 */}
      {!readOnly && (
        <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
          {/* 撤销/重做 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="toolbar-btn"
              title="撤销 (Ctrl+Z)"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="toolbar-btn"
              title="重做 (Ctrl+Shift+Z)"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>

          {/* 文本样式 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`toolbar-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
              title="粗体 (Ctrl+B)"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`toolbar-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
              title="斜体 (Ctrl+I)"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`toolbar-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
              title="下划线 (Ctrl+U)"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`toolbar-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
              title="删除线"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`toolbar-btn ${editor.isActive('code') ? 'is-active' : ''}`}
              title="行内代码"
            >
              <Code className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`toolbar-btn ${editor.isActive('highlight') ? 'is-active' : ''}`}
              title="高亮"
            >
              <Highlighter className="h-4 w-4" />
            </button>
          </div>

          {/* 标题 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`toolbar-btn ${editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}`}
              title="标题1"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`toolbar-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
              title="标题2"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`toolbar-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
              title="标题3"
            >
              <Heading3 className="h-4 w-4" />
            </button>
          </div>

          {/* 对齐 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
              title="左对齐"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
              title="居中对齐"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
              title="右对齐"
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`toolbar-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
              title="两端对齐"
            >
              <AlignJustify className="h-4 w-4" />
            </button>
          </div>

          {/* 列表 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`toolbar-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
              title="无序列表"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`toolbar-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
              title="有序列表"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`toolbar-btn ${editor.isActive('taskList') ? 'is-active' : ''}`}
              title="任务列表"
            >
              <CheckSquare className="h-4 w-4" />
            </button>
          </div>

          {/* 引用和代码块 */}
          <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`toolbar-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
              title="引用"
            >
              <Quote className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`toolbar-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
              title="代码块"
            >
              <Code className="h-4 w-4" />
            </button>
          </div>

          {/* 链接、图片、表格 */}
          <div className="flex gap-1">
            <button
              onClick={setLink}
              className={`toolbar-btn ${editor.isActive('link') ? 'is-active' : ''}`}
              title="插入链接"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={addImage}
              className="toolbar-btn"
              title="插入图片"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              onClick={insertTable}
              className={`toolbar-btn ${editor.isActive('table') ? 'is-active' : ''}`}
              title="插入表格"
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 编辑器内容 */}
      <EditorContent 
        editor={editor} 
        className="editor-content"
        style={{ minHeight }}
      />
    </div>
  );
}
