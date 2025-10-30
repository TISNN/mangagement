/**
 * NovelEditor 组件
 * 真正的 Novel 编辑器，提供类似 Notion 的编辑体验
 * 
 * 特性：
 * - ✨ 斜杠命令 (/) - 快速插入内容块
 * - 💬 气泡菜单 - 选中文字自动弹出工具栏
 * - 📝 Markdown 快捷输入 - 支持 # ## - [ ] 等
 * - 🎨 现代化 UI - 类似 Notion 的界面设计
 */

import { useState, useMemo } from 'react';
import { 
  EditorRoot, 
  EditorContent,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorBubble,
  EditorBubbleItem,
  type EditorInstance,
  StarterKit,
  TaskList,
  TaskItem,
  TiptapUnderline,
  TiptapLink,
  Placeholder as NovelPlaceholder,
  handleCommandNavigation,
  Command, // ⚡ 关键：触发斜杠命令的扩展
} from 'novel';
import { 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  MessageSquarePlus,
  Code,
  CheckSquare,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
} from 'lucide-react';
import './styles.css';

export interface NovelEditorProps {
  /** 初始内容(HTML格式) */
  content?: string;
  /** 内容变化回调 */
  onChange?: (content: string) => void;
  /** 占位符文本 */
  placeholder?: string;
  /** 是否可编辑 */
  editable?: boolean;
  /** 自定义样式类 */
  className?: string;
  /** 最小高度 */
  minHeight?: string;
}

/**
 * NovelEditor 富文本编辑器
 * 
 * 使用示例:
 * ```tsx
 * <NovelEditor
 *   content={content}
 *   onChange={setContent}
 *   placeholder="输入 '/' 查看命令..."
 * />
 * ```
 * 
 * 功能特性:
 * - 输入 / 调出命令菜单
 * - 选中文字显示气泡工具栏
 * - 支持 Markdown 快捷输入
 * - 完整的深色模式支持
 */
export default function NovelEditor({
  content = '',
  onChange,
  placeholder = "输入 '/' 查看命令...",
  editable = true,
  className = '',
  minHeight = '400px'
}: NovelEditorProps) {
  // 生成一个稳定的 key，避免不必要的重新挂载
  const [editorKey] = useState(() => Math.random().toString(36).substring(7));
  
  // 使用 useMemo 缓存初始内容，只在组件首次挂载时计算
  const initialContent = useMemo(() => {
    if (!content) return undefined;
    
    // 如果是空字符串，返回空的文档结构
    if (content.trim() === '' || content === '<p></p>') {
      return {
        type: 'doc',
        content: []
      };
    }

    // 如果有内容，返回带有 HTML 段落的结构
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content.replace(/<[^>]*>/g, '') // 简单地去除 HTML 标签
            }
          ]
        }
      ]
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空依赖数组，只在首次挂载时计算，这是有意为之的

  // 使用 useMemo 缓存扩展配置，避免每次渲染都重新创建
  const extensions = useMemo(() => [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
      bulletList: {
        HTMLAttributes: {
          class: 'list-disc list-outside leading-3 ml-4',
        },
      },
      orderedList: {
        HTMLAttributes: {
          class: 'list-decimal list-outside leading-3 ml-4',
        },
      },
      blockquote: {
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic',
        },
      },
      codeBlock: {
        HTMLAttributes: {
          class: 'bg-gray-100 dark:bg-gray-800 rounded-md p-4 font-mono text-sm',
        },
      },
    }),
    NovelPlaceholder.configure({
      placeholder,
      includeChildren: true,
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: 'not-prose',
      },
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: 'flex items-start gap-2',
      },
      nested: true,
    }),
    TiptapUnderline,
    TiptapLink.configure({
      HTMLAttributes: {
        class: 'text-blue-600 underline underline-offset-4 hover:text-blue-800',
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Command.configure({
      suggestion: {
        items: ({ query }: { query: string }) => {
          return [
            {
              title: '标题 1',
              searchTerms: ['heading1', 'h1', '标题1'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
              },
            },
            {
              title: '标题 2',
              searchTerms: ['heading2', 'h2', '标题2'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
              },
            },
            {
              title: '标题 3',
              searchTerms: ['heading3', 'h3', '标题3'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
              },
            },
            {
              title: '无序列表',
              searchTerms: ['bulletlist', 'ul', '列表'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
              },
            },
            {
              title: '有序列表',
              searchTerms: ['orderedlist', 'ol', '编号'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
              },
            },
            {
              title: '任务列表',
              searchTerms: ['tasklist', 'todo', '任务', '待办'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
              },
            },
            {
              title: '引用',
              searchTerms: ['blockquote', 'quote', '引用'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).toggleBlockquote().run();
              },
            },
            {
              title: '代码块',
              searchTerms: ['codeblock', 'code', '代码'],
              command: ({ editor, range }: { editor: any; range: any }) => {
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
              },
            },
          ].filter(item => {
            if (!query) return true;
            const searchText = query.toLowerCase();
            return item.title.toLowerCase().includes(searchText) ||
                   item.searchTerms.some(term => term.toLowerCase().includes(searchText));
          });
        },
      },
    }),
  ], [placeholder]); // 只在 placeholder 变化时重新创建

  return (
    <div 
      className={`novel-editor-wrapper ${className}`}
      style={{ minHeight }}
    >
      <EditorRoot key={editorKey}>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          onUpdate={({ editor }: { editor: EditorInstance }) => {
            if (onChange) {
              const html = editor.getHTML();
              onChange(html);
            }
          }}
          editable={editable}
          className="novel-editor-content"
          editorProps={{
            attributes: {
              class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-full p-4',
            },
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
          }}
        >
          {/* 斜杠命令菜单 */}
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-gray-500 dark:text-gray-400">
              没有找到结果
            </EditorCommandEmpty>
            
            {/* 标题命令 */}
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 1 })
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <Heading1 className="h-4 w-4" />
              <span>标题 1</span>
            </EditorCommandItem>
            
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 2 })
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <Heading2 className="h-4 w-4" />
              <span>标题 2</span>
            </EditorCommandItem>
            
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .setNode('heading', { level: 3 })
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <Heading3 className="h-4 w-4" />
              <span>标题 3</span>
            </EditorCommandItem>
            
            {/* 列表命令 */}
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBulletList()
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <List className="h-4 w-4" />
              <span>无序列表</span>
            </EditorCommandItem>
            
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleOrderedList()
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <ListOrdered className="h-4 w-4" />
              <span>有序列表</span>
            </EditorCommandItem>
            
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleTaskList()
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <CheckSquare className="h-4 w-4" />
              <span>任务列表</span>
            </EditorCommandItem>
            
            {/* 其他命令 */}
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleBlockquote()
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <MessageSquarePlus className="h-4 w-4" />
              <span>引用</span>
            </EditorCommandItem>
            
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor
                  .chain()
                  .focus()
                  .deleteRange(range)
                  .toggleCodeBlock()
                  .run();
              }}
              className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-700"
            >
              <Code className="h-4 w-4" />
              <span>代码块</span>
            </EditorCommandItem>
          </EditorCommand>

          {/* 气泡菜单 */}
          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl"
          >
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleBold().run();
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Bold className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleItalic().run();
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Italic className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleUnderline().run();
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <UnderlineIcon className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleStrike().run();
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Strikethrough className="h-4 w-4" />
            </EditorBubbleItem>
            <EditorBubbleItem
              onSelect={(editor) => {
                editor.chain().focus().toggleCode().run();
              }}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Code className="h-4 w-4" />
            </EditorBubbleItem>
          </EditorBubble>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}

